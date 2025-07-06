# ❌ Error Documentation Endpoints

[![RFC7807](https://img.shields.io/badge/Standard-RFC7807-orange)](.)
[![Interactive](https://img.shields.io/badge/Documentation-Interactive-blue)](.)
[![Public Access](https://img.shields.io/badge/Access-Public-green)](.)

> 📚 **Interactive error documentation system** - Dynamic HTML pages and RFC7807 compliant error responses for comprehensive API error reference.

---

## 🌐 **Base Path**
```
❌ /errors
```

## 🔓 **Authentication**

| Feature | Status | Purpose |
|---------|--------|---------|
| 🔓 **Authentication** | ❌ None required | Public error documentation |
| 🌐 **Public Access** | ✅ Available | Error reference for developers |
| 📚 **Interactive** | ✅ Included | Dynamic error page generation |

---

## ⚙️ **How It Works**

> 🔧 **Dynamic error documentation generation**

The error documentation system automatically creates beautiful HTML pages for each error type defined in the application. When an API returns an error with a `type` field pointing to an error URL, developers can visit that URL to get detailed information, examples, and solutions.

### 🔗 **Error URL Format**
```
🌐 https://api.domain.com/errors/{errorKey}
```

Where `{errorKey}` corresponds to the error identifier used in API responses.

---

## 📋 **Available Error Pages**

### 🚨 **Common API Errors**

#### 1️⃣ **Bad Request (400)**
> 🚨 **Malformed or invalid request**

**URL**: `/errors/bad_request`  
**Error Code**: `bad_request`  
**HTTP Status**: `400`  

**📥 Example API Response**:
```json
{
  "status": 400,
  "type": "https://api.domain.com/errors/bad_request",
  "title": "Bad Request",
  "detail": "The request was invalid.",
  "solution": "Check and correct your API request according to the documentation.",
  "instance": "/api/endpoint",
  "trace": {
    "method": "POST",
    "hash": "abc123def456...",
    "path": "/api/endpoint",
    "timestamp": "2025-07-06T04:30:00.000Z",
    "responseTime": "0.123ms"
  }
}
```

**Visit Error Page**:
```
http://localhost:3000/errors/bad_request
```

---

#### 2️⃣ **Unauthorized (401)**
**URL**: `/errors/unauthorized`  
**Error Code**: `unauthorized`  
**HTTP Status**: 401  

**Example API Response**:
```json
{
  "status": 401,
  "type": "https://api.domain.com/errors/unauthorized",
  "title": "Unauthorized",
  "detail": "Authentication is required or invalid.",
  "solution": "Log in with valid credentials or obtain an API key.",
  "instance": "/api/secure/1",
  "trace": {
    "method": "GET",
    "hash": "...",
    "path": "/api/secure/1",
    "timestamp": "2025-07-06T04:30:00.000Z",
    "responseTime": "0.089ms"
  }
}
```

---

#### 3️⃣ **Forbidden (403)**
**URL**: `/errors/forbidden`  
**Error Code**: `forbidden`  
**HTTP Status**: 403  

**Example API Response**:
```json
{
  "status": 403,
  "type": "https://api.domain.com/errors/forbidden",
  "title": "Forbidden",
  "detail": "You don't have permission to access this resource",
  "instance": "/api/admin/users",
  "trace": {
    "method": "GET",
    "hash": "...",
    "path": "/api/admin/users",
    "timestamp": "2025-07-06T04:30:00.000Z",
    "responseTime": "0.156ms"
  }
}
```

---

#### 4️⃣ **Not Found (404)**
**URL**: `/errors/not_found`  
**Error Code**: `not_found`  
**HTTP Status**: 404  

**Example API Response**:
```json
{
  "status": 404,
  "type": "https://api.domain.com/errors/not_found",
  "title": "Not Found",
  "detail": "The requested resource could not be found",
  "instance": "/api/nonexistent",
  "trace": {
    "method": "GET",
    "hash": "...",
    "path": "/api/nonexistent",
    "timestamp": "2025-07-06T04:30:00.000Z",
    "responseTime": "0.067ms"
  }
}
```

---

#### 5️⃣ **Payload Too Large (413)**
**URL**: `/errors/payload_too_large`  
**Error Code**: `payload_too_large`  
**HTTP Status**: 413  

**Example API Response**:
```json
{
  "status": 413,
  "type": "https://api.domain.com/errors/payload_too_large",
  "title": "Payload Too Large",
  "detail": "The request payload exceeds the maximum allowed size of 1MB",
  "instance": "/api/upload",
  "trace": {
    "method": "POST",
    "hash": "...",
    "path": "/api/upload",
    "timestamp": "2025-07-06T04:30:00.000Z",
    "responseTime": "0.045ms"
  }
}
```

---

#### 6️⃣ **Rate Limit Exceeded (429)**
**URL**: `/errors/rate_limit_exceeded`  
**Error Code**: `rate_limit_exceeded`  
**HTTP Status**: 429  

**Example API Response**:
```json
{
  "status": 429,
  "type": "https://api.domain.com/errors/rate_limit_exceeded",
  "title": "Rate Limit Exceeded",
  "detail": "Too many requests. Please try again later.",
  "instance": "/api/general/1",
  "errors": {
    "limit": 10,
    "window": "10 seconds",
    "reset_time": 1625097600
  },
  "trace": {
    "method": "GET",
    "hash": "...",
    "path": "/api/general/1",
    "timestamp": "2025-07-06T04:30:00.000Z",
    "responseTime": "0.034ms"
  }
}
```

---

#### 7️⃣ **Internal Server Error (500)**
**URL**: `/errors/internal_error`  
**Error Code**: `internal_error`  
**HTTP Status**: 500  

**Example API Response**:
```json
{
  "status": 500,
  "type": "https://api.domain.com/errors/internal_error",
  "title": "Internal Server Error",
  "detail": "An unexpected error occurred. Please try again later.",
  "instance": "/api/endpoint",
  "trace": {
    "method": "POST",
    "hash": "...",
    "path": "/api/endpoint",
    "timestamp": "2025-07-06T04:30:00.000Z",
    "responseTime": "1.567ms"
  }
}
```

---

#### 8️⃣ **Service Unavailable (503)**
**URL**: `/errors/service_unavailable`  
**Error Code**: `service_unavailable`  
**HTTP Status**: 503  

**Example API Response**:
```json
{
  "status": 503,
  "type": "https://api.domain.com/errors/service_unavailable",
  "title": "Service Unavailable",
  "detail": "The service is temporarily unavailable. Please try again later.",
  "instance": "/health/ready",
  "errors": {
    "database": false,
    "redis": true,
    "services_down": ["database"]
  },
  "trace": {
    "method": "GET",
    "hash": "...",
    "path": "/health/ready",
    "timestamp": "2025-07-06T04:30:00.000Z",
    "responseTime": "2.123ms"
  }
}
```

---

### 🔐 **Authentication Errors**

#### 9️⃣ **Signature Invalid (401)**
**URL**: `/errors/signature_invalid`  
**Error Code**: `signature_invalid`  
**HTTP Status**: 401  

**Example API Response**:
```json
{
  "status": 401,
  "type": "https://api.domain.com/errors/signature_invalid",
  "title": "Invalid Signature",
  "detail": "The request signature is invalid or missing",
  "instance": "/api/secure/1",
  "errors": {
    "expected_format": "HMAC-SHA256",
    "required_headers": ["X-Signature", "X-Secret", "X-Timestamp"]
  },
  "trace": {
    "method": "GET",
    "hash": "...",
    "path": "/api/secure/1",
    "timestamp": "2025-07-06T04:30:00.000Z",
    "responseTime": "0.178ms"
  }
}
```

---

#### 🔟 **Verification Failed (401)**
**URL**: `/errors/verification_failed`  
**Error Code**: `verification_failed`  
**HTTP Status**: 401  

**Example API Response**:
```json
{
  "status": 401,
  "type": "https://api.domain.com/errors/verification_failed",
  "title": "Verification Failed",
  "detail": "Request verification failed",
  "instance": "/api/secure/endpoint",
  "trace": {
    "method": "POST",
    "hash": "...",
    "path": "/api/secure/endpoint",
    "timestamp": "2025-07-06T04:30:00.000Z",
    "responseTime": "0.245ms"
  }
}
```

---

### ✅ **Validation Errors**

#### 1️⃣1️⃣ **Validation Failed (422)**
**URL**: `/errors/validation_error`  
**Error Code**: `validation_error`  
**HTTP Status**: 422  

**Example API Response**:
```json
{
  "status": 422,
  "type": "https://api.domain.com/errors/validation_error",
  "title": "Validation Failed",
  "detail": "Input validation failed.",
  "solution": "Please check and correct all required fields.",
  "instance": "/api/example/3",
  "errors": [
    {
      "field": "name",
      "message": "Name is required",
      "code": "required"
    },
    {
      "field": "email", 
      "message": "Email must be a valid email address",
      "code": "invalid_format"
    },
    {
      "field": "age",
      "message": "Age must be a number between 1 and 120", 
      "code": "invalid_range"
    }
  ],
  "trace": {
    "method": "POST",
    "hash": "...",
    "path": "/api/example/3",
    "timestamp": "2025-07-06T04:30:00.000Z",
    "responseTime": "0.345ms"
  }
}
```

---

## 💻 **Implementation Examples**

### 🧪 **Testing Error Pages**

**cURL Examples**:
```bash
# View error documentation pages
curl http://localhost:3000/errors/bad_request
curl http://localhost:3000/errors/unauthorized
curl http://localhost:3000/errors/not_found
curl http://localhost:3000/errors/rate_limit_exceeded
curl http://localhost:3000/errors/validation_failed
```

**Browser Navigation**:
```
http://localhost:3000/errors/bad_request
http://localhost:3000/errors/unauthorized
http://localhost:3000/errors/forbidden
http://localhost:3000/errors/not_found
http://localhost:3000/errors/payload_too_large
http://localhost:3000/errors/rate_limit_exceeded
http://localhost:3000/errors/internal_error
http://localhost:3000/errors/service_unavailable
http://localhost:3000/errors/signature_invalid
http://localhost:3000/errors/verification_failed
http://localhost:3000/errors/validation_failed
```

---

### 2️⃣ **Triggering Errors for Testing**

#### 🔍 **Trigger Not Found Error:**
```bash
curl http://localhost:3000/api/nonexistent
```

#### ✅ **Trigger Validation Error:**
```bash
curl -X POST http://localhost:3000/api/example/3 \
  -H "Content-Type: application/json" \
  -d '{}'
```

#### ⏱️ **Trigger Rate Limit Error:**
```bash
# Make rapid requests to trigger rate limiting
for i in {1..15}; do
  curl http://localhost:3000/api/general/1
  sleep 0.1
done
```

#### 📦 **Trigger Payload Too Large Error:**
```bash
# Create a large payload (>1MB)
curl -X POST http://localhost:3000/api/example/3 \
  -H "Content-Type: application/json" \
  -d "$(python3 -c "print('{\"data\":\"' + 'x'*1048577 + '\"}')")"
```

#### 🔐 **Trigger Signature Invalid Error:**
```bash
curl http://localhost:3000/api/secure/1 \
  -H "X-Signature: invalid_signature" \
  -H "X-Secret: wrong_secret"
```

---

### 3️⃣ **JavaScript Error Handling**

```javascript
class APIErrorHandler {
  constructor(baseURL) {
    this.baseURL = baseURL
  }

  async handleResponse(response) {
    if (!response.ok) {
      const errorData = await response.json()
      
      // Create clickable error documentation link
      if (errorData.type) {
        console.log(`Error Documentation: ${errorData.type}`)
      }
      
      throw new APIError(errorData)
    }
    
    return response.json()
  }

  async makeRequest(url, options = {}) {
    try {
      const response = await fetch(url, options)
      return await this.handleResponse(response)
    } catch (error) {
      if (error instanceof APIError) {
        this.displayError(error)
      }
      throw error
    }
  }

  displayError(error) {
    console.group('API Error Details:')
    console.log('Status:', error.status)
    console.log('Title:', error.title)
    console.log('Detail:', error.detail)
    console.log('Instance:', error.instance)
    
    if (error.errors) {
      console.log('Validation Errors:', error.errors)
    }
    
    if (error.type) {
      console.log('Documentation:', error.type)
      // Optionally open error documentation
      // window.open(error.type, '_blank')
    }
    
    console.groupEnd()
  }
}

class APIError extends Error {
  constructor(errorData) {
    super(errorData.detail)
    this.status = errorData.status
    this.type = errorData.type
    this.title = errorData.title
    this.detail = errorData.detail
    this.instance = errorData.instance
    this.errors = errorData.errors
    this.trace = errorData.trace
  }
}

// Usage example
const apiHandler = new APIErrorHandler('http://localhost:3000')

// This will trigger a validation error and show documentation link
apiHandler.makeRequest('http://localhost:3000/api/example/3', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({}) // Empty body will trigger validation error
})
.catch(error => {
  console.error('Request failed:', error.message)
})
```

---

### 4️⃣ **React Error Boundary with Documentation**

```javascript
import React from 'react'

class APIErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError && this.state.error?.type) {
      return (
        <div className="error-container">
          <h2>API Error: {this.state.error.title}</h2>
          <p>{this.state.error.detail}</p>
          
          {this.state.error.errors && (
            <div className="validation-errors">
              <h3>Validation Errors:</h3>
              <ul>
                {Object.entries(this.state.error.errors).map(([field, errors]) => (
                  <li key={field}>
                    <strong>{field}:</strong> {errors.join(', ')}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <a 
            href={this.state.error.type} 
            target="_blank" 
            rel="noopener noreferrer"
            className="error-docs-link"
          >
            View Error Documentation →
          </a>
          
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try Again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
```

---

### 5️⃣ **Python Error Documentation Parser**

```python
import requests
import json
from urllib.parse import urljoin

class APIErrorHandler:
    def __init__(self, base_url):
        self.base_url = base_url
    
    def parse_error_response(self, response):
        """Parse API error response and provide documentation link"""
        try:
            error_data = response.json()
            
            print(f"API Error {error_data.get('status')}:")
            print(f"Title: {error_data.get('title')}")
            print(f"Detail: {error_data.get('detail')}")
            print(f"Instance: {error_data.get('instance')}")
            
            if 'errors' in error_data:
                print("Validation Errors:")
                for field, errors in error_data['errors'].items():
                    print(f"  {field}: {', '.join(errors)}")
            
            if 'type' in error_data:
                print(f"Documentation: {error_data['type']}")
                return error_data['type']
                
        except json.JSONDecodeError:
            print(f"HTTP {response.status_code}: {response.text}")
        
        return None
    
    def make_request(self, endpoint, method='GET', **kwargs):
        """Make API request with error handling"""
        url = urljoin(self.base_url, endpoint)
        
        try:
            response = requests.request(method, url, **kwargs)
            
            if response.ok:
                return response.json()
            else:
                doc_url = self.parse_error_response(response)
                if doc_url:
                    print(f"View documentation at: {doc_url}")
                response.raise_for_status()
                
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {e}")
            raise

# Usage example
handler = APIErrorHandler('http://localhost:3000')

# This will trigger validation error and show documentation
try:
    result = handler.make_request('/api/example/3', 
                                method='POST', 
                                json={})  # Empty JSON will trigger validation error
except requests.exceptions.RequestException:
    print("Request failed - check error documentation above")
```

---

## 🌐 **Error Page HTML Structure**

The error documentation pages are dynamically generated HTML that includes:

1. **Error Code and HTTP Status**
2. **Error Title and Description**  
3. **Common Causes**
4. **Resolution Steps**
5. **Example Requests and Responses**
6. **Related Documentation Links**

### 📄 **Example HTML Structure:**
```html
<!DOCTYPE html>
<html>
<head>
    <title>Error: bad_request (400)</title>
    <meta charset="utf-8">
    <style>/* Error page styling */</style>
</head>
<body>
    <div class="error-page">
        <h1>400 Bad Request</h1>
        <p class="error-description">The request could not be understood by the server</p>
        
        <h2>Common Causes</h2>
        <ul>
            <li>Malformed JSON in request body</li>
            <li>Invalid request parameters</li>
            <li>Missing required headers</li>
        </ul>
        
        <h2>How to Fix</h2>
        <ol>
            <li>Validate your JSON syntax</li>
            <li>Check required parameters</li>
            <li>Verify request headers</li>
        </ol>
        
        <h2>Example Valid Request</h2>
        <pre><code>curl -X POST http://localhost:3000/api/example/3 \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com"}'</code></pre>
    </div>
</body>
</html>
```

---

## 📝 **Notes**

- Error documentation pages are publicly accessible (no authentication required)
- Each error type has its own dedicated documentation page
- Error URLs follow RFC7807 standard format
- Documentation includes practical examples and solutions
- Error pages are dynamically generated based on error definitions
- All API errors include clickable documentation links in the `type` field
