import assert from "node:assert/strict";
import type { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { sellers } from "./epic-catalog";

/** Uses only this demo's generated local credentials. Never logs tokens, keys or passwords. */
export default async function verify({ container }: ExecArgs) {
 assert.equal(process.env.EPIC_DEMO, "true");
 const query = container.resolve(ContainerRegistrationKeys.QUERY);
 const base = process.env.EPIC_BACKEND_URL!;
 assert.equal(new URL(base).hostname, "localhost");
 const { data: [key] } = await query.graph({ entity: "api_key", fields: ["token"], filters: { title: "EPIC demo storefront" } });
 const publicHeaders = { "x-publishable-api-key": key.token };
 async function request(route: string, body?: unknown, headers: Record<string, string> = publicHeaders) {
  const response = await fetch(`${base}${route}`, { method: body ? "POST" : "GET", headers: { ...headers, "content-type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
  assert.ok(response.ok, `${route.split("?")[0]} returned ${response.status}`);
  return response.json();
 }
 assert.equal((await fetch(`${base}/health`)).status, 200);
 const { regions } = await request("/store/regions");
 const region = regions.find((r: any) => r.currency_code === "vnd"); assert.ok(region);
 const { products } = await request("/store/products?limit=50"); assert.equal(products.length, 6);
 const { offers } = await request(`/store/offers?region_id=${region.id}&fields=%2Bcalculated_price,%2Binventory_quantity&limit=50`);
 assert.equal(offers.length, 7);
 for (const offer of offers) { assert.ok(offer.calculated_price?.calculated_amount > 0); assert.ok(offer.inventory_quantity > 0); assert.equal(offer.metadata.demo, true); }
 const operator = await request("/auth/user/emailpass", { email: "operator@epic.example", password: process.env.EPIC_DEMO_PASSWORD }, {});
 const adminHeaders = { authorization: `Bearer ${operator.token}` };
 const { sellers: allSellers } = await request("/admin/sellers?limit=50", undefined, adminHeaders); assert.equal(allSellers.length, 3);
 const { commission_rates: rates } = await request("/admin/commission-rates", undefined, adminHeaders);
 assert.ok(rates.some((r: any) => r.is_default && Number(r.value) === 5));
 for (const fixture of sellers) {
  const seller = allSellers.find((s: any) => s.handle === fixture.handle); assert.ok(seller);
  const login = await request("/auth/member/emailpass", { email: fixture.email, password: process.env.EPIC_DEMO_PASSWORD }, {});
  const vendorHeaders = { authorization: `Bearer ${login.token}`, "x-seller-id": seller.id };
  const mine = await request("/vendor/offers?limit=50", undefined, vendorHeaders);
  assert.ok(mine.offers.length > 0); assert.ok(mine.offers.every((o: any) => o.seller_id === seller.id));
  const other = allSellers.find((s: any) => s.id !== seller.id);
  const denied = await fetch(`${base}/vendor/offers`, { headers: { ...vendorHeaders, "x-seller-id": other.id } });
  assert.ok([400, 403].includes(denied.status));
  assert.equal((await denied.json()).type, "not_allowed");
 }
 console.log("PASS: health, Vietnam/VND, 6 products, 7 priced/in-stock offers, operator login, 5% commission, all seller logins and seller isolation.");
 const picked = [offers[0], offers.find((o: any) => o.seller_id !== offers[0].seller_id)];
 const address = { first_name: "Demo", last_name: "Buyer", address_1: "Fictional demonstration address", city: "Nha Trang", country_code: "vn", postal_code: "650000" };
 const { cart } = await request("/store/carts", { region_id: region.id, email: "buyer@epic.example", shipping_address: address, billing_address: address });
 for (const offer of picked) await request(`/store/carts/${cart.id}/line-items`, { offer_id: offer.id, quantity: 1 });
 const { cart: withItems } = await request(`/store/carts/${cart.id}`); assert.equal(withItems.items.length, 2);
 const { shipping_options } = await request(`/store/shipping-options?cart_id=${cart.id}`);
 const options: any[] = Array.isArray(shipping_options) ? shipping_options : Object.values(shipping_options).flat();
 assert.equal(options.length, 2);
 for (const option of options) await request(`/store/carts/${cart.id}/shipping-methods`, { option_id: option.id });
 const { payment_collection } = await request("/store/payment-collections", { cart_id: cart.id });
 await request(`/store/payment-collections/${payment_collection.id}/payment-sessions`, { provider_id: "pp_system_default" });
 const completed = await request(`/store/carts/${cart.id}/complete`, {});
 assert.equal(completed.type, "order_group");
 const { data: [group] } = await query.graph({ entity: "order_group", fields: ["id", "orders.id"], filters: { id: completed.order_group.id } });
 assert.ok(group.orders);
 assert.equal(group.orders.length, 2);
 for (const order of group.orders) {
  assert.ok(order);
  const lines = await request(`/admin/orders/${order.id}/commission-lines`, undefined, adminHeaders);
  assert.ok(lines.commission_lines.length > 0);
  assert.ok(lines.commission_lines.some((line: any) => Number(line.amount) > 0));
 }
 console.log("PASS: multi-seller cart, manual test checkout, two seller orders, commission lines. Completion is intentionally submitted once; see VALIDATION.md for the upstream retry defect. No real payment or delivery.");
}
