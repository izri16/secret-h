import {ioServer} from '../../server.js'
import knex from '../../knex/knex.js'
import {getGame, emitSocketError} from '../../utils.js'
import {handleGovernmentChange} from '../utils.js'

export const choosePresident = (socket) => async (data) => {
  socket.log.info('Choosing next president', data.id)
  const {gameId, playerId} = socket

  const game = await getGame(gameId)

  if (
    !game.active ||
    game.conf.action !== 'choose-president' ||
    playerId !== game.conf.president
  ) {
    emitSocketError(socket)
    return
  }

  const updatedGame = handleGovernmentChange(game, data.id)
  await knex('games').where({id: game.id}).update(updatedGame)

  ioServer.in(game.id).emit('fetch-data')
}
