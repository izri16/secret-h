import {ioServer} from '../server.js'
import knex from '../knex/knex.js'
import {getGame, emitSocketError} from '../utils.js'
import {
  handleLawsShuffle,
  handleGameOver,
  handleCardAction,
  handleGovernmentChange,
} from './utils.js'
import {log} from '../logger.js'

export const chancellorTurn = (socket) => async (data) => {
  log.info('Chancellor turn data', JSON.stringify(data))
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

  const choosenLaw = game.secret_conf.chancellorLaws[data.index]

  game.secret_conf.discartedLaws = [
    ...game.secret_conf.discartedLaws,
    ...game.secret_conf.chancellorLaws.filter((law, i) => i !== data.index),
  ]

  const {discartedLaws, remainingLaws} = handleLawsShuffle(
    game.secret_conf.remainingLaws,
    game.secret_conf.discartedLaws
  )

  const updatedConf = handleGameOver(
    {
      ...game.conf,
      liberalLawsCount:
        game.conf.liberalLawsCount + (choosenLaw === 'liberal' ? 1 : 0),
      fascistsLawsCount:
        game.conf.fascistsLawsCount + (choosenLaw === 'fascist' ? 1 : 0),
      drawPileCount: remainingLaws.length,
      discardPileCount: discartedLaws.length,
    },
    game.players
  )

  const updatedSecretConf = {
    ...game.secret_conf,
    chancellorLaws: [],
    remainingLaws,
    discartedLaws,
  }

  const updatedGame = handleGovernmentChange({
    ...game,
    conf:
      updatedConf.action === 'results'
        ? updatedConf
        : handleCardAction(updatedConf, game.number_of_players, choosenLaw),
    secret_conf: updatedSecretConf,
  })

  await knex('games').where({id: game.id}).update(updatedGame)

  ioServer.in(game.id).emit('fetch-data')
}

export const presidentTurn = (socket) => async (data) => {
  log.info('President turn data', JSON.stringify(data))
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
    ...game.secret_conf,
    presidentLaws: [],
    chancellorLaws,
    discartedLaws,
  }

  await knex('games')
    .where({id: game.id})
    .update({conf: updatedConf, secret_conf: updatedSecretConf})

  ioServer.in(game.id).emit('fetch-data')
}
