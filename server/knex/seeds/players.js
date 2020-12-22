import _ from 'lodash'
import bcrypt from 'bcrypt'

import {assignRaces} from '../../utils.js'

const saltRounds = 8

exports.seed = async function (knex) {
  await knex('players').del()

  // TODO: create login && name for players, allow to change name during game
  const playerLogins = [
    'Andrej Sabov',
    'Marek Sabov',
    'Stano Bernat',
    'Richard Izip',
    'Ivana Janickova',
    'Patril Majercik',
    'Martin Gazdag',
    'Michal Racko',
    'Katka Vlckova',
    'Juraj Maslej',
    'Jozko Vajda',
  ]

  const dataToInsert = await Promise.all(
    playerLogins.map(async (login) => {
      const hash = await bcrypt.hash('a', saltRounds)
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
        conf: {
          action: 'chooseChancellor',
          president: gamePlayers[0].id,
          chancellor: null,
          prevPresident: null,
          prevChancellor: null,
          drawPileCount: 17,
          discardPileCount: 0,
          liberalLawsCount: 0,
          fascistLawsCount: 0,
          voted: [],
          votes: {},
          failedElectionsCount: 0,
        },
        secret_conf: {
          votes: {},
        },
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
