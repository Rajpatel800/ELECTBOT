# 🗳️ ElectBot — AI-Powered Civic Education Assistant

![ElectBot Hero Preview](https://via.placeholder.com/1200x600/1a237e/FFFFFF?text=ElectBot+-+AI-Powered+Civic+Education)

ElectBot is a modern, interactive web application designed to simplify and elevate the election process for citizens. It leverages advanced AI to provide accurate, context-aware civic education.

By gamifying the learning process and offering a localized experience, ElectBot ensures users understand their democratic rights, registration processes, and upcoming election timelines.

---

## ✨ Key Features

- **🌍 Dual-Country Localization Mode**
  - Seamlessly switch between **India (🇮🇳)** and the **USA (🇺🇸)**.
  - Automatically adapts the entire UI, including timelines, quiz questions, educational modules, and the AI chatbot's knowledge base.

- **🤖 Hybrid AI Chat Engine (Gemini 2.0 Flash)**
  - Engage with an intelligent, friendly AI assistant.
  - **Local First:** Operates instantly via a built-in knowledge base.
  - **AI Powered:** Users can add their own Google AI Studio API key (`LocalStorage` secured) to unlock unlimited, context-aware responses powered by Gemini 2.0 Flash.

- **🏆 Gamified Civic Quiz**
  - Test knowledge on election history, voting rights, and government structures.
  - Features real-time scoring, accuracy tracking, and dynamic difficulty based on the selected country context.

- **🗓️ Interactive Election Timelines**
  - Visual tracking of the democratic process.
  - Granular breakdown of upcoming general, state, and primary elections.

- **📚 Personalized Learning Hub**
  - Curated accordion-style modules covering everything from the Electoral College (US) to the EVM and VVPAT systems (India).
  - Built-in progress tracking to monitor learning completion.

---

## 🛠️ Technology Stack

- **Framework:** Next.js 16 (React, App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Custom "Heritage Modern" unified design system)
- **AI Integration:** Google Gemini API (`gemini-2.0-flash`)
- **Rendering:** `react-markdown` for rich text output
- **State Management:** React Hooks & `localStorage` (No external database required)

---

## 🚦 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
* [Node.js](https://nodejs.org/en/) (v18.x or newer recommended)
* `npm` or `yarn`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/electbot-nextjs.git
   cd electbot-nextjs
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open the App:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 AI Feature Configuration

The application is fully functional out-of-the-box leveraging its built-in knowledge matrix. 

To enable the advanced Gemini capabilities:
1. Navigate to the **"Ask ElectBot"** tab.
2. Click the **"🔑 Add API Key"** button.
3. Obtain a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
4. Enter your key. *Note: Keys are stored locally in your browser's `localStorage` and are never broadcasted to external servers besides the direct Google API.*

---

## 📁 Project Structure

```text
electbot-nextjs/
├── src/
│   ├── app/                # Next.js App Router Pages
│   │   ├── chat/           # Gemini AI Chat Interface
│   │   ├── learn/          # Progress-tracked educational modules
│   │   ├── quiz/           # Civic knowledge quizzes
│   │   ├── timeline/       # Interactive election timelines
│   │   ├── globals.css     # Tailwind & Custom CSS classes
│   │   └── layout.tsx      # Global layout & CountryProvider wrapper
│   ├── components/         # Reusable UI Components (Navbar, etc.)
│   └── lib/                # Core logic & Data state
│       ├── countryContext.tsx  # Global state for India/USA toggle
│       └── countryData.ts      # Centralized matrices for localization
├── public/                 # Static assets
└── package.json            # Project dependencies
```

---

## 🤝 Mission

Designed to showcase the power of AI in fostering civic engagement, accessibility, and high-quality user experience design.
