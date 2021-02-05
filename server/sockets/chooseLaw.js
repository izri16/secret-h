import {ioServer} from '../server.js'
import knex from '../knex/knex.js'
import {getGame, emitSocketError} from '../utils.js'
import {
  handleLawsShuffle,
  handleGameOver,
  handleGovernmentChange,
} from './utils.js'
import {
  chancellorTurnTransformer,
  presidentTurnTransformer,
} from './chooseLawUtils.js'

export const chancellorTurnVeto = (socket) => async () => {
  socket.log.info('Chancellor turn veto')
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
  socket.log.info('Chancellor turn', data)
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

  const updatedGame = chancellorTurnTransformer(game, data)
  await knex('games').where({id: game.id}).update(updatedGame)

  ioServer.in(game.id).emit('fetch-data')
}

export const presidentTurnVeto = (socket) => async (data) => {
  socket.log.info('President turn veto', data)

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
          allSelectable: true,
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
  socket.log.info('President turn', data)
  const {gameId, playerId} = socket

  const game = await getGame(gameId, data)

  if (
    !game.active ||
    game.conf.action !== 'president-turn' ||
    playerId !== game.conf.president
  ) {
    emitSocketError(socket)
    return
  }

  const updatedGame = presidentTurnTransformer(game, data)
  await knex('games').where({id: game.id}).update(updatedGame)

  ioServer.in(game.id).emit('fetch-data')
}
