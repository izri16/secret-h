import {config} from '../config.js'
import {getPlayer} from '../utils.js'

export const auth = async (req, res, next) => {
  let playerId = req.session.playerId

  if (config.testingSessions) {
    playerId = req.headers['x-player-id']
  }

  if (!playerId) {
    res.status(401)
    res.json({})
    return
  }

  const player = await getPlayer(playerId)

  if (!player) {
    req.session.destroy()
    res.status(404)
    res.json({})
    return
  }

  req.playerId = playerId

  next()
}
