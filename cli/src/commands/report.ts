/*
 * Copyright 2026 Sascha Block
 * Licensed under the Apache License, Version 2.0
 */

import { generateReport } from "../../../src/mod.ts";

export async function cmdReport(
  target: string,
  opts: { pretty: boolean; out?: string },
) {
  // MVP: Engine version does not (yet) come automatically -> can be read later from git tag / deno.json.
  const report = await generateReport(target, { engineVersion: "0.0.0-dev" });

  const json = JSON.stringify(report, null, opts.pretty ? 2 : 0);

  if (opts.out) {
    await Deno.writeTextFile(opts.out, json);
    console.log(`Wrote report to ${opts.out}`);
    return;
  }

  console.log(json);
}
