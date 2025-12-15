/*
 * Copyright 2025 Sascha Block
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

import { ValidationError } from "../types";
import { RequirementAtom } from "../../types";

const INVALID_ACTORS = ["unknown", "n/a", "tbd", "todo", "someone", "anyone"];

export function checkActor(afo: RequirementAtom): ValidationError[] {
    const errors: ValidationError[] = [];

    const actor = (afo.actor ?? "").trim().toLowerCase();

    // Schema already enforces minLength, but we keep it defensive here.
    if (!actor) {
        errors.push({
            ruleId: "AFO-ACTOR-001",
            severity: "error",
            field: "actor",
            message: "Actor must be explicitly specified"
        });
        return errors;
    }

    if (INVALID_ACTORS.includes(actor)) {
        errors.push({
            ruleId: "AFO-ACTOR-001",
            severity: "error",
            field: "actor",
            message: "Actor must be explicit and must not be a placeholder"
        });
    }

    return errors;
}