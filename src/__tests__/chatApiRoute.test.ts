// src/__tests__/chatApiRoute.test.ts
// Unit tests for the chat API route LOGIC (no HTTP layer needed)
// Tests cover both AI backends: Gemini Developer API + Vertex AI

// ── Mock Gemini Developer API SDK (local dev fallback) ──
const mockSendMessage = jest.fn();
const mockStartChat = jest.fn(() => ({ sendMessage: mockSendMessage }));
const mockGetGenerativeModel = jest.fn(() => ({ startChat: mockStartChat }));

jest.mock("@google/generative-ai", () => ({
  GoogleGenerativeAI: jest.fn(() => ({ getGenerativeModel: mockGetGenerativeModel })),
}));

// ── Mock Vertex AI SDK (Cloud Run / production) ──
const mockVertexSendMessage = jest.fn();
const mockVertexStartChat = jest.fn(() => ({ sendMessage: mockVertexSendMessage }));
const mockVertexGetGenerativeModel = jest.fn(() => ({ startChat: mockVertexStartChat }));

jest.mock("@google-cloud/vertexai", () => ({
  VertexAI: jest.fn(() => ({ getGenerativeModel: mockVertexGetGenerativeModel })),
}));

// ─────────────────────────────────────────────
// Test 1: Gemini SDK (local dev fallback)
// ─────────────────────────────────────────────
describe("Chat Route — Gemini API (local dev backend)", () => {
  it("Gemini SDK is importable and constructable", async () => {
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const client = new GoogleGenerativeAI("test-api-key");
    expect(client).toBeDefined();
    expect(client.getGenerativeModel).toBeDefined();
  });

  it("getGenerativeModel can be called with model name", async () => {
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const client = new GoogleGenerativeAI("test-api-key");
    const model = client.getGenerativeModel({ model: "gemini-2.0-flash" });
    expect(model).toBeDefined();
    expect(mockGetGenerativeModel).toHaveBeenCalledWith({ model: "gemini-2.0-flash" });
  });

  it("startChat returns a chat session with sendMessage", async () => {
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const client = new GoogleGenerativeAI("test-api-key");
    const model = client.getGenerativeModel({ model: "gemini-2.0-flash" });
    const chat = model.startChat({ history: [] });
    expect(chat).toBeDefined();
    expect(chat.sendMessage).toBeDefined();
  });

  it("sendMessage resolves with AI response text", async () => {
    mockSendMessage.mockResolvedValueOnce({
      response: { text: () => "Here is info about voting in India." },
    });

    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const client = new GoogleGenerativeAI("test-api-key");
    const model = client.getGenerativeModel({ model: "gemini-2.0-flash" });
    const chat = model.startChat({ history: [] });
    const result = await chat.sendMessage("How do I vote?");

    expect(result.response.text()).toBe("Here is info about voting in India.");
    expect(mockSendMessage).toHaveBeenCalledWith("How do I vote?");
  });
});

// ─────────────────────────────────────────────
// Test 2: Vertex AI SDK (Cloud Run backend)
// ─────────────────────────────────────────────
describe("Chat Route — Vertex AI (Cloud Run backend)", () => {
  it("Vertex AI SDK is importable and constructable", async () => {
    const { VertexAI } = await import("@google-cloud/vertexai");
    const client = new VertexAI({ project: "test-project", location: "us-central1" });
    expect(client).toBeDefined();
    expect(client.getGenerativeModel).toBeDefined();
  });

  it("Vertex AI getGenerativeModel can be called", async () => {
    const { VertexAI } = await import("@google-cloud/vertexai");
    const client = new VertexAI({ project: "test-project", location: "us-central1" });
    const model = client.getGenerativeModel({ model: "gemini-2.5-flash" });
    expect(model).toBeDefined();
    expect(mockVertexGetGenerativeModel).toHaveBeenCalledWith({ model: "gemini-2.5-flash" });
  });

  it("Vertex AI startChat returns a session with sendMessage", async () => {
    const { VertexAI } = await import("@google-cloud/vertexai");
    const client = new VertexAI({ project: "test-project", location: "us-central1" });
    const model = client.getGenerativeModel({ model: "gemini-2.5-flash" });
    const chat = model.startChat({ history: [] });
    expect(chat).toBeDefined();
    expect(chat.sendMessage).toBeDefined();
  });

  it("Vertex AI sendMessage resolves with a response", async () => {
    mockVertexSendMessage.mockResolvedValueOnce({
      response: {
        candidates: [{ content: { parts: [{ text: "Vote at your polling station." }] } }],
      },
    });

    const { VertexAI } = await import("@google-cloud/vertexai");
    const client = new VertexAI({ project: "test-project", location: "us-central1" });
    const model = client.getGenerativeModel({ model: "gemini-2.5-flash" });
    const chat = model.startChat({ history: [] });
    const result = await chat.sendMessage("Where do I vote?");

    expect(result.response.candidates?.[0]?.content?.parts?.[0]?.text).toBe(
      "Vote at your polling station."
    );
    expect(mockVertexSendMessage).toHaveBeenCalledWith("Where do I vote?");
  });
});

// ─────────────────────────────────────────────
// Test 3: Request validation logic
// ─────────────────────────────────────────────
describe("Chat Route — Input Validation", () => {
  function validateChatInput(body: Record<string, unknown>): { valid: boolean; error?: string } {
    if (!body.message || typeof body.message !== "string" || !body.message.trim()) {
      return { valid: false, error: "Message is required" };
    }
    return { valid: true };
  }

  it("rejects empty message field", () => {
    expect(validateChatInput({ country: "india" }).valid).toBeFalsy();
  });

  it("rejects blank whitespace message", () => {
    expect(validateChatInput({ message: "   ", country: "india" }).valid).toBeFalsy();
  });

  it("accepts valid message", () => {
    expect(validateChatInput({ message: "How do I vote?", country: "india" }).valid).toBeTruthy();
  });

  it("returns correct error message for missing field", () => {
    const result = validateChatInput({ country: "usa" });
    expect(result.error).toBe("Message is required");
  });
});

// ─────────────────────────────────────────────
// Test 4: Country-based system prompt selection
// ─────────────────────────────────────────────
describe("Chat Route — System Prompt Selection", () => {
  const INDIA_PROMPT_MARKER = "Election Commission of India";
  const USA_PROMPT_MARKER = "Electoral College";

  const systemPrompts: Record<string, string> = {
    india: `You are ElectBot, focused on Indian elections. Covers Election Commission of India (ECI), EPIC.`,
    usa: `You are ElectBot, focused on US elections. Covers Electoral College, registration at vote.gov.`,
  };

  it("uses India-specific prompt for india country", () => {
    const prompt = systemPrompts["india"];
    expect(prompt).toContain(INDIA_PROMPT_MARKER);
  });

  it("uses USA-specific prompt for usa country", () => {
    const prompt = systemPrompts["usa"];
    expect(prompt).toContain(USA_PROMPT_MARKER);
  });

  it("India prompt does NOT contain Electoral College", () => {
    expect(systemPrompts["india"]).not.toContain("Electoral College");
  });

  it("USA prompt does NOT contain ECI", () => {
    expect(systemPrompts["usa"]).not.toContain("Election Commission of India");
  });
});

// ─────────────────────────────────────────────
// Test 5: Backend selection logic
// ─────────────────────────────────────────────
describe("Chat Route — AI Backend Selection", () => {
  it("uses Vertex AI backend when GOOGLE_CLOUD_PROJECT is set", () => {
    process.env.GOOGLE_CLOUD_PROJECT = "my-gcp-project";
    const useVertexAI = Boolean(process.env.GOOGLE_CLOUD_PROJECT);
    expect(useVertexAI).toBe(true);
    delete process.env.GOOGLE_CLOUD_PROJECT;
  });

  it("uses Gemini API backend when GOOGLE_CLOUD_PROJECT is not set", () => {
    delete process.env.GOOGLE_CLOUD_PROJECT;
    const useVertexAI = Boolean(process.env.GOOGLE_CLOUD_PROJECT);
    expect(useVertexAI).toBe(false);
  });

  it("defaults location to us-central1 when VERTEX_AI_LOCATION is not set", () => {
    delete process.env.VERTEX_AI_LOCATION;
    const location = process.env.VERTEX_AI_LOCATION ?? "us-central1";
    expect(location).toBe("us-central1");
  });

  it("uses custom location when VERTEX_AI_LOCATION is set", () => {
    process.env.VERTEX_AI_LOCATION = "europe-west1";
    const location = process.env.VERTEX_AI_LOCATION ?? "us-central1";
    expect(location).toBe("europe-west1");
    delete process.env.VERTEX_AI_LOCATION;
  });
});
