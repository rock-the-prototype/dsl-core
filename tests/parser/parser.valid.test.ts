/*
 * Copyright 2025 Sascha Block
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

import { parseRequirement } from "../../src/parser/parser.ts";

test("accepts canonical form", () => {
    const atom = parseRequirement("As System, I must validate the token.");
    expect(atom.actor).toBe("system");
});

test("accepts missing comma", () => {
    const atom = parseRequirement("As System I must validate the token.");
    expect(atom.actor).toBe("system");
});

test("accepts subject-less form", () => {
    const atom = parseRequirement("System must validate the token.");
    expect(atom.modality).toBe("must");
});