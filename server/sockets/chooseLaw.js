import {ioServer} from '../server.js'
import knex from '../knex/knex.js'
import {getGame, emitSocketError} from '../utils.js'
import {chooseNextPresident} from './utils.js'

export const chancellorTurn = (socket) => async (data) => {
  const {gameId, playerId} = socket

  const game = await getGame(gameId)

  if (
    !game.active ||
    game.conf.action !== 'chancellor-turn' ||
    playerId !== game.conf.chancellor
  ) {
    emitSocketError(socket)
    return
  }

  const discartedLaws = [
    ...game.secret_conf.discartedLaws,
    ...game.secret_conf.chancellorLaws.filter((law, i) => i !== data.index),
  ]

  const choosenLaw = game.secret_conf.chancellorLaws[data.index]

  const updatedConf = {
    ...game.conf,
    liberalLawsCount:
      game.conf.liberalLawsCount + (choosenLaw === 'liberal' ? 1 : 0),
    fascistsLawsCount:
      game.conf.liberalLawsCount + (choosenLaw === 'fascist' ? 1 : 0),
    drawPileCount: game.conf.drawPileCount - 3,
    discardPileCount: game.conf.discardPileCount + 2,
    action: 'chooseChancellor',
    prevPresident: game.conf.president,
    prevChancellor: game.conf.chancellor,
    president: chooseNextPresident(game),
    chancellor: null,
  }

  const updatedSecretConf = {
    chancellorLaws: [],
    discartedLaws,
    ...game.secret_conf,
  }

  await knex('games')
    .where({id: game.id})
    .update({conf: updatedConf, secret_conf: updatedSecretConf})

  ioServer.in(game.id).emit('fetch-data')
}

export const presidentTurn = (socket) => async (data) => {
  const {gameId, playerId} = socket

  const game = await getGame(gameId)

  if (
    !game.active ||
    game.conf.action !== 'president-turn' ||
    playerId !== game.conf.president
  ) {
    emitSocketError(socket)
    return
  }

  const updatedConf = {
    ...game.conf,
    action: 'chancellor-turn',
  }

  // eslint-disable-next-line
  const chancellorLaws = game.secret_conf.presidentLaws.filter(
    (law, index) => index !== data.index
  )

  const discartedLaws = [
    ...game.secret_conf.discartedLaws,
    game.secret_conf.presidentLaws[data.index],
  ]

  const updatedSecretConf = {
    presidentLaws: [],
    chancellorLaws,
    discartedLaws,
    ...game.secret_conf,
  }

  await knex('games')
    .where({id: game.id})
    .update({conf: updatedConf, secret_conf: updatedSecretConf})

  ioServer.in(game.id).emit('fetch-data')
}
