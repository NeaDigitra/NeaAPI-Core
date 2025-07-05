const supertest = require('supertest')
const express = require('express')
const corsMiddleware = require('middlewares/cors')
const responseMiddleware = require('middlewares/response')
const fingerprintMiddleware = require('middlewares/fingerprint')

const ENV_DEFAULTS = {
  CORS_ORIGIN: 'https://allowed.com',
  CORS_ALLOWED_HEADERS: 'content-type,authorization',
  CORS_METHODS: 'GET,POST',
  CORS_CREDENTIALS: 'true',
  CORS_MAX_AGE: '600',
  CORS_OPTIONS_STATUS: '202',
}

function resetEnv() {
  for (const [k, v] of Object.entries(ENV_DEFAULTS)) process.env[k] = v
  delete process.env.CORS_EXPOSED_HEADERS
}
function clearEnv() {
  for (const key of Object.keys(ENV_DEFAULTS)) delete process.env[key]
  delete process.env.CORS_EXPOSED_HEADERS
}

function createTestApplication() {
  const app = express()
  app.use(fingerprintMiddleware)
  app.use(responseMiddleware)
  app.use(corsMiddleware)
  app.get('/test', (req, res) => res.send('ok'))
  return app
}

describe('Cors Middleware', function () {
  beforeEach(resetEnv)
  afterEach(clearEnv)

  test('Should Allow Request From Allowed Origin', async () => {
    const app = createTestApplication()
    await supertest(app)
      .get('/test')
      .set('Origin', 'https://allowed.com')
      .expect('Access-Control-Allow-Origin', 'https://allowed.com')
      .expect('Access-Control-Allow-Methods', 'GET,POST')
      .expect('Access-Control-Allow-Headers', 'content-type,authorization')
      .expect('Access-Control-Allow-Credentials', 'true')
      .expect('Access-Control-Max-Age', '600')
      .expect(200)
  })

  test('Should Block Request From Not Allowed Origin', async () => {
    const app = createTestApplication()
    await supertest(app)
      .get('/test')
      .set('Origin', 'https://blocked.com')
      .expect(403)
  })

  test('Should Allow All Origins When Wildcard', async () => {
    process.env.CORS_ORIGIN = '*'
    const app = createTestApplication()
    await supertest(app)
      .get('/test')
      .set('Origin', 'https://random.com')
      .expect('Access-Control-Allow-Origin', 'https://random.com')
      .expect(200)
  })

  test('Should Allow All Origins With Credentials', async () => {
    process.env.CORS_ORIGIN = '*'
    process.env.CORS_CREDENTIALS = 'true'
    const app = createTestApplication()
    await supertest(app)
      .get('/test')
      .set('Origin', 'https://random.com')
      .expect('Access-Control-Allow-Origin', 'https://random.com')
      .expect('Access-Control-Allow-Credentials', 'true')
      .expect(200)
  })

  test('Should Allow All Origins When Wildcard Without Origin Header', async () => {
    process.env.CORS_ORIGIN = '*'
    const app = createTestApplication()
    await supertest(app)
      .get('/test')
      .expect('Access-Control-Allow-Origin', '*')
      .expect(200)
  })

  test('Should Respond With Options Status', async () => {
    const app = createTestApplication()
    await supertest(app)
      .options('/test')
      .set('Origin', 'https://allowed.com')
      .expect('Access-Control-Allow-Origin', 'https://allowed.com')
      .expect(202)
  })

  test('Should Allow No Origin If Not Set', async () => {
    delete process.env.CORS_ORIGIN
    const app = createTestApplication()
    await supertest(app)
      .get('/test')
      .expect(403)
  })

  test('Should Allow Request Without Origin Header If Wildcard', async () => {
    process.env.CORS_ORIGIN = '*'
    const app = createTestApplication()
    await supertest(app)
      .get('/test')
      .expect('Access-Control-Allow-Origin', '*')
      .expect(200)
  })

  test('Should Include Exposed Headers If Set', async () => {
    process.env.CORS_EXPOSED_HEADERS = 'x-custom-one,x-custom-two'
    const app = createTestApplication()
    await supertest(app)
      .get('/test')
      .set('Origin', 'https://allowed.com')
      .expect('Access-Control-Expose-Headers', 'x-custom-one,x-custom-two')
      .expect(200)
  })

  test('Should Use Default Allowed Headers If Not Set', async () => {
    delete process.env.CORS_ALLOWED_HEADERS
    const app = createTestApplication()
    await supertest(app)
      .get('/test')
      .set('Origin', 'https://allowed.com')
      .expect('Access-Control-Allow-Headers', 'content-type,authorization,x-requested-with')
      .expect(200)
  })

  test('Should Use Default Methods If Not Set', async () => {
    delete process.env.CORS_METHODS
    const app = createTestApplication()
    await supertest(app)
      .get('/test')
      .set('Origin', 'https://allowed.com')
      .expect('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
      .expect(200)
  })

  test('Should Use Default Max Age If Not Set', async () => {
    delete process.env.CORS_MAX_AGE
    const app = createTestApplication()
    await supertest(app)
      .get('/test')
      .set('Origin', 'https://allowed.com')
      .expect('Access-Control-Max-Age', '86400')
      .expect(200)
  })

  test('Should Use Default Options Status If Not Set', async () => {
    delete process.env.CORS_OPTIONS_STATUS
    const app = createTestApplication()
    await supertest(app)
      .options('/test')
      .set('Origin', 'https://allowed.com')
      .expect(204)
  })

  test('Should Use Default Origin When Invalid Env', async () => {
    process.env.CORS_ORIGIN = 'invalid-origin'
    const app = createTestApplication()
    await supertest(app)
      .get('/test')
      .set('Origin', 'invalid-origin')
      .expect(403)
    await supertest(app)
      .get('/test')
      .set('Origin', 'https://yourdomain.com')
      .expect('Access-Control-Allow-Origin', 'https://yourdomain.com')
      .expect(200)
  })

  test('Should Handle Empty Methods And Headers', async () => {
    process.env.CORS_METHODS = ''
    process.env.CORS_ALLOWED_HEADERS = ''
    const app = createTestApplication()
    await supertest(app)
      .get('/test')
      .set('Origin', 'https://allowed.com')
      .expect('Access-Control-Allow-Headers', 'content-type,authorization,x-requested-with')
      .expect('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
      .expect(200)
  })

  test('Should Not Set Credentials Header If Not True', async () => {
    process.env.CORS_CREDENTIALS = 'false'
    const app = createTestApplication()
    await supertest(app)
      .get('/test')
      .set('Origin', 'https://allowed.com')
      .expect(res => {
        if ('access-control-allow-credentials' in res.headers)
          throw new Error('Header should not be set')
      })
      .expect(200)
  })

  test('Should Not Set Expose Header If Not Set', async () => {
    delete process.env.CORS_EXPOSED_HEADERS
    const app = createTestApplication()
    await supertest(app)
      .get('/test')
      .set('Origin', 'https://allowed.com')
      .expect(res => {
        if ('access-control-expose-headers' in res.headers)
          throw new Error('Header should not be set')
      })
      .expect(200)
  })

  test('Should Fallback To Default Origin List', async () => {
    process.env.CORS_ORIGIN = ''
    const app = createTestApplication()
    await supertest(app)
      .get('/test')
      .set('Origin', 'https://yourdomain.com')
      .expect('Access-Control-Allow-Origin', 'https://yourdomain.com')
      .expect(200)
  })

  test('Should Not Set Any Headers If Forbidden', async () => {
    const app = createTestApplication()
    await supertest(app)
      .get('/test')
      .set('Origin', 'https://blocked.com')
      .expect(403)
      .expect(res => {
        const headers = res.headers
        if ('access-control-allow-origin' in headers ||
          'access-control-allow-headers' in headers ||
          'access-control-allow-methods' in headers)
          throw new Error('Should not set CORS headers when forbidden')
      })
  })

  test('Should Allow Origin When CORS_ORIGIN Is Set And Includes Origin', async () => {
    process.env.CORS_ORIGIN = 'https://allowed.com'
    const app = createTestApplication()
    await supertest(app)
      .get('/test')
      .set('Origin', 'https://allowed.com')
      .expect('Access-Control-Allow-Origin', 'https://allowed.com')
      .expect(200)
  })

  test('Should Allow Origin From Allowed List When CORS_ORIGIN Is Empty But AllowedOriginList Set', async () => {
    process.env.CORS_ORIGIN = ''
    const app = createTestApplication()
    await supertest(app)
      .get('/test')
      .set('Origin', 'https://yourdomain.com')
      .expect('Access-Control-Allow-Origin', 'https://yourdomain.com')
      .expect(200)
  })

  test('Should Allow Origin From Fallback List When CORS_ORIGIN Is Missing', async () => {
    delete process.env.CORS_ORIGIN
    const app = createTestApplication()
    await supertest(app)
      .get('/test')
      .set('Origin', 'https://yourdomain.com')
      .expect('Access-Control-Allow-Origin', 'https://yourdomain.com')
      .expect(200)
  })

  test('Should Allow Origin When Multiple Valid Origins With Spaces', async () => {
    process.env.CORS_ORIGIN = ' https://first.com , https://second.com '
    const app = createTestApplication()
    await supertest(app)
      .get('/test')
      .set('Origin', 'https://second.com')
      .expect('Access-Control-Allow-Origin', 'https://second.com')
      .expect(200)
  })

  test('Should Allow Origin Present In Allowed Origin List When CORS_ORIGIN Has Extra Spaces', async () => {
    process.env.CORS_ORIGIN = ' https://allowed.com , https://other.com '
    const app = createTestApplication()
    await supertest(app)
      .get('/test')
      .set('Origin', 'https://other.com')
      .expect('Access-Control-Allow-Origin', 'https://other.com')
      .expect(200)
  })

  test('Should Allow Origin From Default Origin List When Env Is Invalid', async () => {
    process.env.CORS_ORIGIN = 'invalid-origin'
    const app = createTestApplication()
    await supertest(app)
      .get('/test')
      .set('Origin', 'https://yourdomain.com')
      .expect('Access-Control-Allow-Origin', 'https://yourdomain.com')
      .expect(200)
  })

  test('Should Allow Origin When CORS_ORIGIN Has Invalid And Valid Origins', async () => {
    process.env.CORS_ORIGIN = 'invalid, https://yourdomain.com'
    const app = createTestApplication()
    await supertest(app)
      .get('/test')
      .set('Origin', 'https://yourdomain.com')
      .expect('Access-Control-Allow-Origin', 'https://yourdomain.com')
      .expect(200)
  })

  test('Should Allow Origin When CORS_ORIGIN Is Invalid But AllowedOriginList Includes Origin', async () => {
    process.env.CORS_ORIGIN = 'bogus, https://yourdomain.com'
    const app = createTestApplication()
    await supertest(app)
      .get('/test')
      .set('Origin', 'https://yourdomain.com')
      .expect('Access-Control-Allow-Origin', 'https://yourdomain.com')
      .expect(200)
  })

  test('Should Allow Origin Present In Allowed Origin List', async () => {
    process.env.CORS_ORIGIN = 'https://allowed.com,https://other.com'
    const app = createTestApplication()
    await supertest(app)
      .get('/test')
      .set('Origin', 'https://other.com')
      .expect('Access-Control-Allow-Origin', 'https://other.com')
      .expect(200)
  })

  test('Should call errorResponse for non-success id', async () => {
    const app = express()
    app.use(require('middlewares/response'))
    app.get('/error', (req, res) => res.api('forbidden'))
    await supertest(app)
      .get('/error')
      .expect(res => {
        expect(res.body).toHaveProperty('status')
        expect(res.body).toHaveProperty('trace')
        expect(res.body).toHaveProperty('type')
      })
  })
})