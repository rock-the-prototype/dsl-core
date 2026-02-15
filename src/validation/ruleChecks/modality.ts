/*
 * Copyright 2025 Sascha Block
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

import type { ValidationError } from "../types.ts";
import type { RequirementAtom } from "../../types/RequirementAtom.ts";

const BINDING_MODALITIES = ["must", "must not"];

export function checkModality(afo: RequirementAtom): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!BINDING_MODALITIES.includes(afo.modality)) {
    errors.push({
      ruleId: "AFO-MODALITY-001",
      severity: "error",
      field: "modality",
      message: "Only binding modal verbs are allowed",
    });
  }

  return errors;
}
