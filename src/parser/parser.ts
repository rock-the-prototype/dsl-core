// src/parser/parser.ts

export interface RequirementAtom {
  actor: string;
  modality: "must" | "must not";
  action: string;
  condition?: string;
  result?: string;
}

export function parseRequirement(input: string): RequirementAtom {
  const normalized = input.trim().replace(/\s+/g, " ");

  // Basic Regex gemäß CFG: As <role>, I <modality> <action> [when <condition>] [then <result>].
  const pattern =
    /^As\s+a?\s*(?<actor>[A-Za-z0-9_-]+),?\s*I\s+(?<modality>must|must not)\s+(?<action>.+?)(?:\s+when\s+(?<condition>.+?))?(?:\s+then\s+(?<result>.+?))?\.$/i;

  const match = normalized.match(pattern);
  if (!match || !match.groups) {
    throw new Error("Invalid DSL statement – syntax does not match grammar.");
  }

  return {
    actor: match.groups.actor.toLowerCase(),
    modality: match.groups.modality.toLowerCase() as "must" | "must not",
    action: match.groups.action.trim(),
    condition: match.groups.condition?.trim(),
    result: match.groups.result?.trim(),
  };
}
