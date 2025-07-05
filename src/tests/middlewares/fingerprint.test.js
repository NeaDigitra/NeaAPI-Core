const crypto = require('crypto')
const express = require('express')
const supertest = require('supertest')
const fingerprintMiddleware = require('middlewares/fingerprint')

function computeFingerprint(headers = {}) {
  return crypto.createHash('sha256')
    .update([
      headers['user-agent'] || '',
      headers['accept'] || '',
      headers['accept-language'] || '',
      headers['sec-ch-ua'] || '',
    ].join('|'))
    .digest('hex')
}

describe('Middleware: fingerprint', () => {
  let app
  let server
  let request

  beforeEach((done) => {
    app = express()
    app.use(fingerprintMiddleware)
    app.get('/', (req, res) => {
      res.json({ fingerprint: req.fingerprint, headers: req.headers })
    })
    server = app.listen(0, () => {
      request = supertest(server)
      done()
    })
  })

  afterEach((done) => {
    if (server && server.close) {
      server.close(done)
    } else {
      done()
    }
  })

  it('generates correct fingerprint hash from headers (uses received headers)', async () => {
    const headers = {
      'user-agent': 'Mozilla/5.0',
      'accept': 'text/html',
      'accept-language': 'en-US',
      'sec-ch-ua': '"Chromium";v="108", "Not A;Brand";v="99"',
    }
    const res = await request.get('/').set(headers)
    const expectedHash = computeFingerprint(headers)
    expect(res.status).toBe(200)
    expect(res.body.fingerprint).toBe(expectedHash)
    expect(res.body.fingerprint.length).toBe(64)
  })

  it('generates fingerprint with empty strings when headers missing', async () => {
    const res = await request.get('/')
    const expectedHash = computeFingerprint({})
    expect(res.status).toBe(200)
    expect(res.body.fingerprint).toBe(expectedHash)
  })

  it('always calls next middleware and assigns fingerprint', () => {
    const calledNext = []
    const fakeReq = { headers: {} }
    const fakeRes = {}
    const next = () => calledNext.push(true)
    fingerprintMiddleware(fakeReq, fakeRes, next)
    expect(calledNext.length).toBe(1)
    expect(typeof fakeReq.fingerprint).toBe('string')
    expect(fakeReq.fingerprint.length).toBe(64)
  })

  it('generates different fingerprints for different user-agents', async () => {
    const headers1 = { 'user-agent': 'AgentOne', accept: '', 'accept-language': '', 'sec-ch-ua': '' }
    const headers2 = { 'user-agent': 'AgentTwo', accept: '', 'accept-language': '', 'sec-ch-ua': '' }
    const res1 = await request.get('/').set(headers1)
    const res2 = await request.get('/').set(headers2)
    expect(res1.body.fingerprint).not.toBe(res2.body.fingerprint)
  })

  it('fingerprint is stable for same input', async () => {
    const headers = { 'user-agent': 'SameAgent', accept: 'text/plain', 'accept-language': 'en', 'sec-ch-ua': '' }
    const res1 = await request.get('/').set(headers)
    const res2 = await request.get('/').set(headers)
    expect(res1.body.fingerprint).toBe(res2.body.fingerprint)
  })
})
