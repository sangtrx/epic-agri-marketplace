# SAN-189 — Vietnam agriculture marketplace discovery PRD

**Status:** Discovery complete enough for business review; implementation remains explicitly out of scope until the EPIC high-tech commerce launch gate is cleared or the business reprioritizes.

**Date:** 2026-09-09

## 1. Executive decision

Do **not** launch as an “all agriculture” marketplace or as a consumer grocery clone. Start with a narrow B2B procurement pilot:

> **Recurring HCMC business procurement of standardized fresh-vegetable lots from verified Lâm Đồng cooperatives/producers, using coarse origin, lot-level quality evidence, bounded acceptance, and route-aware delivery.**

Initial buyer segment: independent restaurants, small restaurant groups, caterers, and independent grocers in HCMC that reorder produce at least weekly and can place practical order sizes.

Initial supply segment: cooperatives / organized producers that can declare quantity, ready window, grade, packing unit, and coarse source area reliably. Do not onboard arbitrary individual farms at scale in v1.

Initial product scope: a small set of vegetables whose grades and packing can be described consistently and whose logistics do not require seafood-grade cold-chain infrastructure. Start with robust, repeat-purchase items such as tomatoes, cucumbers, cabbage and similar commercial vegetables; do not begin with seafood, export lots, livestream consumer grocery, or a huge mixed catalog.

This choice is deliberately narrower than the September demo catalog. The current Mercur demo proves marketplace mechanics can be presented, but it is not evidence that the production business model, QA process, logistics, payment settlement, supplier verification, or economics work.

## 2. Why this beachhead

### 2.1 Evidence-backed rationale

1. **Aggregation is more important than another listing surface.** The World Bank's 2026 AgriConnect guidance notes that smallholders commonly struggle with transport cost, fragmented supply, bargaining power, reliable market access and consistent quality. Producer organizations / cooperatives can pool production, meet quality standards and lower transaction costs. That supports starting from organized supply rather than an open map of individual farms.
2. **Digital wholesale direction is already validated in Vietnam.** In April 2026, Vietnam's Ministry of Industry and Trade announced an online agricultural wholesale market initiative connecting Vietnamese producers with importers/distributors, emphasizing qualified supply, quantity assurance, traceability and order aggregation. EPIC therefore should compete on execution around supply reliability, QA and logistics rather than merely on “put agriculture online.”
3. **Traceability requirements are strengthening.** Vietnam's National Standards authority reported in August 2026 that HCMC's 2026–2030 plan targets traceability coverage for priority/key agricultural products and OCOP products, with data intended to become standardized and interoperable. Traceability should therefore be represented as structured lot evidence, not a decorative QR code.
4. **National e-commerce policy explicitly links digital commerce with regional logistics.** The 2026–2030 national e-commerce plan includes logistics infrastructure, regional linkage and stronger e-commerce participation outside Hanoi/HCMC. A route-aware sourcing model fits this direction better than a generic nationwide storefront.
5. **Existing standards tooling suggests EPIC should integrate, not reinvent certification.** GS1 Vietnam's V-Standard product focuses on compliance checklists, certification data and traceability across growers, cooperatives and enterprises. EPIC's MVP should capture references to existing certifications / traceability records and only own marketplace-specific evidence.

### 2.2 Why vegetables first

- high reorder frequency gives a fast test of retention and anti-disintermediation value;
- standardized pack/grade fields can be piloted without pretending AI visual grading is authoritative;
- Lâm Đồng → HCMC is a coherent regional route for an initial logistics experiment;
- order aggregation can matter economically for multiple HCMC buyers;
- this avoids seafood cold-chain requirements and avoids the seasonality / high-value inspection complexity of an initial durian-focused marketplace.

## 3. Target users and jobs-to-be-done

### Buyer: HCMC restaurant / caterer / independent grocer

Needs to:

- find reliable weekly supply without calling many traders;
- specify quantity, grade, packing and delivery window;
- compare delivered commercial terms rather than only unit price;
- know what evidence exists for origin/quality;
- reject or claim against a materially non-conforming lot under a clear process;
- reorder from successful suppliers quickly.

### Supplier: verified cooperative / organized producer

Needs to:

- publish a real available lot and ready window rather than a generic SKU;
- reach repeat business demand;
- avoid negotiating each buyer from scratch;
- know the acceptance standard before dispatch;
- get predictable settlement after delivery/acceptance;
- build a performance history that improves future matching.

### EPIC operator

Needs to:

- verify legal/business identity and minimum operating information;
- normalize grade/pack definitions;
- match supply and demand;
- trigger QA sampling based on risk;
- coordinate or record delivery mode;
- resolve claims using evidence;
- observe per-order contribution margin and repeat behavior.

## 4. Core marketplace objects

### Supply lot

Required fields:

- commodity / variety;
- available quantity;
- packing unit and net weight;
- standardized declared grade;
- harvest / ready date window;
- coarse province / district or sourcing zone;
- offer price and minimum order quantity;
- photos captured for this lot, timestamped when operationally feasible;
- traceability / certification references if they exist;
- seller identity status;
- lot expiry / last order time.

A supply lot is not a permanent product listing. Inventory that cannot be trusted should expire automatically from the commercial workflow.

### Demand request

Required fields:

- commodity / acceptable variety;
- quantity;
- grade / specification;
- packing preference;
- required delivery date/time window;
- HCMC delivery zone;
- substitution allowed yes/no;
- target / maximum delivered price where buyer chooses to disclose it.

### Match / reservation

Represents committed quantity before identities/contact are fully exposed. It prevents the public catalog from becoming a lead-scraping directory while still allowing enough information for commercial comparison.

### QA record

Contains checklist version, sample size, photos, measured fields where relevant, inspector identity/partner, timestamp, pass/fail/conditional result and exception notes. It must not imply laboratory testing unless a laboratory was actually used.

### Fulfillment / settlement record

Records pickup/delivery mode, timestamps, receiving result, accepted quantity, rejected quantity/reason, claim outcome, supplier payable and marketplace fees.

## 5. End-to-end MVP transaction flow

1. **Supplier onboarding** — EPIC verifies organization/business identity, payment recipient details and operating contact. “Marketplace approved” must not be displayed as “food-safe certified” or “farm verified” unless the evidence supports that exact claim.
2. **Lot creation** — supplier creates a time-bounded lot with quantity, grade, packing, ready window, coarse origin and evidence photos / traceability references.
3. **Demand / discovery** — buyer searches lots or posts a demand request. Public map/search shows aggregated supply by coarse area only; exact farm location and direct personal contact are not public.
4. **Commercial match** — buyer selects a lot or EPIC proposes a match. Delivered terms show product subtotal, QA fee if any, delivery fee/estimate and platform fee where applicable.
5. **Reservation** — quantity is reserved for a bounded time. The platform discloses only the contact needed to execute the committed order.
6. **Risk-based QA** — first orders, new supplier/SKU combinations, high-value lots or triggered risk cases receive physical checklist sampling at pickup/consolidation. Repeat low-risk lots may use lighter evidence while preserving buyer claim rights.
7. **Fulfillment selection** — direct supplier → buyer delivery/pickup is allowed when it is cheaper. Consolidation is used only when route density makes it economical; the product must not force a hub for every order.
8. **Receiving** — buyer confirms received quantity/condition within a short, category-specific window and records any visible exception with photos. Silence after the bounded window follows the agreed acceptance rule; perishable claims cannot remain open indefinitely.
9. **Settlement** — payment and supplier payout must be executed through normal contracted payment/banking mechanisms. EPIC must **not** market self-custodied “escrow” unless the legal/payment structure actually supports it. Supplier payable is released after acceptance / claim resolution according to the commercial contract and payment-provider capabilities.
10. **Reorder** — buyer can repeat an accepted order with the same specification; supplier performance, fill rate, rejection history, delivery reliability and prior QA records remain visible inside the platform. This recurring operating history is the main retention asset.

## 6. Anti-disintermediation model

Hiding phone numbers is not a durable moat. Buyers and suppliers will eventually know each other. EPIC must earn repeat transactions by making on-platform repeat orders economically and operationally better.

The MVP retention bundle is:

- supplier performance history and fill-rate;
- lot-level QA / receiving evidence;
- standardized specifications and reorder templates;
- consolidated logistics when route density justifies it;
- one place for claims, adjustments and settlement records;
- buyer demand history and supplier matching;
- commercial identity / transaction history useful for future credit, insurance or procurement features, without promising those in MVP.

Do not rely on artificial identity concealment after fulfillment. Measure bypass explicitly.

## 7. Quality verification model

### Tier 0 — structured supplier declaration

Used for every lot. Captures grade, pack, quantity, origin zone, ready window and evidence. It is a declaration, not independent verification.

### Tier 1 — physical checklist sampling

Use for:

- first three transactions for a new supplier;
- first transaction for a new category/spec;
- material complaint history;
- high-value or high-risk lots;
- random audit sample of mature suppliers.

For vegetables, the checklist can include visible condition, approximate size/grade band, pack integrity, sample net weight, visible defects/damage and temperature only when relevant equipment/process exists. Sampling cannot guarantee every unit in the lot.

### Tier 2 — external certification / laboratory evidence

Only when the buyer, regulation or product risk requires it. EPIC should store references/results and pass through or explicitly price the cost. Do not build a lab network into the MVP.

### AI / sensors

Not MVP. Computer vision may later assist image triage or consistency checks, but it must not be the authoritative grade/safety decision until independently validated. IoT sensors are similarly unjustified before route economics and buyer demand are proven.

## 8. Logistics operating rule

The product should choose among three modes rather than force one architecture:

1. **Supplier direct delivery / buyer pickup** when a single order is large enough and route is efficient.
2. **EPIC-arranged third-party delivery** for a single order when the buyer accepts the delivered economics.
3. **Consolidated route** when multiple pickups / drops in a time window reduce cost per order and handling does not create unacceptable spoilage.

No owned warehouse or hub is required for MVP. A temporary cross-dock / partner collection point may be piloted only if route density data shows a clear benefit.

For each order record:

`delivery_cost / GMV`, distance, stops, pickup delay, delivery delay, spoilage/rejection attributed to transport and whether consolidation saved money versus direct delivery.

## 9. Revenue model to test

### MVP

- **Transaction commission:** test 3–5% of product GMV.
- **QA fee:** fixed per physically sampled lot, either paid explicitly or bundled only when order economics support it.
- **Logistics:** pass-through initially. Do not hide a logistics margin until EPIC has repeated lane-level cost evidence.

### Later, only after retention exists

- procurement subscription for multi-location buyers, scheduled orders, negotiated catalog or reporting;
- supplier premium tools;
- financing/insurance referral economics where legally and commercially appropriate.

Do not make subscriptions, ads, export services or data monetization necessary for MVP viability.

## 10. Unit economics sketch

The source of truth is an order-level ledger:

`platform revenue - payment cost - QA cost - logistics subsidy - claims/refund reserve - variable support/ops = contribution margin`

Supplier settlement is not platform revenue and product GMV is not margin.

### Base pilot example — illustrative assumptions, not forecasts

A recurring buyer order:

- product GMV: **6,000,000 VND**;
- marketplace commission at 5%: **300,000 VND revenue**;
- charged QA fee when sampled: **100,000 VND revenue**;
- payment/settlement cost assumption: **48,000 VND** (0.8% of GMV; replace with contracted actual);
- physical QA labor/travel allocation: **120,000 VND**;
- claims/spoilage reserve: **60,000 VND** (1% of GMV until real data exists);
- variable support/ops allocation: **20,000 VND**;
- logistics: **pass-through, 0 VND subsidy / margin in this example**.

Illustrative contribution margin:

`300,000 + 100,000 - 48,000 - 120,000 - 60,000 - 20,000 = 152,000 VND`, or **2.53% of GMV** before fixed overhead.

At a 3% commission with the same charged QA fee, contribution falls to about **32,000 VND (0.53% GMV)**. If QA cannot be charged and its real cost remains 120,000 VND, the same order is unattractive at low commission. This is why the pilot must test order size, QA frequency and route density together rather than optimizing GMV alone.

### Required sensitivity rows

For every fulfilled order / week, report at minimum:

- GMV and accepted GMV;
- commission rate / amount;
- QA fee revenue and actual QA cost;
- payment cost;
- delivery cost, delivery charge and subsidy;
- refunds / credits / spoilage;
- variable support cost;
- contribution margin VND and % GMV;
- buyer acquisition source / variable acquisition cost where measurable;
- whether the buyer reordered within 30 days.

## 11. MVP product requirements

### Buyer

- browse available lots by commodity, grade, ready window and coarse source zone;
- post demand request;
- compare commercial terms including pack size and delivery/QA charges;
- reserve / commit quantity;
- see QA evidence and supplier performance appropriate to the stage;
- receive, accept, partially reject or open a claim with reason/evidence;
- reorder from history.

### Supplier

- onboarding / identity review state;
- create and expire lots;
- update available quantity until reserved;
- accept match / order;
- see QA exceptions and receiving result;
- see settlement calculation and performance history.

### Operator

- supplier review;
- grade/spec templates;
- matching / reservation management;
- QA task + checklist capture;
- fulfillment mode / delivery record;
- claims adjustment;
- settlement ledger;
- unit-economics dashboard / export.

### Map / location privacy

The public or pre-commit buyer view may show province/district or aggregated density cells. Never expose precise farm GPS, home address or direct personal contacts solely to make a map feel complete. Exact pickup points are shared only with the parties / logistics operator who need them for a committed fulfillment.

## 12. Explicit non-MVP

- all-agriculture nationwide marketplace;
- seafood / cold-chain marketplace;
- export marketplace;
- consumer livestream store;
- exact farm map;
- owned warehouse network;
- commodity exchange / auctions as a core model;
- self-custodied escrow;
- real-time IoT farm sensor network;
- AI as authoritative grading / food-safety verification;
- automated supplier “certification” without an actual certifying authority;
- lending / insurance underwriting.

## 13. Pilot design

Run a **6–8 week commercial pilot** only after the separate EPIC high-tech commerce launch gate permits implementation / operations.

Recommended pilot shape:

- 3–5 organized suppliers/cooperatives;
- 10–15 HCMC business buyers recruited deliberately, not an open consumer launch;
- 4–8 standardized vegetable SKUs;
- one primary sourcing corridor (Lâm Đồng → HCMC);
- target at least 20 fulfilled orders before deciding whether the business model is promising;
- instrument every order from lot declaration through contribution margin and reorder.

## 14. Go / kill / pivot criteria

These are starting thresholds. Change them only with recorded evidence, not because the pilot is missing targets.

### Continue / scale discovery if by ~20–40 fulfilled orders

- at least **5 repeat business buyers**;
- at least **40% of activated buyers** place a second order within 30 days where category cadence permits;
- accepted fill rate at least **90%** of committed quantity;
- fulfilled-lot grade/weight/condition dispute rate **≤8%**;
- transport-attributed spoilage/rejection **≤5%**;
- QA + payment + variable support cost can be held to **≤5% of GMV** on normal orders without hiding subsidy;
- delivered logistics cost is normally **≤8% of GMV on consolidated routes**, or the buyer demonstrably accepts the direct-delivery economics;
- median contribution margin reaches **≥2% of GMV before fixed overhead** on the target order profile;
- supplier available quantity / ready windows are accurate enough that stale inventory does not materially impair matching.

### Kill or redesign the initial model if

- fewer than 5 repeat buyers after the first 20 fulfilled orders;
- median order value stays too low for QA + delivery to be economical even after sensible batching;
- dispute rate remains **>10%** after the first process corrections;
- transport-attributed spoilage/rejection remains **>10%**;
- platform contribution remains negative without continuing discount/logistics subsidy;
- more than roughly **30% of repeatable matched volume** demonstrably bypasses the platform because QA/logistics/records do not create recurring value;
- suppliers cannot maintain truthful lot quantity / ready windows;
- operational QA cost or turnaround makes the chosen category unsuitable.

A failed vegetable corridor is evidence to change category/segment/process; it is not a reason to immediately expand to “all agriculture.”

## 15. Reconciliation with the current Mercur EPIC demo

GitHub `main` currently contains the September 7 Mercur-based EPIC agriculture demo. Its validated capabilities include seller offers, catalog, multi-seller cart/order grouping, illustrative 5% commission, coarse sourcing regions and a manual test checkout. The demo explicitly states that there is no production QA, supplier verification, logistics integration, escrow, real payment capture/payout, AI grading or map.

Therefore:

### Reusable conceptually later

- seller / offer / inventory primitives;
- buyer catalog and offer comparison;
- coarse source-region presentation;
- cart/order grouping;
- commission primitive;
- seller/operator surfaces.

### Must not be treated as already solved

- lot lifecycle / harvest-ready inventory semantics;
- demand posting / matching;
- supplier verification policy;
- production payment / payout arrangement;
- claims / partial acceptance;
- QA checklist and evidence workflow;
- delivery orchestration / route consolidation;
- traceability integration;
- contribution-margin reporting;
- retry-safe production checkout (the demo validation records an upstream duplicate-completion defect).

No code changes for these areas should be started under SAN-189. This document is the discovery artifact and decision boundary.

## 16. Evidence and source notes

Official / primary-oriented sources checked for this discovery:

1. World Bank Group, **AgriConnect FAQ: Agribusiness, Food Systems, and Agricultural Innovation**, updated 2026-06-30 — aggregation, producer organizations, logistics, market access, food safety and traceability:
   https://www.worldbank.org/ext/en/agriconnect/faq
2. Vietnam Ministry of Industry and Trade, **Ra mắt nền tảng “Chợ đầu mối nông sản trực tuyến Việt Nam” tại Singapore**, 2026-04-18 — qualified supply, quantity assurance, traceability and order aggregation:
   https://moit.gov.vn/tin-tuc/ra-mat-nen-tang-cho-dau-moi-nong-san-truc-tuyen-viet-nam-tai-singapore.html
3. Vietnam Ministry of Industry and Trade, **Kế hoạch tổng thể phát triển thương mại điện tử quốc gia giai đoạn 2026–2030** — logistics infrastructure, regional linkage, payments and e-commerce development:
   https://moit.gov.vn/tin-tuc/phe-duyet-ke-hoach-tong-the-phat-trien-thuong-mai-dien-tu-quoc-gia-giai-doan-2026-2030.html
4. National Standards / Quality authority, **Truy xuất nguồn gốc – công cụ nâng giá trị nông sản TP. Hồ Chí Minh**, 2026-08-22 — HCMC 2026–2030 agricultural traceability direction:
   https://tcvn.gov.vn/truy-xuat-nguon-goc-cong-cu-nang-gia-tri-nong-san-tp-ho-chi-minh/22/08/2026/
5. GS1 Vietnam, **V-Standard** — current compliance / traceability tooling for growers, cooperatives and enterprises:
   https://vstandard.gs1.gov.vn/
6. Repository authority: `sangtrx/epic-agri-marketplace`, current September 7 demo README / VALIDATION and commit history on `main` as reviewed 2026-09-09.

## 17. Decision after SAN-189

Discovery output is sufficient for a business review. The next decision is not “build the marketplace.” It is:

1. accept / revise the Lâm Đồng → HCMC B2B vegetable beachhead;
2. validate 3–5 suppliers and 10–15 business buyers through interviews / commercial commitments;
3. obtain actual lane delivery quotes and QA labor cost;
4. replace the illustrative unit-economics assumptions with contracted / observed values;
5. only then authorize implementation after the existing high-tech commerce launch gate is cleared or explicitly reprioritized.
