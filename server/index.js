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
  log.info(`Secret-Hitler app listening at http://localhost:${config.port}`)

  await logActiveGamesIds()
})

// TODO: (actions)
// 0: kill action
// ...rest actions

// TODO: refactoring
// 1. run all queries in transaction
// 2. better logging
// 3. refactor Players
// 4. nicer error handling on FE

// TODO: pre-prod
// 9. style login / register / loading screens
// 10. style select game screen
// 11. final refactor & polish
