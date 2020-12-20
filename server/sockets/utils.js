import knex from '../knex/knex.js'

export const emitError = (socket) => {
  socket.emit('socket-error', '')
}

export const getGameData = async (gameId) => {
  const gameInfo = await knex('games')
    .select('id', 'number_of_players', 'active')
    .where({id: gameId})
    .first()

  const playersInfo = await knex('player_to_game')
    .select('player_id')
    .where({game_id: gameId})

  return {gameInfo, playersInfo}
}
