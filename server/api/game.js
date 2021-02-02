import express from 'express'

import {CreateGameSchema} from 'common/schemas.js'
import knex from '../knex/knex.js'
import {auth} from '../middlewares/auth.js'
import {validateRequest} from '../middlewares/schema.js'
import {getPlayer, getInitialGameConf} from '../utils.js'

const router = express.Router()

// create-new game
router.post(
  '/',
  [auth, validateRequest({body: CreateGameSchema})],
  async function (req, res) {
    const {numberOfPlayers} = req.body
    const playerId = req.playerId
    const player = await getPlayer(playerId)

    const game = (
      await knex('games')
        .insert({
          created_by: playerId,
          number_of_players: numberOfPlayers,
          players: {
            [playerId]: {...player, killed: false},
          },
          conf: getInitialGameConf({}, false),
          secret_conf: {},
        })
        .returning('*')
    )[0]

    res.status(201)
    res.json({id: game.id, numberOfPlayers})
  }
)

export default router
