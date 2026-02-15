#!/usr/bin/env -S deno run --no-prompt

/*
 * Copyright 2025 Sascha Block
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

// cli/src/commands/inspect.ts

import { validateText } from "../../../src/mod.ts";

async function readStdin(): Promise<string> {
  const decoder = new TextDecoder();
  const chunks: Uint8Array[] = [];
  for await (const chunk of Deno.stdin.readable) chunks.push(chunk);

  const total = chunks.reduce((s, c) => s + c.length, 0);
  const out = new Uint8Array(total);
  let off = 0;
  for (const c of chunks) {
    out.set(c, off);
    off += c.length;
  }

  return decoder.decode(out);
}

export async function cmdInspect(inputArg?: string) {
  let input = (inputArg ?? "").trim();

  if (!input) {
    console.log("Please enter your DSL requirement (end with Ctrl+D):\n");
    input = (await readStdin()).trim();
  }

  if (!input) {
    console.error("❌ No input provided.");
    Deno.exit(2);
  }

  const results = await validateText(input, "<stdin>");
  console.log(JSON.stringify(results, null, 2));

  const hasParserErrors = results.some((r) => r.error);
  const hasInvalid = results.some((r) => r.validation && !r.validation.valid);

  Deno.exit(hasParserErrors ? 2 : hasInvalid ? 1 : 0);
}
