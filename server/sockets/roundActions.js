import {ioServer} from '../server.js'
import knex from '../knex/knex.js'
import {emitError, getGameData} from './utils.js'

const isValidChancellor = async (gameId, playerId) => {
  const gameConf = (
    await knex('games').where({id: gameId, active: true}).select('conf').first()
  ).conf

  const alivePlayersIds = await knex('player_to_game')
    .where({game_id: gameId, killed: false})
    .select('player_id')

  if (!alivePlayersIds.find((p) => p.player_id === playerId)) {
    return false
  }

  if (playerId === gameConf.prevChancellor) {
    return false
  }

  if (playerId === gameConf.president) {
    return false
  }

  if (alivePlayersIds.length > 5 && playerId === gameConf.prevPresident) {
    return false
  }
  return true
}

export const chooseChancellor = (socket) => async (data) => {
  const {playerId, gameId} = socket

  const gameConf = (
    await knex('games').where({id: gameId}).select('conf').first()
  ).conf

  if (gameConf.action !== 'chooseChancellor') {
    emitError(socket)
    return
  }

  const valid = await isValidChancellor(gameId, data.id)

  if (!valid) {
    emitError(socket)
    return
  }

  const updatedConf = {
    ...gameConf,
    chancellor: data.id,
    voted: [],
    votes: {},
    action: 'vote',
  }

  const updatedSecretConf = {
    votes: {},
  }

  await knex('games')
    .where({id: gameId})
    .update({conf: updatedConf, secret_conf: updatedSecretConf})

  const gameData = await getGameData(gameId, playerId)
  ioServer.in(gameId).emit('game-data', gameData)
}

const canVote = async (gameId, playerId) => {
  const gameConf = (
    await knex('games').where({id: gameId, active: true}).select('conf').first()
  ).conf

  const alivePlayersIds = await knex('player_to_game')
    .where({game_id: gameId, killed: false})
    .select('player_id')

  if (!alivePlayersIds.find((p) => p.player_id === playerId)) {
    return false
  }

  if (gameConf.voted.includes(playerId)) {
    return false
  }

  return true
}

export const vote = (socket) => async (data) => {
  const {playerId, gameId} = socket

  const {conf, secret_conf} = await knex('games')
    .where({id: gameId})
    .select('conf', 'secret_conf')
    .first()

  if (conf.action !== 'vote') {
    emitError(socket)
    return
  }

  const valid = await canVote(gameId, playerId)

  if (!valid) {
    emitError(socket)
    return
  }

  const alivePlayers = await knex('player_to_game')
    .where({game_id: gameId, killed: false})
    .select('player_id', 'order')
    .orderBy('order')

  const alivePlayersCount = alivePlayers.length

  const voted = [...conf.voted, playerId]
  const votedAll = voted.length === alivePlayersCount

  const updatedSecretConf = {
    ...secret_conf,
    votes: {
      ...secret_conf.votes,
      [playerId]: data.vote,
    },
  }

  const skipped =
    votedAll &&
    Object.values(secret_conf.votes).filter((v) => v).length * 2 <=
      alivePlayersCount

  const currentPlayerIndex = alivePlayers.findIndex(
    (p) => p.player_id === playerId
  )
  const nextPresident =
    currentPlayerIndex < alivePlayers.length - 1
      ? alivePlayers[currentPlayerIndex + 1]
      : alivePlayers[0]

  const updatedConf = {
    ...conf,
    action: votedAll ? (skipped ? 'vote' : 'president-turn') : 'vote',
    voted,
    votes: updatedSecretConf.votes,
    failedElectionsCount: conf.failedElectionsCount + (skipped ? 1 : 0),
    president: skipped ? nextPresident.id : conf.president,
    chancellor: skipped ? null : conf.chancellor,
  }

  if (updatedConf.failedElectionsCount === 3) {
    throw new Error('TODO: handle 3 failed elections ...')
  }

  await knex('games')
    .where({id: gameId})
    .update({conf: updatedConf, secret_conf: updatedSecretConf})

  const gameData = await getGameData(gameId, playerId)

  votedAll
    ? ioServer.in(gameId).emit('game-data', gameData)
    : socket.emit('game-data', gameData)
}
