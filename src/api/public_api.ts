// src/api/public_api.ts

import { parseRequirement } from "../parser/parser.ts";
import { validateRequirement } from "../validation/validator.ts";
import type { RequirementAtom } from "../types/RequirementEntity.ts";
import type { ValidationResult } from "../validation/validator.ts";

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
