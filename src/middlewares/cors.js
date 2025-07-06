/**
 * Generate CORS Configuration
 * - This function generates the CORS configuration based on environment variables.
 * - It allows for flexible configuration of allowed origins, headers, methods, and other CORS
 */
function generateConfiguration() {
  const env = process.env
  const originsRaw = env.CORS_ORIGIN || ''
  let allowAllOrigins = originsRaw.trim() === '*'
  let allowedOriginList = allowAllOrigins ? [] :
    originsRaw.split(',')
      .map(o => o.trim())
      .filter(Boolean)
      .filter(o => /^https?:\/\/[a-zA-Z0-9.-]+(:\d+)?$/.test(o))
  if (!(allowAllOrigins) && !(allowedOriginList.length)) {
    allowedOriginList = ['https://yourdomain.com']
  }
  const allowedHeaders = (env.CORS_ALLOWED_HEADERS || 'content-type,authorization,x-requested-with').split(',').map(h => h.trim().toLowerCase()).filter(Boolean)
  const exposedHeaders = (env.CORS_EXPOSED_HEADERS || '').split(',').map(h => h.trim()).filter(Boolean)
  return {
    allowAllOrigins,
    allowedOriginList,
    credentials: env.CORS_CREDENTIALS === 'true',
    methods: (env.CORS_METHODS || 'GET,POST,PUT,DELETE,OPTIONS').split(',').map(m => m.trim()).filter(Boolean),
    allowedHeaders,
    exposedHeaders,
    maxAge: Number(env.CORS_MAX_AGE) || 86400,
    optionsSuccessStatus: Number(env.CORS_OPTIONS_STATUS) || 204
  }
}

/**
 * CORS Middleware
 * - This middleware handles CORS requests by setting appropriate headers based on the configuration.
 * - It checks the request origin against allowed origins and responds accordingly.
 */
function corsMiddleware(req, res, next) {
  const config = generateConfiguration()
  const origin = req.get('Origin')
  let allowOriginValue = ''
  if (config.allowAllOrigins) {
    allowOriginValue = config.credentials && origin ? origin : '*'
  } else if (origin && config.allowedOriginList.includes(origin)) {
    allowOriginValue = origin
  } else {
    return res.api('forbidden')
  }
  res.set('Access-Control-Allow-Origin', allowOriginValue)
  res.set('Access-Control-Allow-Headers', config.allowedHeaders.join(','))
  res.set('Access-Control-Allow-Methods', config.methods.join(','))
  res.set('Vary', 'Origin')
  if (config.credentials && origin) res.set('Access-Control-Allow-Credentials', 'true')
  if (config.maxAge) res.set('Access-Control-Max-Age', config.maxAge.toString())
  if (config.exposedHeaders.length) res.set('Access-Control-Expose-Headers', config.exposedHeaders.join(','))
  if (req.method === 'OPTIONS') {
    res.sendStatus(config.optionsSuccessStatus)
    return
  }
  next()
}

/**
 * Export
 */
module.exports = corsMiddleware