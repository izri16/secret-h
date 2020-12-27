// Nasty hack, for nasty knex/pg/heroku issue
// https://stackoverflow.com/questions/61785729/knex-heroku-error-self-signed-certificate
// https://www.gaticonsulting.com/blog/self-signed-certificate-in-certificate-chain/
import pg from 'pg'

pg.defaults.ssl = {
  rejectUnauthorized: false,
  ssl: true,
}
