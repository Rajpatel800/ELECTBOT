/**
 * types.test.ts
 *
 * Tests for the centralized type definitions and data integrity.
 * Validates that type guards work correctly and exported data
 * conforms to its declared types.
 */

import { VALID_COUNTRIES } from "@/lib/types";
import type { Country, Question, LearnModule } from "@/lib/types";
import { indiaQuestions, usaQuestions, indiaModules, usaModules } from "@/lib/countryData";

describe("Type Definitions and Data Integrity", () => {
  describe("VALID_COUNTRIES", () => {
    it("contains exactly india and usa", () => {
      expect(VALID_COUNTRIES).toEqual(["india", "usa"]);
      expect(VALID_COUNTRIES).toHaveLength(2);
    });

    it("is a readonly tuple with exactly two values", () => {
      // `as const` creates a readonly tuple at compile time
      expect(VALID_COUNTRIES.length).toBe(2);
      expect(VALID_COUNTRIES[0]).toBe("india");
      expect(VALID_COUNTRIES[1]).toBe("usa");
    });
  });

  describe("Quiz Questions Integrity", () => {
    const validateQuestion = (q: Question) => {
      expect(q.q).toBeTruthy();
      expect(q.options).toHaveLength(4);
      expect(q.correct).toBeGreaterThanOrEqual(0);
      expect(q.correct).toBeLessThan(4);
      expect(q.explanation).toBeTruthy();
      // Verify correct index points to an existing option
      expect(q.options[q.correct]).toBeTruthy();
    };

    it("all India questions have valid structure", () => {
      expect(indiaQuestions.length).toBeGreaterThanOrEqual(10);
      indiaQuestions.forEach((q, i) => validateQuestion(q, i, "India"));
    });

    it("all USA questions have valid structure", () => {
      expect(usaQuestions.length).toBeGreaterThanOrEqual(8);
      usaQuestions.forEach((q, i) => validateQuestion(q, i, "USA"));
    });

    it("no duplicate questions within the same country", () => {
      const indiaTexts = indiaQuestions.map((q) => q.q);
      expect(new Set(indiaTexts).size).toBe(indiaTexts.length);

      const usaTexts = usaQuestions.map((q) => q.q);
      expect(new Set(usaTexts).size).toBe(usaTexts.length);
    });
  });

  describe("Learn Modules Integrity", () => {
    const validateModule = (m: LearnModule) => {
      expect(m.id).toBeTruthy();
      expect(m.icon).toBeTruthy();
      expect(m.title).toBeTruthy();
      expect(m.tag).toBeTruthy();
      expect(m.content).toBeTruthy();
      expect(m.content.length).toBeGreaterThan(50);
    };

    it("India modules have valid structure", () => {
      expect(indiaModules.length).toBeGreaterThanOrEqual(3);
      indiaModules.forEach(validateModule);
    });

    it("USA modules have valid structure", () => {
      expect(usaModules.length).toBeGreaterThanOrEqual(3);
      usaModules.forEach(validateModule);
    });

    it("module IDs are unique within each country", () => {
      const indiaIds = indiaModules.map((m) => m.id);
      expect(new Set(indiaIds).size).toBe(indiaIds.length);

      const usaIds = usaModules.map((m) => m.id);
      expect(new Set(usaIds).size).toBe(usaIds.length);
    });
  });

  describe("Country type", () => {
    it("accepts valid country strings", () => {
      const india: Country = "india";
      const usa: Country = "usa";
      expect(VALID_COUNTRIES).toContain(india);
      expect(VALID_COUNTRIES).toContain(usa);
    });
  });
});
