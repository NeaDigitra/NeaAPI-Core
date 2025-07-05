const mockOn = jest.fn().mockReturnThis()
const mockConnect = jest.fn().mockReturnThis()
const mockQuit = jest.fn().mockReturnThis()
const mockCreateClient = jest.fn(() => ({
  on: mockOn,
  connect: mockConnect,
  quit: mockQuit
}))

jest.mock('redis', () => ({
  createClient: mockCreateClient,
}))

jest.mock('config/app', () => ({
  appName: 'TestApp',
}))

describe('Redis Client', () => {
  const ORIGINAL_NODE_ENV = process.env.NODE_ENV

  beforeEach(() => {
    jest.clearAllMocks()
    process.env.REDIS_URL = 'redis://test:6379'
    process.env.REDIS_PASSWORD = 'testpass'
    process.env.NODE_ENV = 'test'
    jest.resetModules()
  })

  afterEach(() => {
    delete process.env.REDIS_URL
    delete process.env.REDIS_PASSWORD
    process.env.NODE_ENV = ORIGINAL_NODE_ENV
  })

  it('should create a redis client with correct config', () => {
    const createRedisClient = require('services/redis')
    createRedisClient()
    expect(mockCreateClient).toHaveBeenCalledWith({
      url: 'redis://test:6379',
      password: 'testpass',
    })
  })

  it('should use default values if env vars are not set', () => {
    delete process.env.REDIS_URL
    delete process.env.REDIS_PASSWORD
    jest.resetModules()
    const createRedisClient = require('services/redis')
    createRedisClient()
    expect(mockCreateClient).toHaveBeenCalledWith({
      url: 'redis://localhost:6379',
      password: undefined,
    })
  })

  it('should set up event listeners and connect if not in test env', () => {
    process.env.NODE_ENV = 'production'
    jest.resetModules()
    const createRedisClient = require('services/redis')
    const redisClient = createRedisClient()
    redisClient.connect()
    expect(mockOn).toHaveBeenCalledWith('error', expect.any(Function))
    expect(mockOn).toHaveBeenCalledWith('ready', expect.any(Function))
    expect(mockConnect).toHaveBeenCalled()
  })

  it('should call quit when closed', async () => {
    const createRedisClient = require('services/redis')
    const redisClient = createRedisClient()
    await redisClient.connect()
    await redisClient.quit()
    expect(mockQuit).toHaveBeenCalled()
  })
})