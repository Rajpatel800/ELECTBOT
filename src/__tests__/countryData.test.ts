// src/__tests__/countryData.test.ts
// Tests for the core data utility logic

import {
  getLocalAnswer,
  indiaQuestions,
  usaQuestions,
  indiaChips,
  usaChips,
} from "@/lib/countryData";

// ─────────────────────────────────────────────
// getLocalAnswer
// ─────────────────────────────────────────────
describe("getLocalAnswer()", () => {
  describe("India knowledge base", () => {
    it("returns voter ID info for 'voter id' query", () => {
      const result = getLocalAnswer("How do I apply for voter id?", "india");
      expect(result).toContain("voters.eci.gov.in");
    });

    it("returns free cost info for 'free' query", () => {
      const result = getLocalAnswer("Is voter ID free?", "india");
      expect(result).toContain("FREE");
    });

    it("returns election date info for 'upcoming election' query", () => {
      const result = getLocalAnswer("When is the next upcoming election?", "india");
      expect(result).toContain("Bihar");
    });

    it("returns NOTA info for NOTA query", () => {
      const result = getLocalAnswer("What is NOTA?", "india");
      expect(result).toContain("None Of The Above");
    });

    it("returns ECI info for election commission query", () => {
      const result = getLocalAnswer("What is the Election Commission?", "india");
      expect(result).toContain("Election Commission of India");
    });

    it("returns fallback message for unrecognized query in India", () => {
      const result = getLocalAnswer("What is the weather today?", "india");
      expect(result).toContain("1950"); // India helpline number
    });
  });

  describe("USA knowledge base", () => {
    it("returns registration info for 'register' query", () => {
      const result = getLocalAnswer("How do I register to vote?", "usa");
      expect(result).toContain("vote.gov");
    });

    it("returns cost info for 'cost' query", () => {
      const result = getLocalAnswer("What is the cost of voter ID?", "usa");
      expect(result).toContain("FREE");
    });

    it("returns upcoming election info", () => {
      const result = getLocalAnswer("When is the next upcoming election?", "usa");
      expect(result).toContain("2026");
    });

    it("returns Electoral College info", () => {
      const result = getLocalAnswer("What is the Electoral College?", "usa");
      expect(result).toContain("270");
    });

    it("returns voter rights info", () => {
      const result = getLocalAnswer("What are my voter rights?", "usa");
      expect(result).toContain("Secret Ballot");
    });

    it("returns fallback message for unrecognized query in USA", () => {
      const result = getLocalAnswer("Where is the next FIFA world cup?", "usa");
      // Fallback message for USA doesn't include vote.gov but does include guidance
      expect(result).toContain("Electoral College");
    });
  });
});

// ─────────────────────────────────────────────
// Quiz Data Integrity
// ─────────────────────────────────────────────
describe("Quiz data integrity", () => {
  describe("India quiz questions", () => {
    it("should have 20 questions", () => {
      expect(indiaQuestions).toHaveLength(20);
    });

    it("every question has a valid correct answer index (0–3)", () => {
      indiaQuestions.forEach((q) => {
        expect(q.correct).toBeGreaterThanOrEqual(0);
        expect(q.correct).toBeLessThanOrEqual(3);
      });
    });

    it("every question has exactly 4 options", () => {
      indiaQuestions.forEach((q) => {
        expect(q.options).toHaveLength(4);
      });
    });

    it("every question has a non-empty explanation", () => {
      indiaQuestions.forEach((q) => {
        expect(q.explanation.trim().length).toBeGreaterThan(0);
      });
    });
  });

  describe("USA quiz questions", () => {
    it("should have 20 questions", () => {
      expect(usaQuestions).toHaveLength(20);
    });

    it("every question has a valid correct answer index (0–3)", () => {
      usaQuestions.forEach((q) => {
        expect(q.correct).toBeGreaterThanOrEqual(0);
        expect(q.correct).toBeLessThanOrEqual(3);
      });
    });

    it("every question has exactly 4 options", () => {
      usaQuestions.forEach((q) => {
        expect(q.options).toHaveLength(4);
      });
    });

    it("every question has a non-empty explanation", () => {
      usaQuestions.forEach((q) => {
        expect(q.explanation.trim().length).toBeGreaterThan(0);
      });
    });
  });
});

// ─────────────────────────────────────────────
// Chat Chips
// ─────────────────────────────────────────────
describe("Chat chips", () => {
  it("India chips should have at least 5 chips", () => {
    expect(indiaChips.length).toBeGreaterThanOrEqual(5);
  });

  it("USA chips should have at least 5 chips", () => {
    expect(usaChips.length).toBeGreaterThanOrEqual(5);
  });

  it("every India chip has a label and msg", () => {
    indiaChips.forEach((chip) => {
      expect(chip.label.trim().length).toBeGreaterThan(0);
      expect(chip.msg.trim().length).toBeGreaterThan(0);
    });
  });

  it("every USA chip has a label and msg", () => {
    usaChips.forEach((chip) => {
      expect(chip.label.trim().length).toBeGreaterThan(0);
      expect(chip.msg.trim().length).toBeGreaterThan(0);
    });
  });
});
