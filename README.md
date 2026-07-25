# Posvora Frontend

A Next.js 15 (App Router) frontend built for the `posvora-server` NestJS API — a multi-tenant
POS / retail-ERP SaaS (organizations → shops → branches → warehouses, products & inventory,
sales & purchases, customers & suppliers, HR/payroll, accounting, roles & permissions,
subscriptions, audit logs, notifications, and a super-admin panel).

The architecture borrows the clean patterns from your reference project (feature-based folders,
a resilient `httpClient` with silent refresh-token retry, react-query + react-hook-form + zod,
Tailwind v4) but every API call is wired to the **real** endpoints in `posvora-server`.

## Getting started

```bash
npm install
cp .env.example .env.local   # point NEXT_PUBLIC_API_URL at your running posvora-server
npm run dev
```

The app expects `posvora-server` to be running and reachable at `NEXT_PUBLIC_API_URL`
(default `http://localhost:8080/api/v1`), with cookie-based auth (`credentials: "include"`),
matching the server's refresh-token flow (`POST /auth/refresh`).

## What's fully built

- **Auth**: register (creates org + owner), login, logout, change password, silent token refresh
- **Dashboard shell**: role-aware sidebar (uses each user's `roles` to show/hide nav items),
  shop switcher, mobile drawer
- **Products**: categories/brands/units quick-add + full product CRUD with pricing, stock
  alert, opening quantity
- **Customers / Suppliers**: full CRUD with search + pagination
- **Shops / Branches / Warehouses**: full CRUD, each scoped to its parent (branch→shop,
  warehouse→branch)
- **Employees, Roles & permissions, Accounting (accounts/expenses), Inventory (stock &
  low-stock), Subscription plans, Audit logs, Notifications, Settings (profile/org/password),
  Super-admin overview** — all built as working pages against the real endpoints

## What's scaffolded, not fully fleshed out

`Sales` and `Purchases` show real transaction history, but the actual POS checkout screen
(cart, barcode scan, split payments) and the goods-receiving screen are not built — the API
hooks (`useCreateSale`, `useCreatePurchase`, `receive`, `addPayment`, etc.) are ready and
correctly typed against the server's DTOs in `src/features/sales` and `src/features/purchase`,
so building those screens is mostly UI work on top of what's here.

## Project structure

```
src/
  app/                     route groups: (auth), (dashboard)
  components/
    ui/                    Button, Input, Modal, Badge, DataTable primitives...
    common/                DataTable, Pagination, SearchInput, PageHeader
    shared/                Sidebar, Topbar, MobileSidebar
  config/                  env.ts, site.ts (nav items + role visibility)
  context/                 AuthContext, ActiveShopContext, Providers
  features/<module>/       api.ts · types.ts · schema.ts · hooks/ · components/
  lib/                     utils.ts, permissions.ts
  services/httpClient.ts   fetch wrapper w/ silent refresh + envelope unwrapping
```

Each `features/<module>` folder maps 1:1 to a `posvora-server` module (auth, organization,
shop, branch, warehouse, product, inventory, customer, supplier, sales, purchase, role,
employee, accounting, subscription, audit-log, notification, user, super-admin).
