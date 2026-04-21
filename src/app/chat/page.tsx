"use client";
// src/app/chat/page.tsx
import { useState, useRef, useEffect } from "react";
import { useCountry } from "@/lib/countryContext";
import { getLocalAnswer, indiaChips, usaChips } from "@/lib/countryData";
import ReactMarkdown from "react-markdown";

interface Message { role: "user" | "bot"; content: string; }

const SYSTEM_PROMPT_INDIA = `You are ElectBot, a friendly AI assistant for Indian civic and election education. Help users understand:
- How to apply for Voter ID (EPIC card) and Form 6 registration at voters.eci.gov.in
- Types of elections: Lok Sabha, Rajya Sabha, Vidhan Sabha, local body
- Voting day: EVM, VVPAT, NOTA, indelible ink
- Election Commission of India (ECI), Model Code of Conduct
- Voter rights (Article 326, 1950 helpline, cVIGIL app)
- Upcoming elections: Bihar 2025, State assemblies, Lok Sabha 2029
Keep answers concise, friendly, and accurate. Use simple language and emojis. You can use some Hindi phrases. For non-election questions, politely redirect.`;

const SYSTEM_PROMPT_USA = `You are ElectBot, a friendly AI assistant for U.S. civic and election education. Help users understand:
- How to register to vote at vote.gov (it's free!)
- Types of elections: General, Primary, Local, Special
- Voting day: ID requirements, polling places, early voting, mail-in ballots
- Electoral College, how winners are decided
- Voter rights & constitutional amendments (15th, 19th, 24th, 26th)
Keep answers concise, friendly, and accurate. Use simple language and emojis. For non-election questions, politely redirect.`;

export default function ChatPage() {
  const { country } = useCountry();

  const initMsg = country === "india"
    ? "**Namaste! Main ElectBot hoon 🗳️** — aapka AI-powered Indian election guide!\n\nMain aapki madad kar sakta hoon:\n- 🪪 Voter ID (EPIC) card ke baare mein\n- 🗳️ Voting process (EVM, VVPAT, NOTA)\n- 🗓️ Upcoming elections in India\n- ⚖️ Voter rights aur ECI\n\nKya jaanna chahte hain aap?"
    : "Hi! I'm **ElectBot** 🗳️ — your AI-powered election guide. I can help you understand the election process, voter registration, timelines, and much more!\n\nWhat would you like to learn today?";

  const [msgs, setMsgs] = useState<Message[]>([{ role: "bot", content: initMsg }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string>(() => typeof window !== "undefined" ? localStorage.getItem("electbot_api_key") || "" : "");
  const [showModal, setShowModal] = useState(false);
  const [keyInput, setKeyInput] = useState("");
  const [chipsVisible, setChipsVisible] = useState(true);
  const [history, setHistory] = useState<{ role: string; parts: { text: string }[] }[]>([]);
  const [prevCountry, setPrevCountry] = useState(country);
  const bottomRef = useRef<HTMLDivElement>(null);

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
  const systemPrompt = country === "india" ? SYSTEM_PROMPT_INDIA : SYSTEM_PROMPT_USA;

  const getResponse = async (userMessage: string): Promise<string> => {
    if (apiKey) {
      try {
        const messages = [...history, { role: "user", parts: [{ text: userMessage }] }];
        const body = {
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: messages,
          generationConfig: { temperature: 0.7, maxOutputTokens: 512, topP: 0.9 },
        };
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
          { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }
        );
        if (!res.ok) {
          if (res.status === 400 || res.status === 401) return "❌ **Invalid API Key.** Please click 🔑 and check your key.";
          if (res.status === 429) return "⏳ **Rate limit reached.** Please wait and try again.";
          return `❌ API error (${res.status}). Using built-in answers.`;
        }
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        if (text) {
          setHistory((h) => [...h.slice(-18), { role: "user", parts: [{ text: userMessage }] }, { role: "model", parts: [{ text }] }]);
          return text;
        }
      } catch { /* fall through */ }
    }
    return getLocalAnswer(userMessage, country);
  };

  const send = async (msg?: string) => {
    const text = (msg || input).trim();
    if (!text || loading) return;
    setChipsVisible(false);
    setInput("");
    setMsgs((m) => [...m, { role: "user", content: text }]);
    setLoading(true);
    try {
      const response = await new Promise<string>((resolve) =>
        setTimeout(async () => resolve(await getResponse(text)), 600)
      );
      setMsgs((m) => [...m, { role: "bot", content: response }]);
    } catch {
      setMsgs((m) => [...m, { role: "bot", content: "❌ Something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const saveKey = () => {
    const k = keyInput.trim();
    setApiKey(k);
    localStorage.setItem("electbot_api_key", k);
    setShowModal(false);
    setKeyInput("");
    const confirmMsg = k
      ? `✅ **Gemini API key saved!** I'm now powered by Gemini 2.0 Flash. ${country === "india" ? "Ab kuch bhi poochhen! 🗳️" : "Ask me anything! 🗳️"}`
      : `🤖 ${country === "india" ? "Built-in answers use kar raha hoon. Chunav ke baare mein kuch bhi poochhen!" : "Running on built-in answers. Still ready to help with all election questions!"}`;
    setMsgs((m) => [...m, { role: "bot", content: confirmMsg }]);
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col" style={{ height: "calc(100vh - 65px - 64px)" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3.5 bg-white border-b border-[#c6c5d4]/40 shadow-sm flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1a237e] to-[#3d4fc8] flex items-center justify-center text-xl">🤖</div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-bold text-[#1a237e] text-base">ElectBot</p>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${country === "india" ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"}`}>
              {country === "india" ? "🇮🇳 India Mode" : "🇺🇸 USA Mode"}
            </span>
          </div>
          <p className="text-xs text-[#767683]">Powered by Gemini AI</p>
        </div>
        <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
          <span className="w-2 h-2 rounded-full bg-green-500 blink" /> Online
        </span>
        <button
          onClick={() => { setKeyInput(apiKey); setShowModal(true); }}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${apiKey ? "border-green-300 bg-green-50 text-green-700 hover:bg-green-100" : "border-[#c6c5d4] bg-[#efecf5] text-[#1a237e] hover:bg-[#e0e0ff]"}`}
        >
          {apiKey ? "🟢 Gemini AI" : "🔑 Add API Key"}
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4 bg-[#fbf8ff]">
        {msgs.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${m.role === "user" ? "bg-[#eae7ef]" : "bg-gradient-to-br from-[#1a237e] to-[#3d4fc8]"}`}>
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
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1a237e] to-[#3d4fc8] flex items-center justify-center text-lg">🤖</div>
            <div className="bg-white shadow-sm border border-[#c6c5d4]/20 rounded-2xl rounded-tl-md px-5 py-4">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#3d4fc8] typing-dot" />
                <div className="w-2 h-2 rounded-full bg-[#3d4fc8] typing-dot" />
                <div className="w-2 h-2 rounded-full bg-[#3d4fc8] typing-dot" />
              </div>
            </div>
          </div>
        )}

        {chipsVisible && msgs.length <= 1 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {chips.map((c) => (
              <button key={c.label} onClick={() => send(c.msg)}
                className="px-3.5 py-2 rounded-full text-xs font-semibold bg-white border border-[#c6c5d4] text-[#1a237e] hover:bg-[#eae7ef] hover:border-[#3d4fc8] transition-all shadow-sm">
                {c.label}
              </button>
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-t border-[#c6c5d4]/40 flex-shrink-0">
        <input
          className="flex-1 px-4 py-3 rounded-xl bg-[#efecf5] text-sm text-[#1b1b21] outline-none focus:ring-2 focus:ring-[#3d4fc8] disabled:opacity-50"
          placeholder={country === "india" ? "Chunav ke baare mein kuch bhi poochhen..." : "Ask anything about elections..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
          disabled={loading}
        />
        <button onClick={() => send()} disabled={!input.trim() || loading}
          className="w-11 h-11 rounded-xl bg-gradient-to-r from-[#1a237e] to-[#3d4fc8] text-white flex items-center justify-center text-lg disabled:opacity-40 hover:-translate-y-0.5 hover:shadow-lg transition-all">
          ➤
        </button>
      </div>

      {/* API Key Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl p-7 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-black text-[#1a237e] mb-1">🔑 Gemini API Key <span className="text-sm font-normal text-[#767683]">(Optional)</span></h3>
            <p className="text-sm text-[#454652] mb-4 leading-relaxed">
              ElectBot works <strong>without an API key</strong> using built-in answers.<br />
              Add a free key for unlimited AI answers from Gemini 2.0 Flash.<br />
              Get one at <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-[#3d4fc8] font-semibold underline">aistudio.google.com</a>
            </p>
            <input type="password" value={keyInput} onChange={(e) => setKeyInput(e.target.value)}
              placeholder="AIza... (leave blank for built-in answers)"
              className="w-full px-4 py-3 border-2 border-[#c6c5d4] rounded-xl font-mono text-sm outline-none focus:border-[#3d4fc8] mb-4" />
            <div className="flex gap-3">
              <button onClick={saveKey} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#1a237e] to-[#3d4fc8] text-white font-bold text-sm">✅ Save & Activate</button>
              <button onClick={() => { setApiKey(""); localStorage.removeItem("electbot_api_key"); setShowModal(false); }} className="flex-1 py-3 rounded-xl bg-[#ffdad6] text-[#ba1a1a] font-bold text-sm">🗑️ Remove Key</button>
            </div>
            <button onClick={() => setShowModal(false)} className="w-full mt-2.5 py-2.5 rounded-xl bg-[#efecf5] text-[#454652] font-semibold text-sm">Cancel — Use built-in answers</button>
            <p className="text-xs text-[#767683] mt-3 text-center">🔒 Stored locally in your browser only.</p>
          </div>
        </div>
      )}
    </div>
  );
}
