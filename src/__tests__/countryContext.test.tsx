import { render, screen, fireEvent, act } from "@testing-library/react";
import { CountryProvider, useCountry } from "../lib/countryContext";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock, writable: true });

const TestComponent = () => {
  const { country, setCountry } = useCountry();
  return (
    <div>
      <span data-testid="country-val">{country}</span>
      <button onClick={() => setCountry("usa")}>Switch to USA</button>
      <button onClick={() => setCountry("india")}>Switch to India</button>
    </div>
  );
};

describe("CountryContext", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it("provides a valid country value and allows switching", async () => {
    render(
      <CountryProvider>
        <TestComponent />
      </CountryProvider>
    );

    // Component renders with some country value
    const countryVal = screen.getByTestId("country-val");
    expect(countryVal).toBeInTheDocument();

    // Switch to india
    await act(async () => {
      fireEvent.click(screen.getByText("Switch to India"));
    });
    expect(countryVal).toHaveTextContent("india");
    expect(localStorageMock.getItem("electbot_country")).toBe("india");

    // Switch to usa
    await act(async () => {
      fireEvent.click(screen.getByText("Switch to USA"));
    });
    expect(countryVal).toHaveTextContent("usa");
    expect(localStorageMock.getItem("electbot_country")).toBe("usa");
  });

  it("reads saved value from localStorage on mount", async () => {
    localStorageMock.setItem("electbot_country", "india");

    render(
      <CountryProvider>
        <TestComponent />
      </CountryProvider>
    );

    // After the useEffect fires, it should read "india"
    await act(async () => {});
    expect(screen.getByTestId("country-val")).toHaveTextContent("india");
  });

  it("ignores invalid saved values in localStorage", async () => {
    localStorageMock.setItem("electbot_country", "invalid_country");

    render(
      <CountryProvider>
        <TestComponent />
      </CountryProvider>
    );

    await act(async () => {});
    // Should still render (default "usa") without crashing
    expect(screen.getByTestId("country-val")).toBeInTheDocument();
  });
});
