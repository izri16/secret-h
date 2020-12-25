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

  const extras = (() => {
    if (!gameInfo.active) return {}

    if (
      gameInfo.conf.action === 'president-turn' &&
      gameInfo.conf.president === playerId
    ) {
      return {presidentLaws: gameInfo.secret_conf.presidentLaws}
    }

    if (
      gameInfo.conf.action === 'chancellor-turn' &&
      gameInfo.conf.chancellor === playerId
    ) {
      return {chancellorLaws: gameInfo.secret_conf.chancellorLaws}
    }

    if (
      gameInfo.conf.action === 'examine' &&
      gameInfo.conf.president === playerId
    ) {
      return {topCards: gameInfo.secret_conf.remainingLaws.slice(0, 3)}
    }
  })()

  socket.emit('game-data', {
    gameInfo: _.omit(gameInfo, 'secret_conf'),
    playersInfo,
    extras,
    playerId,
  })
}
