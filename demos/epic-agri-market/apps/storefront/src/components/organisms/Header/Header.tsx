import Image from "next/image"
import { HttpTypes } from "@medusajs/types"

import { CartDropdown, MobileNavbar, Navbar } from "@/components/cells"
import { UserDropdown } from "@/components/cells/UserDropdown/UserDropdown"
import CountrySelector from "@/components/molecules/CountrySelector/CountrySelector"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { MessageButton } from "@/components/molecules/MessageButton/MessageButton"
import { listCategories } from "@/lib/data/categories"
import { listRegions } from "@/lib/data/regions"
import { retrieveCustomer } from "@/lib/data/customer"
import { ParentCategoryLinks } from "@/components/molecules/ParentCategoryLinks/ParentCategoryLinks"

export const Header = async ({ locale } : {
  locale: string
}) => {
  const user = await retrieveCustomer().catch(() => null)
  const isLoggedIn = Boolean(user)

  const regions = await listRegions()

  const { categories, parentCategories } = (await listCategories({ query: { include_ancestors_tree: true } })) as {
    categories: HttpTypes.StoreProductCategory[]
    parentCategories: HttpTypes.StoreProductCategory[]
  }
  return (
    <header data-testid="header" className="epic-header">
      <div className="epic-topbar"><span>EPIC AGRI MARKET <span className="hidden sm:inline"> / VIETNAM AGRICULTURE MARKETPLACE CONCEPT</span></span><span><a href={process.env.NEXT_PUBLIC_VENDOR_URL || "http://localhost:9107/seller"}>Seller portal ↗</a><a href={`${process.env.MEDUSA_BACKEND_URL || "http://localhost:9107"}/dashboard`}>Operator ↗</a></span></div>
      <div className="flex py-2 lg:px-8 px-4 md:px-5" data-testid="header-top">
        <div className="flex items-center lg:w-1/3">
          <MobileNavbar
            parentCategories={parentCategories}
            categories={categories}
          />
          <ParentCategoryLinks
            parentCategories={parentCategories}
            categories={categories}
          />
        </div>
        <div className="flex lg:justify-center lg:w-1/3 items-center pl-4 lg:pl-0">
          <LocalizedClientLink href="/" className="inline-flex items-center gap-2" data-testid="header-logo-link" aria-label="EPIC Technology home">
            <span className="relative block h-12 w-[50px] shrink-0 overflow-hidden">
              <Image
                src="/epic-technology-logo.svg"
                width={140}
                height={48}
                className="h-12 w-auto max-w-none"
                alt=""
                priority
              />
            </span>
            <span className="whitespace-nowrap text-[17px] font-bold tracking-[-0.04em] text-[#0b4f97]">
              EPIC TECHNOLOGY
            </span>
          </LocalizedClientLink>
        </div>
        <div className="flex items-center justify-end gap-2 lg:gap-4 w-full lg:w-1/3 py-2" data-testid="header-actions">
          <CountrySelector regions={regions} />
          {process.env.NEXT_PUBLIC_TALKJS_APP_ID && isLoggedIn && <MessageButton />}
          <UserDropdown isLoggedIn={isLoggedIn} />
          <CartDropdown />
        </div>
      </div>
      <Navbar categories={categories} parentCategories={parentCategories} />
    </header>
  )
}
