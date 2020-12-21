import _ from 'lodash'
import bcrypt from 'bcrypt'

import {assignRaces} from '../../utils.js'

const saltRounds = 8

exports.seed = async function (knex) {
  await knex('players').del()

  const playerLogins = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
  ]

  const dataToInsert = await Promise.all(
    playerLogins.map(async (login) => {
      const hash = await bcrypt.hash(login, saltRounds)
      return {login, hashed_password: hash}
    })
  )

  const players = await knex('players').insert(dataToInsert).returning('*')

  // Initial active game
  const gamePlayersCount = 5
  let gamePlayers = players.slice(0, gamePlayersCount)
  const orders = _.shuffle(_.range(1, gamePlayersCount + 1))

  const game = (
    await knex('games')
      .insert({
        created_by: players[0].id,
        number_of_players: gamePlayersCount,
        active: true,
      })
      .returning('*')
  )[0]

  gamePlayers = assignRaces(
    gamePlayers.map((p, i) => ({
      player_id: p.id,
      game_id: game.id,
      order: orders[i],
      race: p.race,
    }))
  )

  await knex('player_to_game').insert(gamePlayers)
}
