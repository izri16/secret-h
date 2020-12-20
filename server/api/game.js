import express from 'express'

import knex from '../knex/knex.js'
import {auth} from '../middlewares/auth.js'

const router = express.Router()

// create-new game
router.post('/', [auth], async function (req, res) {
  const {numberOfPlayers} = req.body
  const playerId = req.player.id

  if (numberOfPlayers < 5 || numberOfPlayers > 10) {
    res.status(400)
    res.json({})
    return
  }

  const game = (await knex('games').insert({
    created_by: playerId,
    number_of_players: numberOfPlayers
  }).returning('*'))[0]

  // add player to newly created game
  await knex('player_to_game').insert({
    player_id: playerId,
    game_id: game.id,
  })

  res.status(201)
  res.json({id: game.id, numberOfPlayers})
})

// delete game
router.delete('/:id', [auth], async function (req, res) {
  const playerId = req.player.id
  const gameId = req.params.id

  await knex('games').delete().where({
    id: gameId,
    created_by: playerId
  })

  res.status(200)
  res.json({})
})

export default router
