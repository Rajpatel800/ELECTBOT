/**
 * src/app/api/chat/route.ts
 *
 * Server-side API route for the ElectBot AI assistant.
 *
 * AI Backend Strategy (dual-mode):
 *  - Cloud Run / Production: Uses Google Cloud Vertex AI (`@google-cloud/vertexai`)
 *    with Application Default Credentials (ADC) — no API key needed, fully managed.
 *    Activated when GOOGLE_CLOUD_PROJECT env var is set.
 *  - Local Development: Falls back to Gemini Developer API (`@google/generative-ai`)
 *    using GEMINI_API_KEY — no gcloud auth required locally.
 *
 * Security controls:
 *  - Rate limiting: 20 requests per IP per minute (sliding window)
 *  - Input validation: message length capped at 1000 characters
 *  - Request timeout: Gemini call aborted after 15 seconds
 *  - Typed error handling: no `any` types
 */

import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const GEMINI_MODEL        = "gemini-2.5-flash" as const;
const MAX_MESSAGE_LENGTH  = 1000;
const MAX_HISTORY_TURNS   = 20;
const REQUEST_TIMEOUT_MS  = 20_000;

// Simple in-process rate limiter: {ip -> {count, windowStart}}
const rateLimitMap = new Map<string, { count: number; windowStart: number }>();
const RATE_LIMIT_WINDOW_MS    = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 20;

// ─────────────────────────────────────────────
// System prompts (country-specific)
// ─────────────────────────────────────────────
const SYSTEM_PROMPTS: Record<string, string> = {
  india: `You are ElectBot, a professional and friendly AI assistant specializing in Indian civic and election education. Your role is strictly limited to this domain.

Help users understand:
- Voter registration: EPIC card (Form 6) via voters.eci.gov.in
- Types of elections: Lok Sabha, Rajya Sabha, Vidhan Sabha, Panchayat, Municipal, By-elections
- Election day: EVM operation, VVPAT slip verification, NOTA, indelible ink
- Institutional roles: Election Commission of India (ECI), Chief Election Commissioner, Article 324
- Voter rights: Article 326, cVIGIL App, 1950 voter helpline, home voting for seniors/PwD
- Upcoming elections: Bihar 2025, state assemblies 2025-26, Lok Sabha 2029
- Model Code of Conduct, political party recognition, election expenditure limits

Rules:
- Answer only election and civic education questions. Politely decline all others.
- Be accurate. Cite official sources (eci.gov.in, voters.eci.gov.in) when relevant.
- Use clear, simple language. You may use common Hindi phrases naturally.
- Keep responses concise (under 300 words). Use bullet points and emojis for clarity.`,

  usa: `You are ElectBot, a professional and friendly AI assistant specializing in U.S. civic and election education. Your role is strictly limited to this domain.

Help users understand:
- Voter registration: how to register at vote.gov, eligibility, state-specific deadlines
- Types of elections: General, Presidential, Midterm, Primary, Caucus, Special, Local
- Voting day: ID requirements by state, polling place procedures, early voting, mail-in/absentee ballots
- The Electoral College: how electors are appointed, the 270-vote threshold, winner-takes-all vs. proportional
- Constitutional protections: 15th, 19th, 24th, and 26th Amendments; Voting Rights Act of 1965
- Voter rights: secret ballot, the line rule, provisional ballots, anti-intimidation laws
- Upcoming elections: 2026 midterms, 2028 presidential election

Rules:
- Answer only election and civic education questions. Politely decline all others.
- Be accurate. Cite official sources (vote.gov, usa.gov) when relevant.
- Keep responses concise (under 300 words). Use bullet points and emojis for clarity.`,
};

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface ChatMessage {
  role: "user" | "model" | "bot";
  parts?: Array<{ text: string }>;
  content?: string;
}

interface ChatRequestBody {
  message: string;
  country?: string;
  history?: ChatMessage[];
}

// Shared response shape used by both AI backends
interface GenerateResult {
  text: string;
}

// ─────────────────────────────────────────────
// Rate limiter helper
// ─────────────────────────────────────────────
function isRateLimited(ip: string): boolean {
  const now   = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return false;
  }
  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) return true;
  entry.count += 1;
  return false;
}

// ─────────────────────────────────────────────
// Vertex AI backend (Cloud Run / production)
// ─────────────────────────────────────────────
async function callVertexAI(
  message: string,
  systemPrompt: string,
  history: ChatMessage[]
): Promise<GenerateResult> {
  const { VertexAI } = await import("@google-cloud/vertexai");

  const projectId = process.env.GOOGLE_CLOUD_PROJECT!;
  const location  = process.env.VERTEX_AI_LOCATION ?? "us-central1";

  const vertexAI = new VertexAI({ project: projectId, location });
  const model = vertexAI.getGenerativeModel({
    model: GEMINI_MODEL,
    systemInstruction: { role: "system", parts: [{ text: systemPrompt }] },
    generationConfig: {
      maxOutputTokens: 512,
      temperature:     0.7,
      topP:            0.9,
    },
  });

  // Build conversation history
  const formattedHistory = history
    .slice(-MAX_HISTORY_TURNS)
    .map((msg: ChatMessage) => ({
      role:  msg.role === "bot" ? "model" : (msg.role as "user" | "model"),
      parts: msg.parts ?? [{ text: msg.content ?? "" }],
    }));

  const chat = model.startChat({ history: formattedHistory });
  const result = await chat.sendMessage(message.trim());
  const response = await result.response;
  const text = response.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  return { text };
}

// ─────────────────────────────────────────────
// Gemini Developer API backend (local dev fallback)
// ─────────────────────────────────────────────
async function callGeminiAPI(
  message: string,
  systemPrompt: string,
  history: ChatMessage[]
): Promise<GenerateResult> {
  const { GoogleGenerativeAI, type: _type } = await import("@google/generative-ai") as
    typeof import("@google/generative-ai");

  const apiKey = process.env.GEMINI_API_KEY ?? "";
  const genAI  = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: GEMINI_MODEL,
    systemInstruction: systemPrompt,
  });

  // Build conversation history
  const formattedHistory = history
    .slice(-MAX_HISTORY_TURNS)
    .map((msg: ChatMessage) => ({
      role:  msg.role === "bot" ? "model" : (msg.role as "user" | "model"),
      parts: msg.parts ?? [{ text: msg.content ?? "" }],
    }));

  const chat = model.startChat({
    history: formattedHistory,
    generationConfig: {
      maxOutputTokens: 512,
      temperature:     0.7,
      topP:            0.9,
    },
  });

  const result = await chat.sendMessage(message.trim());
  const text   = result.response.text();
  return { text };
}

// ─────────────────────────────────────────────
// Route handler
// ─────────────────────────────────────────────
export async function POST(req: NextRequest): Promise<NextResponse> {
  // ── Rate limiting ──────────────────────────
  const forwarded = req.headers.get("x-forwarded-for");
  const ip        = forwarded ? forwarded.split(",")[0].trim() : "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment before trying again." },
      { status: 429 }
    );
  }

  // ── Parse & validate request body ─────────
  let body: ChatRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON in request body." }, { status: 400 });
  }

  const { message, country = "india", history = [] } = body;

  if (!message || typeof message !== "string" || !message.trim()) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { error: `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.` },
      { status: 400 }
    );
  }

  const validCountries = new Set(Object.keys(SYSTEM_PROMPTS));
  const safeCountry    = validCountries.has(country) ? country : "india";
  const systemPrompt   = SYSTEM_PROMPTS[safeCountry];

  // ── Select AI backend & call with timeout ──
  // Vertex AI is used when GOOGLE_CLOUD_PROJECT is set (Cloud Run).
  // Otherwise falls back to Gemini Developer API (local dev).
  const useVertexAI = Boolean(process.env.GOOGLE_CLOUD_PROJECT);

  const aiCall = useVertexAI
    ? callVertexAI(message, systemPrompt, history)
    : callGeminiAPI(message, systemPrompt, history);

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Request timed out.")), REQUEST_TIMEOUT_MS)
  );

  try {
    const { text } = await Promise.race([aiCall, timeoutPromise]);

    if (!text) {
      return NextResponse.json(
        { error: "The AI returned an empty response. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      text,
      backend: useVertexAI ? "vertex-ai" : "gemini-api",
    });
  } catch (err: unknown) {
    const msg       = err instanceof Error ? err.message : "An unexpected error occurred.";
    const isTimeout = msg === "Request timed out.";

    if (process.env.NODE_ENV !== "test") {
      console.error("[ElectBot API] AI error:", msg);
    }

    return NextResponse.json(
      {
        error: isTimeout
          ? "The request timed out. Please try again."
          : "Failed to get a response. Please try again.",
      },
      { status: isTimeout ? 504 : 500 }
    );
  }
}
