import {emitError} from './utils.js'
import {config} from '../config.js'
import knex from '../knex/knex.js'

export const requireAuthAndGameId = async (socket, next) => {
  let playerId = socket.request.session.playerId

  if (config.testingSessions) {
    playerId = socket.handshake.query.playerId
  }

  if (!playerId) {
    emitError(socket)
    return
  }

  const player = await knex('players')
    .select('id', 'login')
    .where({
      id: playerId,
    })
    .first()

  const gameId = socket.handshake.query.gameId

  const game = await knex('games')
    .select('*')
    .where({
      id: gameId,
    })
    .first()

  socket.game = game
  socket.player = player

  next()
}
