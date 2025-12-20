/*
 * Copyright 2025 Sascha Block
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

// src/parser/parser.ts

import {
  MissingActorError,
  MissingModalityError,
  InvalidModalityError,
  MissingActionError,
  NormalizationError,
} from "../errors/errors.ts";

import { normalizeInput } from "./normalizer.ts";
import { RequirementAtom } from "../types/RequirementEntity.ts";

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
    throw new NormalizationError(
        "Statement must end with a single period ('.')."
    );
  }

  // Remove final terminator for parsing
  const statement = normalized.slice(0, -1).trim();

  /**
   * Expected canonical prefix after normalization:
   *
   *   As <actor>, I must <...>
   *   As <actor>, I must not <...>
   */
  const actorRegex =
      /^(?:as\s+)?(?<actor>[A-Za-z0-9 _-]+),?\s+(?:i|we)?\s*(?<modality>must not|must)\s+(?<rest>.+)$/i;

  const actorMatch = statement.match(actorRegex);

  if (!actorMatch?.groups) {
    throw new NormalizationError(
        "Missing modality: use 'must' or 'must not'."
    );
  }

  const actor = actorMatch.groups.actor.trim().toLowerCase();
  const modalityRaw = actorMatch.groups.modality.toLowerCase();
  let rest = actorMatch.groups.rest.trim();

  if (modalityRaw !== "must" && modalityRaw !== "must not") {
    throw new InvalidModalityError(modalityRaw);
  }

  const modality = modalityRaw as "must" | "must not";


  let action = "";
  let condition: string | undefined;
  let result: string | undefined;

  /**
   * Variants:
   * 1) As a system, I must <action>
   * 2) As a system, I must <action> then <result>
   * 3) As a system, I must <action> when <condition>
   * 4) As a system, I must <action> when <condition> then <result>
   */

  const [head, afterWhen] = rest.split(/\s+when\s+/i);

  if (!afterWhen) {
    // no "when" → <action> [then <result>]
    const [actionPart, resultPart] = head.split(/\s+then\s+/i);
    action = actionPart.trim();
    if (!action) {
      throw new MissingActionError();
    }
    if (resultPart && resultPart.trim().length > 0) {
      result = resultPart.trim();
    }
  } else {
    // with "when" → <action> when <condition> [then <result>]
    action = head.trim();
    if (!action) {
      throw new MissingActionError();
    }

    const [conditionPart, resultPart] = afterWhen.split(/\s+then\s+/i);
    if (conditionPart && conditionPart.trim().length > 0) {
      condition = conditionPart.trim();
    }
    if (resultPart && resultPart.trim().length > 0) {
      result = resultPart.trim();
    }
  }

  const atom: RequirementAtom = {
    actor,
    modality,
    action,
    ...(condition ? { condition } : {}),
    ...(result ? { result } : {}),
  };

  return atom;
}
