import knex from './knex/knex.js'

export const playerInGame = async (playerId, gameId) => {
  return !!await knex('player_to_game').select('*').where({
    player_id: playerId,
    game_id: gameId,
  }).first()
}

export const gameActive = async (gameId) => {
  return (await knex('game').select('active').where({
    id: gameId,
  }).first()).active
}

export const playerInActiveGame = async (playerId, gameId) => {
  return await playerInGame(playerId, gameId) && await gameActive(gameId)
}
