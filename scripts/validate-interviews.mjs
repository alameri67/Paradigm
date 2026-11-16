#!/usr/bin/env node
// Checks interview files in data/interviews/raw against docs/interview-protocol.md.
// Usage: node scripts/validate-interviews.mjs [ID ...]   (no IDs = every file)
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const dir = new URL("../data/interviews/raw/", import.meta.url).pathname;
const SCEN = ["S0", "S1", "S2", "S3", "S4"];
const MOODS = ["calm", "uneasy", "anxious", "alarmed", "panicked"];
const ids = process.argv.slice(2);
const files = ids.length ? ids.map((id) => `${id}.json`) : readdirSync(dir).filter((f) => f.endsWith(".json")).sort();

let bad = 0;
for (const f of files) {
  const errs = [];
  let d;
  try {
    d = JSON.parse(readFileSync(join(dir, f), "utf8"));
  } catch (e) {
    console.log(`✗ ${f}: ${e.message}`);
    bad++;
    continue;
  }
  if (d.id !== f.replace(".json", "")) errs.push(`id "${d.id}" does not match file name`);
  for (const k of ["name", "group", "role"]) if (!d[k]) errs.push(`missing ${k}`);
  if (!Array.isArray(d.opening) || !d.opening.length) errs.push("missing opening");
  for (const s of SCEN) {
    const x = d.scenarios?.[s];
    if (!x) { errs.push(`missing ${s}`); continue; }
    if (!Array.isArray(x.transcript) || x.transcript.length < 8) errs.push(`${s}: transcript has fewer than 8 turns`);
    else if (x.transcript.some((t) => !["interviewer", "persona"].includes(t.speaker) || !t.text?.trim())) errs.push(`${s}: bad transcript turn`);
    for (const k of ["say", "think", "do", "feel"]) if (!x[k]?.trim()) errs.push(`${s}: empty ${k}`);
    if (!MOODS.includes(x.mood)) errs.push(`${s}: mood "${x.mood}" not in ${MOODS.join("/")}`);
    if (/^["“]/.test(x.say ?? "")) errs.push(`${s}: say should not start with a quote mark`);
    const all = JSON.stringify(x).toLowerCase();
    for (const w of ["delve", "leverage", "it is important to note"]) if (all.includes(w)) errs.push(`${s}: uses "${w}"`);
  }
  if (errs.length) { bad++; console.log(`✗ ${f}\n  - ${errs.join("\n  - ")}`); }
  else console.log(`✓ ${f}`);
}
console.log(`\n${files.length - bad}/${files.length} files valid`);
process.exit(bad ? 1 : 0);
