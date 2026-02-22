/*
 * Copyright 2025 Sascha Block
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

// src/server/api_v1.ts
//
// Versioned HTTP API for the Audit-by-Design DSL (v1)
// Exposes normalized, parsed and validated Requirement Atoms as JSON.

import { normalizeInput } from "../parser/normalizer.ts";
import { parseRequirement } from "../parser/parser.ts";
import { validateRequirement } from "../validation/validator.ts";

export interface Requirement {
  actor: string;
  modality: "must" | "must not";
  action: string;
  condition?: string;
  result?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export async function handleApiV1Request(
  req: Request,
): Promise<Response | null> {
  const url = new URL(req.url);

  if (!url.pathname.startsWith("/v1/")) {
    return null;
  }

  if (req.method !== "POST") {
    return json(
      { success: false, error: "❌ Only POST is allowed for /v1 endpoints." },
      405,
    );
  }

  let body: { input?: string; atom?: unknown } = {};
  try {
    body = await req.json();
  } catch {
    return json(
      { success: false, error: "❌ Request body must be valid JSON." },
      400,
    );
  }

  try {
    switch (url.pathname) {
      case "/v1/normalize": {
        const input = ensureString(body.input);
        const normalized = normalizeInput(input);
        return json({ success: true, input, normalized });
      }

      case "/v1/parse": {
        const input = ensureString(body.input);
        const normalized = normalizeInput(input);
        const atom = parseRequirement(normalized);
        return json({ success: true, input, normalized, atom });
      }

      case "/v1/validate": {
        const atom = ensureObject<Requirement>(body.atom);
        const validation = validateRequirement(atom);
        return json({ success: validation.valid, atom, validation });
      }

      case "/v1/atom": {
        const input = ensureString(body.input);
        const normalized = normalizeInput(input);
        const atom = parseRequirement(normalized);
        const validation = validateRequirement(atom);
        return json({
          success: validation.valid,
          input,
          normalized,
          atom,
          validation,
        });
      }

      default:
        return json(
          { success: false, error: "❌ Unknown /v1 endpoint." },
          404,
        );
    }
  } catch (err) {
    if (err instanceof HttpError) {
      return json({ error: err.message }, err.status);
    }
    console.error("[/v1] Unhandled error:", err);
    return json(
      {
        success: false,
        error: "❌ Internal server error while processing DSL input.",
      },
      500,
    );
  }
}

function ensureString(value: unknown): string {
  if (!value || typeof value !== "string") {
    throw new HttpError(
      400,
      '❌ Field "input" (string) is required in request body.',
    );
  }
  return value;
}

function ensureObject<T>(value: unknown): T {
  if (!value || typeof value !== "object") {
    throw new HttpError(
      400,
      '❌ Field "atom" (object) is required in request body.',
    );
  }
  return value as T;
}

class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
