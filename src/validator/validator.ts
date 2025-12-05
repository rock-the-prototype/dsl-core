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

/**
 * Validation rules for RequirementAtom.
 * Includes structural checks + atomicity analysis for Audit-by-Design.
 */
export function validateRequirement(atom: RequirementAtom): ValidationResult {
  const errors: string[] = [];

  //
  // 1) Pflichtfelder prüfen
  //
  if (!atom.actor || atom.actor.trim().length === 0) {
    errors.push("actor is required.");
  }

  if (!atom.modality || atom.modality.trim().length === 0) {
    errors.push("modality is required.");
  }

  if (!atom.action || atom.action.trim().length === 0) {
    errors.push("action is required.");
  }

  //
  // 2) Atomaritätsprüfung (zentrales Audit-by-Design Kriterium)
  //

  // A) Mehrfache THEN-Klauseln → mehrere Ergebnisblöcke
  if (atom.raw) {
    const occurrences = atom.raw.match(/\bthen\b/gi) ?? [];
    if (occurrences.length > 1) {
      errors.push("Requirement is not atomic: multiple THEN clauses detected.");
    }
  }

  // B) Ergebnis enthält potenziell mehrere Operationen
  // (primitive Heuristik, später erweiterbar mit NLP/CFG)
  if (atom.result) {
    if (atom.result.includes(" and ")) {
      errors.push("Requirement is not atomic: multiple result actions detected.");
    }

    if (atom.result.split(",").length > 1) {
      errors.push("Requirement may contain multiple result actions (comma-separated).");
    }
  }

  //
  // 3) Optionale semantische Checks
  //

  // Wenn modality "must not", dann sollte result leer sein
  if (atom.modality === "must not" && atom.result) {
    errors.push("A prohibition ('must not') should not define a result clause.");
  }

  // Wenn condition existiert, aber Modalverb fehlt → unvollständig
  if (atom.condition && !atom.modality) {
    errors.push("Condition provided but modality missing.");
  }

  //
  // Ergebnis zurückgeben
  //
  return {
    valid: errors.length === 0,
    errors,
  };
}