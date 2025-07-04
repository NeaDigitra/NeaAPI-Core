const crypto = require('crypto')

/**
 * Generate Fingerprint Hash
 * - This function generates a unique fingerprint for the client based on their request headers.
 */
function generateFingerprint(request) {
  const clientUserAgent = request.headers['user-agent'] || ''
  const clientAcceptType = request.headers['accept'] || ''
  const clientLanguage = request.headers['accept-language'] || ''
  const clientSecUa = request.headers['sec-ch-ua'] || ''
  const combinedRawData = [clientUserAgent, clientAcceptType, clientLanguage, clientSecUa].join('|')
  return crypto.createHash('sha256').update(combinedRawData).digest('hex')
}

/**
 * Fingerprint Middleware
 * - This middleware generates a unique fingerprint for each request based on the client's headers.
 */
module.exports = (req, res, next) => {
  req.fingerprint = generateFingerprint(req)
  next()
}