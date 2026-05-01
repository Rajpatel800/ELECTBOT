/**
 * src/components/Leaderboard.tsx
 *
 * Displays the top-5 quiz champions for a given country.
 * Fetches scores from Firestore and renders a ranked list with medals.
 *
 * @module Leaderboard
 */

"use client";

import { useEffect, useState } from "react";
import { getTopScores } from "@/lib/firestoreService";
import type { QuizScore } from "@/lib/types";

/** Number of top scores to display. */
const TOP_SCORES_COUNT = 5 as const;

/** Medal colors by rank position (0-indexed). */
const RANK_STYLES: readonly string[] = [
  "bg-gradient-to-r from-[#ffc107] to-[#ff8f00] text-[#785900]", // 🥇
  "bg-gray-300 text-gray-700",                                     // 🥈
  "bg-amber-700 text-amber-100",                                   // 🥉
  "bg-[#c6c5d4] text-[#454652]",                                   // 4th
  "bg-[#c6c5d4] text-[#454652]",                                   // 5th
] as const;

/** Props for the Leaderboard component. */
interface LeaderboardProps {
  /** Country to fetch top scores for. */
  readonly country: string;
}

/**
 * Fetches and displays the top quiz scores for the given country.
 *
 * @param props - Component props containing the country code.
 */
export default function Leaderboard({ country }: LeaderboardProps) {
  const [scores, setScores] = useState<QuizScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /** Fetches top scores from Firestore. */
    async function fetchScores(): Promise<void> {
      const topScores = await getTopScores(country, TOP_SCORES_COUNT);
      setScores(topScores);
      setLoading(false);
    }
    fetchScores();
  }, [country]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm text-center mt-6" role="status" aria-label="Loading leaderboard">
        <p className="text-[#767683] text-sm animate-pulse">Loading Leaderboard...</p>
      </div>
    );
  }

  if (scores.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm text-center mt-6">
        <h3 className="text-lg font-bold text-[#1a237e] mb-2">🏆 Top Scores</h3>
        <p className="text-[#767683] text-sm">Be the first to submit a score!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm mt-6" role="region" aria-label="Quiz leaderboard">
      <h3 className="text-lg font-bold text-[#1a237e] mb-4 text-center">🏆 Top 5 Champions</h3>
      <div className="space-y-3">
        {scores.map((score, idx) => (
          <div
            key={score.id}
            className="flex justify-between items-center bg-[#efecf5] px-4 py-3 rounded-xl border border-transparent hover:border-[#c6c5d4] transition-all"
          >
            <div className="flex items-center gap-3">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${RANK_STYLES[idx] ?? RANK_STYLES[RANK_STYLES.length - 1]}`}
                aria-label={`Rank ${idx + 1}`}
              >
                {idx + 1}
              </span>
              <span className="font-semibold text-sm text-[#1b1b21]">Anonymous</span>
            </div>
            <div className="text-right">
              <span className="block font-bold text-[#1a237e]">{score.score} pts</span>
              <span className="block text-[10px] text-[#767683] font-semibold">{score.accuracy}% Acc</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
