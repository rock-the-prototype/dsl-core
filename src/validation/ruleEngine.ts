/*
 * Copyright 2025 Sascha Block
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

// ruleEngine.ts
import type { RequirementAtom } from "../types/RequirementAtom.ts";
import type { ValidationError } from "./types.ts";

import {
  checkActor,
  checkAtomicity,
  checkModality,
  checkStructure,
} from "./ruleChecks/index.ts";

export function applyRules(atom: RequirementAtom): ValidationError[] {
  return [
    ...checkStructure(atom),
    ...checkActor(atom),
    ...checkAtomicity(atom),
    ...checkModality(atom),
  ];
}
