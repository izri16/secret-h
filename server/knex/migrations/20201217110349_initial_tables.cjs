exports.up = async function (knex) {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

  await knex.schema.createTable('players', (table) => {
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary()
    table.string('login').unique()
    table.string('hashed_password')
  })

  await knex.schema.createTable('games', (table) => {
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary()
    table.uuid('created_by').references('players.id').onDelete('CASCADE')
    table.integer('number_of_players').unsigned()
    table.boolean('active').default(false)
    table.json('conf')
    table.json('secret_conf')
    table.json('players')
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('player_to_game')
  await knex.schema.dropTable('games')
  await knex.raw('DROP EXTENSION IF EXISTS "uuid-ossp"')
}

// TODO: next steps
// -3: Better loging && error handling (inak sa neda kodit)
// -1: president-turn (today)
// 0. run all queries in transaction
// 1. Show correct amount of players with logins and in correct order
// 2. Highligh current president
// 3. Choose next cancellor action
// 4. Vote action

/*
JSON conf schema >>>
action: oneOf('chooseCancelar', 'vote', 'shoot', ...)
president: playerId
remainingCardsCount: number
discardedCardsCount: number
liberalLawsCount: number
fascistLawsCount: number

JSON secret_conf schema >>>
remainingCards: ['l', 'f', 'f', 'l', 'l']
discardedCards: ['l', 'f']
*/
