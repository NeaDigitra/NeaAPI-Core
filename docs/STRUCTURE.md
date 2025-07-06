## 📂 Project Structure

This document outlines the structure of the NeaAPI-Core project, detailing the purpose of each file and directory.

The project is organized to facilitate development, testing, and deployment of the NeaAPI service.

---

```bash
.                        
├── docker-compose.yml           # Docker Compose for local dev (API, MySQL, Redis)
├── Dockerfile                   # Docker image build instructions for production
├── package-lock.json            # Locked versions of npm dependencies
├── package.json                 # Project metadata, scripts, dependencies
└── src                          # Source code directory
    ├── config            
    │   ├── app.js               # Load env vars, global app settings
    │   └── ratelimit.js         # Rate limit parameters and in-memory store
    ├── controllers       
    │   └── all.js               # Exports route handlers (business logic entrypoints)
    ├── helpers           
    │   └── response            
    │       ├── generator.js     # Functions to build standard API response objects
    │       └── render.js        # Functions to generate html responses for errors
    ├── middlewares       
    │   ├── cors.js              # Enforces CORS policy (origins, methods, headers)
    │   ├── fingerprint.js       # Generates/verifies per-request fingerprint
    │   ├── logger.js            # Logs incoming requests and responses
    │   ├── ratelimit.js         # Applies rate limiting per IP using config
    │   ├── response.js          # Attaches helper methods to `res` for uniform replies
    │   ├── session.js           # Manages user sessions (cookies or tokens)
    │   └── signature.js         # Validates HMAC signatures on requests
    ├── modules           
    │   └── global              
    │       └── rules.js         # Shared validation patterns, enums, ranges
    ├── routes            
    │   ├── all.js               # Mounts all route modules onto Express app
    │   ├── errors.js            # Defines custom error page and RFC7807 handlers
    │   └── general.js           # Health check, status, info endpoints
    ├── server.js                # App entry point: initializes middleware, DB, Redis, HTTP server
    ├── services                 # External service integrations
    │   └── redis.js             # Redis client setup and caching/pub-sub helpers
    ├── tests                    # Automated tests
    │   ├── cores                    # Core functionality tests
    │   │   ├── app.test.js          # Tests for app config and initialization
    │   │   ├── generator.test.js    # Tests for response generator logic
    │   │   ├── ratelimit.test.js    # Tests for rate limit config and behavior
    │   │   └── redis.test.js        # Tests for Redis service helpers
    │   ├── helpers           
    │   │   └── mock               
    │   │       └── data.js          # Mock data for various test suites
    │   ├── middlewares      
    │   │   ├── cors.test.js         # Ensures CORS headers follow config
    │   │   ├── fingerprint.test.js  # Validates fingerprint uniqueness
    │   │   ├── ratelimit.test.js    # Rate limit middleware tests
    │   │   ├── response.test.js     # Uniform response formatting tests
    │   │   └── signature.test.js    # Signature validation tests
    │   └── validators            
    │       └── validator.test.js    # Full suite for input validation logic
    └── utils             
        └── validators          
            ├── field.js          # Field builders for validation schemas & sanitization
            ├── input.js          # Low-level field validation (type, required, enums)
            └── index.js          # Aggregates all validator functions
```