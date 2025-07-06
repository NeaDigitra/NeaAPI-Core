/**
 * Knex Configuration For Migrations
 * - This file is used to configure Knex for database migrations and seeding.
 * - It reads environment variables from a .env file to set up the database connection.
 */
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env'), debug: process.env.APP_DEBUG === 'true' })
const env = process.env.NODE_ENV || 'development'
const base = {
  client: process.env.DB_CLIENT,
  connection: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  },
  pool: { min: 2, max: 10 },
  migrations: { directory: path.resolve(__dirname, 'migrations') },
  seeds: { directory: path.resolve(__dirname, 'seeds') }
}

/**
 * Exports For Different Environments
 * - Exports the configuration based on the current environment.
 * - Uses the same configuration for both development and production.
 */
module.exports = { development: base, production: base }[env]