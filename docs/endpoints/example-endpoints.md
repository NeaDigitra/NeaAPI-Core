# 🔧 Example/Demo Endpoints

[![Development](https://img.shields.io/badge/Purpose-Development-blue)](.)
[![Testing](https://img.shields.io/badge/Testing-Friendly-green)](.)
[![No Auth](https://img.shields.io/badge/Auth-None%20Required-lightgrey)](.)

> 🧪 **Development and testing endpoints** - Perfect for learning the API, testing integrations, and exploring different authentication patterns.

---

## 🌐 **Base Path**
```
🔧 /api/example
```

## 🔓 **Authentication**

| Feature | Status | Purpose |
|---------|--------|---------|
| 🔓 **Authentication** | ❌ Not required | Basic examples for learning |
| 🎯 **Demonstrations** | ✅ Included | Different authentication patterns |
| 🧪 **Testing** | ✅ Optimized | Perfect for development & testing |

---

## 🔌 **Available Endpoints**

### 1️⃣ **GET /api/example/1** {#get-apiexample1}

> 🎯 **Basic example endpoint without authentication**

**Method**: `GET`  
**Path**: `/api/example/1`  
**Authentication**: 🔓 **None required**  
**Rate Limiting**: 🚫 **None**  

#### 📥 **Request**
```http
GET /api/example/1 HTTP/1.1
Host: localhost:3000
Content-Type: application/json
```

#### ✅ **Response**
```json
{
  "status": 200,
  "message": "Example1 endpoint works",
  "data": {},
  "trace": {
    "method": "GET",
    "hash": "351065637903f55545d7078163524c826c255e32dbf32ffa9127821f89ca1921",
    "path": "/api/example/1",
    "timestamp": "2025-07-06T04:30:00.000Z",
    "responseTime": "0.396ms"
  }
}
```

#### 🛠️ **Implementation Examples**

**cURL**:
```bash
curl http://localhost:3000/api/example/1
```

**JavaScript (Fetch)**:
```javascript
fetch('http://localhost:3000/api/example/1')
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data)
  })
  .catch(error => {
    console.error('Error:', error)
  })
```

**Node.js (Axios)**:
```javascript
const axios = require('axios')

axios.get('http://localhost:3000/api/example/1')
  .then(response => {
    console.log('Data:', response.data)
  })
  .catch(error => {
    console.error('Error:', error.response?.data || error.message)
  })
```

**Python (Requests)**:
```python
import requests

response = requests.get('http://localhost:3000/api/example/1')
print(response.json())
```

---

### 2️⃣ **GET /api/example/2** {#get-apiexample2}

**Description**: Basic example endpoint returning null data

**Method**: `GET`  
**Path**: `/api/example/2`  
**Authentication**: None  
**Rate Limiting**: None  

#### 📥 **Request**
```http
GET /api/example/2 HTTP/1.1
Host: localhost:3000
```

#### ✅ **Response**
```json
{
  "status": 200,
  "message": "Example2 endpoint works",
  "data": null,
  "trace": {
    "method": "GET",
    "hash": "351065637903f55545d7078163524c826c255e32dbf32ffa9127821f89ca1921",
    "path": "/api/example/2",
    "timestamp": "2025-07-06T04:30:00.000Z",
    "responseTime": "0.285ms"
  }
}
```

#### 🛠️ **Implementation Example**

**cURL**:
```bash
curl http://localhost:3000/api/example/2
```

**JavaScript (Fetch)**:
```javascript
fetch('http://localhost:3000/api/example/2')
  .then(response => response.json())
  .then(data => {
    console.log('Response:', data)
    // data.data will be null
  })
```

---

### 3️⃣ **POST /api/example/3** {#post-apiexample3}

**Description**: POST endpoint with input validation

**Method**: `POST`  
**Path**: `/api/example/3`  
**Authentication**: None  
**Rate Limiting**: None  
**Validation**: Global validation rules applied  

#### 📋 **Request Body Schema**
```json
{
  "name": "string (required)",
  "email": "string (required, email format)",
  "age": "number (optional)"
}
```

#### 📥 **Request**
```http
POST /api/example/3 HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "age": 30
}
```

#### ✅ **Success Response**
```json
{
  "status": 200,
  "message": "Example3 endpoint works",
  "data": {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "age": 30
  },
  "trace": {
    "method": "POST",
    "hash": "351065637903f55545d7078163524c826c255e32dbf32ffa9127821f89ca1921",
    "path": "/api/example/3",
    "timestamp": "2025-07-06T04:30:00.000Z",
    "responseTime": "1.234ms"
  }
}
```

#### ❌ **Validation Error Response**
```json
{
  "status": 422,
  "type": "https://api-core.neadigitra.com/errors/validation_error",
  "title": "Validation Failed",
  "detail": "Input validation failed.",
  "instance": "/api/example/3",
  "errors": [
    {
      "field": "name",
      "message": "Field Is Required"
    },
    {
      "field": "email", 
      "message": "Invalid Email"
    }
  ],
  "trace": {
    "method": "POST",
    "hash": "351065637903f55545d7078163524c826c255e32dbf32ffa9127821f89ca1921",
    "path": "/api/example/3",
    "timestamp": "2025-07-06T04:30:00.000Z",
    "responseTime": "0.156ms"
  }
}
```

#### 🛠️ **Implementation Examples**

**cURL (Success)**:
```bash
curl -X POST http://localhost:3000/api/example/3 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "age": 30
  }'
```

**cURL (Validation Error)**:
```bash
curl -X POST http://localhost:3000/api/example/3 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "",
    "email": "invalid-email"
  }'
```

**JavaScript (Fetch)**:
```javascript
const userData = {
  name: "John Doe",
  email: "john.doe@example.com",
  age: 30
}

fetch('http://localhost:3000/api/example/3', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(userData)
})
.then(response => response.json())
.then(data => {
  if (data.status === 200) {
    console.log('Success:', data.data)
  } else {
    console.error('Validation errors:', data.errors)
  }
})
.catch(error => {
  console.error('Network error:', error)
})
```

**Node.js (Axios)**:
```javascript
const axios = require('axios')

const userData = {
  name: "John Doe",
  email: "john.doe@example.com",
  age: 30
}

axios.post('http://localhost:3000/api/example/3', userData, {
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => {
  console.log('Success:', response.data)
})
.catch(error => {
  if (error.response) {
    console.error('Validation errors:', error.response.data)
  } else {
    console.error('Network error:', error.message)
  }
})
```

**Python (Requests)**:
```python
import requests

url = 'http://localhost:3000/api/example/3'
data = {
    'name': 'John Doe',
    'email': 'john.doe@example.com',
    'age': 30
}

response = requests.post(url, json=data)

if response.status_code == 200:
    result = response.json()
    print('Success:', result['data'])
else:
    error = response.json()
    print('Validation errors:', error.get('errors', {}))
```

**PHP (cURL)**:
```php
<?php
$url = 'http://localhost:3000/api/example/3';
$data = array(
    'name' => 'John Doe',
    'email' => 'john.doe@example.com',
    'age' => 30
);

$options = array(
    'http' => array(
        'header'  => "Content-Type: application/json\r\n",
        'method'  => 'POST',
        'content' => json_encode($data)
    )
);

$context  = stream_context_create($options);
$result = file_get_contents($url, false, $context);

if ($result === FALSE) {
    echo "Error occurred";
} else {
    $response = json_decode($result, true);
    if ($response['status'] == 200) {
        echo "Success: " . json_encode($response['data']);
    } else {
        echo "Validation errors: " . json_encode($response['errors']);
    }
}
?>
```

---

## 🧪 **Testing Scenarios**

### 🔍 **Basic Connectivity Test**
```bash
# Test all example endpoints
curl http://localhost:3000/api/example/1
curl http://localhost:3000/api/example/2
curl -X POST http://localhost:3000/api/example/3 \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com"}'
```

### ✅ **Validation Testing**
```bash
# Test required field validation
curl -X POST http://localhost:3000/api/example/3 \
  -H "Content-Type: application/json" \
  -d '{}'

# Test email format validation
curl -X POST http://localhost:3000/api/example/3 \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"invalid-email"}'
```

### ⚡ **Performance Testing**
```bash
# Test response times
time curl http://localhost:3000/api/example/1
time curl http://localhost:3000/api/example/2
time curl -X POST http://localhost:3000/api/example/3 \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com"}'
```

---

## 📝 **Notes**

- These endpoints are designed for development and testing
- No authentication or rate limiting applied
- Validation rules are defined in `modules/global/rules`
- All responses include request tracing information
- Response times are measured in milliseconds
