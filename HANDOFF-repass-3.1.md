# Handoff: protocol 3.1 re-pass of the archetype interviews

Branch: `claude/repass-3.1` (branched from `main`). Work resumed with parallel writers; see current reservations.
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

Counted with the validator, requiring both `protocolVersion: "3.1"` and a pass. **2,116 of 7,776 done.**
(Table rebuilt from the validators by the current session's status script; last update 2026-11-17 19:08 UTC.)

| Job | Passing 3.1 interviews | Summary in `data/insights/` |
|---|---|---|
| A01 | 243/243 | yes (regenerated, passes) |
| A02 | 107/243 | STALE from main - must redo |
| A03 | 91/243 | STALE from main - must redo |
| A04 | 88/243 | STALE from main - must redo |
| A05 | 70/243 | not written yet |
| A06 | 57/243 | not written yet |
| A07 | 56/243 | not written yet |
| A08 | 57/243 | not written yet |
| A09 | 56/243 | not written yet |
| A10 | 56/243 | not written yet |
| A11 | 55/243 | not written yet |
| A12 | 55/243 | not written yet |
| A13 | 56/243 | not written yet |
| A14 | 63/243 | not written yet |
| A15 | 60/243 | not written yet |
| A16 | 44/243 | not written yet |
| A17 | 54/243 | not written yet |
| A18 | 55/243 | not written yet |
| A19 | 56/243 | not written yet |
| A20 | 56/243 | not written yet |
| A21 | 55/243 | not written yet |
| A22 | 58/243 | not written yet |
| A23 | 55/243 | not written yet |
| A24 | 54/243 | not written yet |
| A25 | 57/243 | not written yet |
| A26 | 57/243 | not written yet |
| A27 | 57/243 | not written yet |
| A28 | 57/243 | not written yet |
| A29 | 58/243 | not written yet |
| A30 | 54/243 | not written yet |
| A31 | 60/243 | not written yet |
| A32 | 59/243 | not written yet |

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

1. Finish the interviews for `A02`–`A32` (5,660 people remain by the table above).
2. Write `data/insights/<code>.json` for every job once it has 200+ passing interviews, and make
   `validate-job-insights.mjs <code>` pass. Redo A02–A04 as noted above.
3. **A01 brackets pass. DONE (commit 3de6753).** 122 files changed; 243/243 still pass and `validate-job-insights.mjs A01`
   still passes. The validator requires each quote to be word for word from the persona's answer, so the same bracket
   was also added to the matching sentence in the transcript (that is how the new 3.1 files do it). A bracket containing
   his/her right after a name at the start of a sentence trips the pronoun check, so those use the protocol's other
   form instead (`My wife Mei and I...`). Names at the start of a sentence, which the scanner below skips, were
   checked too. Original note:
   Most A01 interviews were written before the brackets rule existed, so their quotes name
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
  "A02": ["A02-111","A02-112","A02-113","A02-121","A02-122","A02-123","A02-131","A02-132","A02-133","A02-231","A02-232"],
  "A03": ["A03-111","A03-112","A03-113","A03-121","A03-122","A03-123","A03-131","A03-132"],
  "A04": ["A04-111","A04-112","A04-113","A04-121","A04-122","A04-123","A04-131","A04-132"],
  "A05": ["A05-111","A05-112","A05-113","A05-121","A05-122","A05-123"],
  "A06": ["A06-111","A06-112","A06-113","A06-121","A06-122","A06-123"],
  "A07": ["A07-111","A07-112","A07-113","A07-121","A07-122","A07-123"],
  "A08": ["A08-111","A08-112","A08-113","A08-121","A08-122","A08-123"],
  "A09": ["A09-111","A09-112","A09-113","A09-121","A09-122","A09-123"],
  "A10": ["A10-111","A10-112","A10-113","A10-121","A10-122","A10-123"],
  "A11": ["A11-111","A11-112","A11-113","A11-121","A11-122","A11-123"],
  "A12": ["A12-111","A12-112","A12-113","A12-121","A12-122","A12-123"],
  "A13": ["A13-111","A13-112","A13-113","A13-121","A13-122"],
  "A14": ["A14-111","A14-112","A14-113","A14-121","A14-122","A14-123"],
  "A15": ["A15-111","A15-112","A15-113","A15-121","A15-122","A15-123"],
  "A16": ["A16-111","A16-112","A16-113","A16-121"],
  "A17": ["A17-111","A17-112","A17-113","A17-121","A17-122","A17-123"],
  "A18": ["A18-111","A18-112","A18-113","A18-121","A18-122","A18-123"],
  "A19": ["A19-111","A19-112","A19-113","A19-121","A19-122","A19-123"],
  "A20": ["A20-111","A20-112","A20-113","A20-121","A20-122","A20-123"],
  "A21": ["A21-111","A21-112","A21-113","A21-121","A21-122","A21-123"],
  "A22": ["A22-111","A22-112","A22-113","A22-121","A22-122","A22-123"],
  "A23": ["A23-111","A23-112","A23-113","A23-121","A23-122"],
  "A24": ["A24-111","A24-112","A24-113","A24-121","A24-122"],
  "A25": ["A25-111","A25-112","A25-113","A25-121","A25-122","A25-123"],
  "A26": ["A26-111","A26-112","A26-113","A26-121","A26-122","A26-123"],
  "A27": ["A27-111","A27-112","A27-113","A27-121","A27-122","A27-123"],
  "A28": ["A28-111","A28-112","A28-113","A28-121","A28-122","A28-123"],
  "A29": ["A29-111","A29-112","A29-113","A29-121","A29-122","A29-123"],
  "A30": ["A30-111","A30-112","A30-113","A30-121","A30-122","A30-123"],
  "A31": ["A31-111","A31-112","A31-113","A31-121","A31-122","A31-123"],
  "A32": ["A32-111","A32-112","A32-113","A32-121","A32-122","A32-123"]
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

- 2026-11-17: current cloud session resumed at `6f3cd18` on `claude/repass-3.1`. Re-ran all 32 interview
  validators and all 32 insights validators: the starting total of 1,724 passing interviews and every complete-batch
  skip list matched this document. A01 interviews (243/243) and insights pass; its bracket pass was already committed.
  The current machine uses `/workspace/Paradigm`, not `/home/user/Paradigm`. The committed workflow requires an
  external `agent`/`parallel`/`pipeline` runner which is unavailable here; it cannot run directly with Node. An adapted
  copy with current paths, fresh `USER_ASK` and `SCRATCH=/tmp/paradigm-repass` is kept outside the checkout, and two
  supported assistant workers began writing unfinished A02 interviews. Existing passing files are skipped individually,
  including within partial batches. Helpers, validation logs and initial passing-file hashes are outside the checkout
  under `/tmp/paradigm-repass`. Node v24.22.1 runs the data validators without npm installation or API credentials.
  Reusable instructions were saved in the cloud environment's `start_skill` draft; publication has not been performed.
  The current user's final instruction authorizes merging into main **only when the full re-pass is finished**.
  At the user's request, subsequent writing workers use the smaller `gpt-6-luna` model, with the same independent
  validation and content review. A local Codex CLI smoke test could initialize using temporary writable state,
  but its ChatGPT connection was denied by the network proxy (HTTP CONNECT 403). `chatgpt.com` was added to
  the environment configuration draft; it is not yet applied or verified, and no unattended CLI workflow is running.
  The current assistant workers use the supported collaboration tools instead. Temporary authentication links
  created for that CLI test were removed; no credential values were copied into the repository or setup instructions.

- 2026-11-17: second session took over. Re-checked the skip lists with the validator (they matched), did the A01
  brackets pass, and launched one workflow run per job for A02-A32 with a rewritten `USER_ASK` (kept in the session's
  scratchpad copy of the script; the committed script is unchanged). The status table above is rebuilt from the
  validators on each checkpoint commit.

- 2026-11-17: cloud checkpoint reconciled with concurrent remote commit `0bb34b6` (which reported 2,024
  passing interviews). This session authored 15 passing A02 interviews in local commits `37ced25` and `87867bc`.
  Six overlapped incoming files that independently passed, so those incoming versions were retained; both versions
  remain in the merged history. The incoming `A02-13132` did not pass, so the freshly authored, reviewed local
  Pedro interview was retained instead. Net addition over the remote checkpoint: **9 passing A02 interviews**.
  All 32 interview validators and all 32 insights validators were re-run after reconciliation; the table and skip
  lists above reflect that local combined tree, not an assumption that every remote file passes. A01 remains
  243/243 with passing insights; A02-A04 insights remain stale and no unfinished job has reached 200 passes.
  Only data files and this handoff differ from the incoming feature-branch checkpoint. No app code changed.
  At that checkpoint this session's writers were stopped to avoid duplicating the concurrent run; they later resumed on disjoint reserved batches. The next A02 gaps include `A02-13133` and `A02-23133`, subject to a fresh remote check.
  `git push origin HEAD:refs/heads/claude/repass-3.1` was denied HTTP 403 by this environment's GitHub connection,
  despite successful reads. At that checkpoint these commits were local only; write access was later restored and the work was pushed.
  No merge to main was attempted; the full re-pass is unfinished. A verified incremental Git bundle is saved
  outside the checkout at `/tmp/paradigm-repass/Paradigm-repass-3.1.bundle` for recovery if publication is blocked.

- 2026-11-17: after the user updated GitHub authorization, the push negotiation no longer returned HTTP 403.
  The remote branch had advanced through `25a19ab` to `0f01c5e`; those two commits only updated the handoff
  timestamp. Their history was merged into this feature branch while retaining the independently validated
  combined counts and this session's notes. All interview and insights validators were re-run; the table above
  remains the source of truth. No interview generation or merge to main was performed during this access check.

- 2026-11-17: user requested parallel sessions. Six smaller-model writers were organized into disjoint
  early/mid-life lanes for A02, A03 and A04, with read-only reviewers using free slots. The first parallel wave
  completed **30 new interviews**: 12 for A02, 9 for A03 and 9 for A04. All 30 passed repository validation,
  exact-card/question/follow-up/answer-length/quote/bullet checks, profile checks and substantive review after
  corrections. All 2,033 interviews that passed at the start of this wave remain byte-for-byte unchanged.
  All 32 interview and 32 insights validators were re-run before checkpointing: **2,063 passing overall**;
  A02 87/243, A03 74/243, A04 72/243. A01 remains 243/243 with passing insights. No other job has 200 passes,
  so insights were not regenerated. The new wave uses the next reserved people below. Helpers and accepted-file
  hashes are under `/tmp/paradigm-repass/parallel/`; only data and this handoff are committed.

- 2026-11-17: automatic goal continuation recovered 9 completed files and resumed drafting without a user prompt.
  All 9 passed independent content review after correcting real annotation issues; the Say question was already
  included in the first card turn and was not duplicated. Explicit conditional course enrollment remains retrain,
  with funding/acceptance conditions preserved in the step. A question-order defect was also corrected in five
  of this session's own earlier A04 outputs: Feel now precedes both follow-ups, with the answer text unchanged.
  The supplemental audit now enforces that placement. The original 2,033 protected baseline files remain unchanged.
  Separately, review rejected damaged or copied summaries in several new uncommitted smaller-model drafts;
  those are being repaired by a stronger workhorse model before publication, while smaller models review.

## Current continuous writer lanes

The user's latest instruction is explicit: **do not pause after batches; continue until all interviews are done.**
The Codex continuous goal is active. Earlier four-person limits and pause-for-review instructions are superseded.
The parent keeps reviewing and publishing checkpoints without waiting for another user prompt.

Runtime scheduling: lane manifests define ownership, not a requirement to author 70+ interviews in one worker turn. Dispatch concrete one-person execution calls and automatically requeue the next unfinished ID when a call completes. Do not leave a finished small assignment waiting for user input. Agent-team state can reset between automatic goal turns; inspect live agents and stable files, then recreate missing workers. Keep in-flight calls finite, finish or safely checkpoint their work before yielding a goal turn, and let the active goal immediately schedule the next turn.

Six writer lanes own disjoint complete remaining assignments in A02-A04. They author one fresh person at a
time, validate and audit that file, report it, and continue immediately. They never run git or touch accepted files.
The manifests below are outside the checkout; if lost, rebuild from grid IDs within the inclusive bounds, skipping
files already on 3.1 that actually pass. Only the parent changes ownership, after inspecting in-flight work.

| Writer | Job | Initially remaining | Inclusive ID bounds | Manifest |
|---|---|---:|---|---|
| `a02_small_first` | `A02` | 74 | `A02-13323`–`A02-31131` | `/tmp/paradigm-repass/parallel/continuous-lanes/a02_small_first.json` |
| `a02_small_second` | `A02` | 74 | `A02-31132`–`A02-33333` | `/tmp/paradigm-repass/parallel/continuous-lanes/a02_small_second.json` |
| `a03_early` | `A03` | 81 | `A03-13313`–`A03-31111` | `/tmp/paradigm-repass/parallel/continuous-lanes/a03_early.json` |
| `a03_mid` | `A03` | 80 | `A03-31112`–`A03-33333` | `/tmp/paradigm-repass/parallel/continuous-lanes/a03_mid.json` |
| `a04_early` | `A04` | 82 | `A04-13311`–`A04-23333` | `/tmp/paradigm-repass/parallel/continuous-lanes/a04_early.json` |
| `a04_mid` | `A04` | 81 | `A04-31111`–`A04-33333` | `/tmp/paradigm-repass/parallel/continuous-lanes/a04_mid.json` |

The complete lane plan is `/tmp/paradigm-repass/parallel/continuous-plan.json`; the shared protocol brief and
lessons are in `/tmp/paradigm-repass/parallel/writer-brief.md`. Temporary review queues, accepted hashes, and
checkpoint helpers are in that directory. The parent preserves all prior passing files and counts only reviewed
files included in the commit; newer local drafts can already pass structural validation without being counted yet.

On resume: inspect agent states and stable completed files; do not assume a completed agent means its lane is
finished. Reassign any unfinished lane immediately, skipping validated existing files, and keep the goal active.
As jobs finish, regenerate current insights from scratch (especially A02-A04), validate them, and move freed
writers to A05-A32. Every job requires 243 expected IDs; summaries need at least 200 passing interviews. Do not
stop at the end of a fixed-size tranche. Commit/push about every 30 minutes and before any interruption.

Latest checkpoint: 20 further interviews reviewed and validated (9 A02, 6 A03, 5 A04), for **2,116 total**.
A02 is 107/243, A03 91/243 and A04 88/243. Drafting uses the stronger workhorse model after
smaller-model defects required repair; smaller models perform read-only review. Supplemental checks now also
reject repeated answers, copied scenario summaries, empty bold spans and wrong opening names, and invoke
the actual repository validator. Targeted review corrected question order, age arithmetic, standalone quote
references and conditional action annotations. Original protected files remain unchanged. Fresh authoring
continues in the same lanes; unreviewed local drafts are excluded from these published counts.

An earlier short tranche added24 reviewed interviews (8 each in A02/A03/A04). After semantic tag
corrections, all24 passed validator, supplemental audit, profile and protected-file checks. Published checkpoint
counts at that checkpoint were 2,087 total: A02 95/243, A03 82/243, A04 80/243. No incomplete job has reached 200 yet.
Existing funds kept available are not save-more; union negotiation alone is not course completion; continued
paid work, actual applications, AI learning and practical training must use the tags actually supported.

## Working agreement

- Commit and push to `claude/repass-3.1` as you go; merge to `main` only after the full re-pass is finished and checked, per the current user's final instruction.
- The tree will not stay clean while agents are writing files — commits are snapshots of a moving target. That is fine.
- Do not run `next dev` for this data-only task; it can rewrite `AGENTS.md`, outside the current allowed changes.
