const router = require('express').Router()

/**
 * Helper Function To Test Database Connectivity
 * - This function attempts to run a simple query against the database
 */
async function checkDatabase() {
  try {
    await global.db.raw('SELECT 1')
    return { healthy: true }
  } catch (error) {
    return { healthy: false, error: error.message }
  }
}

/**
 * Helper Function To Test Redis Connectivity
 * - This function attempts to ping the Redis server
 */
async function checkRedis() {
  try {
    const redisClient = global.redis()
    await redisClient.ping()
    return { healthy: true }
  } catch (error) {
    return { healthy: false, error: error.message }
  }
}

/**
 * Liveness Probe
 * - Simple endpoint to check if the application is running
 * - Returns 200 if the server is alive
 */
router.get('/live', (req, res) => {
  return res.api('success', {
    status: 'alive',
    timestamp: new Date().toISOString()
  })
})

/**
 * Readiness Probe
 * - Checks if the application is ready to handle requests
 * - Comprehensive health check including database and Redis connectivity
 */
router.get('/ready', async (req, res) => {
  const [database, redis] = await Promise.all([checkDatabase(), checkRedis()])
  const checks = {
    database: database.healthy,
    redis: redis.healthy,
    timestamp: new Date().toISOString()
  }
  if (!(database.healthy)) {
    checks.databaseError = database.error
  }
  if (!(redis.healthy)) {
    checks.redisError = redis.error
  }
  const isHealthy = database.healthy && redis.healthy
  if (isHealthy) {
    return res.api('success', { status: 'ready', checks })
  } else {
    return res.api('service_unavailable', checks)
  }
})

/**
 * Legacy Health Endpoint
 * - For backward compatibility with older clients
 * - Checks database and Redis connectivity
 */
router.get('/health', async (req, res) => {
  const [database, redis] = await Promise.all([checkDatabase(), checkRedis()])
  if (database.healthy && redis.healthy) {
    return res.sendStatus(200)
  } else {
    return res.sendStatus(503)
  }
})

/**
 * Startup Probe
 * - Checks if the application has finished initialization
 * - Used during application startup phase
 */
router.get('/startup', (req, res) => {
  const isInitialized = global.db && global.redis && global.app
  if (isInitialized) {
    return res.api('success', {
      status: 'initialized',
      timestamp: new Date().toISOString(),
      services: {
        database: !!(global.db),
        redis: !!(global.redis),
        app: !!(global.app)
      }
    })
  } else {
    return res.api('service_unavailable', {
      status: 'initializing',
      timestamp: new Date().toISOString()
    })
  }
})

/**
 * Detailed Status Endpoint
 * - Provides comprehensive application status information
 * - Includes version, memory usage, and service status
 */
router.get('/status', async (req, res) => {
  const [database, redis] = await Promise.all([checkDatabase(), checkRedis()])
  const status = {
    application: {
      name: global.app.appName,
      version: global.app.appVersion,
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    },
    system: {
      nodeVersion: process.version,
      platform: process.platform,
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
      },
      pid: process.pid
    },
    services: {
      database: database.healthy,
      redis: redis.healthy
    }
  }
  if (!(database.healthy)) {
    status.services.databaseError = database.error
  }
  if (!(redis.healthy)) {
    status.services.redisError = redis.error
  }
  return res.api('success', status)
})

/**
 * Metrics Endpoint
 * - Provides system metrics such as memory usage and CPU statistics
 * - Used by monitoring systems like Prometheus
 */
router.get('/metrics', (req, res) => {
  const memUsage = process.memoryUsage()
  const metrics = {
    memory_usage_bytes: memUsage.heapUsed,
    memory_total_bytes: memUsage.heapTotal,
    memory_external_bytes: memUsage.external,
    memory_rss_bytes: memUsage.rss,
    cpu_usage: process.cpuUsage(),
    timestamp: Date.now(),
    version: global.app.appVersion
  }
  return res.setHeader('Content-Type', 'application/json').json(metrics)
})

/**
 * Deep Health Check Endpoint
 * - Performs a comprehensive health check including database and Redis connectivity
 * - Includes response time measurements
 */
router.get('/deep', async (req, res) => {
  const startTime = process.hrtime()
  const checks = {
    timestamp: new Date().toISOString(),
    application: {
      status: 'healthy',
      version: global.app.appVersion
    },
    database: {
      status: 'unknown',
      responseTime: null
    },
    redis: {
      status: 'unknown',
      responseTime: null
    }
  }
  try {
    const dbStart = process.hrtime()
    await global.db.raw('SELECT 1')
    const dbDiff = process.hrtime(dbStart)
    checks.database.status = 'healthy'
    checks.database.responseTime = `${((dbDiff[0] * 1000) + (dbDiff[1] / 1000000)).toFixed(3)}ms`
  } catch (error) {
    checks.database.status = 'unhealthy'
    checks.database.error = error.message
  }
  try {
    const redisStart = process.hrtime()
    const redisClient = global.redis()
    await redisClient.ping()
    const redisDiff = process.hrtime(redisStart)
    checks.redis.status = 'healthy'
    checks.redis.responseTime = `${((redisDiff[0] * 1000) + (redisDiff[1] / 1000000)).toFixed(3)}ms`
  } catch (error) {
    checks.redis.status = 'unhealthy'
    checks.redis.error = error.message
  }
  const totalDiff = process.hrtime(startTime)
  checks.totalResponseTime = `${((totalDiff[0] * 1000) + (totalDiff[1] / 1000000)).toFixed(3)}ms`
  const isHealthy = checks.database.status === 'healthy' && checks.redis.status === 'healthy'
  if (isHealthy) {
    return res.api('success', checks)
  } else {
    return res.api('service_unavailable', checks)
  }
})

/**
 * Exports
 */
module.exports = router