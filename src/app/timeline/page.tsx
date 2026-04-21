"use client";
// src/app/timeline/page.tsx
import { useState } from "react";
import { useCountry } from "@/lib/countryContext";
import { indiaTimeline, usaTimeline, TimelineTab, TimelineItem } from "@/lib/countryData";

function TimelineItemCard({ item }: { item: TimelineItem }) {
  return (
    <div className="relative pl-10 mb-8">
      <div className={`absolute left-0 -translate-x-1/2 top-3.5 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm z-10 ${
        item.status === "completed" ? "bg-gradient-to-br from-green-600 to-green-400 text-white" :
        item.status === "current" ? "bg-gradient-to-br from-[#1a237e] to-[#3d4fc8] text-[#ffc107]" :
        item.status === "gold" ? "bg-gradient-to-br from-[#ff8f00] to-[#ffc107] text-white" :
        "bg-[#e4e1ea] text-[#767683] border-2 border-[#c6c5d4]"
      }`}>
        {item.dot}
        {item.status === "current" && (
          <div className="absolute w-12 h-12 rounded-full border-2 border-[#3d4fc8] ping-slow" />
        )}
      </div>
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#c6c5d4]/20">
        <p className="text-[11px] font-semibold text-[#767683] uppercase tracking-wider mb-1">{item.date}</p>
        <h4 className="font-bold text-[#1a237e] mb-1.5">{item.title}</h4>
        <p className="text-sm text-[#454652] leading-relaxed mb-3">{item.desc}</p>
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${item.tagColor}`}>{item.tag}</span>
        {item.reminder && (
          <button className="ml-3 text-xs font-bold px-3 py-1 rounded-lg bg-[#ffdf9e] text-[#785900] hover:bg-[#fdc003] transition-colors">
            🔔 Reminder Set
          </button>
        )}
      </div>
    </div>
  );
}

export default function TimelinePage() {
  const { country } = useCountry();
  const tabs: TimelineTab[] = country === "india" ? indiaTimeline : usaTimeline;
  const [activeTab, setActiveTab] = useState(0);

  // Reset to first tab when country changes
  const currentTab = tabs[activeTab] || tabs[0];

  return (
    <>
      {/* Hero */}
      <div className={`px-6 py-12 text-white ${country === "india" ? "bg-gradient-to-r from-[#FF6B00] to-[#1a237e]" : "bg-gradient-to-r from-[#1a237e] to-[#3d4fc8]"}`}>
        <div className="max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 border border-white/30 mb-3">
            {country === "india" ? "🇮🇳 Chunav Calendar" : "🗓️ Election Calendar"}
          </span>
          <h1 className="text-4xl font-black tracking-tight mb-2">
            {country === "india" ? "Chunav Timeline — India 🇮🇳" : "Election Timelines 🇺🇸"}
          </h1>
          <p className="opacity-85">
            {country === "india"
              ? "Bharat ki chunav prakriya ke key dates track karein"
              : "Track every key date in the democratic process"}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Country banner */}
        <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold mb-6 ${
          country === "india" ? "bg-orange-50 border border-orange-200 text-orange-700" : "bg-blue-50 border border-blue-200 text-blue-700"
        }`}>
          {country === "india"
            ? "🇮🇳 Showing: Lok Sabha 2024, State Elections 2025, Future Elections"
            : "🇺🇸 Showing: 2024 General, Primary, and 2026 Midterms"}
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 bg-[#eae7ef] p-1.5 rounded-xl mb-8 overflow-x-auto">
          {tabs.map((tab, i) => (
            <button key={tab.key} onClick={() => setActiveTab(i)}
              className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === i ? "bg-white text-[#1a237e] shadow-sm" : "text-[#454652] hover:text-[#1a237e]"
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-6 text-sm text-[#454652]">
          <span>✅ Completed</span>
          <span>🔵 Current/Key</span>
          <span>🏆 Major Event</span>
          <span>⬜ Upcoming</span>
        </div>

        {/* Timeline */}
        <div className="relative border-l-2 border-[#c6c5d4] pl-4">
          {currentTab.items.map((item, i) => (
            <TimelineItemCard key={i} item={item} />
          ))}
        </div>
      </div>
    </>
  );
}
