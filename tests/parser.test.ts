/*
 * Copyright 2025 Sascha Block
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

import { parseRequirement } from "../src/parser/parser.ts";
import { assertEquals, assertThrows } from "@std/assert";

Deno.test("Parsing a valid DSL Requirement Atom", () => {
  const input =
    "As a system, I must validate the access token when receiving an ePrescription request then log success or failure.";

  const result = parseRequirement(input);

  assertEquals(result.actor, "system");
  assertEquals(result.modality, "must");
  // Parser preserves action text here (already lowercase in input)
  assertEquals(result.action, "validate the access token");
  assertEquals(result.condition, "receiving an ePrescription request");
  assertEquals(result.result, "log success or failure");
});

Deno.test("Normalizes inconsistent spacing and casing", () => {
  const input =
    "  as  a SYSTEM ,   i   MUST   validate the Access Token   WHEN receiving data THEN   log Success   or Failure   . ";

  const result = parseRequirement(input);

  assertEquals(result.actor, "system");
  assertEquals(result.modality, "must");
  // Parser normalizes structure, but preserves action casing/content token text here
  assertEquals(result.action, "validate the Access Token");
});

Deno.test("Rejects invalid syntax (missing modality)", () => {
  const invalid = "As a system, I validate the access token.";

  assertThrows(() => parseRequirement(invalid), Error);
});

Deno.test("Rejects invalid syntax (missing actor)", () => {
  const invalid = "I must validate the access token.";

  assertThrows(() => parseRequirement(invalid), Error);
});
