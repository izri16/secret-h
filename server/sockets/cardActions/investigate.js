import {ioServer} from '../../server.js'
import knex from '../../knex/knex.js'
import {getGame, emitSocketError} from '../../utils.js'
import {handleGovernmentChange} from '../utils.js'

export const investigateFinished = (socket) => async () => {
  socket.log.info('Investigation finished')
  const {gameId, playerId} = socket

  const game = await getGame(gameId)

  if (
    !game.active ||
    game.conf.action !== 'investigate' ||
    playerId !== game.conf.president
  ) {
    emitSocketError(socket)
    return
  }

  const updatedGame = handleGovernmentChange(game)
  await knex('games').where({id: game.id}).update(updatedGame)

  ioServer.in(game.id).emit('fetch-data')
}

export const investigate = (socket) => async (data) => {
  socket.log.info('Investigating player', data.id)
  const {gameId, playerId} = socket

  const game = await getGame(gameId)

  if (
    !game.active ||
    game.conf.action !== 'investigate' ||
    playerId !== game.conf.president
  ) {
    emitSocketError(socket)
    return
  }

  const investigatedPlayerRace =
    game.players[data.id].race === 'hitler'
      ? 'fascist'
      : game.players[data.id].race

  const updatedGame = {
    ...game,
    secret_conf: {
      ...game.secret_conf,
      investigateInfo: {
        id: data.id,
        race: investigatedPlayerRace,
      },
    },
  }
  await knex('games').where({id: game.id}).update(updatedGame)

  ioServer.in(game.id).emit('fetch-data')
}
