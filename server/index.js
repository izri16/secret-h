import {expressServer, httpServer, ioServer} from './server.js'
import {config} from './config.js'

import player from './api/player.js'
import game from './api/game.js'

import {init as socketsInit} from './sockets/init.js'

// api endpoints
expressServer.use('/api/player', player)
expressServer.use('/api/game', game)

// socket listeners
ioServer.on('connection', socketsInit)

httpServer.listen(config.port, () => {
  console.log(`Secret-Hitler app listening at http://localhost:${config.port}`)
})
