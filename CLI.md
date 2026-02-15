# Reference CLI (dsl-core)

This folder contains a **minimal reference CLI** for `dsl-core`. It is a thin
adapter over the engine and exists to provide deterministic validation and
machine-consumable outputs for CI and tooling.

## Commands

### `dsl inspect`

Parses and validates a single requirement statement and prints the parsed atom
and validation result.

Examples:

- `deno task -C cli dsl inspect "As a system, I must ... ."`
- `echo "As a system, I must ... ." | deno task -C cli dsl inspect`

Exit codes:

- `0` valid
- `1` invalid (rule violations)
- `2` tool/parsing error

### `dsl validate <file|dir>`

Validates one `.dsl` file or all `.dsl` files in a directory.

Examples:

- `deno task -C cli dsl validate ./requirements/example.dsl`
- `deno task -C cli dsl validate ./requirements --json --pretty`

Exit codes:

- `0` all valid
- `1` at least one invalid requirement
- `2` tool/parsing error

## Notes

- This CLI is a **reference tool**, not an orchestrator.
- It must only import the engine via `src/mod.ts` to keep refactors safe.
