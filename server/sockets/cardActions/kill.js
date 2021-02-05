import _ from 'lodash'
import {ioServer} from '../../server.js'
import knex from '../../knex/knex.js'
import {getGame, emitSocketError} from '../../utils.js'
import {handleGovernmentChange, handleGameOver} from '../utils.js'

export const killTransformer = (game, data) => {
  const updatedPlayers = _.mapValues(game.players, (p) =>
    p.id === data.id ? {...p, killed: true} : p
  )

  const updatedConf = handleGameOver(game.conf, updatedPlayers)

  const transformer =
    updatedConf.action !== 'results' ? handleGovernmentChange : (i) => i

  return transformer({
    ...game,
    conf: updatedConf,
    players: updatedPlayers,
  })
}

export const kill = (socket) => async (data) => {
  socket.log.info('Killing player', data)
  const {gameId, playerId} = socket

  const game = await getGame(gameId)

  if (
    !game.active ||
    game.conf.action !== 'kill' ||
    playerId !== game.conf.president
  ) {
    emitSocketError(socket)
    return
  }

  const updatedGame = killTransformer(game, data)
  await knex('games').where({id: game.id}).update(updatedGame)

  ioServer.in(game.id).emit('fetch-data')
}
