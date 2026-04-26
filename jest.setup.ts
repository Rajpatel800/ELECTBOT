import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

if (typeof TextEncoder !== "undefined") {
  global.TextEncoder = TextEncoder;
}
if (typeof TextDecoder !== "undefined") {
  global.TextDecoder = TextDecoder as any;
}

// Mock next/navigation
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
  return ({ children, href }: { children: any; href: string }) => {
    return children;
  };
});
