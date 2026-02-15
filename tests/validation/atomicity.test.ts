/*
 * Copyright 2025 Sascha Block
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

import type { RequirementAtom } from "../../src/types/RequirementAtom.ts";
import { expect } from "@std/expect";
import { checkAtomicity } from "../atomicity";

const baseAfo: RequirementAtom = {
  actor: "system",
  modality: "must",
  action: "validate the access token",
};

Deno.test("accepts a single action", () => {
  const errors = checkAtomicity(baseAfo);
  expect(errors).toHaveLength(0);
});

Deno.test("rejects multiple actions (and)", () => {
  const invalid: RequirementAtom = {
    ...baseAfo,
    action: "validate and log the access token",
  };

  const errors = checkAtomicity(invalid);
  expect(errors).toHaveLength(1);
  expect(errors[0].ruleId).toBe("AFO-ATOMICITY-001");
});
