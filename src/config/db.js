/**
 * Database Config
 * This file sets up the database connection using Knex.js.
 * It reads configuration from environment variables defined in the .env file.
 */
require('dotenv').config({ debug: process.env.APP_DEBUG === 'true' })
const knex = require('knex')
const databaseClient = knex({
  client: process.env.DB_CLIENT,
  connection: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectTimeout: 10000
  },
  pool: {
    min: 2,
    max: 10,
    acquireTimeoutMillis: 10000,
    createTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
    reapIntervalMillis: 1000,
    propagateCreateError: false
  }
})

/**
 * Exports
 */
module.exports = databaseClient