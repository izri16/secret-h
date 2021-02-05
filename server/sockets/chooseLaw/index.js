import {ioServer} from '../../server.js'
import knex from '../../knex/knex.js'
import {getGame, emitSocketError} from '../../utils.js'
import {
  chancellorTurnTransformer,
  presidentTurnTransformer,
  presidentTurnVetoTransformer,
} from './transformers.js'

export const chancellorTurnVeto = (socket) => async () => {
  socket.log.info('Chancellor turn veto')
  const {gameId, playerId} = socket
  const game = await getGame(gameId)

  if (
    !game.active ||
    game.conf.action !== 'chancellor-turn-veto' ||
    playerId !== game.conf.chancellor
  ) {
    emitSocketError(socket)
    return
  }

  await knex('games')
    .where({id: game.id})
    .update({
      ...game,
      conf: {
        ...game.conf,
        action: 'president-turn-veto',
      },
    })
  ioServer.in(game.id).emit('fetch-data')
}

export const chancellorTurn = (socket) => async (data) => {
  socket.log.info('Chancellor turn', data)
  const {gameId, playerId} = socket
  const game = await getGame(gameId)

  if (
    !game.active ||
    !['chancellor-turn', 'chancellor-turn-veto'].includes(game.conf.action) ||
    playerId !== game.conf.chancellor
  ) {
    emitSocketError(socket)
    return
  }

  const updatedGame = chancellorTurnTransformer(game, data)
  await knex('games').where({id: game.id}).update(updatedGame)
  ioServer.in(game.id).emit('fetch-data')
}

export const presidentTurnVeto = (socket) => async (data) => {
  socket.log.info('President turn veto', data)
  const {gameId, playerId} = socket
  const game = await getGame(gameId)

  if (
    !game.active ||
    game.conf.action !== 'president-turn-veto' ||
    playerId !== game.conf.president
  ) {
    emitSocketError(socket)
    return
  }

  const updatedGame = presidentTurnVetoTransformer(game, data)
  await knex('games').where({id: game.id}).update(updatedGame)
  ioServer.in(game.id).emit('fetch-data')
}

export const presidentTurn = (socket) => async (data) => {
  socket.log.info('President turn', data)
  const {gameId, playerId} = socket
  const game = await getGame(gameId, data)

  if (
    !game.active ||
    game.conf.action !== 'president-turn' ||
    playerId !== game.conf.president
  ) {
    emitSocketError(socket)
    return
  }

  const updatedGame = presidentTurnTransformer(game, data)
  await knex('games').where({id: game.id}).update(updatedGame)
  ioServer.in(game.id).emit('fetch-data')
}
