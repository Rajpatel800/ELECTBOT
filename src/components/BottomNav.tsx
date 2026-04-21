"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", icon: "🏠", label: "Home" },
  { href: "/learn", icon: "📚", label: "Learn" },
  { href: "/timeline", icon: "🗓️", label: "Timeline" },
  { href: "/quiz", icon: "🏅", label: "Quiz" },
  { href: "/chat", icon: "💬", label: "ElectBot" },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex bg-white border-t border-[#c6c5d4] shadow-[0_-4px_16px_rgba(27,27,33,0.08)]">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 transition-all ${
            pathname === item.href
              ? "text-[#1a237e]"
              : "text-[#767683] hover:text-[#1a237e] hover:bg-[#f5f2fb]"
          }`}
        >
          <span className="text-xl">{item.icon}</span>
          <span className="text-[10px] font-semibold">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
