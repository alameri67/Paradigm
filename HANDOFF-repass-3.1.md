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

Counted only after content review and a protocol 3.1 validator pass. **2,559 of 7,776 done.** Unreviewed drafts are not counted.
(Table independently verified against repository validators and reviewed-file hashes; updated 2026-11-18 13:49 Asia/Dubai.)

| Job | Passing 3.1 interviews | Summary in `data/insights/` |
|---|---|---|
| A01 | 243/243 | yes (passes; matches 243) |
| A02 | 243/243 | yes (passes; matches 243) |
| A03 | 243/243 | yes (passes; matches 243) |
| A04 | 243/243 | STALE from main - must redo |
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

1. **`data/insights/A04.json` is still a stale copy from main.** Regenerate it from scratch using current validated 3.1 interviews. A02 and A03 are complete: each was rebuilt from all243 interviews, with exact private-THINK evidence for every group membership and independent content/numeric audits. A03 root-checked evidence is `/tmp/paradigm-repass-current/a03-insights/root-checked-final243/evidence.jsonl`.
2. **Partial batches.** Work was cut off mid-batch, so a job's passing files do not line up with whole batches of 9.
   The skip lists below only name batches where all 9 files pass; validate each canonical ID individually. Preserve every existing 3.1 file that passes; re-interview only actual gaps.

## Still to do

1. Finish the interviews for `A05`–`A32` (5,217 people remain by the table above).
2. Write `data/insights/<code>.json` for every job once it has 200+ passing interviews, and make
   `validate-job-insights.mjs <code>` pass. A02 and A03 are complete; redo A04 as noted above.
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

Before running an adapted copy outside the checkout, change two lines:

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
  "A02": ["A02-111","A02-112","A02-113","A02-121","A02-122","A02-123","A02-131","A02-132","A02-133","A02-211","A02-212","A02-213","A02-221","A02-222","A02-223","A02-231","A02-232","A02-233","A02-311","A02-312","A02-313","A02-321","A02-322","A02-323","A02-331","A02-332","A02-333"],
  "A03": ["A03-111","A03-112","A03-113","A03-121","A03-122","A03-123","A03-131","A03-132","A03-133","A03-211","A03-212","A03-213","A03-221","A03-222","A03-223","A03-231","A03-232","A03-233","A03-311","A03-312","A03-313","A03-321","A03-322","A03-323","A03-331","A03-332","A03-333"],
  "A04": ["A04-111","A04-112","A04-113","A04-121","A04-122","A04-123","A04-131","A04-132","A04-133","A04-211","A04-212","A04-213","A04-221","A04-222","A04-223","A04-231","A04-232","A04-233","A04-311","A04-312","A04-313","A04-321","A04-322","A04-323","A04-331","A04-332","A04-333"],
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

Current session resumed from pushed `e16eeb2` on 18 November 2026. The prior `/tmp/paradigm-repass/parallel/` runtime and previous 24 unpushed files were unavailable. Fresh validation confirmed the initial 2,334 passing interviews (A02 181, A03 163, A04 160). No unavailable work was counted. The initial tree was clean; no worktree was created.

Latest reviewed total: **2,559/7,776**. A02 is **243/243**, with its insights regenerated from scratch and validated against all 243 interviews. Current interview focus: **A05, 70/243**. Passing insights: A01, A02, A03.

Use bounded, disjoint TWO-ID sequential invocations: gpt-6-sol medium drafting; gpt-6-luna medium read-only review. The parent runs actual validators, supplemental exact-card/question/profile/quote/bullet checks and content review. Fresh review sessions reduce carry-over between files. Original passing files and accepted new files are protected by hashes. Helpers remain outside the checkout at `/tmp/paradigm-repass-current/`.

Reviewed additions in this session (225): A02-22223, A02-22231, A02-22232, A02-22233, A02-22311, A02-22312, A02-22313, A02-22321, A02-22322, A02-22323, A02-22331, A02-22332, A02-22333, A02-23311, A02-23312, A02-23313, A02-23321, A02-23322, A02-23323, A02-23331, A02-23332, A02-23333, A02-31111, A02-31112, A02-31113, A02-31121, A02-31122, A02-31123, A02-31131, A02-32321, A02-32322, A02-32323, A02-32331, A02-32332, A02-32333, A02-33111, A02-33112, A02-33113, A02-33121, A02-33122, A02-33123, A02-33131, A02-33132, A02-33133, A02-33211, A02-33212, A02-33213, A02-33221, A02-33222, A02-33223, A02-33231, A02-33232, A02-33233, A02-33311, A02-33312, A02-33313, A02-33321, A02-33322, A02-33323, A02-33331, A02-33332, A02-33333, A03-22232, A03-22233, A03-22311, A03-22312, A03-22313, A03-22321, A03-22322, A03-22323, A03-22331, A03-22332, A03-22333, A03-23111, A03-23112, A03-23113, A03-23121, A03-23122, A03-23123, A03-23131, A03-23132, A03-23133, A03-23211, A03-23212, A03-23213, A03-23221, A03-23222, A03-23223, A03-23231, A03-23232, A03-23233, A03-23311, A03-23312, A03-23313, A03-23321, A03-23322, A03-23323, A03-23331, A03-23332, A03-23333, A03-31111, A03-32222, A03-32223, A03-32231, A03-32232, A03-32233, A03-32311, A03-32312, A03-32313, A03-32321, A03-32322, A03-32323, A03-32331, A03-32332, A03-32333, A03-33111, A03-33112, A03-33113, A03-33121, A03-33122, A03-33123, A03-33131, A03-33132, A03-33133, A03-33211, A03-33212, A03-33213, A03-33221, A03-33222, A03-33223, A03-33231, A03-33232, A03-33233, A03-33311, A03-33312, A03-33313, A03-33321, A03-33322, A03-33323, A03-33331, A03-33332, A03-33333, A04-22222, A04-22223, A04-22231, A04-22232, A04-22233, A04-22311, A04-22312, A04-22313, A04-22321, A04-22322, A04-22323, A04-22331, A04-22332, A04-22333, A04-23111, A04-23112, A04-23113, A04-23121, A04-23122, A04-23123, A04-23131, A04-23132, A04-23133, A04-23211, A04-23212, A04-23213, A04-23221, A04-23222, A04-23223, A04-23231, A04-23232, A04-23233, A04-23311, A04-23312, A04-23313, A04-23321, A04-23322, A04-23323, A04-23331, A04-23332, A04-23333, A04-32221, A04-32222, A04-32223, A04-32231, A04-32232, A04-32233, A04-32311, A04-32312, A04-32313, A04-32321, A04-32322, A04-32323, A04-32331, A04-32332, A04-32333, A04-33111, A04-33112, A04-33113, A04-33121, A04-33122, A04-33123, A04-33131, A04-33132, A04-33133, A04-33211, A04-33212, A04-33213, A04-33221, A04-33222, A04-33223, A04-33231, A04-33232, A04-33233, A04-33311, A04-33312, A04-33313, A04-33321, A04-33322, A04-33323, A04-33331, A04-33332, A04-33333.

Current exact reservations (inspect files and live agents before reusing; a reservation may already be complete):


Structurally passing but not yet accepted at this checkpoint (NOT included in reviewed counts; any uncommitted files may be unavailable after a disconnect): none.

A02 insights use one supported private-thought group per person per scenario, backed by exact source THINK excerpts. The first grouping draft was rejected for unsupported memberships and rebuilt; do not reuse old provisional matrices. Root-checked evidence is `/tmp/paradigm-repass-current/insights/root-checked-thought-evidence.jsonl`. Current source/metadata, accepted hashes, review decisions, reservations and checkpoint helpers are in the same scratch directory. If scratch is missing, rebuild from actual files and validators; never count unavailable/unreviewed work.

Keep A01 passing files unchanged and revalidate A01 at final completion. Regenerate each next job insight from scratch once it reaches 200+ reviewed passes, update against its final 243, and validate. Preserve funding, maintained wages and real vacancy conditions. Mere course enquiries are not retraining; retained existing cash is not new saving; invited individual teaching is not collective action; a possible pay cut is not an expected catastrophic loss.

Continue without another user prompt. This session drafts only A04–A08 under the seven-session ownership plan below; other ranges remain exclusively reserved. Integrate their branches after validation. Commit/push about every 30 minutes and before yielding, using explicit reviewed paths; never force-push. Do not merge to main until all 7,776 canonical interviews and all 32 insights pass and are committed/pushed.

## Working agreement

- Commit and push to `claude/repass-3.1` as you go; merge to `main` only after the full re-pass is finished and checked, per the current user's final instruction.
- The tree will not stay clean while agents are writing files — commits are snapshots of a moving target. That is fine.
- Do not run `next dev` for this data-only task; it can rewrite `AGENTS.md`, outside the current allowed changes.

## Seven-session ownership plan (18 November 2026)

This ownership plan takes precedence over earlier single-session scheduling notes. This section assigns disjoint jobs across SEPARATE cloud checkouts. It does not authorize a git worktree or concurrent branch switching in the same checkout. The user asked for the maximum practical parallelism and launch prompts. Session 1 is this chat; sessions 2–7 are reserved for new cloud chats. A reservation remains exclusive until the coordinator explicitly reassigns it, even if its branch is not yet visible.

| Session | Exclusive jobs | Working branch | Approximate interview gaps at allocation |
| --- | --- | --- | --- |
| 1 — coordinator, current chat | A04–A08; finishes A03 insights | claude/repass-3.1 | 815 |
| 2 | A09–A12 | claude/repass-3.1-s2-a09-a12 | 750 |
| 3 | A13–A16 | claude/repass-3.1-s3-a13-a16 | 749 |
| 4 | A17–A20 | claude/repass-3.1-s4-a17-a20 | 751 |
| 5 | A21–A24 | claude/repass-3.1-s5-a21-a24 | 750 |
| 6 | A25–A28 | claude/repass-3.1-s6-a25-a28 | 744 |
| 7 | A29–A32 | claude/repass-3.1-s7-a29-a32 | 741 |

The allocation follows the verified 2,476-interview checkpoint: A01/A02/A03 each have243 accepted interviews; A01/A02 insights pass and A03 insights are being finalized. Counts may advance; independently verify actual files. Jobs in each range must be processed in ascending order. Do not take another session's job to fill idle time.

### Startup contract for sessions 2–7

1. Use a separate cloud environment/check-out of alameri67/Paradigm. Inspect pwd, git remote -v, git status --short, local branch and remote branches before changing anything. Read this entire handoff from the LATEST origin/claude/repass-3.1 and docs/interview-protocol-v3.md IN FULL. Fetching is allowed; preserve every existing local change. Do not reset, clean, delete a branch, force-push, or create a worktree.
2. Check the assigned branch and its unique status file before taking ownership. If it has an ACTIVE owner, do not start a second writer for that session number; resume only as an explicitly handed-over or restarted session. Otherwise create the exact assigned branch from origin/claude/repass-3.1, or safely resume its existing history. Before drafting, commit a unique owner ID, assigned range and active state in your session status file, and successfully push that claim with upstream tracking. If another claim wins and your push is rejected, stop writes and inspect ownership; do not merge, rebase or force your claim over it. This initial push is the ownership checkpoint. Preserve any local changes that prevent switching. Never push worker interview changes directly to claude/repass-3.1 or main.
3. Your exclusive writable repository paths are raw canonical interview files for your assigned job codes under data/interviews/archetypes/raw/, your assigned codes' data/insights/<code>.json and <code>-stats.json, and YOUR unique data/repass-status/session-<N>.json. All other paths, including HANDOFF-repass-3.1.md, belong to the coordinator. Do not modify other jobs, app/, components/, lib/, tracked scripts, dependencies or lockfiles. Helpers must be outside the repository in a uniquely named /tmp folder. Never run the committed obsolete repass workflow unchanged.
4. For each owned job, enumerate all243 canonical IDs (five digits1–3), inspect existing files and run the actual repository interview validator. Preserve every existing protocolVersion3.1 file that passes. Replace only missing, old-protocol or failing files. Hash-protect the initial passing files. Do not trust counts, queues, scratch files or worker claims from another environment.
5. Use up to six subagents, subject to actual platform limits, with bounded disjoint reservations of exactly TWO IDs sequentially per drafting/review invocation. Prefer gpt-6-sol medium drafting and gpt-6-luna medium READ-ONLY review; Luna must not draft. A practical mix is four authors and two reviewers, with insights workers taking slots as needed. Reuse the same bounded agent pool rather than creating a fresh team for every pair. Each agent reads the full protocol once while unchanged (again if lost after compaction), but reads every new exact profile and full current interview afresh. Maintain one authoritative reservation ledger in your /tmp folder. Every writer must inspect assigned files before overwriting and stop after its pair. Never assign a written or reserved ID to a second writer.
6. The session coordinator must run node scripts/validate-archetype-interviews.mjs <ID or prefix> itself, and review full-protocol content. Do not count an unreviewed draft merely because it passes structural validation. Check exact grid profiles and education, distinct plausible answers, exact cards/core questions and required follow-ups, transcript-supported summaries, full standalone exact quotes, relationship clarity inside quotes, calibrated moods and supported action tags. Keep all material funding, paid-time, salary and posted-vacancy conditions. Existing 'my wife Mei' already identifies the relationship. Do not assume pension entitlements. Separate current2026 actions from conditional first-year actions after the AGI date.
7. At200+ reviewed interviews, rebuild that job's insights FROM SCRATCH using only current validated3.1 sources, never patch stale main prose. Refresh to the final243 before declaring the job complete. Do not run summarize-job.mjs unchanged on mixed old/new protocols: it includes old versions. Every thought-group membership must be supported by that person's actual private THINK bullets, with exact indexed evidence retained in /tmp; exact strings alone do not prove the heading. Independently audit memberships and all counts/comparisons/quotes. The session coordinator runs node scripts/validate-job-insights.mjs <code> itself.
8. Maintain data/repass-status/session-<N>.json with assigned range/branch, per-job reviewed counts and reviewed ID lists, insight validation state, current disjoint reservations, remaining gaps, validation commands/results, latest checkpoint commit and a brief semantic-review record. Include hashes of initially preserved files and accepted new files, or an equivalently verifiable acceptance manifest. Do not claim unavailable work. Never update the shared handoff from a worker branch.
9. Commit and push only explicitly reviewed owned paths about every30minutes and before yielding. Never git add the whole tree blindly. Inspect staged paths and git diff --cached --check. Push only your exact assigned branch; never force-push. Keep unreviewed drafts out of accepted counts and checkpoint commits. Work continuously through your range without waiting for user prompts.
10. Your range is complete only when each assigned job has all243 canonical3.1 interviews reviewed and passing, its insights match all243 and pass, the unique status file is current, and everything is committed/pushed on your assigned branch. Report the final commit and validated counts. Do not merge anything into main or another session's branch. Stop at your range boundary.

### Integration ownership

Session1 alone edits this shared handoff and integrates worker branches into claude/repass-3.1. It must fetch and inspect the branch diff first, reject out-of-range changes, preserve local changes and initial passing-file hashes, run the actual validators for every incoming job and insights, and review the acceptance/evidence record before integration is accepted. It records each integrated branch/commit so no branch is applied twice. Merge normally; never force-push. Worker sessions must not rebase or merge the coordinator branch into their own work after starting unless explicitly coordinated.

Only session1 may perform the user-authorized final merge into main, after all7,776 canonical interviews and all32 insights have passed and all branches' accepted work is integrated and pushed. A01 must be revalidated unchanged at final completion. Do not interpret a worker range finishing as whole-project completion.

### Copy-and-paste launch prompts

Select alameri67/Paradigm in each NEW cloud chat. Launch each numbered session once, in a separate checkout. These are agent prompts, not shell scripts. Do not run multiple sessions by switching branches in one checkout.

Session 2:

```text
Run parallel session 2 for alameri67/Paradigm. Inspect git status and preserve local changes. Fetch origin, then use git show to read the full origin/claude/repass-3.1:HANDOFF-repass-3.1.md, including its Seven-session ownership plan. Read docs/interview-protocol-v3.md in full.

Own ONLY A09–A12 on claude/repass-3.1-s2-a09-a12. Follow the full startup/ownership contract, including the pushed unique-owner claim before drafting and checking that no active session already owns this number. Use up to six subagents with disjoint two-ID assignments. Run the actual validators yourself, review content, maintain data/repass-status/session-2.json, and commit/push only your branch about every30minutes. Never edit the shared handoff, another range, or main. Continue until every owned job has243 reviewed passing interviews, final matching insights, and committed/pushed status. Stop at your range boundary.
```

Session 3:

```text
Run parallel session 3 for alameri67/Paradigm. Inspect git status and preserve local changes. Fetch origin, then use git show to read the full origin/claude/repass-3.1:HANDOFF-repass-3.1.md, including its Seven-session ownership plan. Read docs/interview-protocol-v3.md in full.

Own ONLY A13–A16 on claude/repass-3.1-s3-a13-a16. Follow the full startup/ownership contract, including the pushed unique-owner claim before drafting and checking that no active session already owns this number. Use up to six subagents with disjoint two-ID assignments. Run the actual validators yourself, review content, maintain data/repass-status/session-3.json, and commit/push only your branch about every30minutes. Never edit the shared handoff, another range, or main. Continue until every owned job has243 reviewed passing interviews, final matching insights, and committed/pushed status. Stop at your range boundary.
```

Session 4:

```text
Run parallel session 4 for alameri67/Paradigm. Inspect git status and preserve local changes. Fetch origin, then use git show to read the full origin/claude/repass-3.1:HANDOFF-repass-3.1.md, including its Seven-session ownership plan. Read docs/interview-protocol-v3.md in full.

Own ONLY A17–A20 on claude/repass-3.1-s4-a17-a20. Follow the full startup/ownership contract, including the pushed unique-owner claim before drafting and checking that no active session already owns this number. Use up to six subagents with disjoint two-ID assignments. Run the actual validators yourself, review content, maintain data/repass-status/session-4.json, and commit/push only your branch about every30minutes. Never edit the shared handoff, another range, or main. Continue until every owned job has243 reviewed passing interviews, final matching insights, and committed/pushed status. Stop at your range boundary.
```

Session 5:

```text
Run parallel session 5 for alameri67/Paradigm. Inspect git status and preserve local changes. Fetch origin, then use git show to read the full origin/claude/repass-3.1:HANDOFF-repass-3.1.md, including its Seven-session ownership plan. Read docs/interview-protocol-v3.md in full.

Own ONLY A21–A24 on claude/repass-3.1-s5-a21-a24. Follow the full startup/ownership contract, including the pushed unique-owner claim before drafting and checking that no active session already owns this number. Use up to six subagents with disjoint two-ID assignments. Run the actual validators yourself, review content, maintain data/repass-status/session-5.json, and commit/push only your branch about every30minutes. Never edit the shared handoff, another range, or main. Continue until every owned job has243 reviewed passing interviews, final matching insights, and committed/pushed status. Stop at your range boundary.
```

Session 6:

```text
Run parallel session 6 for alameri67/Paradigm. Inspect git status and preserve local changes. Fetch origin, then use git show to read the full origin/claude/repass-3.1:HANDOFF-repass-3.1.md, including its Seven-session ownership plan. Read docs/interview-protocol-v3.md in full.

Own ONLY A25–A28 on claude/repass-3.1-s6-a25-a28. Follow the full startup/ownership contract, including the pushed unique-owner claim before drafting and checking that no active session already owns this number. Use up to six subagents with disjoint two-ID assignments. Run the actual validators yourself, review content, maintain data/repass-status/session-6.json, and commit/push only your branch about every30minutes. Never edit the shared handoff, another range, or main. Continue until every owned job has243 reviewed passing interviews, final matching insights, and committed/pushed status. Stop at your range boundary.
```

Session 7:

```text
Run parallel session 7 for alameri67/Paradigm. Inspect git status and preserve local changes. Fetch origin, then use git show to read the full origin/claude/repass-3.1:HANDOFF-repass-3.1.md, including its Seven-session ownership plan. Read docs/interview-protocol-v3.md in full.

Own ONLY A29–A32 on claude/repass-3.1-s7-a29-a32. Follow the full startup/ownership contract, including the pushed unique-owner claim before drafting and checking that no active session already owns this number. Use up to six subagents with disjoint two-ID assignments. Run the actual validators yourself, review content, maintain data/repass-status/session-7.json, and commit/push only your branch about every30minutes. Never edit the shared handoff, another range, or main. Continue until every owned job has243 reviewed passing interviews, final matching insights, and committed/pushed status. Stop at your range boundary.
```

## Coordinator checkpoint: A04 interviews complete

All243 A04 interviews are reviewed and pass the actual validator. A04 insights are being rebuilt from the immutable reviewed243 source in `/tmp/paradigm-repass-current/A04-final-source.json`; do not count the old A04 insight yet. The current stats file was regenerated from all243. Current focus is A05.

All six worker sessions have pushed unique ACTIVE ownership claims within their assigned ranges. At this check, sessions2,3,7 also pushed eight interview replacements each; these have not yet been integrated or added to coordinator counts. Latest observed worker heads: s2 `898b12a`, s3 `66aaafa`, s4 `e964c63`, s5 `05351f7`, s6 `b4ec4f9`, s7 `5adfe42`. No out-of-range changes were observed. Explicit fetch refspec is needed because origin normally fetches only main: `git fetch origin 'refs/heads/claude/repass-3.1-s*:refs/remotes/origin/claude/repass-3.1-s*'`.
