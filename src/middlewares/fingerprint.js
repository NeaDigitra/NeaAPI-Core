const crypto = require('crypto')

/**
 * Generate Fingerprint Hash
 * - This function generates a unique fingerprint for the client based on their request headers.
 * - It combines several headers to create a hash that identifies the client.
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
 * Exports
 */
module.exports = (req, res, next) => {
  req.fingerprint = generateFingerprint(req)
  next()
}