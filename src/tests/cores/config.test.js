describe('Config Core Functionality Test', function () {
  const originalEnvironmentVariables = { ...process.env }

  afterEach(function () {
    process.env = { ...originalEnvironmentVariables }
    jest.resetModules()
  })

  test('Should Use Default And Environment Values For App And Ratelimit Config', function () {
    delete process.env.APP_NAME
    delete process.env.APP_VERSION
    delete process.env.APP_PORT
    delete process.env.ERROR_BASE_URL
    delete process.env.RATE_LIMIT_MAX
    delete process.env.RATE_LIMIT_WINDOW
    delete process.env.RATE_LIMIT_UPDATE_INTERVAL

    const appConfigDefault = require('config/app')
    const ratelimitConfigDefault = require('config/ratelimit')

    expect(appConfigDefault.appName).toBe('NeaCore-API')
    expect(appConfigDefault.appVersion).toBe('1.0.0')
    expect(appConfigDefault.appPort).toBe(3000)
    expect(appConfigDefault.errorBaseUrl).toBe('http://localhost:3000/errors')
    expect(ratelimitConfigDefault.maxRequests).toBe(10)
    expect(ratelimitConfigDefault.windowSeconds).toBe(10)
    expect(ratelimitConfigDefault.updateInterval).toBe(3600000)

    process.env.APP_NAME = 'Custom API'
    process.env.APP_VERSION = '9.8.7'
    process.env.APP_PORT = '8888'
    process.env.ERROR_BASE_URL = 'https://example.com/errors'
    process.env.RATE_LIMIT_MAX = '555'
    process.env.RATE_LIMIT_WINDOW = '120'
    process.env.RATE_LIMIT_UPDATE_INTERVAL = '4321000'
    jest.resetModules()

    const appConfigEnv = require('config/app')
    const ratelimitConfigEnv = require('config/ratelimit')

    expect(appConfigEnv.appName).toBe('Custom API')
    expect(appConfigEnv.appVersion).toBe('9.8.7')
    expect(appConfigEnv.appPort).toBe(8888)
    expect(appConfigEnv.errorBaseUrl).toBe('https://example.com/errors')
    expect(ratelimitConfigEnv.maxRequests).toBe(555)
    expect(ratelimitConfigEnv.windowSeconds).toBe(120)
    expect(ratelimitConfigEnv.updateInterval).toBe(4321000)
  })
})