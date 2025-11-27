/*
 * Copyright 2025 Sascha Block
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

// src/parser/parser.ts

export function parseRequirement(input: string): RequirementAtom {
  if (!input?.trim()) {
    throw new NormalizationError("❌ Input is empty.");
  }

  const normalized = normalizeInput(input.trim());

  if (!normalized.endsWith(".")) {
    throw new NormalizationError("❌ DSL statement must end with a single period.");
  }

  const statement = normalized.slice(0, -1).trim();

  const regex = /^As\s+([A-Za-z0-9_-]+),\s+I\s+(must|must not)\s+(.+)$/i;
  const match = statement.match(regex);

  if (!match) {
    throw new MissingActorError("❌ DSL statement does not match canonical syntax.");
  }

  const actor = match[1].toLowerCase();
  const modality = match[2].toLowerCase() as "must" | "must not";
  let remaining = match[3].trim();

  if (!actor) {
    throw new MissingActorError("❌ Field \"actor\" is missing.");
  }
  if (!modality) {
    throw new MissingModalityError("❌ Field \"modality\" is missing.");
  }

  if (modality !== "must" && modality !== "must not") {
    throw new InvalidModalityError(`❌ Invalid modality: ${modality}. Expected \"must\" or \"must not\".`);
  }

  let action = "";
  let condition: string | undefined;
  let result: string | undefined;

  const condSplit = remaining.split(/\s+when\s+/i);
  if (condSplit.length > 1) {
    action = condSplit[0].trim();
    [condition, result] = condSplit[1].split(/\s+then\s+/i).map((s) => s.trim());
  } else {
    const resSplit = remaining.split(/\s+then\s+/i);
    action = resSplit[0].trim();
    result = resSplit[1]?.trim();
  }

  if (!action) {
    throw new MissingActionError("❌ Field \"action\" is missing.");
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
