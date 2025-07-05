const { appName } = require('config/app')
const redis = require('redis')

/**
 * Create Redis Client
 * - This function initializes a Redis client with the provided configuration.
 * - It connects to the Redis server using the URL and password from environment variables.
 */
function createRedisClient() {
  const client = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    username: process.env.REDIS_USERNAME || undefined,
    password: process.env.REDIS_PASSWORD || undefined
  })
  if (process.env.NODE_ENV !== 'test') {
    client.on('error', (err) => console.error(`[${appName}-Redis] Client Error:`, err.stack))
    client.on('ready', () => console.log(`[${appName}-Redis] Client Connected Successfully`))
  }
  return client
}

/**
 * Exports
 */
module.exports = createRedisClient