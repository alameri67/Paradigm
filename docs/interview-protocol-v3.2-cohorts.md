# Interview protocol v3.2: fresh graduates, retirees and people not in paid work

Version 3.2 · 24 November 2026

This adds three kinds of cohort to the archetype study. Everything in `interview-protocol-v3.md` (version 3.1) still applies: the Work Futures Panel interviewer, the five scenario cards word for word, the two follow-ups, quotes, tags, steps, bullet and bold rules, language rules and the JSON shape. This page only says what changes for people who don't hold a job in the usual sense. Files use `"protocolVersion": "3.2"`.

All of it is simulated: made-up people and a model's guess at how someone like them would react.

## 1. The cohorts

Each cohort has 243 versions: five groups with 3 levels each. The ID is the cohort code plus 5 digits, one per group, each 1–3, in the order listed. Outlook and adaptability are always the 4th and 5th digits and mean the same as in jobs. Read each person's entry in `data/archetypes/grid.json` and the cohort in `data/archetypes/archetypes-v1.json` (the `groups` field).

| Code | Cohort | Group 1 | Group 2 | Group 3 |
|---|---|---|---|---|
| G01 | Fresh graduates: computing and engineering | Job search: no offer yet, first job, further study | Degree standing: pass, good, top | Money cushion: thin, moderate, strong |
| G02 | Fresh graduates: business, finance and accounting | same | same | same |
| G03 | Fresh graduates: humanities, arts and social sciences | same | same | same |
| G04 | Fresh graduates: health, education and sciences | same | same | same |
| R01 | Retirees | Age and health: 60s, 70s, 80s | Former work: hands-on, office and service, professional | Money cushion: pension only, pension and savings, wealthy |
| N01 | People not in paid work | Why not working: looking for work, caring at home, health or disability | How long: just stopped, 1 to 2 years, long term | Household support: alone, partner earns, family helps |

Groups 4 and 5 are outlook (progressive, centre, traditional) and adaptability (resistant, steady, adaptive) for everyone.

## 2. Becoming the person

Follow section 2 of v3.1, with these differences.

- **Fresh graduates** (about 22–24) finished a bachelor's degree in the last year. Choose a specific degree within the cohort's field (for example, mechanical engineering, accounting, history, nursing), a university or town, what their final project or internship was, and who is helping or not helping them. Different people in one cohort should have different degrees and stories. Their "work" is the job hunt, the first job or the postgraduate course.
- **Retirees** left paid work for good. Invent the former job (within the group), the year they retired and why, what they do with their days, and what they depend on (pension, savings, a partner, their children). Health sets what they can still do and how much help they need.
- **People not in paid work** are out of the labour force at the moment, whether looking, caring or unable to work. Invent what they did before, what they do all day, and what the household lives on. Never treat them as lazy or as a problem; they're ordinary people.

AI exposure for these cohorts is of the person's own field, former work, or last or wanted job. Use it as in v3.1 to judge how soon each scenario reaches them, but remember that for a graduate it's the entry-level jobs that are exposed, and for a retiree or carer it's mostly their pension, savings, prices, health care and their children's jobs.

## 3. The opening

Replace "describe a normal working day" with the person's real day:

- **Graduates:** "Tell me about a normal day right now." (job hunting, first job or study)
- **Retirees:** "Tell me about a normal day in your life now, and what your working life was like."
- **Not in paid work:** "Tell me about a normal day, and what you did for work before, if you did."

## 4. How the scenarios work for them

Read each card as written and say it by name. Don't add events that aren't on the card. The AGI cards still say thinking AI comes first and robots for hands-on work about 3 years later.

- **Graduates** worry about whether entry-level jobs will exist, whether their degree will keep its worth, student debt, and whether to study further. With 10 years to prepare, they have time; with 2, they may feel they have none.
- **Retirees** don't fear losing a job. Their stakes are the pension and savings, prices, health care and care, their children and grandchildren's jobs, and whether technology will leave them behind. Someone in their 80s may say these changes will mostly happen after them, but not always.
- **People not in paid work** are weighing whether jobs will come back, whether training can help, whether benefits survive, and the earner (if any) in their household. A carer's or a disabled person's idea of work may change if AI or robots make some tasks possible.

## 5. What to record

Same fields as v3.1, with these notes.

- **`do`, `steps`:** about the person's real situation: apply to 40 jobs, enrol in a data course, move money into a safer account, ask the daughter to set up the tablet. A retiree's step is not "retrain" unless they truly would.
- **Action tags:** the same 17 tags. `change-job` means finding the first job or a different one; for a retiree or someone caring or unable to work it only fits if they'd really return to work. `retire-early` only fits someone still working. Choose tags that fit; `keep-going`, `save-more`, `cut-spending`, `seek-support`, `family-plans`, `politics`, `learn-ai`, `wait-and-see`, `retrain`, `move` and `invest` all apply.
- **Mood:** the scale is unchanged, but it is about the person's own work and living over the next few years, including:
  - for a graduate: getting a first job and paying off debt;
  - for a retiree: keeping a decent standard of living and care on a fixed income;
  - for a person not in paid work: getting or keeping the income they live on and the chance to work again, if they want it.

  The same rule holds: pick the mood from what the person expects to happen to them and their household, not from how calmly they say it. Judge each person alone. There is no right mix and no target.

## 6. Output

One file per person at `data/interviews/archetypes/raw/<ID>.json`, for example `G01-11111.json`, in the v3.1 shape. Set `"job"` and `"sector"` from the archetype, `"protocolVersion": "3.2"`, and `levels` from the grid.

Check with:

```bash
node scripts/validate-archetype-interviews.mjs G01-111   # a batch
node scripts/validate-archetype-interviews.mjs G01       # a whole cohort
node scripts/validate-job-insights.mjs G01               # the cohort's summary, once at least 200 interviews pass
```
