# EPIC Agri Market — Sep 7, 2026 demo

A Vietnam agriculture B2B/B2C marketplace concept, built with the **official Mercur application generator and its Next.js storefront**. This is an application inside the real `sangtrx/epic-agri-marketplace` fork; the upstream development monorepo and MIT license remain intact.

## Run locally

Prerequisites: Node.js 22+ (checked with 24.20.0), Bun 1.3.11, and a **dedicated local PostgreSQL 13+ database**. The single-process demo uses the starter's in-memory event bus, locks and Redis fallback. It does not need Stripe, Algolia, TalkJS, cloud accounts or paid resources.

```bash
git clone https://github.com/sangtrx/epic-agri-marketplace.git
cd epic-agri-marketplace/demos/epic-agri-market
bun install --cwd . --frozen-lockfile
createdb epic_agri_demo
DATABASE_URL=postgresql://localhost:5432/epic_agri_demo bun run demo:configure
bun run demo:setup
bun run dev
```

Use your own local PostgreSQL connection if peer/password authentication differs. Configuration accepts only loopback databases named `epic_agri_demo` or `epic_agri_demo_<suffix>`. It generates random local account/session secrets, writes them to ignored files with private permissions, and never prints them. The database must be empty of marketplace data.

**Keep `--cwd .` on installation:** this prevents Bun from selecting the surrounding upstream workspace. Scripts use `bun run --cwd <package>` so each app resolves its own local binaries. No global Medusa CLI is needed.

| Surface | URL / port |
| --- | --- |
| Buyer marketplace | http://localhost:3107/vn |
| Backend / health | http://localhost:9107/health |
| Operator dashboard | http://localhost:9107/dashboard |
| Seller dashboard / onboarding | http://localhost:9107/seller / http://localhost:9107/seller/register |
| Internal admin Vite dev server | 127.0.0.1:7107 |
| Internal vendor Vite dev server | 127.0.0.1:7108 |

All app listeners bind to loopback. Use the backend URLs for the dashboards. Open **`.demo/access.json` locally and privately** for the generated password and fictional operator/seller identities. Do not commit, share, or publish it. Sign in as `operator@epic.example`, `mekong@epic.example`, `highland@epic.example`, or `coast@epic.example`.

For separate terminals instead of the root dev command:

```bash
bun run --cwd packages/api dev
bun run --cwd apps/admin dev
bun run --cwd apps/vendor dev
bun run --cwd apps/storefront dev
```

`demo:setup` runs migrations followed by the agriculture seed. A successfully completed seed is a no-op when repeated. An interrupted seed is deliberately rejected on retry: existing data is preserved. For another clean rehearsal, create a new dedicated database and a fresh checkout/configuration. The script never drops databases or overwrites existing suppliers/products.

## Five-minute walkthrough

1. **Buyer:** open `/vn`. Browse seven real API-backed offers, regional seller profiles and the six-product catalog. Open Ri6 durian and compare the Mekong and Highland offers with independent prices and stock. Add packs from two sellers to the same cart. Quantity means packs, not kilograms; each pack's weight is stated.
2. **Seller:** sign into `/seller` as a fictional cooperative. Inspect that seller's offers, prices, inventory and orders. New members can use `/seller/register`; the operator approves access. Approval is a marketplace access state, not supplier verification.
3. **Operator:** sign into `/dashboard`. Inspect all sellers, the shared product catalog, offers and the default **5% commission**, excluding shipping/tax. Mercur's order groups preserve a multi-seller cart as per-seller orders.
4. **Test checkout:** use only fictional buyer/address information and the manual test payment option. Each seller's illustrative delivery fee is 30,000 VND. **Submit once and do not retry completion:** Mercur 2.3.3 created another order group when completion was repeated in our isolated test (see `VALIDATION.md`). No money moves and no carrier is booked. Actual order/commission behavior checked for this delivery is recorded in `VALIDATION.md`.

| Fictional seller | Coarse sourcing area | Products / offers |
| --- | --- | --- |
| Mekong Harvest Cooperative | Đồng Tháp · Cao Lãnh area · Mekong Delta | Ri6 durian, Cát Chu mango; 10 kg crates |
| Highland Green Cooperative | Lâm Đồng · Đà Lạt area · Central Highlands | Competing durian offer, 5 kg vegetables, 1 kg black pepper |
| Central Coast Foods | Khánh Hòa · Nha Trang area · South Central Coast | 2 kg shrimp and squid packs |

All contact identities use the reserved `.example` domain. Region labels are coarse sourcing areas, including familiar historical district names, and do not disclose exact farm locations. Quantity, declared grade, region, availability window and lead time are stored on **offer metadata**; prices and live stock use Mercur's native offer primitives.

## Architecture and provenance

Generated with `create-mercur-app@2.3.3`, `basic` template, **Next.js storefront selected**, database/dependency setup skipped for controlled local configuration. On September 6 the generator fetched Mercur main, matching fork base `98471d057e34c9133b6e0c42708a48106dd1c04f` (2.3.4-canary.3). The application's Mercur dependencies are pinned together to the published stable **2.3.3**, with **Medusa 2.18.0** and **Next.js 15.5.21**. The lockfile is committed.

- `packages/api`: official `withMercur` Medusa application; domain changes are seed/content only. Native seller registration, approval, shared master products, seller offers, inventory, carts, order groups and commissions are preserved.
- `apps/admin`, `apps/vendor`: official Mercur React/Vite dashboards, branded through the supported dashboard SDK configuration.
- `apps/storefront`: official Next.js storefront, adapted for agriculture. Uses the official typed client, seller/product/offer APIs, cart context, offer comparison and checkout.
- `packages/api/src/scripts/epic-catalog.ts`: deterministic fictional fixtures; one master durian product has competing seller offers.
- No Mercur core modules/routes, infrastructure repository files, host services or production workloads were changed. No deployment was performed.

The standalone starter needed local dependency/type compatibility adjustments: a common React 18 runtime/type version, generated API route types wired into the storefront, directly declared UI dependencies, and small copied-storefront DTO/nullability corrections. These are confined to this app. See `VALIDATION.md` for results and any remaining limitation.

## Checks

```bash
bun run test:demo
bun run typecheck
bun run build
# With the local backend running; creates only a fictional demo cart/test order:
bun run demo:smoke
```

Build dashboard apps before the API: its official build script bundles their output. The root build preserves this dependency order. The backend should be running with seeded data while building the storefront. Development is the supported rehearsal command (`bun run dev`). Build output is not a deployment.

## Demo limits and attribution

No production quality inspection, escrow, AI grading, supplier verification, logistics API, real payment capture or payouts are implemented or claimed. Grades, quantities, availability and stock are fictional. Tax and delivery settings are illustrative, not a production Vietnam commerce configuration. No map was added to keep the core demo path small.

Mercur is created and maintained by **Rigby / MercurJS** and builds on **Medusa**. Source attribution and the upstream [MIT license](../../LICENSE) are preserved. Photographs have their own licenses; credits, source links and modification notes are in `apps/storefront/src/data/agri-image-credits.json` and the storefront's **About this demo & image credits** page. GFDL text accompanies the applicable photograph. Images do not establish supplier identity, variety, origin or grade.
