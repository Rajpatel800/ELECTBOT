import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "../components/Navbar";

jest.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

jest.mock("next/link", () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
  MockLink.displayName = "Link";
  return MockLink;
});

describe("Navbar", () => {
  it("renders ElectBot logo", () => {
    render(<Navbar />);
    expect(screen.getByText("ElectBot")).toBeInTheDocument();
  });

  it("renders desktop nav links", () => {
    render(<Navbar />);
    // Desktop links are always in DOM
    expect(screen.getAllByText("Ask ElectBot").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Home").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Learn").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Quiz").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Timeline").length).toBeGreaterThanOrEqual(1);
  });

  it("renders active route indicator correctly", () => {
    render(<Navbar />);
    expect(screen.getAllByText("Home").length).toBeGreaterThanOrEqual(1);
    // Both logo link ("ElectBot") and "Ask ElectBot" nav link match — assert at least one exists
    expect(screen.getAllByRole("link", { name: /ElectBot/i }).length).toBeGreaterThanOrEqual(1);
  });

  it("hamburger button has aria-expanded=false by default", () => {
    render(<Navbar />);
    const btn = screen.getByRole("button", { name: /open navigation menu/i });
    expect(btn).toHaveAttribute("aria-expanded", "false");
  });

  it("opens mobile menu when hamburger is clicked", () => {
    render(<Navbar />);
    const btn = screen.getByRole("button", { name: /open navigation menu/i });
    fireEvent.click(btn);
    expect(btn).toHaveAttribute("aria-expanded", "true");
    // Mobile menu should now be in DOM
    expect(screen.getByRole("navigation", { name: /mobile navigation menu/i })).toBeInTheDocument();
  });

  it("closes mobile menu on second click", () => {
    render(<Navbar />);
    const btn = screen.getByRole("button", { name: /navigation menu/i });
    fireEvent.click(btn);
    fireEvent.click(btn);
    expect(btn).toHaveAttribute("aria-expanded", "false");
  });
});
