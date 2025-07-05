/**
 * Rate Limit Config
 * - This module exports the rate limit settings for the application.
 * - It uses environment variables to set the maximum number of requests and the time window for rate
 */
require('dotenv').config({ debug: process.env.APP_DEBUG === 'true' })
module.exports = {
  maxRequests: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  windowSeconds: parseInt(process.env.RATE_LIMIT_WINDOW, 10) || 60,
  updateInterval: parseInt(process.env.RATE_LIMIT_UPDATE_INTERVAL, 10) || 3600000
}