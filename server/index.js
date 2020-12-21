import {expressServer, httpServer, ioServer} from './server.js'
import {config} from './config.js'

import player from './api/player.js'
import game from './api/game.js'

import {init as socketsInit} from './sockets/init.js'
import {logActiveGamesIds} from './utils.js'

// TODO: setup login by "session storage" for testing purposes,
// to login as multiple users in multiple tabs

// api endpoints
expressServer.use('/api/player', player)
expressServer.use('/api/game', game)

// socket listeners
ioServer.on('connection', socketsInit)

httpServer.listen(config.port, async () => {
  console.log(`Secret-Hitler app listening at http://localhost:${config.port}`)

  await logActiveGamesIds()
})
