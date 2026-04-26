"use client";
import { useEffect, useState } from "react";
import { getTopScores, QuizScore } from "@/lib/firestoreService";

export default function Leaderboard({ country }: { country: string }) {
  const [scores, setScores] = useState<QuizScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchScores() {
      const topScores = await getTopScores(country, 5);
      setScores(topScores);
      setLoading(false);
    }
    fetchScores();
  }, [country]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm text-center mt-6">
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
    <div className="bg-white rounded-2xl p-6 shadow-sm mt-6">
      <h3 className="text-lg font-bold text-[#1a237e] mb-4 text-center">🏆 Top 5 Champions</h3>
      <div className="space-y-3">
        {scores.map((score, idx) => (
          <div key={score.id} className="flex justify-between items-center bg-[#efecf5] px-4 py-3 rounded-xl border border-transparent hover:border-[#c6c5d4] transition-all">
            <div className="flex items-center gap-3">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${idx === 0 ? "bg-gradient-to-r from-[#ffc107] to-[#ff8f00] text-[#785900]" : idx === 1 ? "bg-gray-300 text-gray-700" : idx === 2 ? "bg-amber-700 text-amber-100" : "bg-[#c6c5d4] text-[#454652]"}`}>
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
