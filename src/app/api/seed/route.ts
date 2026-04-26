/**
 * src/app/api/seed/route.ts
 *
 * One-time database seeder for Firestore learn modules.
 *
 * ⚠️  SECURITY: This route is protected by a secret token.
 * It MUST only be called once during initial deployment.
 * After seeding, this route should be removed or the SEED_SECRET
 * environment variable should be cleared.
 *
 * Usage:
 *   GET /api/seed
 *   Headers: { Authorization: "Bearer <SEED_SECRET>" }
 *
 * Or via query param (for quick browser testing):
 *   GET /api/seed?token=<SEED_SECRET>
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, doc, setDoc, getDocs, query, where } from "firebase/firestore";

// ─────────────────────────────────────────────
// Enhanced Educational Module Content
// ─────────────────────────────────────────────
const modules = [
  // INDIA MODULES ────────────────────────────
  {
    country: "india", id: "in1", order: 1, icon: "🪪",
    title: "Voter Registration (EPIC Card)",
    tag: "Beginner · 5 min",
    content: `## Who Can Register?
- Indian citizen aged **18 or above** on the qualifying date (1st January of the year)
- Ordinary resident of the constituency
- Not disqualified under any law

## Step-by-Step Registration (Form 6)
1. Visit **[voters.eci.gov.in](https://voters.eci.gov.in)** — the official ECI portal.
2. Click **"New Registration for General Electors"**.
3. Fill **Form 6** with accurate details.
4. Upload: Passport photo · Proof of age (Aadhaar/Birth cert) · Address proof
5. Submit and note your **Reference Number** (sent via SMS).
6. A **Booth Level Officer (BLO)** may visit for address verification.
7. Receive your **EPIC (Electoral Photo Identity Card)** by post — completely **FREE!**

💡 *Also available via the **Voter Helpline App** (Android/iOS) or by calling **1950** (toll-free).*
🌐 *Track application status at: [nvsp.in](https://nvsp.in)*`,
  },
  {
    country: "india", id: "in2", order: 2, icon: "🏛️",
    title: "Types of Elections in India",
    tag: "Beginner · 6 min",
    content: `## 1. Lok Sabha (General Elections)
Held every **5 years**. Elects 543 MPs to the **lower house of Parliament**. The party/coalition winning **272+ seats** forms the central government and appoints the Prime Minister.

## 2. Rajya Sabha (Upper House)
245 members. **Not directly elected by the public** — instead, elected by State Legislative Assembly members (MLAs). One-third retires every 2 years for continuity.

## 3. Vidhan Sabha (State Assembly)
Each state elects its MLAs every 5 years. The majority party leader becomes **Chief Minister (CM)**.

## 4. Vidhan Parishad (State Legislative Council)
Present in 6 states (Bihar, UP, Maharashtra, Karnataka, AP, Telangana). The upper house of the state legislature.

## 5. Local Body Elections
Elect Panchayat members (rural) and Municipal Corporation councillors (urban). Most directly impact roads, water, sanitation, and schools.

## 6. By-Elections
Held when a seat becomes vacant mid-term. Also called **"Upchunav"** in Hindi.`,
  },
  {
    country: "india", id: "in3", order: 3, icon: "📍",
    title: "Voting Day: Complete Guide",
    tag: "Intermediate · 6 min",
    content: `## Valid ID Documents
Your **EPIC (Voter ID)** is the primary document. If not available, any of these work:
Aadhaar · Passport · PAN Card · Driving License · MNREGA Job Card · Pension Document · Bank/Post Office Passbook with photograph

## Step-by-Step at the Polling Booth
1. **Find your polling station:** [electoralsearch.eci.gov.in](https://electoralsearch.eci.gov.in)
2. **Verification:** First Polling Officer checks your name in the electoral roll and verifies ID.
3. **Indelible Ink:** Second Polling Officer marks your **left index finger** — prevents double-voting.
4. **Voter Slip:** You receive a numbered slip.
5. **EVM Control:** Third Polling Officer enables the EVM. You enter the voting compartment.
6. **Cast Vote:** Press the blue button next to your chosen candidate on the **EVM**.
7. **VVPAT Verification:** A paper slip appears in the transparent window for **7 seconds**, showing the candidate's serial number, name, and symbol. It then drops into a sealed box automatically.

⏰ Polls open **7 AM – 6 PM** (may vary by constituency; check ECI notice).

💡 **Pro tip:** If you're in the queue before 6 PM, you **must** be allowed to vote, even if it takes hours.`,
  },
  {
    country: "india", id: "in4", order: 4, icon: "⚖️",
    title: "EVM Security & Vote Counting",
    tag: "Advanced · 7 min",
    content: `## Why EVMs Are Secure
- **Air-gapped:** EVMs have no Wi-Fi, Bluetooth, USB, or internet connectivity — ever.
- **One-time programmable:** The microchip is burned once and cannot be reprogrammed.
- **Tamper detection:** Any attempt to open the unit registers a fault.
- **Randomized assignment:** EVMs are randomly allocated to booths on polling day.
- **Multi-party sealing:** Candidates' representatives seal EVMs at the booth after voting.

## First-Past-The-Post (FPTP)
India uses FPTP. The candidate with the **most votes wins** — there is no minimum vote share required. This is different from absolute majority systems.

## Counting Day Process
1. EVMs stored in **strongrooms** under CAPF guard. Party agents allowed 24/7 watch.
2. On counting day, EVMs unsealed in front of candidates' representatives, under video recording.
3. Votes tallied electronically and displayed on large screens.
4. **VVPAT verification:** A randomly selected sample of VVPAT slips are manually counted to cross-verify EVM results.
5. Returning Officer certifies and announces the result.

## NOTA (None of the Above)
Available on every EVM as the **last option**. Introduced via Supreme Court order in 2013. Your vote is counted and publicly reported in official data.`,
  },
  {
    country: "india", id: "in5", order: 5, icon: "📜",
    title: "Your Fundamental Voter Rights",
    tag: "Essential · 5 min",
    content: `## Constitutional Foundation
- **Article 326:** Guarantees universal adult suffrage — every adult Indian citizen has the right to vote.
- **Secret Ballot:** Your vote is completely private. No one — not even the Presiding Officer — can see who you voted for.
- **NOTA (Right to Reject):** You have the legal right to reject all candidates without abstaining.

## Operational Rights at the Booth
- **The Queue Rule:** Standing in line at closing time? The Presiding Officer **must allow you to vote** — this is a constitutional protection.
- **Tendered Vote:** If someone has fraudulently voted in your name, demand a **Tendered Ballot** from the Presiding Officer. You cast a paper vote that is separately counted.
- **PWD / Senior Accessibility:** Wheelchair ramps, braille EVMs, and companion assistance are available. **Home voting** available for citizens 85+ and 40%+ disabled.

## Report Violations Instantly
- **cVIGIL App:** Photo/video evidence of MCC violations goes directly to the ECI and is investigated within **100 minutes**.
- **Voter Helpline:** Call **1950** (toll-free, 24x7 during elections). Report bribery, intimidation, or booth violence.
- **National Grievance Service:** [eci.gov.in](https://eci.gov.in)`,
  },

  // USA MODULES ──────────────────────────────
  {
    country: "usa", id: "us1", order: 1, icon: "📋",
    title: "Voter Registration Guide",
    tag: "Beginner · 5 min",
    content: `## Eligibility Requirements
- A U.S. citizen.
- Aged **18 or older** on or before Election Day (17 in some states for primaries).
- A resident of the state in which you are registering.
- *Note: Felony conviction rules vary significantly by state. Check [vote.gov](https://vote.gov) for your state.*

## How to Register
1. Visit **[vote.gov](https://vote.gov)** — selects your state's official Board of Elections portal.
2. Provide: Full legal name · Current address · Date of birth · State Driver's License number or last 4 digits of SSN.
3. **Know your deadline:** Most states require registration **15–30 days before Election Day**.
4. Receive your **Voter Registration Card** by mail in 2–4 weeks ✉️.

## Convenient Options
- **Online:** Available in 40+ states at vote.gov.
- **By Mail:** Download your state's form, fill it out, and mail it in.
- **In-Person:** At the DMV, library, post office, or your local election office.
- **Same-Day Registration:** Available in 20+ states — register and vote on the same day!

💡 *Always verify your registration status before each election at your state's voter portal, especially if you've recently moved.*`,
  },
  {
    country: "usa", id: "us2", order: 2, icon: "🗳️",
    title: "Federal, State & Local Elections",
    tag: "Intermediate · 6 min",
    content: `## Presidential Elections (Every 4 Years)
Held in November of years divisible by 4. Technically, citizens vote for a **slate of Electors** (the Electoral College), not the President directly.

## Midterm Elections (Every 2 Years)
Held 2 years after a Presidential election. All **435 House seats**, ~33 **Senate seats**, and 36 **Governorships** are on the ballot. Typically have much lower voter turnout than Presidential elections.

## Primary Elections
Before the general election, each party holds primaries to choose their nominee.
- **Open Primary:** Any registered voter can participate, regardless of party.
- **Closed Primary:** Only voters registered to that party can participate.
- **Caucus:** Voters gather physically in groups and publicly demonstrate their preference (Iowa is famous for this).

## Special Elections
Called outside the regular schedule to fill a seat that became vacant due to resignation, death, or removal.

## Local Elections
Elect mayors, sheriffs, judges, school board members, and city councils. Despite affecting daily life most directly, these have the lowest voter turnout — often **under 15%**.`,
  },
  {
    country: "usa", id: "us3", order: 3, icon: "📍",
    title: "Election Day: What to Expect",
    tag: "Intermediate · 7 min",
    content: `## Your Three Ways to Vote
1. **In-Person on Election Day** — Go to your assigned polling place.
2. **Early Voting** — Most states open polling centers 1–2 weeks before Election Day.
3. **Mail-In / Absentee Ballot** — Request a ballot by mail, complete it at home, return it by the deadline.

## At the Polling Place
1. Find your specific polling location at **[vote.gov/find-my-polling-place](https://vote.gov/find-my-polling-place)**
2. **ID Requirements:** ~35 states require ID. Check your state at: [ncsl.org/research/elections](https://www.ncsl.org/research/elections-and-campaigns/voter-id.aspx)
3. Check in with a poll worker and sign the voter registry.
4. Receive your ballot (paper or electronic).
5. Mark your choices in a **private voting booth**.
6. Feed your ballot into the scanner, or hand it to a poll worker for a drop box.
7. Get your **"I Voted!" sticker** 🎉

⏰ Polls typically open **6 AM – 8 PM** local time, but this varies by state.

⚠️ **Critical:** If you are in line before the polls close, you **have the legal right to vote** — do not leave the line!`,
  },
  {
    country: "usa", id: "us4", order: 4, icon: "⚖️",
    title: "The Electoral College Explained",
    tag: "Advanced · 8 min",
    content: `## The Core Mechanic
When you vote for a Presidential candidate, you are actually voting for a slate of **Electors** pledged to that candidate. There are **538 total Electors**. A candidate needs **270 electoral votes** — an absolute majority — to win the Presidency.

## How State Allocations Work
Each state's electoral votes equal its total congressional seats:
> **Electoral Votes = (House Representatives) + (2 Senators)**

*Example: California has 52 Representatives + 2 Senators = **54 Electoral Votes**.*
The District of Columbia gets 3 votes via the 23rd Amendment.

## Winner-Takes-All
In 48 states + DC, the candidate who wins the popular vote in that state gets **all** of its electoral votes. Only **Maine** and **Nebraska** can split their votes proportionally.

## Why the Popular Vote Can Diverge from the Result
A candidate can win millions of extra votes in large states (running up the score), while losing narrowly in many smaller "swing states." This has produced divergent outcomes in **2000 (Bush vs. Gore)** and **2016 (Trump vs. Clinton)**.

## The Formal Process
1. Voters cast ballots on Election Day (first Tuesday after first Monday in November).
2. States certify their results.
3. Electors meet in their state capitals in **December** to formally cast electoral votes.
4. Congress counts and certifies electoral votes in early **January**.
5. Inauguration: January 20th.`,
  },
  {
    country: "usa", id: "us5", order: 5, icon: "📜",
    title: "Constitutional Voter Protections",
    tag: "Advanced · 6 min",
    content: `## The Constitutional Amendments
| Amendment | Year | Protection |
|---|---|---|
| **15th** | 1870 | Cannot deny the vote based on **race, color, or previous servitude** |
| **19th** | 1920 | Granted women the **right to vote** |
| **24th** | 1964 | Abolished **poll taxes** in federal elections |
| **26th** | 1971 | Lowered voting age to **18** for all elections |

## The Voting Rights Act of 1965
A landmark federal law designed to enforce the 15th Amendment and eliminate systemic barriers (literacy tests, grandfather clauses, intimidation) that had prevented Black Americans from voting for decades.

## Practical Rights at the Polls
- **Secret Ballot:** No one can legally compel you to reveal your vote.
- **The Line Rule:** In line before closing time? You **must** be allowed to vote — poll workers cannot turn you away.
- **Provisional Ballot:** If a poll worker questions your eligibility, demand a **provisional ballot**. Your vote is set aside and counted after your eligibility is verified.
- **Language Assistance:** Federal law (Section 203 of the VRA) requires bilingual ballots in jurisdictions with large non-English-speaking populations.
- **Accessibility:** Polling places must be accessible to voters with disabilities. A friend or family member may assist you in the voting booth.

## Report Violations
**Voter Protection Hotline: 1-866-OUR-VOTE** (operated by the nonpartisan Election Protection coalition)`,
  },
];

export async function GET(req: NextRequest): Promise<NextResponse> {
  // ── Token protection ────────────────────────────────────
  const seedSecret = process.env.SEED_SECRET;
  if (seedSecret) {
    const authHeader = req.headers.get("authorization");
    const queryToken = new URL(req.url).searchParams.get("token");
    const providedToken = authHeader?.replace("Bearer ", "") ?? queryToken ?? "";

    if (providedToken !== seedSecret) {
      return NextResponse.json(
        { error: "Forbidden. Valid SEED_SECRET token required." },
        { status: 403 }
      );
    }
  }

  // ── Idempotency check — avoid overwriting existing data ─
  try {
    const existingSnapshot = await getDocs(
      query(collection(db, "learnModules"), where("country", "==", "india"))
    );
    if (!existingSnapshot.empty) {
      return NextResponse.json({
        message: "Database already seeded. No changes made.",
        existingCount: existingSnapshot.size,
      });
    }
  } catch {
    // If check fails, proceed with seeding
  }

  // ── Seed all modules ────────────────────────────────────
  try {
    const results: string[] = [];
    for (const mod of modules) {
      const docRef = doc(db, "learnModules", mod.id);
      await setDoc(docRef, mod, { merge: false });
      results.push(mod.id);
    }

    return NextResponse.json({
      message: `Successfully seeded ${results.length} educational modules to Firestore.`,
      seededIds: results,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[Seed API] Failed to seed Firestore:", message);
    return NextResponse.json(
      { error: "Failed to seed database.", details: message },
      { status: 500 }
    );
  }
}
