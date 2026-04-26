# ElectBot — Election Process Education Assistant

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange?logo=firebase)](https://firebase.google.com)
[![Gemini AI](https://img.shields.io/badge/Gemini-2.0_Flash-blue?logo=google)](https://ai.google.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)

> **Built for Google Virtual PromptWars** — Challenge: *"Create an assistant that helps users understand the election process, timelines, and steps in an interactive and easy-to-follow way."*

---

## 🗳️ What is ElectBot?

ElectBot is an AI-powered civic education platform that helps citizens understand elections for **India 🇮🇳** and the **United States 🇺🇸**. It provides:

- **AI Chat Assistant** — Powered by **Gemini 2.0 Flash**, answers any election question (server-side, key never exposed).
- **Interactive Learning Hub** — Educational modules stored in **Firebase Firestore**, fetched dynamically.
- **Civic Quiz** — Timed quizzes with a live **Leaderboard** backed by Firestore.
- **Election Timeline** — Key dates and milestones for upcoming elections.

---

## 🏗️ Architecture

```
Browser → Next.js App Router → /api/chat → Gemini 2.0 Flash (Server-side)
                           └→ Firebase Firestore (Learn Modules, Quiz Scores)
                           └→ Google Analytics (GA4)
```

**Stack:**
| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 (strict) |
| AI | Google Gemini 2.0 Flash |
| Database | Firebase Firestore |
| Analytics | Google Analytics 4 (GA4) |
| Styling | Tailwind CSS v4 |
| Testing | Jest + React Testing Library |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- A Firebase project with Firestore enabled
- A Google Gemini API key

### 1. Clone & Install
```bash
git clone https://github.com/your-org/electbot-nextjs.git
cd electbot-nextjs
npm install
```

### 2. Configure Environment Variables
Copy the example file and fill in your values:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
# Gemini AI (server-side only — never use NEXT_PUBLIC_ prefix)
GEMINI_API_KEY=your_gemini_api_key_here

# Firebase (public keys — safe for client-side use)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# App URL (used for sitemap and robots.txt)
NEXT_PUBLIC_APP_URL=https://your-deployment-url.vercel.app
```

### 3. Seed the Database
Run the development server, then visit the seed URL **once**:
```bash
npm run dev
# Then open: http://localhost:3000/api/seed
```
You should see: `{"message":"Successfully seeded 10 educational modules..."}`.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

---

## 🧪 Testing
```bash
npm test                  # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
```

**Test Coverage:**
- `countryData.test.ts` — Knowledge base, quiz data integrity, chat chips (22 tests)
- `firestoreService.test.ts` — Data access layer with mocked Firestore (16 tests)
- `Leaderboard.test.tsx` — UI component states (6 tests)
- `chatApiRoute.test.ts` — Gemini configuration and input validation (6 tests)

---

## 🔒 Security

- **API Key Protection:** The Gemini API key is server-side only (`GEMINI_API_KEY`). It never reaches the browser.
- **Rate Limiting:** `/api/chat` is rate-limited to 20 requests per IP per minute.
- **Input Validation:** Message length is capped at 1,000 characters.
- **Request Timeout:** Gemini calls time out after 15 seconds.
- **HTTP Headers:** `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, and `Content-Security-Policy` are all set via `next.config.ts`.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts      # Gemini AI endpoint (rate-limited, typed)
│   │   └── seed/route.ts      # One-time DB seed (protected in production)
│   ├── chat/page.tsx          # AI Chat UI
│   ├── learn/page.tsx         # Dynamic Learning Hub (Firestore)
│   ├── quiz/page.tsx          # Quiz + Leaderboard
│   ├── timeline/page.tsx      # Election Timeline
│   ├── error.tsx              # Global 500 error page
│   ├── not-found.tsx          # Custom 404 page
│   ├── robots.ts              # Dynamic robots.txt
│   └── sitemap.ts             # Dynamic sitemap.xml
├── components/
│   ├── ErrorBoundary.tsx      # React error boundary
│   ├── Leaderboard.tsx        # Firestore-powered leaderboard
│   └── Navbar.tsx             # Navigation
├── lib/
│   ├── countryContext.tsx     # Global country state (React Context)
│   ├── countryData.ts         # Static data: quiz, chat KB, chips
│   ├── firebase.ts            # Firebase app singleton
│   └── firestoreService.ts    # Data access layer (typed)
└── __tests__/                 # Jest test suites
```

---

## 📄 License
MIT © 2025 ElectBot
