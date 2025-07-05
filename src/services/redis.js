const redis = require('redis')

/**
 * Redis Client Configuration
 * - This module exports a Redis client instance configured with environment variables.
 * - It connects to a Redis server using the URL and password specified in the environment variables.
 */
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  password: process.env.REDIS_PASSWORD || undefined
})
redisClient.connect()

/**
 * Exports
 */
module.exports = redisClient