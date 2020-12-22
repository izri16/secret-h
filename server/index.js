import {expressServer, httpServer, ioServer} from './server.js'
import {config} from './config.js'

import player from './api/player.js'
import game from './api/game.js'

import {init as socketsInit} from './sockets/init.js'
import {logActiveGamesIds} from './utils.js'
import {log} from './logger.js'

// api endpoints
expressServer.use('/api/player', player)
expressServer.use('/api/game', game)

ioServer.on('connection', socketsInit)

httpServer.listen(config.port, async () => {
  log.info(`Secret-Hitler app listening at http://localhost:${config.port}`)

  await logActiveGamesIds()
})
