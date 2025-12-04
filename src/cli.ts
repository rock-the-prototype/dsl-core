#!/usr/bin/env -S deno run --no-prompt

/*
 * Copyright 2025 Sascha Block
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

// src/cli.ts
import { parseRequirement } from "./parser/parser.ts";
import { RequirementAtom } from "./types/RequirementEntity.ts";
import { validateRequirement } from "./validator/validator.ts";

// Small helper function: reads entire STDIN as a string
async function readStdin(): Promise<string> {
  const decoder = new TextDecoder();
  const chunks: Uint8Array[] = [];

  for await (const chunk of Deno.stdin.readable) {
    chunks.push(chunk);
  }

  return decoder.decode(Buffer.concat(chunks));
}

// Polyfill, because buffer does not automatically exist in Deno
const Buffer = {
  concat(chunks: Uint8Array[]): Uint8Array {
    const totalLength = chunks.reduce((sum, c) => sum + c.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const c of chunks) {
      result.set(c, offset);
      offset += c.length;
    }
    return result;
  },
};

async function main() {
  const [command, ...rest] = Deno.args;

  if (command !== "normalize") {
    console.error("Usage: deno run ... src/cli.ts normalize [\"DSL statement\"]");
    Deno.exit(1);
  }

  // 1) Input: either from arguments or from STDIN
  let input = rest.join(" ").trim();
  if (!input) {
    console.log("Please enter your DSL requirement (end with Ctrl+D):\n");
    input = (await readStdin()).trim();
  }

  if (!input) {
    console.error("❌ No input provided.");
    Deno.exit(1);
  }

  try {
    // 2) Parsing in RequirementAtom
    const atom: RequirementAtom = parseRequirement(input);

    // 3) Validate
    const validation = await validateRequirement(atom);
    // acceptance: { valid: boolean; errors: string[] }

    // 4) Output result
    console.log("\n✅ Parsed Requirement Atom:");
    console.log(JSON.stringify(atom, null, 2));

    if (validation.valid) {
      console.log("\n✅ Validation: OK (no schema violations)");
    } else {
      console.log("\n⚠ Validation: FAILED");
      for (const err of validation.errors) {
        console.log("  - " + err);
      }
      Deno.exit(1);
    }
  } catch (err) {
    console.error("\n❌ Parsing or validation failed:\n");
    console.error(err instanceof Error ? err.message : String(err));
    Deno.exit(1);
  }
}

if (import.meta.main) {
  main();
}