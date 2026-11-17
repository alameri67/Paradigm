#!/usr/bin/env node
// Checks archetype interview files (protocol v3) in data/interviews/archetypes/raw.
// Usage: node scripts/validate-archetype-interviews.mjs [ID or prefix ...]
//   e.g. node scripts/validate-archetype-interviews.mjs A01-11      (all files starting with A01-11)
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const dir = new URL("../data/interviews/archetypes/raw/", import.meta.url).pathname;
const grid = JSON.parse(readFileSync(new URL("../data/archetypes/grid.json", import.meta.url), "utf8"));
const byId = new Map(grid.people.map((p) => [p.id, p]));
const SCEN = ["S0", "S1", "S2", "S3", "S4"];
const MOODS = ["calm", "uneasy", "anxious", "alarmed", "panicked"];
const ACTIONS = ["keep-going","cut-spending","save-more","retrain","learn-ai","change-job","side-income","invest","automate","sell-or-exit","retire-early","collective-action","politics","seek-support","move","family-plans","wait-and-see"];
const OLD_CARD = /hands-on work is no longer a safe place|matches skilled professionals|handy tool, like a better search engine/i;
const BANNED = ["delve", "leverage", "it is important to note", "double-edged sword", "only time will tell"];
const norm = (s) => s.toLowerCase().replace(/[“”"‘’']/g, "").replace(/\s+/g, " ").trim();
const words = (s) => (s ?? "").trim().split(/\s+/).filter(Boolean).length;

// A quote is shown on its own, so it must make sense to a stranger (protocol section 5).
const LEAD = /^(and|but|so|yeah|well|it|it's|its|that|that's|this|these|those|they|they're|them|he|he's|she|she's|him|her|then)\b/i;
const PRONOUN = /\b(he|he's|he'd|he'll|him|his|she|she's|she'd|she'll|her|hers)\b/i;
const PERSON = /\b(wife|husband|daughter|son|sons|kid|kids|boy|girl|lad|lass|mum|mom|mother|dad|father|brother|sister|partner|boss|manager|foreman|supervisor|grandson|granddaughter|grandad|grandpa|grandma|granny|nan|niece|nephew|friend|neighbour|neighbor|man|woman|child|baby|uncle|aunt|cousin|customer|doctor|teacher|girlfriend|boyfriend|fiancée|fiance|fiancé)\b/i;
function standAlone(q) {
  const t = q.trim();
  if (LEAD.test(t)) return `starts with "${t.match(LEAD)[0]}", which points back to something the reader can't see`;
  const m = t.match(PRONOUN);
  if (m) {
    const before = t.slice(0, m.index);
    // A name counts: a capitalised word that isn't the first word of a sentence and isn't "I".
    const named = /(?<![.!?]\s)(?<!^)\b(?!I\b)[A-Z][a-z]+/.test(before);
    if (!PERSON.test(before) && !named) return `says "${m[0]}" without saying who that is`;
  }
  return null;
}

const args = process.argv.slice(2);
const all = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(".json")).sort() : [];
const files = args.length ? all.filter((f) => args.some((a) => f.startsWith(a))) : all;

let bad = 0;
for (const f of files) {
  const errs = [];
  let d;
  try { d = JSON.parse(readFileSync(join(dir, f), "utf8")); } catch (e) { console.log(`✗ ${f}: ${e.message}`); bad++; continue; }
  const p = byId.get(d.id);
  if (d.id !== f.replace(".json", "")) errs.push("id does not match file name");
  if (!p) errs.push("id not in grid.json");
  else {
    if (d.name !== p.name) errs.push(`name "${d.name}" should be "${p.name}"`);
    if (JSON.stringify(d.levels) !== JSON.stringify(p.levels)) errs.push("levels do not match grid.json");
  }
  const personaText = (list) => (list ?? []).filter((t) => t.speaker === "persona").map((t) => t.text).join(" ");
  if (!Array.isArray(d.opening) || d.opening.length < 2) errs.push("opening needs at least 2 turns");
  if (!Array.isArray(d.closing) || d.closing.length < 2) errs.push("closing needs at least 2 turns");
  let everything = personaText(d.opening) + " " + personaText(d.closing);
  for (const s of SCEN) {
    const x = d.scenarios?.[s];
    if (!x) { errs.push(`missing ${s}`); continue; }
    const t = x.transcript ?? [];
    if (t.length < 12) errs.push(`${s}: transcript has ${t.length} turns, needs at least 12`);
    if (t.some((u) => !["interviewer", "persona"].includes(u.speaker) || !u.text?.trim())) errs.push(`${s}: bad transcript turn`);
    for (const k of ["say", "think", "do", "feel", "quote", "fieldNote"]) if (!x[k]?.trim()) errs.push(`${s}: empty ${k}`);
    if (!MOODS.includes(x.mood)) errs.push(`${s}: bad mood "${x.mood}"`);
    if (!Array.isArray(x.actions) || x.actions.length < 1 || x.actions.length > 4) errs.push(`${s}: actions needs 1 to 4 tags`);
    else for (const a of x.actions) if (!ACTIONS.includes(a)) errs.push(`${s}: unknown action tag "${a}"`);
    if (!Array.isArray(x.steps) || x.steps.length < 1 || x.steps.length > 3) errs.push(`${s}: steps needs 1 to 3 concrete steps`);
    else {
      for (const st of x.steps) {
        const w = words(st?.text);
        if (w < 3 || w > 16) errs.push(`${s}: step "${st?.text ?? ""}" should be 3 to 16 words`);
        if (/^(i|i'll|i'd|we|my)\b/i.test(st?.text ?? "")) errs.push(`${s}: step "${st.text}" should start with a verb, not "I" or "we"`);
        if (!x.actions?.includes(st?.tag)) errs.push(`${s}: step "${st?.text ?? ""}" has tag "${st?.tag}", which isn't in actions`);
      }
      for (const a of x.actions ?? []) if (!x.steps.some((st) => st?.tag === a)) errs.push(`${s}: action "${a}" has no step`);
      const texts = x.steps.map((st) => norm(st?.text ?? ""));
      if (new Set(texts).size < texts.length) errs.push(`${s}: two steps are the same`);
    }
    if (OLD_CARD.test(JSON.stringify(t))) errs.push(`${s}: uses an old scenario card (see protocol v3)`);
    for (const k of ["say", "think", "do"]) if (x[k] && words(x[k]) < 18) errs.push(`${s}: ${k} is thin (${words(x[k])} words; aim for 2 or 3 sentences)`);
    if (x.fieldNote && words(x.fieldNote) < 25) errs.push(`${s}: fieldNote is thin (${words(x.fieldNote)} words)`);
    if (x.quote && words(x.quote) > 30) errs.push(`${s}: quote is over 30 words`);
    const lone = x.quote && standAlone(x.quote);
    if (lone) errs.push(`${s}: quote ${lone}; pick or improve a line that makes sense on its own`);
    const pt = personaText(t);
    everything += " " + pt;
    if (x.quote && !norm(pt).includes(norm(x.quote))) errs.push(`${s}: quote is not word for word from this scenario's answers`);
    if (/^["“]/.test(x.say ?? "") || /^["“]/.test(x.quote ?? "")) errs.push(`${s}: say/quote should not start with a quote mark`);
  }
  for (const k of ["headlineQuote", "portrait", "biggestWorry", "whatWouldHelp"]) if (!d[k]?.trim()) errs.push(`missing ${k}`);
  if (d.headlineQuote && words(d.headlineQuote) > 30) errs.push("headlineQuote is over 30 words");
  const loneH = d.headlineQuote && standAlone(d.headlineQuote);
  if (loneH) errs.push(`headlineQuote ${loneH}; pick or improve a line that makes sense on its own`);
  if (d.headlineQuote && !norm(everything).includes(norm(d.headlineQuote))) errs.push("headlineQuote is not word for word from the transcript");
  const qs = SCEN.map((s) => d.scenarios?.[s]?.quote).filter(Boolean).map(norm);
  if (d.headlineQuote && qs.includes(norm(d.headlineQuote))) errs.push("headlineQuote repeats a scenario quote; pick a different line");
  if (new Set(qs).size < qs.length) errs.push("two scenarios have the same quote; each needs its own");
  if (d.protocolVersion !== "3.0") errs.push(`protocolVersion should be "3.0"`);
  if (/\bS[0-4]\b/.test(personaText(d.opening) + JSON.stringify(Object.values(d.scenarios ?? {}).map((x) => x.transcript)))) errs.push("transcript says a scenario code (S0–S4); use the scenario's name");
  if (d.portrait && words(d.portrait) < 45) errs.push(`portrait is thin (${words(d.portrait)} words)`);
  const lower = JSON.stringify(d).toLowerCase();
  for (const w of BANNED) if (lower.includes(w)) errs.push(`uses "${w}"`);
  if (errs.length) { bad++; console.log(`✗ ${f}\n  - ${errs.join("\n  - ")}`); }
  else console.log(`✓ ${f}`);
}
console.log(`\n${files.length - bad}/${files.length} files valid`);
process.exit(bad ? 1 : 0);
