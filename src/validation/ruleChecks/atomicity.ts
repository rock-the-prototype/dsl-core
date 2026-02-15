/*
 * Copyright 2025 Sascha Block
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

import type { ValidationError } from "../types.ts";
import type { RequirementAtom } from "../../types/RequirementAtom.ts";

export function checkAtomicity(afo: RequirementAtom): ValidationError[] {
  const errors: ValidationError[] = [];

  const hasMultipleActions = /\band\b|\bor\b/.test(afo.action);

  if (hasMultipleActions) {
    errors.push({
      ruleId: "AFO-ATOMICITY-001",
      severity: "error",
      field: "action",
      message: "Multiple actions detected in a single requirement",
    });
  }

  return errors;
}
