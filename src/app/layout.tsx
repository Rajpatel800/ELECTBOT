// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#fbf8ff] text-[#1b1b21] min-h-screen`}>
        <CountryProvider>
          <Navbar />
          <main className="pt-[65px]">{children}</main>
        </CountryProvider>
      </body>
    </html>
  );
}
