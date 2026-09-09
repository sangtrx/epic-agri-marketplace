import {
  HomeCategories,
  HomeProductSection,
} from "@/components/sections"

import type { Metadata } from "next"
import Link from "next/link"
import { headers } from "next/headers"
import Script from "next/script"
import { listRegions } from "@/lib/data/regions"
import {
  buildHreflangAlternates,
  getStorefrontLocales,
  toHreflang,
} from "@/lib/helpers/hreflang"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  const headersList = await headers()
  const host = headersList.get("host")
  const protocol = headersList.get("x-forwarded-proto") || "https"
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`

  let locales: string[] = []
  try {
    locales = getStorefrontLocales(await listRegions())
  } catch {
    locales = [locale]
  }

  const { canonical, languages } = buildHreflangAlternates({
    baseUrl,
    path: "",
    locale,
    locales,
  })

  const title = "EPIC Agri Market"
  const description =
    "Explore the EPIC agricultural marketplace demo: produce listings, categories and marketplace sellers in one buyer experience."

  return {
    title,
    description,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-video-preview": -1,
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: process.env.NEXT_PUBLIC_SITE_NAME || "EPIC Agri Market",
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  }
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  const headersList = await headers()
  const host = headersList.get("host")
  const protocol = headersList.get("x-forwarded-proto") || "https"
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "EPIC Agri Market"

  return (
    <main className="agri-home">
      <Script
        id="ld-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: siteName,
            url: `${baseUrl}/${locale}`,
            inLanguage: toHreflang(locale),
          }),
        }}
      />

      <section className="agri-hero" aria-labelledby="agri-hero-title">
        <div className="agri-hero-grid">
          <div className="agri-hero-copy">
            <p className="agri-kicker">EPIC AGRI MARKET / MARKETPLACE DEMO</p>
            <h1 id="agri-hero-title">
              Better produce.
              <em>Clearer discovery.</em>
            </h1>
            <p>
              Browse agricultural listings through a focused marketplace built
              around products, categories and seller discovery — without the
              clutter of a generic retail template.
            </p>
            <div className="agri-hero-actions">
              <Link className="agri-primary-action" href="/categories">
                Browse produce <span aria-hidden="true">↗</span>
              </Link>
              <Link className="agri-secondary-action" href="/sellers">
                Explore sellers <span aria-hidden="true">→</span>
              </Link>
            </div>
            <p className="agri-hero-note">
              Demo marketplace · Commercial terms are confirmed outside this interface
            </p>
          </div>

          <div className="agri-hero-visual" aria-label="EPIC Agri Market visual identity">
            <div className="agri-plot">
              <div className="agri-plot-grid" aria-hidden="true" />
              <div className="agri-visual-top">
                <span>SEASON / MARKET / SOURCE</span>
                <span>EPIC 01</span>
              </div>
              <div className="agri-visual-word" aria-hidden="true">
                GROW
                <span>MOVE.</span>
              </div>
            </div>
            <div className="agri-visual-footer">
              <div>
                <span>01</span>
                <strong>Produce</strong>
              </div>
              <div>
                <span>02</span>
                <strong>Categories</strong>
              </div>
              <div>
                <span>03</span>
                <strong>Sellers</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="agri-intro-strip" aria-label="Marketplace orientation">
        <article>
          <small>01 / DISCOVER</small>
          <h2>Start with what you need.</h2>
          <p>Use marketplace categories to narrow the catalog before comparing listings.</p>
        </article>
        <article>
          <small>02 / COMPARE</small>
          <h2>Read the listing, not the noise.</h2>
          <p>Product and offer details stay central while the interface keeps visual hierarchy clear.</p>
        </article>
        <article>
          <small>03 / CONNECT</small>
          <h2>Move from product to seller.</h2>
          <p>Seller discovery remains part of the existing marketplace flow and demo experience.</p>
        </article>
      </section>

      <section className="agri-products" aria-label="Featured marketplace listings">
        <HomeProductSection heading="MARKET PICKS" locale={locale} home />
      </section>

      <section className="agri-categories" aria-label="Marketplace categories">
        <HomeCategories heading="BROWSE THE MARKET" />
      </section>

      <section className="agri-market-note" aria-labelledby="market-note-title">
        <div className="agri-market-note-grid">
          <div>
            <p className="agri-kicker">A MARKETPLACE, NOT A PROMISE</p>
            <h2 id="market-note-title">Product discovery first. Operating terms stay explicit.</h2>
          </div>
          <p>
            This storefront demonstrates the buyer experience and marketplace catalog.
            Seller-of-record, payment, tax, import, installation and warranty arrangements
            are not represented here as finalized operating commitments.
          </p>
        </div>
      </section>
    </main>
  )
}
