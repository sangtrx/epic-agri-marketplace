import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"

export function Footer() {
  return (
    <footer data-testid="footer">
      <div className="epic-agri-footer-top">
        <div>
          <div className="epic-agri-brand">
            <span className="epic-agri-brand-mark" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </span>
            <span className="epic-agri-brand-copy">
              <strong>EPIC AGRI MARKET</strong>
              <small>Marketplace demo</small>
            </span>
          </div>
          <p>
            A focused marketplace demo for agricultural product discovery,
            categories, sellers and buyer flows.
          </p>
        </div>
        <div>
          <span className="epic-agri-footer-label">Demo boundary</span>
          <p>
            Seller-of-record, payment, tax, import, installation and warranty
            arrangements are not presented as finalized operating commitments.
          </p>
        </div>
      </div>

      <div className="epic-agri-footer-grid">
        <div className="epic-agri-footer-column" data-testid="footer-marketplace">
          <h2>Marketplace</h2>
          <nav aria-label="Marketplace navigation">
            <LocalizedClientLink href="/categories">Browse categories</LocalizedClientLink>
            <LocalizedClientLink href="/sellers">Explore sellers</LocalizedClientLink>
            <LocalizedClientLink href="/cart">Your cart</LocalizedClientLink>
          </nav>
        </div>

        <div className="epic-agri-footer-column" data-testid="footer-account">
          <h2>Buyer experience</h2>
          <nav aria-label="Buyer navigation">
            <LocalizedClientLink href="/user">Your account</LocalizedClientLink>
            <LocalizedClientLink href="/user/orders">Orders</LocalizedClientLink>
          </nav>
        </div>

        <div className="epic-agri-footer-column" data-testid="footer-technology">
          <h2>Technology</h2>
          <p className="text-sm leading-6 text-[#89998d]">
            Built on the Mercur marketplace storefront and Medusa commerce stack.
            Existing marketplace behavior remains intact under the EPIC presentation layer.
          </p>
        </div>
      </div>

      <div className="epic-agri-footer-bottom" data-testid="footer-copyright">
        <p>© 2026 EPIC Technology · Agri marketplace demo</p>
        <p>Presentation layer only · No real-world operating terms implied</p>
      </div>
    </footer>
  )
}
