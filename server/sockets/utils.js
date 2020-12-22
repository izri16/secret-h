import _ from 'lodash'
import knex from '../knex/knex.js'

export const emitError = (socket) => {
  socket.emit('socket-error', '')
}

export const getGameData = async (gameId, playerId) => {
  const gameInfo = await knex('games')
    .select(
      'id',
      'number_of_players',
      'active',
      'conf',
      'players',
      'secret_conf'
    )
    .where({id: gameId})
    .first()

  const playerRace = gameInfo.players[playerId].race

  const playersInfo = (() => {
    let res = gameInfo.players

    // Till game is not active there are no roles and order
    if (
      (gameInfo.active && playerRace === 'liberal') ||
      playerRace === 'hitler'
    ) {
      res = _.mapValues(res, (p) => ({
        ...p,
        race: p.id === playerId ? p.race : 'unknown',
      }))
    }

    return res
  })()

  const extras = {}

  if (
    // There is no "conf" for inactive game
    gameInfo.active &&
    gameInfo.conf.action === 'president-turn' &&
    gameInfo.conf.president === playerId
  ) {
    extras.presidentLaws = gameInfo.secret_conf.remainingLaws.slice(0, 3)
  }

  return {
    gameInfo: _.omit(gameInfo, 'secret_conf'),
    playersInfo,
    extras,
    playerId,
  }
}
