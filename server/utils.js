import _ from 'lodash'
import knex from './knex/knex.js'
import {raceConfigurations, race} from 'common/constants.js'

export const playerInGame = async (playerId, gameId) => {
  return !!(await knex('player_to_game')
    .select('*')
    .where({
      player_id: playerId,
      game_id: gameId,
    })
    .first())
}

export const gameActive = async (gameId) => {
  return (
    await knex('games')
      .select('active')
      .where({
        id: gameId,
      })
      .first()
  ).active
}

export const playerInActiveGame = async (playerId, gameId) => {
  return (await playerInGame(playerId, gameId)) && (await gameActive(gameId))
}

export const logActiveGamesIds = async () => {
  const activeGames = await knex('games').select('id').where({
    active: true,
  })
  console.log('ACTIVE GAMES', activeGames)
}

export const assignRaces = (playerRecords) => {
  const numberOfPlayers = playerRecords.length
  const conf = raceConfigurations[numberOfPlayers].races

  const races = _.shuffle([
    ..._.fill(Array(conf[race.liberal]), race.liberal),
    ..._.fill(Array(conf[race.fascist] - 1), race.fascist),
    ...[race.hitler],
  ])

  return playerRecords.map((r, i) => ({...r, race: races[i]}))
}
