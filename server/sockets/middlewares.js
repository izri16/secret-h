import {emitError} from './utils.js'
import {config} from '../config.js'

export const requireAuthAndGameId = async (socket, next) => {
  let playerId = socket.request.session.playerId

  if (config.testingSessions) {
    playerId = socket.handshake.query.playerId
  }

  if (!playerId) {
    emitError(socket)
    return
  }

  const gameId = socket.handshake.query.gameId
  socket.gameId = gameId
  socket.playerId = playerId

  next()
}
