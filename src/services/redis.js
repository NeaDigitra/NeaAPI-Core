const redis = require('redis')
let redisClient = null

/**
 * Create Redis Client
 * - This function initializes a Redis client with the provided configuration.
 * - It connects to the Redis server using the URL and password from environment variables.
 * - Returns a singleton instance to avoid multiple connections
 */
function createRedisClient() {
  if (!redisClient) {
    redisClient = redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD
    })
    if (process.env.NODE_ENV !== 'test') {
      redisClient.on('error', (err) => console.error(`[${global.app.appName}-Redis] Client Error:`, err.stack))
      redisClient.on('ready', () => console.log(`[${global.app.appName}-Redis] Client Connected Successfully`))
      redisClient.on('end', () => console.log(`[${global.app.appName}-Redis] Client Disconnected`))
    }
    redisClient.connect().catch((err) => {
      console.error(`[${global.app.appName}-Redis] Connection Error:`, err.message)
    })
  }
  return redisClient
}

/**
 * Exports
 */
module.exports = createRedisClient