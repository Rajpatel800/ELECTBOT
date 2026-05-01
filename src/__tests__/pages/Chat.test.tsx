import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ChatPage from "../../app/chat/page";
import * as CountryContext from "../../lib/countryContext";

global.fetch = jest.fn();

jest.mock("react-markdown", () => {
  const MockReactMarkdown = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
  MockReactMarkdown.displayName = "ReactMarkdown";
  return MockReactMarkdown;
});
jest.mock("../../lib/countryContext", () => ({
  useCountry: jest.fn(),
}));

// Suppress expected console.error output from error-path tests
const originalConsoleError = console.error;
beforeAll(() => { console.error = jest.fn(); });
afterAll(() => { console.error = originalConsoleError; });

describe("ChatPage", () => {
  beforeEach(() => {
    (CountryContext.useCountry as jest.Mock).mockReturnValue({
      country: "india",
      setCountry: jest.fn(),
    });
    (global.fetch as jest.Mock).mockClear();

    // Mock scroll into view
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders welcome text", () => {
    render(<ChatPage />);
    expect(screen.getByText(/Main ElectBot hoon/i)).toBeInTheDocument();
  });

  it("handles user input and API response", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ text: "This is a mock AI response." }),
    });

    render(<ChatPage />);
    
    const input = screen.getByPlaceholderText(/Chunav ke baare mein/i);
    const sendButton = screen.getByText("➤");

    fireEvent.change(input, { target: { value: "Hello bot" } });
    fireEvent.click(sendButton);

    expect(screen.getByText("Hello bot")).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText("This is a mock AI response.")).toBeInTheDocument();
    });
  });

  it("falls back to local answer when api returns error", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      text: async () => "Server error",
    });

    render(<ChatPage />);
    
    const input = screen.getByPlaceholderText(/Chunav ke baare mein/i);
    const sendButton = screen.getByText("➤");

    fireEvent.change(input, { target: { value: "voter id" } });
    fireEvent.click(sendButton);

    // When API fails, the component returns a local fallback starting with ❌ Oops
    await waitFor(() => {
      expect(
        screen.getByText(/Oops, ElectBot is currently taking a coffee break/i)
      ).toBeInTheDocument();
    });
  });

  it("renders usa mode correctly", () => {
    (CountryContext.useCountry as jest.Mock).mockReturnValue({
      country: "usa",
      setCountry: jest.fn(),
    });

    render(<ChatPage />);
    expect(screen.getByText(/🇺🇸 USA Mode/i)).toBeInTheDocument();
  });
});
