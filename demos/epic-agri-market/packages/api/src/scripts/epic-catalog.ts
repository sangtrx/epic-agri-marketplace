/** Fictional Sep 7, 2026 demonstration fixtures. No private contacts or farm coordinates. */
export const sellers = [
  { handle: "mekong-harvest", name: "Mekong Harvest Cooperative", email: "mekong@epic.example", province: "Đồng Tháp", district: "Cao Lãnh area", region: "Mekong Delta", description: "Seasonal orchard fruit for retailers, kitchens and wholesale buyers." },
  { handle: "highland-green", name: "Highland Green Cooperative", email: "highland@epic.example", province: "Lâm Đồng", district: "Đà Lạt area", region: "Central Highlands", description: "Cool-climate vegetables, orchard fruit and pantry crops." },
  { handle: "central-coast", name: "Central Coast Foods", email: "coast@epic.example", province: "Khánh Hòa", district: "Nha Trang area", region: "South Central Coast", description: "Seafood lots for restaurant and retail sourcing." },
] as const;
export const products = [
  { handle: "ri6-durian", title: "Ri6 durian · 10 kg crate", category: "Fresh fruit", pack_kg: 10, image: "durian.jpg", description: "Whole Ri6 durian in a 10 kg trade crate. Compare seller lots for origin, declared grade and lead time. Variety and grade are illustrative seller declarations, not inspection results." },
  { handle: "cat-chu-mango", title: "Cát Chu mango · 10 kg crate", category: "Fresh fruit", pack_kg: 10, image: "mango.jpg", description: "Cát Chu mango in a 10 kg crate for fruit counters and professional kitchens. Illustrative seasonal availability; confirm ripeness and packing with the seller before any real purchase." },
  { handle: "dalat-vegetables", title: "Đà Lạt vegetables · 5 kg box", category: "Vegetables", pack_kg: 5, image: "vegetables.jpg", description: "A 5 kg seasonal vegetable box: broccoli and leafy greens. A smaller pack for households, cafés and sampling before wholesale sourcing. Contents are illustrative." },
  { handle: "whiteleg-shrimp", title: "Whiteleg shrimp · 2 kg pack", category: "Seafood", pack_kg: 2, image: "shrimp.jpg", description: "A 2 kg frozen whiteleg shrimp pack, indicative size 40–50 pieces/kg. Cold-chain handling must be arranged separately; no live logistics service is connected." },
  { handle: "coastal-squid", title: "Coastal squid · 2 kg pack", category: "Seafood", pack_kg: 2, image: "squid.jpg", description: "A 2 kg frozen squid pack for kitchen sourcing. Seller-declared trade grade. Images illustrate the commodity and are not photographs of a specific supplier lot." },
  { handle: "black-pepper", title: "Black pepper · 1 kg bag", category: "Spices", pack_kg: 1, image: "pepper.jpg", description: "Whole black pepper in a 1 kg pantry bag. Indicative 500 g/l trade specification; no laboratory, residue or quality certification is asserted." },
] as const;
export const offers = [
  { seller: "mekong-harvest", product: "ri6-durian", price_vnd: 950000, packs: 80, grade: "A · seller-declared", lead_days: 3, window: "07–20 Sep 2026" },
  { seller: "highland-green", product: "ri6-durian", price_vnd: 990000, packs: 65, grade: "A · seller-declared", lead_days: 2, window: "07–18 Sep 2026" },
  { seller: "mekong-harvest", product: "cat-chu-mango", price_vnd: 380000, packs: 120, grade: "A · seller-declared", lead_days: 2, window: "07–21 Sep 2026" },
  { seller: "highland-green", product: "dalat-vegetables", price_vnd: 145000, packs: 140, grade: "Mixed retail · seller-declared", lead_days: 1, window: "07–14 Sep 2026" },
  { seller: "central-coast", product: "whiteleg-shrimp", price_vnd: 320000, packs: 90, grade: "40–50 pieces/kg · indicative", lead_days: 2, window: "Frozen stock · Sep 2026" },
  { seller: "central-coast", product: "coastal-squid", price_vnd: 360000, packs: 65, grade: "Kitchen grade · seller-declared", lead_days: 2, window: "Frozen stock · Sep 2026" },
  { seller: "highland-green", product: "black-pepper", price_vnd: 185000, packs: 100, grade: "500 g/l · indicative", lead_days: 3, window: "Stored harvest · Sep 2026" },
] as const;
export function lotMetadata(offer: (typeof offers)[number]) {
 const seller = sellers.find(s => s.handle === offer.seller)!;
 const product = products.find(p => p.handle === offer.product)!;
 return { demo: true, province: seller.province, district: seller.district, supply_region: seller.region,
  grade: offer.grade, pack_kg: product.pack_kg, minimum_order_packs: 1,
  available_quantity_kg_at_seed: offer.packs * product.pack_kg,
  availability_window: offer.window, lead_time_days: offer.lead_days,
  quantity_unit: "pack", inspection_status: "Not inspected — fictional demo lot" };
}
