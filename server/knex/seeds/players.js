import bcrypt from 'bcrypt'

const saltRounds = 8

exports.seed = async function (knex) {
  await knex('players').del()

  const playerLogins = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
  ]

  const dataToInsert = await Promise.all(
    playerLogins.map(async (login) => {
      const hash = await bcrypt.hash(login, saltRounds)
      return {login, hashed_password: hash}
    })
  )

  await knex('players').insert(dataToInsert)
}
