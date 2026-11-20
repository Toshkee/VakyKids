import type { Metadata, Viewport } from "next";
import { Baloo_2, Caveat, Nunito } from "next/font/google";
import { site } from "@/config/site";
import "./globals.css";

/* latin-ext carries č ć đ š ž. Baloo 2 rather than Fredoka: Fredoka has no
   proper č, so it fell back to another font mid-word. */
const display = Baloo_2({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-baloo",
  display: "swap",
});
/* Handwritten notes and annotations. */
const hand = Caveat({
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700"],
  variable: "--font-caveat",
  display: "swap",
});
const body = Nunito({
  subsets: ["latin", "latin-ext"],
  variable: "--font-nunito",
  display: "swap",
});

const title = "Vaky Kids — crtani film u kojem je vaše dijete glavni junak";
const description =
  "Crtani film sa imenom vašeg djeteta, pričom o onome što voli i naracijom na našem jeziku. Poklon za rođendan koji se pamti.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: site.name, title, description, url: "/" },
  twitter: { card: "summary_large_image", title, description },
};

export const viewport: Viewport = {
  themeColor: "#FFF8E1",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="cnr" className={`${display.variable} ${hand.variable} ${body.variable}`}>
      <body className="overflow-x-hidden">{children}</body>
    </html>
  );
}
