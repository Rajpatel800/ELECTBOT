# Contributing to ElectBot

Thank you for your interest in contributing to ElectBot! This guide will help you get started with the development process.

## 🛠️ Development Setup

### Prerequisites
- **Node.js** 18+ and **npm** 9+
- A Firebase project (for Firestore)
- A Google Gemini API key (for local AI development)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd electbot-nextjs

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Firebase and Gemini API credentials
```

### Running Locally

```bash
# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages and API routes
│   ├── api/
│   │   ├── chat/route.ts   # Gemini AI chat backend (dual-mode)
│   │   ├── translate/      # Google Translate proxy
│   │   └── seed/           # Firestore seeding endpoint
│   ├── chat/page.tsx       # AI chat interface
│   ├── learn/page.tsx      # Educational content hub
│   ├── quiz/page.tsx       # Interactive quiz with leaderboard
│   ├── timeline/page.tsx   # Election timeline visualization
│   └── page.tsx            # Landing page
├── components/             # Reusable UI components
│   ├── Navbar.tsx           
│   ├── Leaderboard.tsx      
│   └── ErrorBoundary.tsx    
├── lib/                    # Core library modules
│   ├── types.ts            # Centralized type definitions
│   ├── countryData.ts      # Country-specific content data
│   ├── countryContext.tsx   # Global country state provider
│   ├── firestoreService.ts # Firestore data access layer
│   └── firebase.ts         # Firebase initialization
└── __tests__/              # Test suites
```

## 🧪 Testing

We use **Jest** and **React Testing Library** for testing.

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Testing Guidelines
- Place test files in `src/__tests__/`
- Use descriptive `describe` and `it` blocks
- Mock external dependencies (Firebase, API routes)
- All new features must include corresponding tests

## 📝 Code Style

### TypeScript
- All types are defined in `src/lib/types.ts` — do not create inline interfaces
- Use `readonly` on immutable props and arrays
- Add JSDoc comments to all exported functions and components

### ESLint
```bash
# Lint the entire project
npm run lint
```

### Naming Conventions
- **Files**: PascalCase for components, camelCase for utilities
- **Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Types/Interfaces**: PascalCase

## 🚀 Deployment

ElectBot is deployed to **Google Cloud Run** using a standalone Next.js build.

```bash
# Build for production
npm run build

# Deploy to Cloud Run (requires gcloud CLI)
gcloud run deploy electbot --source .
```

### Environment Variables (Production)
- `GOOGLE_CLOUD_PROJECT` — Enables Vertex AI backend
- `VERTEX_AI_LOCATION` — AI region (default: `us-central1`)
- See `.env.example` for the full list

## 📋 Pull Request Guidelines

1. Create a feature branch from `main`
2. Write tests for new features
3. Ensure `npm run lint` passes with zero warnings
4. Ensure `npm test` passes with no failures
5. Update documentation if needed
6. Submit a PR with a clear description

## 🐛 Reporting Issues

When reporting bugs, please include:
- Steps to reproduce
- Expected vs actual behavior
- Browser and OS information
- Console error messages (if any)

## 📄 License

This project is built for the Google Virtual PromptWars hackathon.
