// src/parser/parser.ts

import {
  MissingActorError,
  MissingModalityError,
  InvalidModalityError,
  MissingActionError,
  NormalizationError,
} from "../errors/errors.ts";

import { normalizeInput } from "./normalizer.ts";
import { RequirementAtom } from "../types/RequirementAtom.ts";

/**
 * Main parser function:
 * Takes a DSL sentence, normalizes it, checks CFG compliance,
 * extracts components, and returns a Requirement Atom.
 */
export function parseRequirement(input: string): RequirementAtom {
  if (!input || input.trim().length === 0) {
    throw new NormalizationError("Input is empty.");
  }

  // Step 1: Normalize input to Canonical Form
  const normalized = normalizeInput(input);
  if (!normalized.endsWith(".")) {
    throw new NormalizationError("Statement must end with a single period.");
  }

  // Remove final terminator for parsing
  const statement = normalized.slice(0, -1).trim();

  /**
   * Expected canonical form after normalization:
   *
   * As <actor>, I must <action> when <condition> then <result>
   *
   * Condition and result are optional.
   */
  const actorRegex = /^As\s+([A-Za-z0-9_-]+),\s+I\s+(must|must not)\s+(.+)$/i;

  const actorMatch = statement.match(actorRegex);
  if (!actorMatch) {
    throw new MissingActorError();
  }

  const actor = actorMatch[1].toLowerCase();
  const modality = actorMatch[2].toLowerCase();
  let remaining = actorMatch[3].trim();

  // Enforce binary modality
  if (modality !== "must" && modality !== "must not") {
    throw new InvalidModalityError(modality);
  }

  // Extract optional "when" and "then" clauses
  let action = "";
  let condition = undefined;
  let result = undefined;

  // Split by "when"
  const whenSplit = remaining.split(/\s+when\s+/i);
  if (whenSplit.length === 1) {
    // No condition: only <action> or <action> then <result>
    remaining = whenSplit[0];
  } else {
    action = whenSplit[0].trim();
    remaining = whenSplit[1].trim();
    condition = remaining.split(/\s+then\s+/i)[0]?.trim();
  }

  // If action empty → error
  if (!action || action.length === 0) {
    // Maybe action was in remaining before "when"
    action = whenSplit[0]?.trim();
  }

  if (!action || action.length === 0) {
    throw new MissingActionError();
  }

  // Extract optional "then"
  const thenSplit = remaining.split(/\s+then\s+/i);
  if (thenSplit.length > 1) {
    result = thenSplit[1].trim();
  }

  // Final: Build Requirement Atom
  const atom: RequirementAtom = {
    actor,
    modality,
    action,
    ...(condition ? { condition } : {}),
    ...(result ? { result } : {}),
  };

  return atom;
}
