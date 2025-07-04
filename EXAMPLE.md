# 🧩 Example Usage

This document provides examples of how to use the validator and signature middleware in your Express.js application. It covers both global application and specific route usage.

---

## 📋 Validator and Signature Usage

This example demonstrates how to use the validator and signature middleware in your Express.js application. The validator ensures that incoming requests meet specified criteria, while the signature middleware verifies the authenticity of requests.

## 1️⃣ How to Use the Validator

```js
const express = require('express')
const router = express.Router()
const controller = require('controllers/all')
const { field, validateInput } = require('utils/validators/index')

const userValidator = [
  field('username').isString().length({ min: 3, max: 20 }).sanitize(),
  field('email').isEmail().length({ min: 6, max: 50 }).sanitize(),
  field('age').isNumber().range({ min: 18, max: 99 }).optional()
]

router.post('/register', validateInput(userValidator), controller.register)
```

All requests to `/register` will be validated before hitting the controller.

---

## 2️⃣ Apply Signature Middleware Globally (`app.use`)

```js
const apiSignature = require('./middlewares/signature')
app.use('/api/secure', apiSignature, require('./routes/secure'))
```

Every request under `/api/secure/*` is automatically checked for a valid signature.

---

## 3️⃣ Apply Signature Middleware on Specific Route Only

```js
const apiSignature = require('middlewares/signature')
const { field, validateInput } = require('utils/validators/index')

const paymentValidator = [ field('amount').isNumber().range({ min: 1 }) ]

router.post('/pay', apiSignature, validateInput(paymentValidator), controller.pay)
```

Only `/pay` endpoint is signature-protected and validated.

---

## 🛡 HTTP Request for Signature

When using the signature middleware, include these headers:

```http
x-secret: your-shared-secret
x-signature: computed-signature
```

Example request:

```http
POST /api/secure/pay HTTP/1.1
Host: example.com
Content-Type: application/json
x-secret: your-shared-secret
x-signature: computed-signature

{
  "username": "test",
  "email": "test@example.com"
}
```

Alternatively via body:

```http
POST /api/secure/pay HTTP/1.1
Host: example.com
Content-Type: application/json

{
  "username": "test",
  "email": "test@example.com",
  "x-secret": "your-shared-secret",
  "x-signature": "computed-signature"
}
```

Or via query:

```http
POST /api/secure/pay?x-secret=your-shared-secret&x-signature=computed-signature HTTP/1.1
Host: example.com
Content-Type: application/json

{
  "username": "test",
  "email": "test@example.com"
}
```

---

## 🔑 Signature Computation

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

* `x-secret` is your shared secret.
* `x-signature` is the computed HMAC SHA-256 signature.
* Compute the signature on the client before sending the request.

---

## 📝 Additional Notes

* Apply middlewares globally or per route as needed.
* The validator checks body, query, params; handles type validation, XSS sanitization.
* The signature middleware authenticates requests using a shared secret.
* Both can check headers, body, or query for credentials.

For full API details, see [REFERENCE.md](REFERENCE.md).

Mix and match: chain validator + signature per route or globally.