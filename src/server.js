const express = require('express')
const app = express()

/**
 * Load Configuration
 * - This file contains the application name and version.
 */
const { appName, appVersion, appPort, errorBaseUrl } = require('config/app')

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
 * - The 'errors' route handles error-related requests
 */
const apiLogger = require('middlewares/logger')(appName)
const apiResponse = require('middlewares/response')
const apiFingerprint = require('middlewares/fingerprint')
const apiSignature = require('middlewares/signature')
app.use(apiFingerprint)
app.use(apiResponse)
app.use(apiLogger)

/**
 * API Routes
 * - Handles all API requests
 * - The 'example' route handles example-related requests
 * - The 'general' route handles general requests
 * - The 'secure' route handles secure requests with API signature validation
 * - The 'errors' route handles error-related requests
 */
app.use('/api/example', require('routes/all'))
app.use('/api/general', require('routes/general'))
app.use('/api/secure', apiSignature, require('routes/all'))
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
  console.error(`[${appName}-${appVersion}] Error:`, err.message, err.stack)
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
 * Start the server
 * - Listens on the specified port from the configuration
 */
app.listen(parseInt(appPort, 10) || 3000, () => {
  console.log(`[${appName}-${appVersion}] Server started on port ${appPort || 3000}`)
  console.log(`[${appName}-${appVersion}] Error base URL: ${errorBaseUrl}`)
})