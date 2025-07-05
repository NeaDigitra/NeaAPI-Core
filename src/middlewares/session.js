const { findUserByApiKey } = require('models/userModel')

/**
 * Session Validator Middleware
 * - This middleware checks if the request has a valid API key.
 * - It retrieves the user associated with the API key and attaches it to the request object.
 */
const sessionValidator = async function (req, res, next) {
  const apiKey = req.headers['x-secret'] || req.query['x-secret'] || req.body['x-secret']
  if (!(apiKey)) {
    return res.api('unauthorized')
  }
  try {
    const user = await findUserByApiKey(apiKey)
    if (!(user)) {
      return res.api('unauthorized')
    }
    req.user = user
    next()
  } catch (error) {
    return res.api('internal_error')
  }
}

/**
 * Exports
 */
module.exports = sessionValidator