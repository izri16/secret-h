import _ from 'lodash'

import {ioServer} from '../server.js'
import knex from '../knex/knex.js'
import {getAlivePlayers, getGame, getPlayer, emitSocketError} from '../utils.js'

const canVote = async (game, playerId) => {
  const alivePlayers = getAlivePlayers(game.players)

  if (!alivePlayers[playerId]) {
    return false
  }

  if (game.conf.voted.includes(playerId)) {
    return false
  }

  return true
}

const getConfigDuringVote = (game, votes) => {
  const conf = {
    ...game.conf,
    voted: Object.keys(votes),
  }

  const secretConf = {
    ...game.secret_conf,
    votes,
  }

  return {conf, secretConf}
}

const getConfigAfterSuccessfullVote = (game, votes) => {
  // TODO: check that "laws" may go empty
  const presidentLaws = game.secret_conf.remainingLaws.slice(0, 3)
  const remainingLaws = game.secret_conf.remainingLaws.slice(3)

  const conf = {
    ...game.conf,
    action: 'president-turn',
    voted: Object.keys(votes),
    failedElectionsCount: 0,
  }

  const secretConf = {
    ...game.secret_conf,
    votes,
    presidentLaws,
    remainingLaws,
  }

  return {conf, secretConf}
}

const getConfigAfterFailedVote = (game, votes) => {
  const alivePlayers = getAlivePlayers(game.players)

  const currentPresidentIndex = alivePlayers[game.conf.president].order

  const sortedAlivePlayers = _.orderBy(
    Object.values(alivePlayers),
    (p) => p.order
  )

  const nextPresident =
    currentPresidentIndex < _.size(alivePlayers) - 1
      ? sortedAlivePlayers[currentPresidentIndex + 1]
      : sortedAlivePlayers[0]

  // TODO: case when failed election counter === 3
  const conf = {
    ...game.conf,
    action: 'chooseChancellor',
    voted: Object.keys(votes),
    failedElectionsCount: game.conf.failedElectionsCount + 1,
    president: nextPresident.id,
    chancellor: null,
  }

  const secretConf = {
    ...game.secret_conf,
    votes,
  }

  return {conf, secret_conf: secretConf}
}

export const vote = (socket) => async (data) => {
  const {playerId, gameId} = socket

  const game = await getGame(gameId)
  const player = await getPlayer(playerId)

  if (!game.active || game.conf.action !== 'vote') {
    emitSocketError(socket)
    return
  }

  const valid = await canVote(game, player.id)
  if (!valid) {
    emitSocketError(socket)
    return
  }

  const votes = {
    ...game.secret_conf.votes,
    [player.id]: data.vote,
  }
  const alivePlayersCount = _.size(getAlivePlayers(game.players))
  const votedAll = _.size(votes) === alivePlayersCount

  const skipped =
    votedAll &&
    Object.values(game.secret_conf.votes).filter((v) => v).length * 2 <=
      alivePlayersCount

  const {conf, secretConf} = !votedAll
    ? getConfigDuringVote(game, votes)
    : !skipped
    ? getConfigAfterSuccessfullVote(game, votes)
    : getConfigAfterFailedVote(game, votes)

  await knex('games')
    .where({id: game.id})
    .update({conf, secret_conf: secretConf})

  votedAll ? ioServer.in(game.id).emit('fetch-data') : socket.emit('fetch-data')
}
