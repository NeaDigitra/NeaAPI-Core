const express = require('express')
const supertest = require('supertest')
const crypto = require('crypto')
const validateSignature = require('../middlewares/signature')
const apiResponse = require('../middlewares/response')
const secret = 'MYSECRET'

function getSign(body = {}, query = {}) {
  const combined = { ...query, ...body }
  delete combined['x-secret']
  delete combined['x-signature']
  const keys = Object.keys(combined).sort()
  const dataString = keys.map(k => {
    let value = combined[k]
    if (Array.isArray(value)) value = value.join(',')
    else if (typeof value === 'object' && value !== null) value = JSON.stringify(value)
    return `${k}=${value}`
  }).join('&')
  return crypto.createHash('sha256').update(dataString + secret).digest('hex')
}

describe('Middleware: validateSignature', () => {
  let app
  beforeEach(() => {
    app = express()
    app.use(express.json())
    app.use(apiResponse)
    app.post('/test', validateSignature, (req, res) => {
      res.api('success', { message: 'Authorized' })
    })
  })

  it('calls next immediately if req.signatureChecked is true', async () => {
    const app2 = express()
    app2.use(express.json())
    app2.use((req, res, next) => {
      req.signatureChecked = true
      next()
    })
    app2.use(apiResponse)
    app2.post('/test', validateSignature, (req, res) => {
      res.api('success', { message: 'Already Checked' })
    })
    const res = await supertest(app2).post('/test').send({})
    expect(res.status).toBe(200)
    expect(res.body.data.message).toBe('Already Checked')
  })

  it('rejects missing x-signature header', async () => {
    const res = await supertest(app)
      .post('/test')
      .set('x-secret', secret)
      .send({ name: 'Bob' })
    expect(res.status).toBe(401)
    expect(res.body.title).toBe('Unauthorized')
    expect(res.body.detail).toBe('Authentication is required or invalid.')
  })

  it('rejects missing x-secret header', async () => {
    const body = { name: 'Bob' }
    const sign = getSign(body)
    const res = await supertest(app)
      .post('/test')
      .set('x-signature', sign)
      .send(body)
    expect(res.status).toBe(403)
    expect(res.body.title).toBe('Forbidden')
    expect(res.body.detail).toBe('You do not have permission to access this resource.')
  })

  it('rejects invalid signature', async () => {
    const res = await supertest(app)
      .post('/test')
      .set('x-secret', secret)
      .set('x-signature', 'invalid')
      .send({ name: 'Bob' })
    expect(res.status).toBe(403)
    expect(res.body.title).toBe('Forbidden')
    expect(res.body.detail).toBe('You do not have permission to access this resource.')
  })

  it('accepts valid signature ignoring signature field in body', async () => {
    const body = { name: 'Eve', signature: 'fake' }
    const sign = getSign(body)
    const res = await supertest(app)
      .post('/test')
      .set('x-secret', secret)
      .set('x-signature', sign)
      .send(body)
    expect(res.status).toBe(200)
    expect(res.body.data.message).toBe('Authorized')
  })

  it('accepts valid signature and secret in body', async () => {
    const body = { name: 'Test' }
    const sign = getSign(body)
    body['x-signature'] = sign
    body['x-secret'] = secret
    const res = await supertest(app)
      .post('/test')
      .set('Content-Type', 'application/json')
      .send(body)
    expect(res.status).toBe(200)
    expect(res.body.data.message).toBe('Authorized')
  })

  it('accepts valid signature and secret in query params', async () => {
    const query = { name: 'Test' }
    const sign = getSign({}, query)
    const res = await supertest(app)
      .post('/test')
      .query({ ...query, 'x-signature': sign, 'x-secret': secret })
      .set('Content-Type', 'application/json')
      .send({})
    expect(res.status).toBe(200)
    expect(res.body.data.message).toBe('Authorized')
  })

  it('handles arrays and objects correctly in signature generation', async () => {
    const body = { arr: [1, 2], obj: { foo: 'bar' }, name: 'Test' }
    const sign = getSign(body)
    const res = await supertest(app)
      .post('/test')
      .set('x-secret', secret)
      .set('x-signature', sign)
      .send(body)
    expect(res.status).toBe(200)
  })
})

describe('Middleware: validateSignature - Helpers Coverage', () => {
  it('buildDataString returns empty string if no data', () => {
    const req = { body: {}, query: {} }
    expect(validateSignature.buildDataString(req)).toBe('')
  })

  it('generateHash returns valid SHA256 hash', () => {
    const hash = validateSignature.generateHash('abc', secret)
    expect(typeof hash).toBe('string')
    expect(hash.length).toBe(64)
  })

  it('resolveClientAuth returns null if not found', () => {
    const req = { headers: {}, body: {}, query: {} }
    expect(validateSignature.resolveClientAuth(req, 'x-signature')).toBeNull()
  })

  it('resolveClientAuth finds in headers', () => {
    const req = { headers: { 'x-signature': 'sig' }, body: {}, query: {} }
    expect(validateSignature.resolveClientAuth(req, 'x-signature')).toBe('sig')
  })

  it('resolveClientAuth finds in body', () => {
    const req = { headers: {}, body: { 'x-signature': 'sig' }, query: {} }
    expect(validateSignature.resolveClientAuth(req, 'x-signature')).toBe('sig')
  })

  it('resolveClientAuth finds in query', () => {
    const req = { headers: {}, body: {}, query: { 'x-signature': 'sig' } }
    expect(validateSignature.resolveClientAuth(req, 'x-signature')).toBe('sig')
  })
})