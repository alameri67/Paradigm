import { describe, expect, it } from "vitest";
import { ACTION_LABEL, SCENARIOS, type InterviewSummary, type MoodKey } from "./types";
import { ACTION_WEIGHT, actionScore, JITTER_X, JITTER_Y, pointsFor, summarize, worryOf } from "./dashboard";

function person(id: string, job: string, mood: MoodKey, actions: string[], quote = `Quote from ${id}`): InterviewSummary {
  const s = { mood, quote, actions };
  return {
    id,
    archetype: id.slice(0, 3),
    job,
    name: `Name ${id}`,
    scenarios: Object.fromEntries(SCENARIOS.map((x) => [x.code, s])) as InterviewSummary["scenarios"],
  };
}

describe("actionScore", () => {
  it("weights every known action tag", () => {
    expect(Object.keys(ACTION_WEIGHT).sort()).toEqual(Object.keys(ACTION_LABEL).sort());
  });
  it("is 0 for no change and caps at 100", () => {
    expect(actionScore(["wait-and-see", "keep-going"])).toBe(0);
    expect(actionScore(["save-more"])).toBeCloseTo(100 / 9);
    expect(actionScore(["retrain", "move", "change-job", "sell-or-exit"])).toBe(100);
    expect(actionScore(["not-a-tag"])).toBe(0);
  });
});

describe("pointsFor", () => {
  const people = [person("A01-11111", "Farmer", "calm", []), person("A16-22222", "Family doctor", "panicked", ["retrain", "move", "automate", "invest"])];
  it("places worry by mood with a small, stable jitter", () => {
    const a = pointsFor(people, "S2");
    const b = pointsFor(people, "S2");
    expect(a.map((p) => [p.x, p.y])).toEqual(b.map((p) => [p.x, p.y]));
    expect(Math.abs(a[0].x - worryOf("calm"))).toBeLessThanOrEqual(JITTER_X);
    expect(Math.abs(a[1].x - 5)).toBeLessThanOrEqual(JITTER_X);
    expect(a[0].y).toBeGreaterThanOrEqual(0);
    expect(a[0].y).toBeLessThanOrEqual(JITTER_Y);
    expect(a[1].y).toBeLessThanOrEqual(100);
    expect(a[1].label).toBe("Name A16-22222, family doctor");
  });
});

describe("summarize", () => {
  it("counts actions, moods and jobs, and takes quotes from different jobs first", () => {
    const people = [
      person("A01-11111", "Farmer", "calm", ["save-more", "save-more"]),
      person("A01-11112", "Farmer", "anxious", ["save-more", "retrain"]),
      person("A16-22222", "Family doctor", "anxious", ["retrain"]),
    ];
    const s = summarize(people, "S0");
    expect(s.n).toBe(3);
    expect(s.actions[0]).toEqual({ tag: "retrain", count: 2, share: 2 / 3 });
    expect(s.actions.find((a) => a.tag === "save-more")?.count).toBe(2);
    expect(s.moods).toEqual({ calm: 1, uneasy: 0, anxious: 2, alarmed: 0, panicked: 0 });
    expect(s.jobs.map((j) => [j.code, j.count])).toEqual([
      ["A01", 2],
      ["A16", 1],
    ]);
    expect(s.quotes).toHaveLength(2);
    expect(new Set(s.quotes.map((q) => q.job)).size).toBe(2);
    expect(s.quotes.every((q) => q.text === `Quote from ${q.id}`)).toBe(true);
  });
  it("handles an empty group", () => {
    const s = summarize([], "S1");
    expect(s.n).toBe(0);
    expect(s.actions).toEqual([]);
    expect(s.quotes).toEqual([]);
  });
});
