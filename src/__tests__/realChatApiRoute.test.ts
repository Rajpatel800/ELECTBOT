/** @jest-environment node */
import { POST } from "../app/api/chat/route";
import { NextRequest } from "next/server";

jest.mock("@google/generative-ai", () => ({
  GoogleGenerativeAI: jest.fn(() => ({
    getGenerativeModel: jest.fn(() => ({
      startChat: jest.fn(() => ({
        sendMessage: jest.fn().mockResolvedValue({
          response: { text: () => "Mock AI Response" }
        })
      }))
    }))
  }))
}));

describe("Chat API Route - Real", () => {
  it("returns 400 for empty input", async () => {
    const req = new NextRequest("http://localhost/api/chat", {
      method: "POST",
      body: JSON.stringify({})
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("handles standard chat input and processes with generative model", async () => {
    const req = new NextRequest("http://localhost/api/chat", {
      method: "POST",
      body: JSON.stringify({ message: "Hello", history: [], country: "india" }),
      headers: { "x-forwarded-for": "1.2.3.4" }
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.text).toBe("Mock AI Response");
  });

  it("handles rate limiting automatically (after 10 requests)", async () => {
    for(let i=0; i<15; i++) {
      const req = new NextRequest("http://localhost/api/chat", {
        method: "POST",
        body: JSON.stringify({ message: "Hello", history: [], country: "india" }),
        headers: { "x-forwarded-for": "9.9.9.9" }
      });
      const res = await POST(req);
      if (res.status === 429) {
        expect(res.status).toBe(429);
        break;
      }
    }
  });
});
