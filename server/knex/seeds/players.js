import _ from 'lodash'
import bcrypt from 'bcrypt'

import {assignRacesAndOrder, getInitialGameConf} from '../../utils.js'

const saltRounds = 8

exports.seed = async function (knex) {
  await knex('players').del()
  await knex('games').del()

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

  // 5 players fresh game
  let gamePlayersCount = 5
  let gamePlayers = players.slice(0, gamePlayersCount)

  gamePlayers = assignRacesAndOrder(
    _.mapValues(_.keyBy(gamePlayers, 'id'), ({id, login}) => ({
      id,
      killed: false,
      login,
    }))
  )

  await knex('games').insert({
    created_by: players[0].id,
    number_of_players: gamePlayersCount,
    active: true,
    conf: getInitialGameConf(gamePlayers),
    secret_conf: {
      votes: {},
    },
    players: gamePlayers,
  })

  // 5 players game, 3 fascists laws
  gamePlayersCount = 5
  gamePlayers = players.slice(0, gamePlayersCount)

  gamePlayers = assignRacesAndOrder(
    _.mapValues(_.keyBy(gamePlayers, 'id'), ({id, login}) => ({
      id,
      killed: false,
      login,
    }))
  )

  let remainingLaws = [
    'liberal',
    'fascist',
    'liberal',
    'liberal',
    'fascist',
    'fascist',
  ]

  let discartedLaws = [
    'fascist',
    'liberal',
    'fascist',
    'fascist',
    'fascist',
    'fascist',
  ]

  await knex('games').insert({
    created_by: players[0].id,
    number_of_players: gamePlayersCount,
    active: true,
    conf: {
      ...getInitialGameConf(gamePlayers),
      fascistsLawsCount: 3,
      liberalLawsCount: 2,
      drawPileCount: remainingLaws.length,
      discardPileCount: discartedLaws.length,
    },
    secret_conf: {
      votes: {},
      remainingLaws,
      discartedLaws,
    },
    players: gamePlayers,
  })
}
