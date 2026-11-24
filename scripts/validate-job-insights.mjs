#!/usr/bin/env node
// Checks data/insights/<code>.json against the 3.1 interviews of that job.
// Usage: node scripts/validate-job-insights.mjs A03
import { readFileSync, readdirSync } from "node:fs";

const code = process.argv[2];
if (!/^[AGRN]\d{2}$/.test(code ?? "")) {
  console.error("Usage: node scripts/validate-job-insights.mjs A03");
  process.exit(2);
}
const root = new URL("../data/", import.meta.url).pathname;
const SCEN = ["S0", "S1", "S2", "S3", "S4"];
const MOODS = ["calm", "uneasy", "anxious", "alarmed", "panicked"];
const errs = [];
const words = (s) => (s ?? "").trim().split(/\s+/).filter(Boolean).length;
const norm = (s) => s.toLowerCase().replace(/[“”"‘’']/g, "").replace(/\s+/g, " ").trim();

const people = readdirSync(root + "interviews/archetypes/raw")
  .filter((f) => f.startsWith(code + "-") && f.endsWith(".json"))
  .map((f) => JSON.parse(readFileSync(root + "interviews/archetypes/raw/" + f, "utf8")))
  .filter((d) => d.protocolVersion === (code[0] === "A" ? "3.1" : "3.2"));
const byId = new Map(people.map((p) => [p.id, p]));
let ins;
try {
  ins = JSON.parse(readFileSync(`${root}insights/${code}.json`, "utf8"));
} catch (e) {
  console.error(`✗ data/insights/${code}.json: ${e.message}`);
  process.exit(1);
}

function bullets(where, v, lo, hi) {
  if (!Array.isArray(v) || v.length < lo || v.length > hi) return errs.push(`${where} should be ${lo} to ${hi} bullets`);
  if (!v.some((b) => /\*\*[^*]+\*\*/.test(b))) errs.push(`${where} needs a **key word** in bold`);
  for (const b of v) if (words(b.replace(/\*\*/g, "")) > 24) errs.push(`${where} bullet is over 24 words`);
}

if (ins.interviews !== people.length) errs.push(`interviews is ${ins.interviews}; there are ${people.length} 3.1 interviews`);
bullets("overview", ins.overview, 2, 3);
for (const s of SCEN) {
  const x = ins.scenarios?.[s];
  if (!x) { errs.push(`${s} missing`); continue; }
  for (const k of ["whatTheySay", "whatTheyThink", "howTheyFeel"]) bullets(`${s}.${k}`, x[k], 2, 3);
  for (const q of x.quotes ?? []) {
    const p = byId.get(q.id);
    if (!p) errs.push(`${s} quote from unknown ${q.id}`);
    else if (norm(p.scenarios[s].quote) !== norm(q.text)) errs.push(`${s} quote for ${q.id} isn't word for word`);
  }
  // Grouped thoughts: every person sits in one or two groups, and the ids are real.
  const th = x.thoughts;
  if (!Array.isArray(th) || th.length < 3 || th.length > 6) errs.push(`${s}.thoughts should have 3 to 6 groups`);
  else {
    const seen = new Map();
    for (const t of th) {
      if (!t.text || words(t.text) > 16) errs.push(`${s}.thoughts "${(t.text ?? "").slice(0, 40)}" should be 1 to 16 words`);
      for (const id of t.ids ?? []) {
        if (!byId.has(id)) errs.push(`${s}.thoughts has unknown id ${id}`);
        seen.set(id, (seen.get(id) ?? 0) + 1);
      }
    }
    const missing = people.filter((p) => !seen.has(p.id)).length;
    const over = [...seen.values()].filter((n) => n > 2).length;
    if (missing) errs.push(`${s}.thoughts leaves out ${missing} people; put everyone in one or two groups`);
    if (over) errs.push(`${s}.thoughts puts ${over} people in more than two groups`);
  }
  // Named ends: the calmest and most worried moods present (plus the next mood while fewer than 5 people).
  for (const end of ["least", "most"]) {
    const g = x.segments?.[end];
    if (!g?.name || words(g.name) > 4) errs.push(`${s}.segments.${end}.name should be 1 to 4 words`);
    if (!g?.story || words(g.story) > 30) errs.push(`${s}.segments.${end}.story should be one sentence of up to 30 words`);
  }
}

if (errs.length) {
  console.log(`✗ ${code}`);
  for (const e of errs.slice(0, 40)) console.log("  - " + e);
  console.log(`\n${errs.length} problem(s)`);
  process.exit(1);
}
console.log(`✓ ${code}: insights match ${people.length} interviews`);
