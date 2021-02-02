import express from 'express'
import bcrypt from 'bcrypt'
import * as Yup from 'yup'

import {CommonRegistrationSchema, LoginSchema} from 'common/schemas.js'
import knex from '../knex/knex.js'
import {auth} from '../middlewares/auth.js'
import {requestShape, responseShape} from '../middlewares/schema.js'
import {config} from '../config.js'
import {getPlayer} from '../utils.js'

const router = express.Router()

const UserResponseSchema = Yup.object({
  id: Yup.string().uuid().required(),
  login: Yup.string().required(),
})
  .noUnknown(true)
  .strict()

// get info about logged-in user
router.get(
  '/',
  [auth],
  responseShape(UserResponseSchema),
  async function (req, res) {
    const player = await getPlayer(req.playerId)
    res.status(200)
    res.json(player)
  }
)

// register new user
router.post(
  '/',
  [
    requestShape({body: Yup.object(CommonRegistrationSchema)}),
    responseShape(UserResponseSchema),
  ],
  async function (req, res) {
    const saltRounds = 11
    const {password, login, pin} = req.body
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const error = () => {
      res.status(400)
      res.json({})
    }

    if (pin !== config.pin) {
      return error()
    }

    const playerExists = !!(await knex('players')
      .select('id')
      .where({
        login,
      })
      .first())
    if (playerExists) {
      return error()
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
  [requestShape({body: LoginSchema}), responseShape(UserResponseSchema)],
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
      res.json({reason: 'Invalid credentials'})
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

router.post('/logout', [auth], async function (req, res) {
  req.session.destroy()
  res.status(200)
  res.json({})
})

export default router
