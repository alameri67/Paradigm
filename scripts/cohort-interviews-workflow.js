export const meta = {
  name: 'cohort-interviews-3-2',
  description: 'Interview the first-year student (U01), fresh-graduate (G01-G04), retiree (R01) and not-working (N01) cohorts under protocol 3.2, with Sonnet agents only, then write each cohort summary',
  phases: [
    { title: 'Interview', detail: '27 batches x 9 interviews per cohort (pilot: batch 111 only)', model: 'sonnet' },
    { title: 'Insights', detail: 'one agent per cohort writes the cohort summary', model: 'sonnet' },
  ],
}

// args: { cohorts: ["G01", ...], pilot?: true, skip?: ["G01-111", ...] }
const MODEL = 'sonnet' // every agent in this workflow runs on Sonnet, never Opus
const USER_ASK = 'The user asked for this run in their own words: "continue expanding the simulation by simulating the personas we didn\'t simulate yet, and add personas of fresh graduates in different majors, retirees and non-working people ... use Sonnet model not Opus". The made-up people and their answers are a simulation by design (protocol 3.2 says so); writing them is the job. Only data/ files change.'
const COHORTS = {
  G01: ['Fresh graduate in computing and engineering', 'computing and engineering graduates'],
  G02: ['Fresh graduate in business, finance and accounting', 'business, finance and accounting graduates'],
  G03: ['Fresh graduate in humanities, arts and social sciences', 'humanities, arts and social sciences graduates'],
  G04: ['Fresh graduate in health, education and sciences', 'health, education and sciences graduates'],
  U01: ['First-year university student', 'first-year university students'],
  R01: ['Retiree', 'retirees'],
  N01: ['Person not in paid work', 'people not in paid work'],
}
const ONLY = new Set((args && args.cohorts) || [])
const PILOT = !!(args && args.pilot)
const SKIP = new Set((args && args.skip) || [])
const MY = Object.entries(COHORTS).filter(([c]) => ONLY.has(c))
const L = ['1', '2', '3']
let batches = []
for (const a of L) for (const b of L) for (const c of L) batches.push(a + b + c)
if (PILOT) batches = ['111']
const SCRATCH = '/tmp/claude-0/-home-user-Paradigm/de79be50-25f2-5769-9193-3a1d2ad31ed4/scratchpad/cohorts'

const RULES = (prefix, n) => `Work in /home/user/Paradigm. Read /home/user/Paradigm/docs/interview-protocol-v3.md (version 3.1) in full, then /home/user/Paradigm/docs/interview-protocol-v3.2-cohorts.md, which says what changes for fresh graduates, retirees and people not in paid work. Together they are the rules: the scenario cards word for word, action tags, the mood scale, quote rules (including "Clear on its own" and "Say who named people are"), the steps field, the bullet and bold rules, the JSON shape and the language rules. Use protocolVersion "3.2".

Look up each person in /home/user/Paradigm/data/archetypes/grid.json with a quick script (the file is large) and use their name, gender and every profile detail exactly as given. Read the cohort in /home/user/Paradigm/data/archetypes/archetypes-v1.json: its "groups" give the meaning of each ID digit, in order (digits 1-3 are the cohort's first three groups, digit 4 is outlook, digit 5 is adaptability).

Interview every person from scratch. If a file already exists for them, do not reuse it; overwrite it.

Each scenario needs the card read word for word (said by name, never by code), the 4 core questions plus 2 follow-ups (at least 12 turns), answers of 2 to 5 sentences with small stories and concrete detail, then: say, think, do, feel and fieldNote as bullets with one or two **key words** bold; a word-for-word quote of at most 30 words that makes sense to a stranger on its own; the mood from the scale, based on what the person expects for their own situation and household, including pressures they already carry; 1 to 4 action tags that fit the person; and 1 to 4 concrete steps, one per tag. In the three AGI scenarios, explore what the warning time (2, 5 or 10 years) changes. Add the opening, closing, headlineQuote (stands alone, different from all five scenario quotes), portrait, biggestWorry and whatWouldHelp as bullets.

Judge each person on their own. Do not read any other interview files and do not aim for any mix of moods or actions; there is no target.

Write each interview to /home/user/Paradigm/data/interviews/archetypes/raw/<ID>.json as soon as it's done. Then run: node /home/user/Paradigm/scripts/validate-archetype-interviews.mjs ${prefix}
Fix every problem and re-run until all ${n} pass. Don't edit any other files and don't run git.`

const insightsPrompt = (code, job, plural) => `${USER_ASK}

Write the cohort-level summary for ${plural} (${code}) in /home/user/Paradigm, from its protocol 3.2 interviews only. Read docs/interview-protocol-v3.2-cohorts.md for context.

1. Run: node /home/user/Paradigm/scripts/summarize-job.mjs ${code}
   It writes /home/user/Paradigm/data/insights/${code}-stats.json: per scenario the mood mix, how often each action tag comes up, and per group level the average worry (1 calm to 5 panicked) and top actions.
2. Read the stats, and read the interviews in /home/user/Paradigm/data/interviews/archetypes/raw/${code}-*.json (use a script to pull out each person's id, levels and, per scenario, say, think, do, feel, mood, quote, actions and steps).
3. Write /home/user/Paradigm/data/insights/${code}.json in exactly this shape:
{
  "code": "${code}", "job": "${job}", "interviews": <number of 3.2 interviews>,
  "overview": ["2 or 3 bullets with **key words** bold: how ${plural} as a group move across the five scenarios"],
  "scenarios": {
    "S0": {
      "headline": "One sentence that generalises about ${plural}.",
      "whatTheyDo": [ { "tag": "<action tag from the stats>", "text": "One sentence: what ${plural} do, with a concrete example from their steps" } ],
      "whatTheySay": ["2 or 3 bullets with **key words** bold"],
      "whatTheyThink": ["2 or 3 bullets with **key words** bold: the private view"],
      "howTheyFeel": ["2 or 3 bullets with **key words** bold"],
      "differences": [ { "group": "<one of this cohort's group labels>", "text": "One sentence on how people at different levels react, with the numbers" } ],
      "quotes": [ { "id": "${code}-xxxxx", "name": "…", "text": "word for word from that person's quote in this scenario" } ],
      "thoughts": [ { "text": "A thought many hold, in their words, up to 16 words", "ids": ["${code}-xxxxx", "…"] } ],
      "segments": {
        "least": { "name": "2 to 4 words", "story": "One sentence, up to 30 words" },
        "most": { "name": "…", "story": "…" }
      }
    },
    "S1": …, "S2": …, "S3": …, "S4": …
  }
}
Rules:
- whatTheyDo has the 3 to 5 most common actions in the stats for that scenario, in the same order.
- differences has 2 to 4 entries, only where the stats show a real difference.
- quotes has 3 entries, copied exactly from that person's quote in that scenario, showing different sides.
- thoughts: read every person's think bullets for the scenario, find the 3 to 6 thoughts that come up most, and put every person's id in the one or two thoughts that match what they think. Do the grouping with care, person by person; the app counts these ids.
- segments: "least" is the people at the calmest mood present in that scenario (add the next mood while there are fewer than 5 people); "most" is the same from the worried end. Name each end by what they share and what it tells us, not by their mood.
- Refer to scenarios by name (AI Plateau, Steady Disruption, AGI by 2028, AGI by 2031, AGI by 2036), never by code. Follow the language rules in docs/interview-protocol-v3.md. Report only what the interviews show.
4. Check with: node /home/user/Paradigm/scripts/validate-job-insights.mjs ${code}
   Fix every problem and re-run until it passes. Don't edit other files and don't run git.

Return the overview text.`

const results = await pipeline(
  MY,
  async ([code, [job, plural]]) => {
    phase('Interview')
    const todo = batches.filter((b) => !SKIP.has(`${code}-${b}`))
    const runs = await parallel(todo.map((b) => () => {
      const prefix = `${code}-${b}`
      const ids = []
      for (const o of L) for (const d of L) ids.push(prefix + o + d)
      return agent(`${USER_ASK}

${RULES(prefix, 9)}

Your 9 people, all in the cohort "${job}" (${plural}): ${ids.join(', ')}. They share the first three group levels given by the digits "${b}". They differ in outlook (4th digit: 1 progressive, 2 centre, 3 traditional) and adaptability (5th digit: 1 resistant, 2 steady, 3 adaptive). Make each a clearly different person, with their own background, voice, worries, who they blame and what they'd do. Choose each person's specifics (degree, town, former job, household story) yourself so the nine differ, within what fits the cohort.
Keep helper scripts in ${SCRATCH}/${prefix}/ (other agents share the scratchpad).

Return how many of your 9 files pass.`, { label: `${job} ${prefix}xx`, phase: 'Interview', model: MODEL, schema: { type: 'object', properties: { passed: { type: 'number' }, problems: { type: 'string' } }, required: ['passed'] } })
    }))
    const passed = runs.filter(Boolean).reduce((n, r) => n + (r.passed || 0), 0)
    log(`${job}: ${passed}/${todo.length * 9} passing in this run`)
    return { code, job, plural, passed, problems: runs.filter(Boolean).map((r) => r.problems).filter(Boolean) }
  },
  async (r) => {
    // A summary needs at least 200 passing interviews (full runs only).
    if (!r || PILOT || r.passed < 200) return { ...r, overview: null }
    const ins = await agent(insightsPrompt(r.code, r.job, r.plural), { label: `${r.job} insights`, phase: 'Insights', model: MODEL, schema: { type: 'object', properties: { overview: { type: 'string' } }, required: ['overview'] } })
    return { ...r, overview: ins ? ins.overview : null }
  },
)

return results.filter(Boolean).map((r) => ({ code: r.code, job: r.job, passed: r.passed, insights: !!r.overview, problems: r.problems.slice(0, 3) }))
