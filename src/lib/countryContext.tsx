"use client";
// src/lib/countryContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Country = "india" | "usa";

interface CountryContextType {
  country: Country;
  setCountry: (c: Country) => void;
}

const CountryContext = createContext<CountryContextType>({
  country: "usa",
  setCountry: () => {},
});

export function CountryProvider({ children }: { children: ReactNode }) {
  const [country, setCountryState] = useState<Country>("usa");

  useEffect(() => {
    const saved = localStorage.getItem("electbot_country") as Country | null;
    if (saved === "india" || saved === "usa") setCountryState(saved);
  }, []);

  const setCountry = (c: Country) => {
    setCountryState(c);
    localStorage.setItem("electbot_country", c);
  };

  return (
    <CountryContext.Provider value={{ country, setCountry }}>
      {children}
    </CountryContext.Provider>
  );
}

export function useCountry() {
  return useContext(CountryContext);
}
