#!/usr/bin/env node
// Turns each interview in data/interviews/raw/<ID>.json into a readable
// transcript at data/interviews/transcripts/<ID>.md, plus an index (README.md).
// Usage: node scripts/export-transcripts.mjs
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("../data/interviews/", import.meta.url).pathname;
const rawDir = join(root, "raw");
const outDir = join(root, "transcripts");
mkdirSync(outDir, { recursive: true });

const SCENARIOS = {
  S0: "No major impact",
  S1: "Capable but slow",
  S2: "Moderately fast",
  S3: "Fast",
  S4: "Fast AI and fast robots",
};
const MOOD = { calm: "Calm", uneasy: "Uneasy", anxious: "Anxious", alarmed: "Alarmed", panicked: "Panicked" };

const files = readdirSync(rawDir).filter((f) => f.endsWith(".json")).sort();
const rows = [];

for (const f of files) {
  const d = JSON.parse(readFileSync(join(rawDir, f), "utf8"));
  const first = d.name.split(" ")[0];
  const who = (s) => (s === "interviewer" ? "**Interviewer:**" : `**${first}:**`);
  const turns = (list) => list.map((t) => `${who(t.speaker)} ${t.text}`).join("\n\n");

  const parts = [
    `# ${d.id} · ${d.name}`,
    `${d.role} · ${d.group}`,
    "_Simulated interview. The person is a made-up persona, and the answers are a model's guess at how someone like them would react. They aren't real quotes._",
    "## Opening",
    turns(d.opening ?? []),
  ];
  for (const [code, name] of Object.entries(SCENARIOS)) {
    const s = d.scenarios?.[code];
    if (!s) continue;
    parts.push(
      `## ${code} · ${name}`,
      turns(s.transcript ?? []),
      "### Summary",
      [
        `- **Says:** “${s.say}”`,
        `- **Thinks:** ${s.think}`,
        `- **Does:** ${s.do}`,
        `- **Feels:** ${s.feel}`,
        `- **Mood:** ${MOOD[s.mood] ?? s.mood}`,
      ].join("\n"),
    );
  }
  writeFileSync(join(outDir, `${d.id}.md`), parts.join("\n\n") + "\n");
  rows.push({ d, moods: Object.keys(SCENARIOS).map((c) => MOOD[d.scenarios?.[c]?.mood] ?? "–") });
}

const index = [
  "# Interview transcripts",
  "Simulated interviews with each persona in `data/population/synthetic-population-v1.3.md`, run with `docs/interview-protocol.md`. Every file is made by `scripts/export-transcripts.mjs` from the data files in `raw/`, so edit those, not these.",
  `${rows.length} of 115 interviews are done.`,
  ["| ID | Name | Role | Group | S0 | S1 | S2 | S3 | S4 |",
  "|---|---|---|---|---|---|---|---|---|",
  ...rows.map(
    ({ d, moods }) => `| [${d.id}](${d.id}.md) | ${d.name} | ${d.role} | ${d.group} | ${moods.join(" | ")} |`,
  )].join("\n"),
];
writeFileSync(join(outDir, "README.md"), index.join("\n\n") + "\n");
console.log(`Wrote ${rows.length} transcripts to data/interviews/transcripts/`);
