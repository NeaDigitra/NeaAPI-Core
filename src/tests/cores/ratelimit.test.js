/**
 * Ratelimit Config Functionality Test
 * Params: None
 */
describe('Ratelimit Config Functionality Test', function () {
  const originalEnvironmentVariables = { ...process.env }

  afterEach(function () {
    process.env = { ...originalEnvironmentVariables }
    jest.resetModules()
  })

  test('Should Use Default And Environment Values For Ratelimit Config', function () {
    delete process.env.RATE_LIMIT_MAX
    delete process.env.RATE_LIMIT_WINDOW
    delete process.env.RATE_LIMIT_UPDATE_INTERVAL

    const ratelimitConfigDefault = require('config/ratelimit')

    expect(ratelimitConfigDefault.maxRequests).toBe(10)
    expect(ratelimitConfigDefault.windowSeconds).toBe(10)
    expect(ratelimitConfigDefault.updateInterval).toBe(3600000)

    process.env.RATE_LIMIT_MAX = '250'
    process.env.RATE_LIMIT_WINDOW = '120'
    process.env.RATE_LIMIT_UPDATE_INTERVAL = '500000'
    jest.resetModules()

    const ratelimitConfigEnv = require('config/ratelimit')

    expect(ratelimitConfigEnv.maxRequests).toBe(250)
    expect(ratelimitConfigEnv.windowSeconds).toBe(120)
    expect(ratelimitConfigEnv.updateInterval).toBe(500000)
  })
})