// src/lib/knowledgeBase.ts

export interface KBEntry {
  keys: string[];
  answer: string;
}

export const knowledgeBase: KBEntry[] = [
  {
    keys: ["voter id", "voter card", "apply for voter", "get voter id", "make voter id", "voter id card", "how to get voter", "epic card"],
    answer: `**🪪 How to Apply for a Voter ID Card**

**🇺🇸 United States:**
1. Visit **[vote.gov](https://vote.gov)** — the official U.S. voter registration portal
2. Select your state and click **"Register to Vote"**
3. Fill in your **full name, address, date of birth**, and state ID or last 4 digits of SSN
4. Submit online, by mail, or in person at your local DMV or election office
5. Receive your **Voter Registration Card** by mail in 2–4 weeks ✉️

✅ **Eligibility:** U.S. citizen · 18+ on or before Election Day · State resident

🇮🇳 **In India:** Apply for EPIC (Voter ID) at [voters.eci.gov.in](https://voters.eci.gov.in) using **Form 6**. You'll need Aadhaar/PAN + address proof + passport photo.`,
  },
  {
    keys: ["charge", "fee", "cost", "how much", "price", "money", "paid", "free", "charges"],
    answer: `**💰 Cost / Charges for Voter ID Card**

✅ **Voter Registration is 100% FREE in the United States!**

🆓 **Free in the U.S.:**
- Voter Registration Card — Free, mailed to you automatically
- Free state-issued photo ID for voting at your local DMV
- Provisional ballot — free if you lack an accepted ID at the polls

🇮🇳 **India (EPIC Voter ID Card):**
- Applying for a new Voter ID — **Completely FREE**
- Replacement or correction — **Also FREE**
- Apply at: [voters.eci.gov.in](https://voters.eci.gov.in)

⚠️ **Warning:** If anyone charges you money to register — it is a **SCAM!**`,
  },
  {
    keys: ["next election", "upcoming election", "when is election", "election date", "election 2025", "election 2026", "next vote", "future election", "when will election"],
    answer: `**🗓️ Upcoming & Next Elections**

**🇺🇸 United States:**
- 🏙️ **2025 Off-Year Elections** — State & local races in Virginia, New Jersey, Kentucky (Spring & Fall 2025)
- 🏛️ **2026 Midterm Elections** — All 435 House seats + 33 Senate seats + 36 Governorships. **Election Day: November 3, 2026**
- 🇺🇸 **2028 Presidential Election** — November 7, 2028

**🇮🇳 India:**
- State Assembly elections throughout 2025 (Bihar, Delhi local bodies, etc.)
- Next Lok Sabha General Election: **April–May 2029**

📍 Verify exact dates at [vote.gov](https://vote.gov) (US) or [eci.gov.in](https://eci.gov.in) (India).`,
  },
  {
    keys: ["register", "registration", "sign up", "how do i register", "enroll", "how to register"],
    answer: `**📋 How to Register to Vote**

1. Visit **[vote.gov](https://vote.gov)** or your state's official election website
2. Fill in your **name, address, date of birth**, and state ID / last 4 digits of SSN
3. Submit before your state deadline — usually **15–30 days before** the election
4. Get your **Voter Registration Card** by mail ✉️

💡 Many states allow **same-day registration** at the polls on Election Day!

✅ **You can register if you are:** a U.S. citizen · 18+ on or before Election Day · a state resident`,
  },
  {
    keys: ["voting day", "election day", "when is voting", "poll", "go to vote"],
    answer: `**🗳️ What Happens on Voting Day?**

- 🕕 Polls open typically **6 AM – 8 PM** local time
- 📍 Find your polling place at [vote.gov/find-my-polling-place](https://vote.gov/find-my-polling-place)
- 🪪 Bring your accepted ID (driver's license, passport, etc.)
- ✅ Check in → receive ballot → mark choices → submit
- ⏰ **In line before polls close? You MUST be allowed to vote!**
- 📬 Alternatively: **Early Voting** (~2 weeks before) or **Mail-In Ballot**

🎉 Pick up your *"I Voted!"* sticker!`,
  },
  {
    keys: ["ballot", "what is a ballot", "how to vote", "voting process", "cast vote"],
    answer: `**🗳️ What is a Ballot?**

A ballot is the official form you use to cast your vote. Types include:

- 📄 **Paper Ballot** — Fill in ovals/boxes, feed into a scanner
- 💻 **Electronic Ballot** — Touchscreen at the polling place
- ✉️ **Mail-In / Absentee** — Mailed to your home, return by mail or drop box

🔒 **Your ballot is completely secret** — no one can know how you voted!`,
  },
  {
    keys: ["electoral college", "electors", "electoral vote", "270 votes"],
    answer: `**🏛️ What is the Electoral College?**

A system of **538 electors** who formally elect the U.S. President. A candidate needs **270 electoral votes** to win.

- Each state's votes = its House seats + 2 Senate seats
- Most states: Winner-takes-all system
- Maine & Nebraska: Can split their electoral votes
- Electors meet formally in December to cast official votes`,
  },
  {
    keys: ["right", "rights", "voter protection", "illegal", "denied", "suppression"],
    answer: `**⚖️ Your Voter Rights**

- 🔒 **Secret Ballot** — Nobody can see how you voted
- ⏰ **Line Rule** — In line before close? You MUST vote, period
- ♿ **Accessibility** — Polling places must accommodate all disabilities
- 🌍 **Language Assistance** — Translation services available where needed
- 📋 **Provisional Ballot** — Available if your registration is questioned
- ⚖️ **No Coercion** — Illegal to threaten, bribe, or pressure your vote

🆘 Rights violated? Call **1-866-OUR-VOTE**`,
  },
  {
    keys: ["id to vote", "id needed", "what id", "identification", "what do i need to vote", "bring to poll"],
    answer: `**🪪 What ID Do You Need to Vote?**

Common accepted forms include:
- ✅ Driver's license or state-issued photo ID
- ✅ U.S. Passport
- ✅ Military ID
- ✅ Student ID *(accepted in some states)*

💡 No photo ID? You can usually still cast a **provisional ballot**.

📍 Check your state's specific rules at [vote.gov](https://vote.gov)`,
  },
  {
    keys: ["amendment", "19th", "26th", "15th", "women vote", "voting age", "civil rights", "constitution"],
    answer: `**📜 Key Voting Amendments (U.S. Constitution)**

- 🗳️ **15th Amendment (1870)** — Cannot deny vote based on race or color
- 👩 **19th Amendment (1920)** — Women's right to vote guaranteed
- 💵 **24th Amendment (1964)** — Abolished poll taxes in federal elections
- 🎂 **26th Amendment (1971)** — Lowered voting age to 18`,
  },
  {
    keys: ["hi", "hello", "hey", "hii", "namaste", "help", "what can you do", "start"],
    answer: `**👋 Hello! I'm ElectBot 🗳️**

I'm your election education assistant! Here's what I can help with:

- 🪪 **How to apply for a Voter ID card** (it's free!)
- 💰 **Cost / charges of voter registration** (it's free!)
- 🗓️ **When is the next election?**
- 📋 **How to register to vote**
- 🗳️ **What to do on voting day**
- ⚖️ **Your voter rights & protections**
- 🏛️ **What is the Electoral College?**

Just type your question or click a suggestion chip! 💬`,
  },
];

export function getLocalAnswer(msg: string): string {
  const lower = msg.toLowerCase();
  let bestMatch: KBEntry | null = null;
  let bestScore = 0;

  for (const entry of knowledgeBase) {
    const score = entry.keys.filter((k) => lower.includes(k)).length;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  if (bestMatch && bestScore > 0) return bestMatch.answer;

  return `I don't have a specific answer for that yet.\n\nHere's what I **can** help with:\n- 🪪 How to apply for a Voter ID card\n- 💰 Cost / charges of voter registration (free!)\n- 🗓️ When is the next election?\n- 📋 How to register to vote\n- 🗳️ What to expect on voting day\n- ⚖️ Your voter rights\n\n💡 Add a Gemini API key for unlimited AI answers!`;
}
