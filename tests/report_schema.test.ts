import Ajv2020Import from "ajv2020";
import addFormatsImport from "ajv-formats";

import schema from "../schemas/report.schema.json" with { type: "json" };
import validExample from "../schemas/examples/report.valid.minimal.json" with {
  type: "json",
};
import invalidExample from "../schemas/examples/report.invalid.missing-required.json" with {
  type: "json",
};

import type { FileValidation } from "../src/api/public_api.ts";
import type { ValidationError } from "../src/validation/types.ts";
import { buildReport } from "../src/report/buildReport.ts";

// Deno + npm/CJS interop can surface constructor/call signature issues in type-checking.
// These narrow casts keep runtime behavior unchanged while satisfying TS.
type AjvLike = {
  compile: (schema: unknown) => {
    (data: unknown): boolean;
    errors?: Array<{ keyword?: string }>;
  };
};

type AjvCtor = new (opts: {
  allErrors: boolean;
  strict: boolean;
}) => AjvLike;

const Ajv2020 = Ajv2020Import as unknown as AjvCtor;
const addFormats = addFormatsImport as unknown as (ajv: AjvLike) => void;

function makeValidate() {
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv);
  return ajv.compile(schema);
}

Deno.test("contract (Ajv): valid example conforms to report schema", () => {
  const validate = makeValidate();
  const ok = validate(validExample);
  if (!ok) throw new Error(JSON.stringify(validate.errors, null, 2));
});

Deno.test("contract (Ajv): invalid example is rejected by report schema", () => {
  const validate = makeValidate();
  const ok = validate(invalidExample);
  if (ok) throw new Error("Expected invalid example to fail, but it passed.");

  if (!validate.errors?.length) {
    throw new Error("Expected validation errors, but got none.");
  }

  const hasRequired = validate.errors.some((e: { keyword?: string }) =>
    e.keyword === "required"
  );
  if (!hasRequired) {
    throw new Error("Expected at least one 'required' schema error.");
  }
});

Deno.test(
  "implementation (Ajv): buildReport output conforms to report schema",
  () => {
    const validate = makeValidate();

    const files: FileValidation[] = [
      {
        path: "example.dsl",
        statements: [
          {
            input: "As system, I must do X.",
            atom: { actor: "system", modality: "must", action: "do x" },
            validation: { valid: true, errors: [] },
          },
          {
            input: "As system, I must not do Y.",
            atom: { actor: "system", modality: "must not", action: "do y" },
            validation: {
              valid: false,
              // buildReport passes validation.errors through opaquely.
              // For FileValidation typing we provide DSL ValidationError-like entries.
              errors: [
                {
                  ruleId: "RULE_X",
                  severity: "error",
                  message: "Y not allowed",
                },
              ] as ValidationError[],
            },
          },
          {
            input: "broken input",
            error: {
              name: "NormalizationError",
              message: "Invalid requirement structure",
            },
          },
        ],
      },
    ];

    const report = buildReport(files, {
      targetPath: "example.dsl",
      engineVersion: "0.0.0-dev",
      now: new Date("2026-01-02T00:00:00.000Z"),
    });

    const ok = validate(report);
    if (!ok) throw new Error(JSON.stringify(validate.errors, null, 2));
  },
);
