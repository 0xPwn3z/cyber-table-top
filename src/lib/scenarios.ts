import type { Scenario, Inject } from "@/types/game";
import type { ScenarioData, ScenarioQuestion } from "@/types/scenario";
import ransomware001 from "@/data/scenarios/ransomware-001.json";

/**
 * Convert new-format ScenarioData (with `questions`) into the legacy
 * Scenario type (with `injects`) that the game engine expects.
 */
function scenarioDataToLegacy(data: ScenarioData): Scenario {
  const injects: Inject[] = data.questions.map(
    (q: ScenarioQuestion, i: number) => ({
      id: q.id,
      order: i + 1,
      timestamp_display: q.timestamp_display,
      context: q.context,
      question: q.text,
      timer_seconds: q.timer_seconds,
      targetRoles: q.targetRoles as Scenario["configuration"]["playable_roles"],
      options: q.options.map((o) => ({
        id: o.id,
        label: o.label,
        feedback_text: o.feedback_text,
        impact: { ...o.impact },
      })),
    })
  );

  return {
    meta: data.meta,
    configuration: data.configuration,
    injects,
  };
}

/**
 * Registry of all available scenarios, indexed by their meta.id.
 * To add a new scenario, import the JSON and add it here.
 */
const scenarioRegistry: Record<string, Scenario> = {
  [ransomware001.meta.id]: scenarioDataToLegacy(
    ransomware001 as unknown as ScenarioData
  ),
};

/**
 * Get the raw new-format ScenarioData by ID.
 * Used by the game-logic mixer for role-based question filtering.
 */
const scenarioDataRegistry: Record<string, ScenarioData> = {
  [ransomware001.meta.id]: ransomware001 as unknown as ScenarioData,
};

/**
 * Get all available scenarios as an array.
 */
export function getAllScenarios(): Scenario[] {
  return Object.values(scenarioRegistry);
}

/**
 * Look up a single scenario by its meta.id (legacy format).
 * Returns null if not found.
 */
export function getScenarioById(id: string): Scenario | null {
  return scenarioRegistry[id] ?? null;
}

/**
 * Look up a single scenario by its meta.id (new format with questions).
 * Returns null if not found.
 */
export function getScenarioDataById(id: string): ScenarioData | null {
  return scenarioDataRegistry[id] ?? null;
}

/**
 * Add a dynamically uploaded scenario to the registries.
 */
export function addScenario(data: ScenarioData): Scenario {
  scenarioDataRegistry[data.meta.id] = data;
  const legacy = scenarioDataToLegacy(data);
  scenarioRegistry[data.meta.id] = legacy;
  return legacy;
}
