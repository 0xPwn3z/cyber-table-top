// ============================================================================
// CyberTabletop — Game Logic Utilities
// The "Mixer" — filters & selects questions based on user roles
// ============================================================================

import type { ScenarioData, ScenarioQuestion, ScenarioRole } from "@/types/scenario";
import type { Inject, Option, Role } from "@/types/game";

/** Number of questions to select for a game session */
const SESSION_QUESTION_COUNT = 5;

/**
 * Shuffle an array in-place using the Fisher-Yates algorithm.
 * Returns a new array (does not mutate the original).
 */
function shuffle<T>(arr: readonly T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Generate session questions from a scenario, filtered by the user's
 * selected roles with STRICT filtering rules:
 *
 * Rule 1: A question is included IF AND ONLY IF it has a universal tag
 *         (targetRoles includes "ALL") OR at least ONE of its targetRoles
 *         matches the user's selectedRoles.
 * Rule 2: If the filtered pool has > 5 questions, shuffle and pick exactly 5.
 * Rule 3 (No Padding): If the strictly filtered pool has fewer than 5
 *         questions, return only the available questions (DO NOT pad).
 *
 * @param scenario  - The full scenario data
 * @param userRoles - The roles the user selected (1 or more)
 * @returns An array of up to 5 ScenarioQuestion objects, randomly ordered
 */
export function generateSessionQuestions(
  scenario: ScenarioData,
  userRoles: ScenarioRole[]
): ScenarioQuestion[] {
  if (userRoles.length === 0) return [];

  const isUniversalQuestion = (targetRoles: ScenarioRole[]): boolean => {
    return targetRoles.includes("ALL" as ScenarioRole);
  };

  const matchingQuestions = scenario.questions.filter((q) => {
    if (isUniversalQuestion(q.targetRoles)) {
      return true;
    }
    return q.targetRoles.some((role) => userRoles.includes(role));
  });

  if (matchingQuestions.length <= SESSION_QUESTION_COUNT) {
    return shuffle(matchingQuestions);
  }

  const shuffled = shuffle(matchingQuestions);
  return shuffled.slice(0, SESSION_QUESTION_COUNT);
}

/**
 * Convert a ScenarioQuestion (new format) into an Inject (legacy game
 * engine format) so the existing game loop can consume it without changes.
 *
 * Maps the `text` field → `question`, and flattens the 4-outcome options
 * into the standard Option[] format.
 */
export function questionToInject(
  question: ScenarioQuestion,
  index: number
): Inject {
  return {
    id: question.id,
    order: index + 1,
    timestamp_display: question.timestamp_display,
    context: question.context,
    question: question.text,
    timer_seconds: question.timer_seconds,
    targetRoles: question.targetRoles as Inject["targetRoles"],
    options: question.options.map<Option>((opt) => ({
      id: opt.id,
      label: opt.label,
      feedback_text: opt.feedback_text,
      impact: { ...opt.impact },
    })),
  };
}

/**
 * Full pipeline: generate session questions, then convert them to Injects
 * that the existing game engine (Zustand store) can work with.
 */
export function buildSessionInjects(
  scenario: ScenarioData,
  userRoles: ScenarioRole[]
): Inject[] {
  const questions = generateSessionQuestions(scenario, userRoles);
  return questions.map(questionToInject);
}

/**
 * Map the new ScenarioRole type to the legacy Role type.
 * They are the same string union, but this makes conversions explicit.
 */
export function toRoles(scenarioRoles: ScenarioRole[]): Role[] {
  return scenarioRoles as Role[];
}
