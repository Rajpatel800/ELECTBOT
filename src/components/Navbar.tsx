"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/learn", label: "Learn" },
  { href: "/timeline", label: "Timeline" },
  { href: "/quiz", label: "Quiz" },
  { href: "/chat", label: "Ask ElectBot" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 grid grid-cols-3 items-center px-6 py-3.5 bg-white/85 backdrop-blur-xl border-b border-[#c6c5d4]/30 shadow-sm"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" aria-label="ElectBot home">
          <span className="text-2xl" aria-hidden="true">🗳️</span>
          <span className="text-xl font-black text-[#1a237e] tracking-tight">ElectBot</span>
        </Link>

        {/* Desktop Links — centered column */}
        <div className="hidden md:flex items-center justify-center gap-0.5" role="list">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              role="listitem"
              aria-current={pathname === l.href ? "page" : undefined}
              className={`px-3.5 py-2 rounded-lg text-[0.875rem] font-medium transition-all ${
                pathname === l.href
                  ? "bg-[#eae7ef] text-[#1a237e] font-bold"
                  : "text-[#454652] hover:bg-[#eae7ef] hover:text-[#1a237e]"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right col — hamburger on mobile */}
        <div className="flex justify-end">
          <button
            className="md:hidden text-[#1a237e] text-2xl p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3d4fc8] focus:ring-offset-2"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <span aria-hidden="true">{open ? "✕" : "☰"}</span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div
          id="mobile-menu"
          className="fixed top-[65px] left-0 right-0 z-40 bg-white border-b border-[#c6c5d4] shadow-lg flex flex-col p-3 gap-1"
          role="navigation"
          aria-label="Mobile navigation menu"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              aria-current={pathname === l.href ? "page" : undefined}
              className={`px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                pathname === l.href
                  ? "bg-[#efecf5] text-[#1a237e] font-bold"
                  : "text-[#1b1b21] hover:bg-[#efecf5]"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
