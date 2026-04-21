"use client";
// src/app/learn/page.tsx
import { useState } from "react";
import { useCountry } from "@/lib/countryContext";
import { indiaModules, usaModules, LearnModule } from "@/lib/countryData";
import ReactMarkdown from "react-markdown";

export default function LearnPage() {
  const { country } = useCountry();
  const modules: LearnModule[] = country === "india" ? indiaModules : usaModules;

  const [openId, setOpenId] = useState<string | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const toggle = (id: string) => setOpenId(openId === id ? null : id);
  const complete = (id: string) => setCompleted(prev => new Set([...prev, id]));
  const pct = Math.round((completed.size / modules.length) * 100);

  return (
    <>
      {/* Hero */}
      <div className={`px-6 py-12 text-white ${country === "india" ? "bg-gradient-to-r from-[#FF6B00] to-[#1a237e]" : "bg-gradient-to-r from-[#1a237e] to-[#3d4fc8]"}`}>
        <div className="max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 border border-white/30 mb-3">
            {country === "india" ? "🇮🇳 भारत — Educational Modules" : "📚 Educational Modules"}
          </span>
          <h1 className="text-4xl font-black tracking-tight mb-2">
            {country === "india" ? "Election Education Hub — India 🇮🇳" : "Election Education Hub"}
          </h1>
          <p className="opacity-85">
            {country === "india"
              ? "Bharat ki chunav prakriya ke har pehlu ko deeply samjhein"
              : "Deep-dive into every aspect of the democratic process"}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-4">
        {/* Country indicator */}
        <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold ${
          country === "india" ? "bg-orange-50 border border-orange-200 text-orange-700" : "bg-blue-50 border border-blue-200 text-blue-700"
        }`}>
          {country === "india" ? "🇮🇳 Showing India-specific content: ECI, EPIC, Lok Sabha, EVM & more" : "🇺🇸 Showing USA-specific content: Registration, Electoral College, Amendments & more"}
        </div>

        {/* Progress */}
        <div className="flex items-center gap-4 bg-white rounded-2xl px-5 py-4 shadow-sm">
          <span className="text-sm font-bold text-[#1a237e] whitespace-nowrap">
            {country === "india" ? "Aapki Progress" : "Your Progress"}
          </span>
          <div className="flex-1 h-2.5 bg-[#e4e1ea] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#1a237e] to-[#3d4fc8] rounded-full transition-all duration-700"
              style={{ width: `${pct}%` }} />
          </div>
          <span className="text-sm font-semibold text-[#767683] whitespace-nowrap">
            {completed.size} / {modules.length} {country === "india" ? "topics" : "topics"}
          </span>
        </div>

        {/* Modules */}
        {modules.map((m) => (
          <div key={m.id}
            className={`bg-white rounded-2xl shadow-sm overflow-hidden border transition-all ${completed.has(m.id) ? "border-l-4 border-[#3d4fc8]" : "border-[#c6c5d4]/20"}`}>
            <button onClick={() => toggle(m.id)}
              className="w-full flex items-center gap-4 px-6 py-5 hover:bg-[#f5f2fb] transition-colors text-left">
              <span className="text-3xl">{m.icon}</span>
              <div className="flex-1">
                <p className="font-bold text-[#1a237e] text-base">{m.title}</p>
                <p className="text-xs text-[#767683] font-medium">{m.tag}</p>
              </div>
              {completed.has(m.id) && <span className="text-green-600 font-bold text-sm mr-2">✅</span>}
              <span className={`text-[#767683] text-xs transition-transform duration-300 ${openId === m.id ? "rotate-180" : ""}`}>▼</span>
            </button>

            {openId === m.id && (
              <div className="px-6 pb-6">
                <div className="pt-1 border-t border-[#efecf5] mb-4" />
                <div className="prose prose-sm max-w-none text-[#454652]
                  prose-headings:text-[#1a237e] prose-headings:font-bold
                  prose-a:text-[#3d4fc8] prose-a:font-semibold
                  prose-strong:text-[#1b1b21]
                  prose-li:marker:text-[#3d4fc8]">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
                <button onClick={() => complete(m.id)} disabled={completed.has(m.id)}
                  className={`mt-5 px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                    completed.has(m.id) ? "bg-green-100 text-green-700 cursor-default" : "bg-gradient-to-r from-[#1a237e] to-[#3d4fc8] text-white hover:-translate-y-0.5 hover:shadow-lg"
                  }`}>
                  {completed.has(m.id) ? "✅ Completed!" : (country === "india" ? "✓ Poora Kiya" : "✓ Mark as Complete")}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
