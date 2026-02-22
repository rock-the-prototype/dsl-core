/*
 * Copyright 2025 Sascha Block
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

import { assertEquals } from "@std/assert";
import { parseRequirement } from "../../src/parser/parser.ts";

Deno.test("accepts canonical form", () => {
  const atom = parseRequirement("As system, I must validate the token.");
  assertEquals(atom.actor, "system");
  assertEquals(atom.modality, "must");
});

Deno.test("accepts missing comma", () => {
  const atom = parseRequirement("As system I must validate the token.");
  assertEquals(atom.actor, "system");
});

Deno.test("accepts subject-less form", () => {
  const atom = parseRequirement("System must validate the token.");
  assertEquals(atom.modality, "must");
});
