import {
  handleLawsShuffle,
  handleGameOver,
  gameStateAfterNewLaw,
  handleGovernmentChange,
  drawRandomLaw,
} from '../utils.js'

export const chancellorTurnTransformer = (game, data) => {
  const choosenLaw = game.secret_conf.chancellorLaws[data.index]

  const discartedLawsBeforeShuffle = [
    ...game.secret_conf.discartedLaws,
    ...game.secret_conf.chancellorLaws.filter((law, i) => i !== data.index),
  ]

  const {discartedLaws, remainingLaws} = handleLawsShuffle(
    game.secret_conf.remainingLaws,
    discartedLawsBeforeShuffle
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
      failedElectionsCount: 0,
      allSelectable: false,
    },
    game.players
  )
  const updatedSecretConf = {
    ...game.secret_conf,
    chancellorLaws: [],
    remainingLaws,
    discartedLaws,
  }
  return gameStateAfterNewLaw(game, updatedConf, updatedSecretConf, choosenLaw)
}

export const presidentTurnTransformer = (game, data) => {
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
  return {
    ...game,
    conf: updatedConf,
    secret_conf: updatedSecretConf,
  }
}

export const presidentTurnVetoTransformer = (game, data) => {
  // president confirmed veto
  if (data.veto) {
    let discartedLaws = [
      ...game.secret_conf.discartedLaws,
      ...game.secret_conf.chancellorLaws,
    ]
    let remainingLaws = game.secret_conf.remainingLaws

    // 3 failed votes, law must be selected at random
    if (game.conf.failedElectionsCount === 2) {
      return drawRandomLaw({
        ...game,
        game: {
          ...game.conf,
          discardPileCount: discartedLaws.length,
        },
        secret_conf: {
          ...game.secret_conf,
          discartedLaws,
        },
      })
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

      const secret_conf = {
        ...game.secret_conf,
        discartedLaws,
        remainingLaws,
        chancellorLaws: [],
      }

      // no need to handle card action as "veto" is the last action
      return handleGovernmentChange({
        ...game,
        conf,
        secret_conf,
      })
    }
  } else {
    return {
      ...game,
      conf: {
        ...game.conf,
        action: 'chancellor-turn',
      },
    }
  }
}
