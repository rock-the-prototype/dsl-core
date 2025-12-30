/*
 * Copyright 2025 Sascha Block
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

// src/validator/public_api.ts

import { parseDsl } from "../parser/parser.ts";
import { normalize } from "../validation/normalize.ts"; // falls das bei euch so heißt/liegt
import { validateRequirement } from "../validator/validator.ts";
import type { RequirementAtom } from "../types/RequirementAtom.ts";
import type { ValidationResult } from "../validator/validator.ts";

// 1) Validates text → 1..n RequirementAtoms
export async function validateText(input: string, source = "<stdin>") {
  const parsed = parseDsl(input, source);

  // Parser can deliver 1 atom or list to you – we normalize to array
  const atoms: RequirementAtom[] = Array.isArray(parsed) ? parsed : [parsed];

  // Optional: normalize per atom
  const normalizedAtoms = atoms.map((a) => normalize(a));

  // Rule-based validation per atom
  const results = normalizedAtoms.map((atom) => ({
    atom,
    result: validateRequirement(atom),
  }));

  return results;
}

export async function validateFile(filePath: string) {
  const input = await Deno.readTextFile(filePath);
  return validateText(input, filePath);
}

export async function validatePath(path: string) {
  const stat = await Deno.stat(path);

  if (stat.isFile) {
    return [{ path, results: await validateFile(path) }];
  }

  const out: Array<{ path: string; results: Array<{ atom: RequirementAtom; result: ValidationResult }> }> = [];

  for await (const entry of Deno.readDir(path)) {
    if (entry.isFile && entry.name.endsWith(".dsl")) {
      const p = `${path}/${entry.name}`;
      out.push({ path: p, results: await validateFile(p) });
    }
  }

  return out;
}
Path(path);
  return buildReport(results); // Here we create our canonical report object.
}
