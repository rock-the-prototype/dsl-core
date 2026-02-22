/*
 * Copyright 2025 Sascha Block
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

import { assertEquals } from "@std/assert";
import { checkActor } from "../../src/validation/ruleChecks/actor.ts";
import type { RequirementAtom } from "../../src/types/RequirementAtom.ts";

Deno.test("accepts explicit actor", () => {
  const atom: RequirementAtom = {
    actor: "system",
    modality: "must",
    action: "validate token",
  };

  const errors = checkActor(atom);
  assertEquals(errors.length, 0);
});

Deno.test("rejects placeholder actor", () => {
  const atom: RequirementAtom = {
    actor: "actor",
    modality: "must",
    action: "validate token",
  };

  const errors = checkActor(atom);
  assertEquals(errors.length, 1);
  assertEquals(errors[0].ruleId, "AFO-ACTOR-001");
});
