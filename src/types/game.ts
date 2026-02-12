// ============================================================================
// CyberTabletop — Core Game Type Definitions
// Strict TypeScript interfaces matching the PRD JSON Schema (Section 6)
// ============================================================================

/** Playable roles for a tabletop exercise */
export type Role = "CISO" | "SOC_LEAD" | "DFIR" | "IT_MANAGER";

/** Scenario difficulty levels */
export type Difficulty = "Easy" | "Medium" | "Hard";

/** The three core score dimensions */
export interface ScoreTriad {
  security: number;
  business: number;
  reputation: number;
}

/** Impact of a decision on the three metrics (can be positive or negative) */
export interface Impact {
  security: number;
  business: number;
  reputation: number;
}

/** A single decision option within an inject */
export interface Option {
  id: string;
  label: string;
  feedback_text: string;
  impact: Impact;
}

/** A single inject (step) in the scenario timeline */
export interface Inject {
  id: string;
  order: number;
  timestamp_display: string;
  context: string;
  question: string;
  timer_seconds: number;
  options: Option[];
}

/** Scenario metadata */
export interface ScenarioMeta {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  duration_minutes: number;
  tags: string[];
  version: string;
}

/** Scenario configuration (roles & starting scores) */
export interface ScenarioConfiguration {
  playable_roles: Role[];
  starting_stats: ScoreTriad;
}

/** Top-level scenario document matching the PRD JSON Schema */
export interface Scenario {
  meta: ScenarioMeta;
  configuration: ScenarioConfiguration;
  injects: Inject[];
}

// ============================================================================
// Game State (Zustand Store Shape)
// ============================================================================

import type { OnboardingConfig } from "@/types/onboarding";

/** Record of a single decision made during gameplay */
export interface DecisionRecord {
  injectId: string;
  optionId: string;
  optionLabel: string;
  feedbackText: string;
  impact: Impact;
  timestamp: number;
  timedOut: boolean;
}

/** Overall game phase */
export type GamePhase =
  | "idle"         // No game loaded
  | "briefing"     // Showing scenario briefing
  | "playing"      // Active game loop
  | "feedback"     // Showing decision feedback overlay
  | "gameover"     // A metric hit 0
  | "victory";     // All injects completed with metrics > 0

/** The complete game state managed by Zustand */
export interface GameState {
  // ---- Data ----
  scenario: Scenario | null;
  selectedRole: Role | null;
  phase: GamePhase;

  // ---- Session Lifecycle ----
  isSimulationActive: boolean;
  activeScenarioId: string | null;
  onboardingConfig: OnboardingConfig | null;

  // ---- Progress ----
  currentInjectIndex: number;
  scores: ScoreTriad;
  history: DecisionRecord[];

  // ---- Timer ----
  timerSeconds: number;
  timerRunning: boolean;

  // ---- Actions ----
  commitOnboarding: (scenarioId: string, config: OnboardingConfig) => void;
  startGame: (scenario: Scenario, role: Role) => void;
  makeDecision: (optionId: string) => void;
  handleTimeout: () => void;
  tickTimer: () => void;
  advanceToNextInject: () => void;
  resetGame: () => void;
  resetSimulation: () => void;
}
