const express = require('express')
const app = express()

/**
 * Load Configuration
 * - This file contains the application name and version.
 */
const { appName, appVersion, appPort, errorBaseUrl } = require('./config/app')

/**
 * NeaCore Middlewares
 * - These middlewares are essential for the API's functionality.
 * - They handle logging, response formatting, request fingerprinting, and signature validation.
 */
const apiLogger = require('./middlewares/logger')(appName)
const apiResponse = require('./middlewares/response')
const apiFingerprint = require('./middlewares/fingerprint')
const apiSignature = require('./middlewares/signature')

/**
 * Middleware Setup
 * - Limits request body size to 1MB
 * - Parses incoming JSON requests and urlencoded data
 */
app.disable('x-powered-by')
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))

/**
 * Internal Middleware
 * - These middlewares are used for logging, response formatting, and request fingerprinting
 * - They are applied to all API requests to ensure consistent handling and logging
 */
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
app.use('/api/example', require('./routes/all'))
app.use('/api/general', require('./routes/general'))
app.use('/api/secure', apiSignature, require('./routes/all'))
app.use('/errors', require('./routes/errors'))

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
 * - Logs the port and error base URL to the console
 */
app.listen(parseInt(appPort, 10) || 3000, () => {
  console.log(`[${appName}-${appVersion}] Server started on port ${appPort || 3000}`)
  console.log(`[${appName}-${appVersion}] Error base URL: ${errorBaseUrl}`)
})