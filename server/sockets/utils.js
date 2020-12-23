import _ from 'lodash'
import {getAlivePlayers} from '../utils.js'

export const chooseNextPresident = (game) => {
  const alivePlayers = getAlivePlayers(game.players)

  const currentPresidentIndex = alivePlayers[game.conf.president].order

  const sortedAlivePlayers = _.orderBy(
    Object.values(alivePlayers),
    (p) => p.order
  )

  const nextPresident =
    currentPresidentIndex < _.size(alivePlayers) - 1
      ? sortedAlivePlayers[currentPresidentIndex + 1]
      : sortedAlivePlayers[0]
  return nextPresident.id
}
