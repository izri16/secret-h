import {ioServer} from '../server.js'
import knex from '../knex/knex.js'
import {emitError, getGameData} from './utils.js'
import {getAlivePlayers, getGame} from '../utils.js'

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
  const {playerId, gameId} = socket

  const game = await getGame(gameId)

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
    ...game.secret_conf,
    votes: {},
  }

  await knex('games')
    .where({id: game.id})
    .update({conf: updatedConf, secret_conf: updatedSecretConf})

  const gameData = await getGameData(game.id, playerId)
  ioServer.in(game.id).emit('game-data', gameData)
}
