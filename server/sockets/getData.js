import _ from 'lodash'
import knex from '../knex/knex.js'
import {getAlivePlayers} from '../utils.js'

export const getData = (socket) => async () => {
  const {gameId, playerId} = socket

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
  const alivePlayers = getAlivePlayers(gameInfo.players)

  const playersInfo = (() => {
    let res = gameInfo.players

    // Till game is not active there are no roles and order
    if (
      (gameInfo.conf.action !== 'results' &&
        gameInfo.active &&
        playerRace === 'liberal') ||
      (playerRace === 'hitler' && _.size(alivePlayers) > 6)
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
    extras.presidentLaws = gameInfo.secret_conf.presidentLaws
  }

  if (
    // There is no "conf" for inactive game
    gameInfo.active &&
    gameInfo.conf.action === 'chancellor-turn' &&
    gameInfo.conf.chancellor === playerId
  ) {
    extras.chancellorLaws = gameInfo.secret_conf.chancellorLaws
  }

  socket.emit('game-data', {
    gameInfo: _.omit(gameInfo, 'secret_conf'),
    playersInfo,
    extras,
    playerId,
  })
}
