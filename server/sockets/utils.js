import knex from '../knex/knex.js'

export const emitError = (socket) => {
  socket.emit('socket-error', '')
}

export const getGameData = async (gameId, playerId) => {
  const gameInfo = await knex('games')
    .select('id', 'number_of_players', 'active')
    .where({id: gameId})
    .first()

  let playersInfo = await knex('players')
    .join('player_to_game', 'player_to_game.player_id', '=', 'players.id')
    .select(
      'players.id',
      'players.login',
      'player_to_game.order',
      'player_to_game.race',
      'player_to_game.killed'
    )
    .where('player_to_game.game_id', gameInfo.id)
    .orderBy('player_to_game.order')

  // filter info about other players
  const playerRace = playersInfo.find(({id}) => id === playerId).race

  if (playerRace === 'liberal' || playerRace === 'hitler') {
    playersInfo = playersInfo.map((p) => ({
      ...p,
      race: p.id === playerId ? p.race : 'unknown',
    }))
  }

  return {gameInfo, playersInfo}
}
