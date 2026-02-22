/*
 * Copyright 2025 Sascha Block
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

// tests/api_v1.test.ts

import { handleApiV1Request } from "../src/server/api_v1.ts";
import { assert, assertEquals } from "@std/assert";

// Helper to build requests
function makeRequest(
  path: string,
  opts: {
    method?: string;
    body?: unknown;
    rawBody?: string;
  } = {},
): Request {
  const url = `https://example.com${path}`;
  const method = (opts.method ?? "POST").toUpperCase();

  // Roh-Body (für "kein JSON"-Fall)
  if (opts.rawBody !== undefined) {
    // GET/HEAD dürfen keinen Body haben
    if (method === "GET" || method === "HEAD") {
      return new Request(url, { method });
    }
    return new Request(url, { method, body: opts.rawBody });
  }

  // GET/HEAD dürfen keinen Body haben
  if (method === "GET" || method === "HEAD") {
    return new Request(url, { method });
  }

  const headers = { "Content-Type": "application/json" };
  const body = JSON.stringify(
    opts.body !== undefined ? opts.body : {},
  );

  return new Request(url, { method, headers, body });
}

Deno.test("400 – body is not valid JSON", async () => {
  const req = makeRequest("/v1/normalize", {
    rawBody: "NOT_JSON",
    method: "POST",
  });

  const res = await handleApiV1Request(req);
  assert(res);
  assertEquals(res.status, 400);

  const data = await res.json();
  assertEquals(data.error, "❌ Request body must be valid JSON.");
});

Deno.test("405 – rejects non-POST methods", async () => {
  const req = makeRequest("/v1/parse", { method: "GET" });
  const res = await handleApiV1Request(req);

  assert(res);
  assertEquals(res.status, 405);

  const data = await res.json();
  assert(data.error.includes("Only POST"));
});

Deno.test("404 – rejects unknown endpoint", async () => {
  const req = makeRequest("/v1/does-not-exist", {
    body: { input: "As a system, I must exist." },
  });

  const res = await handleApiV1Request(req);

  assert(res);
  assertEquals(res.status, 404);

  const data = await res.json();
  assert(data.error.includes("Unknown /v1 endpoint"));
});

Deno.test('400 – rejects missing "input" field', async () => {
  const req = makeRequest("/v1/parse", {
    body: {}, // kein input
  });

  const res = await handleApiV1Request(req);

  assert(res);
  assertEquals(res.status, 400);

  const data = await res.json();
  assert(data.error.includes('Field "input" (string) is required'));
});

Deno.test("500 – surfaces unexpected internal error", async () => {
  // Bewusst ungültiger DSL-String ohne abschließenden Punkt:
  // parseRequirement wirft NormalizationError -> API antwortet 500
  const req = makeRequest("/v1/parse", {
    body: { input: "Totally invalid DSL without actor" },
  });

  const res = await handleApiV1Request(req);

  assert(res);
  assertEquals(res.status, 500);

  const data = await res.json();
  assert(data.error.includes("Internal server error"));
});
