# StockFlow

A minimal multi-tenant inventory management app built for the **6-hour MVP** brief in `[PDF 1]`. One organization per signup, one product catalog per organization, and a dashboard that surfaces stock levels and low-stock items.

**Live demo:** run locally with the steps below and sign in with:

```
Email:    demo@stockflow.dev
Password: password123
```

## Features

- **Authentication** — email/password signup with organization provisioning, login, logout, server-side sessions.
- **Tenant isolation** — every product query and mutation is scoped to the signed-in organization. A foreign product ID returns 404 rather than data.
- **Products** — create, read, update, delete; SKU unique per organization; optional description, cost price, selling price and low-stock threshold.
- **Search** — case-insensitive filter by product name or SKU.
- **Stock adjustments** — edit quantity directly, or use the inline adjust action with `+/− N` and an optional note. Negative stock is rejected atomically.
- **Dashboard** — product count, total units on hand, low-stock count, and a low-stock table.
- **Settings** — organization-level default low-stock threshold used when a product has no threshold of its own.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Server Components, Server Actions) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL (Neon) |
| ORM | Prisma 7 with `@prisma/adapter-pg` |
| Auth | `bcryptjs` password hashing + opaque database-backed session cookies |
| Validation | Zod |

## Getting started

**Requirements:** Node.js 20+, pnpm 10+, a PostgreSQL database.

```bash
pnpm install

cp .env.example .env
# Set DATABASE_URL to your PostgreSQL connection string.
# Generate SESSION_SECRET with: openssl rand -base64 32
```

Apply the schema and seed the demo organization:

```bash
pnpm db:migrate    # prisma migrate dev
pnpm db:seed       # demo org, user and 9 products
pnpm dev
```

Open <http://localhost:3000> and sign in with the demo account above.

### Environment variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string. Include `?sslmode=require` for hosted providers. |
| `SESSION_SECRET` | Secret reserved for session signing. The current MVP stores opaque random session tokens in the database and keeps this value for deployment parity. |

`.env` is gitignored; only `.env.example` is committed.

### Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start the development server |
| `pnpm build` | Production build |
| `pnpm start` | Start the production server |
| `pnpm lint` | ESLint |
| `pnpm db:migrate` | Create and apply migrations in development |
| `pnpm db:seed` | Seed the demo organization (idempotent) |
| `pnpm db:studio` | Open Prisma Studio |

## Routes

| Route | Description |
|---|---|
| `/` | Redirects to the dashboard or login based on session |
| `/login`, `/signup` | Authentication |
| `/dashboard` | Summary cards and low-stock table |
| `/products` | Product list with search |
| `/products/new` | Create product |
| `/products/[id]/edit` | Edit product |
| `/settings` | Organization default low-stock threshold |

## Data model

```
Organization ──< User ──< Session
      │
      └──< Product
```

- **Organization** — `name`, `defaultLowStockThreshold` (default `5`).
- **User** — unique email, bcrypt password hash, belongs to one organization.
- **Session** — opaque 32-byte token, seven-day expiry, cascades on user deletion.
- **Product** — name, SKU, optional description, `quantityOnHand`, optional `Decimal(12,2)` cost/selling prices, optional low-stock threshold, last adjustment note/time.
  - `@@unique([organizationId, sku])` — SKUs are unique per organization.
  - SKUs are normalized to uppercase on write, so casing cannot create duplicates.

## Implementation notes

- **Sessions** are stored in Postgres, not signed into the cookie. The cookie is `httpOnly`, `SameSite=Lax`, and `Secure` in production. Logout revokes the row before clearing the cookie; expired sessions are removed on lookup and pruned on login.
- **Tenancy** — the organization ID always comes from the server-side session, never from request input. Product reads/updates/deletes use `{ id, organizationId }` in the same `where`.
- **Stock adjustment** uses a conditional `updateMany` (`quantityOnHand >= -delta`), so concurrent decrements cannot drive stock negative.
- **Low-stock rule** — `quantityOnHand <= (product.lowStockThreshold ?? organization.defaultLowStockThreshold)`.
- **Prices** stay `Decimal(12,2)` in Postgres and are formatted to USD in the UI.
- **Auth pages** and the authenticated layout opt out of Next 16 Cache Components validation with `export const instant = false`, since session reads are request-time data.

## PRD coverage

| Requirement | Status |
|---|---|
| FR-1 Signup & login | ✅ Email/password signup, login, validation; password reset intentionally excluded |
| FR-2 Organization context | ✅ Organization created on signup; all data scoped to it |
| FR-3 Product model | ✅ Name, SKU, description, quantity, prices, threshold, timestamps |
| FR-4 Product CRUD | ✅ List, create, edit, delete with confirmation; name/SKU search |
| FR-5 Stock updates | ✅ Edit quantity inline in form and via adjust dialog with note |
| FR-6 Dashboard | ✅ Product count, total units, low-stock table |
| FR-7 Settings | ✅ Default low-stock threshold |
| NFRs | ✅ Server-side validation, hashed passwords, session auth, responsive desktop-first UI |

## Out of scope (per the brief)

Multi-warehouse, product variants, sales-channel integrations, order management, purchase orders, email notifications, CSV import, external API, role-based access control, audit history, billing.

## Build phases

The commit history follows the implementation order:

| Phase | Scope | Commits |
|---|---|---|
| 1 | Project foundation & tooling | 2 |
| 2 | Domain model, migration, seed | 2 |
| 3 | Authentication & tenant isolation | 5 |
| 4 | Authenticated app shell | 1 |
| 5 | Product & inventory management | 5 |
| 6 | Dashboard & low-stock reporting | 2 |
| 7 | Organization settings | 1 |
| 8 | QA fixes (session pruning, SKU casing, mobile logout) | 3 |
| 9 | Documentation & demo walkthrough | 2 |

## Known limitations

- One user per organization, as specified for the MVP.
- No password reset flow; a password can be changed manually in the database.
- Single warehouse/single location.
- Desktop-first UI; mobile navigation is functional but compact.
- Currency is formatted as USD.
