import Image from "next/image"
import Link from "next/link"

import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"

export function Footer() {
  return (
    <footer className="epic-footer" data-testid="footer">
      <div>
        <LocalizedClientLink
          href="/"
          className="inline-flex bg-white px-3 py-2"
          aria-label="EPIC Technology home"
        >
          <Image
            src="/epic-technology-logo.svg"
            width={220}
            height={75}
            className="h-12 w-auto"
            alt="EPIC Technology"
          />
        </LocalizedClientLink>
        <p>Rooted in Vietnam. Connected by possibility.</p>
      </div>
      <nav aria-label="Footer">
        <LocalizedClientLink href="/categories">Explore the market</LocalizedClientLink>
        <a href={process.env.NEXT_PUBLIC_VENDOR_URL || "http://localhost:9107/seller"}>Seller portal</a>
        <LocalizedClientLink href="/about-demo">About this demo & image credits</LocalizedClientLink>
      </nav>
      <p className="epic-footer-credit">
        Vietnam agriculture marketplace concept · Sep 2026
        <br />
        Built with <Link href="https://mercurjs.com">Mercur</Link> & <Link href="https://medusajs.com">Medusa</Link> · Open source under MIT
      </p>
    </footer>
  )
}
