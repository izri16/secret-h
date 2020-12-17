
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
}

exports.down = async function(knex) {
  await knex.schema.dropTable('players')
}
