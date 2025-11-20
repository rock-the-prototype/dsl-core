// tests/errors.test.ts

import {
  MissingActorError,
  MissingModalityError,
  InvalidModalityError,
  MissingActionError,
  NormalizationError,
  SchemaValidationError,
} from "../src/errors/errors.ts";

import { assertEquals, assertInstanceOf } from "https://deno.land/std/testing/asserts.ts";

Deno.test("MissingActorError works", () => {
  const err = new MissingActorError();
  assertInstanceOf(err, MissingActorError);
  assertEquals(err.message, "Missing actor clause: expected 'As <actor>'.");
});

Deno.test("InvalidModalityError reports correct modality", () => {
  const err = new InvalidModalityError("should");
  assertEquals(err.message, "Invalid modality 'should': only 'must' and 'must not' are allowed.");
});

Deno.test("SchemaValidationError stores errors", () => {
  const details = [{ message: "modality wrong" }];
  const err = new SchemaValidationError(details);
  assertEquals(err.errors, details);
});
