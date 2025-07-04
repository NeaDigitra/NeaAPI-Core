# 🚀 NeaAPI-Core

[![Build Status](https://img.shields.io/github/actions/workflow/status/NeaDigitra/NeaAPI-Core/ci.yml?branch=main)](https://github.com/NeaDigitra/NeaAPI-Core/actions)
[![Node Version](https://img.shields.io/badge/node-22.16.0%2B-blue)](https://nodejs.org/en)
[![Coverage Status](https://coveralls.io/repos/github/NeaDigitra/NeaAPI-Core/badge.svg?branch=main)](https://coveralls.io/github/NeaDigitra/NeaAPI-Core?branch=main)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

This project provides a robust and structured API boilerplate built with Express.js, focusing on clean architecture, secure practices, and efficient development. It includes essential middlewares for logging, response formatting, request fingerprinting, and signature validation, along with a comprehensive input validation system.

---

## 📦 Features & Purpose

* 🔐 **Signature Validator Middleware**
  * Secures each request using HMAC-SHA256 signatures with a per-request secret (from header/session).
  * Purpose: Prevent request tampering and replay attacks—API only processes requests signed with a valid shared secret.

* 🧼 **Input Validator Middleware**
  * Strong validation & sanitization (type, pattern, enum, range, custom, XSS filter) for query, body, params.
  * Purpose: Prevent injection, malformed payload, and XSS; auto-handle field errors.

* 🛡️ **RFC7807 Error Response Standard**
  * Purpose: Every error is structured and self-documenting (API clients always know what, why, and how to fix).

* 🧩 **Clean CRUD structure**
  * Standard separation: Controller, Route, Middleware, Helper, Validator.
  * Purpose: Developer happiness, maintainability, and fast feature scaling.

* ⚡ **Ultra-fast Express.js server**
  * Purpose: Performance & simplicity—deploy anywhere.

* 🧪 **100% unit test coverage (Jest + Supertest)**
  * Purpose: Safe refactor, CI, and reliability.

---

## 🔒 Security Flow

1. **Request Signature:**
   * All critical endpoints require a valid HMAC signature, using a shared secret (`x-secret`) sent via header/session.
   * The server re-computes the signature from the full payload (sorted, sanitized) and secret, then matches it to `x-signature` header (or body/query/param).
   * If the signature is missing/invalid/secret missing: request is rejected with a clear RFC7807 error.

2. **Input Validation & Sanitization:**
   * All input (body, query, params, file) is checked by field validator before hitting any controller logic.
   * Fields can be: required, optional, string/number/boolean, range, enum, regex, custom, file, object/array.
   * All string fields can be sanitized for XSS, dangerous HTML/tags/JS removed before entering app logic.
   * If validation fails, errors are returned as array (field, message), status 422.

3. **Error Format:**
   * Every error uses RFC7807, so clients always receive `status`, `type`, `title`, `detail`, and optional `errors` array.
   * Purpose: Avoid ambiguity, make frontend/integration/automation easy.

---

## 📝 TODO

* [ ] API docs generator (auto generate OpenAPI/Swagger from routes & validator)
* [ ] Redis integration for rate limit (production security, anti-abuse)
* [ ] Database integration (MySQL, PostgreSQL, etc.) with ORM Knex.js
* [ ] Dockerfile for clean container API build & deploy
* [ ] ...

---

## 📂 Project Structure

```bash
.
├── config/
│   └── app.js                 # Application configuration (e.g., port, environment)
├── controllers/
│   └── all.js                 # Main controller for handling API requests
├── helpers/
│   ├── generateError.js       # Helper to generate RFC7807 error responses
│   └── renderErrorPage.js     # Helper to render error pages
├── middlewares/
│   ├── fingerprint.js         # Unique identifier for user devices
│   ├── logger.js              # Request logging middleware
│   ├── response.js            # Response formatting middleware
│   └── signature.js           # Request signature verification middleware
├── routes/
│   ├── errors.js              # Error definition routes
│   ├── example.js             # Example API routes
│   └── general.js             # General API routes
├── server.js                  # Main server file to start the application
├── tests/
│   ├── fingerprint.test.js.   # Fingerprint middleware tests
│   ├── response.test.js       # API response formatting tests
│   ├── signature.test.js      # Signature generation and verification tests
│   └── validator.test.js      # All input validation tests
└── validator/
    ├── field.js               # Input field validation and sanitization
    ├── index.js
    └── input.js               # Input validation rules and utilities
```

## 🚦 Getting Started

```bash
git clone https://github.com/NeaDigitra/NeaAPI-Core.git
cd NeaAPI-Core
cp .env.example .env
npm install
npm run test   # run unit tests
npm start      # start development server
```

---

## 📑 Documentation

* [EXAMPLE.md](EXAMPLE.md) — example usage for routes, controllers, and middlewares
* [REFERENCE.md](REFERENCE.md) — detailed API reference documentation
* [CONTRIBUTING.md](CONTRIBUTING.md) — PR, commit, and code style guidelines
* [SECURITY.md](SECURITY.md) — security policy and reporting

## 💬 Community & Support

* [GitHub Issues](https://github.com/NeaDigitra/NeaAPI-Core/issues)
* Discord (coming soon)

---

## 📄 License

MIT — [LICENSE](LICENSE)