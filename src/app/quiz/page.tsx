"use client";
// src/app/quiz/page.tsx
import { useState } from "react";
import { useCountry } from "@/lib/countryContext";
import { indiaQuestions, usaQuestions, Question } from "@/lib/countryData";

const LETTERS = ["A", "B", "C", "D"];

export default function QuizPage() {
  const { country } = useCountry();
  const questions: Question[] = country === "india" ? indiaQuestions : usaQuestions;

  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [done, setDone] = useState(false);
  const [prevCountry, setPrevCountry] = useState(country);

  // Reset quiz when country changes
  if (country !== prevCountry) {
    setPrevCountry(country);
    setCurrentQ(0); setSelected(null); setSubmitted(false);
    setScore(0); setStreak(0); setBestStreak(0);
    setCorrect(0); setAnswered(0); setDone(false);
  }

  const q = questions[currentQ];
  const progress = ((currentQ + 1) / questions.length) * 100;
  const acc = answered > 0 ? Math.round((correct / answered) * 100) : 0;

  const handleSubmit = () => {
    if (selected === null) return;
    const isCorrect = selected === q.correct;
    setAnswered((a) => a + 1);
    setSubmitted(true);
    if (isCorrect) {
      setScore((s) => s + 100 + streak * 10);
      setStreak((s) => { setBestStreak((b) => Math.max(b, s + 1)); return s + 1; });
      setCorrect((c) => c + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (currentQ + 1 >= questions.length) setDone(true);
    else { setCurrentQ((c) => c + 1); setSelected(null); setSubmitted(false); }
  };

  const restart = () => {
    setCurrentQ(0); setSelected(null); setSubmitted(false);
    setScore(0); setStreak(0); setBestStreak(0);
    setCorrect(0); setAnswered(0); setDone(false);
  };

  if (done) {
    const finalAcc = Math.round((correct / questions.length) * 100);
    return (
      <div className="max-w-xl mx-auto px-6 py-16 text-center">
        <span className="text-7xl mb-4 block">🏆</span>
        <h2 className="text-3xl font-black text-[#1a237e] mb-1">
          {country === "india" ? "Quiz Poori Hui!" : "Quiz Complete!"}
        </h2>
        <p className="text-[#454652] mb-2">
          {country === "india" ? `🇮🇳 India Civic Quiz` : `🇺🇸 U.S. Civic Quiz`}
        </p>
        <p className="text-[#767683] mb-8">
          {country === "india" ? "Bahut badiya! Civic knowledge test complete!" : "Great job completing the civic knowledge quiz!"}
        </p>
        <div className="grid grid-cols-2 gap-4 mb-8">
          {[["🎯", "Final Score", score], ["✅", country === "india" ? "Sahi Jawab" : "Correct", `${correct}/${questions.length}`], ["📊", "Accuracy", `${finalAcc}%`], ["🔥", "Best Streak", bestStreak]].map(([em, label, val]) => (
            <div key={label as string} className="bg-white rounded-2xl p-5 shadow-sm text-center">
              <span className="text-2xl block mb-1">{em}</span>
              <span className="block text-2xl font-black text-[#1a237e]">{val}</span>
              <span className="text-xs text-[#767683] font-semibold">{label as string}</span>
            </div>
          ))}
        </div>
        <button onClick={restart} className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#1a237e] to-[#3d4fc8] text-white font-bold text-base shadow-lg hover:-translate-y-1 transition-all">
          🔄 {country === "india" ? "Dobara Khelein" : "Try Again"}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      {/* Country badge */}
      <div className="flex items-center gap-2 mb-5">
        <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-white border border-[#c6c5d4] text-[#1a237e]">
          {country === "india" ? "🇮🇳 India Civic Quiz" : "🇺🇸 U.S. Civic Quiz"}
        </span>
      </div>

      {/* Score Bar */}
      <div className="flex gap-3 mb-6">
        {[["🎯", "Score", score], ["🔥", "Streak", streak], ["📊", "Accuracy %", acc]].map(([em, label, val]) => (
          <div key={label as string} className="flex-1 bg-white rounded-xl p-3 text-center shadow-sm">
            <span className="text-lg block">{em}</span>
            <span className="block font-black text-[#1a237e] text-lg">{val}</span>
            <span className="text-[10px] text-[#767683] font-semibold">{label as string}</span>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-sm font-semibold text-[#767683]">
          {country === "india" ? `Question ${currentQ + 1} of ${questions.length}` : `Question ${currentQ + 1} of ${questions.length}`}
        </span>
        <div className="flex-1 h-2 bg-[#e4e1ea] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#ffc107] to-[#ff8f00] rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Card */}
      <div className="bg-white rounded-3xl shadow-[0_8px_32px_rgba(27,27,33,0.1)] overflow-hidden">
        <div className="bg-gradient-to-r from-[#1a237e] to-[#3d4fc8] px-7 py-7">
          <p className="text-white font-bold text-lg leading-relaxed">{q.q}</p>
        </div>

        <div className="p-6 space-y-3">
          {q.options.map((opt, i) => {
            let style = "bg-[#efecf5] border-transparent text-[#1b1b21]";
            if (!submitted) {
              if (selected === i) style = "bg-white border-[#3d4fc8] text-[#1a237e] shadow";
            } else {
              if (i === q.correct) style = "bg-green-50 border-green-500 text-green-700";
              else if (i === selected && selected !== q.correct) style = "bg-red-50 border-red-400 text-red-700";
              else style = "bg-[#efecf5] border-transparent text-[#767683]";
            }
            return (
              <button key={i} onClick={() => !submitted && setSelected(i)} disabled={submitted}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 text-left font-medium transition-all ${style} ${!submitted ? "hover:bg-white hover:border-[#3d4fc8] hover:text-[#1a237e]" : ""}`}>
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  submitted && i === q.correct ? "bg-green-500 text-white" :
                  submitted && i === selected && selected !== q.correct ? "bg-red-400 text-white" :
                  selected === i && !submitted ? "bg-[#1a237e] text-white" : "bg-[#c6c5d4] text-[#454652]"
                }`}>{LETTERS[i]}</span>
                <span>{opt}</span>
              </button>
            );
          })}

          {submitted && (
            <div className={`rounded-xl p-4 text-sm font-medium leading-relaxed ${selected === q.correct ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
              {selected === q.correct ? q.explanation : `❌ ${q.explanation.replace("✅ ", "Correct answer: ")}`}
            </div>
          )}

          <div className="pt-1">
            {!submitted ? (
              <button onClick={handleSubmit} disabled={selected === null}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#1a237e] to-[#3d4fc8] text-white font-bold text-base disabled:opacity-40 hover:-translate-y-0.5 hover:shadow-lg transition-all">
                {country === "india" ? "Jawab Submit Karein" : "Submit Answer"}
              </button>
            ) : (
              <button onClick={handleNext}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#1a237e] to-[#3d4fc8] text-white font-bold text-base hover:-translate-y-0.5 hover:shadow-lg transition-all">
                {currentQ + 1 >= questions.length ? (country === "india" ? "Result Dekhein 🏆" : "See Results 🏆") : (country === "india" ? "Agla Sawaal →" : "Next Question →")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
