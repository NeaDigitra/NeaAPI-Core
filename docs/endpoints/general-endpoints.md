# 📋 General API Endpoints

[![Authentication](https://img.shields.io/badge/Auth-Optional%2FSignature-orange)](.)
[![Rate Limited](https://img.shields.io/badge/Rate%20Limited-Yes-red)](.)
[![Security](https://img.shields.io/badge/Security-HMAC--SHA256-blue)](.)

> 🌐 **Rate-limited public API endpoints with optional signature authentication** - Enhanced versions of example endpoints with production-grade security features.

---

## 🌐 **Base Path**
```
📋 /api/general
```

## 🔓 **Authentication**

| Endpoint | Authentication | Rate Limiting | Description |
|----------|---------------|---------------|-------------|
| 🔓 `GET /api/general/1` | None required | ✅ Enabled | Public endpoint with rate limiting |
| 🔐 `GET /api/general/2` | API Signature | ✅ Enabled | Secure endpoint with HMAC authentication |
| 🔐 `POST /api/general/3` | API Signature | ✅ Enabled | Secure POST with validation |

---

## 🔌 **Available Endpoints**

> **📌 Important**: These endpoints use the same controller logic as [Example Endpoints](./example-endpoints.md) but with different authentication and rate limiting requirements.

### 1️⃣ **GET /api/general/1**

> 🔓 **Public endpoint with rate limiting** - Same functionality as `/api/example/1` but with rate limiting protection

**Method**: `GET`  
**Path**: `/api/general/1`  
**Authentication**: 🔓 **None required**  
**Rate Limiting**: ✅ **Enabled**  
**Controller**: Same as `GET /api/example/1`

**Response**: Identical to [Example Endpoint 1](./example-endpoints.md#get-apiexample1) with additional rate limiting headers.

**Quick Test**:
```bash
curl http://localhost:3000/api/general/1
```

---

### 2️⃣ **GET /api/general/2**

> 🔐 **Secure endpoint with signature authentication** - Same functionality as `/api/example/2` but requires API signature

**Method**: `GET`  
**Path**: `/api/general/2`  
**Authentication**: 🔑 **API Signature required**  
**Rate Limiting**: ✅ **Enabled**  
**Controller**: Same as `GET /api/example/2`

**Response**: Identical to [Example Endpoint 2](./example-endpoints.md#get-apiexample2)

**Required Headers**:
- `X-Secret`: Your API secret key
- `X-Signature`: HMAC-SHA256 calculated signature  
- `X-Nonce`: Unique random string

---

### 3️⃣ **POST /api/general/3**

> 🔐 **Secure POST endpoint with signature authentication** - Same functionality as `/api/example/3` but requires API signature

**Method**: `POST`  
**Path**: `/api/general/3`  
**Authentication**: 🔑 **API Signature required**  
**Rate Limiting**: ✅ **Enabled**  
**Validation**: ✅ **Input validation enabled**  
**Controller**: Same as `POST /api/example/3`

**Response**: Identical to [Example Endpoint 3](./example-endpoints.md#post-apiexample3)

**Required Headers**: Same as `/api/general/2` above

---

## 🔑 **API Signature Authentication**

For endpoints `/api/general/2` and `/api/general/3`, you need to calculate an HMAC-SHA256 signature:

1. **Merge and sort** all request parameters (query + body)
2. **Exclude** `x-secret` and `x-signature` from calculation  
3. **Create payload**: Format as `key=value&key=value`
4. **Generate signature**: `HMAC-SHA256(payload, secret)`

**Quick Example**:
```javascript
const crypto = require('crypto')
const secret = 'your-secret-key'
const params = { name: 'John', age: 30 }

// Create sorted payload: "age=30&name=John"
const keys = Object.keys(params).sort()
const payload = keys.map(key => `${key}=${params[key]}`).join('&')

// Generate signature
const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex')
```

> **📚 For detailed signature examples and implementation**, see [Secure Endpoints Documentation](./secure-endpoints.md#signature-calculation-algorithm)

---

## 🌍 **Rate Limiting**

All endpoints in this category are protected by rate limiting:

- **Rate Limit**: 100 requests per minute per IP
- **Burst Limit**: 10 requests per second
- **Headers**: Standard rate limit headers included in responses

### 📊 **Rate Limit Headers**
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1625097600
```

---

## 🎯 **Use Cases**

### 🔓 **Public API Integration**
Use `/api/general/1` for public data that doesn't require authentication but needs rate limiting protection.

### 🔐 **Secure Data Exchange**
Use `/api/general/2` and `/api/general/3` for authenticated API integrations requiring HMAC signature validation.

### 📱 **Mobile Applications**
Perfect for mobile apps that need both public and authenticated endpoints with consistent rate limiting.

### 🌐 **Microservices Communication**
Ideal for service-to-service communication where some endpoints are public and others require authentication.

---

## 🚀 **Performance Considerations**

- Rate limiting is implemented using Redis for high performance
- Signature validation adds ~1-2ms overhead
- Cloudflare IP detection for accurate rate limiting
- Connection pooling recommended for high-throughput applications

---

## 📝 **Notes**

- All endpoints use the same response format as example endpoints
- Rate limiting applies per IP address with Cloudflare detection
- Signature validation uses HMAC-SHA256 for maximum security
- Input validation follows the same rules as example endpoints
- Error responses follow RFC7807 standard
