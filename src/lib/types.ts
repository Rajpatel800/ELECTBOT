/**
 * src/lib/types.ts
 *
 * Centralized type definitions for the ElectBot application.
 * All shared interfaces and types are defined here as the single
 * source of truth, eliminating duplicate declarations across modules.
 *
 * @module types
 */

// ─────────────────────────────────────────────
// Country
// ─────────────────────────────────────────────

/** Supported countries for the ElectBot platform. */
export type Country = "india" | "usa";

/** Valid country codes used for runtime validation. */
export const VALID_COUNTRIES: readonly Country[] = ["india", "usa"] as const;

// ─────────────────────────────────────────────
// Quiz
// ─────────────────────────────────────────────

/** A single quiz question with multiple-choice options. */
export interface Question {
  /** The question text displayed to the user. */
  readonly q: string;
  /** Exactly four answer options (A, B, C, D). */
  readonly options: readonly string[];
  /** Zero-based index of the correct answer within `options`. */
  readonly correct: number;
  /** Explanation shown after the user answers. */
  readonly explanation: string;
}

// ─────────────────────────────────────────────
// Learn Modules
// ─────────────────────────────────────────────

/** An educational module displayed in the Learning Hub. */
export interface LearnModule {
  /** Unique identifier (e.g. "in1", "us3"). */
  readonly id: string;
  /** Emoji icon representing the module topic. */
  readonly icon: string;
  /** Module title displayed in the accordion header. */
  readonly title: string;
  /** Difficulty tag (e.g. "Beginner · 5 min"). */
  readonly tag: string;
  /** Markdown content of the module body. */
  readonly content: string;
}

/** Firestore-backed learn module with an ordering field. */
export interface FirestoreLearnModule extends LearnModule {
  /** Sort order for display (ascending). */
  readonly order: number;
}

// ─────────────────────────────────────────────
// Timeline
// ─────────────────────────────────────────────

/** Visual status of a timeline event. */
export type TimelineStatus = "completed" | "current" | "upcoming" | "gold";

/** A single event on the election timeline. */
export interface TimelineItem {
  /** Current status affecting visual appearance. */
  readonly status: TimelineStatus;
  /** Character displayed inside the timeline dot. */
  readonly dot: string;
  /** Human-readable date string. */
  readonly date: string;
  /** Event title. */
  readonly title: string;
  /** Event description. */
  readonly desc: string;
  /** Short label tag (e.g. "Completed", "Live Now"). */
  readonly tag: string;
  /** Tailwind CSS classes for the tag badge. */
  readonly tagColor: string;
  /** Whether to show a reminder button for this event. */
  readonly reminder?: boolean;
}

/** A tab grouping related timeline events. */
export interface TimelineTab {
  /** Unique key for the tab (used as React key and HTML ID). */
  readonly key: string;
  /** User-facing tab label. */
  readonly label: string;
  /** Ordered list of timeline events. */
  readonly items: readonly TimelineItem[];
}

// ─────────────────────────────────────────────
// Knowledge Base (Chat)
// ─────────────────────────────────────────────

/** A knowledge base entry mapping keywords to a canned answer. */
export interface KBEntry {
  /** Lowercase keywords that trigger this answer. */
  readonly keys: readonly string[];
  /** Markdown-formatted answer text. */
  readonly answer: string;
}

/** A quick-action chip displayed in the chat UI. */
export interface ChatChip {
  /** Display label for the chip button. */
  readonly label: string;
  /** Message sent to the chat when the chip is clicked. */
  readonly msg: string;
}

// ─────────────────────────────────────────────
// Chat
// ─────────────────────────────────────────────

/** A single message in the chat conversation. */
export interface ChatMessage {
  /** Who sent this message. */
  readonly role: "user" | "bot";
  /** The message content (Markdown string). */
  readonly content: string;
}

/** Shape of the history entries sent to the Gemini API. */
export interface GeminiHistoryEntry {
  /** Role in the Gemini conversation. */
  readonly role: string;
  /** Message parts. */
  readonly parts: ReadonlyArray<{ readonly text: string }>;
}

// ─────────────────────────────────────────────
// Home Page
// ─────────────────────────────────────────────

/** A step in the election process overview. */
export interface ElectionStep {
  /** Step number (1-based). */
  readonly n: number;
  /** Short title. */
  readonly title: string;
  /** Brief description. */
  readonly desc: string;
}

/** Country-specific home page hero content. */
export interface HomeContent {
  /** Badge text shown above the headline. */
  readonly badge: string;
  /** First line of the hero headline. */
  readonly headline1: string;
  /** Second line (gradient-colored). */
  readonly headline2: string;
  /** Subtext paragraph below the headline. */
  readonly subtext: string;
  /** First statistic [value, label]. */
  readonly stat1: readonly [string, string];
  /** Second statistic [value, label]. */
  readonly stat2: readonly [string, string];
  /** Third statistic [value, label]. */
  readonly stat3: readonly [string, string];
  /** Ordered steps for the election process section. */
  readonly steps: readonly ElectionStep[];
}

/** A feature card on the home page. */
export interface FeatureCard {
  /** Display number (e.g. "01"). */
  readonly num: string;
  /** Emoji icon. */
  readonly icon: string;
  /** Feature title. */
  readonly title: string;
  /** Feature description. */
  readonly desc: string;
  /** Navigation target. */
  readonly href: string;
  /** Call-to-action button text. */
  readonly cta: string;
}

/** Country selector button data. */
export interface CountryOption {
  /** Country code. */
  readonly code: Country;
  /** Flag emoji. */
  readonly flag: string;
  /** Primary label. */
  readonly label: string;
  /** Secondary label / native name. */
  readonly sublabel: string;
}

// ─────────────────────────────────────────────
// Firestore (Quiz Scores)
// ─────────────────────────────────────────────

/** A persisted quiz score from Firestore. */
export interface QuizScore {
  /** Firestore document ID (undefined before persistence). */
  readonly id?: string;
  /** Country the quiz was taken for. */
  readonly country: string;
  /** Numeric score with streak bonuses. */
  readonly score: number;
  /** Percentage accuracy (0–100). */
  readonly accuracy: number;
  /** When the quiz was completed. */
  readonly timestamp: Date;
}

// ─────────────────────────────────────────────
// API
// ─────────────────────────────────────────────

/** Request body for POST /api/chat. */
export interface ChatRequestBody {
  /** User's message text. */
  readonly message: string;
  /** Target country for context-specific responses. */
  readonly country?: string;
  /** Conversation history for multi-turn context. */
  readonly history?: ReadonlyArray<ChatAPIHistoryEntry>;
}

/** A single entry in the chat API history payload. */
export interface ChatAPIHistoryEntry {
  /** Role: "user", "model", or "bot". */
  readonly role: "user" | "model" | "bot";
  /** Message parts (Gemini SDK format). Must be mutable for SDK compatibility. */
  parts?: Array<{ text: string }>;
  /** Alternative content field. */
  readonly content?: string;
}

/** Shared response shape from both AI backends. */
export interface GenerateResult {
  /** The generated text response. */
  readonly text: string;
}

/** Request body for POST /api/translate. */
export interface TranslateRequestBody {
  /** Text to translate. */
  readonly text: string;
  /** Target language code. */
  readonly targetLang: string;
}
