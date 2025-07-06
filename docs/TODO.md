# 📝 Project Roadmap & TODOs

This document contains upcoming features, recent milestones, and improvement tasks for **NeaAPI-Core**.

Contributions are welcome — feel free to open issues or submit pull requests! 🚀

---

## 🚀 Upcoming Features

* [ ] 📄 **API Documentation Generator**
  * Automatically generate OpenAPI/Swagger specs from route definitions and validation schemas for easy client integration.

* [ ] 🔧 **Global Logging Service**
  * Centralize request and error logs into Elasticsearch or a similar logging backend for real-time monitoring and analysis.

* [ ] ⚙️ **Health Checks & Metrics**
  * Implement `/health` and `/metrics` endpoints (Prometheus-compatible) to track uptime, response times, and resource usage.

* [ ] 💾 **Database Migrations UI**
  * Provide a web interface to manage database schema migrations (status, rollback, apply).

* [ ] 🔄 **Dynamic Configuration Reload**
  * Allow certain `.env`-driven config values (e.g., rate limits, CORS origins) to reload at runtime without restarting.

---

## ✅ Completed Milestones

* [x] 🗄️ **Database Integration**
  * Added MySQL support via Knex.js, including migrations and seed data.

* [x] 🔐 **Signature Middleware**
  * HMAC-SHA256 request signature validation with replay attack protection.

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
  * Improve CONTRIBUTING.md with PR templates and issue templates.
  * Migrate docs into a static site generator (e.g., Docusaurus).

* [ ] ♻️ **Refactor Input Validators**
  * Extract common validation patterns into reusable modules and optimize performance.

* [x] 🔄 **CI/CD Pipeline**
  * Integrate automated deployments (GitHub Actions) to staging and production environments.

* [ ] 📈 **Performance Benchmarking**
  * Add load testing scripts (k6 or Artillery) and document performance targets.

---

*Last updated: `$(date +"%Y-%m-%d")`*