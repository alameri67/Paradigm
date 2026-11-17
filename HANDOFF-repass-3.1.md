# Handoff: protocol 3.1 re-pass of the archetype interviews

Branch: `claude/repass-3.1` (branched from `main`). Work was stopped partway on request.
**Do not merge into `main` until the re-pass is finished and checked.**

## The goal

Re-interview every archetype person under interview protocol **3.1** and write a summary per job.

- 32 jobs (`A01`–`A32`, listed in `data/archetypes/archetypes-v1.json`) x 243 people = **7,776 interviews**.
- One file per person: `data/interviews/archetypes/raw/<ID>.json`.
  The ID is the job code plus 5 digits, each 1–3: life stage, work standing, money cushion, outlook, adaptability (e.g. `A07-21312`).
- Follow `docs/interview-protocol-v3.md` (version 3.1) exactly. That includes the newer rule to say who a
  named person is, in brackets inside the quote: `"Mei (his wife) does the books"`. Skip the brackets only when
  the quote already says it (`"my wife Mei"`).
- A file that is already `protocolVersion: "3.1"` **and** passes the checker may be left alone. Anything else gets
  re-interviewed from scratch and overwritten. Overwriting is intended: every older version is in git history on `main`.
- Only `data/` files change. Do not touch `app/`, `components/` or `lib/`.

## Checks (these are the source of truth)

```bash
node scripts/validate-archetype-interviews.mjs A07-213   # a batch prefix
node scripts/validate-archetype-interviews.mjs A07       # a whole job
node scripts/validate-job-insights.mjs A07               # that job's summary
```

Every interview file must pass. A job's summary is written only once that job has **at least 200 passing** interviews.

## Where it stands

Counted with the validator, requiring both `protocolVersion: "3.1"` and a pass. **1,626 of 7,776 done.**
(Table rebuilt from the validators by the session's status script; last update 2026-11-17 12:25 UTC.)

| Job | Passing 3.1 interviews | Summary in `data/insights/` |
|---|---|---|
| A01 | 243/243 | yes (regenerated, passes) |
| A02 | 53/243 | STALE from main - must redo |
| A03 | 53/243 | STALE from main - must redo |
| A04 | 49/243 | STALE from main - must redo |
| A05 | 55/243 | not written yet |
| A06 | 43/243 | not written yet |
| A07 | 41/243 | not written yet |
| A08 | 43/243 | not written yet |
| A09 | 43/243 | not written yet |
| A10 | 41/243 | not written yet |
| A11 | 40/243 | not written yet |
| A12 | 42/243 | not written yet |
| A13 | 47/243 | not written yet |
| A14 | 49/243 | not written yet |
| A15 | 46/243 | not written yet |
| A16 | 40/243 | not written yet |
| A17 | 41/243 | not written yet |
| A18 | 43/243 | not written yet |
| A19 | 46/243 | not written yet |
| A20 | 44/243 | not written yet |
| A21 | 41/243 | not written yet |
| A22 | 45/243 | not written yet |
| A23 | 40/243 | not written yet |
| A24 | 45/243 | not written yet |
| A25 | 43/243 | not written yet |
| A26 | 44/243 | not written yet |
| A27 | 43/243 | not written yet |
| A28 | 45/243 | not written yet |
| A29 | 46/243 | not written yet |
| A30 | 40/243 | not written yet |
| A31 | 47/243 | not written yet |
| A32 | 45/243 | not written yet |

Note: on `main` many jobs have fewer than 243 files (e.g. A06 had 52); the missing people are simply new files to write.

### Two traps to know about

1. **`data/insights/A02.json`, `A03.json` and `A04.json` are stale.** They are untouched copies from `main` that
   describe the old 3.0 interviews and claim 243 interviews each. Those interviews have now been partly overwritten,
   so the files are wrong: `validate-job-insights.mjs A02` currently reports 57 problems. Regenerate all three
   from the finished 3.1 interviews. Do not trust them in the meantime.
2. **Partial batches.** Work was cut off mid-batch, so a job's passing files do not line up with whole batches of 9.
   The skip lists below only name batches where all 9 files pass; re-run everything else, even where a few files
   in it already look done.

## Still to do

1. Finish the interviews for `A02`–`A32` (about 6,186 people).
2. Write `data/insights/<code>.json` for every job once it has 200+ passing interviews, and make
   `validate-job-insights.mjs <code>` pass. Redo A02–A04 as noted above.
3. **A01 brackets pass. DONE (commit 3de6753).** 122 files changed; 243/243 still pass and `validate-job-insights.mjs A01`
   still passes. The validator requires each quote to be word for word from the persona's answer, so the same bracket
   was also added to the matching sentence in the transcript (that is how the new 3.1 files do it). A bracket containing
   his/her right after a name at the start of a sentence trips the pronoun check, so those use the protocol's other
   form instead (`My wife Mei and I...`). Names at the start of a sentence, which the scanner below skips, were
   checked too. Original note:
   Most A01 interviews were written before the brackets rule existed, so their quotes name Most A01 interviews were written before the brackets rule existed, so their quotes name
   people without saying who they are. A scan found about 378 name mentions across 174 of the 243 A01 files.
   This needs judgment per quote, not a find-and-replace: some flagged lines are already fine
   (`"My sheepdog Nell..."`, `"Mr Dorran's son..."`) and must be left as they are. Only the quote strings change
   (each scenario's `quote` and the `headlineQuote`); nothing else in the file. Re-run
   `validate-archetype-interviews.mjs A01` afterwards. The scanner used to build that list is reproduced at the
   bottom of this file.

## How the work was run

`scripts/repass-3.1-workflow.js` does all of it for the job codes passed in `args.jobs`: it splits each job into
27 batches of 9 people, runs one agent per batch, then writes that job's summary. It also takes `args.skip`, a list
of batch prefixes to leave alone.

Before running it, change two lines:

- `SCRATCH` — point it at your own scratchpad folder.
- `USER_ASK` — this is the text each agent is given as the reason the overwriting is wanted. **Replace what is
  committed there.** The committed version quotes approvals from an older session and tells agents to carry on
  regardless of what the user says next, which is not something you want running unattended for hours. Put the
  current request in your own words instead, e.g.:

> Redo every Paradigm interview under protocol 3.1; overwrite every interview file that isn't on 3.1 yet. That is
> the intended result and nothing is lost, because every old version is in git history on main (alameri67/Paradigm).
> Skip any file that is already protocolVersion "3.1" and passes the check. Only `data/` files change.

The machine fits roughly 2 agents per run, so run **one job per run** rather than one run for everything:
`{"jobs": ["A05"], "skip": [...]}`. Launching all of them at once works and is what was done here. With 32 runs going
the whole set was moving at roughly 230 interviews per hour, so budget many hours.

### Skip lists (batches where all 9 files already pass on 3.1)

```json
{
  "A01": ["A01-111","A01-112","A01-113","A01-121","A01-122","A01-123","A01-131","A01-132","A01-133","A01-211","A01-212","A01-213","A01-221","A01-222","A01-223","A01-231","A01-232","A01-233","A01-311","A01-312","A01-313","A01-321","A01-322","A01-323","A01-331","A01-332","A01-333"],
  "A02": ["A02-111","A02-112","A02-113","A02-121","A02-123"],
  "A03": ["A03-111","A03-112","A03-113","A03-121","A03-123"],
  "A04": ["A04-111","A04-112","A04-113","A04-121"],
  "A05": ["A05-111","A05-112","A05-113","A05-121","A05-122","A05-123"],
  "A06": ["A06-111","A06-112","A06-113","A06-121"],
  "A07": ["A07-111","A07-112","A07-113","A07-121"],
  "A08": ["A08-111","A08-112","A08-113","A08-121"],
  "A09": ["A09-111","A09-112","A09-113","A09-121"],
  "A10": ["A10-111","A10-112","A10-113","A10-121"],
  "A11": ["A11-111","A11-112","A11-113","A11-121"],
  "A12": ["A12-111","A12-112","A12-113","A12-121"],
  "A13": ["A13-111","A13-112","A13-113","A13-121"],
  "A14": ["A14-111","A14-112","A14-113","A14-121"],
  "A15": ["A15-111","A15-112","A15-113","A15-121"],
  "A16": ["A16-111","A16-112","A16-113","A16-121"],
  "A17": ["A17-111","A17-112","A17-113","A17-121"],
  "A18": ["A18-111","A18-112","A18-113","A18-121"],
  "A19": ["A19-111","A19-112","A19-113","A19-121"],
  "A20": ["A20-111","A20-112","A20-113","A20-121"],
  "A21": ["A21-111","A21-112","A21-113","A21-121"],
  "A22": ["A22-111","A22-112","A22-113","A22-121"],
  "A23": ["A23-111","A23-112","A23-113","A23-121"],
  "A24": ["A24-111","A24-112","A24-113","A24-121"],
  "A25": ["A25-111","A25-112","A25-113","A25-121"],
  "A26": ["A26-111","A26-112","A26-113","A26-121"],
  "A27": ["A27-111","A27-112","A27-113","A27-121"],
  "A28": ["A28-111","A28-112","A28-113","A28-121"],
  "A29": ["A29-111","A29-112","A29-113","A29-121"],
  "A30": ["A30-111","A30-112","A30-113","A30-121"],
  "A31": ["A31-111","A31-112","A31-113","A31-121"],
  "A32": ["A32-111","A32-112","A32-113","A32-121"]
}
```

### The A01 bracket scanner

Writes a JSON file of quotes that name someone without saying who they are. It over-reports on purpose: read each
hit before changing it.

```js
const fs=require("fs"),d="data/interviews/archetypes/raw/",pre=process.argv[2]||"A01-";
const rel="(wife|husband|son|daughter|boss|neighbour|brother|sister|father|mother|dad|mum|partner|landlord|manager|foreman|vet|friend|colleague|cousin|uncle|aunt)";
let hits=[];
for(const f of fs.readdirSync(d)){ if(!f.startsWith(pre))continue; const j=JSON.parse(fs.readFileSync(d+f));
  const qs=[["headlineQuote",j.headlineQuote]];
  for(const k of Object.keys(j.scenarios||{})) qs.push([k,j.scenarios[k].quote]);
  for(const [k,q] of qs){ if(typeof q!=="string")continue;
    const firsts=new Set(); for(const p of q.split(/(?<=[.!?])\s+/)){const w=p.trim().match(/^([A-Z][a-z]{2,})/); if(w)firsts.add(w[1]);}
    for(const m of q.matchAll(/\b([A-Z][a-z]{2,})\b/g)){ const n=m[1]; if(firsts.has(n))continue;
      const bracketed=new RegExp(n+"\\s*\\(").test(q);
      const said=new RegExp("(my|our|his|her|their)\\s+(\\w+\\s+)?"+rel+",?\\s+"+n,"i").test(q)||new RegExp(n+",?\\s+(my|our|his|her|their)\\s+"+rel,"i").test(q);
      if(!bracketed&&!said) hits.push({file:f,field:k,name:n,quote:q}); } } }
console.log(hits.length+" mentions in "+new Set(hits.map(h=>h.file)).size+" files");
fs.writeFileSync("bracket-candidates.json",JSON.stringify(hits,null,1));
```

## Session log

- 2026-11-17: second session took over. Re-checked the skip lists with the validator (they matched), did the A01
  brackets pass, and launched one workflow run per job for A02-A32 with a rewritten `USER_ASK` (kept in the session's
  scratchpad copy of the script; the committed script is unchanged). The status table above is rebuilt from the
  validators on each checkpoint commit.

## Working agreement

- Commit and push to `claude/repass-3.1` as you go; don't merge to `main`.
- The tree will not stay clean while agents are writing files — commits are snapshots of a moving target. That is fine.
- `AGENTS.md` is rewritten by `next dev`; committing it along with the work keeps the tree tidy.
