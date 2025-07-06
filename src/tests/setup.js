// Setup global app configuration
global.app = {
  appName: 'NeaCore-API-Test',
  appVersion: '1.0.0',
  appPort: 3000,
  errorBaseUrl: 'https://api.domain.com/errors'
}

// Setup global rate limit configuration
global.rateLimit = {
  maxRequests: 100,
  windowSeconds: 60
}

// Mock Redis client for tests
const mockRedisClient = {
  connect: jest.fn().mockResolvedValue(undefined),
  quit: jest.fn().mockResolvedValue(undefined),
  on: jest.fn(),
  ping: jest.fn().mockResolvedValue('PONG'),
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  exists: jest.fn(),
  expire: jest.fn(),
  ttl: jest.fn()
}

// Setup global redis function
global.redis = jest.fn(() => mockRedisClient)

// Mock console methods to reduce noise during tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn()
}

// Set test environment
process.env.NODE_ENV = 'test'