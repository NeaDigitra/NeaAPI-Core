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

  it('returns proper headers', async () => {
    app.get('/headers', (req, res) => {
      res.api('success', { foo: 'bar' })
    })
    const res = await require('supertest')(app).get('/headers')
    expect(res.headers['content-type']).toMatch(/application\/json/)
  })
})