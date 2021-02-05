import {
  handleLawsShuffle,
  handleGameOver,
  handleCardAction,
  handleGovernmentChange,
  getHasCardAction,
} from './utils.js'

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

  const gameOver = updatedConf.action === 'results'

  const hasCardAction =
    !gameOver &&
    choosenLaw === 'fascist' &&
    getHasCardAction(updatedConf, game.number_of_players)

  const transformer =
    !hasCardAction && !gameOver ? handleGovernmentChange : (i) => i

  return transformer({
    ...game,
    conf: hasCardAction
      ? handleCardAction(updatedConf, game.number_of_players)
      : updatedConf,
    secret_conf: updatedSecretConf,
  })
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
