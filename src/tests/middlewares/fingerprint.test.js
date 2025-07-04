const crypto = require('crypto')
const express = require('express')
const supertest = require('supertest')
const fingerprintMiddleware = require('middlewares/fingerprint')

describe('Middleware: fingerprint', () => {
  let app
  beforeEach(() => {
    app = express()
    app.use(fingerprintMiddleware)
    app.get('/', (req, res) => {
      res.json({ fingerprint: req.fingerprint })
    })
  })

  it('generates correct fingerprint hash from headers', async () => {
    const headers = {
      'user-agent': 'Mozilla/5.0',
      accept: 'text/html',
      'accept-language': 'en-US',
      'sec-ch-ua': '"Chromium";v="108", "Not A;Brand";v="99"',
    }
    const combinedRawData = [
      headers['user-agent'],
      headers.accept,
      headers['accept-language'],
      headers['sec-ch-ua'],
    ].join('|')
    const expectedHash = crypto.createHash('sha256').update(combinedRawData).digest('hex')
    const res = await supertest(app).get('/').set(headers)
    expect(res.status).toBe(200)
    expect(res.body.fingerprint).toBe(expectedHash)
  })

  it('generates fingerprint with empty strings when headers missing', async () => {
    const res = await supertest(app).get('/') // no special headers
    const combinedRawData = '|||'
    const expectedHash = crypto.createHash('sha256').update(combinedRawData).digest('hex')
    expect(res.status).toBe(200)
    expect(res.body.fingerprint).toBe(expectedHash)
  })

  it('always calls next middleware', async () => {
    const calledNext = []
    const fakeReq = { headers: {} }
    const fakeRes = {}
    const next = () => calledNext.push(true)
    fingerprintMiddleware(fakeReq, fakeRes, next)
    expect(calledNext.length).toBe(1)
    expect(typeof fakeReq.fingerprint).toBe('string')
    expect(fakeReq.fingerprint.length).toBe(64)
  })
})