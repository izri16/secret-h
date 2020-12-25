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

// TODO: next steps (till new year)
// 0. run all queries in transaction
// 5. cleanup
// => define schema in this file
// => getData schema object check on each return

// TODO: future
// 6. liberal / fascist win (game info)
// 7. actions
// 8. better logging

// TODO: pre-prod
// 9. style login / register / loading screens
// 10. style select game screen

/*
JSON conf schema >>>
action: oneOf('chooseCancelar', 'vote', 'shoot', ...)
president: playerId
remainingCardsCount: number
discardedCardsCount: number
liberalLawsCount: number
fascistsLawsCount: number

JSON secret_conf schema >>>
remainingCards: ['l', 'f', 'f', 'l', 'l']
discardedCards: ['l', 'f']
*/
