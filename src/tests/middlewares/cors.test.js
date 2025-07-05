const supertest = require('supertest')
const express = require('express')
const corsMiddleware = require('middlewares/cors')
const responseMiddleware = require('middlewares/response')
const fingerprintMiddleware = require('middlewares/fingerprint')

function createTestApplication() {
  const testApplication = express()
  testApplication.use(fingerprintMiddleware)
  testApplication.use(responseMiddleware)
  testApplication.use(corsMiddleware)
  testApplication.get('/test', function (testRequestData, testResponseData) {
    testResponseData.send('ok')
  })
  return testApplication
}

describe('Cors Middleware', function () {
  beforeEach(function () {
    process.env.CORS_ORIGIN = 'https://allowed.com'
    process.env.CORS_ALLOWED_HEADERS = 'content-type,authorization'
    process.env.CORS_METHODS = 'GET,POST'
    process.env.CORS_CREDENTIALS = 'true'
    process.env.CORS_MAX_AGE = '600'
    process.env.CORS_OPTIONS_STATUS = '202'
    delete process.env.CORS_EXPOSED_HEADERS
  })

  test('Should Allow Request From Allowed Origin', async function () {
    const testApplication = createTestApplication()
    await supertest(testApplication)
      .get('/test')
      .set('Origin', 'https://allowed.com')
      .expect('Access-Control-Allow-Origin', 'https://allowed.com')
      .expect('Access-Control-Allow-Methods', 'GET,POST')
      .expect('Access-Control-Allow-Headers', 'content-type,authorization')
      .expect('Access-Control-Allow-Credentials', 'true')
      .expect('Access-Control-Max-Age', '600')
      .expect(200)
  })

  test('Should Block Request From Not Allowed Origin', async function () {
    const testApplication = createTestApplication()
    await supertest(testApplication)
      .get('/test')
      .set('Origin', 'https://blocked.com')
      .expect(403)
  })

  test('Should Allow All Origins When Wildcard', async function () {
    process.env.CORS_ORIGIN = '*'
    const testApplication = createTestApplication()
    await supertest(testApplication)
      .get('/test')
      .set('Origin', 'https://random.com')
      .expect('Access-Control-Allow-Origin', 'https://random.com')
      .expect(200)
  })

  test('Should Allow All Origins With Credentials', async function () {
    process.env.CORS_ORIGIN = '*'
    process.env.CORS_CREDENTIALS = 'true'
    const testApplication = createTestApplication()
    await supertest(testApplication)
      .get('/test')
      .set('Origin', 'https://random.com')
      .expect('Access-Control-Allow-Origin', 'https://random.com')
      .expect('Access-Control-Allow-Credentials', 'true')
      .expect(200)
  })

  test('Should Allow All Origins When Wildcard Without Origin Header', async function () {
    process.env.CORS_ORIGIN = '*'
    const testApplication = createTestApplication()
    await supertest(testApplication)
      .get('/test')
      .expect('Access-Control-Allow-Origin', '*')
      .expect(200)
  })

  test('Should Respond With Options Status', async function () {
    const testApplication = createTestApplication()
    await supertest(testApplication)
      .options('/test')
      .set('Origin', 'https://allowed.com')
      .expect('Access-Control-Allow-Origin', 'https://allowed.com')
      .expect(202)
  })

  test('Should Allow No Origin If Not Set', async function () {
    delete process.env.CORS_ORIGIN
    const testApplication = createTestApplication()
    await supertest(testApplication)
      .get('/test')
      .expect(403)
  })

  test('Should Allow Request Without Origin Header If Wildcard', async function () {
    process.env.CORS_ORIGIN = '*'
    const testApplication = createTestApplication()
    await supertest(testApplication)
      .get('/test')
      .expect('Access-Control-Allow-Origin', '*')
      .expect(200)
  })

  test('Should Include Exposed Headers If Set', async function () {
    process.env.CORS_EXPOSED_HEADERS = 'x-custom-one,x-custom-two'
    const testApplication = createTestApplication()
    await supertest(testApplication)
      .get('/test')
      .set('Origin', 'https://allowed.com')
      .expect('Access-Control-Expose-Headers', 'x-custom-one,x-custom-two')
      .expect(200)
  })

  test('Should Use Default Allowed Headers If Not Set', async function () {
    delete process.env.CORS_ALLOWED_HEADERS
    const testApplication = createTestApplication()
    await supertest(testApplication)
      .get('/test')
      .set('Origin', 'https://allowed.com')
      .expect('Access-Control-Allow-Headers', 'content-type,authorization,x-requested-with')
      .expect(200)
  })

  test('Should Use Default Methods If Not Set', async function () {
    delete process.env.CORS_METHODS
    const testApplication = createTestApplication()
    await supertest(testApplication)
      .get('/test')
      .set('Origin', 'https://allowed.com')
      .expect('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
      .expect(200)
  })

  test('Should Use Default Max Age If Not Set', async function () {
    delete process.env.CORS_MAX_AGE
    const testApplication = createTestApplication()
    await supertest(testApplication)
      .get('/test')
      .set('Origin', 'https://allowed.com')
      .expect('Access-Control-Max-Age', '86400')
      .expect(200)
  })

  test('Should Use Default Options Status If Not Set', async function () {
    delete process.env.CORS_OPTIONS_STATUS
    const testApplication = createTestApplication()
    await supertest(testApplication)
      .options('/test')
      .set('Origin', 'https://allowed.com')
      .expect(204)
  })

  test('Should Use Default Origin When Invalid Env', async function () {
    process.env.CORS_ORIGIN = 'invalid-origin'
    const testApplication = createTestApplication()
    await supertest(testApplication)
      .get('/test')
      .set('Origin', 'invalid-origin')
      .expect(403)
    await supertest(testApplication)
      .get('/test')
      .set('Origin', 'https://yourdomain.com')
      .expect('Access-Control-Allow-Origin', 'https://yourdomain.com')
      .expect(200)
  })

  test('Should Handle Empty Methods And Headers', async function () {
    process.env.CORS_METHODS = ''
    process.env.CORS_ALLOWED_HEADERS = ''
    const testApplication = createTestApplication()
    await supertest(testApplication)
      .get('/test')
      .set('Origin', 'https://allowed.com')
      .expect('Access-Control-Allow-Headers', 'content-type,authorization,x-requested-with')
      .expect('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
      .expect(200)
  })

  test('Should Not Set Credentials Header If Not True', async function () {
    process.env.CORS_CREDENTIALS = 'false'
    const testApplication = createTestApplication()
    await supertest(testApplication)
      .get('/test')
      .set('Origin', 'https://allowed.com')
      .expect(function (response) {
        if ('access-control-allow-credentials' in response.headers) {
          throw new Error('Header should not be set')
        }
      })
      .expect(200)
  })

  test('Should Not Set Expose Header If Not Set', async function () {
    delete process.env.CORS_EXPOSED_HEADERS
    const testApplication = createTestApplication()
    await supertest(testApplication)
      .get('/test')
      .set('Origin', 'https://allowed.com')
      .expect(function (response) {
        if ('access-control-expose-headers' in response.headers) {
          throw new Error('Header should not be set')
        }
      })
      .expect(200)
  })

  test('Should Fallback To Default Origin List', async function () {
    process.env.CORS_ORIGIN = ''
    const testApplication = createTestApplication()
    await supertest(testApplication)
      .get('/test')
      .set('Origin', 'https://yourdomain.com')
      .expect('Access-Control-Allow-Origin', 'https://yourdomain.com')
      .expect(200)
  })

  test('Should Not Set Any Headers If Forbidden', async function () {
    const testApplication = createTestApplication()
    await supertest(testApplication)
      .get('/test')
      .set('Origin', 'https://blocked.com')
      .expect(403)
      .expect(function (response) {
        if ('access-control-allow-origin' in response.headers) {
          throw new Error('Should not set CORS headers when forbidden')
        }
        if ('access-control-allow-headers' in response.headers) {
          throw new Error('Should not set CORS headers when forbidden')
        }
        if ('access-control-allow-methods' in response.headers) {
          throw new Error('Should not set CORS headers when forbidden')
        }
      })
  })

  test('Should Allow Origin When CORS_ORIGIN Is Set And Includes Origin', async function () {
    process.env.CORS_ORIGIN = 'https://allowed.com'
    const testApplication = createTestApplication()
    await supertest(testApplication)
      .get('/test')
      .set('Origin', 'https://allowed.com')
      .expect('Access-Control-Allow-Origin', 'https://allowed.com')
      .expect(200)
  })

  test('Should Allow Origin From Allowed List When CORS_ORIGIN Is Empty But AllowedOriginList Set', async function () {
    process.env.CORS_ORIGIN = ''
    const testApplication = createTestApplication()
    await supertest(testApplication)
      .get('/test')
      .set('Origin', 'https://yourdomain.com')
      .expect('Access-Control-Allow-Origin', 'https://yourdomain.com')
      .expect(200)
  })

  test('Should Allow Origin From Fallback List When CORS_ORIGIN Is Missing', async function () {
    delete process.env.CORS_ORIGIN
    const testApplication = createTestApplication()
    await supertest(testApplication)
      .get('/test')
      .set('Origin', 'https://yourdomain.com')
      .expect('Access-Control-Allow-Origin', 'https://yourdomain.com')
      .expect(200)
  })

  test('Should Allow Origin When Multiple Valid Origins With Spaces', async function () {
    process.env.CORS_ORIGIN = ' https://first.com , https://second.com '
    const testApplication = createTestApplication()
    await supertest(testApplication)
      .get('/test')
      .set('Origin', 'https://second.com')
      .expect('Access-Control-Allow-Origin', 'https://second.com')
      .expect(200)
  })

  test('Should Allow Origin Present In Allowed Origin List When CORS_ORIGIN Has Extra Spaces', async function () {
    process.env.CORS_ORIGIN = ' https://allowed.com , https://other.com '
    const testApplication = createTestApplication()
    await supertest(testApplication)
      .get('/test')
      .set('Origin', 'https://other.com')
      .expect('Access-Control-Allow-Origin', 'https://other.com')
      .expect(200)
  })

  test('Should Allow Origin From Default Origin List When Env Is Invalid', async function () {
    process.env.CORS_ORIGIN = 'invalid-origin'
    const testApplication = createTestApplication()
    await supertest(testApplication)
      .get('/test')
      .set('Origin', 'https://yourdomain.com')
      .expect('Access-Control-Allow-Origin', 'https://yourdomain.com')
      .expect(200)
  })

  test('Should Block When CORS_ORIGIN Set And Origin Not Included', async function () {
    process.env.CORS_ORIGIN = 'https://allowed.com'
    const testApplication = createTestApplication()
    await supertest(testApplication)
      .get('/test')
      .set('Origin', 'https://notallowed.com')
      .expect(403)
  })

  test('Should Block When CORS_ORIGIN Not Set And Origin Not Included In Fallback', async function () {
    delete process.env.CORS_ORIGIN
    const testApplication = createTestApplication()
    await supertest(testApplication)
      .get('/test')
      .set('Origin', 'https://notallowed.com')
      .expect(403)
  })

  test('Should Block When No Origin Header And Not Wildcard', async function () {
    process.env.CORS_ORIGIN = 'https://allowed.com'
    const testApplication = createTestApplication()
    await supertest(testApplication)
      .get('/test')
      .expect(403)
  })

  test('Should Allow When CORS_ORIGIN Is Only Spaces And Fallback Includes Origin', async function () {
    process.env.CORS_ORIGIN = '   '
    const testApplication = createTestApplication()
    await supertest(testApplication)
      .get('/test')
      .set('Origin', 'https://yourdomain.com')
      .expect('Access-Control-Allow-Origin', 'https://yourdomain.com')
      .expect(200)
  })

  test('Should Block When Origin Not In Fallback List And CORS_ORIGIN Is Empty', async function () {
    process.env.CORS_ORIGIN = ''
    const testApplication = createTestApplication()
    await supertest(testApplication)
      .get('/test')
      .set('Origin', 'https://notallowed.com')
      .expect(403)
  })

  test('Should Allow When CORS_ORIGIN Is Empty And Fallback Includes Origin (Force !allowedOriginValue Branch)', async function () {
    process.env.CORS_ORIGIN = ''
    const testApplication = createTestApplication()
    await supertest(testApplication)
      .get('/test')
      .set('Origin', 'https://yourdomain.com')
      .expect('Access-Control-Allow-Origin', 'https://yourdomain.com')
      .expect(200)
  })

  test('Should Block Request With No Origin When Not Wildcard', async function () {
    process.env.CORS_ORIGIN = 'https://allowed.com'
    const testApplication = createTestApplication()
    await supertest(testApplication)
      .get('/test')
      .expect(403)
  })

  test('Should Allow Origin When CORS_ORIGIN Is Undefined And Fallback List Includes Origin', async function () {
    delete process.env.CORS_ORIGIN
    const testApplication = createTestApplication()
    await supertest(testApplication)
      .get('/test')
      .set('Origin', 'https://yourdomain.com')
      .expect('Access-Control-Allow-Origin', 'https://yourdomain.com')
      .expect(200)
  })

  test('Should Allow Origin When CORS_ORIGIN Is List With Spaces And Only One Match', async function () {
    process.env.CORS_ORIGIN = ' https://notmatched.com , https://yourdomain.com '
    const testApplication = createTestApplication()
    await supertest(testApplication)
      .get('/test')
      .set('Origin', 'https://yourdomain.com')
      .expect('Access-Control-Allow-Origin', 'https://yourdomain.com')
      .expect(200)
  })

  test('Should Allow Origin When CORS_ORIGIN Has Invalid And Valid Origins', async function () {
    process.env.CORS_ORIGIN = 'invalid, https://yourdomain.com'
    const testApplication = createTestApplication()
    await supertest(testApplication)
      .get('/test')
      .set('Origin', 'https://yourdomain.com')
      .expect('Access-Control-Allow-Origin', 'https://yourdomain.com')
      .expect(200)
  })

  test('Should Allow Origin When CORS_ORIGIN Is Invalid But AllowedOriginList Includes Origin', async function () {
    process.env.CORS_ORIGIN = 'bogus, https://yourdomain.com'
    const testApplication = createTestApplication()
    await supertest(testApplication)
      .get('/test')
      .set('Origin', 'https://yourdomain.com')
      .expect('Access-Control-Allow-Origin', 'https://yourdomain.com')
      .expect(200)
  })

  test('Should Allow Origin Present In Allowed Origin List', async function () {
    process.env.CORS_ORIGIN = 'https://allowed.com,https://other.com'
    const testApplication = createTestApplication()
    await supertest(testApplication)
      .get('/test')
      .set('Origin', 'https://other.com')
      .expect('Access-Control-Allow-Origin', 'https://other.com')
      .expect(200)
  })
})