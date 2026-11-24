#!/usr/bin/env node
// Counts patterns across every interviewed version of one job, per scenario:
// the mood mix, how often each action comes up, and how the 5 groups differ.
// Usage: node scripts/summarize-job.mjs A01   → writes data/insights/A01-stats.json
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";

const code = process.argv[2];
if (!/^[AGRNU]\d{2}$/.test(code ?? "")) {
  console.error("Usage: node scripts/summarize-job.mjs A01 (or G01, R01, N01)");
  process.exit(1);
}
const root = new URL("../", import.meta.url).pathname;
const rawDir = root + "data/interviews/archetypes/raw/";
const grid = { groups: JSON.parse(readFileSync(root + "data/archetypes/archetypes-v1.json", "utf8")).archetypes.find((a) => a.code === code)?.groups ?? JSON.parse(readFileSync(root + "data/archetypes/grid.json", "utf8")).groups };
const SCEN = ["S0", "S1", "S2", "S3", "S4"];
const MOODS = ["calm", "uneasy", "anxious", "alarmed", "panicked"];

const files = readdirSync(rawDir).filter((f) => f.startsWith(code + "-") && f.endsWith(".json"));
const people = files.map((f) => JSON.parse(readFileSync(rawDir + f, "utf8")));
const round = (x) => Math.round(x * 100) / 100;
const avgMood = (list, s) => round(list.reduce((n, p) => n + MOODS.indexOf(p.scenarios[s].mood) + 1, 0) / (list.length || 1));

const scenarios = {};
for (const s of SCEN) {
  const moodMix = Object.fromEntries(MOODS.map((m) => [m, people.filter((p) => p.scenarios[s].mood === m).length]));
  const counts = {};
  for (const p of people) for (const a of new Set(p.scenarios[s].actions ?? [])) counts[a] = (counts[a] ?? 0) + 1;
  const actions = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([tag, n]) => ({ tag, count: n, share: round(n / people.length) }));

  // For each group: average worry (1 calm … 5 panicked) and the top 3 actions at each level.
  const byGroup = {};
  for (const g of grid.groups) {
    byGroup[g.key] = g.levels.map((l) => {
      const sub = people.filter((p) => p.levels[g.key] === l.key);
      const c = {};
      for (const p of sub) for (const a of new Set(p.scenarios[s].actions ?? [])) c[a] = (c[a] ?? 0) + 1;
      return {
        level: l.key,
        n: sub.length,
        avgWorry: avgMood(sub, s),
        topActions: Object.entries(c)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([tag, n]) => ({ tag, share: round(n / (sub.length || 1)) })),
      };
    });
  }
  scenarios[s] = { n: people.length, avgWorry: avgMood(people, s), moodMix, actions, byGroup };
}

mkdirSync(root + "data/insights", { recursive: true });
const out = { code, interviews: people.length, scenarios };
writeFileSync(root + `data/insights/${code}-stats.json`, JSON.stringify(out, null, 1) + "\n");
console.log(`${code}: ${people.length} interviews summarised → data/insights/${code}-stats.json`);
