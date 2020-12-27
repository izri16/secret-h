import {ioServer} from '../server.js'
import knex from '../knex/knex.js'
import {getGame, emitSocketError} from '../utils.js'
import {
  handleLawsShuffle,
  handleGameOver,
  handleCardAction,
  handleGovernmentChange,
  getHasCardAction,
} from './utils.js'
import {log} from '../logger.js'

export const chancellorTurnVeto = (socket) => async () => {
  log.info('Chancellor turn veto')
  const {gameId, playerId} = socket

  const game = await getGame(gameId)

  if (
    !game.active ||
    game.conf.action !== 'chancellor-turn-veto' ||
    playerId !== game.conf.chancellor
  ) {
    emitSocketError(socket)
    return
  }

  await knex('games')
    .where({id: game.id})
    .update({
      ...game,
      conf: {
        ...game.conf,
        action: 'president-turn-veto',
      },
    })
  ioServer.in(game.id).emit('fetch-data')
}

export const chancellorTurn = (socket) => async (data) => {
  log.info('Chancellor turn data', JSON.stringify(data))
  const {gameId, playerId} = socket

  const game = await getGame(gameId)

  if (
    !game.active ||
    !['chancellor-turn', 'chancellor-turn-veto'].includes(game.conf.action) ||
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

  const hasCardAction =
    updatedConf.action !== 'results' &&
    choosenLaw === 'fascist' &&
    getHasCardAction(updatedConf, game.number_of_players)

  const transformer = !hasCardAction ? handleGovernmentChange : (i) => i

  const updatedGame = transformer({
    ...game,
    conf: hasCardAction
      ? handleCardAction(updatedConf, game.number_of_players)
      : updatedConf,
    secret_conf: updatedSecretConf,
  })

  await knex('games').where({id: game.id}).update(updatedGame)

  ioServer.in(game.id).emit('fetch-data')
}

export const presidentTurnVeto = (socket) => async (data) => {
  log.info('President turn veto data', JSON.stringify(data))

  const {gameId, playerId} = socket

  const game = await getGame(gameId)

  if (
    !game.active ||
    game.conf.action !== 'president-turn-veto' ||
    playerId !== game.conf.president
  ) {
    emitSocketError(socket)
    return
  }

  // president confirmed veto
  if (data.veto) {
    let discartedLaws = [
      ...game.secret_conf.discartedLaws,
      ...game.secret_conf.chancellorLaws,
    ]
    let remainingLaws = game.secret_conf.remainingLaws

    // 3 failed votes, law must be selected at random
    if (game.conf.failedElectionsCount === 2) {
      if (game.secret_conf.remainingLaws.length === 0) {
        // we need to shuffle as there is nothing to draw random law from
        const shuffled = handleLawsShuffle(remainingLaws, discartedLaws)
        discartedLaws = shuffled.discartedLaws
        remainingLaws = shuffled.remainingLaws
      }

      // draw random law and remove it from remaining laws
      const choosenLaw = remainingLaws[0]
      remainingLaws = remainingLaws.slice(1)

      // there might be a need for shuffle after choosing random law
      const shuffled = handleLawsShuffle(remainingLaws, discartedLaws)
      discartedLaws = shuffled.discartedLaws
      remainingLaws = shuffled.remainingLaws

      const conf = handleGameOver(
        {
          ...game.conf,
          liberalLawsCount:
            game.conf.liberalLawsCount + (choosenLaw === 'liberal' ? 1 : 0),
          fascistsLawsCount:
            game.conf.fascistsLawsCount + (choosenLaw === 'fascist' ? 1 : 0),
          drawPileCount: remainingLaws.length,
          discardPileCount: discartedLaws.length,
          failedElectionsCount: 0,
        },
        game.players
      )

      const secretConf = {
        ...game.secret_conf,
        discartedLaws,
        remainingLaws,
        chancellorLaws: [],
      }

      // no need to handle card action as "veto" is the last action
      const updatedGame = handleGovernmentChange({
        ...game,
        conf,
        secret_conf: secretConf,
      })
      await knex('games').where({id: game.id}).update(updatedGame)
    } else {
      // there might be a need for shuffle
      const shuffled = handleLawsShuffle(remainingLaws, discartedLaws)
      discartedLaws = shuffled.discartedLaws
      remainingLaws = shuffled.remainingLaws

      const conf = {
        ...game.conf,
        drawPileCount: remainingLaws.length,
        discardPileCount: discartedLaws.length,
        failedElectionsCount: game.conf.failedElectionsCount + 1,
      }

      const secretConf = {
        ...game.secret_conf,
        discartedLaws,
        remainingLaws,
        chancellorLaws: [],
      }

      // no need to handle card action as "veto" is the last action
      const updatedGame = handleGovernmentChange({
        ...game,
        conf,
        secret_conf: secretConf,
      })
      await knex('games').where({id: game.id}).update(updatedGame)
    }
  } else {
    await knex('games')
      .where({id: game.id})
      .update({
        ...game,
        conf: {
          ...game.conf,
          action: 'chancellor-turn',
        },
      })
  }

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

  // eslint-disable-next-line
  const chancellorLaws = game.secret_conf.presidentLaws.filter(
    (law, index) => index !== data.index
  )

  const discartedLaws = [
    ...game.secret_conf.discartedLaws,
    game.secret_conf.presidentLaws[data.index],
  ]

  const updatedConf = {
    ...game.conf,
    action: game.conf.veto ? 'chancellor-turn-veto' : 'chancellor-turn',
    discardPileCount: discartedLaws.length,
  }

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
