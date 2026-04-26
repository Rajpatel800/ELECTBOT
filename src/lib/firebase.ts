/**
 * src/lib/firebase.ts
 *
 * Initializes the Firebase application singleton for client-side use.
 * Uses the "avoid re-initialization in Next.js Fast Refresh" pattern.
 *
 * Exports:
 *  - `app`       — The initialized Firebase App instance
 *  - `db`        — The Firestore database instance
 *  - `analytics` — Firebase Analytics (browser-only; null on server)
 */

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
};

// Prevent duplicate initialization during Next.js Fast Refresh / HMR
const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

const db: Firestore = getFirestore(app);

// Analytics is a browser-only API — initialize lazily and only when supported.
let analytics: Analytics | null = null;

if (typeof window !== "undefined") {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch((err: Error) => {
      // Analytics failure is non-critical — do not break the app.
      if (process.env.NODE_ENV === "development") {
        console.warn("[Firebase] Analytics initialization skipped:", err.message);
      }
    });
}

export { app, db, analytics };
