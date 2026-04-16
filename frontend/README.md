<div align="center">

# 🖥️ SmartCommerce AI — Frontend

### React 19 · TypeScript · Vite · Recharts

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![React Router](https://img.shields.io/badge/React%20Router-v7-CA4245?style=flat-square&logo=react-router)](https://reactrouter.com)
[![Recharts](https://img.shields.io/badge/Recharts-3.x-22B5BF?style=flat-square)](https://recharts.org)

*A modular, domain-driven React SPA with role-based routing, JWT authentication, and real-time analytics dashboards.*

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Architecture](#-architecture)
- [Role-Based Routing](#-role-based-routing)
- [Authentication](#-authentication)
- [API Integration](#-api-integration)
- [Module Reference](#-module-reference)
- [Available Scripts](#-available-scripts)
- [Environment Configuration](#-environment-configuration)

---

## 🌐 Overview

The **SmartCommerce AI Frontend** is a single-page application that provides three distinct portals — **Customer**, **Vendor**, and **Admin** — each with dedicated layouts, protected routes, and purpose-built dashboards. The app is fully integrated with the Spring Boot backend via an Axios client with automatic JWT injection.

### Core Features

| Feature | Description |
|---|---|
| 🔐 **Role-Based Routing** | `RoleRoute` guard enforces domain access by JWT role |
| 📊 **Analytics Dashboards** | Recharts-powered sales and revenue visualizations |
| 🛒 **Cart & Orders** | Full customer shopping flow with order history |
| 🏷️ **Variant Management** | Multi-step product creation with SKU matrix generation |
| 🤖 **AI Recommendations** | Vendor-facing AI pricing suggestions panel |
| ⚡ **Vite Proxy** | Zero-CORS dev setup: `/api/*` proxied to `localhost:8080` |
| 🎨 **Design System** | CSS Custom Properties theming, glassmorphism, micro-animations |

---

## 📦 Prerequisites

| Requirement | Version |
|---|---|
| Node.js | 18+ |
| npm | 9+ |
| SmartCommerce AI Backend | Running on port 8080 |

---

## 🚀 Getting Started

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at **`http://localhost:5173`**

> **Important:** The Spring Boot backend must be running on port 8080 before starting the frontend. The Vite dev server transparently proxies all API calls.

---

## 📁 Project Structure

```
frontend/
├── src/
│   │
│   ├── modules/                        # Domain-driven feature modules
│   │   ├── customer/
│   │   │   ├── AuthPage.tsx            # Login + Register with role-based redirect
│   │   │   ├── ProductListing.tsx      # Public product catalogue with search/filter
│   │   │   ├── ProductDetail.tsx       # Product page with variant selector
│   │   │   ├── CartPage.tsx            # Shopping cart management
│   │   │   └── OrdersPage.tsx          # Customer order history
│   │   │
│   │   ├── vendor/
│   │   │   ├── Dashboard.tsx           # Sales KPIs, revenue charts (Recharts)
│   │   │   ├── ProductList.tsx         # Vendor's product catalogue table
│   │   │   ├── CreateProduct.tsx       # Multi-step product + variant creation
│   │   │   ├── VendorOrders.tsx        # Incoming orders, status management
│   │   │   └── AIRecommendations.tsx   # AI-generated pricing suggestions
│   │   │
│   │   └── admin/
│   │       ├── AdminDashboard.tsx      # Platform-wide analytics
│   │       ├── VendorManagement.tsx    # Vendor approval, suspension
│   │       └── CommissionRules.tsx     # Commission rule configuration
│   │
│   ├── layouts/
│   │   ├── CustomerLayout.tsx          # Navbar + Outlet (public store)
│   │   ├── VendorLayout.tsx            # Sidebar navigation (vendor portal)
│   │   └── AdminLayout.tsx             # Sidebar navigation (admin portal)
│   │
│   ├── context/
│   │   ├── AuthContext.tsx             # JWT auth state, login/logout, primaryRole
│   │   └── CartContext.tsx             # Cart items state management
│   │
│   ├── routes/
│   │   └── RoleRoute.tsx               # Protected route guard by role
│   │
│   ├── services/
│   │   └── api.ts                      # Axios instance with JWT interceptor
│   │
│   ├── styles/                         # Global design tokens & utilities
│   │
│   ├── App.tsx                         # Root route tree
│   ├── main.tsx                        # React DOM entry point
│   └── index.css                       # CSS custom properties / design system
│
├── vite.config.ts                      # Vite dev proxy configuration
├── tsconfig.app.json                   # TypeScript compiler options
├── eslint.config.js                    # ESLint configuration
└── package.json
```

---

## 🏛️ Architecture

### Route Tree

```
/                           → CustomerLayout
├── (index)                 → ProductListing
├── product/:id             → ProductDetail
├── cart                    → CartPage
└── orders                  → OrdersPage

/login                      → AuthPage (standalone, no layout)

/vendor                     → RoleRoute [requires: VENDOR]
└── VendorLayout
    ├── dashboard            → VendorDashboard
    ├── products             → ProductList
    ├── products/create      → CreateProduct
    ├── orders               → VendorOrders
    └── ai                   → AIRecommendations

/admin                      → RoleRoute [requires: ADMIN]
└── AdminLayout
    ├── dashboard            → AdminDashboard
    ├── vendors              → VendorManagement
    └── commissions          → CommissionRules
```

### Component Hierarchy

```
App.tsx
└── AuthProvider
    └── CartProvider
        └── BrowserRouter
            ├── /login → AuthPage
            ├── / → CustomerLayout → <Outlet>
            ├── /vendor → RoleRoute → VendorLayout → <Outlet>
            └── /admin  → RoleRoute → AdminLayout  → <Outlet>
```

---

## 🔐 Role-Based Routing

### `RoleRoute.tsx`

A declarative route guard that protects vendor and admin domains:

```tsx
// Unauthenticated → /login
if (!isAuthenticated) return <Navigate to="/login" />;

// Wrong role → redirect to their own correct dashboard
if (!user.roles.includes(requiredRole)) {
  if (primaryRole === 'ADMIN')  return <Navigate to="/admin/dashboard" />;
  if (primaryRole === 'VENDOR') return <Navigate to="/vendor/dashboard" />;
  return <Navigate to="/" />;
}

return <Outlet />;
```

### Post-Login Redirect

`AuthPage.tsx` resolves the landing page based on the JWT's `roles` array:

```typescript
function getRoleRedirect(roles: string[]): string {
  if (roles.includes('ADMIN'))  return '/admin/dashboard';
  if (roles.includes('VENDOR')) return '/vendor/dashboard';
  return '/'; // Customer
}
```

---

## 🔑 Authentication

### `AuthContext.tsx`

Provides global auth state via React Context:

```typescript
interface AuthContextType {
  user: User | null;         // { id, name, email, roles[] }
  token: string | null;      // Raw JWT string
  isAuthenticated: boolean;  // !!token
  primaryRole: string | null;// ADMIN > VENDOR > USER (priority order)
  login: (token, user) => void;
  logout: () => void;
}
```

- **Persistence:** Auth state is stored in `localStorage` and rehydrated on page reload.
- **Primary Role Priority:** `ADMIN > VENDOR > USER` — determines which dashboard to redirect to.

### JWT Interceptor

`services/api.ts` automatically attaches the token to every outbound request:

```typescript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

---

## 🔌 API Integration

All API calls use the centralized Axios instance at `services/api.ts`:

```typescript
import api from '../../services/api';

// GET request
const { data } = await api.get('/products');

// POST with body
const { data } = await api.post('/auth/login', { email, password });

// Multipart (file upload)
const form = new FormData();
await api.post('/products', form, { headers: { 'Content-Type': 'multipart/form-data' } });
```

### Vite Proxy (Dev)

```typescript
// vite.config.ts
'/api': {
  target: 'http://localhost:8080',
  changeOrigin: true,
  rewrite: (path) => path.replace(/^\/api/, '')
}
```

`/api/products` in the browser → `http://localhost:8080/products` on the network. No CORS headers needed.

---

## 📦 Module Reference

### Customer Module

| Component | Purpose |
|---|---|
| `AuthPage` | Login/Register form. Parses flat `AuthResponse` from backend. Redirects by role. |
| `ProductListing` | Browse all active products with search and category filter |
| `ProductDetail` | Product page with image gallery and variant picker |
| `CartPage` | View cart, update quantities, proceed to checkout |
| `OrdersPage` | Customer's order history with status tracking |

### Vendor Module

| Component | Purpose |
|---|---|
| `Dashboard` | KPI cards + Recharts area/bar charts for sales and revenue |
| `ProductList` | Paginated table of the vendor's products with status badges |
| `CreateProduct` | Multi-step wizard: Details → Attributes → Variants & Inventory → Media |
| `VendorOrders` | Incoming order queue with status update actions |
| `AIRecommendations` | Displays AI-generated optimal price suggestions per product |

### Admin Module

| Component | Purpose |
|---|---|
| `AdminDashboard` | Platform-wide KPIs, top vendors, sales breakdown |
| `VendorManagement` | Approve, suspend, or review vendor applications |
| `CommissionRules` | Create and manage commission percentages per vendor/category |

---

## 🧱 Design System

The app uses **CSS Custom Properties** for theming, defined in `index.css`:

```css
:root {
  --primary:        hsl(221, 83%, 53%);
  --secondary:      hsl(262, 83%, 58%);
  --bg-main:        hsl(220, 20%, 10%);
  --bg-surface:     hsl(220, 18%, 14%);
  --text-primary:   hsl(0, 0%, 95%);
  --text-secondary: hsl(220, 10%, 60%);
  --border-light:   hsl(220, 15%, 22%);
  --radius-md:      8px;
  --radius-lg:      14px;
  --shadow-lg:      0 8px 32px hsl(220 80% 10% / 0.4);
}
```

---

## 📜 Available Scripts

```bash
# Start development server (HMR enabled)
npm run dev

# Type-check + production build
npm run build

# Preview production build locally
npm run preview

# Run ESLint
npm run lint
```

---

## ⚙️ Environment Configuration

The frontend requires no `.env` file in development — the Vite proxy handles the backend connection.

For **production builds**, configure the API base URL:

```bash
# .env.production
VITE_API_BASE_URL=https://api.yourproductiondomain.com
```

Then update `services/api.ts`:

```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
});
```

---

## 🔧 Troubleshooting

### API calls returning 404

Ensure the backend is running on port 8080 **before** starting the frontend. The Vite proxy has no fallback.

```bash
# Start backend first
cd ../backend && ./mvnw spring-boot:run

# Then frontend
cd ../frontend && npm run dev
```

### Login not redirecting correctly

Clear `localStorage` in DevTools and try again. Stale `user` JSON from before the `roles[]` migration may cause parse issues.

```javascript
// Browser console
localStorage.clear();
```

### TypeScript errors after pulling changes

```bash
npm install        # Install any new dependencies
npm run build      # Catch all type errors
```

---

<div align="center">

**SmartCommerce AI Frontend** — Built with React 19 · TypeScript · Vite · Recharts

</div>
