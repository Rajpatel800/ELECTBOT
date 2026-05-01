/**
 * firestoreService.test.ts
 *
 * Tests for the Firestore data-access layer.
 * Uses jest.mock() to avoid real network calls — all Firestore functions
 * are mocked with predictable return values.
 */

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

import { addDoc, getDocs, type DocumentReference } from "firebase/firestore";
import { submitQuizScore, getTopScores, getLearnModules } from "@/lib/firestoreService";

// Suppress expected console.error output from error-path tests
const originalConsoleError = console.error;
beforeAll(() => { console.error = jest.fn(); });
afterAll(() => { console.error = originalConsoleError; });

const mockAddDoc = addDoc as jest.MockedFunction<typeof addDoc>;
const mockGetDocs = getDocs as jest.MockedFunction<typeof getDocs>;

/** Resolved type of getDocs — used for safe test mock casts. */
type MockSnapshot = Awaited<ReturnType<typeof getDocs>>;

/** Helper to create a mock Firestore document snapshot. */
function createMockDoc(id: string, data: Record<string, unknown>) {
  return { id, data: () => data };
}

// ─────────────────────────────────────────────
// submitQuizScore
// ─────────────────────────────────────────────
describe("submitQuizScore()", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns a document ID on success", async () => {
    mockAddDoc.mockResolvedValueOnce({ id: "abc123" } as DocumentReference);
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
    mockAddDoc.mockResolvedValueOnce({ id: "xyz789" } as DocumentReference);
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
    mockGetDocs.mockResolvedValueOnce({
      docs: [
        createMockDoc("doc1", { country: "india", score: 900, accuracy: 95, timestamp: { toDate: () => new Date() } }),
        createMockDoc("doc2", { country: "india", score: 750, accuracy: 80, timestamp: { toDate: () => new Date() } }),
      ],
    } as unknown as MockSnapshot);

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
    mockGetDocs.mockResolvedValueOnce({
      docs: [],
    } as unknown as MockSnapshot);
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
      docs: [createMockDoc("in1", {
        icon: "🪪",
        title: "Voter Registration",
        tag: "Beginner · 5 min",
        content: "Some test content",
        order: 1,
      })],
    } as unknown as MockSnapshot);

    const modules = await getLearnModules("india");
    expect(modules).toHaveLength(1);
    expect(modules[0].id).toBe("in1");
    expect(modules[0].icon).toBe("🪪");
    expect(modules[0].title).toBe("Voter Registration");
  });

  it("returns empty array on Firestore error", async () => {
    mockGetDocs.mockRejectedValueOnce(new Error("offline"));
    const modules = await getLearnModules("usa");
    expect(modules).toEqual([]);
  });

  it("handles documents with missing/null fields using fallback defaults", async () => {
    mockGetDocs.mockResolvedValueOnce({
      docs: [createMockDoc("empty1", {})],
    } as unknown as MockSnapshot);

    const modules = await getLearnModules("india");
    expect(modules).toHaveLength(1);
    expect(modules[0].icon).toBe("");
    expect(modules[0].title).toBe("");
    expect(modules[0].tag).toBe("");
    expect(modules[0].content).toBe("");
    expect(modules[0].order).toBe(0);
  });
});

// ─────────────────────────────────────────────
// Edge cases: non-Error throw objects
// ─────────────────────────────────────────────
describe("Error handling edge cases", () => {
  beforeEach(() => jest.clearAllMocks());

  it("submitQuizScore handles non-Error throw values gracefully", async () => {
    mockAddDoc.mockRejectedValueOnce("string error");
    const id = await submitQuizScore("india", 100, 50);
    expect(id).toBeNull();
  });

  it("getTopScores handles non-Error throw values gracefully", async () => {
    mockGetDocs.mockRejectedValueOnce(42);
    const scores = await getTopScores("usa", 5);
    expect(scores).toEqual([]);
  });

  it("getLearnModules handles non-Error throw values gracefully", async () => {
    mockGetDocs.mockRejectedValueOnce(null);
    const modules = await getLearnModules("india");
    expect(modules).toEqual([]);
  });

  it("getTopScores handles documents with missing timestamp.toDate", async () => {
    mockGetDocs.mockResolvedValueOnce({
      docs: [createMockDoc("doc-no-ts", { country: "usa", score: 500, accuracy: 75, timestamp: null })],
    } as unknown as MockSnapshot);

    const scores = await getTopScores("usa", 1);
    expect(scores).toHaveLength(1);
    expect(scores[0].score).toBe(500);
    expect(scores[0].timestamp).toBeInstanceOf(Date);
  });

  it("getTopScores handles documents with missing data fields", async () => {
    mockGetDocs.mockResolvedValueOnce({
      docs: [createMockDoc("doc-empty", {})],
    } as unknown as MockSnapshot);

    const scores = await getTopScores("india", 1);
    expect(scores).toHaveLength(1);
    expect(scores[0].country).toBe("");
    expect(scores[0].score).toBe(0);
    expect(scores[0].accuracy).toBe(0);
    expect(scores[0].timestamp).toBeInstanceOf(Date);
  });
});
