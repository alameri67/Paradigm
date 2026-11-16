import { describe, expect, it } from "vitest";
import raw from "@/data/sim-data.json";
import { briefText } from "./brief";
import { createSim, traitDistance } from "./engine";
import { simDataSchema } from "./schema";
import { stateFromParams, stateToParams } from "./url-state";

const data = simDataSchema.parse(raw);
const sim = createSim(data);

describe("sample data", () => {
  it("passes the schema", () => {
    expect(data.sectors).toHaveLength(20);
    expect(data.personas).toHaveLength(16);
  });

  it("rejects personas that point at unknown sectors or moods", () => {
    const bad = structuredClone(raw) as typeof raw;
    bad.personas[0].sectorId = "nope";
    bad.personas[0].responses.L0.mood = "ecstatic";
    const r = simDataSchema.safeParse(bad);
    expect(r.success).toBe(false);
    expect(r.error!.issues.map((i) => i.message)).toEqual(
      expect.arrayContaining(['Unknown sector "nope"', 'Unknown mood "ecstatic"']),
    );
  });
});

describe("traitDistance", () => {
  it("counts ordinal steps and treats missing values as full weight", () => {
    expect(traitDistance(data.traits, { income: 0, competence: 0, politics: 0, stage: 0 }, { income: 2, competence: 0, politics: 1, stage: 0 })).toBe(3);
    expect(traitDistance(data.traits, { income: 0 }, { income: 0 })).toBe(3);
  });

  it("uses equality for non-ordinal traits", () => {
    const traits = [{ key: "a", label: "A", options: ["x", "y", "z"], ordinal: false, weight: 2 }];
    expect(traitDistance(traits, { a: 0 }, { a: 2 })).toBe(2);
  });
});

describe("resolve", () => {
  it("returns the exact persona when traits match", () => {
    const res = sim.resolve("health", { income: 0, competence: 0, politics: 1, stage: 1 });
    expect(res?.source).toBe("persona");
    expect(res?.exact).toBe(true);
    expect(res?.persona.id).toBe("hc-consultant");
  });

  it("falls back to the nearest persona", () => {
    const res = sim.resolve("health", { income: 2, competence: 2, politics: 1, stage: 1 });
    expect(res?.exact).toBe(false);
    expect(res?.persona.id).toBe("hc-rural");
  });

  it("builds template personas for sectors without hand-written ones", () => {
    const res = sim.resolve("information", { income: 1, competence: 1, politics: 1, stage: 0 });
    expect(res?.source).toBe("template");
    const l1 = sim.response(res, 1)!;
    expect(l1.say).toBe("It handles the routine code and tests. The system design is still mine.");
    expect(l1.think).toBe(data.templates!.think.early[1]);
    // information is more exposed (+1): L1 lands on the third mood
    expect(l1.mood).toBe("anxious");
    expect(sim.response(res, 0)!.mood).toBe("calm");
  });

  it("returns null for unknown sectors", () => {
    expect(sim.resolve("nope", {})).toBeNull();
  });
});

describe("url state", () => {
  it("round-trips through search params", () => {
    const s = stateFromParams(data, new URLSearchParams("view=compare&sector=finance&level=4&income=2&order=impact"));
    expect(s).toMatchObject({ view: "compare", sectorId: "finance", level: 4, order: "impact" });
    expect(s.traits).toEqual({ income: 2, competence: 0, politics: 1, stage: 1 });
    const back = stateFromParams(data, stateToParams(data, s));
    expect(back).toEqual(s);
  });

  it("ignores invalid values", () => {
    const s = stateFromParams(data, new URLSearchParams("view=x&sector=x&level=9&income=7"));
    expect(s).toMatchObject({ view: "persona", sectorId: "health", level: 2 });
    expect(s.traits.income).toBe(0);
  });
});

describe("briefText", () => {
  it("summarises the persona at every level", () => {
    const text = briefText(sim, "health", { income: 0, competence: 0, politics: 1, stage: 1 }, 2);
    expect(text).toContain("Doctor · Health care and social assistance · Consultant physician");
    expect(text).toContain("Scenario: L2 · 10 years (2036)");
    expect(text.split("\n").filter((l) => /^L\d /.test(l))).toHaveLength(5);
  });
});
