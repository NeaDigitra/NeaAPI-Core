const axios = require('axios')
const redisClient = require('services/redis')
const rateLimitConfig = require('config/ratelimit')

/**
 * Default Cloudflare IPs.
 * - These IPs are used to identify and allow traffic from Cloudflare's network.
 */
const defaultCloudflareIps = [
  '173.245.48.0/20', '103.21.244.0/22', '103.22.200.0/22', '103.31.4.0/22',
  '141.101.64.0/18', '108.162.192.0/18', '190.93.240.0/20', '188.114.96.0/20',
  '197.234.240.0/22', '198.41.128.0/17', '162.158.0.0/15', '104.16.0.0/13',
  '104.24.0.0/14', '172.64.0.0/13', '131.0.72.0/22', '2400:cb00::/32',
  '2606:4700::/32', '2803:f800::/32', '2405:b500::/32', '2405:8100::/32',
  '2a06:98c0::/29', '2c0f:f248::/32'
]
let cloudflareIps = [...defaultCloudflareIps]

/**
 * Update Cloudflare IPs
 * - Fetches the latest Cloudflare IPs from their API.
 * - Updates the internal list of Cloudflare IPs.
 */
async function updateCloudflareIps() {
  try {
    const [v4, v6] = await Promise.all([
      axios.get('https://www.cloudflare.com/ips-v4'),
      axios.get('https://www.cloudflare.com/ips-v6')
    ])
    const fetchedV4Ips = v4.data.split('\n').filter(Boolean)
    const fetchedV6Ips = v6.data.split('\n').filter(Boolean)
    if (fetchedV4Ips.length > 0 || fetchedV6Ips.length > 0) {
      cloudflareIps = [...fetchedV4Ips, ...fetchedV6Ips]
    }
  } catch (error) {
    cloudflareIps = [...defaultCloudflareIps]
  }
}

/**
 * Initializes the Cloudflare IP service.
 * - Fetches the initial list of Cloudflare IPs.
 * - Sets up a periodic update to refresh the IPs.
 */
async function initCloudflareIpService() {
  await updateCloudflareIps()
  setInterval(updateCloudflareIps, rateLimitConfig.updateInterval)
}

/**
 * Converts an IPv4 address to a long integer.
 * - This function splits the IP address into its octets and converts each to a long integer.
 * - The result is a 32-bit unsigned integer representation of the IP address.
 */
function ipToLong(ipAddress) {
  return ipAddress.split('.').reduce((acc, octet) => ((acc << 8) + parseInt(octet, 10)), 0) >>> 0
}

/**
 * Checks if an IPv4 address is within a given CIDR range.
 * - This function splits the CIDR range into the base IP and the number of bits.
 * - It converts both the IP address and the base IP to long integers.
 */
function checkIpv4InCidr(ipAddress, rangeCidr) {
  const [range, bits = 32] = rangeCidr.split('/')
  const ipLong = ipToLong(ipAddress)
  const rangeLong = ipToLong(range)
  const mask = ~(2 ** (32 - bits) - 1) >>> 0
  return (ipLong & mask) === (rangeLong & mask)
}

/**
 * Converts an IPv6 address to a bigint.
 * - This function handles the shorthand notation of IPv6 addresses (using `::`).
 * - It splits the address into parts, fills in the missing zeros, and converts it to a bigint.
 */
function convertIpv6ToBigint(ipAddress) {
  if (!(ipAddress.includes(':'))) {
    throw new Error('Invalid IPv6 address')
  }
  const parts = ipAddress.split('::')
  const head = parts[0] ? parts[0].split(':') : []
  const tail = parts[1] ? parts[1].split(':') : []
  const zeros = Array(8 - head.length - tail.length).fill('0')
  const full = [...head, ...zeros, ...tail].map(x => x || '0')
  const hex = full.map(x => x.padStart(4, '0')).join('')
  return BigInt('0x' + hex)
}

/**
 * Checks if an IPv6 address is within a given CIDR range.
 * - This function splits the CIDR range into the base IP and the number of bits.
 * - It converts both the IP address and the base IP to bigints.
 */
function checkIpv6InCidr(ipAddress, rangeCidr) {
  const [range, bits = 128] = rangeCidr.split('/')
  const ipBig = convertIpv6ToBigint(ipAddress)
  const rangeBig = convertIpv6ToBigint(range)
  const mask = (BigInt(1) << BigInt(128 - bits)) - BigInt(1)
  const networkMask = ~mask & ((BigInt(1) << BigInt(128)) - BigInt(1))
  return (ipBig & networkMask) === (rangeBig & networkMask)
}

/**
 * Checks if an IP address is within a list of CIDR ranges.
 * - This function determines if the provided IP address (IPv4 or IPv6) is within any of the CIDR ranges.
 */
function checkIpInCidrList(ipAddress, cidrList) {
  if (ipAddress.includes(':')) {
    return cidrList.some(cidr => checkIpv6InCidr(ipAddress, cidr))
  }
  return cidrList.some(cidr => checkIpv4InCidr(ipAddress, cidr))
}

/**
 * Rate Limit Middleware
 * - This middleware limits the number of requests a client can make within a specified time window.
 * - It checks the client's IP against a list of allowed Cloudflare IPs.
 */
module.exports = {
  setup: async function rateLimitMiddleware(request, response, next) {
    const localIps = ['::1', '127.0.0.1', '::ffff:127.0.0.1']
    const remoteIp = (request.connection.remoteAddress || request.socket.remoteAddress).replace(/^::ffff:/, '')
    const clientIp = (request.headers['cf-connecting-ip'] || request.ip).split(',')[0].trim()
    const clientKey = `rate:${clientIp}`
    const current = await redisClient.get(clientKey)
    if (!(current)) {
      await redisClient.set(clientKey, 1, { EX: rateLimitConfig.windowSeconds })
    } else if (parseInt(current) < rateLimitConfig.maxRequests) {
      await redisClient.incr(clientKey)
    } else {
      return response.api('rate_limit_exceeded')
    }
    if (localIps.includes(remoteIp)) {
      return next()
    }
    if (!(checkIpInCidrList(remoteIp, cloudflareIps))) {
      return response.api('forbidden')
    }
    return next()
  },
  updateCloudflareIps, initCloudflareIpService,
  ipToLong, checkIpv4InCidr, convertIpv6ToBigint, checkIpv6InCidr, checkIpInCidrList
}