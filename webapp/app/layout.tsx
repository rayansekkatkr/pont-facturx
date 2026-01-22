import type React from "react";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Providers from "@/components/providers";
import IdleLogout from "@/components/idle-logout";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "Factur-X - Conversion Facture Électronique PDF/A-3 Conforme EN16931 | Obligation 2026",
  description:
    "Solution de facturation électronique Factur-X certifiée. Convertissez vos factures PDF en format électronique PDF/A-3 + XML conforme EN16931. OCR intelligent, validation Chorus Pro, conformité obligation 2026 garantie. Essai gratuit.",
  generator: "v0.app",
  metadataBase: new URL("https://www.pont-facturx.com"),
  alternates: {
    canonical: "/",
  },
  keywords: [
    "facture électronique",
    "facturation électronique",
    "facturx",
    "Factur-X",
    "facture electronique",
    "PDF/A-3",
    "norme EN 16931",
    "EN16931",
    "obligation facturation électronique 2026",
    "Chorus Pro",
    "ZUGFeRD",
    "conversion PDF XML",
    "OCR facture",
    "facture numérique",
    "dématérialisation facture",
    "e-invoicing France"
  ],
  authors: [{ name: "Factur-X Convert" }],
  creator: "Factur-X Convert",
  publisher: "Factur-X Convert",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://www.pont-facturx.com",
    siteName: "Factur-X Convert",
    title: "Factur-X - Solution de Facturation Électronique Conforme EN16931",
    description:
      "Convertissez vos factures PDF en Factur-X (PDF/A-3 + XML) conforme à la norme EN16931. OCR intelligent, validation Chorus Pro, conformité obligation 2026.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Factur-X - Facturation Électronique Conforme",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Factur-X - Facturation Électronique Conforme EN16931",
    description:
      "Solution de conversion PDF vers facture électronique Factur-X. OCR intelligent, conformité EN16931, validation Chorus Pro.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F9F9FB" },
    { media: "(prefers-color-scheme: dark)", color: "#1A1B2E" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Vercel Analytics injects /_vercel/insights/script.js.
  // If Analytics isn't enabled on the Vercel project, it 404s and creates noisy console errors.
  // Keep it opt-in via env var.
  const enableVercelAnalytics =
    process.env.NEXT_PUBLIC_VERCEL_ANALYTICS === "1" ||
    process.env.NEXT_PUBLIC_ENABLE_VERCEL_ANALYTICS === "1" ||
    process.env.ENABLE_VERCEL_ANALYTICS === "1";

  return (
    <html lang="fr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Factur-X Convert",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web",
              "description": "Solution de conversion de factures PDF en format électronique Factur-X (PDF/A-3 + XML) conforme à la norme EN16931. OCR intelligent, validation Chorus Pro, conformité obligation facturation électronique 2026.",
              "offers": {
                "@type": "AggregateOffer",
                "lowPrice": "6.99",
                "highPrice": "149.99",
                "priceCurrency": "EUR"
              },
              "provider": {
                "@type": "Organization",
                "name": "Factur-X Convert",
                "url": "https://www.pont-facturx.com"
              },
              "featureList": [
                "Conversion PDF vers Factur-X",
                "OCR intelligent multilingue",
                "Conformité EN16931",
                "Validation Chorus Pro",
                "PDF/A-3 certifié",
                "Support ZUGFeRD"
              ]
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Factur-X Convert",
              "url": "https://www.pont-facturx.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://www.pont-facturx.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-ML6GSMMB');`,
          }}
        />
      </head>
      <body className={`${_geist.className} ${outfit.variable} font-sans antialiased`}>
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-ML6GSMMB" 
            height="0" 
            width="0" 
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <Providers>
          <IdleLogout />
          {children}
        </Providers>
        {enableVercelAnalytics ? <Analytics /> : null}
      </body>
    </html>
  );
}
