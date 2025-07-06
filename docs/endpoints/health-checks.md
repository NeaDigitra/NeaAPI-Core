# 🏥 Health Check System Documentation

[![Health Monitoring](https://img.shields.io/badge/Monitoring-Health%20Checks-green)](.)
[![Kubernetes Ready](https://img.shields.io/badge/Kubernetes-Ready-blue)](.)
[![Production Optimized](https://img.shields.io/badge/Production-Optimized-orange)](.)

> 💚 **Comprehensive health monitoring system** - Production-ready endpoints for application health, service availability, and system metrics following industry best practices.

---

## 🔌 **Available Health Endpoints**

### 1️⃣ **Liveness Probe** (`/health/live`)
> ✅ **Basic server availability check**

- 🎯 **Purpose**: Basic server availability check
- 🚀 **Use Case**: Kubernetes/Docker liveness probes
- 📊 **Response**: Always returns 200 if server is running
- 🔧 **Example**:
```bash
curl http://localhost:3000/health/live
```

### 2️⃣ **Readiness Probe** (`/health/ready`)
> 🔄 **Comprehensive service dependency check**

- 🎯 **Purpose**: Comprehensive service dependency check
- ⚖️ **Use Case**: Load balancer routing decisions
- 🔍 **Checks**: Database and Redis connectivity
- 📊 **Response**: 200 if all services healthy, 503 if any service is down
- 🔧 **Example**:
```bash
curl http://localhost:3000/health/ready
```

### 3️⃣ **Legacy Health** (`/health/health`)
> 🔄 **Backward compatibility support**

- 🎯 **Purpose**: Backward compatibility
- 🛠️ **Use Case**: Simple health checks
- 📊 **Response**: 200/503 status codes only
- 🔧 **Example**:
```bash
curl http://localhost:3000/health/health
```

### 4️⃣ **Startup Probe** (`/health/startup`)
> 🚀 **Application initialization check**

- 🎯 **Purpose**: Application initialization check
- ☸️ **Use Case**: Kubernetes startup probes
- 🔍 **Checks**: Global service availability
- 🔧 **Example**:
```bash
curl http://localhost:3000/health/startup
```

### 5️⃣ **Status Overview** (`/health/status`)
> 📊 **Comprehensive application dashboard**

- 🎯 **Purpose**: Comprehensive application status
- 📋 **Use Case**: Operations dashboard
- 📊 **Information**: App info, system resources, service status
- 🔧 **Example**:
```bash
curl http://localhost:3000/health/status
```

### 6️⃣ **Deep Health Check** (`/health/deep`)
- **Purpose**: Detailed performance metrics
- **Use Case**: Monitoring and debugging
- **Features**: Response time measurements for each service
- **Example**:
```bash
curl http://localhost:3000/health/deep
```

### 7️⃣ **Metrics** (`/health/metrics`)
- **Purpose**: System metrics for monitoring
- **Use Case**: Prometheus/monitoring systems
- **Format**: Raw JSON metrics
- **Example**:
```bash
curl http://localhost:3000/health/metrics
```

## ⚡ **Optimizations Implemented**

1. **Helper Functions**: Centralized database and Redis check functions
2. **Parallel Execution**: Uses `Promise.all()` for concurrent health checks
3. **Error Handling**: Proper error capturing and reporting
4. **Response Time Measurement**: Precise timing for performance monitoring
5. **Memory Optimization**: Removed uptime tracking to reduce memory usage
6. **Code Reusability**: DRY principle applied throughout

## 🚀 **Production Recommendations**

### ⚙️ **Kubernetes Configuration**
```yaml
livenessProbe:
  httpGet:
    path: /health/live
    port: 3000
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /health/ready
    port: 3000
  initialDelaySeconds: 5
  periodSeconds: 5

startupProbe:
  httpGet:
    path: /health/startup
    port: 3000
  initialDelaySeconds: 10
  periodSeconds: 5
  failureThreshold: 30
```

### 🔗 **Load Balancer Configuration**
- Use `/health/ready` for routing decisions
- Set appropriate timeout values (recommended: 5-10 seconds)
- Configure retry logic for failed checks

### 📊 **Monitoring Setup**
- Use `/health/metrics` for Prometheus scraping
- Set up alerts based on `/health/deep` response times
- Monitor `/health/status` for operational insights

## 🚨 **Error Responses**

All endpoints return appropriate HTTP status codes:
- `200`: Healthy
- `503`: Service Unavailable (with detailed error information)

Error responses include detailed information about which services are failing and why.
