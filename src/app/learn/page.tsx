/**
 * src/app/learn/page.tsx
 *
 * Educational content hub with Firestore-backed learning modules.
 * Features an accordion UI for module content, progress tracking,
 * and optional Hindi translation for India mode.
 *
 * @module LearnPage
 */

"use client";
import { useState, useEffect, useRef } from "react";
import { useCountry } from "@/lib/countryContext";
import { getLearnModules, LearnModule } from "@/lib/firestoreService";
import { localLearnModules } from "@/lib/countryData";
import ReactMarkdown from "react-markdown";

// ─────────────────────────────────────────────
// Translation helper
// ─────────────────────────────────────────────
const translationCache = new Map<string, string>();

async function translateText(text: string, targetLang: "hi" | "en"): Promise<string> {
  const cacheKey = `${targetLang}::${text.slice(0, 50)}`;
  if (translationCache.has(cacheKey)) return translationCache.get(cacheKey)!;

  const res = await fetch("/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, targetLang }),
  });

  if (!res.ok) throw new Error("Translation failed");
  const { translatedText } = await res.json();
  translationCache.set(cacheKey, translatedText);
  return translatedText;
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
export default function LearnPage() {
  const { country } = useCountry();
  const [modules, setModules]       = useState<LearnModule[]>([]);
  const [loading, setLoading]       = useState(true);
  const [usingLocal, setUsingLocal] = useState(false);
  const [openId, setOpenId]         = useState<string | null>(null);
  const [completed, setCompleted]   = useState<Set<string>>(new Set());

  // Hindi translation state (India only)
  const [lang, setLang]                           = useState<"en" | "hi">("en");
  const [translating, setTranslating]             = useState(false);
  const [translatedModules, setTranslatedModules] = useState<LearnModule[]>([]);
  const prevLang                                  = useRef<"en" | "hi">("en");

  // Fetch modules from Firestore, fallback to local data if empty
  useEffect(() => {
    async function fetchModules() {
      setLoading(true);
      setLang("en");
      setTranslatedModules([]);
      const data = await getLearnModules(country);
      if (data.length > 0) {
        setModules(data);
        setUsingLocal(false);
      } else {
        // Fallback to local modules when Firestore is unavailable or empty
        setModules(localLearnModules[country] ?? []);
        setUsingLocal(true);
      }
      setLoading(false);
      setCompleted(new Set());
      setOpenId(null);
    }
    fetchModules();
  }, [country]);

  // Translate all modules when user switches to Hindi
  useEffect(() => {
    if (lang === prevLang.current) return;
    prevLang.current = lang;

    if (lang === "en" || country !== "india" || modules.length === 0) {
      setTranslatedModules([]);
      return;
    }

    async function translateAll() {
      setTranslating(true);
      try {
        const translated = await Promise.all(
          modules.map(async (m) => {
            const [title, content] = await Promise.all([
              translateText(m.title, "hi"),
              translateText(m.content, "hi"),
            ]);
            return { ...m, title, content };
          })
        );
        setTranslatedModules(translated);
      } catch {
        // If translation fails, silently fall back to English
        setLang("en");
        setTranslatedModules([]);
      } finally {
        setTranslating(false);
      }
    }
    translateAll();
  }, [lang, modules, country]);

  const displayModules = lang === "hi" && translatedModules.length > 0 ? translatedModules : modules;
  const toggle   = (id: string) => setOpenId(openId === id ? null : id);
  const complete = (id: string) => setCompleted(prev => new Set([...prev, id]));
  const pct = modules.length > 0 ? Math.round((completed.size / modules.length) * 100) : 0;
  const isIndia = country === "india";

  return (
    <>
      {/* Hero */}
      <header className={`px-6 py-12 text-white ${isIndia ? "bg-gradient-to-r from-[#FF6B00] to-[#1a237e]" : "bg-gradient-to-r from-[#1a237e] to-[#3d4fc8]"}`}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <span
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 border border-white/30 mb-3 shadow-inner"
                aria-hidden="true"
              >
                ⚡ Powered by Firebase Firestore Database
              </span>
              <h1 className="text-4xl font-black tracking-tight mb-2">
                {isIndia ? "Election Education Hub — India 🇮🇳" : "Election Education Hub 🇺🇸"}
              </h1>
              <p className="opacity-90 max-w-2xl text-lg font-medium leading-relaxed mt-2">
                {isIndia
                  ? lang === "hi"
                    ? "भारत की चुनाव प्रक्रिया के हर पहलू को गहराई से समझें"
                    : "Bharat ki chunav prakriya ke har pehlu ko deeply samjhein"
                  : "Deep-dive into every aspect of the democratic process."}
              </p>
            </div>

            {/* Language toggle — India only */}
            {isIndia && (
              <div
                className="flex items-center gap-1 bg-white/15 border border-white/30 rounded-xl p-1 self-start mt-1 backdrop-blur-sm"
                role="group"
                aria-label="Select content language"
              >
                <button
                  onClick={() => setLang("en")}
                  disabled={translating}
                  aria-pressed={lang === "en"}
                  aria-label="Switch to English"
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1 focus:ring-offset-transparent ${
                    lang === "en"
                      ? "bg-white text-[#1a237e] shadow-md"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setLang("hi")}
                  disabled={translating}
                  aria-pressed={lang === "hi"}
                  aria-label={translating ? "Translating to Hindi, please wait" : "Switch to Hindi"}
                  aria-busy={translating}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1 focus:ring-offset-transparent ${
                    lang === "hi"
                      ? "bg-white text-[#FF6B00] shadow-md"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  {translating ? "अनुवाद..." : "हिंदी"}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-4">
        {/* Country indicator */}
        <div
          role="status"
          aria-live="polite"
          className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold shadow-sm ${
            isIndia ? "bg-orange-50 border border-orange-200 text-orange-700" : "bg-blue-50 border border-blue-200 text-blue-700"
          }`}
        >
          {usingLocal
            ? isIndia
              ? lang === "hi"
                ? "🇮🇳 स्थानीय डेटा से लोड किया गया। सभी मॉड्यूल उपलब्ध हैं।"
                : "🇮🇳 Loaded from local data. All modules available — Firestore index pending."
              : "🇺🇸 Loaded from local data. All modules available — Firestore index pending."
            : isIndia
              ? lang === "hi"
                ? "🇮🇳 डेटाबेस कनेक्टेड। ECI, EVM सुरक्षा, VVPAT और FPTP पर गहन जानकारी उपलब्ध है।"
                : "🇮🇳 Database connected. Providing in-depth analysis on ECI, FPTP, EVM Security, and the VVPAT system."
              : "🇺🇸 Database connected. Providing advanced insights on the Electoral College, Primary Elections, and Registration processes."}
        </div>

        {/* Translating status */}
        {translating && (
          <div
            role="status"
            aria-live="assertive"
            aria-atomic="true"
            className="flex items-center gap-3 px-5 py-4 bg-orange-50 border border-orange-200 rounded-xl text-orange-700"
          >
            <div className="w-5 h-5 rounded-full border-2 border-orange-300 border-t-orange-600 animate-spin flex-shrink-0" aria-hidden="true" />
            <div>
              <p className="font-bold text-sm">Google Translate द्वारा हिंदी अनुवाद हो रहा है…</p>
              <p className="text-xs opacity-75 mt-0.5">Translating all modules via Google Translate</p>
            </div>
          </div>
        )}

        {/* Progress bar */}
        {!loading && modules.length > 0 && (
          <div className="flex items-center gap-4 bg-white rounded-2xl px-5 py-4 shadow-sm border border-[#c6c5d4]/30">
            <span className="text-sm font-bold text-[#1a237e] whitespace-nowrap" id="progress-label">
              {lang === "hi" ? "आपकी प्रगति" : isIndia ? "Aapki Progress" : "Course Progress"}
            </span>
            <div
              className="flex-1 h-2.5 bg-[#e4e1ea] rounded-full overflow-hidden shadow-inner"
              role="progressbar"
              aria-valuenow={completed.size}
              aria-valuemin={0}
              aria-valuemax={modules.length}
              aria-labelledby="progress-label"
              aria-label={`${completed.size} of ${modules.length} topics completed`}
            >
              <div
                className="h-full bg-gradient-to-r from-[#1a237e] to-[#3d4fc8] rounded-full transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span
              className="text-sm font-bold text-[#1a237e] whitespace-nowrap bg-[#efecf5] px-2 py-1 rounded-md"
              aria-live="polite"
              aria-atomic="true"
            >
              {completed.size} / {modules.length} topics
            </span>
          </div>
        )}

        {/* Loading spinner */}
        {loading && (
          <div
            className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-[#c6c5d4]/20"
            role="status"
            aria-label="Loading educational modules from database"
            aria-live="polite"
          >
            <div className="w-12 h-12 rounded-full border-4 border-[#eae7ef] border-t-[#3d4fc8] animate-spin mb-4" aria-hidden="true" />
            <p className="text-[#1a237e] font-bold">Querying Firestore Database…</p>
            <p className="text-sm text-[#767683] mt-1">Fetching live educational modules</p>
          </div>
        )}

        {/* Module accordion */}
        {!loading && displayModules.length > 0 && (
          <section aria-label="Learning modules" aria-busy={translating}>
            {displayModules.map((m) => {
              const isOpen = openId === m.id;
              const isDone = completed.has(m.id);
              const panelId = `panel-${m.id}`;
              const headingId = `heading-${m.id}`;
              return (
                <div
                  key={m.id}
                  className={`bg-white rounded-2xl shadow-sm overflow-hidden border transition-all duration-300 mb-4 ${
                    isDone
                      ? "border-l-[6px] border-[#3d4fc8] transform scale-[1.01]"
                      : "border-[#c6c5d4]/30 hover:border-[#1a237e]/40"
                  }`}
                >
                  {/* Accordion trigger */}
                  <h2 id={headingId}>
                    <button
                      onClick={() => toggle(m.id)}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      className="w-full flex items-center gap-5 px-6 py-5 hover:bg-[#fbf8ff] transition-colors text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#3d4fc8]"
                    >
                      <span className="text-4xl drop-shadow-sm" aria-hidden="true">{m.icon}</span>
                      <div className="flex-1">
                        <p className="font-extrabold text-[#1a237e] text-lg leading-tight mb-1">{m.title}</p>
                        <span className="inline-block px-2 py-0.5 rounded-full bg-[#efecf5] text-[10px] uppercase font-bold text-[#454652] tracking-wider">
                          {m.tag}
                        </span>
                      </div>
                      {isDone && (
                        <div
                          className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full mr-2"
                          aria-label="Module completed"
                        >
                          <span className="font-black text-xs" aria-hidden="true">✓</span>
                          <span className="text-xs font-bold uppercase tracking-wider hidden sm:block">Done</span>
                        </div>
                      )}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center bg-[#eae7ef] text-[#1a237e] transition-transform duration-300 shadow-inner ${isOpen ? "rotate-180" : ""}`}
                        aria-hidden="true"
                      >
                        <span className="text-xs leading-none mt-0.5">▼</span>
                      </div>
                    </button>
                  </h2>

                  {/* Accordion panel */}
                  {isOpen && (
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={headingId}
                      className="px-6 pb-7 animate-in fade-in slide-in-from-top-2 duration-300"
                    >
                      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#c6c5d4]/50 to-transparent mb-5" aria-hidden="true" />
                      {lang === "hi" && isIndia && (
                        <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-lg text-xs text-orange-700 font-semibold">
                          <span aria-hidden="true">🌐</span>
                          Google Translate द्वारा अनुवादित
                        </div>
                      )}
                      <div className={`prose prose-base max-w-none text-[#454652]
                        prose-headings:text-[#000666] prose-headings:font-black prose-headings:tracking-tight prose-headings:mt-6 prose-headings:mb-3
                        prose-p:leading-relaxed prose-p:mb-4
                        prose-a:text-[#3d4fc8] prose-a:font-bold prose-a:no-underline hover:prose-a:underline
                        prose-strong:text-[#1b1b21] prose-strong:font-black
                        prose-ul:list-disc prose-ul:pl-5 prose-ul:space-y-2
                        prose-li:marker:text-[#ffc107] ${lang === "hi" ? "font-[system-ui]" : ""}`}
                      >
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      </div>

                      <div className="mt-8 flex items-center justify-end">
                        <button
                          onClick={() => complete(m.id)}
                          disabled={isDone}
                          aria-label={isDone
                            ? (lang === "hi" ? "यह मॉड्यूल पहले से पूरा हो चुका है" : "Module already completed")
                            : (lang === "hi" ? "इस मॉड्यूल को पूरा हुआ चिह्नित करें" : `Mark ${m.title} as understood`)}
                          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3d4fc8] ${
                            isDone
                              ? "bg-green-500 text-white shadow-green-500/20 cursor-default"
                              : "bg-[#1a237e] text-white hover:bg-[#3d4fc8] hover:-translate-y-0.5 hover:shadow-[#1a237e]/30"
                          }`}
                        >
                          {isDone
                            ? "✅ " + (lang === "hi" ? "मॉड्यूल पूरा हुआ" : "Module Completed")
                            : "✓ " + (lang === "hi" ? "समझ गया" : "Mark as Understood")}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        )}

        {/* Empty state */}
        {!loading && modules.length === 0 && (
          <div
            className="p-10 text-center bg-white rounded-2xl shadow-sm border border-red-100"
            role="alert"
            aria-live="assertive"
          >
            <span className="text-4xl block mb-3" aria-hidden="true">⚠️</span>
            <p className="text-[#1a237e] font-bold text-lg">No modules found.</p>
            <p className="text-[#767683] text-sm mt-1">Please wait for the database seed to complete.</p>
          </div>
        )}
      </div>
    </>
  );
}
