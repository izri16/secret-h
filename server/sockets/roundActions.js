import {ioServer} from '../server.js'
import knex from '../knex/knex.js'
import {emitError, getGameData} from './utils.js'

// TODO: check that player is in game
// TODO: check that game is active
// TODO: check that player is president
export const chooseChancellor = (socket) => async () => {
  const {playerId, gameId} = socket

  const game = await knex('games').where({id: gameId}).select('conf')

  console.log('game', game)

  try {
    const gameData = await getGameData(gameId, playerId)
    // send to all including sender
    ioServer.in(gameId).emit('game-data', gameData)
  } catch (err) {
    emitError(socket)
  }
}
