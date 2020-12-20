import express from 'express'
import bcrypt from 'bcrypt'

import knex from '../knex/knex.js'
import { auth } from '../middlewares/auth.js'
import { config } from '../config.js'

const router = express.Router()

const saltRounds = 11

// get info about logged-in user
router.get('/', [auth], async function (req, res) {
  res.status(200)
  res.json(req.player)
})

// register new user
router.post('/', async function (req, res) {
  const { password, login, pin } = req.body
  const hashedPassword = await bcrypt.hash(password, saltRounds)

  if (pin !== config.pin) {
    res.status(401)
    res.json({})
    return
  }

  const player = (
    await knex('players')
      .insert({
        login,
        hashed_password: hashedPassword,
      })
      .returning('*')
  )[0]

  req.session.playerId = player.id

  res.status(201)
  res.json({ login, playerId: player.id })
})

router.post('/login', async function (req, res) {
  const { password, login } = req.body

  const player = await knex('players')
    .select('*')
    .where({
      login,
    })
    .first()

  if (!player) {
    res.status(401)
    res.json({})
    return
  }

  const passwordMatch = await bcrypt.compare(password, player.hashed_password)

  if (!passwordMatch) {
    res.status(401)
    res.json({})
    return
  }

  req.session.playerId = player.id

  res.status(200)
  res.json({ playerId: player.id })
})

router.post('/logout', [auth], async function (req, res) {
  req.session.destroy()
  res.status(200)
  res.json({})
})

export default router
