/**
 * src/lib/firestoreService.ts
 *
 * Data access layer for all Firestore operations.
 * Encapsulates database logic so components never import Firestore directly.
 *
 * Collections:
 *  - `quizScores`   — Stores individual user quiz attempts
 *  - `learnModules` — Stores educational content modules (seeded via /api/seed)
 */

import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  limit,
  where,
  Timestamp,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface QuizScore {
  id?: string;
  country: string;
  score: number;
  accuracy: number;
  timestamp: Date;
}

export interface LearnModule {
  id: string;
  icon: string;
  title: string;
  tag: string;
  content: string;
  order: number;
}

// ─────────────────────────────────────────────
// Quiz Scores
// ─────────────────────────────────────────────

/**
 * Persists a completed quiz attempt to Firestore.
 * @returns The new document ID on success, or `null` on failure.
 */
export async function submitQuizScore(
  country: string,
  score: number,
  accuracy: number
): Promise<string | null> {
  try {
    const docRef = await addDoc(collection(db, "quizScores"), {
      country,
      score,
      accuracy,
      timestamp: Timestamp.now(),
    });
    return docRef.id;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[Firestore] Failed to submit quiz score:", message);
    return null;
  }
}

/**
 * Fetches the top N quiz scores for a given country, ordered by score descending.
 * @param country - "india" or "usa"
 * @param count   - Maximum number of results to return (default: 5)
 */
export async function getTopScores(country: string, count = 5): Promise<QuizScore[]> {
  try {
    // Note: We filter by country client-side and sort here to avoid needing a
    // composite Firestore index (country + score), which requires manual setup.
    const q = query(
      collection(db, "quizScores"),
      where("country", "==", country),
      limit(count * 3) // fetch more than needed so sorting is accurate
    );
    const snapshot = await getDocs(q);

    return snapshot.docs
      .map((doc: QueryDocumentSnapshot<DocumentData>): QuizScore => {
        const data = doc.data();
        return {
          id: doc.id,
          country: data.country as string,
          score: data.score as number,
          accuracy: data.accuracy as number,
          timestamp: (data.timestamp as Timestamp).toDate(),
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, count);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[Firestore] Failed to fetch top scores:", message);
    return [];
  }
}

// ─────────────────────────────────────────────
// Learn Modules
// ─────────────────────────────────────────────

/**
 * Fetches educational modules for a given country from Firestore,
 * ordered by `order` field ascending.
 * @param country - "india" or "usa"
 */
export async function getLearnModules(country: string): Promise<LearnModule[]> {
  try {
    // Note: We use only `where` (single-field filter) to avoid needing a composite
    // index. Sorting by `order` is done client-side, which is functionally identical.
    const q = query(
      collection(db, "learnModules"),
      where("country", "==", country)
    );
    const snapshot = await getDocs(q);

    return snapshot.docs
      .map((doc: QueryDocumentSnapshot<DocumentData>): LearnModule => {
        const data = doc.data();
        return {
          id: doc.id,
          icon: data.icon as string,
          title: data.title as string,
          tag: data.tag as string,
          content: data.content as string,
          order: data.order as number,
        };
      })
      .sort((a, b) => a.order - b.order);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[Firestore] Failed to fetch learn modules:", message);
    return [];
  }
}
