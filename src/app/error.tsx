"use client";

/**
 * src/app/error.tsx
 *
 * Custom 500 / runtime error page.
 * Next.js App Router automatically uses this for unhandled errors in Server Components.
 */

import { useEffect } from "react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // In production: send to an error monitoring service (e.g. Sentry)
    if (process.env.NODE_ENV !== "development") {
      console.error("[GlobalError]", error.message);
    }
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
      <span className="text-8xl mb-6" aria-hidden="true">⚠️</span>
      <h1 className="text-4xl font-black text-[#1a237e] mb-3 tracking-tight">
        Something Went Wrong
      </h1>
      <p className="text-[#454652] mb-6 max-w-md text-lg">
        We encountered an unexpected error. Our team has been alerted.
      </p>
      {process.env.NODE_ENV === "development" && (
        <pre className="text-left text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl p-4 mb-6 max-w-lg overflow-x-auto">
          {error.message}
        </pre>
      )}
      <button
        onClick={reset}
        className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#1a237e] to-[#3d4fc8] text-white font-bold shadow-lg hover:-translate-y-0.5 transition-all"
      >
        Try Again
      </button>
    </div>
  );
}
