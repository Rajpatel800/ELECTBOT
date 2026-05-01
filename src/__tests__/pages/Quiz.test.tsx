import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import QuizPage from "../../app/quiz/page";
import * as CountryContext from "../../lib/countryContext";
import { indiaQuestions } from "../../lib/countryData";

// Mock firestoreService so no real Firestore calls happen
jest.mock("../../lib/firestoreService", () => ({
  submitQuizScore: jest.fn().mockResolvedValue("mock-doc-id"),
  getTopScores: jest.fn().mockResolvedValue([]),
  getLearnModules: jest.fn().mockResolvedValue([]),
}));

// Mock Leaderboard since it uses Firestore
jest.mock("../../components/Leaderboard", () => {
  return function MockLeaderboard() {
    return <div data-testid="leaderboard">Leaderboard</div>;
  };
});

jest.mock("../../lib/countryContext", () => ({ useCountry: jest.fn() }));

describe("QuizPage", () => {
  beforeEach(() => {
    (CountryContext.useCountry as jest.Mock).mockReturnValue({
      country: "india",
      setCountry: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders initial quiz state with country badge", () => {
    render(<QuizPage />);
    expect(screen.getByText(/India Civic Quiz/i)).toBeInTheDocument();
  });

  it("renders score bar elements", () => {
    render(<QuizPage />);
    expect(screen.getByText("Score")).toBeInTheDocument();
    expect(screen.getByText("Streak")).toBeInTheDocument();
  });

  it("does not advance when submit is clicked without a selection", () => {
    render(<QuizPage />);
    const submitBtn = screen.getByText(/Jawab Submit Karein|Submit Answer/i);
    fireEvent.click(submitBtn);
    // Should still show first question — no "Next" button should appear
    expect(screen.queryByText(/Agla Sawaal|Next Question/i)).not.toBeInTheDocument();
  });

  it("shows submit button and allows selecting an option", async () => {
    render(<QuizPage />);

    // Find option buttons (they have text-left class)
    const buttons = screen.getAllByRole("button");
    const optionButtons = buttons.filter((b) =>
      b.className.includes("text-left")
    );

    expect(optionButtons.length).toBeGreaterThan(0);

    // Click first option
    fireEvent.click(optionButtons[0]);

    // Submit button should now be enabled
    const submitBtn = screen.getByText(/Jawab Submit Karein|Submit Answer/i);
    expect(submitBtn).not.toBeDisabled();
    fireEvent.click(submitBtn);

    // After submitting, next/result button should appear
    await waitFor(() => {
      expect(
        screen.getByText(/Agla Sawaal|Next Question|Result Dekhein|See Results/i)
      ).toBeInTheDocument();
    });
  });

  it("handles a wrong answer and resets streak", async () => {
    render(<QuizPage />);
    const buttons = screen.getAllByRole("button");
    const optionButtons = buttons.filter((b) => b.className.includes("text-left"));

    // Pick the wrong answer (any option that is NOT the correct one)
    const wrongIndex = indiaQuestions[0].correct === 0 ? 1 : 0;
    fireEvent.click(optionButtons[wrongIndex]);

    const submitBtn = screen.getByText(/Jawab Submit Karein|Submit Answer/i);
    fireEvent.click(submitBtn);

    // Streak should show 0 after wrong answer
    await waitFor(() => {
      const streakValues = screen.getAllByText("0");
      expect(streakValues.length).toBeGreaterThan(0);
    });
  });

  it("completes the full quiz and shows results screen", async () => {
    render(<QuizPage />);

    // Answer all 20 questions
    for (let i = 0; i < indiaQuestions.length; i++) {
      const buttons = screen.getAllByRole("button");
      const optionButtons = buttons.filter((b) => b.className.includes("text-left"));

      // Pick the correct answer
      fireEvent.click(optionButtons[indiaQuestions[i].correct]);

      // Submit
      const submitBtn = screen.getByText(/Jawab Submit Karein|Submit Answer/i);
      fireEvent.click(submitBtn);

      // Click Next or See Results
      await waitFor(() => {
        const nextBtn = screen.getByText(/Agla Sawaal|Next Question|Result Dekhein|See Results/i);
        fireEvent.click(nextBtn);
      });
    }

    // Results screen should now be visible
    await waitFor(() => {
      expect(screen.getByText(/Quiz Poori Hui|Quiz Complete/i)).toBeInTheDocument();
      expect(screen.getByText(/Final Score/i)).toBeInTheDocument();
      expect(screen.getByText(/Accuracy/i)).toBeInTheDocument();
      expect(screen.getByText(/Best Streak/i)).toBeInTheDocument();
      expect(screen.getByTestId("leaderboard")).toBeInTheDocument();
    });
  });

  it("can restart the quiz after completion", async () => {
    render(<QuizPage />);

    // Speed-run: answer all questions
    for (let i = 0; i < indiaQuestions.length; i++) {
      const buttons = screen.getAllByRole("button");
      const optionButtons = buttons.filter((b) => b.className.includes("text-left"));
      fireEvent.click(optionButtons[indiaQuestions[i].correct]);

      const submitBtn = screen.getByText(/Jawab Submit Karein|Submit Answer/i);
      fireEvent.click(submitBtn);

      await waitFor(() => {
        const nextBtn = screen.getByText(/Agla Sawaal|Next Question|Result Dekhein|See Results/i);
        fireEvent.click(nextBtn);
      });
    }

    // Click restart
    await waitFor(() => {
      const restartBtn = screen.getByText(/Dobara Khelein|Try Again/i);
      fireEvent.click(restartBtn);
    });

    // Should be back at question 1
    await waitFor(() => {
      expect(screen.getByText(/India Civic Quiz/i)).toBeInTheDocument();
      expect(screen.getByText(/Jawab Submit Karein|Submit Answer/i)).toBeInTheDocument();
    });
  });

  it("renders usa mode correctly", () => {
    (CountryContext.useCountry as jest.Mock).mockReturnValue({
      country: "usa",
      setCountry: jest.fn(),
    });

    render(<QuizPage />);
    expect(screen.getByText(/U\.S\. Civic Quiz/i)).toBeInTheDocument();
    expect(screen.getByText("Submit Answer")).toBeInTheDocument();
  });
});
