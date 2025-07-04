const crypto = require('crypto')

/**
 * Validate Signature
 * - This middleware checks the signature of incoming requests
 * - It ensures that the request has a valid signature and secret
 */
function validateSignature(req, res, next) {
  if (req.signatureChecked) {
    return next()
  }
  const clientSignature = resolveClientAuth(req, 'x-signature')
  if (!(clientSignature)) {
    return res.api('unauthorized', {}, 'Signature Missing')
  }
  const clientSecret = resolveClientAuth(req, 'x-secret')
  if (!(clientSecret)) {
    return res.api('forbidden', {}, 'Secret Missing')
  }
  const dataString = buildDataString(req)
  const generatedSignature = generateHash(dataString, clientSecret)
  if (generatedSignature !== clientSignature) {
    return res.api('forbidden', {}, 'Invalid Signature')
  }
  req.signatureChecked = true
  next()
}

/**
 * Build Data String
 * - Combines query, body, and params into a single string
 * - Sorts the keys and formats them as key=value pairs
 */
function buildDataString(req) {
  const combined = Object.assign({}, req.query || {}, req.body || {})
  delete combined['x-secret']
  delete combined['x-signature']
  const keys = Object.keys(combined).sort()
  if (keys.length === 0) {
    return ''
  }
  console.log(keys);
  const parts = keys.map(function (key) {
    let value = combined[key]
    if (Array.isArray(value)) {
      value = value.join(',')
    } else if (typeof value === 'object' && value !== null) {
      value = JSON.stringify(value)
    }
    return key + '=' + value
  })
  return parts.join('&')
}

/**
 * Generate Hash
 * - Creates a SHA-256 hash of the data string and secret
 */
function generateHash(string, secret) {
  return crypto.createHash('sha256').update(`${string}${secret}`).digest('hex')
}

/**
 * Resolve Client Authentication
 * - Checks various parts of the request for the specified authentication parameter
 * - Returns the value if found, otherwise returns null
 */
function resolveClientAuth(req, parameter) {
  if (req.headers && req.headers[parameter]) {
    return req.headers[parameter]
  }
  if (req.body && parameter in req.body) {
    return req.body[parameter]
  }
  if (req.query && parameter in req.query) {
    return req.query[parameter]
  }
  return null
}

/**
 * Signature Validation Middleware
 * - Validates the signature of incoming requests
 */
module.exports = Object.assign(validateSignature, {
  generateHash,
  buildDataString,
  resolveClientAuth
})