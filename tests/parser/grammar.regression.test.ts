/*
 * Copyright 2025 Sascha Block
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

// tests/parser/grammar.regression.test.ts
import { parseRequirement } from "../../src/parser/parser.ts";

Deno.test("accepts canonical 'As <actor>, I must ...' form", () => {
  const atom = parseRequirement("As System, I must validate the access token.");
  if (atom.actor !== "system") throw new Error(`actor mismatch: ${atom.actor}`);
  if (atom.modality !== "must") {
    throw new Error(`modality mismatch: ${atom.modality}`);
  }
  if (atom.action !== "validate the access token") {
    throw new Error(`action mismatch: ${atom.action}`);
  }
});

Deno.test("accepts '<actor> must ...' form without 'As'", () => {
  const atom = parseRequirement("System must validate the access token.");
  if (atom.actor !== "system") throw new Error(`actor mismatch: ${atom.actor}`);
  if (atom.modality !== "must") {
    throw new Error(`modality mismatch: ${atom.modality}`);
  }
});

Deno.test("rejects 'As <actor>, must ...' missing subject after 'As'", () => {
  let threw = false;
  try {
    parseRequirement("As System, must validate the token.");
  } catch (_e) {
    threw = true;
  }
  if (!threw) {
    throw new Error(
      "Expected parseRequirement to throw for missing subject after 'As <actor>,'",
    );
  }
});
