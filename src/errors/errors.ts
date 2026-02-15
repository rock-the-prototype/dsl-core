// src/errors/errors.ts

/**
 * Base class for all DSL-related errors.
 * Enables structured, audit-friendly error reporting.
 */
export class RequirementError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

/**
 * Raised when the actor clause ("As <actor>") is missing.
 */
export class MissingActorError extends RequirementError {
  constructor() {
    super("Missing actor clause: expected 'As <actor>'.");
  }
}

/**
 * Raised when the modality clause ("I must/must not") is missing.
 */
export class MissingModalityError extends RequirementError {
  constructor() {
    super("Missing modality: expected 'I must' or 'I must not'.");
  }
}

/**
 * Raised when a non-binary modality (should, may, shall…) is used.
 */
export class InvalidModalityError extends RequirementError {
  constructor(modality: string) {
    super(
      `Invalid modality '${modality}': only 'must' and 'must not' are allowed.`,
    );
  }
}

/**
 * Raised when the action clause cannot be extracted.
 */
export class MissingActionError extends RequirementError {
  constructor() {
    super("Missing action clause after modality.");
  }
}

/**
 * Raised when the normalization process fails.
 */
export class NormalizationError extends RequirementError {
  constructor(details?: string) {
    super("Normalization failed." + (details ? " " + details : ""));
  }
}

/**
 * Raised when JSON Schema validation fails.
 */
export class SchemaValidationError extends RequirementError {
  constructor(errors: unknown[]) {
    super("Schema validation failed.");
    this.errors = errors;
  }

  errors: unknown[];
}
