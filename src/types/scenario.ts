// ============================================================================
// CyberTabletop — Scenario Schema (Zod + TypeScript)
// Defines the new role-based scenario format with the 4-outcome matrix:
//   Critical Success ("Yes, and…"), Partial Success ("Yes, but…"),
//   Partial Failure ("No, but…"), Critical Failure ("No, and…")
// ============================================================================

import { z } from "zod";

// ── Enums ──────────────────────────────────────────────────────────────────

export const RoleEnum = z.enum(["CISO", "SOC_LEAD", "DFIR", "IT_MANAGER"]);

export const DifficultyEnum = z.enum(["Easy", "Medium", "Hard"]);

export const OutcomeTypeEnum = z.enum([
  "critical_success", // "Yes, and…"
  "partial_success",  // "Yes, but…"
  "partial_failure",  // "No, but…"
  "critical_failure", // "No, and…"
]);

// ── Impact Schema ──────────────────────────────────────────────────────────

export const ImpactSchema = z.object({
  security: z.number().int().min(-100).max(100),
  business: z.number().int().min(-100).max(100),
  reputation: z.number().int().min(-100).max(100),
});

// ── Option Schema (4-outcome matrix) ───────────────────────────────────────

export const ScenarioOptionSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  outcome_type: OutcomeTypeEnum,
  feedback_text: z.string().min(1),
  impact: ImpactSchema,
});

// ── Question Schema ────────────────────────────────────────────────────────

export const ScenarioQuestionSchema = z.object({
  id: z.string().min(1),
  order: z.number().int().positive(),
  timestamp_display: z.string().min(1),
  context: z.string().min(1),
  text: z.string().min(1),
  timer_seconds: z.number().int().positive().max(300),
  targetRoles: z.array(RoleEnum).min(1),
  options: z.array(ScenarioOptionSchema).length(4).refine(
    (opts) => {
      const types = opts.map((o) => o.outcome_type);
      return (
        types.includes("critical_success") &&
        types.includes("partial_success") &&
        types.includes("partial_failure") &&
        types.includes("critical_failure")
      );
    },
    {
      message:
        "Each question must have exactly 4 options: one critical_success ('Yes, and…'), one partial_success ('Yes, but…'), one partial_failure ('No, but…'), and one critical_failure ('No, and…').",
    }
  ),
});

// ── Scenario Meta ──────────────────────────────────────────────────────────

export const ScenarioMetaSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  difficulty: DifficultyEnum,
  duration_minutes: z.number().int().positive(),
  tags: z.array(z.string().min(1)).min(1),
  version: z.string().min(1),
});

// ── Scenario Configuration ─────────────────────────────────────────────────

export const ScenarioConfigurationSchema = z.object({
  playable_roles: z.array(RoleEnum).min(1),
  starting_stats: ImpactSchema.extend({
    security: z.number().int().min(0).max(100),
    business: z.number().int().min(0).max(100),
    reputation: z.number().int().min(0).max(100),
  }),
});

// ── Top-Level Scenario ─────────────────────────────────────────────────────

export const ScenarioSchema = z.object({
  meta: ScenarioMetaSchema,
  configuration: ScenarioConfigurationSchema,
  questions: z.array(ScenarioQuestionSchema).min(1),
});

// ── Inferred TypeScript types ──────────────────────────────────────────────

export type ScenarioRole = z.infer<typeof RoleEnum>;
export type ScenarioDifficulty = z.infer<typeof DifficultyEnum>;
export type OutcomeType = z.infer<typeof OutcomeTypeEnum>;
export type ScenarioImpact = z.infer<typeof ImpactSchema>;
export type ScenarioOption = z.infer<typeof ScenarioOptionSchema>;
export type ScenarioQuestion = z.infer<typeof ScenarioQuestionSchema>;
export type ScenarioMeta = z.infer<typeof ScenarioMetaSchema>;
export type ScenarioConfiguration = z.infer<typeof ScenarioConfigurationSchema>;
export type ScenarioData = z.infer<typeof ScenarioSchema>;

// ── Validation helper ──────────────────────────────────────────────────────

/**
 * Validate raw JSON data against the Scenario schema.
 * Returns either the parsed ScenarioData or a list of user-friendly errors.
 */
export function validateScenarioJSON(
  data: unknown
): { success: true; data: ScenarioData } | { success: false; errors: string[] } {
  const result = ScenarioSchema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors = result.error.issues.map((issue) => {
    const path = issue.path.join(".");
    return `[${path || "root"}] ${issue.message}`;
  });

  return { success: false, errors };
}

/**
 * Sanitize string fields in scenario data to prevent XSS injection.
 * Strips HTML tags and dangerous patterns from all string values.
 */
export function sanitizeScenarioStrings<T>(obj: T): T {
  if (typeof obj === "string") {
    // Strip HTML tags
    let clean = obj.replace(/<[^>]*>/g, "");
    // Strip javascript: protocol
    clean = clean.replace(/javascript\s*:/gi, "");
    // Strip on* event handlers
    clean = clean.replace(/\bon\w+\s*=/gi, "");
    // Strip data: URIs that could contain scripts
    clean = clean.replace(/data\s*:[^,]*base64/gi, "");
    return clean as unknown as T;
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizeScenarioStrings) as unknown as T;
  }
  if (obj !== null && typeof obj === "object") {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      sanitized[key] = sanitizeScenarioStrings(value);
    }
    return sanitized as T;
  }
  return obj;
}
