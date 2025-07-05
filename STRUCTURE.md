## 📂 Project Structure

This document outlines the structure of the NeaAPI-Core project, detailing the purpose of each file and directory.

The project is organized to facilitate development, testing, and deployment of the NeaAPI service.

---

```bash
.
├── CONTRIBUTING.md                    # Contribution guidelines
├── docker-compose.yml                 # Docker Compose configuration
├── Dockerfile                         # Docker build file
├── EXAMPLE.md                         # Example usage and API calls
├── package-lock.json                  # NPM lockfile
├── package.json                       # Project dependencies and scripts
├── README.md                          # Project overview and usage
├── REFERENCE.md                       # Detailed API reference
├── SECURITY.md                        # Security policies
├── STRUCTURE.md                       # Project structure documentation
├── TODO.md                            # Project TODO list
└── src
    ├── config
    │   ├── app.js                     # App configuration
    │   └── ratelimit.js               # Rate limit configuration
    ├── controllers
    │   └── all.js                     # Controller logic
    ├── helpers
    │   └── response
    │       ├── generator.js           # API response generator
    │       └── render.js              # API response renderer
    ├── middlewares
    │   ├── cors.js                    # CORS middleware
    │   ├── fingerprint.js             # Fingerprint middleware
    │   ├── logger.js                  # Logger middleware
    │   ├── ratelimit.js               # Rate limit middleware
    │   ├── response.js                # Response formatter middleware
    │   └── signature.js               # Signature verification middleware
    ├── modules
    │   └── global
    │       └── rules.js               # Global validation rules
    ├── routes
    │   ├── all.js                     # Combined route definitions
    │   ├── errors.js                  # Error route definitions
    │   └── general.js                 # General route definitions
    ├── server.js                      # App entry point
    ├── services
    │   └── redis.js                   # Redis client service
    ├── tests
    │   ├── cores
    │   │   ├── app.test.js            # App config tests
    │   │   ├── generator.test.js      # Response generator tests
    │   │   ├── ratelimit.test.js      # Rate limit config tests
    │   │   └── redis.test.js          # Redis service tests
    │   ├── helpers
    │   │   └── mock
    │   │       └── data.js            # Mock data for tests
    │   ├── middlewares
    │   │   ├── cors.test.js           # CORS middleware tests
    │   │   ├── fingerprint.test.js    # Fingerprint middleware tests
    │   │   ├── ratelimit.test.js      # Rate limit middleware tests
    │   │   ├── response.test.js       # Response middleware tests
    │   │   └── signature.test.js      # Signature middleware tests
    │   └── validators
    │       └── validator.test.js      # Validators logic tests
    └── utils
        └── validators
            ├── field.js               # Field validation logic
            ├── index.js               # Validators entry point
            └── input.js               # Input validation helpers
```
