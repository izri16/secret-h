import {ioServer} from '../../server.js'
import knex from '../../knex/knex.js'
import {getGame, emitSocketError} from '../../utils.js'
import {log} from '../../logger.js'

export const examineFinished = (socket) => async () => {
  log.info('Examine finished')
  const {gameId, playerId} = socket

  const game = await getGame(gameId)

  if (
    !game.active ||
    game.conf.action !== 'examine' ||
    playerId !== game.conf.president
  ) {
    emitSocketError(socket)
    return
  }

  await knex('games')
    .where({id: game.id})
    .update({
      conf: {
        ...game.conf,
        action: 'chooseChancellor',
      },
    })

  ioServer.in(game.id).emit('fetch-data')
}
