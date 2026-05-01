/**
 * jest.setup.ts
 *
 * Global setup file for Jest test suites.
 * Configures testing-library matchers, polyfills, and Next.js mocks.
 */

import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

if (typeof TextEncoder !== "undefined") {
  global.TextEncoder = TextEncoder;
}
if (typeof TextDecoder !== "undefined") {
  global.TextDecoder = TextDecoder as typeof globalThis.TextDecoder;
}

// Mock next/navigation for jsdom environment
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

jest.mock("next/link", () => {
  // Using createElement instead of JSX since this is a .ts file
  const React = require("react"); // eslint-disable-line @typescript-eslint/no-require-imports
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => {
    return React.createElement("a", { href }, children);
  };
  MockLink.displayName = "Link";
  return MockLink;
});
