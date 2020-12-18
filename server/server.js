import express from 'express'
import {Server} from 'socket.io'
import bodyParser from 'body-parser'
import cors from 'cors'
import session from 'express-session'
import http from 'http'
import connectSessionKnex from 'connect-session-knex'

import {config} from './config.js'
import knex from './knex/knex.js'

const KnexSessionStore = connectSessionKnex(session)
const sessionStore = new KnexSessionStore({knex})

export const corsOptions = {
  origin: config.allowedDevCorsOrigin,
  credentials: true
}

const app = express()
const server = http.createServer(app)

app.set('trust proxy', 1) // trust first proxy (heroku)

export const appSession = session({
  store: sessionStore,
  secret: config.sessionSecret,
  resave: true,
  saveUninitialized: true,
  cookie: { secure: config.https, httpOnly: true }
})

app.use(appSession)
app.use(bodyParser.json())

if (config.dev) {
  app.use(cors(corsOptions))
}

const io = new Server(server, {
  cors: corsOptions
})

io.use((socket, next) => {
  appSession(socket.request, {}, next)
})

io.on('connection', (socket) => {
  console.log('player connected',  socket.request.session.playerId)
})

export const expressServer = app
export const httpServer = server
export const ioServer = io