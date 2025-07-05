const { appName } = require('config/app')
const redis = require('redis')

/**
 * Redis Client Configuration
 * - This module exports a Redis client instance configured with environment variables.
 */
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  password: process.env.REDIS_PASSWORD || undefined
})

/**
 * Event Listeners
 * - Handles connection errors and logs when the client is ready.
 * - This is crucial for debugging and ensuring the Redis client is operational.
 */
redisClient.on('error', (err) => {
  console.error(`[${appName}-Redis] Client Error:`, err.stack)
}).on('ready', () => {
  console.log(`[${appName}-Redis] Client Connected Successfully`)
}).connect()

/**
 * Exports
 */
module.exports = redisClient