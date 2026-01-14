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
  title: "Factur-X - Conversion de factures PDF",
  description:
    "Convertissez n'importe quel PDF de facture en Factur-X (PDF/A-3 + XML) avec rapport de validation",
  generator: "v0.app",
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
      <body className={`${_geist.className} ${outfit.variable} font-sans antialiased`}>
        <Providers>
          <IdleLogout />
          {children}
        </Providers>
        {enableVercelAnalytics ? <Analytics /> : null}
      </body>
    </html>
  );
}
