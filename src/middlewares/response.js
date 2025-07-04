const generateError = require('helpers/response/generator')

/**
 * Generate Log Trace
 * - This function generates a log trace for the API request.
 * - It includes the method, request ID, URL, timestamp, and response time.
 */
function generateLogTrace(request, response) {
  return {
    method: request.method,
    hash: request.fingerprint || 'unknown',
    path: request.originalUrl || request.url,
    timestamp: new Date().toISOString(),
    responseTime: response.responseTime
  }
}

/**
 * RFC7807 Success Response
 * - This function generates a success response for the API.
 * - It includes the status code, message, data, and trace.
 */
function successResponse(request, response, data = null, message = 'OK', status = 200) {
  const trace = generateLogTrace(request, response)
  const rawData = { status, message, data, trace }
  return response.status(status).json(rawData)
}

/**
 * RFC7807 Error Response
 * - This function generates an error response for the API.
 * - It includes the status code, type, title, detail, instance, errors, and
 */
function errorResponse(request, response, identifier, details = {}) {
  const { status, type, title, detail, instance, errors } = generateError(request, identifier, details)
  const trace = generateLogTrace(request, response)
  const rawData = { status, type, title, detail, instance, errors, trace }
  return response.status(status).json(rawData)
}

/**
 * Response Formatter Middleware
 * - This middleware formats the API response based on the request and response objects.
 * - It provides a standardized way to send success and error responses.
 */
module.exports = function (req, res, next) {
  const requestStartTime = process.hrtime()
  res.api = function (id, data = null, message = null) {
    const diff = process.hrtime(requestStartTime)
    const timeInMs = (diff[0] * 1e3) + (diff[1] / 1e6)
    res.responseTime = `${timeInMs.toFixed(3)}ms`
    if (id === 'success') {
      return successResponse(req, res, data, message || 'OK')
    } else {
      return errorResponse(req, res, id, data || {})
    }
  }
  next()
}