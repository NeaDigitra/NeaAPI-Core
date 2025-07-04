# 🧩 Example Usage

This document provides examples of how to use the validator and signature middleware in your Express.js application. It covers both global application and specific route usage.

---

## 📋 Validator and Signature Usage

This example demonstrates how to use the validator and signature middleware in your Express.js application.

The validator ensures that incoming requests meet specified criteria, while the signature middleware verifies the authenticity of requests.

## 1️⃣ How to Use the Validator

**In your route:**

```js
const express = require('express')
const router = express.Router()
const { field, validateInput } = require('../validator')
const controller = require('../controllers/all')

const userValidator = [
  field('username').isString().length({ min: 3, max: 20 }).sanitize(),
  field('email').isEmail().length({ min: 6, max: 50 }).sanitize(),
  field('age').isNumber().range({ min: 18, max: 99 }).optional()
]

router.post('/register', validateInput(userValidator), controller.register)
```

* All requests to `/register` will be validated before hitting the controller.

---

## 2️⃣ Apply Signature Middleware Globally (`app.use`)

**In `server.js` (protect all `/api/secure/*` endpoints):**

```js
const apiSignature = require('./middlewares/signature')
app.use('/api/secure', apiSignature, require('./routes/secure'))
```

* Every request under `/api/secure/*` is automatically checked for a valid signature.

---

## 3️⃣ Apply Signature Middleware on Specific Route Only

**In your route file:**

```js
const apiSignature = require('../middlewares/signature')
const { field, validateInput } = require('../validator')

const paymentValidator = [ field('amount').isNumber().range({ min: 1 }) ]

router.post('/pay', apiSignature, validateInput(paymentValidator), controller.pay)
```

* Only `/pay` endpoint is signature-protected and validated.

---

## 🛡 HTTP Request for Signature

When using the signature middleware, ensure to include the following headers in your requests:

  ```http
  x-secret: your-shared-secret
  x-signature: computed-signature
  ```

  ```http
  POST /api/secure/pay HTTP/1.1
  Host: example.com
  Content-Type: application/json
  x-secret: your-shared-secret
  x-signature: computed-signature
  ...

  {
    "username": "test",
    "email": "test@example.com"
  }
  ```

Works with query parameters or request body as well, but headers are preferred for security.


  ```http
  POST /api/secure/pay HTTP/1.1
  Host: example.com
  Content-Type: application/json
  ...

  {
    "username": "test",
    "email": "test@example.com",
    "x-secret": "your-shared-secret",
    "x-signature": "computed-signature"
  }
  ```

  ```http
  POST /api/secure/pay?x-secret=your-shared-secret&x-signature=computed-signature HTTP/1.1
  Host: example.com
  Content-Type: application/json
  ...

  {
    "username": "test",
    "email": "test@example.com"
  }
  ```

## 🔑 Signature Computation
To compute the signature, you need to create a hash of the request payload combined with your shared secret. The signature is typically computed using HMAC (Hash-based Message Authentication Code) with SHA-256.

  ```js
  const crypto = require('crypto')

  function computeSignature(payload, secret) {
    return crypto.createHmac('sha256', secret).update(payload).digest('hex')
  }

  const payload = JSON.stringify({ username: 'test', email: 'test@example.com' })
  const secret = 'your-shared-secret'
  const signature = computeSignature(payload, secret)
  console.log(`x-signature: ${signature}`)
  ```
  
  * The `x-secret` is your shared secret used to compute the signature.
  * The `x-signature` is the computed HMAC signature based on the request payload and the shared secret.
  * Ensure to compute the signature on the client side before sending the request.
  
---

## 📝 Additional Notes
- Both middlewares can be applied globally or on specific routes as needed.
- The validator middleware checks the request body, query, and parameters against defined rules.
- The validator can handle various data types and validation rules, including sanitization to prevent XSS attacks.
- The signature middleware ensures that requests are authenticated using a shared secret.
- The signature middleware can be configured to check headers, body, or query parameters for the signature and secret.

---

For more details about the validator api, refer to the [REFERENCE.md](REFERENCE.md) file.

**Mix and match as needed! You can chain both validator and signature in any order per route or globally.**