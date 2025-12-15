// tests/validator.test.ts

import { assertEquals, assert } from "https://deno.land/std/testing/asserts.ts";
import { validateRequirement } from "../src/validation/validator.ts";

Deno.test("Validator accepts a valid Requirement Atom", () => {
  const atom = {
    actor: "system",
    modality: "must",
    action: "validate the access token",
    condition: "receiving an ePrescription request",
    result: "log success or failure",
  };

  const result = validateRequirement(atom);

  assert(result.valid);
});

Deno.test("Validator rejects invalid modality", () => {
  const atom = {
    actor: "system",
    modality: "should",
    action: "validate the access token",
  };

  const result = validateRequirement(atom);

  assertEquals(result.valid, false);
  assert(result.errors && result.errors.length > 0);
});

Deno.test("Validator rejects missing required fields", () => {
  const atom = {
    modality: "must",
    action: "validate the access token",
  };

  const result = validateRequirement(atom);

  assertEquals(result.valid, false);
});
