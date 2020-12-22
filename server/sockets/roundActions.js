import {ioServer} from '../server.js'
import knex from '../knex/knex.js'
import {emitError, getGameData} from './utils.js'

const isValidChancellor = async (gameId, playerId) => {
  const gameConf = (
    await knex('games').where({id: gameId, active: true}).select('conf').first()
  ).conf

  const alivePlayersIds = await knex('player_to_game')
    .where({game_id: gameId, killed: false})
    .select('player_id')

  if (!alivePlayersIds.find((p) => p.player_id === playerId)) {
    return false
  }

  if (playerId === gameConf.prevChancellor) {
    return false
  }

  if (playerId === gameConf.president) {
    return false
  }

  if (alivePlayersIds.length > 5 && playerId === gameConf.prevPresident) {
    return false
  }
  return true
}

export const chooseChancellor = (socket) => async (data) => {
  const {playerId, gameId} = socket

  const gameConf = (
    await knex('games').where({id: gameId}).select('conf').first()
  ).conf

  if (gameConf.action !== 'chooseChancellor') {
    emitError(socket)
    return
  }

  const valid = await isValidChancellor(gameId, data.id)

  if (!valid) {
    emitError(socket)
    return
  }

  const updatedConf = {
    ...gameConf,
    chancellor: data.id,
    action: 'vote',
  }

  await knex('games').where({id: gameId}).update({conf: updatedConf})

  const gameData = await getGameData(gameId, playerId)
  ioServer.in(gameId).emit('game-data', gameData)
}
