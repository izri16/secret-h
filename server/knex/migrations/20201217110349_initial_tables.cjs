
exports.up = async function(knex) {
  await knex.schema
    .createTable('players', table => {
      table
        .increments('id')
        .primary()
        .unsigned()
      table.string('login').unique()
      table.string('hashed_password')
    })

  await knex.schema
    .createTable('games', table => {
      table
        .increments('id')
        .primary()
        .unsigned()
      table.integer('created_by').references('players.id').onDelete('CASCADE')
      table.integer('number_of_players').unsigned()
      table.boolean('is_ready').default(false)
    })

  await knex.schema
    .createTable('player_to_game', table => {
      table.integer('game_id').references('games.id').onDelete('CASCADE')
      table.integer('player_id').references('players.id').onDelete('CASCADE')
      table.boolean('killed').default(false)
      table.integer('order')
      table.primary(['player_id', 'game_id'])
    })
}

exports.down = async function(knex) {
  await knex.schema.dropTable('player_to_game')
  await knex.schema.dropTable('games')
  await knex.schema.dropTable('players')
}
