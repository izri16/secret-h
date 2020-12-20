
exports.up = async function(knex) {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
  
  await knex.schema
    .createTable('players', table => {
      table
        .uuid('id')
        .defaultTo(knex.raw('uuid_generate_v4()'))
        .primary()
      table.string('login').unique()
      table.string('hashed_password')
    })

  await knex.schema
    .createTable('games', table => {
      table
        .uuid('id')
        .defaultTo(knex.raw('uuid_generate_v4()'))
        .primary()
      table.uuid('created_by').references('players.id').onDelete('CASCADE')
      table.integer('number_of_players').unsigned()
      table.boolean('active').default(false)
    })

  await knex.schema
    .createTable('player_to_game', table => {
      table.uuid('game_id').references('games.id').onDelete('CASCADE')
      table.uuid('player_id').references('players.id').onDelete('CASCADE')
      table.boolean('killed').default(false)
      table.integer('order')
      table.string('race')
      table.primary(['player_id', 'game_id'])
    })
}

exports.down = async function(knex) {
  await knex.schema.dropTable('player_to_game')
  await knex.schema.dropTable('games')
  await knex.schema.dropTable('players')
  await knex.raw('DROP EXTENSION IF EXISTS "uuid-ossp"')
}
