import Image from "next/image"
import Link from "next/link"

import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"

export function Footer() {
  return (
    <footer className="epic-footer" data-testid="footer">
      <div>
        <LocalizedClientLink
          href="/"
          className="inline-flex items-center gap-2 bg-white px-3 py-2"
          aria-label="EPIC Technology home"
        >
          <span className="relative block h-12 w-[50px] shrink-0 overflow-hidden">
            <Image
              src="/epic-technology-logo.svg"
              width={140}
              height={48}
              className="h-12 w-auto max-w-none"
              alt=""
            />
          </span>
          <span className="whitespace-nowrap text-[17px] font-bold tracking-[-0.04em] text-[#0b4f97]">
            EPIC TECHNOLOGY
          </span>
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
