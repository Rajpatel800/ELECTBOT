import { render, screen } from "@testing-library/react";
import HomePage from "../../app/page";
import * as CountryContext from "../../lib/countryContext";

jest.mock("next/link", () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
  MockLink.displayName = "Link";
  return MockLink;
});

jest.mock("../../lib/countryContext", () => ({
  useCountry: jest.fn(),
}));

describe("HomePage", () => {
  beforeEach(() => {
    (CountryContext.useCountry as jest.Mock).mockReturnValue({
      country: "india",
      setCountry: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders headline and stats for india", () => {
    render(<HomePage />);
    // India hero h1 contains "Apna Vote"
    expect(screen.getByText(/Apna Vote/i)).toBeInTheDocument();
    // India stats
    expect(screen.getByText("6")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
  });

  it("renders country selector", () => {
    render(<HomePage />);
    expect(screen.getByText(/Select Your Country/i)).toBeInTheDocument();
    expect(screen.getByText("India")).toBeInTheDocument();
    expect(screen.getByText("USA")).toBeInTheDocument();
  });

  it("renders correctly for usa", () => {
    (CountryContext.useCountry as jest.Mock).mockReturnValue({
      country: "usa",
      setCountry: jest.fn(),
    });

    render(<HomePage />);
    // The h1 has "Understand" (headline1) then "Your Vote" (headline2) as separate text nodes
    // Use heading role to be precise about the h1 element
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.textContent).toMatch(/Understand/i);
    expect(h1.textContent).toMatch(/Your Vote/i);
  });

  it("renders features section for india", () => {
    render(<HomePage />);
    expect(screen.getByText(/Voter ID \(EPIC\) Register/i)).toBeInTheDocument();
  });
});
