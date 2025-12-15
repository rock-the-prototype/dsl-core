import { checkActor } from "../actor";

const baseAfo = {
    actor: "system",
    modality: "must",
    action: "validate the access token"
};

test("accepts explicit actor", () => {
    const errors = checkActor(baseAfo as any);
    expect(errors).toHaveLength(0);
});

test("rejects placeholder actor", () => {
    const errors = checkActor({ ...baseAfo, actor: "tbd" } as any);
    expect(errors).toHaveLength(1);
    expect(errors[0].ruleId).toBe("AFO-ACTOR-001");
});