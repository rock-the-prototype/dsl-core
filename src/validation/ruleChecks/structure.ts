/*
 * Copyright 2025 Sascha Block
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

import type { RequirementAtom } from "../../types/RequirementAtom.ts";
import type { ValidationError } from "../types.ts";

export function checkStructure(atom: RequirementAtom): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!atom.actor || atom.actor.trim().length === 0) {
    errors.push({
      ruleId: "AFO-STRUCTURE-001",
      severity: "error",
      field: "actor",
      message: "Actor is required",
    });
  }

  if (!atom.modality || atom.modality.trim().length === 0) {
    errors.push({
      ruleId: "AFO-STRUCTURE-002",
      severity: "error",
      field: "modality",
      message: "Modality is required",
    });
  }

  if (!atom.action || atom.action.trim().length === 0) {
    errors.push({
      ruleId: "AFO-STRUCTURE-003",
      severity: "error",
      field: "action",
      message: "Action is required",
    });
  }

  return errors;
}
