import type { ErrorObject } from "npm:ajv/dist/2020.js";
import Ajv2020 from "npm:ajv/dist/2020.js";
import addFormats from "npm:ajv-formats@2";
import { expect } from "@std/expect";

import schema from "../schemas/report.schema.json" with { type: "json" };
import validExample from "../schemas/examples/report.valid.minimal.json" with {
  type: "json",
};
import invalidExample from "../schemas/examples/report.invalid.missing-required.json" with {
  type: "json",
};

import type { FileValidation } from "../src/api/public_api.ts";
import { buildReport } from "../src/report/buildReport.ts";

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

  const hasRequired = validate.errors.some((e) => e.keyword === "required");
  if (!hasRequired) {
    throw new Error("Expected at least one 'required' schema error.");
  }
});

Deno.test("implementation (Ajv): buildReport output conforms to report schema", () => {
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
            // buildReport treats validation.errors opaquely; keep shape permissive in test data
            errors: [{ code: "RULE_X", message: "Y not allowed" }] as unknown as ErrorObject[],
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
});
