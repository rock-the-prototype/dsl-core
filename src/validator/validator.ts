// src/validator/validator.ts

/*
 * Copyright 2025 Sascha Block
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

import { RequirementAtom } from "../types/RequirementAtom.ts";
import { JSONSchema } from "https://deno.land/x/jsonschema@v1.4.1/mod.ts";

export interface ValidationResult {
  valid: boolean;
  errors?: unknown[];
}

export function validateRequirement(atom: RequirementAtom): ValidationResult {
  try {
    const validator = new JSONSchema(schema);
    const valid = validator.validate(atom);

    if (!valid) {
      return {
        valid: false,
        errors: validator.errors || [],
      };
    }

    return { valid: true };
  } catch (err) {
    return {
      valid: false,
      errors: [err],
    };
  }
}

// Deno global JSON schema validator
// minimal builtin Deno interface wrapper:
class JSONSchema {
  constructor(private schema: unknown) {}

  validate(data: unknown): boolean {
    const { valid, errors } = validateJsonSchema(this.schema, data);
    this.errors = errors;
    return valid;
  }

  errors: unknown[] = [];
}

/**
 * Minimal JSON Schema validator wrapper using Deno std
 */
import { validate as validateJsonSchema } from "https://deno.land/x/jsonschema/mod.ts";
