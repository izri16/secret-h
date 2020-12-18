import {emitError} from './utils.js'

export const requireAuthAndGameId = async (socket, next) => {
  const playerId = socket.request.session.playerId
  
  if (playerId === undefined) {
    emitError(socket)
    return
  }

  const gameId = socket.handshake.query.gameId
  socket.gameId = gameId
  socket.playerId = playerId

  next()
}
