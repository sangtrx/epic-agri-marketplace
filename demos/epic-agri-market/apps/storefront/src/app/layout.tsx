import type { Metadata } from "next";
import "./globals.css";
import "./epic.css";
import { Toaster } from "sonner";
import { HtmlLangSetter } from "@/components/atoms/HtmlLangSetter/HtmlLangSetter";
import { retrieveCart } from "@/lib/data/cart";
import { Providers } from "./providers";
export const metadata: Metadata = {
 title: { template: "%s | EPIC Agri Market", default: "EPIC Agri Market" },
 description: "Vietnam agriculture marketplace concept",
 robots: { index: false, follow: false },
 metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3107"),
};
export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
 const cart = await retrieveCart();
 return <html lang="en"><body className="relative bg-primary text-secondary antialiased"><HtmlLangSetter /><Providers cart={cart}>{children}</Providers><Toaster position="top-right" /></body></html>;
}
