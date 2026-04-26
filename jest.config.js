const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

/** @type {import('jest').Config} */
const config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "react-markdown": "<rootDir>/src/__mocks__/react-markdown.tsx"
  },
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/layout.tsx",
    "!src/app/api/seed/route.ts",
    // Next.js framework boilerplate — auto-generated, not unit-testable in jsdom
    "!src/app/error.tsx",
    "!src/app/not-found.tsx",
    "!src/app/robots.ts",
    "!src/app/sitemap.ts",
    // ErrorBoundary requires class-level lifecycle testing beyond jsdom scope
    "!src/components/ErrorBoundary.tsx",
  ],
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)",
  ],
};

module.exports = createJestConfig(config);

