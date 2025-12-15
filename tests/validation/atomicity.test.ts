/*
 * Copyright 2025 Sascha Block
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

import { checkAtomicity } from "../atomicity";

const baseAfo = {
    actor: "system",
    modality: "must",
    action: "validate the access token"
};

test("accepts a single action", () => {
    const errors = checkAtomicity(baseAfo as any);
    expect(errors).toHaveLength(0);
});

test("rejects multiple actions (and)", () => {
    const errors = checkAtomicity({ ...baseAfo, action: "validate and log the access token" } as any);
    expect(errors).toHaveLength(1);
    expect(errors[0].ruleId).toBe("AFO-ATOMICITY-001");
});