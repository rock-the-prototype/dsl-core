import { parseRequirement } from "../../src/parser/parser.ts";

test("rejects non-binding modality", () => {
    expect(() =>
        parseRequirement("System should validate the token.")
    ).toThrow();
});

test("rejects missing modality", () => {
    expect(() =>
        parseRequirement("System validate the token.")
    ).toThrow();
});