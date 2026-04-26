// src/__tests__/firestoreService.test.ts
// Tests for Firestore service logic using mocks — no real network calls!

// Mock the Firebase module so tests run without network access
jest.mock("@/lib/firebase", () => ({
  db: {},
}));

// Mock specific Firestore functions
jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  where: jest.fn(),
  Timestamp: {
    now: jest.fn().mockReturnValue({ toDate: () => new Date() }),
  },
}));

import { addDoc, getDocs } from "firebase/firestore";
import { submitQuizScore, getTopScores, getLearnModules } from "@/lib/firestoreService";

const mockAddDoc = addDoc as jest.MockedFunction<typeof addDoc>;
const mockGetDocs = getDocs as jest.MockedFunction<typeof getDocs>;

// ─────────────────────────────────────────────
// submitQuizScore
// ─────────────────────────────────────────────
describe("submitQuizScore()", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns a document ID on success", async () => {
    mockAddDoc.mockResolvedValueOnce({ id: "abc123" } as any);
    const id = await submitQuizScore("india", 500, 90);
    expect(id).toBe("abc123");
    expect(mockAddDoc).toHaveBeenCalledTimes(1);
  });

  it("returns null when Firestore throws an error", async () => {
    mockAddDoc.mockRejectedValueOnce(new Error("Network error"));
    const id = await submitQuizScore("usa", 300, 80);
    expect(id).toBeNull();
  });

  it("calls addDoc with correct country", async () => {
    mockAddDoc.mockResolvedValueOnce({ id: "xyz789" } as any);
    await submitQuizScore("india", 750, 100);
    const callArgs = (mockAddDoc as jest.Mock).mock.calls[0];
    expect(callArgs[1]).toMatchObject({ country: "india", score: 750, accuracy: 100 });
  });
});

// ─────────────────────────────────────────────
// getTopScores
// ─────────────────────────────────────────────
describe("getTopScores()", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns mapped scores from Firestore", async () => {
    const fakeDoc = (id: string, data: object) => ({ id, data: () => data });
    mockGetDocs.mockResolvedValueOnce({
      docs: [
        fakeDoc("doc1", { country: "india", score: 900, accuracy: 95, timestamp: { toDate: () => new Date() } }),
        fakeDoc("doc2", { country: "india", score: 750, accuracy: 80, timestamp: { toDate: () => new Date() } }),
      ],
    } as any);

    const scores = await getTopScores("india", 2);
    expect(scores).toHaveLength(2);
    expect(scores[0].score).toBe(900);
    expect(scores[0].country).toBe("india");
    expect(scores[1].score).toBe(750);
  });

  it("returns empty array on Firestore error", async () => {
    mockGetDocs.mockRejectedValueOnce(new Error("Firestore unavailable"));
    const scores = await getTopScores("usa", 5);
    expect(scores).toEqual([]);
  });

  it("returns empty array when no documents found", async () => {
    mockGetDocs.mockResolvedValueOnce({ docs: [] } as any);
    const scores = await getTopScores("india");
    expect(scores).toEqual([]);
  });
});

// ─────────────────────────────────────────────
// getLearnModules
// ─────────────────────────────────────────────
describe("getLearnModules()", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns mapped learn modules from Firestore", async () => {
    mockGetDocs.mockResolvedValueOnce({
      docs: [{
        id: "in1",
        data: () => ({
          icon: "🪪",
          title: "Voter Registration",
          tag: "Beginner · 5 min",
          content: "Some test content",
          order: 1,
        }),
      }],
    } as any);

    const modules = await getLearnModules("india");
    expect(modules).toHaveLength(1);
    expect(modules[0].id).toBe("in1");
    expect(modules[0].icon).toBe("🪪");
    expect(modules[0].title).toBe("Voter Registration");
    expect(modules[0].order).toBe(1);
  });

  it("returns empty array on Firestore error", async () => {
    mockGetDocs.mockRejectedValueOnce(new Error("offline"));
    const modules = await getLearnModules("usa");
    expect(modules).toEqual([]);
  });
});
