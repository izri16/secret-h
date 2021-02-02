import {config} from '../config.js'
import {getPlayer} from '../utils.js'

export const auth = async (req, res, next) => {
  let playerId = req.session.playerId

  const authError = () => {
    res.status(401)
    res.json('Not authenticated!')
  }

  // Force preflight for all requests
  if (!req.headers['x-csrf']) {
    return authError()
  }

  if (config.testingSessions) {
    playerId = req.headers['x-player-id']
  }

  if (!playerId) {
    return authError()
  }

  const player = await getPlayer(playerId)

  if (!player) {
    req.session.destroy()
    return authError()
  }

  req.playerId = playerId

  next()
}
