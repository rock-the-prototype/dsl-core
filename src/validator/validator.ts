// src/validator/validator.ts

/*
 * Copyright 2025 Sascha Block
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

import { RequirementAtom } from "../types/RequirementAtom.ts";
import schema from "../schema/requirement.schema.json" with { type: "json" };

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Very simple structure validation for RequirementAtom.
 * Sufficient for the MVP and for visible CLI feedback.
 */
export function validateRequirement(atom: RequirementAtom): ValidationResult {
  const errors: string[] = [];

  // Grundchecks auf Pflichtfelder – an dein Schema anpassen
  if (!atom.id || atom.id.trim().length === 0) {
    errors.push("id is required.");
  }

  if (!atom.title || atom.title.trim().length === 0) {
    errors.push("title is required.");
  }

  if (!atom.description || atom.description.trim().length === 0) {
    errors.push("description is required.");
  }

  // Optional: Version check
  if (!atom.version || atom.version.trim().length === 0) {
    errors.push("version is required.");
  }

  // You can add further checks here at any time.
  //  e.g., regex checks, length limits, etc.

  return {
    valid: errors.length === 0,
    errors,
  };
}