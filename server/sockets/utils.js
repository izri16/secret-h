import _ from 'lodash'
import {getAlivePlayers} from '../utils.js'
import {fascistCardsConf} from 'common/constants.js'

export const chooseNextPresident = (game) => {
  const alivePlayers = getAlivePlayers(game.players)

  const currentPresidentOrder = alivePlayers[game.conf.president].order

  const sortedAlivePlayers = _.orderBy(
    Object.values(alivePlayers),
    (p) => p.order
  )

  const nextPresident =
    currentPresidentOrder < _.size(alivePlayers) - 1
      ? sortedAlivePlayers[currentPresidentOrder] // not written as "currentPresidentOrder + 1" as starts from 1
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

export const handleCardAction = (conf, numberOfPlayers, choosenLaw) => {
  const actions = fascistCardsConf[numberOfPlayers][conf.fascistsLawsCount - 1]

  let veto = false
  let action = 'chooseChancellor'

  if (choosenLaw === 'liberal' || !actions) {
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

export const handleGovernmentChange = (game) => {
  return {
    ...game,
    conf: {
      ...game.conf,
      prevPresident: game.conf.president,
      prevChancellor: game.conf.chancellor,
      president: chooseNextPresident(game),
      chancellor: null,
    },
  }
}
