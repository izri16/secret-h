import express from 'express'
import bcrypt from 'bcrypt'
import * as Yup from 'yup'

import {CommonRegistrationSchema, LoginSchema} from 'common/schemas.js'
import knex from '../knex/knex.js'
import {auth} from '../middlewares/auth.js'
import {validateRequest} from '../middlewares/schema.js'
import {config} from '../config.js'
import {getPlayer} from '../utils.js'

const router = express.Router()

// get info about logged-in user
router.get('/', [auth], async function (req, res) {
  const player = await getPlayer(req.playerId)
  res.status(200)
  res.json(player)
})

// register new user
router.post(
  '/',
  [validateRequest({body: Yup.object(CommonRegistrationSchema)})],
  async function (req, res) {
    const saltRounds = 11
    const {password, login, pin} = req.body
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const authError = () => {
      res.status(401)
      res.json('Invalid PIN or user exists')
    }

    if (pin !== config.pin) {
      return authError()
    }

    const playerExists = !!(await knex('players')
      .select('id')
      .where({
        login,
      })
      .first())
    if (playerExists) {
      return authError()
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
    res.json({login, id: player.id})
  }
)

router.post(
  '/login',
  [validateRequest({body: LoginSchema})],
  async function (req, res) {
    const {password, login} = req.body

    const player = await knex('players')
      .select('*')
      .where({
        login,
      })
      .first()

    const authError = () => {
      res.status(401)
      res.json('Invalid credentials')
    }

    if (!player) {
      // dummy hashing
      await bcrypt.compare(password, password)
      return authError()
    }

    const passwordMatch = await bcrypt.compare(password, player.hashed_password)
    if (!passwordMatch) {
      return authError()
    }

    req.session.playerId = player.id
    res.status(200)
    res.json({login, id: player.id})
  }
)

router.post(
  '/logout',
  [validateRequest({})],
  [auth],
  async function (req, res) {
    req.session.destroy()
    res.status(200)
    res.json({})
  }
)

export default router
