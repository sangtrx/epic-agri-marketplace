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
          <LocalizedClientLink href="/" className="text-2xl font-bold" data-testid="header-logo-link">
            <Image
              src="/Logo.svg"
              width={190}
              height={40}
              alt="EPIC Agri Market"
              priority
            />
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
