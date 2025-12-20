/*
 * Copyright 2025 Sascha Block
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

import { parseRequirement } from "../../src/parser/parser.ts";

test("rejects non-binding modality", () => {
    expect(() =>
        parseRequirement("System should validate the token.")
    ).toThrow();
});

test("rejects missing modality", () => {
    expect(() =>
        parseRequirement("System validate the token.")
    ).toThrow();
});