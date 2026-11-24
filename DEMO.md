# Reviewer Demo — StockFlow

A click-by-click walkthrough that covers every acceptance criterion in the brief. Expected values assume a fresh `pnpm db:seed`.

## Setup

```bash
pnpm install
cp .env.example .env        # set DATABASE_URL and SESSION_SECRET
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Open <http://localhost:3000>.

**Demo account**

```
demo@stockflow.dev
password123
```

Seeded state: **9 products, 113 units on hand, 4 low-stock items** — Demo Store.

---

## 1. Authentication

1. Visit `/dashboard` while signed out → redirected to `/login`.
2. Sign in with the demo account → land on `/dashboard`.
3. Visit `/signup` while signed in → redirected back to `/dashboard`.
4. This proves route protection in both directions.

## 2. Dashboard

After login you should see:

| Card | Expected |
|---|---|
| Products | 9 |
| Units on hand | 113 |
| Low stock items | 4 |

Low-stock table (ordered by quantity):

| Product | SKU | Qty | Threshold |
|---|---|---|---|
| Webcam 1080p | WC-006 | 0 | 2 |
| HDMI Cable 2m | HC-009 | 2 | 5 |
| Laptop Stand | LS-005 | 3 | 5 |
| USB-C Hub | UC-003 | 4 | 8 |

## 3. Product list & search

1. Open **Products** → 9 rows with name, SKU, quantity, status badge and selling price.
2. Search `keyboard` → one row: **Mechanical Keyboard (MK-002)**.
3. Search `uc-003` → one row: **USB-C Hub**, status **Low stock**.
4. Click **Clear** → all 9 rows return.

## 4. Create & validate a product

1. Click **Add product**.
2. Submit the empty form → inline errors: *Name is required*, *SKU is required*.
3. Fill in:
   - Name: `Studio Lamp`
   - SKU: `SL-010`
   - Quantity: `3`
   - Cost price: `14`
   - Selling price: `39.99`
   - Low stock threshold: leave blank
4. **Create product** → redirected to the list; **Studio Lamp** appears with status **Low stock** (3 ≤ default 5).
5. Click **Add product** again and try the same SKU `SL-010` → inline error: *A product with this SKU already exists in your organization.*
6. Try the lowercase variant `sl-010` → same error, because SKUs are normalized to uppercase.

## 5. Edit, adjust and delete

1. On **Studio Lamp**, click **Edit**.
2. Change **Quantity on hand** to `12` → **Save changes**.
3. The row now shows **In stock**.
4. Click **Adjust** on Studio Lamp:
   - Adjustment: `-2`
   - Note: `Demo stock count`
   - **Apply adjustment** → quantity becomes `10`, dialog closes.
5. Try Adjustment `-999` → error *Only 10 units available.* Stock is unchanged.
6. Click **Delete** on Studio Lamp:
   - Confirmation dialog appears.
   - **Cancel** leaves the row intact.
   - **Delete** again → **Delete product** → row disappears.
7. Dashboard is back to **9 products / 113 units / 4 low stock**.

## 6. Settings and the org default

1. Open **Settings**.
2. Set **Default low stock threshold** to `8` → **Save settings** → *Settings saved.*
3. Return to **Dashboard** → low-stock count becomes **5**.
   The **27" Monitor (MN-004, qty 7, no own threshold)** now appears with threshold `8` and a muted **default** label.
4. Back in **Settings**, restore `5` → **Save settings**.
5. Dashboard returns to **4** low-stock items.
6. Enter `-1` → *Threshold cannot be negative.* (server-side validation).

## 7. Tenant isolation

1. Open the demo product list and copy an edit URL, e.g. `/products/<id>/edit`.
2. Click **Log out**.
3. **Create an account** with a different organization:
   - Organization: `Review Org`
   - Email: `review@stockflow.dev`
   - Password: `password123`
4. New dashboard shows **0 / 0 / 0** and *Nothing needs restocking*.
5. **Products** shows the empty state.
6. Create a product with SKU `WM-001` — the same SKU used by demo **Wireless Mouse**.
   It is accepted, proving SKUs are unique per organization, not globally.
7. Paste the demo product edit URL into the address bar → **404 — This page could not be found.**
8. Sign out and sign back in as `demo@stockflow.dev` to leave the app in its seeded state.

Optional cleanup: delete the `Review Org` row from `organizations` (cascades its user, session and products), or leave it as evidence of the isolation test.

## 8. Session behaviour

1. Sign out → redirected to `/login`; the session row is revoked and the cookie cleared.
2. Visit `/dashboard` → redirected to `/login`.
3. Sign in again → dashboard renders from the database, not from client state.

---

## Acceptance checklist

| Criterion | Covered |
|---|---|
| Sign up, log in, see dashboard | Steps 1, 7 |
| Create product with SKU and quantity | Step 4 |
| Product appears in list and summary | Steps 4, 2 |
| Low-stock items surfaced by threshold | Steps 2, 6 |
| All data scoped to organization | Step 7 |
| Demo works end-to-end without manual DB edits | All steps |

**Seeded reset:** `pnpm db:seed` is idempotent and restores the nine demo products without duplicating them.
