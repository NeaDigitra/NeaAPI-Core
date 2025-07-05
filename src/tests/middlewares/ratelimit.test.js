const request = require('supertest')
const express = require('express')
const axios = require('axios')
const redisClient = require('services/redis')
const ratelimit = require('middlewares/ratelimit')
const { setup, initCloudflareIpService, updateCloudflareIps, convertIpv6ToBigint } = ratelimit

jest.mock('axios', () => ({ get: jest.fn().mockResolvedValue({ data: '' }) }))
jest.mock('services/redis', () => ({
  get: jest.fn(),
  set: jest.fn(),
  incr: jest.fn()
}))

describe('Rate Limit Middleware', () => {
  let app
  beforeAll(async () => {
    app = express()
    app.use(setup)
    app.get('/test', (req, res) => res.json({ success: true }))
    jest.spyOn(ratelimit, 'initCloudflareIpService').mockResolvedValue()
    await initCloudflareIpService()
  }, 15000)

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should call next() if cloudflare ip valid', async () => {
    redisClient.get.mockResolvedValue('1')
    redisClient.incr.mockResolvedValue(2)
    const response = { api: jest.fn() }
    const request = {
      connection: { remoteAddress: '173.245.48.1' },
      headers: {},
      ip: '173.245.48.1'
    }
    const next = jest.fn()
    await setup(request, response, next)
    expect(next).toHaveBeenCalled()
  })

  it('should allow first request and set redis key', async () => {
    redisClient.get.mockResolvedValue(null)
    redisClient.set.mockResolvedValue('OK')
    const res = await request(app).get('/test').set('cf-connecting-ip', '1.1.1.1')
    expect(res.statusCode).toBe(200)
    expect(res.body.success).toBe(true)
  })

  it('should increment redis key if under limit', async () => {
    redisClient.get.mockResolvedValue('1')
    redisClient.incr.mockResolvedValue(2)
    const res = await request(app).get('/test').set('cf-connecting-ip', '1.1.1.1')
    expect(res.statusCode).toBe(200)
    expect(res.body.success).toBe(true)
  })

  it('should block request if over limit', async () => {
    redisClient.get.mockResolvedValue('100')
    const res = await request(app).get('/test').set('cf-connecting-ip', '173.245.48.1')
    expect(res.statusCode).toBe(500)
  })

  it('should skip rate limit for local IP', async () => {
    redisClient.get.mockResolvedValue(null)
    redisClient.set.mockResolvedValue('OK')
    const res = await request(app).get('/test').set('cf-connecting-ip', '127.0.0.1')
    expect(res.statusCode).toBe(200)
  })

  it('should forbidden if not cloudflare ip', async () => {
    const originalIps = ratelimit.__get__ ? ratelimit.__get__('cloudflareIps') : null
    if (ratelimit.__set__) ratelimit.__set__('cloudflareIps', ['1.1.1.0/24'])
    const response = { api: jest.fn() }
    const request = {
      connection: { remoteAddress: '8.8.8.8' },
      headers: {},
      ip: '8.8.8.8'
    }
    await setup(request, response, () => { })
    expect(response.api).toHaveBeenCalledWith('forbidden')
    if (ratelimit.__set__) ratelimit.__set__('cloudflareIps', originalIps)
  })

  it('should fallback to defaultCloudflareIps on axios error', async () => {
    axios.get.mockRejectedValueOnce(new Error('axios fail'))
    await expect(updateCloudflareIps()).resolves.toBeUndefined()
  })

  it('should update cloudflareIps if axios get success', async () => {
    axios.get
      .mockResolvedValueOnce({ data: '10.0.0.0/24\n10.0.1.0/24' })
      .mockResolvedValueOnce({ data: 'abcd::/64\nbeef::/64' })
    await updateCloudflareIps()
  })

  it('should throw on invalid IPv6', () => {
    expect(() => convertIpv6ToBigint('1.2.3.4')).toThrow('Invalid IPv6 address')
  })

  it('should export all function', () => {
    expect(typeof setup).toBe('function')
    expect(typeof initCloudflareIpService).toBe('function')
    expect(typeof ratelimit.ipToLong).toBe('function')
    expect(typeof ratelimit.checkIpv4InCidr).toBe('function')
    expect(typeof ratelimit.convertIpv6ToBigint).toBe('function')
    expect(typeof ratelimit.checkIpv6InCidr).toBe('function')
    expect(typeof ratelimit.checkIpInCidrList).toBe('function')
  })
})

describe('Ratelimit Helper Functions', () => {
  const { ipToLong, checkIpv4InCidr, convertIpv6ToBigint, checkIpv6InCidr, checkIpInCidrList } = ratelimit
  it('ipToLong should work', () => {
    expect(ipToLong('127.0.0.1')).toBe(2130706433)
  })
  it('checkIpv4InCidr should work', () => {
    expect(checkIpv4InCidr('192.168.1.10', '192.168.1.0/24')).toBe(true)
  })
  it('convertIpv6ToBigint should work', () => {
    expect(typeof convertIpv6ToBigint('::1')).toBe('bigint')
  })
  it('checkIpv6InCidr should work', () => {
    expect(checkIpv6InCidr('2400:cb00::1', '2400:cb00::/32')).toBe(true)
  })
  it('checkIpInCidrList for ipv4/ipv6 should work', () => {
    expect(checkIpInCidrList('192.168.1.1', ['192.168.1.0/24'])).toBe(true)
    expect(checkIpInCidrList('2400:cb00::1', ['2400:cb00::/32'])).toBe(true)
  })
})