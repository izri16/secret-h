import _ from 'lodash'

import {ioServer} from '../server.js'
import knex from '../knex/knex.js'
import {getAlivePlayers, getGame, getPlayer, emitSocketError} from '../utils.js'
import {chooseNextPresident, handleLawsShuffle} from './utils.js'

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
  const presidentLaws = game.secret_conf.remainingLaws.slice(0, 3)
  const remainingLaws = game.secret_conf.remainingLaws.slice(3)

  const conf = {
    ...game.conf,
    action: 'president-turn',
    voted: [],
    failedElectionsCount: 0,
    votes,
  }

  const secretConf = {
    ...game.secret_conf,
    presidentLaws,
    remainingLaws,
  }

  return {conf, secretConf}
}

const getConfigAfterFailedVote = (game, votes) => {
  if (game.conf.failedElectionsCount === 2) {
    const choosenLaw = game.secret_conf.remainingLaws[0]

    const {discartedLaws, remainingLaws} = handleLawsShuffle(
      game.secret_conf.remainingLaws.slice(1),
      game.secret_conf.discartedLaws
    )

    const conf = {
      ...game.conf,
      liberalLawsCount:
        game.conf.liberalLawsCount + (choosenLaw === 'liberal' ? 1 : 0),
      fascistsLawsCount:
        game.conf.fascistsLawsCount + (choosenLaw === 'fascist' ? 1 : 0),
      drawPileCount: remainingLaws.length,
      discardPileCount: discartedLaws.length,
      failedElectionsCount: 0,
      action: 'chooseChancellor',
      prevPresident: null,
      prevChancellor: null,
      president: chooseNextPresident(game),
      chancellor: null,
    }

    const secretConf = {
      ...game.secret_conf,
      discartedLaws,
      remainingLaws,
    }

    return {conf, secret_conf: secretConf}
  }

  const conf = {
    ...game.conf,
    action: 'chooseChancellor',
    voted: [],
    failedElectionsCount: game.conf.failedElectionsCount + 1,
    president: chooseNextPresident(game),
    chancellor: null,
    votes,
  }

  return {conf, secret_conf: game.secret_conf}
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
    Object.values(votes).filter((v) => v).length * 2 <= alivePlayersCount

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
