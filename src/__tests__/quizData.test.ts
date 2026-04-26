import { questions } from "../lib/quizData";

describe("quizData", () => {
  it("exports questions", () => {
    expect(questions.length).toBeGreaterThan(0);
    expect(questions[0].q).toBeDefined();
    expect(questions[0].options).toHaveLength(4);
  });
});
