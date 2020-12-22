import _ from 'lodash'
import knex from './knex/knex.js'
import {raceConfigurations, race} from 'common/constants.js'

export const logActiveGamesIds = async () => {
  const activeGames = await knex('games').select('id').where({
    active: true,
  })
  console.log('ACTIVE GAMES', activeGames)
}

export const assignRacesAndOrder = (players) => {
  const numberOfPlayers = Object.keys(players).length
  const orders = _.shuffle(_.range(1, numberOfPlayers + 1))

  const conf = raceConfigurations[numberOfPlayers].races

  const races = _.shuffle([
    ..._.fill(Array(conf[race.liberal]), race.liberal),
    ..._.fill(Array(conf[race.fascist] - 1), race.fascist),
    ...[race.hitler],
  ])

  return _.fromPairs(
    _.toPairs(players).map(([id, data], index) => [
      id,
      {...data, race: races[index], order: orders[index]},
    ])
  )
}

export const getAlivePlayers = (players) => {
  return _.toPairs(_.toPairs(players).filter(([id, data]) => !data.killed)) // eslint-disable-line
}

export const getInitialGameConf = (players) => ({
  action: 'chooseChancellor',
  president: Object.values(players).find((p) => p.order === 1).id,
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
})
