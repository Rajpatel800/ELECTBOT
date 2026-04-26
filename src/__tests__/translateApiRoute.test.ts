/** @jest-environment node */
import { POST } from "../app/api/translate/route";
import { NextRequest } from "next/server";

// Mock fetch
global.fetch = jest.fn();

describe("Translate API Route", () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it("should return 400 if text is missing", async () => {
    const req = new NextRequest("http://localhost/api/translate", {
      method: "POST",
      body: JSON.stringify({ targetLang: "hi" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("text is required.");
  });

  it("should return 400 if targetLang is invalid", async () => {
    const req = new NextRequest("http://localhost/api/translate", {
      method: "POST",
      body: JSON.stringify({ text: "hello", targetLang: "fr" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("should successfully translate text", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [[["नमस्ते", "hello"]]],
    });

    const req = new NextRequest("http://localhost/api/translate", {
      method: "POST",
      body: JSON.stringify({ text: "hello", targetLang: "hi" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.translatedText).toBe("नमस्ते");
  });

  it("should handle external fetch errors (502)", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const req = new NextRequest("http://localhost/api/translate", {
      method: "POST",
      body: JSON.stringify({ text: "hello", targetLang: "hi" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(502);
  });
});
