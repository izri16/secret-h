import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import session from 'express-session'
import connectSessionKnex from 'connect-session-knex'

import {config} from './config.js'
import player from './api/player.js'
import game from './api/game.js'
import knex from './knex/knex.js'

const KnexSessionStore = connectSessionKnex(session)
const sessionStore = new KnexSessionStore({knex})

// TODO: socket.io setup / take from "revolt"

const app = express()

app.set('trust proxy', 1) // trust first proxy (heroku)

app.use(session({
  store: sessionStore,
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: config.https, httpOnly: true }
}))

if (config.dev) {
  app.use(cors({
    origin: config.allowedDevCorsOrigin,
    credentials: true
  }))
}

app.use(bodyParser.json())

app.use('/api/player', player)
app.use('/api/game', game)

app.listen(config.port, () => {
  console.log(`Secret-Hitler app listening at http://localhost:${config.port}`)
})
