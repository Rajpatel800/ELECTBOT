import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import LearnPage from "../../app/learn/page";
import * as CountryContext from "../../lib/countryContext";

global.fetch = jest.fn();

jest.mock("react-markdown", () => ({ children }: { children: React.ReactNode }) => <div>{children}</div>);
jest.mock("../../lib/countryContext", () => ({ useCountry: jest.fn() }));

// Mock firestoreService so modules load immediately without real Firestore
jest.mock("../../lib/firestoreService", () => ({
  getLearnModules: jest.fn().mockResolvedValue([
    {
      id: "module-1",
      title: "Mock Module 1",
      content: "This is mock content for module 1.",
      icon: "📘",
      tag: "Basics",
      order: 1,
    },
    {
      id: "module-2",
      title: "Mock Module 2",
      content: "This is mock content for module 2.",
      icon: "🗳️",
      tag: "Advanced",
      order: 2,
    },
  ]),
  submitQuizScore: jest.fn(),
  getTopScores: jest.fn().mockResolvedValue([]),
}));

describe("LearnPage", () => {
  beforeEach(() => {
    (CountryContext.useCountry as jest.Mock).mockReturnValue({
      country: "india",
      setCountry: jest.fn(),
    });
    (global.fetch as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders hero heading correctly for india", async () => {
    await act(async () => {
      render(<LearnPage />);
    });
    expect(screen.getByText(/Election Education Hub/i)).toBeInTheDocument();
  });

  it("renders translation toggle for india", async () => {
    await act(async () => {
      render(<LearnPage />);
    });
    expect(screen.getByText("English")).toBeInTheDocument();
    expect(screen.getByText("हिंदी")).toBeInTheDocument();
  });

  it("shows modules after loading and triggers fetch on Hindi click", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ translatedText: "नमस्ते" }),
    });

    await act(async () => {
      render(<LearnPage />);
    });

    // Wait for modules to appear
    await waitFor(() => {
      expect(screen.getByText("Mock Module 1")).toBeInTheDocument();
    });

    // Click Hindi button
    await act(async () => {
      fireEvent.click(screen.getByText("हिंदी"));
    });

    // Fetch should have been called for translation
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  it("renders usa content correctly without translation toggle", async () => {
    (CountryContext.useCountry as jest.Mock).mockReturnValue({
      country: "usa",
      setCountry: jest.fn(),
    });

    await act(async () => {
      render(<LearnPage />);
    });

    expect(screen.getByText(/Election Education Hub 🇺🇸/i)).toBeInTheDocument();
    expect(screen.queryByText("हिंदी")).not.toBeInTheDocument();
  });
});
