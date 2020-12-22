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
    action: 'vote',
  }

  const updatedSecretConf = {
    votes: {
      [playerId]: data.vote,
    },
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

  const alivePlayersIdsCount = parseInt(
    (
      await knex('player_to_game')
        .where({game_id: gameId, killed: false})
        .count()
        .first()
    ).count
  )

  const voted = [...conf.voted, playerId]
  const votedAll = voted.length === alivePlayersIdsCount

  const updatedConf = {
    ...conf,
    action: votedAll ? 'president-turn' : 'vote',
    voted,
  }

  const updatedSecretConf = {
    ...secret_conf,
    votes: {
      ...secret_conf.voting,
      [playerId]: data.vote,
    },
  }

  await knex('games')
    .where({id: gameId})
    .update({conf: updatedConf, secret_conf: updatedSecretConf})

  const gameData = await getGameData(gameId, playerId)

  votedAll
    ? ioServer.in(gameId).emit('game-data', gameData)
    : socket.emit('game-data', gameData)
}
