// tests/validator.test.ts

import { assert, assertEquals } from "@std/assert";
import { validateRequirement } from "../src/validation/validator.ts";
import type { RequirementAtom } from "../src/types/RequirementAtom.ts";

Deno.test("Validator accepts a valid Requirement Atom", () => {
  const atom: RequirementAtom = {
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
  // deliberately incorrect modality for negative test
  const atom = {
    actor: "system",
    modality: "should",
    action: "validate the access token",
  } as unknown as RequirementAtom;

  const result = validateRequirement(atom);

  assertEquals(result.valid, false);
  assert(result.errors.length > 0);
});

Deno.test("Validator rejects missing required fields", () => {
  // deliberately incomplete for negative test
  const atom = {
    modality: "must",
    action: "validate the access token",
  } as unknown as RequirementAtom;

  const result = validateRequirement(atom);

  assertEquals(result.valid, false);
});
