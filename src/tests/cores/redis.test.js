const mockOn = jest.fn().mockReturnThis()
const mockConnect = jest.fn(() => ({
  catch: jest.fn()
}))
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
      username: undefined,
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
      username: undefined,
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

  it('should return singleton instance on multiple calls', () => {
    const createRedisClient = require('services/redis')
    const client1 = createRedisClient()
    const client2 = createRedisClient()
    expect(client1).toBe(client2)
    expect(mockCreateClient).toHaveBeenCalledTimes(1)
  })

  it('should handle error events in production environment', () => {
    process.env.NODE_ENV = 'production'
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
    global.app = { appName: 'TestApp' }

    jest.resetModules()
    const createRedisClient = require('services/redis')
    const client = createRedisClient()

    const errorHandler = mockOn.mock.calls.find(call => call[0] === 'error')[1]
    const mockError = new Error('Connection failed')
    mockError.stack = 'Error: Connection failed\n    at test'
    errorHandler(mockError)

    expect(consoleErrorSpy).toHaveBeenCalledWith('[TestApp-Redis] Client Error:', 'Error: Connection failed\n    at test')
    consoleErrorSpy.mockRestore()
  })

  it('should handle ready events in production environment', () => {
    process.env.NODE_ENV = 'production'
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation()
    global.app = { appName: 'TestApp' }

    jest.resetModules()
    const createRedisClient = require('services/redis')
    const client = createRedisClient()

    const readyHandler = mockOn.mock.calls.find(call => call[0] === 'ready')[1]
    readyHandler()

    expect(consoleLogSpy).toHaveBeenCalledWith('[TestApp-Redis] Client Connected Successfully')
    consoleLogSpy.mockRestore()
  })

  it('should handle end events in production environment', () => {
    process.env.NODE_ENV = 'production'
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation()
    global.app = { appName: 'TestApp' }

    jest.resetModules()
    const createRedisClient = require('services/redis')
    const client = createRedisClient()

    const endHandler = mockOn.mock.calls.find(call => call[0] === 'end')[1]
    endHandler()

    expect(consoleLogSpy).toHaveBeenCalledWith('[TestApp-Redis] Client Disconnected')
    consoleLogSpy.mockRestore()
  })

  it('should handle connection errors in production environment', () => {
    process.env.NODE_ENV = 'production'
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
    global.app = { appName: 'TestApp' }

    const mockCatch = jest.fn((callback) => {
      callback(new Error('Connection timeout'))
    })
    mockConnect.mockReturnValue({ catch: mockCatch })

    jest.resetModules()
    const createRedisClient = require('services/redis')
    const client = createRedisClient()

    expect(consoleErrorSpy).toHaveBeenCalledWith('[TestApp-Redis] Connection Error:', 'Connection timeout')
    consoleErrorSpy.mockRestore()
  })

  it('should include REDIS_USERNAME when provided', () => {
    process.env.REDIS_USERNAME = 'testuser'
    jest.resetModules()
    const createRedisClient = require('services/redis')
    createRedisClient()
    expect(mockCreateClient).toHaveBeenCalledWith({
      url: 'redis://test:6379',
      username: 'testuser',
      password: 'testpass',
    })
  })
})