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

// TODO: next steps (till new year)
// 0. run all queries in transaction
// 5. cleanup
// 6. refactor Players

// TODO: future
// 6. liberal / fascist win (game info), special state, final screen
// 7. actions
// 8. better logging

// TODO: pre-prod
// 9. style login / register / loading screens
// 10. style select game screen

// TODO: nice to have
// => getData schema object check on each return
