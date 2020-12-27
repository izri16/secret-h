import './pg.js'

import {config} from './config.js'
import {__dirname} from './nodeUtils.js'

export default {
  client: 'pg',
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
