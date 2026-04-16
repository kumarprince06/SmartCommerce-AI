<div align="center">

# 🛒 SmartCommerce AI

### An Intelligent Multi-Vendor E-Commerce Platform

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0.5-6DB33F?style=flat-square&logo=spring-boot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat-square&logo=mysql)](https://www.mysql.com)
[![Redis](https://img.shields.io/badge/Redis-Cache-DC382D?style=flat-square&logo=redis)](https://redis.io)
[![Java](https://img.shields.io/badge/Java-17-ED8B00?style=flat-square&logo=openjdk)](https://openjdk.org)

*A full-stack, role-based e-commerce platform powered by AI-driven pricing recommendations, real-time analytics, and a modular vendor intelligence system.*

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Repository Structure](#-repository-structure)
- [Role-Based Access Control](#-role-based-access-control)
- [Quick Start](#-quick-start)
- [Default Seed Accounts](#-default-seed-accounts)
- [Documentation](#-documentation)
- [Contributing](#-contributing)

---

## 🌐 Overview

**SmartCommerce AI** is a production-grade, multi-vendor e-commerce platform that combines traditional marketplace functionality with AI-generated pricing recommendations. The platform serves three distinct user personas — **Customers**, **Vendors**, and **Admins** — each with their own dedicated portal and role-enforced access.

### Key Capabilities

| Feature | Description |
|---|---|
| 🔐 **JWT Authentication** | Stateless, role-based authentication with per-role dashboard routing |
| 🤖 **AI Pricing Engine** | Rule-driven AI recommendation system for optimal product pricing |
| 🏪 **Multi-Vendor Support** | Independent vendor storefronts with approval workflow and commission management |
| 📦 **Variant Inventory** | Multi-dimensional product variants (Color × Size × Storage) with live inventory tracking |
| 📊 **Real-Time Analytics** | Vendor sales metrics and admin-level platform analytics via Recharts |
| ⚡ **Redis Caching** | High-performance caching layer for frequently accessed catalogue data |
| 💰 **Commission Rules** | Admin-controlled commission structures applied per vendor/category |

---

## 🏛️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        SMARTCOMMERCE AI                          │
│                                                                   │
│  ┌──────────────────────┐       ┌───────────────────────────┐    │
│  │   React + Vite SPA   │       │  Spring Boot REST API     │    │
│  │   (Port 5173)        │◄─────►│  (Port 8080)              │    │
│  │                      │  JWT  │                           │    │
│  │  Customer Layout     │       │  Auth    │ Products       │    │
│  │  Vendor Layout       │       │  Vendor  │ Orders         │    │
│  │  Admin Layout        │       │  Admin   │ Analytics      │    │
│  └──────────────────────┘       │  AI      │ Commission     │    │
│                                 └─────┬─────────────────────┘    │
│         Vite /api proxy              │                           │
│         (no CORS needed)             │                           │
│                              ┌───────┼───────────┐               │
│                              │       │           │               │
│                         ┌────▼────┐ ┌▼─────────┐│               │
│                         │  MySQL  │ │  Redis   ││               │
│                         │  8.0    │ │  Cache   ││               │
│                         └─────────┘ └──────────┘│               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛠 Tech Stack

### Backend
| Layer | Technology |
|---|---|
| Framework | Spring Boot 4.0.5 |
| Language | Java 17 |
| ORM | Spring Data JPA + Hibernate 7.x |
| Security | Spring Security + JJWT 0.11.5 |
| Database | MySQL 8.0 |
| Cache | Redis (Spring Data Redis) |
| Build | Maven (mvnw wrapper) |
| Utilities | Lombok, Bean Validation |

### Frontend
| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 8 |
| Language | TypeScript 6.0 |
| Routing | React Router DOM 7 |
| HTTP Client | Axios 1.x |
| Charts | Recharts 3 |
| Icons | Lucide React |
| Styling | Vanilla CSS + CSS Custom Properties |

---

## 📁 Repository Structure

```
SmartCommerce AI/
├── backend/                    # Spring Boot REST API
│   ├── src/main/java/com/SmartCommerceAI/
│   │   ├── auth/               # JWT auth, login/register
│   │   ├── user/               # User entity, roles
│   │   ├── vendor/             # Vendor profiles, onboarding
│   │   ├── product/            # Products, variants, inventory
│   │   ├── category/           # Category tree
│   │   ├── order/              # Order lifecycle
│   │   ├── ai/                 # AI pricing recommendations
│   │   ├── analytics/          # Sales & revenue analytics
│   │   ├── commission/         # Commission rule engine
│   │   ├── pricing/            # Dynamic pricing module
│   │   ├── common/             # Shared DTOs, mappers
│   │   └── config/             # Security, Redis, CORS, DataSeeder
│   ├── pom.xml
│   └── mvnw
│
├── frontend/                   # React + Vite SPA
│   ├── src/
│   │   ├── modules/
│   │   │   ├── admin/          # Admin dashboard, vendor mgmt, commissions
│   │   │   ├── vendor/         # Vendor dashboard, products, orders, AI
│   │   │   └── customer/       # Auth, product listing, cart, orders
│   │   ├── layouts/            # AdminLayout, VendorLayout, CustomerLayout
│   │   ├── context/            # AuthContext, CartContext
│   │   ├── routes/             # RoleRoute (protected routing guard)
│   │   ├── services/           # Axios API client with JWT interceptor
│   │   └── App.tsx             # Root router with role-based route tree
│   ├── vite.config.ts          # Dev proxy: /api → localhost:8080
│   └── package.json
│
└── README.md                   # ← You are here
```

---

## 🔐 Role-Based Access Control

The platform supports three roles, each with a dedicated layout and protected route group:

| Role | Login Redirect | Access |
|---|---|---|
| `ADMIN` | `/admin/dashboard` | Vendor management, commission rules, platform analytics |
| `VENDOR` | `/vendor/dashboard` | Product management, orders, AI recommendations |
| `USER` | `/` | Product browsing, cart, order history |

> **Route Guards:** `RoleRoute.tsx` wraps each domain's route tree. Unauthenticated users are redirected to `/login`. Users attempting to access an unauthorized domain are silently redirected to their own dashboard.

---

## ⚡ Quick Start

> **Prerequisites:** Java 17+, Node.js 18+, MySQL 8.0, Redis

### 1. Clone the repository

```bash
git clone https://github.com/kumarprince06/SmartCommerce-AI.git
cd "SmartCommerce AI"
```

### 2. Start the Backend

```bash
cd backend

# Configure your database credentials in:
# src/main/resources/application.properties

# Create the database
mysql -u root -p -e "CREATE DATABASE smartcommerceai;"

# Run the server (DataSeeder auto-populates 50 products on first boot)
./mvnw spring-boot:run
```

The API will be live at `http://localhost:8080`

### 3. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be live at `http://localhost:5173`

> The Vite dev server proxies all `/api/*` requests to `http://localhost:8080` — no CORS configuration needed.

---

## 🔑 Default Seed Accounts

On first startup, `DataSeeder.java` automatically creates the following accounts with 50 seeded products:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@super.com` | `Password@123` |
| Vendor (Tech) | `v1@tech.com` | `Password@123` |
| Vendor (Fashion) | `v2@fashion.com` | `Password@123` |

---

## 📖 Documentation

| Document | Location |
|---|---|
| Backend API & Setup | [`backend/README.md`](./backend/README.md) |
| Frontend Architecture | [`frontend/README.md`](./frontend/README.md) |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

<div align="center">

Built with ❤️ by **Kumar Prince**

</div>
