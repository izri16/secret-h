import _ from 'lodash'
import {getAlivePlayers} from '../utils.js'

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
