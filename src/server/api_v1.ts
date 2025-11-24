// src/server/api_v1.ts
//
// Versioned HTTP API for the Audit-by-Design DSL (v1)
// Exposes normalized, parsed and validated Requirement Atoms as JSON.

import { normalizeInput } from "../parser/normalizer.ts";
import { parseRequirement } from "../parser/parser.ts";
import { validateRequirementAtom } from "../validator/validator.ts";

export interface RequirementAtom {
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

/**
 * Central entry point for all /v1/* API requests.
 * Returns `null` if the request is not an /v1 route,
 * so that the main server can fall back to other handlers (e.g. HTML playground).
 */
export async function handleApiV1Request(
  req: Request,
): Promise<Response | null> {
  const url = new URL(req.url);

  // Only handle /v1/* paths here
  if (!url.pathname.startsWith("/v1/")) {
    return null;
  }

  if (req.method !== "POST") {
    return json(
      { error: "Only POST is allowed for /v1 endpoints." },
      405,
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json(
      { error: "Request body must be valid JSON." },
      400,
    );
  }

  // All endpoints expect at least an "input" or an "atom"
  try {
    switch (url.pathname) {
      case "/v1/normalize":
        return handleNormalize(body);
      case "/v1/parse":
        return handleParse(body);
      case "/v1/validate":
        return handleValidate(body);
      case "/v1/atom":
        return handleAtom(body);
      default:
        return json({ error: "Unknown /v1 endpoint." }, 404);
    }
  } catch (err) {
    console.error("[/v1] Unhandled error:", err);
    return json(
      {
        error: "Internal server error while processing DSL input.",
      },
      500,
    );
  }
}

/* ------------------------------------------------------------------ */
/*  Endpoint handlers                                                  */
/* ------------------------------------------------------------------ */

function handleNormalize(body: unknown): Response {
  const input = ensureInput(body);
  const normalized = normalizeInput(input);

  return json({
    input,
    normalized,
  });
}

function handleParse(body: unknown): Response {
  const input = ensureInput(body);
  const normalized = normalizeInput(input);
  const atom = parseRequirement(normalized) as RequirementAtom;

  return json({
    input,
    normalized,
    atom,
  });
}

function handleValidate(body: unknown): Response {
  const atom = ensureAtom(body);
  const validation = validateRequirementAtom(atom) as ValidationResult;

  return json({
    atom,
    validation,
  });
}

function handleAtom(body: unknown): Response {
  const input = ensureInput(body);
  const normalized = normalizeInput(input);
  const atom = parseRequirement(normalized) as RequirementAtom;
  const validation = validateRequirementAtom(atom) as ValidationResult;

  return json({
    input,
    normalized,
    atom,
    validation,
  });
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*", // future-proof for separate UIs
    },
  });
}

function ensureInput(body: unknown): string {
  if (
    !body ||
    typeof body !== "object" ||
    typeof (body as { input?: unknown }).input !== "string"
  ) {
    throw new HttpError(
      400,
      'Field "input" (string) is required in request body.',
    );
  }
  return (body as { input: string }).input;
}

function ensureAtom(body: unknown): RequirementAtom {
  if (!body || typeof body !== "object") {
    throw new HttpError(
      400,
      'Field "atom" (RequirementAtom) is required in request body.',
    );
  }
  const atom = (body as { atom?: unknown }).atom;
  if (!atom || typeof atom !== "object") {
    throw new HttpError(
      400,
      'Field "atom" (RequirementAtom) is required in request body.',
    );
  }
  return atom as RequirementAtom;
}

class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}
