import { dirname } from 'path'
import { fileURLToPath } from 'url'

import { config } from './config.js'

// Note: there is not __dirname when "type: module" for node
const __dirname = dirname(fileURLToPath(import.meta.url))

export default {
  client: 'postgresql',
  connection: config.dbConnection,
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: __dirname + '/knex/migrations',
  },
  seeds: {
    directory: __dirname + '/knex/seeds',
  },
}
