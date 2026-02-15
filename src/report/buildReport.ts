/*
 * Copyright 2026 Sascha Block
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

import type { FileValidation, StatementValidation } from "../api/public_api.ts";

/**
 * Canonical report shape for schemas/report.schema.json
 */
export interface DslCoreReport {
  contract: {
    name: "dsl-core.report";
    version: string; // SemVer
    schema: "schemas/report.schema.json";
  };
  engine: {
    name: "dsl-core";
    version: string;
    git?: {
      sha: string;
      ref?: string;
    };
  };
  generatedAt: string; // ISO date-time
  target: {
    path: string;
    kind: "file" | "dir" | "stdin";
  };
  summary: {
    files: number;
    statements: number;
    valid: number;
    invalid: number;
    parseErrors: number;
  };
  files: Array<{
    path: string;
    counts: {
      statements: number;
      valid: number;
      invalid: number;
      parseErrors: number;
    };
    statements: Array<{
      source: string;
      input?: string;
      atom?: unknown;
      validation?: { valid: boolean; errors: unknown[] };
      error?: unknown;
      extensions?: Record<string, unknown>;
    }>;
  }>;
}

export interface BuildReportOptions {
  targetPath: string;
  targetKind?: "file" | "dir" | "stdin";
  engineVersion: string;
  gitSha?: string;
  gitRef?: string;

  /**
   * Contract version for schemas/report.schema.json.
   * Keep stable; bump only on breaking contract changes.
   */
  contractVersion?: string;

  /**
   * Injectable time for deterministic tests.
   * Defaults to new Date().
   */
  now?: Date;
}

function inferTargetKind(targetPath: string): "file" | "dir" | "stdin" {
  if (targetPath === "<stdin>") return "stdin";
  if (targetPath.endsWith(".dsl")) return "file";
  return "dir";
}

function countStatements(statements: StatementValidation[]) {
  const parseErrors = statements.filter((s: any) => !!s.error).length;
  const invalid =
    statements.filter((s: any) => s.validation && !s.validation.valid).length;
  const valid =
    statements.filter((s: any) => s.validation && s.validation.valid).length;

  return {
    statements: statements.length,
    valid,
    invalid,
    parseErrors,
  };
}

/**
 * buildReport()
 *
 * Deterministically transforms the output of validatePath() into the canonical
 * report format defined by schemas/report.schema.json.
 *
 * This is a pure function: no IO, no global state.
 */
export function buildReport(
  files: FileValidation[],
  opts: BuildReportOptions,
): DslCoreReport {
  const now = opts.now ?? new Date();
  const contractVersion = opts.contractVersion ?? "1.0.0";

  const reportFiles: DslCoreReport["files"] = files.map((f) => {
    const counts = countStatements(f.statements);

    const statements = f.statements.map((s: any) => ({
      source: f.path,
      input: s.input,
      atom: s.atom,
      validation: s.validation
        ? {
          valid: !!s.validation.valid,
          errors: Array.isArray(s.validation.errors) ? s.validation.errors : [],
        }
        : undefined,
      error: s.error,
      extensions: s.extensions,
    }));

    return {
      path: f.path,
      counts,
      statements,
    };
  });

  const summary = reportFiles.reduce(
    (acc, f) => {
      acc.files += 1;
      acc.statements += f.counts.statements;
      acc.valid += f.counts.valid;
      acc.invalid += f.counts.invalid;
      acc.parseErrors += f.counts.parseErrors;
      return acc;
    },
    { files: 0, statements: 0, valid: 0, invalid: 0, parseErrors: 0 },
  );

  const targetKind = opts.targetKind ?? inferTargetKind(opts.targetPath);

  return {
    contract: {
      name: "dsl-core.report",
      version: contractVersion,
      schema: "schemas/report.schema.json",
    },
    engine: {
      name: "dsl-core",
      version: opts.engineVersion,
      ...(opts.gitSha
        ? {
          git: {
            sha: opts.gitSha,
            ...(opts.gitRef ? { ref: opts.gitRef } : {}),
          },
        }
        : {}),
    },
    generatedAt: now.toISOString(),
    target: {
      path: opts.targetPath,
      kind: targetKind,
    },
    summary,
    files: reportFiles,
  };
}
