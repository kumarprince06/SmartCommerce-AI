<div align="center">

# ⚙️ SmartCommerce AI — Backend

### Spring Boot REST API · Java 17 · MySQL · Redis · JWT

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0.5-6DB33F?style=flat-square&logo=spring-boot)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-17-ED8B00?style=flat-square&logo=openjdk)](https://openjdk.org)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat-square&logo=mysql)](https://www.mysql.com)
[![Redis](https://img.shields.io/badge/Redis-Cache-DC382D?style=flat-square&logo=redis)](https://redis.io)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](../LICENSE)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Module Reference](#-module-reference)
- [API Endpoints](#-api-endpoints)
- [Security Architecture](#-security-architecture)
- [Data Seeder](#-data-seeder)
- [Configuration Reference](#-configuration-reference)
- [Environment Variables](#-environment-variables)

---

## 🌐 Overview

The **SmartCommerce AI Backend** is a RESTful API built with Spring Boot 4.0.5. It provides the complete server-side foundation for the multi-vendor e-commerce platform, including JWT-based authentication, role-based authorization, product catalogue management, vendor onboarding, order processing, AI pricing recommendations, and a Redis-backed caching layer.

### Design Principles

- **Modular Package Structure** — Each domain is a self-contained package (`auth`, `product`, `vendor`, etc.) with its own controller, service, repository, entity, and DTO layers.
- **Stateless Auth** — All authentication is JWT-based. No server-side sessions.
- **Separation of Concerns** — `common/` holds shared utilities (mappers, wrappers). No cross-domain leakage.
- **Command-Line Seeding** — `DataSeeder` auto-provisions roles, users, vendors, categories, and 50 products on first boot.

---

## 📦 Prerequisites

| Requirement | Version |
|---|---|
| Java (JDK) | 17+ |
| Maven | Included via `./mvnw` |
| MySQL | 8.0+ |
| Redis | 6.0+ |

---

## 🚀 Getting Started

### 1. Create the Database

```sql
CREATE DATABASE smartcommerceai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Configure Application Properties

Edit `src/main/resources/application.properties`:

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/smartcommerceai
spring.datasource.username=YOUR_DB_USER
spring.datasource.password=YOUR_DB_PASSWORD

# JWT Secret (change in production)
jwt.secret=your-256-bit-secret-key-here
jwt.expiration=86400000
```

### 3. Start Redis

```bash
# Using Docker (recommended)
docker run -d -p 6379:6379 redis:7-alpine

# Or via system service
sudo systemctl start redis
```

### 4. Run the Application

```bash
./mvnw spring-boot:run
```

The server starts at **`http://localhost:8080`**

> On the **first boot**, `DataSeeder` will automatically create roles, seed users, categories, and 50 mock products with variants. Subsequent boots skip seeding if the product count ≥ 50.

---

## 📁 Project Structure

```
backend/src/main/java/com/SmartCommerceAI/
│
├── SmartCommerceAiApplication.java     # Spring Boot entry point
│
├── auth/                               # Authentication Domain
│   ├── controller/AuthController.java  # POST /auth/login, /auth/register
│   ├── service/AuthService.java        # Registration, login, JWT generation
│   └── dto/                            # AuthRequest, AuthResponse, RegisterRequest
│
├── user/                               # User Domain
│   ├── entity/User.java                # User JPA entity
│   ├── entity/Role.java                # Role entity (USER, VENDOR, ADMIN)
│   ├── entity/RoleType.java            # Enum: USER | VENDOR | ADMIN
│   ├── entity/UserStatus.java          # Enum: ACTIVE | SUSPENDED
│   ├── repository/UserRepository.java
│   └── repository/RoleRepository.java
│
├── vendor/                             # Vendor Domain
│   ├── controller/VendorController.java
│   ├── service/VendorService.java      # Vendor onboarding, VENDOR role assignment
│   ├── entity/Vendor.java
│   ├── entity/VendorStatus.java        # Enum: PENDING | APPROVED | SUSPENDED
│   └── dto/
│
├── product/                            # Product Domain
│   ├── entity/Product.java             # Base product
│   ├── entity/ProductVariant.java      # SKU-level variant with price & stock
│   ├── entity/Attribute.java           # Dynamic attribute (Color, Size, etc.)
│   ├── entity/AttributeValue.java      # Attribute option value
│   ├── entity/InventoryLog.java        # Audit log for stock changes
│   └── repository/                     # All product repositories
│
├── category/                           # Category Domain
│   ├── entity/Category.java            # Self-referencing tree (parent/child)
│   └── repository/CategoryRepository.java
│
├── order/                              # Order Domain
│   └── (order lifecycle management)
│
├── ai/                                 # AI Recommendations Domain
│   ├── entity/AiRecommendation.java    # Suggested price + reason per product
│   └── service/                        # Recommendation generation logic
│
├── analytics/                          # Analytics Domain
│   ├── controller/AnalyticsController.java  # Vendor-scoped metrics @PreAuthorize(VENDOR)
│   └── (product metrics, vendor revenue)
│
├── commission/                         # Commission Domain
│   └── (admin-managed commission rule engine)
│
├── pricing/                            # Dynamic Pricing Domain
│   └── (pricing calculation services)
│
├── common/                             # Shared Utilities
│   ├── mapper/UserMapper.java          # User → AuthResponse / UserResponse
│   └── wrapper/ApiResponse.java        # Unified { success, data, message } envelope
│
└── config/                             # Application Configuration
    ├── SecurityConfig.java             # Spring Security filter chain, public routes
    ├── JwtAuthenticationFilter.java    # JWT extraction + validation on each request
    ├── ApplicationConfig.java          # AuthenticationProvider, PasswordEncoder beans
    ├── RedisConfig.java                # RedisTemplate serialization (JSON)
    ├── CorsConfig.java                 # CORS policy (origin, methods, headers)
    ├── AsyncConfig.java                # @EnableAsync thread pool configuration
    └── DataSeeder.java                 # CommandLineRunner: seeds roles, users, products
```

---

## 🔌 Module Reference

### Auth Module

Handles all authentication flows. Returns a flat `AuthResponse` JWT payload.

**Response Shape:**
```json
{
  "data": {
    "token": "eyJhbGci...",
    "userId": 1,
    "name": "Admin User",
    "email": "admin@super.com",
    "roles": ["ADMIN"],
    "message": "Login successful"
  }
}
```

### Product Module

Supports multi-dimensional product variants. Each `Product` has:
- `ProductAttribute[]` — which attributes apply (e.g., Color, Storage)
- `ProductVariant[]` — each permutation with its own SKU, price, and stock
- `InventoryLog[]` — full audit trail of stock IN/OUT movements

### Vendor Module

Manages vendor onboarding. When a user registers as a vendor, the service:
1. Creates a `Vendor` profile linked to the user
2. Assigns the `VENDOR` role to the user's `roles` set
3. Re-issues a new JWT reflecting the updated roles

### AI Module

`AiRecommendation` stores AI-generated pricing suggestions per product:
```json
{ "suggestedPrice": 4999.00, "reason": "Below market average for this category" }
```

---

## 🔗 API Endpoints

### Authentication

```
POST   /auth/register           Register new user
POST   /auth/login              Authenticate and receive JWT
```

### Products

```
GET    /products                List all active products (public)
GET    /products/{id}           Get product details with variants
POST   /products                Create product (VENDOR)
PUT    /products/{id}           Update product (VENDOR)
DELETE /products/{id}           Delete product (VENDOR)
POST   /products/{id}/variants  Add variant to product (VENDOR)
```

### Vendors

```
GET    /vendors                 List all vendors (ADMIN)
GET    /vendors/{id}            Get vendor profile
POST   /vendors/register        Onboard as vendor
PUT    /vendors/{id}/status     Approve/suspend vendor (ADMIN)
```

### Orders

```
POST   /orders                  Place order (USER)
GET    /orders                  List user's orders (USER)
GET    /orders/vendor           List vendor's orders (VENDOR)
PUT    /orders/{id}/status      Update order status (VENDOR)
```

### Analytics

```
GET    /analytics/vendor        Vendor sales metrics (VENDOR)
GET    /analytics/platform      Platform-level stats (ADMIN)
```

### Admin

```
GET    /admin/commissions        List commission rules
POST   /admin/commissions        Create commission rule
PUT    /admin/commissions/{id}   Update rule
```

---

## 🔐 Security Architecture

```
HTTP Request
     │
     ▼
JwtAuthenticationFilter
     │  Extracts Bearer token from Authorization header
     │  Validates signature + expiry using JJWT
     │  Loads UserDetails → sets SecurityContext
     ▼
Spring Security Filter Chain
     │  Checks @PreAuthorize annotations
     │  Enforces role-based access per controller method
     ▼
Controller → Service → Repository
```

### Public Endpoints (no auth required)
- `POST /auth/login`
- `POST /auth/register`
- `GET /products/**`
- `GET /categories/**`

### Protected Endpoints
All other endpoints require a valid `Authorization: Bearer <token>` header with the appropriate role.

---

## 🌱 Data Seeder

`DataSeeder.java` implements `CommandLineRunner` and runs on startup. It creates:

| Resource | Count |
|---|---|
| Roles | 3 (USER, ADMIN, VENDOR) |
| Users | 3 (admin, vendor1, vendor2) |
| Vendors | 2 (CyberTech Inc, Urban Outfits) |
| Categories | 5 (Electronics, Smartphones, Laptops, Fashion, Shirts) |
| Products | 50 (randomly generated with 2–4 variants each) |
| Variants | ~150 (with inventory logs) |

**Seeder is skipped** if `productRepository.count() >= 50`.

---

## ⚙️ Configuration Reference

### `application.properties`

```properties
# ── Application ──────────────────────────────────
spring.application.name=smart-commerce-ai

# ── Database ─────────────────────────────────────
spring.datasource.url=jdbc:mysql://localhost:3306/smartcommerceai
spring.datasource.username=root
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# ── JPA / Hibernate ──────────────────────────────
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect

# ── Redis ─────────────────────────────────────────
spring.data.redis.host=localhost
spring.data.redis.port=6379

# ── JWT ──────────────────────────────────────────
jwt.secret=your-256-bit-secret
jwt.expiration=86400000
```

---

## 🌍 Environment Variables

For production deployments, override these via environment variables:

| Variable | Description | Default |
|---|---|---|
| `SPRING_DATASOURCE_URL` | JDBC connection string | `jdbc:mysql://localhost:3306/smartcommerceai` |
| `SPRING_DATASOURCE_USERNAME` | DB username | `root` |
| `SPRING_DATASOURCE_PASSWORD` | DB password | *(none)* |
| `SPRING_DATA_REDIS_HOST` | Redis host | `localhost` |
| `SPRING_DATA_REDIS_PORT` | Redis port | `6379` |
| `JWT_SECRET` | HMAC-SHA256 signing key | *(required)* |
| `JWT_EXPIRATION` | Token expiry in ms | `86400000` (24h) |

---

## 🧪 Running Tests

```bash
./mvnw test
```

Test dependencies include Spring Boot starters for JPA, Security, Web, and Validation tests.

---

## 🔧 Troubleshooting

### Port 8080 Already in Use

```bash
# Find and kill the process occupying port 8080
fuser -k 8080/tcp

# Then restart the application
./mvnw spring-boot:run
```

### Database Connection Failed

Ensure MySQL is running and the `smartcommerceai` database exists:
```bash
sudo systemctl start mysql
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS smartcommerceai;"
```

### Redis Connection Refused

```bash
# Start Redis via Docker
docker run -d -p 6379:6379 --name redis redis:7-alpine

# Or via systemd
sudo systemctl start redis
```

---

<div align="center">

**SmartCommerce AI Backend** — Built with Spring Boot · Java 17 · MySQL · Redis

</div>
