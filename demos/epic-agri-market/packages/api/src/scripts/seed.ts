import type { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { ProductStatus, AttributeType, CommissionRateType, type CreateProductDTO, type CreateOfferDTO } from "@mercurjs/types";
import { approveSellerWorkflow, createSellerAccountWorkflow, createSellerStockLocationsWorkflow,
 createSellerShippingOptionsWorkflow, createProductsWorkflow, createOffersWorkflow,
 createProductAttributesWorkflow, createCommissionRatesWorkflow, updateCommissionRatesWorkflow } from "@mercurjs/core/workflows";
import { createApiKeysWorkflow, createRegionsWorkflow, createSalesChannelsWorkflow,
 createTaxRegionsWorkflow, createProductCategoriesWorkflow, createShippingProfilesWorkflow,
 linkSalesChannelsToApiKeyWorkflow, linkSalesChannelsToStockLocationWorkflow,
 createLocationFulfillmentSetWorkflow, createServiceZonesWorkflow, updateStoresWorkflow,
 createUsersWorkflow } from "@medusajs/medusa/core-flows";
import { writeFileSync } from "node:fs";
import path from "node:path";
import { sellers, products, offers, lotMetadata } from "./epic-catalog";

/** Fresh, dedicated demo databases only. Never deletes or rewrites existing catalog data. */
export default async function seed({ container }: ExecArgs) {
 if (process.env.EPIC_DEMO !== "true" || !process.env.EPIC_DEMO_PASSWORD) {
  throw new Error("Run demo:configure first. EPIC seeding requires an explicit local demo configuration.");
 }
 const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
 const query = container.resolve(ContainerRegistrationKeys.QUERY);
 const link = container.resolve(ContainerRegistrationKeys.LINK);
 const auth = container.resolve(Modules.AUTH);
 const storeService = container.resolve(Modules.STORE);
 const [store] = await storeService.listStores();
 if (store.metadata?.epic_seed === "2026-09-07-complete") {
  logger.info("EPIC demo already seeded; no data changed."); return;
 }
 const { data: existing } = await query.graph({ entity: "seller", fields: ["id"] });
 const { data: existingProducts } = await query.graph({ entity: "product", fields: ["id"] });
 if (existing.length || existingProducts.length || store.metadata?.epic_seed) {
  throw new Error("Seed requires a fresh dedicated database. Existing or incomplete data was preserved; use a new demo database.");
 }
 await updateStoresWorkflow(container).run({ input: { selector: { id: store.id }, update: {
  name: "EPIC Agri Market", metadata: { ...store.metadata, epic_seed: "started" },
  supported_currencies: [{ currency_code: "vnd", is_default: true }],
 } } });
 const { result: [channel] } = await createSalesChannelsWorkflow(container).run({
  input: { salesChannelsData: [{ name: "EPIC Vietnam marketplace" }] }
 });
 await updateStoresWorkflow(container).run({ input: { selector: { id: store.id },
  update: { default_sales_channel_id: channel.id } } });
 const { result: [region] } = await createRegionsWorkflow(container).run({ input: { regions: [{
  name: "Vietnam", currency_code: "vnd", countries: ["vn"], payment_providers: ["pp_system_default"],
 }] } });
 await createTaxRegionsWorkflow(container).run({ input: [{ country_code: "vn", provider_id: "tp_system" }] });
 const { result: [key] } = await createApiKeysWorkflow(container).run({ input: { api_keys: [{
  title: "EPIC demo storefront", type: "publishable", created_by: "",
 }] } });
 await linkSalesChannelsToApiKeyWorkflow(container).run({ input: { id: key.id, add: [channel.id] } });
 const { result: categories } = await createProductCategoriesWorkflow(container).run({ input: {
  product_categories: [...new Set(products.map(p => p.category))].map((name, rank) => ({ name, is_active: true, rank })),
 } });
 const { result: [profile] } = await createShippingProfilesWorkflow(container).run({
  input: { data: [{ name: "EPIC demonstration shipping", type: "default" }] }
 });
 const contexts = new Map<string, { id: string; memberId: string; locationId: string }>();
 for (const config of sellers) {
  const registration = await auth.register("emailpass", { body: { email: config.email, password: process.env.EPIC_DEMO_PASSWORD } });
  if (!registration.success || !registration.authIdentity) throw new Error("Demo seller account registration failed.");
  const { result: seller } = await createSellerAccountWorkflow(container).run({ input: {
   auth_identity_id: registration.authIdentity.id, member_email: config.email,
   first_name: "Demo", last_name: "Seller", seller: {
    name: config.name, handle: config.handle, email: config.email, currency_code: "vnd",
    description: `${config.description} ${config.province} · ${config.region}. Fictional demonstration seller; not verified.`,
    metadata: { demo: true, province: config.province, district: config.district, supply_region: config.region },
   },
  } });
  await approveSellerWorkflow(container).run({ input: { seller_id: seller.id } });
  const { data: [member] } = await query.graph({ entity: "member", fields: ["id"], filters: { email: config.email } });
  const { result: [location] } = await createSellerStockLocationsWorkflow(container).run({ input: {
   seller_id: seller.id, locations: [{ name: `${config.province} demo stock`,
    address: { city: config.province, country_code: "VN", address_1: "Fictional demo collection point" } }],
  } });
  await link.create({ [Modules.STOCK_LOCATION]: { stock_location_id: location.id },
   [Modules.FULFILLMENT]: { fulfillment_provider_id: "manual_manual" } });
  await linkSalesChannelsToStockLocationWorkflow(container).run({ input: { id: location.id, add: [channel.id] } });
  if (!contexts.size) await updateStoresWorkflow(container).run({ input: { selector: { id: store.id },
   update: { default_location_id: location.id } } });
  await createLocationFulfillmentSetWorkflow(container).run({ input: { location_id: location.id,
   fulfillment_set_data: { name: `${config.name} demonstration delivery`, type: "shipping" } } });
  const { data: [withSet] } = await query.graph({ entity: "stock_location", fields: ["id", "fulfillment_sets.id"], filters: { id: location.id } });
  const setId = withSet.fulfillment_sets?.[0]?.id;
  if (!setId) throw new Error("Demo fulfillment set missing.");
  const { result: [zone] } = await createServiceZonesWorkflow(container).run({ input: { data: [{
   fulfillment_set_id: setId, name: `${config.name} Vietnam`, geo_zones: [{ country_code: "vn", type: "country" }],
  }] } });
  await createSellerShippingOptionsWorkflow(container).run({ input: { seller_id: seller.id, shipping_options: [{
   name: "Demo delivery · no carrier connected", price_type: "flat", provider_id: "manual_manual",
   service_zone_id: zone.id, shipping_profile_id: profile.id,
   type: { label: "Demo delivery", description: "Illustrative fee only. No logistics booking or cold-chain service.", code: "demo-delivery" },
   prices: [{ currency_code: "vnd", amount: 30000 }, { region_id: region.id, amount: 30000 }],
   rules: [{ attribute: "enabled_in_store", value: "true", operator: "eq" }, { attribute: "is_return", value: "false", operator: "eq" }],
  }] } });
  contexts.set(config.handle, { id: seller.id, memberId: member.id, locationId: location.id });
 }
 const imageBase = `${process.env.EPIC_STOREFRONT_URL || "http://localhost:3107"}/images/agri`;
 const { result: [packAttribute] } = await createProductAttributesWorkflow(container).run({ input: { attributes: [{
  name: "Pack", handle: "pack", type: AttributeType.MULTI_SELECT, is_variant_axis: true, is_filterable: true,
  values: ["1 kg", "2 kg", "5 kg", "10 kg"].map((name, rank) => ({ name, rank })),
 }] } });
 const { data: [packWithValues] } = await query.graph({ entity: "product_attribute", fields: ["id", "values.id", "values.name"], filters: { id: packAttribute.id } });
 const catalog: CreateProductDTO[] = products.map(p => ({
  title: p.title, handle: p.handle, description: p.description, status: ProductStatus.PUBLISHED,
  category_ids: [categories.find(c => c.name === p.category)!.id], weight: p.pack_kg * 1000,
  thumbnail: `${imageBase}/${p.image}`, images: [{ url: `${imageBase}/${p.image}` }],
  metadata: { demo: true, pack_kg: p.pack_kg, quantity_unit: "pack" },
  attributes: [{ id: packAttribute.id, value_ids: [packWithValues.values.find(v => v?.name === `${p.pack_kg} kg`)!.id] }],
  variants: [{ title: `${p.pack_kg} kg pack`, sku: `EPIC-${p.handle}`, options: { Pack: `${p.pack_kg} kg` } }],
 }));
 await createProductsWorkflow(container).run({ input: { created_by: contexts.get(sellers[0].handle)!.memberId, products: catalog } });
 const { data: catalogRows } = await query.graph({ entity: "product", fields: ["id", "handle", "variants.id"],
  filters: { handle: products.map(p => p.handle) } });
 const listings: CreateOfferDTO[] = offers.map(o => {
  const seller = contexts.get(o.seller)!;
  const product = catalogRows.find(p => p.handle === o.product)!;
  const sku = `EPIC-${o.seller}-${o.product}`;
  return { seller_id: seller.id, created_by: seller.memberId, variant_id: product.variants[0].id,
   shipping_profile_id: profile.id, sku, metadata: lotMetadata(o),
   inventory_items: [{ sku, stock_levels: [{ location_id: seller.locationId, stocked_quantity: o.packs }] }],
   prices: [{ amount: o.price_vnd, currency_code: "vnd" }],
  };
 });
 await createOffersWorkflow(container).run({ input: { offers: listings } });
 const { data: defaults } = await query.graph({ entity: "commission_rate", fields: ["id"], filters: { is_default: true } });
 const commission = { name: "EPIC demo commission · 5%", type: CommissionRateType.PERCENTAGE,
  value: 5, is_default: true, is_enabled: true, include_tax: false, include_shipping: false };
 if (defaults[0]) await updateCommissionRatesWorkflow(container).run({ input: [{ id: defaults[0].id, ...commission }] });
 else await createCommissionRatesWorkflow(container).run({ input: [{ code: "epic-demo", ...commission }] });
 const adminEmail = "operator@epic.example";
 const adminRegistration = await auth.register("emailpass", { body: { email: adminEmail, password: process.env.EPIC_DEMO_PASSWORD } });
 if (!adminRegistration.success || !adminRegistration.authIdentity) throw new Error("Demo operator registration failed.");
 const { result: [admin] } = await createUsersWorkflow(container).run({ input: { users: [{ email: adminEmail, first_name: "EPIC", last_name: "Operator" }] } });
 await auth.updateAuthIdentities({ id: adminRegistration.authIdentity.id, app_metadata: { user_id: admin.id } });
 // The publishable store key is written privately, never printed. No payment secrets are required.
 writeFileSync(path.resolve(process.cwd(), "../../apps/storefront/.env.local"), [
  `MEDUSA_BACKEND_URL=${process.env.EPIC_BACKEND_URL || "http://localhost:9107"}`,
  `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${key.token}`,
  `NEXT_PUBLIC_BASE_URL=${process.env.EPIC_STOREFRONT_URL || "http://localhost:3107"}`,
  `NEXT_PUBLIC_VENDOR_URL=${process.env.EPIC_BACKEND_URL || "http://localhost:9107"}/seller`,
  "NEXT_PUBLIC_DEFAULT_REGION=vn", "NEXT_PUBLIC_SITE_NAME=EPIC Agri Market",
  "NEXT_PUBLIC_SITE_DESCRIPTION=Vietnam agriculture marketplace concept",
 ].join("\n") + "\n", { mode: 0o600 });
 await updateStoresWorkflow(container).run({ input: { selector: { id: store.id }, update: {
  metadata: { ...store.metadata, epic_seed: "2026-09-07-complete" },
 } } });
 logger.info("EPIC demo seeded: 3 sellers, 6 products, 7 offers, Vietnam/VND, 5% commission. Local access is in .demo/access.json.");
}
