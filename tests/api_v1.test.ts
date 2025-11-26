import { handleApiV1Request } from "../src/server/api_v1.ts";
import { assertEquals, assert } from "https://deno.land/std/assert/mod.ts";

// Helper to simulate requests
function request(path: string, method = "POST", input?: string, crash = false): Request {
  const url = `https://example.com${path}`;
  if (crash) {
    // produce a request object that will cause a crash in the parser
    return new Request(url, { method, body: "DIRTY" });
  }
  const body = input ? JSON.stringify({ input }) : JSON.stringify({});
  return new Request(url, { method, body, headers: { "Content-Type": "application/json" } });
}

Deno.test("400 – Rejects invalid body (no input field)", async () => {
  const req = request("/v1/normalize", "POST");
  try {
    await handleApiV1Request(req);
  } catch (err) {
    assert(err instanceof Error);
    assertEquals((err as any).status, 400);
  }
});

Deno.test("405 – Rejects non-POST methods", async () => {
  const req = request("/v1/parse", "GET", "I must not matter");
  const res = await handleApiV1Request(req);
  assert(res);
  const { error } = await res.json();
  assert(error.includes("Only POST"));
  assertEquals(res.status, 405);
});

Deno.test("404 – Rejects unknown endpoint", async () => {
  const req = request("/v1/does-not-exist", "POST", "As a system, I must exist.");
  const res = await handleApiV1Request(req);
  assert(res);
  const { error } = await res.json();
  assert(error.includes("Unknown"));
  assertEquals(res.status, 404);
});

Deno.test("400 – Rejects missing 'input' field", async () => {
  const req = request("/v1/parse", "POST", undefined);
  const res = await handleApiV1Request(req);
  assert(res);
  const { error } = await res.json();
  assert(error.includes('Field "input"'));
  assertEquals(res.status, 400);
});

Deno.test("500 – Surfaces internal server crash", async () => {
  // crash simulation: parser throws, but caught and returned as 500
  const req = request("/v1/parse", "POST", "trigger crash", true);
  const res = await handleApiV1Request(req);
  assert(res);
  const { error } = await res.json();
  assert(error.includes("Internal server error"));
  assertEquals(res.status, 500);
});
