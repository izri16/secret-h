import express from 'express'
import _ from 'lodash'

import knex from '../knex/knex.js'
import {auth} from '../middlewares/auth.js'

const router = express.Router()

// create-new game
router.post('/', [auth], async function (req, res) {
  const {numberOfPlayers} = req.body
  const playerId = req.session.playerId

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
  const playerId = req.session.playerId
  const gameId = req.params.id

  await knex('games').delete().where({
    id: gameId,
    created_by: playerId
  })

  res.status(200)
  res.json({})
})

// add-player
router.post('/:id/player', [auth], async function (req, res) {
  const gameId = req.params.id
  const playerId = req.session.playerId

  const registeredPlayers = await knex('player_to_game').where({game_id: gameId})
  const gamePlayersCount = (await knex('games').first('number_of_players').where({id: gameId})).number_of_players

  // game does not exist
  if (gamePlayersCount === undefined) {
    res.status(404)
    res.json({})
    return
  }

  // already registered
  if (registeredPlayers.some((p) => p.player_id === playerId)) {
    res.status(400)
    res.json({})
    return
  }

  // the game is already full
  if (registeredPlayers.length === gamePlayersCount) {
    res.status(403)
    res.json({})
    return
  }

  // remove player from all other games
  await knex('player_to_game').del().where({player_id: playerId})

  // add player to game
  await knex('player_to_game').insert({
    player_id: playerId,
    game_id: gameId,
  })

  // all players registered, set random players order
  if (registeredPlayers.length === gamePlayersCount - 1) {
    const orders = _.shuffle(_.range(1, gamePlayersCount + 1))
    const records = await knex('player_to_game').select('*').where({game_id: gameId})
    
    records.forEach(async (r, index) => {
      await knex('player_to_game').where({player_id: r.player_id, game_id: r.game_id}).update({order: orders[index]})
    })

    // mark game as ready
    await knex('games').where({id: gameId}).update({is_ready: true})
  }

  res.status(201)
  res.json({})
})

export default router
