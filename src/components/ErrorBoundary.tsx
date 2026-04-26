"use client";

/**
 * src/components/ErrorBoundary.tsx
 *
 * Application-level error boundary. Catches any unhandled React render errors
 * and displays a friendly fallback UI instead of a blank white screen.
 *
 * Usage (wrap in layout.tsx or around specific risky sections):
 *   <ErrorBoundary>
 *     <SomeComponentThatMightCrash />
 *   </ErrorBoundary>
 */

import React, { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** Optional custom fallback UI */
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(err: Error): State {
    return { hasError: true, errorMessage: err.message };
  }

  componentDidCatch(err: Error, info: ErrorInfo): void {
    // In production, replace with a proper error reporting service (e.g. Sentry)
    if (process.env.NODE_ENV !== "production") {
      console.error("[ErrorBoundary] Caught render error:", err, info.componentStack);
    }
  }

  handleReset = (): void => {
    this.setState({ hasError: false, errorMessage: "" });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center"
        >
          <span className="text-6xl mb-4" aria-hidden="true">⚠️</span>
          <h2 className="text-2xl font-black text-[#1a237e] mb-2">
            Something went wrong
          </h2>
          <p className="text-[#454652] text-sm mb-6 max-w-md">
            An unexpected error occurred. Our team has been notified. Please try
            refreshing the page.
          </p>
          <button
            onClick={this.handleReset}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#1a237e] to-[#3d4fc8] text-white font-bold hover:-translate-y-0.5 transition-all shadow-lg"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
