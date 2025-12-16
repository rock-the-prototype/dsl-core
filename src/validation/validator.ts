// src/validator/validator.ts

/*
 * Copyright 2025 Sascha Block
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

import type { RequirementAtom } from "../types/RequirementAtom.ts";
import type { ValidationError } from "./types.ts";
import { applyRules } from "./ruleEngine.ts";

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/**
 * Applies rule-based validation to a RequirementAtom.
 * Structural and semantic rules are evaluated deterministically.
 */
export function validateRequirement(atom: RequirementAtom): ValidationResult {
  const errors = applyRules(atom);

  return {
    valid: errors.length === 0,
    errors
  };
}