import knex from '../knex/knex.js'
import {config} from '../config.js'

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

  const player = await knex('players').select('login').where({
    id: playerId
  }).first()

  if (!player) {
    req.session.playerId = undefined
    res.status(404)
    res.json({})
    return
  }

  next()
}
