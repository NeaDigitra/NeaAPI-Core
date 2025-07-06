# 🚀 NeaAPI-Core

[![Build Status](https://img.shields.io/github/actions/workflow/status/NeaDigitra/NeaAPI-Core/ci.yml?branch=main)](https://github.com/NeaDigitra/NeaAPI-Core/actions)
[![Node Version](https://img.shields.io/badge/node-22.16.0%2B-blue)](https://nodejs.org/en)
[![Coverage Status](https://coveralls.io/repos/github/NeaDigitra/NeaAPI-Core/badge.svg?branch=main)](https://coveralls.io/github/NeaDigitra/NeaAPI-Core?branch=main)
[![Security: Snyk](https://snyk.io/test/github/NeaDigitra/NeaAPI-Core/badge.svg)](https://snyk.io/test/github/NeaDigitra/NeaAPI-Core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A robust and well-structured API boilerplate built with Express.js. Focuses on clean architecture, secure practices, and efficient development. Includes essential middlewares, strong input validation, and comprehensive error handling. Ideal for building scalable and maintainable APIs with a focus on security and performance.

---

## 📚 Documentation

Access in-depth docs in the `docs/` directory:

* 🚀 [Installation & Deployment](./docs/INSTALLATION.md)
* 📖 [API Reference](./docs/REFERENCE.md)
* 🤝 [Contributing Guidelines](./docs/CONTRIBUTING.md)
* 🔒 [Security Policy](./docs/SECURITY.md)
* 🗂️ [Project Structure](./docs/STRUCTURE.md)
* 📋 [Roadmap & TODOs](./docs/TODO.md)

---

## 📦 Features & Purpose

* 🔐 **Signature Validator Middleware**
  * Uses `x-signature` and `x-secret` headers for signature validation.
  * Secures requests using `HMAC-SHA256` signatures with a shared secret key.
  * Ensures integrity and authenticity of requests by verifying the signature against the request body and headers.
  * Supports `CF-Connecting-IP` header for accurate client IP logging.

* 🧼 **Input Validator Middleware**
  * Strong validation and sanitization for query parameters and request bodies.
  * No module dependencies, ensuring lightweight and efficient validation.
  * Returns 422 with detailed error messages for invalid inputs.

* 🕒 **Rate Limit Middleware**
  * Configurable rate limiting to prevent abuse and ensure fair usage.
  * Protects against DDoS attacks and excessive requests from a single IP.
  * Uses Redis for distributed rate limiting, ensuring scalability across multiple instances.

* 🛡️ **RFC7807 Error Response**
  * All errors follow RFC7807 — structured, self-documenting, easy for clients to debug.
  * Includes `status`, `type`, `title`, `detail`, and optional `errors` array for validation failures.

* 🧩 **Clean Structure**
  * Clear separation of Controller, Route, Middleware, Helper, Validator for maintainability and scalability.
  * Modular design allows easy addition of new features and endpoints.

* 🧪 **Test Coverage**
  * Comprehensive unit tests for all components.
  * Ensures high code quality and reliability with a focus on maintainability.
  * Uses [Jest](https://jestjs.io/) for testing, ensuring high code quality and reliability.

* ⚡ **Ultra-fast Express.js Server**
  * Built on top of Express.js, leveraging its performance and flexibility.
  * Optimized for speed and low latency, suitable for high-traffic applications.

---

## 📄 License

Released under the MIT License. See [LICENSE](LICENSE.md) for full details.