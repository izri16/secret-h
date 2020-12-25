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

/*
JSON conf schema >>>
action: oneOf('chooseCancelar', 'vote', 'president-turn', 'chancellor-turn', ...)
president: playerId
chancellor: playerId
prevPresident: playerId
prevChancellor: playerId
drawPileCount: number
discardPileCount: number
liberalLawsCount: number
fascistsLawsCount: number
failedElectionsCount: number
veto: false

JSON secret_conf schema >>>
remainingLaws: ['liberal', 'fascist', ...]
discartedLaws: ['fascist']
presidentLaws?: ['liberal', 'fascist', 'fascist']
chancellorLaws?: ['liberal', 'fascist']
*/
