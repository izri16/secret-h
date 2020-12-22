import _ from 'lodash'

import {ioServer} from '../server.js'
import knex from '../knex/knex.js'
import {emitError, getGameData} from './utils.js'
import {assignRaces} from '../utils.js'
import {chooseChancellor, vote} from './roundActions.js'

const alreadyJoined = async (playerId, gameId) => {
  return !!(await knex('player_to_game')
    .where({game_id: gameId, player_id: playerId})
    .first())
}

const joinGame = async (socket) => {
  const {playerId, gameId} = socket

  const registeredPlayers = await knex('player_to_game').where({
    game_id: gameId,
  })
  const gamePlayersCount = (
    await knex('games').first('number_of_players').where({id: gameId})
  ).number_of_players

  if (gamePlayersCount === undefined) {
    throw new Error('Game does not exist')
  }

  // the game is already full
  if (registeredPlayers.length === gamePlayersCount) {
    throw new Error('Game is full')
  }

  // add player to game
  await knex('player_to_game').insert({
    player_id: playerId,
    game_id: gameId,
  })

  socket.to(gameId).emit('other-player-joined', {
    gameId,
    playerId,
  })

  // all players registered, set random players order
  if (registeredPlayers.length === gamePlayersCount - 1) {
    const orders = _.shuffle(_.range(1, gamePlayersCount + 1))
    const records = await knex('player_to_game')
      .select('*')
      .where({game_id: gameId})
    const recordsWithRaces = assignRaces(records)

    recordsWithRaces.forEach(async (r, index) => {
      await knex('player_to_game')
        .where({player_id: r.player_id, game_id: r.game_id})
        .update({order: orders[index], race: r.race})
    })

    // mark game as ready
    await knex('games')
      .where({id: gameId})
      .update({
        active: true,
        conf: {
          action: 'chooseChancellor',
          president: recordsWithRaces[0].id,
          chancellor: null,
          prevPresident: null,
          prevChancellor: null,
          drawPileCount: 17,
          discardPileCount: 0,
          liberalLawsCount: 0,
          fascistLawsCount: 0,
          voted: [],
          votes: {},
          failedElectionsCount: 0,
        },
        secret_confg: {
          votes: {},
        },
      })
  }
}

const registerListeners = (socket) => {
  socket.on('chooseChancellor', chooseChancellor(socket))
  socket.on('vote', vote(socket))
}

export const init = async (socket) => {
  const {playerId, gameId} = socket

  const joined = await alreadyJoined(playerId, gameId)

  // player is already registered in the game
  if (joined) {
    socket.join(socket.gameId)
    registerListeners(socket)

    const gameData = await getGameData(gameId, playerId)
    socket.emit('game-data', gameData)
    return
  }

  // player not yet registered in the game
  try {
    await joinGame(socket)
    socket.join(socket.gameId)
    registerListeners(socket)

    const gameData = await getGameData(gameId, playerId)
    // send to all including sender
    ioServer.in(gameId).emit('game-data', gameData)
  } catch (err) {
    emitError(socket)
  }
}
