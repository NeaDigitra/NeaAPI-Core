# 🚀 Installation & Deployment Guide

## ✅ Prerequisites

Ensure your development environment meets the following requirements:

* [x] **Node.js** (v22.x or newer)
* [x] **npm** (v10.x or newer)
* [x] **MySQL Server** (v9.x or newer)
* [x] **Redis Server** (v7.x or newer)

## 🎉 One-Click Deployment

Deploy this project to Railway with a single click:

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy/neacore-api?referralCode=JBf6Ji)

## ⚙️ App Configuration

Copy the following template into your `.env` file and adjust values as needed:

```dotenv
# App Configuration
APP_NAME=NeaCore API
APP_VERSION=1.0.0
APP_PORT=3000
APP_DEBUG=false
ERROR_BASE_URL=http://localhost:3000/errors

# Database Configuration
DB_CLIENT=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=username
DB_PASSWORD=password
DB_NAME=database_name

# Redis Configuration
REDIS_URL=redis://localhost:6379
REDIS_USERNAME=
REDIS_PASSWORD=

# Rate Limit Configuration
RATE_LIMIT_MAX=10
RATE_LIMIT_WINDOW=10
RATE_LIMIT_UPDATE_INTERVAL=3600000

# CORS Configuration
CORS_ORIGIN=https://yourdomain.com,https://anotherdomain.com
CORS_METHODS=GET,POST
CORS_ALLOWED_HEADERS=Content-Type,X-Signature,X-Secret
CORS_EXPOSED_HEADERS=Content-Length
CORS_OPTIONS_STATUS=204
CORS_CREDENTIALS=true
CORS_MAX_AGE=86400
```

## 🔍 Environment Variables Explained

A breakdown of each variable and its purpose:

### App Configuration

* **APP\_NAME**: The display name of your application (used in logs or metadata).
* **APP\_VERSION**: The current version of your application.
* **APP\_PORT**: Port on which the server will listen (e.g., 3000).
* **APP\_DEBUG**: Toggles debug mode (`true` to enable verbose logging).
* **ERROR\_BASE\_URL**: Base URL for serving or linking to custom error pages.

### Database Configuration

* **DB\_CLIENT**: Database driver (`mysql2` or `pg`)
* **DB\_HOST**: Hostname or IP address of your database server.
* **DB\_PORT**: Port number for the database service (default is 3306 for MySQL).
* **DB\_USER**: Username for database authentication.
* **DB\_PASSWORD**: Password for database authentication.
* **DB\_NAME**: Name of the database to connect to.

### Redis Configuration

* **REDIS\_URL**: Connection string for Redis (including protocol and host\:port).
* **REDIS\_USERNAME**/**REDIS\_PASSWORD**: Credentials if your Redis instance is protected.

### Rate Limit Configuration

* **RATE\_LIMIT\_MAX**: Maximum number of requests allowed per window.
* **RATE\_LIMIT\_WINDOW**: Time window (in seconds) for counting requests.
* **RATE\_LIMIT\_UPDATE\_INTERVAL**: Interval in milliseconds to update cloudflare ips.

### CORS Configuration

* **CORS\_ORIGIN**: Comma-separated list of allowed origins for cross-origin requests.
* **CORS\_METHODS**: Comma-separated list of HTTP methods your API accepts.
* **CORS\_ALLOWED\_HEADERS**: Headers that clients are allowed to send.
* **CORS\_EXPOSED\_HEADERS**: Headers that browsers can access from responses.
* **CORS\_OPTIONS\_STATUS**: Status code to send for successful `OPTIONS` preflight requests.
* **CORS\_CREDENTIALS**: Whether to allow cookies/credentials in cross-origin requests (`true`/`false`).
* **CORS\_MAX\_AGE**: How long (in seconds) browsers should cache the preflight response.

## 🚦 Getting Started

1. **Clone the repository and install dependencies**:

   ```bash
   git clone https://github.com/NeaDigitra/NeaAPI-Core.git
   cd NeaAPI-Core
   cp .env.example .env
   npm install
   ```

2. **🔧 Configure environment variables** in the `.env` file.

3. **🧪 Run unit tests** to verify everything is working:

   ```bash
   npm test
   ```
4. **🔄 Run database migrations** (if applicable):

   ```bash
   npm run migrate
   ```
   This step is necessary to set up your database schema.
 
5. **💻 Start the development server**:

   ```bash
   npm start
   ```

## 🐳 Running with Docker

### 📦 Production Image

Build and run the Docker image:

```bash
# Build image
docker build -t neaapi-core:latest .
# Run container
docker run -p 3000:3000 neaapi-core:latest
```

### 🔄 Development with Live Reload

Use Docker Compose for development:

```bash
docker-compose up --build
```

This will mount your source code and automatically restart the server on changes.

## 🛠️ Troubleshooting

* **❌ Redis errors**: Confirm Redis is running on the specified host and port.
* **❌ MySQL connection issues**: Verify the credentials in `.env` and ensure the MySQL service is running.
* **❌ CORS errors**: Check your CORS configuration in the `.env` file, especially the `CORS_ORIGIN` setting.

---

## 📚 **Additional Documentation**

* [EXAMPLE.md - Example Usage](EXAMPLE.md)
* [REFERENCE.md - API Reference](REFERENCE.md)
* [CONTRIBUTING.md - Contribution Guidelines](CONTRIBUTING.md)
* [SECURITY.md - Security Policy](SECURITY.md)
* [STRUCTURE.md - Project Structure](STRUCTURE.md)
* [TODO.md - Future Enhancements](TODO.md)