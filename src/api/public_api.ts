/*
 * Copyright 2026 Sascha Block
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

// src/api/public_api.ts

import { parseRequirement } from "../parser/parser.ts";
import { validateRequirement } from "../validation/validator.ts";
import type { RequirementAtom } from "../types/RequirementAtom.ts";
import type { ValidationResult } from "../validation/validator.ts";
import { buildReport } from "../report/buildReport.ts";
import type { DslCoreReport } from "../report/buildReport.ts";

const ENGINE_VERSION = "0.0.0-dev";

export async function generateReport(
  targetPath: string,
  opts?: { engineVersion?: string; gitSha?: string; gitRef?: string; now?: Date },
): Promise<DslCoreReport> {
  const files = await validatePath(targetPath);

  return buildReport(files, {
    targetPath,
    engineVersion: opts?.engineVersion ?? ENGINE_VERSION,
    gitSha: opts?.gitSha,
    gitRef: opts?.gitRef,
    now: opts?.now,
  });
}

export type StatementValidation = {
  input: string;
  atom?: RequirementAtom;
  validation?: ValidationResult;
  error?: { name: string; message: string };
};

export type FileValidation = {
  path: string;
  statements: StatementValidation[];
};

function splitStatements(content: string): string[] {
  // MVP: 1 requirement per line (empty lines ignored)
  // Later: smarter splitting (e.g. handle multi-line statements) 
  return content
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
}

export async function validateText(input: string, source = "<stdin>"): Promise<StatementValidation[]> {
  const lines = splitStatements(input);

  // If input is a single statement (no newline), still works.
  const statements = lines.length > 0 ? lines : [input.trim()].filter(Boolean);

  return statements.map((stmt) => {
    try {
      const atom = parseRequirement(stmt);
      const validation = validateRequirement(atom);
      return { input: stmt, atom, validation };
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      return { input: stmt, error: { name: e.name, message: e.message } };
    }
  });
}

export async function validateFile(filePath: string): Promise<FileValidation> {
  const input = await Deno.readTextFile(filePath);
  const statements = await validateText(input, filePath);
  return { path: filePath, statements };
}

export async function validatePath(path: string): Promise<FileValidation[]> {
  const stat = await Deno.stat(path);

  if (stat.isFile) {
    return [await validateFile(path)];
  }

  const out: FileValidation[] = [];
  for await (const entry of Deno.readDir(path)) {
    if (entry.isFile && entry.name.endsWith(".dsl")) {
      const p = `${path}/${entry.name}`;
      out.push(await validateFile(p));
    }
  }
  return out;
}
