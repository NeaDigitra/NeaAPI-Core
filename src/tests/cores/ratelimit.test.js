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
    jest.resetModules()
    const ratelimitConfigDefault = require('config/ratelimit')
    expect(ratelimitConfigDefault.maxRequests).toBe(10)
    expect([60, 10]).toContain(ratelimitConfigDefault.windowSeconds)
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

  test('Should fallback to defaults when environment variables are invalid', function () {
    process.env.RATE_LIMIT_MAX = 'notanumber'
    process.env.RATE_LIMIT_WINDOW = ''
    process.env.RATE_LIMIT_UPDATE_INTERVAL = undefined
    jest.resetModules()
    const ratelimitConfig = require('config/ratelimit')
    expect(ratelimitConfig.maxRequests).toBe(10)
    expect(ratelimitConfig.windowSeconds).toBe(60)
    expect(ratelimitConfig.updateInterval).toBe(3600000)
  })

  test('Should handle zero and negative values from environment variables', function () {
    process.env.RATE_LIMIT_MAX = '0'
    process.env.RATE_LIMIT_WINDOW = '-5'
    process.env.RATE_LIMIT_UPDATE_INTERVAL = '-100'
    jest.resetModules()
    const ratelimitConfig = require('config/ratelimit')
    expect(ratelimitConfig.maxRequests).toBe(10)
    expect(ratelimitConfig.windowSeconds).toBe(-5)
    expect(ratelimitConfig.updateInterval).toBe(-100)
  })
})

describe('ratelimit.js utility functions', () => {
  const {
    ipToLong,
    checkIpv4InCidr,
    convertIpv6ToBigint,
    checkIpv6InCidr,
    checkIpInCidrList
  } = require('middlewares/ratelimit')

  test('ipToLong should convert IPv4 to long', () => {
    expect(ipToLong('127.0.0.1')).toBe(2130706433)
    expect(ipToLong('0.0.0.0')).toBe(0)
    expect(ipToLong('255.255.255.255')).toBe(4294967295)
  })

  test('checkIpv4InCidr should check IPv4 in CIDR', () => {
    expect(checkIpv4InCidr('192.168.1.5', '192.168.1.0/24')).toBe(true)
    expect(checkIpv4InCidr('192.168.2.5', '192.168.1.0/24')).toBe(false)
    expect(checkIpv4InCidr('10.0.0.1', '10.0.0.0/8')).toBe(true)
  })

  test('convertIpv6ToBigint should convert IPv6 to bigint', () => {
    expect(convertIpv6ToBigint('::1')).toBe(BigInt(1))
    expect(convertIpv6ToBigint('2001:0db8:85a3:0000:0000:8a2e:0370:7334')).toBe(
      BigInt('0x20010db885a3000000008a2e03707334')
    )
    expect(convertIpv6ToBigint('2001:db8::1')).toBe(
      BigInt('0x20010db8000000000000000000000001')
    )
  })

  test('checkIpv6InCidr should check IPv6 in CIDR', () => {
    expect(checkIpv6InCidr('2001:db8::1', '2001:db8::/32')).toBe(true)
    expect(checkIpv6InCidr('2001:db9::1', '2001:db8::/32')).toBe(false)
    expect(checkIpv6InCidr('::1', '::1/128')).toBe(true)
  })

  test('checkIpInCidrList should check both IPv4 and IPv6', () => {
    expect(checkIpInCidrList('127.0.0.1', ['127.0.0.0/8'])).toBe(true)
    expect(checkIpInCidrList('10.0.0.1', ['192.168.0.0/16'])).toBe(false)
    expect(checkIpInCidrList('2001:db8::1', ['2001:db8::/32'])).toBe(true)
    expect(checkIpInCidrList('2001:db9::1', ['2001:db8::/32'])).toBe(false)
  })
})