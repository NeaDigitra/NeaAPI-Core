/**
 * Generate CORS Configuration
 * - This function generates the CORS configuration object based on environment variables.
 * - It checks for allowed origins, headers, methods, and other CORS settings.
 */
function generateConfiguration() {
  const environmentVariables = process.env
  const allowedOriginEnvironment = environmentVariables.CORS_ORIGIN
  let allowedOriginList = []
  let allowAllOrigins = false
  if (!!allowedOriginEnvironment) {
    if (allowedOriginEnvironment.trim() === '*') {
      allowAllOrigins = true
    } else {
      allowedOriginList = allowedOriginEnvironment.split(',').map(eachOrigin => eachOrigin.trim()).filter(eachOrigin => {
        if (!!eachOrigin && /^https?:\/\/[a-zA-Z0-9.-]+(:\d+)?$/.test(eachOrigin)) {
          return true
        } else {
          return false
        }
      })
    }
  }
  if (!(allowedOriginList.length) && !(allowAllOrigins)) {
    allowedOriginList = ['https://yourdomain.com']
  }
  let allowedHeadersList = []
  if (!!environmentVariables.CORS_ALLOWED_HEADERS) {
    allowedHeadersList = environmentVariables.CORS_ALLOWED_HEADERS.split(',').map(eachHeader => eachHeader.trim().toLowerCase())
  } else {
    allowedHeadersList = ['content-type', 'authorization', 'x-requested-with']
  }
  let exposedHeadersList = []
  if (!!environmentVariables.CORS_EXPOSED_HEADERS) {
    exposedHeadersList = environmentVariables.CORS_EXPOSED_HEADERS.split(',').map(eachHeader => eachHeader.trim())
  }
  return {
    allowAllOrigins,
    allowedOriginList,
    credentials: !!environmentVariables.CORS_CREDENTIALS && environmentVariables.CORS_CREDENTIALS === 'true',
    methods: !!environmentVariables.CORS_METHODS ? environmentVariables.CORS_METHODS.split(',').map(eachMethod => eachMethod.trim()) : ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: allowedHeadersList,
    exposedHeaders: exposedHeadersList,
    maxAge: !!environmentVariables.CORS_MAX_AGE ? Number(environmentVariables.CORS_MAX_AGE) : 86400,
    optionsSuccessStatus: !!environmentVariables.CORS_OPTIONS_STATUS ? Number(environmentVariables.CORS_OPTIONS_STATUS) : 204
  }
}

/**
 * CORS Middleware
 * - This middleware handles Cross-Origin Resource Sharing (CORS) requests.
 * - It checks the request's origin against allowed origins and sets appropriate headers.
 */
function corsMiddleware(requestData, responseData, nextHandler) {
  const corsConfiguration = generateConfiguration()
  const allowedOriginValue = process.env.CORS_ORIGIN || ''
  const requestOriginValue = requestData.get('Origin')
  let allowOriginHeaderValue = ''
  if (allowedOriginValue === '*') {
    if (corsConfiguration.credentials && !!(requestOriginValue)) {
      allowOriginHeaderValue = requestOriginValue
    } else {
      if (!(requestOriginValue)) {
        allowOriginHeaderValue = '*'
      } else {
        allowOriginHeaderValue = requestOriginValue
      }
    }
  } else {
    if (!!(requestOriginValue)) {
      if (
        (!!allowedOriginValue && corsConfiguration.allowedOriginList.includes(requestOriginValue)) ||
        (!allowedOriginValue && corsConfiguration.allowedOriginList.includes(requestOriginValue))
      ) {
        allowOriginHeaderValue = requestOriginValue
      } else {
        return responseData.api('forbidden')
      }
    } else {
      return responseData.api('forbidden')
    }
  }
  responseData.set('Access-Control-Allow-Origin', allowOriginHeaderValue)
  if (!!corsConfiguration.allowedHeaders && corsConfiguration.allowedHeaders.length > 0) {
    responseData.set('Access-Control-Allow-Headers', corsConfiguration.allowedHeaders.join(','))
  }
  if (!!corsConfiguration.methods && corsConfiguration.methods.length > 0) {
    responseData.set('Access-Control-Allow-Methods', corsConfiguration.methods.join(','))
  }
  if (!!corsConfiguration.credentials) {
    responseData.set('Access-Control-Allow-Credentials', 'true')
  }
  if (!!corsConfiguration.maxAge) {
    responseData.set('Access-Control-Max-Age', corsConfiguration.maxAge.toString())
  }
  if (!!corsConfiguration.exposedHeaders && corsConfiguration.exposedHeaders.length > 0) {
    responseData.set('Access-Control-Expose-Headers', corsConfiguration.exposedHeaders.join(','))
  }
  if (requestData.method === 'OPTIONS') {
    responseData.sendStatus(corsConfiguration.optionsSuccessStatus)
    return
  }
  nextHandler()
}

/**
 * Exports
 */
module.exports = corsMiddleware