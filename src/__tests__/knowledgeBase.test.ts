import { getLocalAnswer, knowledgeBase } from "../lib/knowledgeBase";

describe("knowledgeBase", () => {
  it("exports a knowledge base array", () => {
    expect(Array.isArray(knowledgeBase)).toBe(true);
    expect(knowledgeBase.length).toBeGreaterThan(0);
  });

  it("returns correct answer for known keys", () => {
    const answer = getLocalAnswer("how to apply for voter id");
    expect(answer).toContain("How to Apply for a Voter ID Card");
  });

  it("returns fallback answer for unknown query", () => {
    const answer = getLocalAnswer("what is the weather like today?");
    expect(answer).toContain("I don't have a specific answer for that yet");
  });
});
