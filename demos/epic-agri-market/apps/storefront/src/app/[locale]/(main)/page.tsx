import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { OfferCard } from "@/components/organisms/OfferCard/OfferCard";
import { listOffers } from "@/lib/data/offers";
import type { StoreOffer } from "@/lib/helpers/buybox";

export const metadata: Metadata = {
 title: "Source Vietnam", description: "EPIC Agri Market — a Vietnam agriculture marketplace concept for trade buyers and everyday kitchens.",
 robots: { index: false, follow: false },
};
export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
 const { locale } = await params;
 const { offers } = await listOffers({ countryCode: locale, limit: 50 });
 const sellers = [...new Map(offers.filter(o => o.seller).map(o => [o.seller_id, { ...o.seller!, region: String(o.metadata?.supply_region || "Vietnam"), province: String(o.metadata?.province || "") }])).values()];
 return <main className="epic-home">
  <section className="epic-hero">
   <div className="epic-hero-copy">
    <p className="epic-eyebrow">VIETNAM, FROM SOURCE TO MARKET</p>
    <h1>Good food.<br />Stronger connections.</h1>
    <p className="epic-intro">Discover regional harvests and compare seller offers. From the family kitchen to your next wholesale order.</p>
    <div className="epic-actions"><a className="epic-button" href="#market">Explore the market <span aria-hidden>↗</span></a><Link className="epic-text-link" href={`${process.env.NEXT_PUBLIC_VENDOR_URL || "http://localhost:9107/seller"}/register`}>Become a seller →</Link></div>
    <div className="epic-hero-note"><span className="epic-dot" /> September sourcing edition <span>07.09.2026</span></div>
   </div>
   <div className="epic-hero-photo"><Image src="/images/agri/hero.jpg" alt="Agricultural landscape, illustrating the connection between growing regions and markets" fill priority sizes="(min-width: 900px) 50vw, 100vw" />
    <div className="epic-photo-caption"><span>ROOTED IN REGIONS</span><strong>A world of produce.<br />One connected market.</strong></div>
   </div>
  </section>
  <div className="epic-facts"><div><strong>{sellers.length.toString().padStart(2,"0")}</strong><span>Regional demo sellers</span></div><div><strong>{offers.length.toString().padStart(2,"0")}</strong><span>Seller offers to explore</span></div><div><strong>B2B + B2C</strong><span>Trade crates & kitchen packs</span></div><div><strong>VND</strong><span>Clear pricing per pack</span></div></div>
  <section id="market" className="epic-section">
   <div className="epic-section-heading"><div><p className="epic-eyebrow">THE SEPTEMBER MARKET</p><h2>Find your next good source.</h2></div><Link className="epic-text-link" href={`/${locale}/categories`}>Browse all products ↗</Link></div>
   <p className="epic-section-note">Fruit, vegetables, seafood and spices. Compare origin, pack size, declared grade and availability.</p>
   {offers.length ? <div className="epic-offer-grid">{offers.map(o => <OfferCard key={o.id} offer={o as StoreOffer} locale={locale} className="epic-offer" />)}</div> : <div role="status" className="epic-empty">The market has no available offers yet. Start the local backend and run the EPIC demo seed, then refresh.</div>}
  </section>
  <section className="epic-section epic-regions"><div className="epic-section-heading"><div><p className="epic-eyebrow">MEET THE GROWING REGIONS</p><h2>Local character. Shared opportunity.</h2></div><p>Explore fictional cooperatives and food suppliers<br className="hidden md:block" /> from three distinct Vietnamese regions.</p></div>
   <div className="epic-seller-grid">{sellers.map((s,i) => <Link href={`/${locale}/sellers/${s.handle}`} className="epic-seller" key={s.id}><span className="epic-seller-number">0{i+1} / {s.region}</span><h3>{s.name}</h3><p>{s.province}</p><span className="epic-text-link">Explore seller offers ↗</span></Link>)}</div>
  </section>
  <section className="epic-demo-note"><div><p className="epic-eyebrow">A MARKETPLACE CONCEPT, OPEN TO POSSIBILITY</p><h2>Built around real marketplace workflows.</h2></div><p>This demonstration uses fictional suppliers and illustrative lots. Grades are seller-declared. No inspection, supplier verification, escrow, carrier booking or payouts are provided. Checkout uses a manual test payment method.</p></section>
 </main>;
}
