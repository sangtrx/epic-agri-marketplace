# Sep 7 demo validation

Validation performed September 6, 2026 on Big Linux in the disposable nested fork clone. No infrastructure source or Mercur core was modified. No deploy, paid service, production database or host-service restart was performed.

## Accepted architecture

Official `create-mercur-app@2.3.3` basic application with the optional official Next.js storefront. Generator/source fork base: `98471d057e34c9133b6e0c42708a48106dd1c04f`. Published Mercur packages pinned consistently to 2.3.3, Medusa to 2.18.0. All application changes live in `demos/epic-agri-market`; the root README adds a link only.

## Checks actually run

- `bun install --cwd . --frozen-lockfile`: **passed** with Bun 1.3.11; committed `bun.lock`. API route code generation completed.
- `bun run test:demo`: **2 passed, 81 assertions**. Three distinct supply regions, seller coverage, reserved fictional email domain, price/quantity consistency, pack metadata, unique seller/product offer keys and competing durian offers.
- `bun run typecheck`: **passed** for backend, admin, vendor and storefront. The initial generated starter had React 18/19 conflicts, an empty route type, missing direct UI dependencies and stale storefront types. Small compatibility fixes were made in the copied app; no errors were suppressed and no core package was refactored.
- `bun run demo:setup`: **passed**, including PostgreSQL migrations and native Mercur workflow seeding. Isolated PostgreSQL 18.4 on loopback port 16487, owned by this task; no existing database accessed. Creates 3 sellers, 6 products, 7 priced and stocked offers, Vietnam/VND, 5% default commission and a fictional operator account.
- `bun run --cwd packages/api seed` after completion: **passed**, explicitly reports already seeded and changes no data.
- `bun run demo:smoke`: **passed**. Health, Vietnam region, catalog/offer counts, prices/stock, operator authentication, commission rate, all three seller authentications, seller-specific offer visibility and cross-seller access denial. Creates a two-seller cart, applies each seller's delivery, uses the manual test payment provider, completes once, checks two seller orders and nonzero commission lines.
- `bun run --cwd apps/storefront build`: **passed**, with TypeScript validation enabled. The Next.js trace root is limited to this standalone app.
- `bun run --cwd apps/admin build`: **passed**.
- `bun run --cwd apps/vendor build`: **passed**.
- `bun run --cwd packages/api build`: **passed**, including bundling both dashboard builds into the backend artifact.
- Browser checks with Chromium/Playwright: buyer desktop and 390 px mobile home, seven API-backed offer cards, no mobile horizontal overflow, product page, two durian offer comparison rows and add-to-cart. Operator browser login rendered `/dashboard/orders`; seller browser login and store selection rendered the native seller offers view. No browser page errors. Local HTTP checks: buyer, admin and vendor returned 200. Screenshots are under `docs/screenshots`.
- All four listeners verified on 127.0.0.1 (3107, 9107, 7107, 7108). Git diff reviewed; no local environments, passwords, publishable keys, database files or dependency/build output included.

## Known upstream limitation: checkout completion retry

An additional exploratory test repeated `POST /store/carts/:id/complete` after a successful manual checkout. Mercur 2.3.3 returned a **different order-group ID**, rather than the existing group. This is a real duplicate-completion defect in the selected upstream runtime. Core was left unchanged as requested. The reproducible smoke check submits completion once; it does **not** claim retry safety. For the rehearsal, submit once and do not replay a completed request. This defect blocks real transactional use until fixed and independently validated.

The test orders use only fictional buyer/address data and a manual payment provider; no money moves. Dashboard large-chunk warnings and local event-bus/in-memory-lock warnings are inherited from the official starter. The app is a local demonstration, not a production fulfillment/payment system.

## Scope of evidence

The fixtures use native workflow creation and real API-backed views, not a static mock catalog. Automated smoke checkout validates the backend order path; a full browser checkout with address entry and every onboarding transition is outside this delivery's evidence. No real supplier approval, inspection, cold-chain delivery, escrow, AI grading, payout or external integration was tested or asserted.
