import { create } from "zustand";
import type {
  GameState,
  Scenario,
  Role,
  DecisionRecord,
  ScoreTriad,
  Inject,
  Option,
} from "@/types/game";
import type { OnboardingConfig } from "@/types/onboarding";
import { clampScore } from "@/lib/utils";
import { useOnboardingStore } from "@/lib/onboarding-store";

// ============================================================================
// Default "Inaction" penalty applied when the timer expires
// ============================================================================
const INACTION_IMPACT = {
  security: -15,
  business: -10,
  reputation: -10,
} as const;

// ============================================================================
// Helpers
// ============================================================================

/** Apply an impact to scores, clamping each dimension to [0, 100]. */
function applyImpact(scores: ScoreTriad, impact: { security: number; business: number; reputation: number }): ScoreTriad {
  return {
    security: clampScore(scores.security + impact.security),
    business: clampScore(scores.business + impact.business),
    reputation: clampScore(scores.reputation + impact.reputation),
  };
}

/** Check if any score dimension has hit 0 → Game Over. */
function isGameOver(scores: ScoreTriad): boolean {
  return scores.security <= 0 || scores.business <= 0 || scores.reputation <= 0;
}

/** Get the current inject safely. */
function currentInject(scenario: Scenario | null, index: number): Inject | null {
  if (!scenario) return null;
  return scenario.injects[index] ?? null;
}

// ============================================================================
// Store
// ============================================================================

export const useGameStore = create<GameState>((set, get) => ({
  // ---- Initial State ----
  scenario: null,
  selectedRole: null,
  selectedRoles: [],
  phase: "idle",
  currentInjectIndex: 0,
  scores: { security: 50, business: 50, reputation: 50 },
  history: [],
  timerSeconds: 0,
  timerRunning: false,

  // ---- Session Lifecycle ----
  isSimulationActive: false,
  activeScenarioId: null,
  onboardingConfig: null,

  // ---- Actions ----

  /**
   * Commit onboarding config from the temp wizard into the active session.
   * This is the "draft → committed" transition.
   */
  commitOnboarding: (scenarioId: string, config: OnboardingConfig) => {
    set({
      isSimulationActive: true,
      activeScenarioId: scenarioId,
      onboardingConfig: { ...config },
    });
  },

  /**
   * Initialize a new game session with the given scenario and roles.
   * Supports multi-role selection — the first role is stored as primary.
   */
  startGame: (scenario: Scenario, roles: Role[]) => {
    const firstInject = scenario.injects[0];
    if (!firstInject || roles.length === 0) return;

    set({
      scenario,
      selectedRole: roles[0],
      selectedRoles: roles,
      phase: "briefing",
      currentInjectIndex: 0,
      scores: { ...scenario.configuration.starting_stats },
      history: [],
      timerSeconds: firstInject.timer_seconds,
      timerRunning: false,
    });
  },

  /**
   * Process a player decision by option ID.
   * - Looks up the option in the current inject.
   * - Applies score impact (clamped 0–100).
   * - Logs the decision to history.
   * - Transitions to "feedback" phase.
   */
  makeDecision: (optionId: string) => {
    const { scenario, currentInjectIndex, scores, history, phase } = get();
    if (phase !== "playing" || !scenario) return;

    const inject = currentInject(scenario, currentInjectIndex);
    if (!inject) return;

    const option: Option | undefined = inject.options.find((o) => o.id === optionId);
    if (!option) return;

    const newScores = applyImpact(scores, option.impact);

    const record: DecisionRecord = {
      injectId: inject.id,
      optionId: option.id,
      optionLabel: option.label,
      feedbackText: option.feedback_text,
      impact: option.impact,
      timestamp: Date.now(),
      timedOut: false,
    };

    const newPhase = isGameOver(newScores) ? "gameover" : "feedback";

    set({
      scores: newScores,
      history: [...history, record],
      phase: newPhase,
      timerRunning: false,
    });
  },

  /**
   * Handle timeout — apply the inaction penalty automatically.
   */
  handleTimeout: () => {
    const { scenario, currentInjectIndex, scores, history, phase } = get();
    if (phase !== "playing" || !scenario) return;

    const inject = currentInject(scenario, currentInjectIndex);
    if (!inject) return;

    const newScores = applyImpact(scores, INACTION_IMPACT);

    const record: DecisionRecord = {
      injectId: inject.id,
      optionId: "TIMEOUT",
      optionLabel: "No decision made — inaction penalty applied.",
      feedbackText:
        "Time expired. Your team hesitated, and the situation deteriorated. The attackers exploited the delay.",
      impact: INACTION_IMPACT,
      timestamp: Date.now(),
      timedOut: true,
    };

    const newPhase = isGameOver(newScores) ? "gameover" : "feedback";

    set({
      scores: newScores,
      history: [...history, record],
      phase: newPhase,
      timerRunning: false,
    });
  },

  /**
   * Tick the timer down by 1 second. If it hits 0, trigger timeout.
   */
  tickTimer: () => {
    const { timerSeconds, timerRunning, phase } = get();
    if (!timerRunning || phase !== "playing") return;

    if (timerSeconds <= 1) {
      set({ timerSeconds: 0, timerRunning: false });
      get().handleTimeout();
    } else {
      set({ timerSeconds: timerSeconds - 1 });
    }
  },

  /**
   * Advance to the next inject after feedback is shown.
   * - If no more injects, transition to "victory".
   * - Otherwise, set up the next inject's timer and enter "playing" phase.
   */
  advanceToNextInject: () => {
    const { scenario, currentInjectIndex, phase } = get();
    if (phase !== "feedback" || !scenario) return;

    const nextIndex = currentInjectIndex + 1;

    // Check if scenario is complete
    if (nextIndex >= scenario.injects.length) {
      set({ phase: "victory", timerRunning: false });
      return;
    }

    const nextInject = scenario.injects[nextIndex];
    if (!nextInject) {
      set({ phase: "victory", timerRunning: false });
      return;
    }

    set({
      currentInjectIndex: nextIndex,
      timerSeconds: nextInject.timer_seconds,
      timerRunning: true,
      phase: "playing",
    });
  },

  /**
   * Reset the in-game state to idle (replay the same scenario from scratch).
   * Keeps isSimulationActive and onboardingConfig intact so the session can
   * be re-entered from the briefing screen.
   */
  resetGame: () => {
    set({
      scenario: null,
      selectedRole: null,
      selectedRoles: [],
      phase: "idle",
      currentInjectIndex: 0,
      scores: { security: 50, business: 50, reputation: 50 },
      history: [],
      timerSeconds: 0,
      timerRunning: false,
    });
  },

  /**
   * Full reset — clears the entire simulation lifecycle including committed
   * onboarding config and the temp onboarding store.
   */
  resetSimulation: () => {
    // Clear the temp onboarding store as well
    useOnboardingStore.getState().resetOnboarding();

    set({
      isSimulationActive: false,
      activeScenarioId: null,
      onboardingConfig: null,
      scenario: null,
      selectedRole: null,
      selectedRoles: [],
      phase: "idle",
      currentInjectIndex: 0,
      scores: { security: 50, business: 50, reputation: 50 },
      history: [],
      timerSeconds: 0,
      timerRunning: false,
    });
  },
}));
