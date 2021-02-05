import {ioServer} from '../server.js'
import knex from '../knex/knex.js'
import {
  assignRacesAndOrder,
  getInitialGameConf,
  generateLaws,
  getGame,
  getPlayer,
  emitSocketError,
} from '../utils.js'
import {chooseChancellor} from './chooseChancellor.js'
import {vote, voteAdmin} from './vote.js'
import {getData} from './getData.js'
import {
  presidentTurn,
  presidentTurnVeto,
  chancellorTurn,
  chancellorTurnVeto,
} from './chooseLaw.js'
import {examineFinished} from './cardActions/examine.js'
import {kill} from './cardActions/kill.js'
import {investigate, investigateFinished} from './cardActions/investigate.js'
import {choosePresident} from './cardActions/choosePresident.js'

const joinGame = async (game, player) => {
  if (Object.keys(game.players).length === game.number_of_players) {
    throw new Error('Game is full')
  }

  // add player to game
  game = (
    await knex('games')
      .update({
        players: {...game.players, [player.id]: {killed: false, ...player}},
      })
      .where({id: game.id})
      .returning('*')
  )[0]

  // all players registered, set random players order
  if (Object.keys(game.players).length === game.number_of_players) {
    const playersWithRacesAndOrder = assignRacesAndOrder(game.players)

    // mark game as ready
    await knex('games')
      .where({id: game.id})
      .update({
        active: true,
        conf: getInitialGameConf(playersWithRacesAndOrder),
        secret_conf: {
          votes: {},
          remainingLaws: generateLaws(),
          discartedLaws: [],
        },
        players: playersWithRacesAndOrder,
      })
  }
}

const registerListeners = (socket) => {
  // base actions
  socket.on('choose-chancellor', chooseChancellor(socket))
  socket.on('vote', vote(socket))
  socket.on('voteAdmin', voteAdmin(socket))
  socket.on('getData', getData(socket))
  socket.on('presidentTurn', presidentTurn(socket))
  socket.on('presidentTurnVeto', presidentTurnVeto(socket))
  socket.on('chancellorTurn', chancellorTurn(socket))
  socket.on('chancellorTurnVeto', chancellorTurnVeto(socket))

  // card actions
  socket.on('examine-finished', examineFinished(socket))
  socket.on('kill', kill(socket))
  socket.on('investigate', investigate(socket))
  socket.on('investigate-finished', investigateFinished(socket))
  socket.on('choose-president', choosePresident(socket))
}

export const init = async (socket) => {
  const {playerId, gameId} = socket
  const game = await getGame(gameId)
  const player = await getPlayer(playerId)

  if (!game) {
    emitSocketError(socket)
    return
  }

  socket.log.verbose('Init game')

  const joined = game.players[player.id]

  // player is already registered in the game
  if (joined) {
    socket.join(game.id)
    registerListeners(socket)

    socket.log.verbose(`Already joined`)
    socket.emit('fetch-data')
    return
  }

  // player not yet registered in the game
  try {
    await joinGame(game, player)
    socket.join(game.id)
    registerListeners(socket)

    socket.log.verbose(`Joined`)
    ioServer.in(game.id).emit('fetch-data')
  } catch (err) {
    socket.log.error(err)
    emitSocketError(socket)
  }
}
