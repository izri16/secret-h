import _ from 'lodash'
import knex from '../knex/knex.js'

export const emitError = (socket) => {
  socket.emit('socket-error', '')
}

export const getGameData = async (gameId, playerId) => {
  const gameInfo = await knex('games')
    .select('id', 'number_of_players', 'active', 'conf', 'players')
    .where({id: gameId})
    .first()

  const playerRace = gameInfo.players[playerId].race
  let playersInfo = gameInfo.players

  if (playerRace === 'liberal' || playerRace === 'hitler') {
    playersInfo = _.mapValues(playersInfo, (p) => ({
      ...p,
      race: p.id === playerId ? p.race : 'unknown',
    }))
  }

  return {gameInfo, playersInfo}
}
