import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import QuizPage from "../../app/quiz/page";
import * as CountryContext from "../../lib/countryContext";

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
