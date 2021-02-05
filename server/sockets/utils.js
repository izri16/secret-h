import _ from 'lodash'
import {fascistCardsConf} from 'common/constants.js'

export const getAlivePlayers = (players) => {
  return _.fromPairs(_.toPairs(players).filter(([id, data]) => !data.killed)) // eslint-disable-line
}

export const chooseNextPresident = (game, currentPresidentId) => {
  const alivePlayers = getAlivePlayers(game.players)
  const sortedAlivePlayers = _.orderBy(
    Object.values(alivePlayers),
    (p) => p.order
  )

  currentPresidentId = currentPresidentId || game.conf.president
  const currentPresidentIndex = sortedAlivePlayers.findIndex(
    (p) => p.id === currentPresidentId
  )

  const nextPresident =
    currentPresidentIndex < _.size(alivePlayers) - 1
      ? sortedAlivePlayers[currentPresidentIndex + 1]
      : sortedAlivePlayers[0]

  return nextPresident.id
}

export const handleLawsShuffle = (remainingLaws, discartedLaws) => {
  if (remainingLaws.length <= 2) {
    const sfuffledLaws = _.shuffle([...remainingLaws, ...discartedLaws])
    return {remainingLaws: sfuffledLaws, discartedLaws: []}
  }
  return {remainingLaws, discartedLaws}
}

export const handleGameOver = (conf, players) => {
  const hitlerKilled = Object.values(players).find((p) => p.race === 'hitler')
    .killed

  const hitlerElected =
    Object.values(players).find((p) => p.race === 'hitler').id ===
      conf.chancellor &&
    conf.action === 'president-turn' && // prev action was "vote"
    conf.fascistsLawsCount >= 3
  const liberalWins = conf.liberalLawsCount === 5 || hitlerKilled
  const fascistWins = conf.fascistsLawsCount === 6 || hitlerElected

  if (!liberalWins && !fascistWins) {
    return conf
  }

  return {
    ...conf,
    action: 'results',
    results: {
      party: liberalWins ? 'liberal' : 'fascist',
      reason: liberalWins
        ? hitlerKilled
          ? 'hitler-killed'
          : 'liberal-laws'
        : hitlerElected
        ? 'hitler-elected'
        : 'fascist-laws',
    },
  }
}

export const getHasCardAction = (conf, numberOfPlayers) => {
  const actions = fascistCardsConf[numberOfPlayers][conf.fascistsLawsCount - 1]
  return !!actions
}

export const handleCardAction = (conf, numberOfPlayers) => {
  const actions = fascistCardsConf[numberOfPlayers][conf.fascistsLawsCount - 1]

  let veto = false
  let action = 'choose-chancellor'

  if (!actions) {
    return {...conf, veto, action}
  }

  actions.forEach((a) => {
    if (a === 'veto') {
      veto = true
    } else {
      action = a
    }
  })

  return {...conf, veto, action}
}

export const handleGovernmentChange = (game, choosenPresidentId) => {
  // do not change government if game is finished
  if (game.conf.action === 'results') return game

  // "choose-president" action
  if (choosenPresidentId) {
    return {
      ...game,
      conf: {
        ...game.conf,
        action: 'choose-chancellor',
        prevPresident: game.conf.president,
        prevChancellor: game.conf.chancellor,
        president: choosenPresidentId,
        chancellor: null,
        returnToPrevPresident: true,
      },
    }
  }

  // "turn" after "choose-president" action
  if (game.conf.returnToPrevPresident) {
    return {
      ...game,
      conf: {
        ...game.conf,
        action: 'choose-chancellor',
        prevPresident: game.conf.president,
        prevChancellor: game.conf.chancellor,
        president: chooseNextPresident(game, game.conf.prevPresident),
        chancellor: null,
        returnToPrevPresident: false,
      },
    }
  }

  // default case
  return {
    ...game,
    conf: {
      ...game.conf,
      action: 'choose-chancellor',
      prevPresident: game.conf.president,
      prevChancellor: game.conf.chancellor,
      president: chooseNextPresident(game),
      chancellor: null,
    },
  }
}

export const gameStateAfterNewLaw = (game, conf, secret_conf, choosenLaw) => {
  const gameOver = conf.action === 'results'

  const hasCardAction =
    !gameOver &&
    choosenLaw === 'fascist' &&
    getHasCardAction(conf, game.number_of_players)

  const transformer =
    !hasCardAction && !gameOver ? handleGovernmentChange : (i) => i

  return transformer({
    ...game,
    conf: hasCardAction ? handleCardAction(conf, game.number_of_players) : conf,
    secret_conf,
  })
}

export const drawRandomLaw = (game, votes = undefined) => {
  let discartedLaws = game.secret_conf.discartedLaws
  let remainingLaws = game.secret_conf.remainingLaws

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
      ...(votes ? {votes} : {}),
      voted: [],
    },
    game.players
  )
  const secret_conf = {
    ...game.secret_conf,
    chancellorLaws: [],
    votes: {},
    discartedLaws,
    remainingLaws,
  }
  return gameStateAfterNewLaw(game, conf, secret_conf, choosenLaw)
}
