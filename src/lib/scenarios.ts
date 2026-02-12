import type { Scenario } from "@/types/game";
import ransomware001 from "@/data/scenarios/ransomware-001.json";

/**
 * Registry of all available scenarios, indexed by their meta.id.
 * To add a new scenario, import the JSON and add it here.
 */
const scenarioRegistry: Record<string, Scenario> = {
  [ransomware001.meta.id]: ransomware001 as unknown as Scenario,
};

/**
 * Get all available scenarios as an array.
 */
export function getAllScenarios(): Scenario[] {
  return Object.values(scenarioRegistry);
}

/**
 * Look up a single scenario by its meta.id.
 * Returns null if not found.
 */
export function getScenarioById(id: string): Scenario | null {
  return scenarioRegistry[id] ?? null;
}
