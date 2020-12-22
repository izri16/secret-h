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

  const game = (
    await knex('games')
      .insert({
        created_by: playerId,
        number_of_players: numberOfPlayers,
        players: {
          [playerId]: {id: playerId, killed: false, login: req.player.login},
        },
      })
      .returning('*')
  )[0]

  res.status(201)
  res.json({id: game.id, numberOfPlayers})
})

export default router
