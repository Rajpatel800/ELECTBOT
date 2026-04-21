"use client";
// src/app/page.tsx
import Link from "next/link";
import { useCountry, Country } from "@/lib/countryContext";
import { homeContent } from "@/lib/countryData";

const features = {
  india: [
    { num: "01", icon: "🪪", title: "Voter ID (EPIC) Register", desc: "Step-by-step guide to apply for your Voter ID card online via voters.eci.gov.in.", href: "/learn", cta: "Jaanein →" },
    { num: "02", icon: "🗓️", title: "Election Timelines", desc: "Lok Sabha, Vidhan Sabha, and upcoming election calendars with key dates.", href: "/timeline", cta: "Dekhein →" },
    { num: "03", icon: "🗳️", title: "Voting Day Guide", desc: "What to bring, how EVM works, VVPAT, indelible ink and NOTA explained.", href: "/learn", cta: "Padhen →" },
    { num: "04", icon: "🏅", title: "Civic Quiz (India)", desc: "ECI, Lok Sabha, NOTA, Form 6 — test your knowledge of Indian elections!", href: "/quiz", cta: "Quiz Dein →" },
    { num: "05", icon: "⚖️", title: "ECI & Your Rights", desc: "Understand the role of the Election Commission and your rights as a voter.", href: "/learn", cta: "Explore →" },
    { num: "06", icon: "🤖", title: "AI-Powered Help", desc: "Ask ElectBot any question in Hindi or English — about Indian elections!", href: "/chat", cta: "Poochhein →" },
  ],
  usa: [
    { num: "01", icon: "📋", title: "How to Register", desc: "Step-by-step guide to voter registration, eligibility requirements, and deadlines.", href: "/learn", cta: "Learn More →" },
    { num: "02", icon: "🗓️", title: "Election Timelines", desc: "Interactive calendar of key election dates — from registration to results certification.", href: "/timeline", cta: "View Timeline →" },
    { num: "03", icon: "🗳️", title: "Voting Day Guide", desc: "Everything you need to know for election day: ID requirements, what to expect, and more.", href: "/learn", cta: "Read Guide →" },
    { num: "04", icon: "🏅", title: "Test Your Knowledge", desc: "Interactive quizzes with Gemini AI-adapted questions to test your civic knowledge.", href: "/quiz", cta: "Take Quiz →" },
    { num: "05", icon: "⚖️", title: "How Votes Are Counted", desc: "Understand Electoral College, popular vote, and how winners are officially declared.", href: "/learn", cta: "Explore →" },
    { num: "06", icon: "🤖", title: "AI-Powered Help", desc: "Ask ElectBot any election question and get clear, accurate, step-by-step answers.", href: "/chat", cta: "Chat Now →" },
  ],
};

const countries: { code: Country; flag: string; label: string; sublabel: string }[] = [
  { code: "india", flag: "🇮🇳", label: "India", sublabel: "भारत" },
  { code: "usa", flag: "🇺🇸", label: "USA", sublabel: "United States" },
];

export default function HomePage() {
  const { country, setCountry } = useCountry();
  const c = homeContent[country];
  const feats = features[country];

  return (
    <>
      {/* ====== COUNTRY SELECTOR ====== */}
      <section className="max-w-6xl mx-auto px-6 pt-10 pb-2 flex flex-col items-center">
        <div className="text-center mb-4">
          <p className="text-sm font-semibold text-[#767683] uppercase tracking-wider mb-3">
            🌍 Select Your Country
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            {countries.map((cn) => (
              <button
                key={cn.code}
                onClick={() => setCountry(cn.code)}
                className={`relative flex items-center gap-3 px-6 py-4 rounded-2xl border-2 font-bold transition-all duration-200 min-w-[160px] justify-center ${
                  country === cn.code
                    ? "border-[#1a237e] bg-gradient-to-br from-[#1a237e] to-[#3d4fc8] text-white shadow-[0_8px_28px_rgba(26,35,126,0.4)] scale-105"
                    : "border-[#c6c5d4] bg-white text-[#454652] hover:border-[#3d4fc8] hover:bg-[#efecf5]"
                }`}
              >
                <span className="text-3xl">{cn.flag}</span>
                <div className="text-left">
                  <span className="block text-base font-black">{cn.label}</span>
                  <span className={`block text-xs font-medium ${country === cn.code ? "text-white/75" : "text-[#767683]"}`}>
                    {cn.sublabel}
                  </span>
                </div>
                {country === cn.code && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#ffc107] text-[#1a237e] text-xs font-black flex items-center justify-center shadow-md">
                    ✓
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Country indicator banner */}
        <div className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border transition-all ${
          country === "india"
            ? "bg-orange-50 border-orange-200 text-orange-700"
            : "bg-blue-50 border-blue-200 text-blue-700"
        }`}>
          <span>{country === "india" ? "🇮🇳" : "🇺🇸"}</span>
          <span>
            {country === "india"
              ? "Showing content for India — ECI, Lok Sabha, EPIC Voter ID"
              : "Showing content for USA — Federal Elections, Electoral College, vote.gov"}
          </span>
        </div>
      </section>

      {/* ====== HERO ====== */}
      <section className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Left */}
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-[#1a237e] bg-[#eae7ef] border border-[#c6c5d4] mb-5">
            {c.badge}
          </span>
          <h1 className="text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight text-[#000666] mb-5">
            {c.headline1}
            <br />
            <span className="bg-gradient-to-r from-[#ffc107] to-[#ff8f00] bg-clip-text text-transparent">
              {c.headline2}
            </span>
          </h1>
          <p className="text-lg text-[#454652] mb-8 leading-relaxed max-w-lg">{c.subtext}</p>
          <div className="flex flex-wrap gap-3 mb-8">
            <Link
              href="/learn"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#1a237e] to-[#3d4fc8] text-white font-bold text-base shadow-[0_0_24px_rgba(26,35,126,0.35)] hover:-translate-y-1 hover:shadow-[0_8px_28px_rgba(26,35,126,0.45)] transition-all"
            >
              ✨ {country === "india" ? "Seekhna Shuru Karein" : "Start Learning"}
            </Link>
            <Link
              href="/chat"
              className="px-6 py-3.5 rounded-xl bg-[#ffdf9e] text-[#785900] font-bold text-base hover:-translate-y-1 hover:bg-[#fdc003] transition-all"
            >
              💬 {country === "india" ? "ElectBot se Poochhen" : "Ask ElectBot"}
            </Link>
          </div>
          {/* Stats */}
          <div className="flex items-center gap-6">
            {[c.stat1, c.stat2, c.stat3].map(([n, l], i) => (
              <div key={i} className="flex items-center gap-6">
                {i > 0 && <div className="w-px h-8 bg-[#c6c5d4]" />}
                <div className="text-center">
                  <span className="block text-2xl font-black text-[#1a237e] tracking-tight">{n}</span>
                  <span className="text-[11px] text-[#767683] font-semibold uppercase tracking-wider">{l}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Illustration */}
        <div className="hidden md:flex items-center justify-center relative h-[380px]">
          <div className="absolute w-[240px] h-[240px] rounded-full border-2 border-[#1a237e]/15 ring-1" />
          <div className="absolute w-[310px] h-[310px] rounded-full border-2 border-[#1a237e]/10 ring-2" />
          <div className="absolute w-[380px] h-[380px] rounded-full border-2 border-[#1a237e]/06 ring-3" />
          <div className="w-36 h-36 rounded-full bg-gradient-to-br from-[#1a237e] to-[#3d4fc8] flex items-center justify-center z-10 shadow-[0_20px_60px_rgba(26,35,126,0.4)]">
            <span className="text-5xl">{country === "india" ? "🗳️" : "🗳️"}</span>
          </div>
          <div className="absolute top-[18%] left-0 float-up bg-white border border-[#c6c5d4] rounded-xl px-3.5 py-2 text-sm font-semibold text-[#1a237e] shadow-lg whitespace-nowrap">
            {country === "india" ? "🪪 Voter ID Register" : "📋 Register to Vote"}
          </div>
          <div className="absolute top-[50%] right-0 float-down bg-white border border-[#c6c5d4] rounded-xl px-3.5 py-2 text-sm font-semibold text-[#1a237e] shadow-lg whitespace-nowrap">
            {country === "india" ? "🖱️ EVM se Vote" : "🗳️ Cast Your Ballot"}
          </div>
          <div className="absolute bottom-[12%] left-[8%] float-side bg-white border border-[#c6c5d4] rounded-xl px-3.5 py-2 text-sm font-semibold text-[#1a237e] shadow-lg whitespace-nowrap">
            {country === "india" ? "📊 Result Dekhein" : "📊 Track Results"}
          </div>
        </div>
      </section>

      {/* ====== FEATURE CARDS ====== */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-[#000666] tracking-tight mb-2">
            {country === "india" ? "आप क्या सीखेंगे?" : "What You'll Learn"}
          </h2>
          <p className="text-[#454652]">
            {country === "india"
              ? "Chunav prakriya ke har pehlu ko explore karein"
              : "Explore every aspect of the democratic process"}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {feats.map((f) => (
            <Link
              key={f.num}
              href={f.href}
              className="relative bg-white rounded-2xl p-7 shadow-[0_2px_12px_rgba(27,27,33,0.07)] border border-[#c6c5d4]/20 overflow-hidden hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(27,27,33,0.13)] transition-all group"
            >
              <span className="absolute bottom-3 right-4 text-[4.5rem] font-black text-[#e4e1ea] leading-none select-none pointer-events-none">{f.num}</span>
              <span className="text-3xl mb-3 block">{f.icon}</span>
              <h3 className="text-base font-bold text-[#1a237e] mb-2">{f.title}</h3>
              <p className="text-sm text-[#454652] leading-relaxed mb-4">{f.desc}</p>
              <span className="text-sm font-bold text-[#3d4fc8] group-hover:underline">{f.cta}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ====== STEPS ====== */}
      <section className="bg-gradient-to-r from-[#1a237e] to-[#3d4fc8] py-14 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-white text-center tracking-tight mb-10">
            {country === "india" ? "Chunav Prakriya — Ek Nazar Mein" : "The Election Process at a Glance"}
          </h2>
          <div className="flex flex-wrap justify-center items-start gap-4">
            {c.steps.map((s, i) => (
              <div key={s.n} className="flex items-start gap-4">
                <div className="flex flex-col items-center text-center min-w-[90px]">
                  <div className="w-12 h-12 rounded-full bg-white/15 border-2 border-white/40 flex items-center justify-center text-xl font-black text-[#ffdf9e] mb-2">{s.n}</div>
                  <p className="text-white font-bold text-sm">{s.title}</p>
                  <p className="text-white/75 text-xs text-center">{s.desc}</p>
                </div>
                {i < c.steps.length - 1 && <span className="text-white/40 text-2xl mt-3 hidden sm:block">→</span>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
