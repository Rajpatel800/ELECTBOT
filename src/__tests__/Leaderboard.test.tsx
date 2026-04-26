// src/__tests__/Leaderboard.test.tsx
// Component tests for the Leaderboard component

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock firestoreService so we never make real network calls
jest.mock("@/lib/firestoreService", () => ({
  getTopScores: jest.fn(),
}));

import { getTopScores } from "@/lib/firestoreService";
import Leaderboard from "@/components/Leaderboard";

const mockGetTopScores = getTopScores as jest.MockedFunction<typeof getTopScores>;

describe("<Leaderboard /> component", () => {
  beforeEach(() => jest.clearAllMocks());

  it("shows a loading state initially", () => {
    // Never resolves so we stay in the loading state long enough to assert
    mockGetTopScores.mockImplementation(() => new Promise(() => {}));
    render(<Leaderboard country="india" />);
    expect(screen.getByText(/loading leaderboard/i)).toBeInTheDocument();
  });

  it("shows 'Be the first to submit a score!' when there are no scores", async () => {
    mockGetTopScores.mockResolvedValueOnce([]);
    render(<Leaderboard country="india" />);
    await waitFor(() => {
      expect(screen.getByText(/be the first to submit a score/i)).toBeInTheDocument();
    });
  });

  it("renders the correct number of score entries", async () => {
    const fakeScores = [
      { id: "1", country: "india", score: 900, accuracy: 95, timestamp: new Date() },
      { id: "2", country: "india", score: 700, accuracy: 80, timestamp: new Date() },
      { id: "3", country: "india", score: 500, accuracy: 60, timestamp: new Date() },
    ];
    mockGetTopScores.mockResolvedValueOnce(fakeScores);
    render(<Leaderboard country="india" />);
    await waitFor(() => {
      // Each entry shows its score in pts
      expect(screen.getByText("900 pts")).toBeInTheDocument();
      expect(screen.getByText("700 pts")).toBeInTheDocument();
      expect(screen.getByText("500 pts")).toBeInTheDocument();
    });
  });

  it("shows accuracy for each score entry", async () => {
    const fakeScores = [
      { id: "1", country: "usa", score: 1000, accuracy: 100, timestamp: new Date() },
    ];
    mockGetTopScores.mockResolvedValueOnce(fakeScores);
    render(<Leaderboard country="usa" />);
    await waitFor(() => {
      expect(screen.getByText("100% Acc")).toBeInTheDocument();
    });
  });

  it("shows trophy title", async () => {
    mockGetTopScores.mockResolvedValueOnce([
      { id: "1", country: "india", score: 500, accuracy: 90, timestamp: new Date() },
    ]);
    render(<Leaderboard country="india" />);
    await waitFor(() => {
      expect(screen.getByText(/top 5 champions/i)).toBeInTheDocument();
    });
  });

  it("calls getTopScores with correct country prop", async () => {
    mockGetTopScores.mockResolvedValueOnce([]);
    render(<Leaderboard country="usa" />);
    await waitFor(() => {
      expect(mockGetTopScores).toHaveBeenCalledWith("usa", 5);
    });
  });
});
