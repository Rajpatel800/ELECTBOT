/**
 * src/lib/firestoreService.ts
 *
 * Data-access layer for the Firebase Firestore database.
 * Provides typed CRUD operations for quiz scores and learn modules.
 *
 * All functions are safe to call from client components — they handle
 * errors gracefully and return sensible defaults on failure.
 *
 * @module firestoreService
 */

import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  where,
  Timestamp,
} from "firebase/firestore";
import type { QuizScore, LearnModule } from "@/lib/types";

// Re-export types for convenience (backwards compatibility)
export type { QuizScore, LearnModule };

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

/** Firestore collection name for quiz scores. */
const COLLECTION_SCORES = "quizScores" as const;

/** Firestore collection name for learn modules. */
const COLLECTION_MODULES = "learnModules" as const;

/** Default number of top scores to fetch. */
const DEFAULT_TOP_SCORES_LIMIT = 10;

// ─────────────────────────────────────────────
// Quiz Scores
// ─────────────────────────────────────────────

/**
 * Submits a quiz score to Firestore.
 *
 * @param country  - The country the quiz was taken for ("india" | "usa").
 * @param score    - The numeric score (including streak bonuses).
 * @param accuracy - The percentage accuracy (0–100).
 * @returns The Firestore document ID on success, or `null` on failure.
 */
export async function submitQuizScore(
  country: string,
  score: number,
  accuracy: number,
): Promise<string | null> {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_SCORES), {
      country,
      score,
      accuracy,
      timestamp: Timestamp.now(),
    });
    return docRef.id;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[FirestoreService] submitQuizScore failed:", message);
    return null;
  }
}

/**
 * Retrieves the top quiz scores for a given country, ordered by score descending.
 *
 * @param country - The country to filter scores for.
 * @param count   - Maximum number of scores to return (default: 10).
 * @returns An array of {@link QuizScore} objects, or an empty array on failure.
 */
export async function getTopScores(
  country: string,
  count: number = DEFAULT_TOP_SCORES_LIMIT,
): Promise<QuizScore[]> {
  try {
    const q = query(
      collection(db, COLLECTION_SCORES),
      where("country", "==", country),
      orderBy("score", "desc"),
      limit(count),
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        country: String(data.country ?? ""),
        score: Number(data.score ?? 0),
        accuracy: Number(data.accuracy ?? 0),
        timestamp: data.timestamp?.toDate?.() ?? new Date(),
      };
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[FirestoreService] getTopScores failed:", message);
    return [];
  }
}

// ─────────────────────────────────────────────
// Learn Modules
// ─────────────────────────────────────────────

/**
 * Fetches educational learn modules for a given country from Firestore.
 * Results are sorted by the `order` field in ascending order.
 *
 * @param country - The country to filter modules for ("india" | "usa").
 * @returns An array of {@link LearnModule} objects, or an empty array on failure.
 */
export async function getLearnModules(country: string): Promise<LearnModule[]> {
  try {
    const q = query(
      collection(db, COLLECTION_MODULES),
      where("country", "==", country),
      orderBy("order", "asc"),
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        icon: String(data.icon ?? ""),
        title: String(data.title ?? ""),
        tag: String(data.tag ?? ""),
        content: String(data.content ?? ""),
        order: Number(data.order ?? 0),
      };
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[FirestoreService] getLearnModules failed:", message);
    return [];
  }
}
