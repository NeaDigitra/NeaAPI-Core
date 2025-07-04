/**
 * Logger Middleware
 * - Logs incoming requests to the console
 * - Useful for debugging and monitoring API usage
 */
module.exports = (name) => (req, res, next) => {
  const { method, url } = req
  const timestamp = new Date().toISOString()
  console.log(`[${name}-HTTP] [${timestamp}] ${method} ${url}`)
  next()
}