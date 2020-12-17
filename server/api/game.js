import express from 'express'

import knex from '../knex/knex.js'
import {auth} from '../middlewares/auth.js'

const router = express.Router()

// create-new game
router.post('/', [auth], async function (req, res) {
  const {numberOfPlayers} = req
  const playerId = req.session.playerId

  const game = (await knex('games').insert({
    player_id: playerId,
    number_of_players: numberOfPlayers
  }).returning('*'))[0]

  res.status(201)
  res.json({id: game.id, numberOfPlayers})
})

// delete game
router.delete('/:id', [auth], async function (req, res) {
  const playerId = req.session.playerId
  const gameId = req.params.id

  await knex('games').delete().where({
    id: gameId,
    player_id: playerId
  })

  res.status(200)
  res.json({})
})

export default router
