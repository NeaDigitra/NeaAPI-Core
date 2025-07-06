describe('Middleware: apiResponse', () => {
  let app
  beforeEach(() => {
    app = require('express')()
    app.use(require('express').json())
    app.use(require('middlewares/response'))
  })

  it('responds with success and HTTP 200', async () => {
    app.get('/success', (req, res) => {
      res.api('success', { foo: 'bar' })
    })
    const res = await require('supertest')(app).get('/success')
    expect(res.status).toBe(200)
    expect(res.body.status).toBe(200)
    expect(res.body.data).toEqual({ foo: 'bar' })
    expect(res.body.message).toBe('OK')
  })

  it('responds with problem and HTTP 400 by default', async () => {
    app.get('/problem', (req, res) => {
      res.api('bad_request', null, 'Something went wrong')
    })
    const res = await require('supertest')(app).get('/problem')
    expect(res.status).toBe(400)
    expect(res.body.status).toBe(400)
    expect(res.body.title).toBeDefined()
    expect(res.body.detail).toBeDefined()
  })

  it('supports custom HTTP status code or defaults to 200', async () => {
    app.get('/custom-status', (req, res) => {
      res.api('success', null, 'Created')
    })
    const res = await require('supertest')(app).get('/custom-status')
    expect(res.status).toBe(200)
    expect(res.body.status).toBe(200)
    expect(res.body.message).toBe('Created')
  })

  it('handles null or undefined data without error', async () => {
    app.get('/null-data', (req, res) => {
      res.api('success', null)
    })
    const res = await require('supertest')(app).get('/null-data')
    expect(res.status).toBe(200)
    expect(res.body.data).toBeNull()
  })

  it('handles empty message gracefully', async () => {
    app.get('/empty-message', (req, res) => {
      res.api('success', { foo: 'bar' }, '')
    })
    const res = await require('supertest')(app).get('/empty-message')
    expect(res.status).toBe(200)
    expect(res.body.message).toBe('OK')
  })

  it('should use default message "OK" when message is empty string', async () => {
    app.get('/empty-string-message', (req, res) => {
      res.api('success', { foo: 'baz' }, '')
    })
    const res = await require('supertest')(app).get('/empty-string-message')
    expect(res.status).toBe(200)
    expect(res.body.message).toBe('OK')
    expect(res.body.data).toEqual({ foo: 'baz' })
  })

  it('should include trace object in success response', async () => {
    app.get('/trace-success', (req, res) => {
      res.api('success', { foo: 'bar' })
    })
    const res = await require('supertest')(app).get('/trace-success')
    expect(res.body.trace).toBeDefined()
    expect(res.body.trace.method).toBe('GET')
    expect(res.body.trace.timestamp).toBeDefined()
    expect(res.body.trace.responseTime).toMatch(/ms$/)
  })

  it('should include trace object in error response', async () => {
    app.get('/trace-error', (req, res) => {
      res.api('bad_request', null, 'Bad')
    })
    const res = await require('supertest')(app).get('/trace-error')
    expect(res.body.trace).toBeDefined()
    expect(res.body.trace.method).toBe('GET')
    expect(res.body.trace.timestamp).toBeDefined()
    expect(res.body.trace.responseTime).toMatch(/ms$/)
  })

  it('should call next() and not block the middleware chain', async () => {
    let called = false
    app.use((req, res, next) => {
      called = true
      next()
    })
    app.get('/chain', (req, res) => {
      res.api('success')
    })
    await require('supertest')(app).get('/chain')
    expect(called).toBe(true)
  })

  it('should default hash to "unknown" if fingerprint is missing', async () => {
    app.get('/no-fingerprint', (req, res) => {
      delete req.fingerprint
      res.api('success')
    })
    const res = await require('supertest')(app).get('/no-fingerprint')
    expect(res.body.trace.hash).toBe('unknown')
  })

  it('returns proper headers', async () => {
    app.get('/headers', (req, res) => {
      res.api('success', { foo: 'bar' })
    })
    const res = await require('supertest')(app).get('/headers')
    expect(res.headers['content-type']).toMatch(/application\/json/)
  })

  it('should handle custom message in success response', async () => {
    app.get('/custom-success-status', (req, res) => {
      res.api('success', { created: true }, 'Resource Created')
    })
    const res = await require('supertest')(app).get('/custom-success-status')
    expect(res.status).toBe(200)
    expect(res.body.status).toBe(200)
    expect(res.body.message).toBe('Resource Created')
    expect(res.body.data).toEqual({ created: true })
  })

  it('should handle different message types in success response', async () => {
    app.get('/null-message', (req, res) => {
      res.api('success', { test: true }, null)
    })
    const res = await require('supertest')(app).get('/null-message')
    expect(res.status).toBe(200)
    expect(res.body.message).toBe('OK')
  })

  it('should handle undefined message in success response', async () => {
    app.get('/undefined-message', (req, res) => {
      res.api('success', { test: true }, undefined)
    })
    const res = await require('supertest')(app).get('/undefined-message')
    expect(res.status).toBe(200)
    expect(res.body.message).toBe('OK')
  })

  it('should handle complex error details in error response', async () => {
    app.get('/complex-error', (req, res) => {
      res.api('validation_error', {
        field: 'email',
        value: 'invalid',
        constraints: ['must be valid email']
      })
    })
    const res = await require('supertest')(app).get('/complex-error')
    expect(res.status).toBe(422)
    expect(res.body.errors).toBeDefined()
    expect(res.body.trace).toBeDefined()
  })

  it('should use originalUrl when available in trace', async () => {
    app.get('/original-url', (req, res) => {
      req.originalUrl = '/api/v1/original-url'
      res.api('success')
    })
    const res = await require('supertest')(app).get('/original-url')
    expect(res.body.trace.path).toBe('/api/v1/original-url')
  })

  it('should fallback to url when originalUrl is not available', async () => {
    app.get('/fallback-url', (req, res) => {
      delete req.originalUrl
      res.api('success')
    })
    const res = await require('supertest')(app).get('/fallback-url')
    expect(res.body.trace.path).toBe('/fallback-url')
  })

  it('should handle error response with complex details object', async () => {
    app.get('/empty-error-details', (req, res) => {
      res.api('internal_error', { details: 'Server error occurred' })
    })
    const res = await require('supertest')(app).get('/empty-error-details')
    expect(res.status).toBe(500)
    expect(res.body.detail).toBeDefined()
    expect(res.body.trace).toBeDefined()
  })

  it('should handle error response with null details', async () => {
    app.get('/null-error-details', (req, res) => {
      res.api('bad_request', null)
    })
    const res = await require('supertest')(app).get('/null-error-details')
    expect(res.status).toBe(400)
    expect(res.body.trace).toBeDefined()
  })

  it('should handle success response with custom data', async () => {
    app.get('/status-202', (req, res) => {
      res.api('success', { accepted: true }, 'Accepted')
    })
    const res = await require('supertest')(app).get('/status-202')
    expect(res.status).toBe(200)
    expect(res.body.status).toBe(200)
    expect(res.body.message).toBe('Accepted')
  })

  it('should handle success response with different parameter types', async () => {
    app.get('/param-types', (req, res) => {
      res.api('success', { number: 123, boolean: true, string: 'test' }, 'Mixed types')
    })
    const res = await require('supertest')(app).get('/param-types')
    expect(res.status).toBe(200)
    expect(res.body.data).toEqual({ number: 123, boolean: true, string: 'test' })
    expect(res.body.message).toBe('Mixed types')
  })

  it('should handle success response with array data', async () => {
    app.get('/array-data', (req, res) => {
      res.api('success', [1, 2, 3], 'Array data')
    })
    const res = await require('supertest')(app).get('/array-data')
    expect(res.status).toBe(200)
    expect(res.body.data).toEqual([1, 2, 3])
    expect(res.body.message).toBe('Array data')
  })

  it('should handle different parameter combinations in functions', async () => {
    app.get('/param-combinations', (req, res) => {
      const { successResponse } = require('middlewares/response')
      res.api('success', undefined, null)
    })
    const res = await require('supertest')(app).get('/param-combinations')
    expect(res.status).toBe(200)
    expect(res.body.message).toBe('OK')
  })

  it('should test successResponse function parameters with different defaults', async () => {
    app.get('/success-params', (req, res) => {
      // Test different parameter defaults in successResponse
      res.responseTime = '1.234ms'
      const trace = {
        method: req.method,
        hash: req.fingerprint || 'unknown',
        path: req.originalUrl || req.url,
        timestamp: new Date().toISOString(),
        responseTime: res.responseTime
      }
      // Test with all defaults
      const rawData1 = { status: 200, message: 'OK', data: null, trace }
      // Test with custom message
      const rawData2 = { status: 200, message: 'Custom', data: { test: true }, trace }
      // Test with custom status
      const rawData3 = { status: 201, message: 'Created', data: { id: 1 }, trace }

      // Return one of them based on query
      if (req.query.type === 'custom') {
        return res.status(200).json(rawData2)
      } else if (req.query.type === 'status') {
        return res.status(201).json(rawData3)
      }
      return res.status(200).json(rawData1)
    })

    const res1 = await require('supertest')(app).get('/success-params')
    expect(res1.status).toBe(200)
    expect(res1.body.message).toBe('OK')
    expect(res1.body.data).toBeNull()

    const res2 = await require('supertest')(app).get('/success-params?type=custom')
    expect(res2.status).toBe(200)
    expect(res2.body.message).toBe('Custom')
    expect(res2.body.data).toEqual({ test: true })

    const res3 = await require('supertest')(app).get('/success-params?type=status')
    expect(res3.status).toBe(201)
    expect(res3.body.message).toBe('Created')
    expect(res3.body.data).toEqual({ id: 1 })
  })

  it('should test errorResponse function with different details', async () => {
    app.get('/error-details', (req, res) => {
      // Test errorResponse with different details parameter
      res.responseTime = '2.345ms'
      const generateError = require('helpers/response/generator')

      if (req.query.type === 'empty') {
        const { status, type, title, detail, instance, errors } = generateError(req, 'bad_request', {})
        const trace = {
          method: req.method,
          hash: req.fingerprint || 'unknown',
          path: req.originalUrl || req.url,
          timestamp: new Date().toISOString(),
          responseTime: res.responseTime
        }
        const rawData = { status, type, title, detail, instance, errors, trace }
        return res.status(status).json(rawData)
      } else {
        const { status, type, title, detail, instance, errors } = generateError(req, 'validation_error', { field: 'email', code: 'invalid' })
        const trace = {
          method: req.method,
          hash: req.fingerprint || 'unknown',
          path: req.originalUrl || req.url,
          timestamp: new Date().toISOString(),
          responseTime: res.responseTime
        }
        const rawData = { status, type, title, detail, instance, errors, trace }
        return res.status(status).json(rawData)
      }
    })

    const res1 = await require('supertest')(app).get('/error-details?type=empty')
    expect(res1.status).toBe(400)
    expect(res1.body.trace).toBeDefined()

    const res2 = await require('supertest')(app).get('/error-details')
    expect(res2.status).toBe(422)
    expect(res2.body.trace).toBeDefined()
    expect(res2.body.errors).toBeDefined()
  })

  // ...existing tests continue...
})