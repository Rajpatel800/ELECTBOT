/**
 * src/lib/countryContext.tsx
 *
 * Global state provider for the currently selected country.
 * Persists the user's choice in `localStorage` so it survives page refreshes.
 *
 * Usage:
 *   Wrap the app in `<CountryProvider>` (see layout.tsx), then call
 *   `const { country, setCountry } = useCountry()` in any client component.
 *
 * @module countryContext
 */

"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Country } from "@/lib/types";

/** Re-export Country for backwards compatibility with existing imports. */
export type { Country };

/** localStorage key used to persist the selected country. */
const STORAGE_KEY = "electbot_country" as const;

/** Shape of the context value exposed to consumers. */
interface CountryContextType {
  /** The currently active country. */
  readonly country: Country;
  /** Switch the active country (also persists to localStorage). */
  readonly setCountry: (c: Country) => void;
}

/** Default context value (used before the Provider mounts). */
const CountryContext = createContext<CountryContextType>({
  country: "usa",
  setCountry: () => {},
});

/**
 * Provider component that manages and persists the country selection.
 *
 * @param props.children - React tree that needs access to the country state.
 */
export function CountryProvider({ children }: { readonly children: ReactNode }) {
  const [country, setCountryState] = useState<Country>("usa");

  // Hydrate from localStorage on first mount (client-only)
  // This is a valid effect: synchronizing React state with an external system.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "india" || saved === "usa") {
        setCountryState(saved);
      }
    } catch {
      // localStorage may be unavailable (SSR, incognito quota exceeded, etc.)
    }
  }, []);

  /** Update state and persist the new country to localStorage. */
  const setCountry = (c: Country): void => {
    setCountryState(c);
    try {
      localStorage.setItem(STORAGE_KEY, c);
    } catch {
      // Silently ignore storage errors
    }
  };

  return (
    <CountryContext.Provider value={{ country, setCountry }}>
      {children}
    </CountryContext.Provider>
  );
}

/**
 * Hook to access the current country and setter from any child component.
 *
 * @returns The current `country` value and a `setCountry` function.
 * @throws If used outside of `<CountryProvider>`.
 */
export function useCountry(): CountryContextType {
  return useContext(CountryContext);
}
