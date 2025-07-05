# 🚀 NeaAPI-Core

[![Build Status](https://img.shields.io/github/actions/workflow/status/NeaDigitra/NeaAPI-Core/ci.yml?branch=main)](https://github.com/NeaDigitra/NeaAPI-Core/actions)
[![Node Version](https://img.shields.io/badge/node-22.16.0%2B-blue)](https://nodejs.org/en)
[![Coverage Status](https://coveralls.io/repos/github/NeaDigitra/NeaAPI-Core/badge.svg?branch=main)](https://coveralls.io/github/NeaDigitra/NeaAPI-Core?branch=main)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

This project provides a robust and well-structured API boilerplate built with Express.js. It focuses on clean architecture, secure practices, and efficient development. The project includes essential middlewares for logging, response formatting, request fingerprinting, and signature validation, along with a comprehensive input validation system.

---

## 📦 Features & Purpose

* 🔐 **Signature Validator Middleware**
  * Secures requests using HMAC-SHA256 signatures with a per-request secret (header/session).
  * Prevents tampering, replay attacks — only valid, signed requests are processed.

* 🧼 **Input Validator Middleware**
  * Strong validation and sanitization (type, pattern, enum, range, custom, XSS filter) for query, body, params.
  * Prevents injection, malformed payloads, XSS — auto-handles field errors.

* 🛡️ **RFC7807 Error Response**
  * All errors follow RFC7807 — structured, self-documenting, easy for clients to debug and fix.

* 🧩 **Clean CRUD Structure**
  * Clear separation of Controller, Route, Middleware, Helper, Validator.
  * Designed for maintainability, scalability, and developer productivity.

* ⚡ **Ultra-fast Express.js Server**
  * Performance-focused, simple, deployable anywhere.

* 🧪 **Test Coverage**
  * Built with Jest + Supertest — ensures safe refactoring, CI integration, and reliability.

---
## 🔒 Security Flow

1. **Request Signature**
   * All critical endpoints require a valid HMAC signature (`x-signature`), computed using a shared secret (`x-secret`) sent via header or session.
   * The server recomputes the signature from the full, sorted, sanitized payload and matches it to `x-signature` (from header, body, query, or param).
   * Missing or invalid signature (or missing secret) → request rejected with RFC7807 error.

2. **Input Validation & Sanitization**
   * All input (body, query, params, files) is validated by field validator before reaching controllers.
   * Fields: required, optional, string, number, boolean, range, enum, regex, custom, file, object, array.
   * Strings are sanitized (XSS, dangerous HTML, tags, JS removed) before processing.
   * On validation failure → returns status `422` with `errors` array (field, message).

3. **Error Format**
   * All errors follow RFC7807 → clients always get `status`, `type`, `title`, `detail`, optional `errors` array.
   * Ensures clear, consistent error responses for frontend, integration, automation.

---

## 📝 TODO

* [ ] **API Docs Generator**: Auto-generate OpenAPI/Swagger docs from routes & validators.
* [ ] **Database Integration**: Set up MySQL/PostgreSQL with ORM (Knex.js).
* [x] **Redis Rate Limiting**: Integrate Redis for rate limiting and abuse prevention.
* [x] **Dockerfile**: Create Dockerfile for building and deploying the API.
* [x] **CORS Middleware**: Handle cross-origin requests with CORS middleware.
* [ ] **Signature Verification**: Implement full signature verification for requests.
* [ ] .
* [ ] **Documentation**: Improve API documentation with examples, usage guides, and best practices.

---

## 📂 Project Structure

```bash
src/
├── config/
│   └── app.js                   #   App settings (name, version, ports, etc)
├── controllers/
│   └── all.js                   #   Main controller logic for API requests
├── helpers/
│   └── response/
│       ├── generator.js         #   Generates standard API response objects
│       └── render.js            #   Renders API responses to client
├── middlewares/
│   ├── fingerprint.js           #   Middleware for device fingerprinting
│   ├── logger.js                #   Middleware for request logging
│   ├── response.js              #   Middleware for formatting API responses
│   └── signature.js             #   Middleware for verifying request signature
├── modules/
│   └── global/
│       └── rules.js             #   Contains global validation rules
├── routes/
│   ├── all.js                   #   Route for example + secure APIs
│   ├── errors.js                #   Route for error responses
│   └── general.js               #   Route for general APIs
├── server.js                    #   App entry point and server setup
├── tests/
│   ├── helpers/
│   │   └── mock/
│   │       └── data.js          #   Mock data used in tests
│   ├── middlewares/
│   │   ├── fingerprint.test.js  #   Test for fingerprint middleware
│   │   ├── response.test.js     #   Test for response middleware
│   │   └── signature.test.js    #   Test for signature middleware
│   └── validators/
│       └── validator.test.js    #   Test for validators logic
└── utils/
    └── validators/
        ├── field.js             #   Field-level validation logic
        ├── index.js             #   Validator module entry point
        └── input.js             #   Input validation functions
```

## 🚀 One-click Deployment

Deploy this project to Railway with the button below:

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy/neacore-api?referralCode=JBf6Ji)

## 🚦 Getting Started

- Clone the repository and install dependencies:
  ```bash
  git clone https://github.com/NeaDigitra/NeaAPI-Core.git
  cd NeaAPI-Core
  cp .env.example .env
  npm install
  ```

- Configure your environment variables in `.env` (e.g., `APP_NAME`, `APP_VERSION`).
- Run unit tests to ensure everything is working:

  ```bash
  npm test
  ```

- Start the development server:
  ```bash
  npm start
  ```

## 🐳 Running with Docker
- Build and run the production image:
  ```bash
  docker build -t neaapi-core:latest .
  docker run -p 3000:3000 neaapi-core:latest
  ```

- For development with live reload, use docker-compose:
  ```bash
  docker-compose up --build
  ```

- This mounts your source code and restarts the server automatically on changes.

---

## 📑 Documentation

* [EXAMPLE.md](EXAMPLE.md) — Example usage of routes, controllers, middlewares
* [REFERENCE.md](REFERENCE.md) — Detailed API reference documentation
* [CONTRIBUTING.md](CONTRIBUTING.md) — PR, commit, code style guidelines
* [SECURITY.md](SECURITY.md) — Security policy and reporting process

## 💬 Community & Support

* [GitHub Issues](https://github.com/NeaDigitra/NeaAPI-Core/issues)
* Discord (coming soon)

---

## 📄 License

MIT — [LICENSE](LICENSE)