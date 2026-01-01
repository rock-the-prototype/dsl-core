import { parseArgs } from "jsr:@std/cli/parse-args";
import { cmdValidate } from "./commands/validate.ts";
import { cmdInspect } from "./commands/inspect.ts";

const args = parseArgs(Deno.args, {
  boolean: ["json", "pretty"],
  alias: { j: "json", p: "pretty" },
});

const [command, ...rest] = args._.map(String);
const target = rest.join(" ").trim();

if (!command) {
  console.error(`Usage:
  dsl inspect ["DSL statement"]     # or via STDIN
  dsl validate <file|dir> [--json] [--pretty]`);
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

  default:
    console.error(`Unknown command: ${command}`);
    Deno.exit(2);
}
