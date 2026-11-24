# StockFlow — Inventory Management MVP

Assignment submission for the **6-hour MVP PRD**: a multi-tenant SaaS inventory app where each user owns one organization and manages its product catalog and stock.

**Repository:** https://github.com/MukulPretham/wexa

## What was built

A working end-to-end MVP covering every in-scope requirement (FR-1 → FR-7):

- **Authentication** — email/password signup with organization provisioning, login, logout, database-backed sessions, protected routes.
- **Multi-tenancy** — all products are scoped to the signed-in organization. Foreign IDs return 404, and SKUs are unique per organization rather than globally.
- **Product management** — list with search by name or SKU, create, edit, and delete with a confirmation dialog. Optional description, cost price, selling price and low-stock threshold.
- **Stock control** — edit quantity directly, or use the quick `+/− N` adjustment with an optional note. The update is atomic, so stock can never go negative.
- **Dashboard** — product count, total units on hand, low-stock count and a low-stock table. Products without their own threshold fall back to the organization default.
- **Settings** — organization-level default low-stock threshold.
- **UI** — responsive dark theme with consistent tables, forms, badges and dialogs.

## Requirements coverage

| Requirement | Delivered |
|---|---|
| FR-1 Signup & login | Email/password auth with validation; password reset intentionally excluded |
| FR-2 Organization context | Organization created on signup; all data scoped to it |
| FR-3 Product model | Name, SKU, description, quantity, prices, threshold, timestamps |
| FR-4 Product CRUD | List, search, create, edit, delete with confirmation |
| FR-5 Stock updates | Quantity in edit form plus quick adjust with note |
| FR-6 Dashboard | Product count, total units, low-stock table |
| FR-7 Settings | Default low-stock threshold |
| Non-functional | Server-side validation, hashed passwords, session auth, desktop-first responsive UI |

## Tech stack

Next.js 16 (App Router, Server Components, Server Actions) · TypeScript · Tailwind CSS v4 · Prisma 7 · PostgreSQL · bcryptjs · Zod.

## Engineering decisions

- **Tenant isolation:** the organization ID always comes from the server-side session, never request input; reads, updates and deletes filter on `{ id, organizationId }`.
- **Sessions:** opaque 32-byte tokens stored in Postgres, delivered in an `httpOnly`/`SameSite=Lax` cookie. Logout revokes the row; expired sessions are pruned.
- **Stock safety:** adjustments use a conditional update (`quantityOnHand >= -delta`), preventing concurrent decrements from going negative.
- **Data integrity:** SKUs are trimmed and uppercased, so casing cannot create duplicate SKUs within an org.
- **Low-stock rule:** `quantityOnHand <= (product.lowStockThreshold ?? organization.defaultLowStockThreshold)`.

## Demo account

```
Email:    demo@stockflow.dev
Password: password123
```

The seeded **Demo Store** has 9 products, 113 units on hand and 4 low-stock items. See `DEMO.md` for the click-by-click reviewer walkthrough.

## Out of scope (per the brief)

Multi-warehouse, variants, sales-channel integrations, order management, purchase orders, email notifications, CSV import, external API, role-based access control, audit history and billing.

## Build phases

| Phase | Scope |
|---|---|
| 1 | Project foundation and tooling |
| 2 | Domain model, migration and seed |
| 3 | Authentication and tenant isolation |
| 4 | Authenticated app shell |
| 5 | Product and inventory management |
| 6 | Dashboard and low-stock reporting |
| 7 | Organization settings |
| 8 | QA fixes (session pruning, SKU casing, mobile logout) |
| 9 | Documentation and reviewer walkthrough |
| 10 | Dark theme pass and responsive polish |
