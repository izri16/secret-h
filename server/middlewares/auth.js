import knex from '../knex/knex.js'

export const auth = async (req, res, next) => {
  const playerId = req.session.playerId

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
