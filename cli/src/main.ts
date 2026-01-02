/*
 * Copyright 2026 Sascha Block
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

import { parseArgs } from "jsr:@std/cli/parse-args";
import { cmdValidate } from "./commands/validate.ts";
import { cmdInspect } from "./commands/inspect.ts";
import { cmdReport } from "./commands/report.ts";

const args = parseArgs(Deno.args, {
  boolean: ["json", "pretty"],
  string: ["out"],
  alias: { j: "json", p: "pretty", o: "out" },
});

const [command, ...rest] = args._.map(String);
const target = rest.join(" ").trim();

if (!command) {
  console.error(`Usage:
  dsl inspect ["DSL statement"]             # or via STDIN
  dsl validate <file|dir> [--json] [--pretty]
  dsl report <file|dir> [--pretty] [--out report.json]`);
  Deno.exit(2);
}

switch (command) {
  case "inspect":
    await cmdInspect(target || undefined);
    break;

  case "validate":
    if (!target) {
      console.error("Missing <file|dir>.");
      Deno.exit(2);
    }
    await cmdValidate(target, { json: !!args.json, pretty: !!args.pretty });
    break;

  case "report":
    if (!target) {
      console.error("Missing <file|dir>.");
      Deno.exit(2);
    }
    await cmdReport(target, { pretty: !!args.pretty, out: args.out ? String(args.out) : undefined });
    break;

  default:
    console.error(`Unknown command: ${command}`);
    Deno.exit(2);
}
