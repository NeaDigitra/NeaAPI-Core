const express = require('express')
const app = express()

/**
 * Global Configuration
 * - This section imports global configurations and services required for the application
 * - It includes database configuration, application settings, rate limiting, and Redis service
 */
global = {
  db: require('config/db'),
  app: require('config/app'),
  rateLimit: require('config/ratelimit'),
  redis: require('services/redis')
}

/**
 * Middleware Setup
 * - Disables the 'x-powered-by' header for security reasons
 * - Sets up body parsing middleware for JSON and URL-encoded data with a limit of 1MB
 * - This prevents the server from revealing its technology stack and limits the size of incoming requests
 */
app.disable('x-powered-by')
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))

/**
 * Core Middleware
 * - Sets up middleware for logging, response formatting, fingerprinting, and signature validation
 * - The 'logger' middleware logs incoming requests to the console
 * - The 'response' middleware formats API responses in a standardized way
 * - The 'fingerprint' middleware generates a unique fingerprint for each request based on the client's headers
 * - The 'signature' middleware validates the signature of incoming requests to ensure authenticity
 * - THE 'cors' middleware handles Cross-Origin Resource Sharing (CORS) to allow requests from different origins
 * - The 'errors' route handles error-related requests
 */
const apiLogger = require('middlewares/logger')
const apiResponse = require('middlewares/response')
const apiFingerprint = require('middlewares/fingerprint')
const apiSignature = require('middlewares/signature')
const apiRateLimit = require('middlewares/ratelimit')
const apiSession = require('middlewares/session')
const apiCors = require('middlewares/cors')
app.use(apiFingerprint)
app.use(apiResponse)
app.use(apiLogger)
app.use(apiCors)

/**
 * API Routes
 * - Handles all API requests
 * - The 'example' route handles example-related requests
 * - The 'general' route handles general requests
 * - The 'secure' route handles secure requests with API signature validation
 * - The 'health' route checks the health of the application
 * - The 'errors' route handles error-related requests
 */
app.use('/api/example', require('routes/all'))
app.use('/api/general', apiRateLimit.setup, require('routes/general'))
app.use('/api/secure', apiRateLimit.setup, apiSession, apiSignature, require('routes/all'))
app.use('/health', require('routes/health'))
app.use('/errors', require('routes/errors'))

/**
 * Catch-all Route
 * - Handles requests to undefined routes
 * - Returns a standardized 'not_found' error response
 */
app.use((req, res, next) => {
  return res.api('not_found')
})

/**
 * Error Handling Middleware
 * - Catches all errors that occur in the application
 * - Logs the error to the console
 */
app.use((err, req, res, next) => {
  console.error(`[${global.app.appName}-${global.app.appVersion}] Error:`, err.message, err.stack)
  if (err.type === 'entity.too.large') {
    return res.api('payload_too_large')
  } else if (err.type === 'entity.parse.failed') {
    return res.api('bad_request')
  } else if (err.type === 'entity.verify.failed') {
    return res.api('verification_failed')
  }
  return res.api('internal_error')
})

/**
 * Initialize Cloudflare IP Service
 * - This service is responsible for fetching and caching Cloudflare IPs
 * - If the service fails to initialize, the application will log the error and exit
 * - If successful, the server will start listening on the specified port
 */
apiRateLimit.initCloudflareIpService().then(() => {
  console.log(`[${global.app.appName}-${global.app.appVersion}] Cloudflare IP Service Initialized`)
  const port = parseInt(global.app.appPort, 10) || 3000
  const host = '0.0.0.0'
  app.listen(port, host, () => {
    console.log(`[${global.app.appName}-${global.app.appVersion}] Server Started on ${host}:${port}`)
    console.log(`[${global.app.appName}-${global.app.appVersion}] Error Base URL: ${global.app.errorBaseUrl}`)
  }).on('error', (err) => {
    console.error(`[${global.app.appName}-${global.app.appVersion}] Server Error:`, err.message)
    if (err.code === 'EADDRINUSE') {
      console.error(`[${global.app.appName}-${global.app.appVersion}] Port ${port} Is Already In Use`)
    }
    process.exit(1)
  })
}).catch((err) => {
  console.error(`[${global.app.appName}-${global.app.appVersion}] Error Initializing Cloudflare IP Service:`, err.stack)
  process.exit(1)
})