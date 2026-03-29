import { assert, assertEquals } from "@std/assert";
import { parseWorkPackage } from "../src/parser/work_package_parser.ts";
import { validateWorkPackage } from "../src/validation/work_package_validator.ts";
import type { WorkPackageAtom } from "../src/types/WorkPackageAtom.ts";

Deno.test("Validator accepts a valid WorkPackageAtom", async () => {
  const input = await Deno.readTextFile(
    new URL("./fixtures/work-packages/wp-001.valid.dsl", import.meta.url),
  );
  const atom = parseWorkPackage(input);

  const result = validateWorkPackage(atom);

  assert(result.valid);
  assertEquals(result.errors.length, 0);
});

Deno.test("Validator rejects invalid relation type", () => {
  const atom: WorkPackageAtom = {
    id: "WP-003",
    workType: "feature",
    title: "Invalid relation type example.",
    status: "draft",
    priority: "high",
    relations: [{ type: "requires", target: "ADR-001" }],
    extensions: {},
  };

  const result = validateWorkPackage(atom);

  assertEquals(result.valid, false);
  assert(
    result.errors.some((error) =>
      error.ruleId === "WP.WORK_PACKAGE.RELATION.001"
    ),
  );
});

Deno.test("Validator rejects invalid estimate format", () => {
  const atom: WorkPackageAtom = {
    id: "WP-004",
    workType: "task",
    title: "Invalid estimate example.",
    status: "ready",
    priority: "medium",
    estimate: "0d",
    extensions: {},
  };

  const result = validateWorkPackage(atom);

  assertEquals(result.valid, false);
  assert(
    result.errors.some((error) =>
      error.ruleId === "WP.WORK_PACKAGE.ESTIMATE.001"
    ),
  );
});
