/*
 * Copyright 2025 Sascha Block
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

import { assertThrows } from "@std/assert";
import { parseRequirement } from "../../src/parser/parser.ts";

Deno.test("rejects non-binding modality", () => {
  assertThrows(() => parseRequirement("System should validate the token."));
});

Deno.test("rejects missing modality", () => {
  assertThrows(() => parseRequirement("System validate the token."));
});
