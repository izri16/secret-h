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

// register sockets
ioServer.on('connection', socketsInit)

httpServer.listen(config.port, async () => {
  // TODO: change message on heroku
  log.info(`Secret-Hitler app listening at http://localhost:${config.port}`)

  await logActiveGamesIds()
})

// TODO: refactoring
// 1. run all queries in transaction
// 2. testing

// TODO: pre-prod
// 1. style login / register / loading screens
// 2. style select game screen
// 3. nicer error handling on FE
// 4. final refactor & polish
// 5. nicer logging

// TODO: prod
// 1. auto-restarts with pm2
