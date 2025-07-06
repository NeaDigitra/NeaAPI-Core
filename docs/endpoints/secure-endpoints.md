# 🔒 Secure API Endpoints

[![Authentication](https://img.shields.io/badge/Auth-Session%2BSignature-red)](.)
[![Security](https://img.shields.io/badge/Security-Enterprise%20Grade-darkred)](.)
[![Rate Limited](https://img.shields.io/badge/Rate%20Limited-Yes-red)](.)

> 🛡️ **Enterprise-grade secure endpoints** - Protected by HMAC-SHA256 signatures and session authentication for sensitive operations.

---

## 🌐 **Base Path**
```
🔒 /api/secure
```

## 🔐 **Authentication Requirements**

All secure endpoints require **both** session authentication and API signature validation:

| Requirement | Status | Description |
|-------------|--------|-------------|
| 🎫 **Active Session** | ✅ Required | Valid user session with session ID |
| 🔐 **API Signature** | ✅ Required | HMAC-SHA256 signature validation |
| 🌐 **Rate Limiting** | ✅ Enabled | Enhanced rate limiting protection |

### 1️⃣ **Session Management**
- User must be authenticated with valid session
- Session ID used as part of request fingerprinting
- Session validation happens before signature check

### 2️⃣ **API Signature**
- HMAC-SHA256 signature required for all requests
- Signature calculation includes request parameters
- Prevents request tampering and ensures authenticity

### 3️⃣ **Required Headers**
```http
Cookie: session_id=your_session_id
X-Secret: your_api_secret_key
X-Signature: calculated_hmac_sha256_signature
X-Nonce: unique_random_string
```

---

## 🧮 **Signature Calculation Algorithm** {#signature-calculation-algorithm}

The signature is calculated using HMAC-SHA256 with the following steps:

1. **Merge parameters**: Combine `req.query` and `req.body` 
2. **Sort keys**: Alphabetically sort all parameter keys
3. **Exclude headers**: Remove `x-secret` and `x-signature` from payload
4. **Create payload**: Format as `key=value&key=value` (URL-encoded)
5. **Generate signature**: `HMAC-SHA256(payload, secret)`

### 💡 **Implementation Examples**

#### 🟢 **JavaScript/Node.js**
```javascript
const crypto = require('crypto')

function calculateSignature(queryParams = {}, bodyParams = {}, secret) {
  // Step 1: Merge parameters
  const combined = { ...queryParams, ...bodyParams }
  
  // Step 2: Remove signature-related fields
  delete combined['x-secret']
  delete combined['x-signature']
  
  // Step 3: Sort and create payload
  const keys = Object.keys(combined).sort()
  const payload = keys.map(key => {
    let value = combined[key]
    if (Array.isArray(value)) value = value.join(',')
    if (typeof value === 'object') value = JSON.stringify(value)
    return `${key}=${value}`
  }).join('&')
  
  // Step 4: Generate HMAC-SHA256 signature
  return crypto.createHmac('sha256', secret).update(payload).digest('hex')
}

// Example usage
const queryParams = { user_id: '123', status: 'active' }
const bodyParams = { name: 'John', email: 'john@example.com' }
const secret = 'your-secret-key'

const signature = calculateSignature(queryParams, bodyParams, secret)
console.log('🔐 Signature:', signature)
```

#### 🐍 **Python**
```python
import hmac
import hashlib
import json
from urllib.parse import urlencode

def calculate_signature(query_params=None, body_params=None, secret=''):
    """Calculate HMAC-SHA256 signature for API request"""
    combined = {}
    
    if query_params:
        combined.update(query_params)
    if body_params:
        combined.update(body_params)
    
    # Remove signature-related fields
    combined.pop('x-secret', None)
    combined.pop('x-signature', None)
    
    # Sort and create payload
    sorted_keys = sorted(combined.keys())
    parts = []
    for key in sorted_keys:
        value = combined[key]
        if isinstance(value, list):
            value = ','.join(map(str, value))
        elif isinstance(value, dict):
            value = json.dumps(value, separators=(',', ':'))
        parts.append(f"{key}={value}")
    
    payload = '&'.join(parts)
    
    # Generate HMAC-SHA256 signature  
    return hmac.new(secret.encode(), payload.encode(), hashlib.sha256).hexdigest()

# Example usage
query_params = {'user_id': '123', 'status': 'active'}
body_params = {'name': 'John', 'email': 'john@example.com'}
secret = 'your-secret-key'

signature = calculate_signature(query_params, body_params, secret)
print('🔐 Signature:', signature)
```

---

## 🔌 **Available Endpoints**

> **📌 Important**: These endpoints use the same controller logic as [Example Endpoints](./example-endpoints.md) but require **both session authentication AND API signature validation**.

### 1️⃣ **GET /api/secure/1**

> 🛡️ **Maximum security endpoint** - Same functionality as `/api/example/1` but with enterprise-grade security

**Method**: `GET`  
**Path**: `/api/secure/1`  
**Authentication**: 🔐 **Session + API Signature required**  
**Rate Limiting**: ✅ **Enhanced protection**  
**Controller**: Same as `GET /api/example/1`

**Response**: Identical to [Example Endpoint 1](./example-endpoints.md#get-apiexample1)

**Security**: Session validation → Signature validation → Controller execution

---

### 2️⃣ **GET /api/secure/2**

> 🛡️ **Secure data retrieval** - Same functionality as `/api/example/2` but with dual authentication

**Method**: `GET`  
**Path**: `/api/secure/2`  
**Authentication**: 🔐 **Session + API Signature required**  
**Rate Limiting**: ✅ **Enhanced protection**  
**Controller**: Same as `GET /api/example/2`

**Response**: Identical to [Example Endpoint 2](./example-endpoints.md#get-apiexample2)

---

### 3️⃣ **POST /api/secure/3**

> 🛡️ **Secure data submission** - Same functionality as `/api/example/3` but with maximum security

**Method**: `POST`  
**Path**: `/api/secure/3`  
**Authentication**: 🔐 **Session + API Signature required**  
**Rate Limiting**: ✅ **Enhanced protection**  
**Validation**: ✅ **Input validation enabled**  
**Controller**: Same as `POST /api/example/3`

**Response**: Identical to [Example Endpoint 3](./example-endpoints.md#post-apiexample3)

---

## 🛠️ **Complete Implementation Example**

### 🔐 **Secure API Client (JavaScript)**
```javascript
const crypto = require('crypto')

class SecureAPIClient {
  constructor(baseUrl, secret, sessionId) {
    this.baseUrl = baseUrl
    this.secret = secret
    this.sessionId = sessionId
  }

  generateSignature(params = {}) {
    // Remove security headers from calculation
    const cleanParams = { ...params }
    delete cleanParams['x-secret']
    delete cleanParams['x-signature']
    
    const keys = Object.keys(cleanParams).sort()
    const payload = keys.map(key => `${key}=${cleanParams[key]}`).join('&')
    
    return crypto.createHmac('sha256', this.secret).update(payload).digest('hex')
  }

  async makeRequest(method, path, body = null) {
    const nonce = crypto.randomBytes(16).toString('hex')
    const params = method === 'GET' ? {} : (body || {})
    const signature = this.generateSignature(params)

    const headers = {
      'Content-Type': 'application/json',
      'Cookie': `session_id=${this.sessionId}`,
      'X-Secret': this.secret,
      'X-Signature': signature,
      'X-Nonce': nonce
    }

    const config = { method, headers }
    if (body && method !== 'GET') {
      config.body = JSON.stringify(body)
    }

    const response = await fetch(this.baseUrl + path, config)
    return response.json()
  }

  get(path) { return this.makeRequest('GET', path) }
  post(path, body) { return this.makeRequest('POST', path, body) }
}

// ✅ Example usage
const client = new SecureAPIClient(
  'http://localhost:3000',
  'your-api-secret',
  'your-session-id'
)

client.get('/api/secure/1')
  .then(data => console.log('✅ Success:', data))
  .catch(error => console.error('❌ Error:', error))
```

### 🧪 **Testing Examples**

**Test without authentication (should fail)**:
```bash
curl http://localhost:3000/api/secure/1
# Expected: 401 Unauthorized
```

**Test with invalid signature (should fail)**:
```bash
curl http://localhost:3000/api/secure/1 \
  -H "X-Signature: invalid_signature" \
  -H "X-Secret: wrong_secret"
# Expected: 403 Forbidden - Invalid Signature
```

**Test with valid authentication (should succeed)**:
```bash
# Use the proper signature calculation scripts above
```

### 🔥 **Performance Testing**
```javascript
// Test concurrent requests with authentication
async function testConcurrentRequests() {
  const promises = Array.from({ length: 10 }, (_, i) => 
    client.get('/api/secure/1').catch(err => ({ error: err.message }))
  )
  
  const results = await Promise.all(promises)
  console.log('Results:', results)
}

testConcurrentRequests()
```

---

## 🔗 **Integration Examples**

### ⚛️ **React Integration**
```javascript
import React, { useState, useEffect } from 'react'

const SecureDataComponent = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSecureData = async () => {
      try {
        const client = new SecureAPIClient(
          'http://localhost:3000',
          process.env.REACT_APP_API_SECRET,
          getSessionId() // Your session management
        )
        
        const result = await client.get('/api/secure/1')
        setData(result.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchSecureData()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  
  return <div>Secure Data: {JSON.stringify(data)}</div>
}
```

### ⚙️ **Express.js Middleware**
```javascript
const express = require('express')
const app = express()

// Middleware to proxy secure API calls
app.use('/api/secure/*', async (req, res) => {
  try {
    const client = new SecureAPIClient(
      'http://localhost:3000',
      process.env.API_SECRET,
      req.session.id
    )
    
    const result = await client.makeRequest(
      req.method,
      req.originalUrl,
      req.body
    )
    
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})
```

---

## 📝 **Notes**

- All secure endpoints require valid sessions AND API signatures
- Timestamps must be within 5 minutes of server time
- Rate limiting applies in addition to authentication
- Signature calculation must include request body for POST requests
