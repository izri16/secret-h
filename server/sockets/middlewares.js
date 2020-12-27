import {emitSocketError} from '../utils.js'
import {config} from '../config.js'
import {createSocketLogger} from '../logger.js'

export const requireAuthAndGameId = async (socket, next) => {
  let playerId = socket.request.session.playerId

  if (config.testingSessions) {
    playerId = socket.handshake.query.playerId
  }

  if (!playerId) {
    emitSocketError(socket)
    return
  }

  const gameId = socket.handshake.query.gameId

  socket.gameId = gameId
  socket.playerId = playerId
  socket.log = createSocketLogger(gameId, playerId)

  next()
}
