
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
      table.integer('player_id').references('players.id').onDelete('CASCADE')
      table.integer('number_of_players').unsigned()
    })
}

exports.down = async function(knex) {
  await knex.schema.dropTable('games')
  await knex.schema.dropTable('players')
}
