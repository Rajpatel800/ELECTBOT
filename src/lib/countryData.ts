// src/lib/countryData.ts
// All country-specific data: learn modules, timeline, quiz, chat knowledge base

// ─────────────────────────────────────────────
//  QUIZ DATA
// ─────────────────────────────────────────────
export interface Question {
  q: string;
  options: string[];
  correct: number;
  explanation: string;
}

export const indiaQuestions: Question[] = [
  { q: "What is the minimum voting age in India?", options: ["16 years", "18 years", "21 years", "25 years"], correct: 1, explanation: "✅ The 61st Amendment (1989) lowered the voting age to 18 in India for all elections." },
  { q: "Which body is responsible for conducting elections in India?", options: ["Supreme Court", "Parliament", "Election Commission of India (ECI)", "UPSC"], correct: 2, explanation: "✅ The Election Commission of India (ECI) is an autonomous constitutional authority responsible for administering elections." },
  { q: "What is the full form of EPIC?", options: ["Electoral Photo Identity Card", "Election Process Identification Certificate", "Electoral Public Identity Code", "Elected Person ID Card"], correct: 0, explanation: "✅ EPIC stands for Electoral Photo Identity Card — the official Voter ID card issued by ECI." },
  { q: "How many members does the Lok Sabha have?", options: ["250", "545", "552", "790"], correct: 2, explanation: "✅ The Lok Sabha has a total of 552 members — 530 from states, 20 from Union Territories, and 2 nominated by the President." },
  { q: "What is NOTA in Indian elections?", options: ["None Of The Above", "No Official Ticket Available", "National Officer Tournament Act", "Non-Official Tribal Area"], correct: 0, explanation: "✅ NOTA (None Of The Above) allows voters to reject all candidates. It was introduced by the Supreme Court in 2013." },
  { q: "How often are Lok Sabha elections held?", options: ["Every 3 years", "Every 4 years", "Every 5 years", "Every 6 years"], correct: 2, explanation: "✅ Lok Sabha elections are held every 5 years unless the House is dissolved earlier." },
  { q: "Which article of the Indian Constitution deals with elections?", options: ["Article 14", "Article 324", "Article 370", "Article 21"], correct: 1, explanation: "✅ Article 324 of the Constitution vests the superintendence, direction, and control of elections in the Election Commission of India." },
  { q: "What is Form 6 used for in Indian elections?", options: ["Applying for Aadhaar card", "Registering as a new voter", "Filing a complaint against a candidate", "Requesting a postal ballot"], correct: 1, explanation: "✅ Form 6 is the application form used for new voter registration in India at voters.eci.gov.in." },
];

export const usaQuestions: Question[] = [
  { q: "What is the minimum voting age in most U.S. states?", options: ["16 years old", "18 years old", "21 years old", "17 years old"], correct: 1, explanation: "✅ The 26th Amendment (1971) lowered the voting age to 18 in all U.S. elections." },
  { q: "How many electoral votes does a presidential candidate need to win?", options: ["260", "270", "300", "435"], correct: 1, explanation: "✅ A candidate needs 270 out of 538 total electoral votes — a simple majority." },
  { q: "Which amendment gave women the right to vote in the U.S.?", options: ["13th Amendment", "15th Amendment", "19th Amendment", "26th Amendment"], correct: 2, explanation: "✅ The 19th Amendment (1920) guarantees women the right to vote." },
  { q: "What is a primary election?", options: ["The main presidential election every 4 years", "A vote to decide which candidate represents a party in the general election", "A local election for city council only", "A special election to fill a vacant seat"], correct: 1, explanation: "✅ Primary elections determine which candidate represents a political party in the general election." },
  { q: "On what day are U.S. federal general elections held?", options: ["First Monday in November", "First Tuesday after the first Monday in November", "November 5th every year", "Last Wednesday of October"], correct: 1, explanation: "✅ Federal elections are held on the first Tuesday after the first Monday in November — a tradition since 1845!" },
  { q: "What is the Electoral College?", options: ["A college course about elections", "The U.S. Senate voting on elections", "A group of electors who formally elect the President and Vice President", "The Supreme Court body that certifies results"], correct: 2, explanation: "✅ The Electoral College is 538 electors who formally cast electoral votes for President after the November election." },
  { q: "Which amendment prevents denying the vote based on race?", options: ["13th Amendment", "14th Amendment", "15th Amendment", "Voting Rights Act"], correct: 2, explanation: "✅ The 15th Amendment (1870) prohibits denying the right to vote based on race." },
  { q: "What is a 'provisional ballot'?", options: ["A paper ballot counted immediately", "A ballot cast when a voter's eligibility cannot be confirmed", "An absentee ballot sent by mail", "A ballot used only in primaries"], correct: 1, explanation: "✅ A provisional ballot is set aside and verified after Election Day when a voter's eligibility is questioned." },
];

// ─────────────────────────────────────────────
//  LEARN MODULES
// ─────────────────────────────────────────────
export interface LearnModule {
  id: string;
  icon: string;
  title: string;
  tag: string;
  content: string; // markdown-like string for simplicity
}

export const indiaModules: LearnModule[] = [
  {
    id: "in1", icon: "🪪", title: "Voter Registration (EPIC Card)", tag: "Beginner · 5 min",
    content: `## Who Can Register?\n- Indian citizen aged **18 or above** on the qualifying date (1st January of the year)\n- Ordinary resident of the constituency\n- Not disqualified under any law\n\n## How to Register (Form 6)\n1. Visit **[voters.eci.gov.in](https://voters.eci.gov.in)** – the official portal\n2. Click "New Registration" and fill Form 6\n3. Upload: Passport photo · Proof of age (Aadhaar/Birth cert) · Address proof\n4. Submit and track your application online\n5. Receive your **EPIC (Voter ID) card** by post – completely FREE!\n\n💡 *You can also use the **Voter Helpline App** or visit your local BLO (Booth Level Officer)*`,
  },
  {
    id: "in2", icon: "🏛️", title: "Types of Elections in India", tag: "Beginner · 5 min",
    content: `## Lok Sabha Elections\nHeld every **5 years**, elects 543 Members of Parliament. The party/coalition with majority forms the government.\n\n## Rajya Sabha Elections\nThe upper house has 245 members. Members are elected by state legislatures — not directly by the public. One-third retires every 2 years.\n\n## State Assembly (Vidhan Sabha)\nEach state elects its own legislative assembly (MLAs) every 5 years. The party with majority forms the state government.\n\n## Local Body Elections\nPanchayat (village/block/district) and Municipal Corporation elections — most directly impact daily life!\n\n## By-Elections\nHeld when a seat becomes vacant mid-term due to death, resignation, or disqualification.`,
  },
  {
    id: "in3", icon: "📍", title: "Voting Day Guide (India)", tag: "Intermediate · 5 min",
    content: `## What to Bring\n- 🪪 EPIC (Voter ID) card **OR** any of: Aadhaar, Passport, PAN card, Driving License, MNREGA card, Pension document, Smart card\n- ✅ Even a recent utility bill works as address proof in some states\n\n## At the Polling Booth\n1. Find your polling station using **[electoralsearch.eci.gov.in](https://electoralsearch.eci.gov.in)**\n2. Check in with the Presiding Officer\n3. Get the indelible ink mark on your left index finger\n4. Receive a ballot slip (or use EVM)\n5. Press the button next to your chosen candidate on the **EVM (Electronic Voting Machine)**\n6. Optionally verify using **VVPAT** (paper slip)\n\n⏰ Polls are typically open **7 AM – 6 PM** (may vary by constituency)`,
  },
  {
    id: "in4", icon: "⚖️", title: "How Votes Are Counted", tag: "Intermediate · 5 min",
    content: `## EVM Counting\nAfter polling, EVMs are sealed and stored under security. On counting day, EVMs are opened and results tallied.\n\n## First-Past-The-Post (FPTP)\nIndia uses FPTP — the candidate with the **most votes wins**, even without a majority.\n\n## Lok Sabha Majority\nOut of 543 Lok Sabha seats, a party/coalition needs **272+ seats** to form government.\n\n## NOTA\nVoters who reject all candidates can press **NOTA (None of the Above)**. If NOTA gets the most votes, a re-election is held in some cases.\n\n## Result Declaration\nResults are announced on election count day, usually 4–6 weeks after polling ends.`,
  },
  {
    id: "in5", icon: "📜", title: "Your Rights as a Voter (India)", tag: "Essential · 4 min",
    content: `## Constitutional Rights\n- **Article 326** – Right to vote for every adult citizen\n- **Secret Ballot** – Your vote is completely private\n- **NOTA** – Right to reject all candidates\n\n## Practical Rights\n- ⏰ In the queue before closing? You **must** be allowed to vote\n- ♿ PWD voters get special assistance and accessible polling booths\n- 🚗 ECI provides transport assistance for elderly and disabled voters\n- 🏠 Home Voting available for 85+ seniors and 40%+ disabled persons (new initiative)\n\n## Report Violations\n- **Voter Helpline: 1950** – Call free from any phone\n- **cVIGIL App** – Report violations with photo/video directly to ECI`,
  },
];

export const usaModules: LearnModule[] = [
  {
    id: "us1", icon: "📋", title: "Voter Registration", tag: "Beginner · 5 min",
    content: `## Who Can Register?\n- U.S. citizen aged **18+** on or before Election Day\n- Resident of the state where registering\n- Not currently serving a felony sentence (rules vary by state)\n\n## How to Register\n1. Visit **[vote.gov](https://vote.gov)** or your state's Secretary of State website\n2. Fill in name, address, date of birth, and state ID number\n3. Submit before your state's deadline (typically 15–30 days before election)\n4. Receive your voter registration card by mail ✉️\n\n💡 *Many states offer **same-day registration** at polling locations!*`,
  },
  {
    id: "us2", icon: "🗳️", title: "Types of Elections", tag: "Beginner · 4 min",
    content: `## General Elections\nHeld every 2 years in November — decide U.S. House, Senate (1/3 of seats), and every 4 years, the Presidency.\n\n## Primary Elections\nPrimaries determine which candidate represents a party in the general election. Can be **open** or **closed** depending on the state.\n\n## Local Elections\nElect mayors, city council, school board members, and judges — often most directly impacting daily life!\n\n## Special Elections\nHeld to fill vacant seats between regular election cycles.`,
  },
  {
    id: "us3", icon: "📍", title: "Voting Day Guide", tag: "Intermediate · 6 min",
    content: `## What to Bring\n- 📄 Government-issued photo ID (driver's license, passport, military ID)\n- 📋 Voter registration card (if required by your state)\n- 📍 Address confirmation if you moved recently\n\n## At the Polling Place\n1. Find your polling place at **vote.gov/find-my-polling-place**\n2. Check in with poll workers and show your ID\n3. Receive your ballot and go to a private booth\n4. Fill in your choices completely and carefully\n5. Submit ballot via scanner or drop box\n6. Get your 'I Voted!' sticker 🎉\n\n⏰ Polls open **6 AM – 8 PM** local time in most states`,
  },
  {
    id: "us4", icon: "⚖️", title: "How Votes Are Counted", tag: "Intermediate · 7 min",
    content: `## The Electoral College\nFor Presidential elections, the U.S. uses the Electoral College. Each state has electors = House seats + 2 Senate seats. A candidate needs **270 out of 538** electoral votes to win.\n\n## Popular Vote\nIn most elections (Senate, House, local), the candidate with the most votes wins.\n\n## Ranked-Choice Voting\nSome states/cities allow voters to rank candidates in order of preference — winner is determined through rounds of elimination.\n\n⭐ *It's possible to win the Presidency without winning the nationwide popular vote by winning key states with large electoral vote counts.*`,
  },
  {
    id: "us5", icon: "📜", title: "Your Rights as a Voter", tag: "Essential · 4 min",
    content: `## Constitutional Protections\n- **15th Amendment (1870)** – Cannot deny vote based on race\n- **19th Amendment (1920)** – Women's right to vote\n- **24th Amendment (1964)** – Abolished poll taxes\n- **26th Amendment (1971)** – Voting age lowered to 18\n\n## At the Polls\n- 🔒 **Secret Ballot** – No one can know how you voted\n- ⏰ **Line Rule** – In line before close? You MUST vote, period\n- ♿ **Accessibility** – Polling places must accommodate disabilities\n- 📋 **Provisional Ballot** – Available if registration is questioned\n\n## Report Violations\n- **Hotline: 1-866-OUR-VOTE**`,
  },
];

// ─────────────────────────────────────────────
//  TIMELINE DATA
// ─────────────────────────────────────────────
export interface TimelineItem {
  status: "completed" | "current" | "upcoming" | "gold";
  dot: string;
  date: string;
  title: string;
  desc: string;
  tag: string;
  tagColor: string;
  reminder?: boolean;
}

export interface TimelineTab {
  key: string;
  label: string;
  items: TimelineItem[];
}

export const indiaTimeline: TimelineTab[] = [
  {
    key: "lok", label: "Lok Sabha 2024",
    items: [
      { status: "completed", dot: "✓", date: "March 16, 2024", title: "Election Schedule Announced", desc: "ECI announced the 7-phase Lok Sabha election schedule for 2024.", tag: "Completed", tagColor: "bg-[#efecf5] text-[#767683]" },
      { status: "completed", dot: "✓", date: "March 28, 2024", title: "Model Code of Conduct", desc: "Model Code of Conduct came into effect, restricting government announcements and political activities.", tag: "Completed", tagColor: "bg-[#efecf5] text-[#767683]" },
      { status: "completed", dot: "✓", date: "Phase 1 – April 19, 2024", title: "Phase 1 Voting", desc: "102 constituencies across 21 states and UTs voted in the first phase.", tag: "Completed", tagColor: "bg-[#efecf5] text-[#767683]" },
      { status: "completed", dot: "✓", date: "April 26 – May 20, 2024", title: "Phases 2–6 Voting", desc: "Remaining phases covering all 543 Lok Sabha constituencies across India.", tag: "Completed", tagColor: "bg-[#efecf5] text-[#767683]" },
      { status: "completed", dot: "★", date: "June 1, 2024", title: "🗳️ Phase 7 — Final Voting Day", desc: "The 7th and final phase of voting. All voters exercised their franchise across remaining constituencies.", tag: "Completed", tagColor: "bg-[#efecf5] text-[#767683]" },
      { status: "gold", dot: "🎉", date: "June 4, 2024", title: "Vote Counting & Results", desc: "Votes counted across all constituencies. Results declared by ECI. NDA won majority, PM Modi sworn in for 3rd term.", tag: "Results", tagColor: "bg-amber-100 text-amber-700" },
    ],
  },
  {
    key: "state", label: "State Elections 2025",
    items: [
      { status: "completed", dot: "✓", date: "February 2025", title: "Delhi Assembly Elections", desc: "Delhi Vidhan Sabha elections — 70 seats contested. BJP won majority.", tag: "Completed", tagColor: "bg-[#efecf5] text-[#767683]" },
      { status: "current", dot: "★", date: "Mid 2025", title: "🗳️ Bihar Assembly Elections", desc: "Elections for Bihar Vidhan Sabha expected in 2025. ECI to announce schedule.", tag: "Upcoming", tagColor: "bg-[#e0e0ff] text-[#1a237e]", reminder: true },
      { status: "upcoming", dot: "○", date: "2025–2026", title: "Other State Elections", desc: "Several other states including UP local elections, Panchayat elections, and municipal corporation elections.", tag: "Upcoming", tagColor: "bg-[#eae7ef] text-[#454652]" },
    ],
  },
  {
    key: "next", label: "Future Elections",
    items: [
      { status: "upcoming", dot: "○", date: "2026", title: "Multiple State Assembly Elections", desc: "West Bengal, Tamil Nadu, Kerala, and Assam assemblies due for elections in 2026.", tag: "Upcoming", tagColor: "bg-[#eae7ef] text-[#454652]" },
      { status: "upcoming", dot: "○", date: "2029", title: "🇮🇳 Lok Sabha General Election", desc: "Next General Election for all 543 Lok Sabha seats. Expected April–May 2029.", tag: "Next General", tagColor: "bg-amber-100 text-amber-700", reminder: true },
    ],
  },
];

export const usaTimeline: TimelineTab[] = [
  {
    key: "general", label: "2024 General",
    items: [
      { status: "completed", dot: "✓", date: "September 20, 2024", title: "Voter Registration Opens", desc: "New voters can begin registering online, by mail, or in person at DMV and election offices.", tag: "Completed", tagColor: "bg-[#efecf5] text-[#767683]" },
      { status: "completed", dot: "✓", date: "October 7, 2024", title: "Voter Registration Deadline", desc: "Last day to register in most states. Some states allow same-day registration.", tag: "Completed", tagColor: "bg-[#efecf5] text-[#767683]" },
      { status: "completed", dot: "✓", date: "October 24, 2024", title: "Early Voting Begins", desc: "Many states open early voting locations 2 weeks before Election Day.", tag: "Completed", tagColor: "bg-[#efecf5] text-[#767683]" },
      { status: "gold", dot: "🎉", date: "November 5, 2024", title: "🗳️ Election Day", desc: "The main event! Polls open 6 AM – 8 PM. If in line before 8 PM, you MUST be allowed to vote.", tag: "KEY DATE", tagColor: "bg-amber-100 text-amber-700", reminder: true },
      { status: "upcoming", dot: "○", date: "December 17, 2024", title: "Electoral College Meets", desc: "Presidential electors meet in their states to formally cast electoral votes.", tag: "Done", tagColor: "bg-[#efecf5] text-[#767683]" },
      { status: "upcoming", dot: "○", date: "January 20, 2025", title: "Inauguration Day", desc: "President sworn into office at the U.S. Capitol at noon Eastern Time.", tag: "Done", tagColor: "bg-[#efecf5] text-[#767683]" },
    ],
  },
  {
    key: "primary", label: "Primary 2024",
    items: [
      { status: "completed", dot: "✓", date: "January 15, 2024", title: "Iowa Caucuses", desc: "First major nominating contest of the presidential primary season.", tag: "Completed", tagColor: "bg-[#efecf5] text-[#767683]" },
      { status: "completed", dot: "✓", date: "March 5, 2024", title: "Super Tuesday", desc: "15+ states held primaries simultaneously. Frontrunner status determined.", tag: "Completed", tagColor: "bg-[#efecf5] text-[#767683]" },
      { status: "completed", dot: "✓", date: "July 2024", title: "Republican National Convention", desc: "Official nomination of the Republican presidential and VP candidates.", tag: "Completed", tagColor: "bg-[#efecf5] text-[#767683]" },
      { status: "completed", dot: "✓", date: "August 2024", title: "Democratic National Convention", desc: "Official nomination of the Democratic presidential and VP candidates.", tag: "Completed", tagColor: "bg-[#efecf5] text-[#767683]" },
    ],
  },
  {
    key: "midterm", label: "2026 Midterms",
    items: [
      { status: "upcoming", dot: "○", date: "Early 2026", title: "Candidate Filing Begins", desc: "Candidates file to run for all 435 House seats, 33 Senate seats, and 36 Governorships.", tag: "Upcoming", tagColor: "bg-[#eae7ef] text-[#454652]" },
      { status: "current", dot: "★", date: "November 3, 2026", title: "🏛️ 2026 Midterm Elections", desc: "All 435 House seats, 33 Senate seats, and 36 Governorships on the ballot.", tag: "Upcoming", tagColor: "bg-[#e0e0ff] text-[#1a237e]", reminder: true },
      { status: "upcoming", dot: "○", date: "November 2028", title: "🇺🇸 Next Presidential Election", desc: "Presidential election — November 7, 2028.", tag: "Future", tagColor: "bg-[#eae7ef] text-[#454652]" },
    ],
  },
];

// ─────────────────────────────────────────────
//  KNOWLEDGE BASE (Chat)
// ─────────────────────────────────────────────
export interface KBEntry { keys: string[]; answer: string; }

export const indiaKnowledgeBase: KBEntry[] = [
  {
    keys: ["voter id", "voter card", "apply for voter", "get voter id", "make voter id", "epic card", "form 6", "register", "registration"],
    answer: `**🪪 How to Apply for Voter ID Card (EPIC) in India**\n\n**Step 1:** Visit **[voters.eci.gov.in](https://voters.eci.gov.in)** — ECI's official portal\n**Step 2:** Click "New Registration" and fill Form 6\n**Step 3:** Upload required documents:\n- Passport-sized photograph\n- Proof of age (Aadhaar / Birth certificate / PAN card)\n- Address proof (Aadhaar / Electricity bill / Bank passbook)\n**Step 4:** Submit online and note your reference number\n**Step 5:** Receive your EPIC card by post in 2–4 weeks\n\n✅ FREE — No charges at all\n📱 Also available on: **Voter Helpline App** or call **1950**`,
  },
  {
    keys: ["charge", "fee", "cost", "how much", "price", "free", "kitna paisa", "kitne rupaye"],
    answer: `**💰 Is Voter ID Free in India?**\n\nYes! ✅ **Voter ID (EPIC card) is completely FREE in India.**\n\n- New registration — **₹0 (Free)**\n- Correction/Update — **₹0 (Free)**\n- Replacement of lost card — **₹0 (Free)**\n\nApply at: [voters.eci.gov.in](https://voters.eci.gov.in)\n\n⚠️ **Warning:** If anyone charges you money for voter ID registration — it is a **SCAM!** Report to: **1950 (Voter Helpline)**`,
  },
  {
    keys: ["next election", "upcoming election", "when is election", "election date", "election 2025", "election 2026", "agla election", "kab hai"],
    answer: `**🗓️ Upcoming Elections in India**\n\n- 🏙️ **Bihar Assembly Elections** — Expected mid-2025\n- 🏙️ **UP Local Body Elections** — 2025\n- 🗳️ **Multiple State Assemblies** — West Bengal, Tamil Nadu, Kerala in 2026\n- 🇮🇳 **Next Lok Sabha (General) Election** — **April–May 2029**\n\n📍 Check official dates at [eci.gov.in](https://eci.gov.in) or call **1950**`,
  },
  {
    keys: ["voting day", "polling day", "how to vote", "voting process", "evm", "indelible ink"],
    answer: `**🗳️ Voting Day in India**\n\n- 🕖 Polls open **7 AM – 6 PM** (may vary)\n- 📍 Find your booth: [electoralsearch.eci.gov.in](https://electoralsearch.eci.gov.in)\n- 🪪 Bring: EPIC card OR Aadhaar / Passport / PAN / DL\n- 👆 Get indelible ink mark on left index finger\n- 🖱️ Press button on **EVM** next to your candidate\n- ✅ **VVPAT** paper slip confirms your vote\n\n💡 **NOTA** is available on the EVM if you reject all candidates`,
  },
  {
    keys: ["nota", "none of the above", "reject all"],
    answer: `**🚫 What is NOTA?**\n\nNOTA = **None Of The Above**\n\nIntroduced by the Supreme Court in 2013, NOTA allows voters to formally reject all candidates without abstaining.\n\n- Available on every EVM as the last option\n- Your vote is counted and recorded\n- If NOTA gets the highest votes in a by-election, a fresh election may be ordered\n- Ensures voters aren't forced to choose the "least bad" candidate`,
  },
  {
    keys: ["lok sabha", "parliament", "mp", "member of parliament", "543", "seats"],
    answer: `**🏛️ Lok Sabha — India's Parliament**\n\n- **543** elected constituencies (+ 2 nominated Anglo-Indian members, now abolished)\n- Elections every **5 years** (or earlier if dissolved)\n- Majority needed to form government: **272+ seats**\n- Speaker elected by members from among themselves\n- Controls the budget and money bills\n\nCurrent composition varies; check [loksabha.nic.in](https://loksabha.nic.in)`,
  },
  {
    keys: ["eci", "election commission", "chief election commissioner"],
    answer: `**⚖️ Election Commission of India (ECI)**\n\nAn autonomous constitutional body established under **Article 324** of the Constitution.\n\n- Headed by the **Chief Election Commissioner**\n- Currently has 3 members: 1 CEC + 2 Election Commissioners\n- Conducts Lok Sabha, Rajya Sabha, State Assembly, and VP/President elections\n- Issues Model Code of Conduct before elections\n\n📞 Voter Helpline: **1950**\n🌐 [eci.gov.in](https://eci.gov.in)`,
  },
  {
    keys: ["right", "rights", "voter rights", "protection"],
    answer: `**⚖️ Your Rights as an Indian Voter**\n\n- 🔒 **Secret Ballot** — No one can see your vote\n- ✅ **NOTA** — Right to reject all candidates\n- ⏰ In queue before closing? You **must** be allowed to vote\n- ♿ **PWD Assistance** — Accessible booths + helper allowed\n- 🚗 **Home Voting** — For 85+ seniors and 40%+ disabled (new)\n- 📹 **cVIGIL App** — Report violations with photo/video\n\n📞 Voter Helpline: **1950** (toll free)`,
  },
  {
    keys: ["hi", "hello", "hey", "help", "start", "namaste", "what can you do"],
    answer: `**👋 Namaste! I'm ElectBot 🗳️**\n\nI'm your Indian Election Education assistant! Here's what I can help with:\n\n- 🪪 **Voter ID Card** — How to apply (free!)\n- 💰 **Charges** — Voter registration is FREE!\n- 🗓️ **Upcoming Elections** — Bihar, State polls, Lok Sabha 2029\n- 🗳️ **How to Vote** — EVM, VVPAT, NOTA explained\n- 🏛️ **Lok Sabha & Parliament** — How it works\n- ⚖️ **ECI** — Role of Election Commission\n- 📜 **Your Voter Rights** — Know your rights!\n\nJust type your question! 💬`,
  },
];

export const usaKnowledgeBase: KBEntry[] = [
  {
    keys: ["voter id", "voter card", "apply for voter", "get voter id", "make voter id", "register", "registration"],
    answer: `**🪪 How to Register to Vote (USA)**\n\n**Step 1:** Visit **[vote.gov](https://vote.gov)** — the official U.S. portal\n**Step 2:** Select your state and click "Register to Vote"\n**Step 3:** Fill in your name, address, date of birth, and state ID or last 4 digits of SSN\n**Step 4:** Submit online, by mail, or in person at your local DMV or election office\n**Step 5:** Receive your Voter Registration Card by mail in 2–4 weeks ✉️\n\n✅ **FREE — No charges at all!**\n💡 Many states offer **same-day registration** at polling locations`,
  },
  {
    keys: ["charge", "fee", "cost", "how much", "price", "free"],
    answer: `**💰 Cost of Voter Registration (USA)**\n\n✅ **Voter registration is 100% FREE in the United States!**\n\n- Voter Registration Card — **Free, mailed to you**\n- Free state photo ID for voting — available at DMV\n- Provisional ballot — free if you lack accepted ID\n\n🇮🇳 **India:** Also completely FREE at [voters.eci.gov.in](https://voters.eci.gov.in)\n\n⚠️ If anyone charges you — it's a **SCAM!**`,
  },
  {
    keys: ["next election", "upcoming election", "when is election", "election date", "election 2025", "election 2026"],
    answer: `**🗓️ Upcoming U.S. Elections**\n\n- 🏙️ **2025** — Off-year elections in Virginia, New Jersey, Kentucky and local races\n- 🏛️ **2026 Midterms** — All 435 House + 33 Senate + 36 Governorships. **Election Day: November 3, 2026**\n- 🇺🇸 **2028 Presidential Election** — November 7, 2028\n\n📍 Verify exact dates at [vote.gov](https://vote.gov)`,
  },
  {
    keys: ["voting day", "election day", "poll", "how to vote"],
    answer: `**🗳️ Voting Day (USA)**\n\n- 🕕 Polls open **6 AM – 8 PM** local time\n- 📍 Find your polling place: [vote.gov/find-my-polling-place](https://vote.gov/find-my-polling-place)\n- 🪪 Bring accepted ID (driver's license, passport, etc.)\n- ✅ Check in → ballot → mark choices → submit\n- ⏰ **In line before close? You MUST be allowed to vote!**\n- 📬 Early Voting (~2 weeks before) or Mail-In Ballot available`,
  },
  {
    keys: ["electoral college", "electors", "270 votes"],
    answer: `**🏛️ What is the Electoral College?**\n\n538 electors formally elect the U.S. President. **270 votes needed** to win.\n\n- Each state's votes = House seats + 2 Senate seats\n- Most states: Winner-takes-all\n- Maine & Nebraska: Can split their votes\n- Electors meet formally in December`,
  },
  {
    keys: ["right", "rights", "voter protection"],
    answer: `**⚖️ Your Voter Rights (USA)**\n\n- 🔒 **Secret Ballot** — No one can see your vote\n- ⏰ **Line Rule** — In line before close? You MUST vote\n- ♿ **Accessibility** — Polling places accommodate disabilities\n- 📋 **Provisional Ballot** — If registration is questioned\n- ⚖️ **No Coercion** — Illegal to pressure your vote\n\n🆘 **Hotline: 1-866-OUR-VOTE**`,
  },
  {
    keys: ["hi", "hello", "hey", "help", "start"],
    answer: `**👋 Hello! I'm ElectBot 🗳️**\n\nYour U.S. election education assistant! I can help with:\n\n- 🪪 **Voter Registration** — How to register (free!)\n- 💰 **Charges** — Registration is FREE!\n- 🗓️ **Upcoming Elections** — 2026 Midterms, 2028 Presidential\n- 🗳️ **Voting Day** — What to expect at the polls\n- 🏛️ **Electoral College** — How the presidential vote works\n- ⚖️ **Your Voter Rights** — Know them!\n\nJust type your question or click a chip! 💬`,
  },
];

export function getLocalAnswer(msg: string, country: "india" | "usa"): string {
  const kb = country === "india" ? indiaKnowledgeBase : usaKnowledgeBase;
  const lower = msg.toLowerCase();
  let best: KBEntry | null = null;
  let bestScore = 0;
  for (const entry of kb) {
    const score = entry.keys.filter((k) => lower.includes(k)).length;
    if (score > bestScore) { bestScore = score; best = entry; }
  }
  if (best && bestScore > 0) return best.answer;

  return country === "india"
    ? `I don't have a specific answer for that yet.\n\nTry asking about:\n- 🪪 Voter ID card (EPIC)\n- 💰 Is voter ID free?\n- 🗓️ Upcoming elections in India\n- 🗳️ How to vote (EVM, NOTA)\n- ⚖️ ECI and voter rights\n\n📞 **Voter Helpline: 1950**`
    : `I don't have a specific answer for that yet.\n\nTry asking about:\n- 🪪 How to register to vote\n- 💰 Is registration free?\n- 🗓️ When is the next election?\n- 🗳️ What happens on voting day\n- 🏛️ The Electoral College\n- ⚖️ Voter rights\n\n💡 Add a Gemini API key for unlimited AI answers!`;
}

// ─────────────────────────────────────────────
//  CHAT CHIPS
// ─────────────────────────────────────────────
export const indiaChips = [
  { label: "🪪 Voter ID apply kaise karein?", msg: "How do I apply for Voter ID card in India?" },
  { label: "💰 Voter ID banane ke charges?", msg: "What are the charges for making a Voter ID card in India?" },
  { label: "🗓️ Agla election kab hai?", msg: "When is the next election in India?" },
  { label: "🗳️ Voting kaise karein?", msg: "How to vote in India on voting day?" },
  { label: "🚫 NOTA kya hai?", msg: "What is NOTA in Indian elections?" },
  { label: "⚖️ ECI kya hai?", msg: "What is the Election Commission of India?" },
  { label: "📜 Voter ke adhikar?", msg: "What are my rights as a voter in India?" },
];

export const usaChips = [
  { label: "🪪 Apply for Voter ID?", msg: "How do I apply for a Voter ID card?" },
  { label: "💰 Voter ID charges?", msg: "What are the charges for making a Voter ID card?" },
  { label: "🗓️ Next election date?", msg: "When is the next election?" },
  { label: "📋 How to register?", msg: "How do I register to vote?" },
  { label: "🗳️ Voting day guide", msg: "What happens on voting day?" },
  { label: "⚖️ My voter rights?", msg: "What are my voter rights?" },
  { label: "🏛️ Electoral College?", msg: "What is the Electoral College?" },
];

// ─────────────────────────────────────────────
//  HOME PAGE HERO CONTENT
// ─────────────────────────────────────────────
export const homeContent = {
  india: {
    badge: "🇮🇳 Bharat Civic Education Platform",
    headline1: "Apna Vote",
    headline2: "Samjho",
    subtext: "Chunav prakriya ko step-by-step samjhein — interactive, clear, and empowering. Powered by Gemini AI.",
    stat1: ["6", "Modules"],
    stat2: ["8", "Quiz Questions"],
    stat3: ["AI", "Powered"],
    card1: "📋 Voter ID Register",
    card2: "🗳️ Vote Karein",
    card3: "📊 Counting",
    floatLabels: ["📋 Voter ID Register karein", "🗳️ Vote Karein (EVM)", "📊 Result Dekhein"],
    steps: [
      { n: 1, title: "Register", desc: "Voter ID (EPIC) banwayein" },
      { n: 2, title: "Jaanein", desc: "Candidates ko samjhein" },
      { n: 3, title: "Vote Karein", desc: "EVM se vote dalein" },
      { n: 4, title: "Counting", desc: "Votes gine jaate hain" },
      { n: 5, title: "Sarkar", desc: "Winning party sarkar banati hai" },
    ],
  },
  usa: {
    badge: "🇺🇸 Civic Education Platform",
    headline1: "Understand",
    headline2: "Your Vote",
    subtext: "Learn how elections work, step by step — interactive, clear, and empowering. Powered by Gemini AI.",
    stat1: ["6", "Topics"],
    stat2: ["8", "Quiz Questions"],
    stat3: ["AI", "Powered"],
    floatLabels: ["📋 Register to Vote", "🗳️ Cast Your Ballot", "📊 Track Results"],
    steps: [
      { n: 1, title: "Register", desc: "Check eligibility & register" },
      { n: 2, title: "Learn", desc: "Study candidates & measures" },
      { n: 3, title: "Vote", desc: "Cast your ballot" },
      { n: 4, title: "Count", desc: "Votes are counted & certified" },
      { n: 5, title: "Transition", desc: "Winner takes office" },
    ],
  },
};
