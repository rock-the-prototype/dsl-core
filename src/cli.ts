#!/usr/bin/env -S deno run --no-prompt

/*
 * Copyright 2025 Sascha Block
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

import { handleApiV1Request } from "./server/api_v1.ts";

async function readStdin(): Promise<string> {
  const buf = new Uint8Array(1024 * 64);
  const n = await Deno.stdin.read(buf);
  const data = buf.subarray(0, n ?? 0);
  return new TextDecoder().decode(data).trim();
}

async function normalize(inputPath?: string) {
  try {
    const text = inputPath ? await Deno.readTextFile(inputPath) : await readStdin();
    const req = new Request("https://cli.local/v1/normalize", {
      method: "POST",
      body: JSON.stringify({ input: text }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await handleApiV1Request(req);
    const json = await res.json();
    console.log(JSON.stringify(json, null, 2));
    Deno.exit(0);
  } catch (e) {
    console.error(JSON.stringify({ error: "ParserError", message: String(e) }, null, 2));
    Deno.exit(2);
  }
}

async function validate(folderOrFile?: string) {
  try {
    if (!folderOrFile) throw "No path provided";
    const stat = await Deno.stat(folderOrFile);

    const targets: string[] = stat.isDirectory
      ? Array.from(Deno.readDirSync(folderOrFile))
          .filter(f => f.name.endsWith(".json"))
          .map(f => `${folderOrFile}/${f.name}`)
      : [folderOrFile];

    for (const t of targets) {
      const body = await Deno.readTextFile(t);
      const req = new Request("https://cli.local/v1/validate", {
        method: "POST",
        body,
        headers: { "Content-Type": "application/json" },
      });
      const res = await handleApiV1Request(req);
      if (!res.ok) {
        const err = await res.json();
        console.error(JSON.stringify(err, null, 2));
        Deno.exit(1);
      }
    }

    console.log(JSON.stringify({ status: "ValidationPassed", files_checked: targets.length }, null, 2));
    Deno.exit(0);
  } catch (e) {
    console.error(JSON.stringify({ error: "ValidationError", message: String(e) }, null, 2));
    Deno.exit(1);
  }
}

function help() {
  console.log(`Usage:
  afo normalize [file.txt]
  afo validate [folder|file.json]

Exit codes:
  0 = OK
  1 = Validation Errors
  2 = Parser/Unexpected Error`);
  Deno.exit(0);
}

async function main() {
  const [cmd, target] = Deno.args;

  switch (cmd) {
    case "normalize": await normalize(target); break;
    case "validate":  await validate(target);  break;
    default:          help();
  }
}

if (import.meta.main) {
  main();
}
