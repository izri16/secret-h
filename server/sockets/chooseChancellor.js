import {ioServer} from '../server.js'
import knex from '../knex/knex.js'
import {getAlivePlayers} from './utils.js'
import {getGame, emitSocketError} from '../utils.js'

const isValidChancellor = async (game, playerId) => {
  const alivePlayers = getAlivePlayers(game.players)

  if (!alivePlayers[playerId]) {
    return false
  }

  if (playerId === game.conf.prevChancellor && !game.conf.allSelectable) {
    return false
  }

  if (playerId === game.conf.president && !game.conf.allSelectable) {
    return false
  }

  if (
    Object.keys(alivePlayers).length > 5 &&
    playerId === game.conf.prevPresident &&
    !game.conf.allSelectable
  ) {
    return false
  }
  return true
}

export const chooseChancellor = (socket) => async (data) => {
  socket.log.info('Choose chancellor', data)
  const {gameId} = socket
  const game = await getGame(gameId)

  if (!game.active || game.conf.action !== 'choose-chancellor') {
    emitSocketError(socket)
    return
  }

  const valid = await isValidChancellor(game, data.id)

  if (!valid) {
    emitSocketError(socket)
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
  ioServer.in(game.id).emit('fetch-data')
}
