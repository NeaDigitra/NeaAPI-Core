const axios = require('axios')
const redisClient = require('services/redis')
const rateLimitConfig = require('config/ratelimit')

/**
 * Default Cloudflare IPs
 * - This array contains the default IP ranges used by Cloudflare.
 * - It is used as a fallback if the dynamic update fails.
 */
const defaultCloudflareIps = [
  '173.245.48.0/20', '103.21.244.0/22', '103.22.200.0/22', '103.31.4.0/22',
  '141.101.64.0/18', '108.162.192.0/18', '190.93.240.0/20', '188.114.96.0/20',
  '197.234.240.0/22', '198.41.128.0/17', '162.158.0.0/15', '104.16.0.0/13',
  '104.24.0.0/14', '172.64.0.0/13', '131.0.72.0/22'
]
let cloudflareIps = [...defaultCloudflareIps]

/**
 * Update Cloudflare IPs
 * - Fetches the latest Cloudflare IPs from their API.
 * - If the fetch fails, it falls back to the default IPs.
 */
async function updateCloudflareIps() {
  try {
    const v4 = await axios.get('https://www.cloudflare.com/ips-v4')
    const fetchedIps = v4.data.split('\n').filter(Boolean)
    if (fetchedIps.length > 0) {
      cloudflareIps = fetchedIps
    }
  } catch (error) {
    cloudflareIps = [...defaultCloudflareIps]
  }
}

/**
 * Initialize Cloudflare IP Service
 * - Calls `updateCloudflareIps` to fetch the latest IPs.
 * - Sets an interval to update the IPs every hour.
 */
function initCloudflareIpService() {
  updateCloudflareIps()
  setInterval(updateCloudflareIps, 3600000)
}

/**
 * Convert IPv4 Address to Long Integer
 * - Converts an IPv4 address (e.g., '192.168.1.1') to a long integer.
 */
function ipToLong(ipAddress) {
  return ipAddress.split('.').reduce((acc, octet) => ((acc << 8) + parseInt(octet, 10)), 0) >>> 0
}

/**
 * Check if IPv4 Address is in CIDR Range
 * - Checks if a given IPv4 address is within a specified CIDR range.
 * - Returns true if the IP is in the range, false otherwise.
 */
function checkIpv4InCidr(ipAddress, rangeCidr) {
  const [range, bits = 32] = rangeCidr.split('/')
  const ipLong = ipToLong(ipAddress)
  const rangeLong = ipToLong(range)
  const mask = ~(2 ** (32 - bits) - 1) >>> 0
  return (ipLong & mask) === (rangeLong & mask)
}

/**
 * Check if IPv4 Address is in CIDR List
 * - Checks if a given IPv4 address is in any of the CIDR ranges provided in the list.
 * - Returns true if the IP is in any range, false otherwise.
 */
function checkIpInCidrList(ipAddress, cidrList) {
  return cidrList.some(cidr => checkIpv4InCidr(ipAddress, cidr))
}

/**
 * Rate Limit Middleware
 * - This middleware checks if the request is coming from a Cloudflare IP.
 * - It limits the number of requests from a single IP address within a specified time window.
 */
module.exports = {
  setup: async function rateLimitMiddleware(request, response, next) {
    const remoteIp = (request.connection.remoteAddress || request.socket.remoteAddress).replace(/^::ffff:/, '')
    const clientIp = (request.headers['cf-connecting-ip'] || request.ip).split(',')[0].trim()
    const clientKey = `rate:${clientIp}`
    const current = await redisClient.get(clientKey)
    if (!current) {
      await redisClient.set(clientKey, 1, { EX: rateLimitConfig.windowSeconds })
    } else if (parseInt(current) < rateLimitConfig.maxRequests) {
      await redisClient.incr(clientKey)
    } else {
      return response.api('rate_limit_exceeded')
    }
    if (['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(remoteIp)) {
      return next()
    }
    if (!(checkIpInCidrList(remoteIp, cloudflareIps))) {
      return response.api('forbidden')
    }
    return next()
  },
  initCloudflareIpService
}