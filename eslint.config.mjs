/**
 * eslint.config.mjs
 *
 * ESLint configuration with strict code quality rules.
 * Extends Next.js recommended configs for web vitals and TypeScript.
 */

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Enforce consistent code style
      "prefer-const": "error",
      "no-var": "error",
      "eqeqeq": ["error", "always"],
      "curly": ["warn", "multi-line"],
      // Allow console.warn and console.error but flag console.log
      "no-console": ["warn", { allow: ["warn", "error"] }],
      // This experimental rule falsely flags valid patterns like
      // localStorage hydration and state resets on dependency change.
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;
