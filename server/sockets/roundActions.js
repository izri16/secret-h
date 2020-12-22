import _ from 'lodash'

import {ioServer} from '../server.js'
import knex from '../knex/knex.js'
import {emitError, getGameData} from './utils.js'
import {getAlivePlayers} from '../utils.js'

const isValidChancellor = async (game, playerId) => {
  const alivePlayers = getAlivePlayers(game.players)

  if (!alivePlayers[playerId]) {
    return false
  }

  if (playerId === game.conf.prevChancellor) {
    return false
  }

  if (playerId === game.conf.president) {
    return false
  }

  if (
    Object.keys(alivePlayers).length > 5 &&
    playerId === game.conf.prevPresident
  ) {
    return false
  }
  return true
}

export const chooseChancellor = (socket) => async (data) => {
  const {playerId, game} = socket

  if (!game.active || game.conf.action !== 'chooseChancellor') {
    emitError(socket)
    return
  }

  const valid = await isValidChancellor(game, data.id)

  if (!valid) {
    emitError(socket)
    return
  }

  const updatedConf = {
    ...game.conf,
    chancellor: data.id,
    voted: [],
    votes: {},
    action: 'vote',
  }

  const updatedSecretConf = {
    votes: {},
  }

  await knex('games')
    .where({id: game.id})
    .update({conf: updatedConf, secret_conf: updatedSecretConf})

  const gameData = await getGameData(game.id, playerId)
  ioServer.in(game.id).emit('game-data', gameData)
}

const canVote = async (game, playerId) => {
  const alivePlayers = getAlivePlayers(game.players)

  if (!alivePlayers[playerId]) {
    return false
  }

  if (game.conf.voted.includes(playerId)) {
    return false
  }

  return true
}

export const vote = (socket) => async (data) => {
  const {playerId, game} = socket

  if (!game.active || game.conf.action !== 'vote') {
    emitError(socket)
    return
  }

  const valid = await canVote(game, playerId)

  if (!valid) {
    emitError(socket)
    return
  }

  const alivePlayers = getAlivePlayers(game.players)
  const alivePlayersCount = Object.keys(alivePlayers).length

  const voted = [...game.conf.voted, playerId]
  const votedAll = voted.length === alivePlayersCount

  const updatedSecretConf = {
    ...game.secret_conf,
    votes: {
      ...game.secret_conf.votes,
      [playerId]: data.vote,
    },
  }

  const skipped =
    votedAll &&
    Object.values(game.secret_conf.votes).filter((v) => v).length * 2 <=
      alivePlayersCount

  const currentPlayerIndex = alivePlayers.findIndex(
    (p) => p.player_id === playerId
  )

  const sortedAlivePlayers = _.orderBy(
    Object.values(alivePlayers),
    (p) => p.order
  )
  const nextPresident =
    currentPlayerIndex < alivePlayers.length - 1
      ? sortedAlivePlayers[currentPlayerIndex + 1]
      : sortedAlivePlayers[0]

  const updatedConf = {
    ...game.conf,
    action: votedAll ? (skipped ? 'vote' : 'president-turn') : 'vote',
    voted,
    votes: updatedSecretConf.votes,
    failedElectionsCount: game.conf.failedElectionsCount + (skipped ? 1 : 0),
    president: skipped ? nextPresident.id : game.conf.president,
    chancellor: skipped ? null : game.conf.chancellor,
  }

  if (updatedConf.failedElectionsCount === 3) {
    throw new Error('TODO: handle 3 failed elections ...')
  }

  await knex('games')
    .where({id: game.id})
    .update({conf: updatedConf, secret_conf: updatedSecretConf})

  const gameData = await getGameData(game.id, playerId)

  votedAll
    ? ioServer.in(game.id).emit('game-data', gameData)
    : socket.emit('game-data', gameData)
}
