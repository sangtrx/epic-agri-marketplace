import { test, expect } from "bun:test";
import { sellers, products, offers, lotMetadata } from "../packages/api/src/scripts/epic-catalog";
test("every seller has regional, purchasable offers with consistent pack quantities", () => {
 expect(new Set(sellers.map(s => s.region)).size).toBeGreaterThanOrEqual(3);
 for (const s of sellers) { expect(s.email.endsWith("@epic.example")).toBe(true); expect(offers.some(o => o.seller === s.handle)).toBe(true); }
 for (const o of offers) {
  expect(sellers.some(s => s.handle === o.seller)).toBe(true);
  const p = products.find(p => p.handle === o.product)!;
  expect(p).toBeDefined(); expect(o.price_vnd).toBeGreaterThan(0); expect(Number.isInteger(o.price_vnd)).toBe(true);
  expect(o.packs).toBeGreaterThan(0);
  const m = lotMetadata(o); expect(m.available_quantity_kg_at_seed).toBe(o.packs * p.pack_kg);
  expect(m.minimum_order_packs).toBe(1); expect(m.lead_time_days).toBeGreaterThan(0);
  expect(m.inspection_status).toContain("Not inspected");
  expect(Object.keys(m).some(k => /latitude|longitude|phone|address|contact/.test(k))).toBe(false);
 }
});
test("durian uses a shared master product with independent seller price and stock", () => {
 const competing = offers.filter(o => o.product === "ri6-durian");
 expect(competing).toHaveLength(2); expect(new Set(competing.map(o => o.seller)).size).toBe(2);
 expect(new Set(competing.map(o => o.price_vnd)).size).toBe(2);
 expect(new Set(offers.map(o => `${o.seller}:${o.product}`)).size).toBe(offers.length);
});
