// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

import { CountryProvider } from "@/lib/countryContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ElectBot — Election Process Education Assistant",
  description:
    "An AI-powered interactive assistant that helps you understand the election process, timelines, and voting steps. Supports India 🇮🇳 and USA 🇺🇸. Built for Google Virtual PromptWars.",
  keywords: "election, voting, voter ID, civic education, ElectBot, Gemini AI, India elections, US elections",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Add some JSON-LD structured data for Google Search (SEO)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "ElectBot",
    "description": "An AI-powered interactive assistant for election process education.",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} bg-[#fbf8ff] text-[#1b1b21] min-h-screen`}>
        {/* Skip-to-main-content link — first focusable element for keyboard users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-[#1a237e] focus:text-white focus:rounded-lg focus:font-bold focus:shadow-lg"
        >
          Skip to main content
        </a>
        <CountryProvider>
          <Navbar />
          <main
            id="main-content"
            className="pt-[65px]"
            aria-label="Main content"
          >
            {children}
          </main>
        </CountryProvider>
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID as string || "G-MHTZEW02TL"} />
    </html>
  );
}
