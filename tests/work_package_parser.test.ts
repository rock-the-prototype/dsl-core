import { assertEquals, assertThrows } from "@std/assert";
import { parseWorkPackage } from "../src/parser/work_package_parser.ts";

Deno.test("Parsing a valid work package block produces the expected atom", async () => {
  const input = await Deno.readTextFile(
    new URL("./fixtures/work-packages/wp-001.valid.dsl", import.meta.url),
  );
  const expected = JSON.parse(
    await Deno.readTextFile(
      new URL(
        "./fixtures/work-packages/wp-001.normalized.json",
        import.meta.url,
      ),
    ),
  );

  const actual = parseWorkPackage(input);

  assertEquals(actual, expected);
});

Deno.test("Rejects missing required work package fields", () => {
  const invalid = `WP WP-002
TYPE task
TITLE Missing priority example.
STATUS draft`;

  assertThrows(() => parseWorkPackage(invalid), Error);
});
