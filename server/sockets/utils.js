import _ from 'lodash'
import {getAlivePlayers} from '../utils.js'
import {fascistCardsConf} from 'common/constants.js'

export const chooseNextPresident = (game, currentPresident) => {
  const alivePlayers = getAlivePlayers(game.players)

  const sortedAlivePlayers = _.orderBy(
    Object.values(alivePlayers),
    (p) => p.order
  )

  const currentPresidentIndex = sortedAlivePlayers.findIndex(
    (p) => p.id === currentPresident || p.id === game.conf.president
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
