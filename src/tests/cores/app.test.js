describe('App Config', () => {
  const ORIGINAL_ENV = { ...process.env }
  let appConfig

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...ORIGINAL_ENV }
  })

  afterAll(() => {
    process.env = { ...ORIGINAL_ENV }
  })

  test('should load default values when env vars are not set', () => {
    delete process.env.APP_NAME
    delete process.env.APP_VERSION
    delete process.env.APP_PORT
    delete process.env.ERROR_BASE_URL

    jest.resetModules()
    appConfig = require('config/app')
    expect(appConfig.appName).toBe('NeaCore-API')
    expect(appConfig.appVersion).toBe('1.0.0')
    expect(appConfig.appPort).toBe(3000)
    expect([
      'https://api.domain.com/errors',
      'http://localhost:3000/errors'
    ]).toContain(appConfig.errorBaseUrl)
  })

  test('should load values from environment variables', () => {
    process.env.APP_NAME = 'TestAPI'
    process.env.APP_VERSION = '2.3.4'
    process.env.APP_PORT = '8080'
    process.env.ERROR_BASE_URL = 'https://errors.example.com'

    jest.resetModules()
    appConfig = require('config/app')
    expect(appConfig.appName).toBe('TestAPI')
    expect(appConfig.appVersion).toBe('2.3.4')
    expect(appConfig.appPort).toBe(8080)
    expect(appConfig.errorBaseUrl).toBe('https://errors.example.com')
  })

  test('should parse APP_PORT as integer', () => {
    process.env.APP_PORT = '12345'
    jest.resetModules()
    appConfig = require('config/app')
    expect(appConfig.appPort).toBe(12345)
  })
})