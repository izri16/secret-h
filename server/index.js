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

// Bugs: (tomorrow)
// last player does not become president
// killing hitler does not end game

// TODO: (actions)
// 1. choose-president action
// 2. player investigate action
// 3. veto

// TODO: refactoring
// 1. run all queries in transaction
// 2. better logging
// 3. nicer error handling on FE

// TODO: pre-prod
// 1. style login / register / loading screens
// 2. style select game screen
// 3. final refactor & polish

// TODO: prod
// 1. auto-restarts with pm2

// Handling actions
// 1. detect election of "fascist" law
// 2. choose action if any or activate flag for "veto"
// 3. change "conf.action"
// 4. adjust "Players" to handle multiple actions on click and different "selectability" of players
