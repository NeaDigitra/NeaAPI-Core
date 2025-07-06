# 📝 Project Roadmap & TODOs

This document outlines the upcoming features, recent milestones, and ongoing improvements for **NeaAPI-Core**.

Contributions are welcome — feel free to open issues or submit pull requests! 🚀

---

## 🚀 Upcoming Features

* [ ] 📄 **API Documentation Generator**
  * Automatically generate OpenAPI/Swagger specs from route definitions and validation schemas for easy client integration.

* [ ] 🔧 **Global Logging Service**
  * Centralize request and error logs into Elasticsearch or a similar backend for real-time monitoring and analysis.

* [ ] ⚙️ **Health, Readiness & Liveness Probes**
  * ❤️ `/health/live` (process is running)
  * ✅ `/health/ready` (DB, Redis, external deps are reachable)
  * 🚀 `/health/startup` (app fully initialized)
* [ ] 📈 **Observability & Monitoring**
  * **Metrics endpoint** (`/metrics`): expose Prometheus-style counters for request rates, error rates, and latency histograms.
  * **Structured logging**: use pino or Winston with JSON output, include request IDs, and ship logs to Elasticsearch/Splunk.

* [ ] 🔢 **API Versioning Strategy**
  * Support versioned routes (`/v1/users`, `/v2/users`) via path, header negotiation, or Accept header.

* [ ] 📚 **Schema-Driven Docs & Mocking**
  * Generate live Swagger UI or Redoc from JSON Schemas.
  * Use Prism to mock the API for frontend development.

* [ ] 💾 **Database Migrations UI**
  * Provide a web interface to manage database schema migrations (status, rollback, apply).

* [ ] 🔄 **Dynamic Configuration Reload**
  * Allow certain `.env`-driven config values (e.g., rate limits, CORS origins) to reload at runtime without restarting.

---

## ✅ Completed Milestones

* [x] 🗄️ **Database Integration**
  * Added MySQL support via Knex.js, including migrations and seed data.

* [x] 🔐 **Signature Middleware**
  * Implemented HMAC-SHA256 request signature validation with replay attack protection.

* [x] 🐳 **Containerization**
  * Created Dockerfile and `docker-compose.yml` for local development (API, MySQL, Redis).

* [x] 🛡️ **Rate Limiting**
  * Redis-backed rate limiter middleware with configurable thresholds.

* [x] 🌐 **CORS Middleware**
  * Flexible, `.env`-driven CORS support with wildcard and whitelist options.

* [x] 🛠️ **Test Coverage**
  * Comprehensive Jest and Supertest suites covering middleware, helpers, and services.

---

## 🛠️ Improvements & Maintenance

* [ ] 📚 **Documentation Enhancements**
  * Add code examples to API Reference for each endpoint.
  * Improve CONTRIBUTING.md with PR and issue templates.
  * Migrate docs into a static site generator (e.g., Docusaurus).

* [ ] ♻️ **Input Validator Refactoring**
  * Extract common validation patterns into reusable modules and optimize performance.

* [ ] 🧩 **Plugin / Extension System**
  * Offer hooks for custom middleware (`app.usePlugin('auth', opts)`) without modifying core.

* [ ] 🖋️ **TypeScript Support**
  * Migrate to TypeScript or ship type definitions for better IDE support and safer code.

* [ ] 🎨 **Developer Experience (DX)**
  * Provide a CLI (`npx neacore-cli generate endpoint users`) for scaffolding.
  * Offer a starter template or generator for instant project bootstrapping.

---

*Last updated: `$(date +"%Y-%m-%d")`*