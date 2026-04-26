"use client";
// src/app/chat/page.tsx
import { useState, useRef, useEffect } from "react";
import { useCountry } from "@/lib/countryContext";
import { getLocalAnswer, indiaChips, usaChips } from "@/lib/countryData";
import ReactMarkdown from "react-markdown";

interface Message { role: "user" | "bot"; content: string; }

export default function ChatPage() {
  const { country } = useCountry();

  const initMsg = country === "india"
    ? "**Namaste! Main ElectBot hoon 🗳️** — aapka AI-powered Indian election guide!\n\nMain aapki madad kar sakta hoon:\n- 🪪 Voter ID (EPIC) card ke baare mein\n- 🗳️ Voting process (EVM, VVPAT, NOTA)\n- 🗓️ Upcoming elections in India\n- ⚖️ Voter rights aur ECI\n\nKya jaanna chahte hain aap?"
    : "Hi! I'm **ElectBot** 🗳️ — your AI-powered election guide. I can help you understand the election process, voter registration, timelines, and much more!\n\nWhat would you like to learn today?";

  const [msgs, setMsgs] = useState<Message[]>([{ role: "bot", content: initMsg }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chipsVisible, setChipsVisible] = useState(true);
  const [history, setHistory] = useState<{ role: string; parts: { text: string }[] }[]>([]);
  const [prevCountry, setPrevCountry] = useState(country);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset chat when country changes
  useEffect(() => {
    if (country !== prevCountry) {
      setPrevCountry(country);
      setHistory([]);
      setChipsVisible(true);
      const newMsg = country === "india"
        ? "**Namaste! Main ElectBot hoon 🗳️** — aapka AI-powered Indian election guide!\n\nMain aapki madad kar sakta hoon:\n- 🪪 Voter ID (EPIC) card ke baare mein\n- 🗳️ Voting process (EVM, VVPAT, NOTA)\n- 🗓️ Upcoming elections in India\n- ⚖️ Voter rights aur ECI\n\nKya jaanna chahte hain aap?"
        : "Hi! I'm **ElectBot** 🗳️ — your AI-powered election guide!\n\nI can help you understand:\n- 🪪 Voter registration\n- 🗳️ Voting day, Electoral College\n- 🗓️ Upcoming elections\n- ⚖️ Your voter rights\n\nWhat would you like to learn?";
      setMsgs([{ role: "bot", content: newMsg }]);
    }
  }, [country, prevCountry]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, loading]);

  const chips = country === "india" ? indiaChips : usaChips;

  const getResponse = async (userMessage: string): Promise<string> => {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          country: country,
          history: history,
        })
      });

      if (!res.ok) {
        console.error("API Route Error:", await res.text());
        return `❌ Oops, ElectBot is currently taking a coffee break. (Server error)\n\nIn the meantime, I can still answer basic questions:\n\n` + getLocalAnswer(userMessage, country);
      }

      const data = await res.json();
      
      if (data.text) {
        setHistory((h) => [...h.slice(-18), { role: "user", parts: [{ text: userMessage }] }, { role: "bot", parts: [{ text: data.text }] }]);
        return data.text;
      }
      return getLocalAnswer(userMessage, country);
    } catch {
      return getLocalAnswer(userMessage, country);
    }
  };

  const send = async (msg?: string) => {
    const text = (msg || input).trim();
    if (!text || loading) return;
    setChipsVisible(false);
    setInput("");
    setMsgs((m) => [...m, { role: "user", content: text }]);
    setLoading(true);
    try {
      const response = await getResponse(text);
      setMsgs((m) => [...m, { role: "bot", content: response }]);
    } catch {
      setMsgs((m) => [...m, { role: "bot", content: "❌ Something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
      // Return focus to input after bot responds
      inputRef.current?.focus();
    }
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col" style={{ height: "calc(100vh - 65px - 64px)" }}>
      {/* Header */}
      <header className="flex items-center gap-3 px-5 py-3.5 bg-white border-b border-[#c6c5d4]/40 shadow-sm flex-shrink-0">
        <div
          className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1a237e] to-[#3d4fc8] flex items-center justify-center text-xl"
          aria-hidden="true"
        >
          🤖
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-bold text-[#1a237e] text-base" id="chat-title">ElectBot</p>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${country === "india" ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"}`}>
              {country === "india" ? "🇮🇳 India Mode" : "🇺🇸 USA Mode"}
            </span>
          </div>
          <p className="text-xs text-[#767683]">Powered by Gemini AI (Server-Side)</p>
        </div>
        <span className="flex items-center gap-1 text-xs font-semibold text-green-600" role="status" aria-label="ElectBot is online">
          <span className="w-2 h-2 rounded-full bg-green-500 blink" aria-hidden="true" />
          Online
        </span>
      </header>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-5 py-5 space-y-4 bg-[#fbf8ff]"
        role="log"
        aria-label="Chat messages"
        aria-live="polite"
        aria-atomic="false"
        aria-busy={loading}
        aria-labelledby="chat-title"
      >
        {msgs.map((m, i) => (
          <div
            key={i}
            className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
            role="article"
            aria-label={m.role === "user" ? "You said" : "ElectBot replied"}
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${m.role === "user" ? "bg-[#eae7ef]" : "bg-gradient-to-br from-[#1a237e] to-[#3d4fc8]"}`}
              aria-hidden="true"
            >
              {m.role === "user" ? "👤" : "🤖"}
            </div>
            <div className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed msg-content ${
              m.role === "user"
                ? "bg-gradient-to-r from-[#1a237e] to-[#3d4fc8] text-white rounded-tr-md"
                : "bg-white shadow-sm border border-[#c6c5d4]/20 text-[#1b1b21] rounded-tl-md"
            }`}>
              <ReactMarkdown>{m.content}</ReactMarkdown>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3" role="status" aria-label="ElectBot is typing a response">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1a237e] to-[#3d4fc8] flex items-center justify-center text-lg" aria-hidden="true">🤖</div>
            <div className="bg-white shadow-sm border border-[#c6c5d4]/20 rounded-2xl rounded-tl-md px-5 py-4">
              <div className="flex gap-1.5" aria-hidden="true">
                <div className="w-2 h-2 rounded-full bg-[#3d4fc8] typing-dot" />
                <div className="w-2 h-2 rounded-full bg-[#3d4fc8] typing-dot" />
                <div className="w-2 h-2 rounded-full bg-[#3d4fc8] typing-dot" />
              </div>
            </div>
          </div>
        )}

        {chipsVisible && msgs.length <= 1 && (
          <div className="flex flex-wrap gap-2 pt-1" role="group" aria-label="Suggested questions">
            {chips.map((c) => (
              <button
                key={c.label}
                onClick={() => send(c.msg)}
                className="px-3.5 py-2 rounded-full text-xs font-semibold bg-white border border-[#c6c5d4] text-[#1a237e] hover:bg-[#eae7ef] hover:border-[#3d4fc8] transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3d4fc8] focus:ring-offset-1"
                aria-label={`Ask: ${c.label}`}
              >
                {c.label}
              </button>
            ))}
          </div>
        )}

        <div ref={bottomRef} aria-hidden="true" />
      </div>

      {/* Input */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-t border-[#c6c5d4]/40 flex-shrink-0">
        <label htmlFor="chat-input" className="sr-only">
          {country === "india" ? "Apna sawaal yahan likhein" : "Type your question here"}
        </label>
        <input
          id="chat-input"
          ref={inputRef}
          className="flex-1 px-4 py-3 rounded-xl bg-[#efecf5] text-sm text-[#1b1b21] outline-none focus:ring-2 focus:ring-[#3d4fc8] disabled:opacity-50"
          placeholder={country === "india" ? "Chunav ke baare mein kuch bhi poochhen..." : "Ask anything about elections..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
          disabled={loading}
          aria-label={country === "india" ? "Type your question about Indian elections" : "Type your question about US elections"}
          aria-describedby="chat-title"
          autoComplete="off"
        />
        <button
          onClick={() => send()}
          disabled={!input.trim() || loading}
          className="w-11 h-11 rounded-xl bg-gradient-to-r from-[#1a237e] to-[#3d4fc8] text-white flex items-center justify-center text-lg disabled:opacity-40 hover:-translate-y-0.5 hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#3d4fc8] focus:ring-offset-2"
          aria-label="Send message"
        >
          <span aria-hidden="true">➤</span>
        </button>
      </div>
    </div>
  );
}
