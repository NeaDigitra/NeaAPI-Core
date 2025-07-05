const generateError = require('helpers/response/generator')

describe('generateError', () => {
  const mockRequest = { originalUrl: '/api/test', url: '/api/test-fallback' }

  it('returns unknown_error when identifier is not found', () => {
    const result = generateError(mockRequest, 'nonexistent')
    expect(result.status).toBe(400)
    expect(result.title).toBe('Unknown Error')
    expect(result.instance).toBe('/api/test')
  })

  it('returns correct error for bad_request', () => {
    const result = generateError(mockRequest, 'bad_request')
    expect(result.status).toBe(400)
    expect(result.title).toBe('Bad Request')
    expect(result.detail).toBe('The request was invalid.')
  })

  it('returns correct error for missing_parameter', () => {
    const result = generateError(mockRequest, 'missing_parameter')
    expect(result.status).toBe(400)
    expect(result.title).toBe('Missing Parameter')
  })

  it('returns correct error for verification_failed', () => {
    const result = generateError(mockRequest, 'verification_failed')
    expect(result.status).toBe(400)
    expect(result.title).toBe('Verification Failed')
  })

  it('returns correct error for unauthorized', () => {
    const result = generateError(mockRequest, 'unauthorized')
    expect(result.status).toBe(401)
    expect(result.title).toBe('Unauthorized')
  })

  it('returns correct error for forbidden', () => {
    const result = generateError(mockRequest, 'forbidden')
    expect(result.status).toBe(403)
    expect(result.title).toBe('Forbidden')
  })

  it('returns correct error for not_found', () => {
    const result = generateError(mockRequest, 'not_found')
    expect(result.status).toBe(404)
    expect(result.title).toBe('Resource Not Found')
  })

  it('returns correct error for method_not_allowed', () => {
    const result = generateError(mockRequest, 'method_not_allowed')
    expect(result.status).toBe(405)
    expect(result.title).toBe('Method Not Allowed')
  })

  it('returns correct error for not_acceptable', () => {
    const result = generateError(mockRequest, 'not_acceptable')
    expect(result.status).toBe(406)
    expect(result.title).toBe('Not Acceptable')
  })

  it('returns correct error for conflict', () => {
    const result = generateError(mockRequest, 'conflict')
    expect(result.status).toBe(409)
    expect(result.title).toBe('Conflict')
  })

  it('returns correct error for payload_too_large', () => {
    const result = generateError(mockRequest, 'payload_too_large')
    expect(result.status).toBe(413)
    expect(result.title).toBe('Payload Too Large')
  })

  it('returns correct error for validation_error with errors', () => {
    const errors = { field: 'is required' }
    const result = generateError(mockRequest, 'validation_error', errors)
    expect(result.status).toBe(422)
    expect(result.title).toBe('Validation Failed')
    expect(result.errors).toEqual(errors)
  })

  it('returns correct error for validation_error without errors', () => {
    const result = generateError(mockRequest, 'validation_error')
    expect(result.status).toBe(422)
    expect(result.title).toBe('Validation Failed')
    expect(result.errors).toEqual({})
  })

  it('returns correct error for rate_limit_exceeded', () => {
    const result = generateError(mockRequest, 'rate_limit_exceeded')
    expect(result.status).toBe(429)
    expect(result.title).toBe('Too Many Requests')
  })

  it('returns correct error for internal_error', () => {
    const result = generateError(mockRequest, 'internal_error')
    expect(result.status).toBe(500)
    expect(result.title).toBe('Internal Server Error')
  })

  it('returns correct error for not_implemented', () => {
    const result = generateError(mockRequest, 'not_implemented')
    expect(result.status).toBe(501)
    expect(result.title).toBe('Not Implemented')
  })

  it('returns correct error for service_unavailable', () => {
    const result = generateError(mockRequest, 'service_unavailable')
    expect(result.status).toBe(503)
    expect(result.title).toBe('Service Unavailable')
  })

  it('uses request.url if originalUrl is missing', () => {
    const req = { url: '/fallback' }
    const result = generateError(req, 'bad_request')
    expect(result.instance).toBe('/fallback')
  })
})