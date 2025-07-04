/**
 * App Config
 * - This module loads environment variables and exports application configuration settings.
 * - It includes application name, version, port, and error base URL.
 */
require('dotenv').config({ debug: process.env.APP_DEBUG === 'true' })
module.exports = {
  appName: process.env.APP_NAME || 'NeaCore API',
  appVersion: process.env.APP_VERSION || '1.0.0',
  appPort: parseInt(process.env.APP_PORT, 10) || 3000,
  errorBaseUrl: process.env.ERROR_BASE_URL || 'https://api.domain.com/errors'
}