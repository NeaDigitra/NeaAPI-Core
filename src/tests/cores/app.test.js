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

  test('should handle APP_DEBUG true correctly', () => {
    process.env.APP_DEBUG = 'true'
    process.env.APP_NAME = 'DebugAPI'
    process.env.APP_VERSION = '1.2.3'
    process.env.APP_PORT = '9000'
    process.env.ERROR_BASE_URL = 'https://debug.example.com/errors'

    jest.resetModules()
    appConfig = require('config/app')
    expect(appConfig.appName).toBe('DebugAPI')
    expect(appConfig.appVersion).toBe('1.2.3')
    expect(appConfig.appPort).toBe(9000)
    expect(appConfig.errorBaseUrl).toBe('https://debug.example.com/errors')
  })

  test('should handle APP_DEBUG false correctly', () => {
    process.env.APP_DEBUG = 'false'
    jest.resetModules()
    appConfig = require('config/app')
    expect(appConfig.appName).toBe('NeaCore-API')
  })

  test('should fallback to default port when APP_PORT is invalid', () => {
    process.env.APP_PORT = 'invalid-port'
    jest.resetModules()
    appConfig = require('config/app')
    expect(appConfig.appPort).toBe(3000)
  })

  test('should fallback to default port when APP_PORT is empty', () => {
    process.env.APP_PORT = ''
    jest.resetModules()
    appConfig = require('config/app')
    expect(appConfig.appPort).toBe(3000)
  })

  test('should handle NaN APP_PORT correctly', () => {
    process.env.APP_PORT = 'NaN'
    jest.resetModules()
    appConfig = require('config/app')
    expect(appConfig.appPort).toBe(3000)
  })

  test('should handle undefined environment variables', () => {
    delete process.env.APP_NAME
    delete process.env.APP_VERSION
    delete process.env.APP_PORT
    delete process.env.ERROR_BASE_URL
    delete process.env.APP_DEBUG

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

  test('should use environment values when they are set (test OR operators)', () => {
    process.env.APP_NAME = 'CustomAPI'
    process.env.APP_VERSION = '2.0.0'
    process.env.ERROR_BASE_URL = 'https://custom.example.com/errors'

    jest.resetModules()
    appConfig = require('config/app')
    expect(appConfig.appName).toBe('CustomAPI')
    expect(appConfig.appVersion).toBe('2.0.0')
    expect(appConfig.errorBaseUrl).toBe('https://custom.example.com/errors')
  })

  test('should use defaults when environment values are empty strings (test OR operators)', () => {
    process.env.APP_NAME = ''
    process.env.APP_VERSION = ''
    process.env.ERROR_BASE_URL = ''

    jest.resetModules()
    appConfig = require('config/app')
    expect(appConfig.appName).toBe('NeaCore-API')
    expect(appConfig.appVersion).toBe('1.0.0')
    expect(appConfig.errorBaseUrl).toBe('https://api.domain.com/errors')
  })
})