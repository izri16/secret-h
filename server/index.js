import {expressServer, httpServer} from './server.js'
import {config} from './config.js'

import player from './api/player.js'
import game from './api/game.js'

expressServer.use('/api/player', player)
expressServer.use('/api/game', game)

httpServer.listen(config.port, () => {
  console.log(`Secret-Hitler app listening at http://localhost:${config.port}`)
})
