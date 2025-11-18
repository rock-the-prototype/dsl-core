// src/validator/validator.ts

import { RequirementAtom } from "../types/RequirementAtom.ts";
import schema from "../schema/requirement.schema.json" assert { type: "json" };

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
