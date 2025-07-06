/**
 * Generate RFC7807 Error Response
 * * This function generates an error response for the API.
 * * It includes the status code, type, title, detail, instance, and errors.
 */
module.exports = function generateError(request, identifier, errors) {
  const requestUrl = request.originalUrl || request.url
  const requestType = `${global.app.errorBaseUrl}/${identifier}`
  const errorMap = {
    unknown_error: {
      status: 400,
      type: requestType,
      title: 'Unknown Error',
      detail: 'An unknown error occurred.',
      solution: 'Please try again later or contact support.',
      instance: requestUrl
    },
    bad_request: {
      status: 400,
      type: requestType,
      title: 'Bad Request',
      detail: 'The request was invalid.',
      solution: 'Check and correct your API request according to the documentation.',
      instance: requestUrl
    },
    missing_parameter: {
      status: 400,
      type: requestType,
      title: 'Missing Parameter',
      detail: 'A required parameter is missing from the request.',
      solution: 'Ensure all required parameters are included in the request.',
      instance: requestUrl
    },
    verification_failed: {
      status: 400,
      type: requestType,
      title: 'Verification Failed',
      detail: 'The request could not be verified.',
      solution: 'Check the request signature or authentication details.',
      instance: requestUrl
    },
    unauthorized: {
      status: 401,
      type: requestType,
      title: 'Unauthorized',
      detail: 'Authentication is required or invalid.',
      solution: 'Log in with valid credentials or obtain an API key.',
      instance: requestUrl
    },
    forbidden: {
      status: 403,
      type: requestType,
      title: 'Forbidden',
      detail: 'You do not have permission to access this resource.',
      solution: 'Request access or contact administrator.',
      instance: requestUrl
    },
    not_found: {
      status: 404,
      type: requestType,
      title: 'Resource Not Found',
      detail: 'The requested resource could not be found.',
      solution: 'Verify the endpoint or resource ID.',
      instance: requestUrl
    },
    method_not_allowed: {
      status: 405,
      type: requestType,
      title: 'Method Not Allowed',
      detail: 'The HTTP method is not allowed for this endpoint.',
      solution: 'Check the API documentation for allowed methods.',
      instance: requestUrl
    },
    not_acceptable: {
      status: 406,
      type: requestType,
      title: 'Not Acceptable',
      detail: 'The requested resource is not available in the requested format.',
      solution: 'Check the Accept header and try again.',
      instance: requestUrl
    },
    conflict: {
      status: 409,
      type: requestType,
      title: 'Conflict',
      detail: 'A conflict occurred with the current state of the resource.',
      solution: 'Review resource state and retry the request.',
      instance: requestUrl
    },
    payload_too_large: {
      status: 413,
      type: requestType,
      title: 'Payload Too Large',
      detail: 'The request payload is too large.',
      solution: 'Reduce the size of the request payload and try again.',
      instance: requestUrl
    },
    validation_error: {
      status: 422,
      type: requestType,
      title: 'Validation Failed',
      detail: 'Input validation failed.',
      solution: 'Please check and correct all required fields.',
      instance: requestUrl,
      errors: errors || {}
    },
    rate_limit_exceeded: {
      status: 429,
      type: requestType,
      title: 'Too Many Requests',
      detail: 'Too many requests. Rate limit exceeded.',
      solution: 'Wait and try again later.',
      instance: requestUrl
    },
    internal_error: {
      status: 500,
      type: requestType,
      title: 'Internal Server Error',
      detail: 'An unexpected error occurred on the server.',
      solution: 'Try again later or contact support.',
      instance: requestUrl
    },
    not_implemented: {
      status: 501,
      type: requestType,
      title: 'Not Implemented',
      detail: 'This endpoint is not implemented.',
      solution: 'Refer to the API documentation or contact support.',
      instance: requestUrl
    },
    service_unavailable: {
      status: 503,
      type: requestType,
      title: 'Service Unavailable',
      detail: 'The service is temporarily unavailable.',
      solution: 'Try again later.',
      instance: requestUrl
    }
  }
  return errorMap[identifier] || errorMap.unknown_error
}