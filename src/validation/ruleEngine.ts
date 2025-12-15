/*
 * Copyright 2025 Sascha Block
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

// ruleEngine.ts
import { RequirementAtom } from "../types";
import { ValidationError } from "./types";
import { checkActor, checkAtomicity, checkModality } from "./ruleChecks";

export function applyRules(afo: RequirementAtom): ValidationError[] {
    return [
        ...checkActor(afo),
        ...checkAtomicity(afo),
        ...checkModality(afo)
    ];
}