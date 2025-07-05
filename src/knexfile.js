/**
 * Knex Configuration For Migrations
 * - This file is used to configure the database connection for migrations.
 * - It reads environment variables to set up the connection parameters.
 */
require('dotenv').config({ path: '../.env', debug: process.env.APP_DEBUG === 'true' })
const config = {
  development: {
    client: process.env.DB_CLIENT,
    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    },
    pool: { min: 2, max: 10 },
    migrations: { directory: './migrations' },
    seeds: { directory: './seeds' }
  }
}

/**
 * Exports
 */
module.exports = config