/**
 * src/app/api/translate/route.ts
 *
 * Server-side proxy for the Google Cloud Translation API.
 * Keeps the API key server-side and prevents browser CORS issues.
 *
 * POST /api/translate
 * Body: { text: string, targetLang: "hi" | "en" }
 * Response: { translatedText: string }
 */

import { NextRequest, NextResponse } from "next/server";

interface TranslateRequestBody {
  text: string;
  targetLang: string;
}

// Rate limit: max 30 translation requests per minute per IP
const rateLimitMap = new Map<string, { count: number; windowStart: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.windowStart > 60_000) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return false;
  }
  if (entry.count >= 30) return true;
  entry.count += 1;
  return false;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip        = forwarded ? forwarded.split(",")[0].trim() : "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many translation requests." }, { status: 429 });
  }

  let body: TranslateRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { text, targetLang } = body;

  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return NextResponse.json({ error: "text is required." }, { status: 400 });
  }

  if (!["hi", "en"].includes(targetLang)) {
    return NextResponse.json({ error: "targetLang must be 'hi' or 'en'." }, { status: 400 });
  }

  // Cap text length to prevent abuse
  const cappedText = text.slice(0, 5000);

  try {
    // Google Translate free endpoint — no API key required for reasonable usage
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(cappedText)}`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      throw new Error(`Google Translate returned ${response.status}`);
    }

    // Format: [[[chunk, original, ...], ...], null, "en"]
    const data = await response.json() as unknown[][];
    const chunks = data[0] as string[][];
    const translatedText = chunks.map((chunk) => chunk[0]).join("");

    if (!translatedText) {
      throw new Error("Empty translation response.");
    }

    return NextResponse.json({ translatedText });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[Translate API] Error:", message);
    return NextResponse.json(
      { error: "Translation failed. Please try again." },
      { status: 502 }
    );
  }
}
