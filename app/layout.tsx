import type { Metadata } from "next";
import Script from "next/script";
import { Baloo_Da_2 } from "next/font/google";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_NAME_BN,
  SITE_URL,
  SITE_TAGLINE_BN,
} from "@/lib/constants";
import "./globals.css";

const balooDa2 = Baloo_Da_2({
  subsets: ["latin", "bengali"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-baloo-da-2",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME_BN} · ${SITE_NAME}`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Shyama Sangeet",
    "শ্যামা সংগীত",
    "Bengali devotional music",
    "Kali bhajan",
    "বাংলা ভক্তিমূলক গান",
    "মায়ের গান",
    "kirtan",
    "bhakti geet",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "bn_IN",
    alternateLocale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME_BN} · ${SITE_NAME}`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 669,
        alt: `${SITE_NAME_BN} — ${SITE_TAGLINE_BN}`,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME_BN} · ${SITE_NAME}`,
    description: SITE_DESCRIPTION,
    images: [{ url: "/og-image.png", alt: `${SITE_NAME_BN} — ${SITE_TAGLINE_BN}` }],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "music",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="bn"
      className={balooDa2.variable}
      suppressHydrationWarning
    >
      <body>
        <Script id="theme-init" strategy="beforeInteractive">
          {`try{if(localStorage.getItem("theme")==="light")document.documentElement.classList.add("light")}catch(e){}`}
        </Script>
        {children}
      </body>
    </html>
  );
}
