/*
 * Copyright 2025 Sascha Block
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

// src/server/server.ts

import { serve } from "https://deno.land/std/http/server.ts";
import { handleApiV1Request } from "./api_v1.ts";
import { handlePlayground } from "./playground_handler.ts";

console.log("Starting DSL Core Server…");

await serve(async (req: Request) => {
  // 1) API v1 (REST endpoints)
  const apiResponse = await handleApiV1Request(req);
  if (apiResponse) return apiResponse;

  // 2) Playground (HTML + POST /api/parse)
  const playgroundResponse = await handlePlayground(req);
  if (playgroundResponse) return playgroundResponse;

  // 3) Fallback — Nothing matched
  return new Response("Not Found", { status: 404 });
});
