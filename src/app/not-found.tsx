/**
 * src/app/not-found.tsx
 *
 * Custom 404 Not Found page.
 * Next.js automatically renders this for any unmatched route.
 */

import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Page Not Found | ElectBot",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
      <span className="text-8xl mb-6" aria-hidden="true">🗳️</span>
      <h1 className="text-6xl font-black text-[#1a237e] mb-4 tracking-tight">404</h1>
      <h2 className="text-2xl font-bold text-[#454652] mb-3">Page Not Found</h2>
      <p className="text-[#767683] mb-8 max-w-md">
        The ballot has been cast, but this page doesn't seem to exist. Let's
        get you back on the right track.
      </p>
      <Link
        href="/"
        className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#1a237e] to-[#3d4fc8] text-white font-bold shadow-lg hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(26,35,126,0.4)] transition-all"
      >
        ← Back to ElectBot Home
      </Link>
    </div>
  );
}
