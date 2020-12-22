import {ioServer} from '../server.js'
import knex from '../knex/knex.js'
import {emitError, getGameData} from './utils.js'
import {assignRacesAndOrder, getInitialGameConf} from '../utils.js'
import {chooseChancellor, vote} from './roundActions.js'
import {log} from '../logger.js'

const joinGame = async (game, player) => {
  if (game.players.length === game.number_of_players) {
    throw new Error('Game is full')
  }

  console.log('WAS THERe...')

  // add player to game
  game = await knex('games')
    .update({
      players: {...game.players, [player.id]: {killed: false, ...player}},
    })
    .returning('*')

  // all players registered, set random players order
  if (game.players.length === game.number_of_players) {
    const playersWithRacesAndOrder = assignRacesAndOrder(game.players)

    // mark game as ready
    await knex('games')
      .where({id: game.id})
      .update({
        active: true,
        conf: getInitialGameConf(playersWithRacesAndOrder),
        secret_confg: {
          votes: {},
        },
        players: playersWithRacesAndOrder,
      })
  }
}

const registerListeners = (socket) => {
  socket.on('chooseChancellor', chooseChancellor(socket))
  socket.on('vote', vote(socket))
}

export const init = async (socket) => {
  const {player, game} = socket

  if (!game) {
    emitError(socket)
    return
  }

  log.info(`Init socket for game:${game.id}, player:${player.id}`)

  const joined = game.players[player.id]

  // player is already registered in the game
  if (joined) {
    socket.join(game.id)
    registerListeners(socket)

    const gameData = await getGameData(game.id, player.id)
    log.info(`player:${player.id} already joined game:${game.id}`)
    socket.emit('game-data', gameData)
    return
  }

  // player not yet registered in the game
  try {
    await joinGame(game, player.id)
    socket.join(game.id)
    registerListeners(socket)

    const gameData = await getGameData(game.id, player.id)
    log.info(`player:${player.id} newly joined game:${game.id}`)
    ioServer.in(game.id).emit('game-data', gameData)
  } catch (err) {
    emitError(socket)
  }
}
