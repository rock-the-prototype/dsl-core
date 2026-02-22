/*
 * Copyright 2025 Sascha Block
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

import { expect } from "@std/expect";
import type { RequirementAtom } from "../../src/types/RequirementAtom.ts";
import { checkModality } from "../../src/validation/ruleChecks/modality.ts";

const baseAfo: RequirementAtom = {
  actor: "system",
  modality: "must",
  action: "validate the access token",
};

Deno.test("accepts binding modality: must", () => {
  const errors = checkModality(baseAfo);
  expect(errors).toHaveLength(0);
});

Deno.test("rejects non-binding modality: should", () => {
  // Intentionally violating the type to test runtime validation:
  const invalid = {
    ...baseAfo,
    modality: "should",
  } as unknown as RequirementAtom;

  const errors = checkModality(invalid);
  expect(errors).toHaveLength(1);
  expect(errors[0].ruleId).toBe("AFO-MODALITY-001");
});
