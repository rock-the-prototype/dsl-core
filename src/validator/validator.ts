// src/validator/validator.ts

/*
 * Copyright 2025 Sascha Block
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

import type { RequirementAtom } from "../types/RequirementAtom.ts";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateRequirement(atom: RequirementAtom): ValidationResult {
  const errors: string[] = [];

  if (!atom.actor) errors.push("actor is required.");
  if (!atom.modality) errors.push("modality is required.");
  if (!atom.action) errors.push("action is required.");

  return {
    valid: errors.length === 0,
    errors,
  };
}