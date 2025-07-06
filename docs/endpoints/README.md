# 🔌 API Endpoints Documentation

[![API Documentation](https://img.shields.io/badge/Documentation-Complete-green)](.)
[![Endpoints](https://img.shields.io/badge/Endpoints-25%2B-blue)](.)
[![RFC7807](https://img.shields.io/badge/Errors-RFC7807-orange)](.)
[![HMAC](https://img.shields.io/badge/Security-HMAC--SHA256-red)](.)

> 🚀 **Comprehensive endpoint documentation for NeaAPI-Core** - Your guide to building robust integrations with our API platform.

---

## 📋 **Endpoint Categories**

### 🏥 [Health Check Endpoints](./health-checks.md)
> 💚 **Monitor application health, service status, and system metrics**
- ✅ Liveness probes for container orchestration
- 🔄 Readiness checks for load balancers
- 📊 Performance monitoring & system metrics
- ⚡ Real-time status indicators

### 🔧 [Example/Demo Endpoints](./example-endpoints.md)  
> 🧪 **Development and testing endpoints with various authentication levels**
- 🎯 Basic API examples & tutorials
- 🔑 Authentication workflow demonstrations
- ✅ Input validation examples
- 🛠️ Development tools & utilities

### 📋 [General API Endpoints](./general-endpoints.md)
> 🌐 **Rate-limited public API endpoints with optional authentication**
- 🚀 Public APIs for general use
- ⏱️ Smart rate limiting protection
- 🔓 Optional authentication support
- 📱 Mobile-friendly responses

### 🔒 [Secure API Endpoints](./secure-endpoints.md)
> 🛡️ **Authenticated and signed API endpoints for sensitive operations**
- 🔐 Required HMAC-SHA256 signature validation
- 🎫 Session-based authentication
- 👤 User management & authorization
- 💼 Enterprise-grade security

### ❌ [Error Documentation Endpoints](./error-endpoints.md)
> 📚 **Dynamic error documentation and RFC7807 compliant responses**
- 📖 Interactive error code documentation
- 🏷️ RFC7807 standard compliance
- 🎨 Beautiful error pages
- 🔧 Developer-friendly debugging

---
- 📊 Application status & health overview
- 📋 Version information & build details
- 🔌 Basic connectivity testing
- 🚀 API readiness indicators

---

## ⚡ **Quick Start Guide**

### 🌐 **Base URL**
```
🏠 Local Development: http://localhost:3000
🚀 Production: https://your-api-domain.com
```

### 🔐 **Authentication Methods**

| Method | Usage | Header | Security Level |
|--------|-------|--------|----------------|
| 🔑 **API Signature** | HMAC-SHA256 signing | `X-Signature` + `X-Secret` | 🔒 **High** |
| 🎫 **Session-based** | Stateful authentication | `Cookie: session=...` | 🔐 **Medium** |
| ⏱️ **Rate Limiting** | IP-based protection | *Automatic* | 🛡️ **Basic** |

### 📨 **Response Format**
> ✅ **All responses follow RFC7807 standard for consistency**

```json
{
  "status": 200,
  "message": "OK", 
  "data": {
    "result": "Your response data here",
    "items": [...],
    "meta": {...}
  },
  "trace": {
    "method": "GET",
    "hash": "abc123...",
    "path": "/api/endpoint",
    "timestamp": "2025-07-06T04:30:00.000Z",
    "responseTime": "1.234ms"
  }
}
```

### ❌ **Error Response Format**
> 🚨 **RFC7807 Problem Details for HTTP APIs**

```json
{
  "status": 400,
  "type": "https://api.domain.com/errors/bad_request",
  "title": "Bad Request",
  "detail": "The request could not be understood by the server",
  "instance": "/api/endpoint",
  "errors": {
    "field": "Validation error details"
  },
  "trace": {
    "method": "POST",
    "hash": "def456...",
    "path": "/api/endpoint",
    "timestamp": "2025-07-06T04:30:00.000Z",
    "responseTime": "0.892ms"
  }
}
```

---

## 📋 **Common Headers**

### 📥 **Request Headers**

| Header | Purpose | Example | Required |
|--------|---------|---------|----------|
| 🔐 `X-Signature` | HMAC-SHA256 signature | `abc123def456...` | 🔒 Secure endpoints |
| 🗝️ `X-Secret` | Secret key for signature | `your-secret-key` | 🔒 Secure endpoints |
| 📄 `Content-Type` | Request content type | `application/json` | ✅ POST requests |
| 🌐 `User-Agent` | Client identification | `MyApp/1.0.0` | 📱 Recommended |

### 📤 **Response Headers**
```http
Content-Type: application/json
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET,POST
Access-Control-Allow-Headers: Content-Type,X-Signature,X-Secret
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 9
X-RateLimit-Reset: 1625097600
```

---

## ⏱️ **Rate Limiting**

> 🛡️ **Smart protection against API abuse**

| Endpoint Type | Limit | Window | Reset Policy |
|---------------|-------|--------|--------------|
| 🌐 **Public** | 10 requests | 10 seconds | Rolling window |
| 🔒 **Secure** | 100 requests | 60 seconds | Fixed window |
| 🏥 **Health** | 1000 requests | 60 seconds | No limit |

### 📊 **Rate Limit Headers**
```http
X-RateLimit-Limit: 10         # Maximum requests per window
X-RateLimit-Remaining: 7       # Requests remaining in current window
X-RateLimit-Reset: 1625097600  # Unix timestamp when window resets
```

---

## 🛠️ **Development Tools**

### 🔧 **Testing with cURL**

```bash
# 🏥 Health Check
curl http://localhost:3000/health/live

# 📋 Basic API Request
curl -X POST http://localhost:3000/api/example/3 \
  -H "Content-Type: application/json" \
  -d '{"name": "test", "email": "test@example.com"}'

# 🔒 Secure Endpoint with Signature
curl -X GET "http://localhost:3000/api/secure/1?param=value" \
  -H "X-Signature: <calculated-signature>" \
  -H "X-Secret: <your-secret>"
```

### 📱 **Testing with JavaScript**

```javascript
// 🏥 Basic Health Check
fetch('http://localhost:3000/health/live')
  .then(response => response.json())
  .then(data => console.log('✅ Health:', data))

// 📋 POST Request with JSON
fetch('http://localhost:3000/api/example/3', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'test',
    email: 'test@example.com'
  })
})
.then(response => response.json())
.then(data => console.log('✅ Response:', data))

// 🔒 Secure Request with Signature (see secure-endpoints.md for signature calculation)
const signature = calculateSignature(queryParams, bodyData, secret)
fetch('http://localhost:3000/api/secure/1?param=value', {
  headers: {
    'X-Signature': signature,
    'X-Secret': 'your-secret'
  }
})
.then(response => response.json())
.then(data => console.log('🔒 Secure:', data))
```

---

## 🚀 **Environment Setup**

### 🔧 **Required Services**
| Service | Version | Purpose |
|---------|---------|---------|
| 🟢 **Node.js** | v22.16.0+ | Runtime environment |
| 🗄️ **Database** | MySQL/PostgreSQL | Data persistence |
| 🔄 **Redis** | Latest | Caching & rate limiting |

### ⚙️ **Environment Variables**
```bash
# 🚀 Application Configuration
APP_NAME=NeaCore-API
APP_VERSION=1.0.0
APP_PORT=3000
APP_ENV=development

# 🗄️ Database Configuration
DB_CLIENT=mysql2
DB_HOST=localhost
DB_PORT=3306
DB_USER=username
DB_PASSWORD=password
DB_NAME=database_name

# 🔄 Redis Configuration
REDIS_URL=redis://localhost:6379
REDIS_KEY_PREFIX=neaapi:

# ⏱️ Rate Limiting
RATE_LIMIT_MAX=10
RATE_LIMIT_WINDOW=10

# 🌐 CORS Configuration
CORS_ORIGIN=*
CORS_METHODS=GET,POST
CORS_HEADERS=Content-Type,X-Signature,X-Secret
```

---

## 🏗️ **Production Considerations**

### 🔒 **Security**
- ✅ Enable HTTPS in production
- 🔑 Use proper API secrets and signatures
- 🌐 Configure CORS for specific origins
- 🛡️ Implement proper rate limiting
- 🔐 Regular security audits

### 📊 **Monitoring**
- 🏥 Use health check endpoints for monitoring
- 🚨 Set up alerts for service failures
- ⏱️ Monitor response times and error rates
- 📈 Track API usage and rate limiting
- 📋 Log all security events

### ⚡ **Performance**
- 🔄 Enable Redis caching
- 🗄️ Configure database connection pooling
- 🌐 Use CDN for static assets
- 📦 Implement request/response compression
- 🚀 Optimize database queries

---

## 📚 **Next Steps**

> 🎯 **Ready to dive deeper?** Check out the detailed documentation for each endpoint category:

- 🏥 **Start with**: [Health Check Endpoints](./health-checks.md) for monitoring
- 🔧 **Learn with**: [Example Endpoints](./example-endpoints.md) for hands-on tutorials
- 📋 **Build with**: [General API Endpoints](./general-endpoints.md) for public features
- 🔒 **Secure with**: [Secure Endpoints](./secure-endpoints.md) for authenticated operations
- ❌ **Debug with**: [Error Documentation](./error-endpoints.md) for troubleshooting

---

**Happy coding! 🚀**
