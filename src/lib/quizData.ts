// src/lib/quizData.ts
export interface Question {
  q: string;
  options: string[];
  correct: number;
  explanation: string;
}

export const questions: Question[] = [
  {
    q: "What is the minimum voting age in most U.S. states?",
    options: ["16 years old", "18 years old", "21 years old", "17 years old"],
    correct: 1,
    explanation: "✅ The 26th Amendment (1971) lowered the voting age to 18 in all U.S. elections.",
  },
  {
    q: "How many electoral votes does a presidential candidate need to win?",
    options: ["260", "270", "300", "435"],
    correct: 1,
    explanation: "✅ A candidate needs 270 out of 538 total electoral votes — a simple majority.",
  },
  {
    q: "Which amendment gave women the right to vote in the U.S.?",
    options: ["13th Amendment", "15th Amendment", "19th Amendment", "26th Amendment"],
    correct: 2,
    explanation: "✅ The 19th Amendment (1920) guarantees women the right to vote.",
  },
  {
    q: "What is a primary election?",
    options: [
      "The main presidential election every 4 years",
      "A vote to decide which candidate represents a party in the general election",
      "A local election for city council only",
      "A special election to fill a vacant seat",
    ],
    correct: 1,
    explanation:
      "✅ Primary elections determine which candidate represents a political party in the general election.",
  },
  {
    q: "On what day are U.S. federal general elections held?",
    options: [
      "First Monday in November",
      "First Tuesday after the first Monday in November",
      "November 5th every year",
      "Last Wednesday of October",
    ],
    correct: 1,
    explanation:
      "✅ Federal elections are held on the first Tuesday after the first Monday in November — a tradition since 1845!",
  },
  {
    q: "What is the Electoral College?",
    options: [
      "A college course about elections",
      "The U.S. Senate voting on elections",
      "A group of electors who formally elect the President and Vice President",
      "The Supreme Court body that certifies results",
    ],
    correct: 2,
    explanation:
      "✅ The Electoral College is 538 electors who formally cast electoral votes for President after the November election.",
  },
  {
    q: "Which amendment prevents denying the vote based on race?",
    options: ["13th Amendment", "14th Amendment", "15th Amendment", "Voting Rights Act"],
    correct: 2,
    explanation:
      "✅ The 15th Amendment (1870) prohibits denying the right to vote based on race, color, or previous servitude.",
  },
  {
    q: "What is a 'provisional ballot'?",
    options: [
      "A paper ballot counted immediately",
      "A ballot cast when a voter's eligibility cannot be confirmed at that moment",
      "An absentee ballot sent by mail",
      "A ballot used only in primaries",
    ],
    correct: 1,
    explanation:
      "✅ A provisional ballot is set aside and verified after Election Day when a voter's eligibility is questioned at the polls.",
  },
];
