/*
 * Contract test: generated report must conform to schemas/report.schema.json
 *
 * This is a deliberately small JSON-Schema subset validator:
 * - type, required, properties, items, enum, anyOf
 * - additionalProperties (object)
 *
 * Enough for our report contract.
 */

import schema from "../schemas/report.schema.json" assert { type: "json" };
import { buildReport } from "../src/report/buildReport.ts";

type Json = null | boolean | number | string | Json[] | { [k: string]: Json };

function isObject(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

function validateSchemaSubset(s: any, data: any, path = "$", errors: string[] = []): string[] {
  // anyOf
  if (Array.isArray(s.anyOf)) {
    const anyOk = s.anyOf.some((opt: any) => validateSchemaSubset(opt, data, path, []).length === 0);
    if (!anyOk) errors.push(`${path}: does not match anyOf`);
    return errors;
  }

  // enum
  if (Array.isArray(s.enum)) {
    const ok = s.enum.some((v: any) => Object.is(v, data));
    if (!ok) errors.push(`${path}: not in enum`);
    return errors;
  }

  // type
  if (s.type) {
    const t = s.type;
    const ok =
      (t === "object" && isObject(data)) ||
      (t === "array" && Array.isArray(data)) ||
      (t === "string" && typeof data === "string") ||
      (t === "number" && typeof data === "number") ||
      (t === "integer" && Number.isInteger(data)) ||
      (t === "boolean" && typeof data === "boolean") ||
      (t === "null" && data === null);
    if (!ok) {
      errors.push(`${path}: expected type ${t}`);
      return errors;
    }
  }

  // object: properties + required + additionalProperties
  if (s.type === "object" && isObject(data)) {
    const req: string[] = Array.isArray(s.required) ? s.required : [];
    for (const k of req) {
      if (!(k in data)) errors.push(`${path}: missing required property '${k}'`);
    }

    const props: Record<string, any> = isObject(s.properties) ? s.properties : {};
    for (const [k, v] of Object.entries(props)) {
      if (k in data) validateSchemaSubset(v, (data as any)[k], `${path}.${k}`, errors);
    }

    if (s.additionalProperties === false) {
      for (const k of Object.keys(data)) {
        if (!(k in props)) errors.push(`${path}: additional property '${k}' not allowed`);
      }
    }
  }

  // array: items
  if (s.type === "array" && Array.isArray(data)) {
    if (s.items) {
      for (let i = 0; i < data.length; i++) {
        validateSchemaSubset(s.items, data[i], `${path}[${i}]`, errors);
      }
    }
  }

  // minimum
  if (typeof s.minimum === "number" && typeof data === "number") {
    if (data < s.minimum) errors.push(`${path}: number below minimum ${s.minimum}`);
  }

  // format(date-time) is not enforced here (intentionally MVP)

  // const
  if (typeof s.const !== "undefined") {
    if (!Object.is(s.const, data)) errors.push(`${path}: expected const ${JSON.stringify(s.const)}`);
  }

  return errors;
}

Deno.test("report conforms to schemas/report.schema.json", () => {
  const files = [
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
          validation: { valid: false, errors: [{ code: "RULE_X", message: "Y not allowed" }] },
        },
        {
          input: "broken input",
          error: { name: "NormalizationError", message: "Invalid requirement structure" },
        },
      ],
    },
  ] as any;

  const report = buildReport(files, {
    targetPath: "example.dsl",
    engineVersion: "0.0.0-dev",
    now: new Date("2026-01-02T00:00:00.000Z"),
  });

  const errs = validateSchemaSubset(schema as Json, report as Json);
  if (errs.length) {
    throw new Error("Schema violations:\n" + errs.join("\n"));
  }
});
