import { render, screen } from "@testing-library/react";
import TimelinePage from "../../app/timeline/page";
import * as CountryContext from "../../lib/countryContext";

jest.mock("../../lib/countryContext", () => ({ useCountry: jest.fn() }));

describe("TimelinePage", () => {
  beforeEach(() => {
    (CountryContext.useCountry as jest.Mock).mockReturnValue({
      country: "india",
      setCountry: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly for india", () => {
    render(<TimelinePage />);
    // India banner text contains "Showing: State Elections"
    expect(screen.getByText(/Showing: State Elections/i)).toBeInTheDocument();
    // India tab labels
    expect(screen.getAllByText(/Lok Sabha 2024/i).length).toBeGreaterThanOrEqual(1);
  });

  it("renders correctly for usa", () => {
    (CountryContext.useCountry as jest.Mock).mockReturnValue({
      country: "usa",
      setCountry: jest.fn(),
    });

    render(<TimelinePage />);
    // USA banner text contains "2026 Midterms" (this appears in both banner and tab)
    // Use getAllByText to handle multiple matches
    expect(screen.getAllByText(/2026 Midterms/i).length).toBeGreaterThanOrEqual(1);
    // Also check the USA-specific indicator
    expect(screen.getByText(/🇺🇸 Showing:/i)).toBeInTheDocument();
  });

  it("renders usa hero heading", () => {
    (CountryContext.useCountry as jest.Mock).mockReturnValue({
      country: "usa",
      setCountry: jest.fn(),
    });

    render(<TimelinePage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/Election Timelines/i);
  });
});
