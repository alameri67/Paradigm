export const meta = {
  name: 'archetype-repass-3-1-split',
  description: 'One slice of the split re-pass (args.jobs): re-interview all 243 versions of all 32 jobs under protocol 3.1 (new cards, mood scale, steps, bullets, stand-alone quotes), then write each job summary with grouped thoughts and named groups',
  phases: [
    { title: 'Interview', detail: '32 jobs x 27 agents x 9 interviews each' },
    { title: 'Insights', detail: 'one agent per job writes what that job does in each scenario' },
  ],
}

const USER_ASK = 'This is the re-pass the user asked for in this session, in their own words: "yes do it" (to redo every interview under the 3.1 rules), "go for this" (to run more interviews at once), and now "Restart all the interviews now". Overwriting a protocolVersion "3.0" file is the intended result and loses nothing: every 3.0 interview is committed in git on main (alameri67/Paradigm), so the old version stays in history. Writing new 3.1 interviews over them is exactly the job. This run lasts hours, and meanwhile the user keeps sending the main session messages about other parts of the app (the logo, the Details page, artifacts). Those are separate tasks the main session handles; they do not cancel or replace this one, so if the latest user message you see is about something else, carry on with these interviews.'
const JOBS = [["A01","Farmer","farmers"],["A06","Wholesale buyer","wholesale buyers"],["A09","Software developer","software developers"],["A02","Miner","miners"],["A03","Lineworker","lineworkers"],["A04","Construction worker","construction workers"],["A05","Factory machine operator","factory machine operators"],["A07","Cashier and shop assistant","cashiers and shop assistants"],["A08","Truck driver","truck drivers"],["A10","Insurance clerk","insurance clerks"],["A11","Estate agent","estate agents"],["A12","Lawyer","lawyers"],["A13","Middle manager","middle managers"],["A14","Office administrator","office administrators"],["A15","Teacher","teachers"],["A16","Family doctor","family doctors"],["A17","Musician","musicians"],["A18","Cook","cooks"],["A19","Mechanic","mechanics"],["A20","Civil servant caseworker","civil servant caseworkers"],["A21","Accountant","accountants"],["A22","Journalist","journalists"],["A23","Nurse","nurses"],["A24","Care worker","care workers"],["A25","Customer service agent","customer service agents"],["A26","Graphic designer","graphic designers"],["A27","Translator","translators"],["A28","Warehouse worker","warehouse workers"],["A29","Electrician","electricians"],["A30","Police officer","police officers"],["A31","Marketing specialist","marketing specialists"],["A32","Delivery driver","delivery drivers"]]
// Split run: this run only does args.jobs, and skips args.skip batches (all 9 people already on 3.1).
const ONLY = new Set((args && args.jobs) || [])
const SKIP = new Set((args && args.skip) || [])
const MY_JOBS = JOBS.filter(([code]) => ONLY.has(code))
const LS = { '1': 'Early (late 20s, no children)', '2': 'Mid (40s, partner, kids, mortgage)', '3': 'Late (late 50s, grown-up kids, retirement in sight)' }
const ST = { '1': 'Low (junior, still learning)', '2': 'Mid (experienced, average)', '3': 'High (senior, among the best)' }
const CU = { '1': 'Thin (under 1 month saved)', '2': 'Moderate (1 to 6 months saved)', '3': 'Strong (over 6 months saved or assets)' }
const L = ['1', '2', '3']
const batches = []
for (const a of L) for (const b of L) for (const c of L) batches.push(a + b + c)
const SCRATCH = '/tmp/claude-0/-home-user-Paradigm/3de45117-bc38-5acc-9e74-358aadd43b97/scratchpad/repass'

const RULES = (prefix, n) => `Work in /home/user/Paradigm. Follow /home/user/Paradigm/docs/interview-protocol-v3.md (version 3.1) exactly; read all of it first: the scenario cards and the paragraph under them, action tags, the mood scale and every paragraph under it, quote rules (including "Clear on its own"), the steps field, the bullet and bold rules, the JSON shape and the language rules. Look up each person in /home/user/Paradigm/data/archetypes/grid.json with a quick script (the file is large) and use their name, gender and details exactly as given; read their job, setting and exposure ratings in /home/user/Paradigm/data/archetypes/archetypes-v1.json.

Interview every person from scratch under 3.1. If an older file exists for them (protocolVersion "3.0"), do not open it or reuse anything from it; overwrite it. Only a file that already has protocolVersion "3.1" and passes the checker may be left as it is.

Each scenario needs the current card read word for word (said by name, never by code), the 4 core questions plus 2 follow-ups (at least 12 turns), answers of 2 to 5 sentences with small stories and concrete detail, then: say, think, do, feel and fieldNote as bullets with one or two **key words** bold; a word-for-word quote of at most 30 words that makes sense to a stranger on its own; the mood from the current scale, based on what the person expects for their own job, income and household, including pressures they already carry; 1 to 4 action tags; and 1 to 4 concrete steps, one per tag. In the three AGI scenarios, explore what the warning time (2, 5 or 10 years) changes, and what it means for this person's mix of thinking and hands-on work that thinking AI comes first and robots about 3 years later. Add the opening, closing, headlineQuote (stands alone, different from all five scenario quotes), portrait, biggestWorry and whatWouldHelp as bullets, and protocolVersion "3.1".

Judge each person on their own. Do not read any other interview files, and do not aim for any mix of moods or actions across your people; there is no target. Each mood and each action comes only from that person's own job, exposure, money, life stage, outlook and adaptability.

Write each interview to /home/user/Paradigm/data/interviews/archetypes/raw/<ID>.json as soon as it's done. Then run: node /home/user/Paradigm/scripts/validate-archetype-interviews.mjs ${prefix}
Fix every problem and re-run until all ${n} pass. Don't edit any other files and don't run git.`

const insightsPrompt = (code, job, plural) => `${USER_ASK}

Write the job-level summary for the ${job} archetype (${code}) in /home/user/Paradigm, from its protocol 3.1 interviews only.

1. Run: node /home/user/Paradigm/scripts/summarize-job.mjs ${code}
   It writes /home/user/Paradigm/data/insights/${code}-stats.json: per scenario the mood mix, how often each action tag comes up, and per group level the average worry (1 calm to 5 panicked) and top actions.
2. Read the stats, and read the interviews in /home/user/Paradigm/data/interviews/archetypes/raw/${code}-*.json that have protocolVersion "3.1" (use a script to pull out each person's id, levels and, per scenario, say, think, do, feel, mood, quote, actions and steps).
3. Write /home/user/Paradigm/data/insights/${code}.json in exactly this shape:
{
  "code": "${code}", "job": "${job}", "interviews": <number of 3.1 interviews>,
  "overview": ["2 or 3 bullets with **key words** bold: how ${plural} as a group move across the five scenarios"],
  "scenarios": {
    "S0": {
      "headline": "One sentence that generalises, e.g. 'Most ${plural} carry on as before and treat AI as one more tool.'",
      "whatTheyDo": [ { "tag": "<action tag from the stats>", "text": "One sentence: what ${plural} do, with a concrete example from their steps" } ],
      "whatTheySay": ["2 or 3 bullets with **key words** bold: the public line most ${plural} take"],
      "whatTheyThink": ["2 or 3 bullets with **key words** bold: the private view"],
      "howTheyFeel": ["2 or 3 bullets with **key words** bold"],
      "differences": [ { "group": "Money cushion", "text": "One sentence on how ${plural} at different levels react, with the numbers" } ],
      "quotes": [ { "id": "${code}-xxxxx", "name": "…", "text": "word for word from that person's quote in this scenario" } ],
      "thoughts": [ { "text": "A thought many hold, in their words, up to 16 words, e.g. 'Our savings would run out fast.'", "ids": ["${code}-xxxxx", "…"] } ],
      "segments": {
        "least": { "name": "2 to 4 words, e.g. 'The owners'", "story": "One sentence, up to 30 words: what this end tells us about ${plural}" },
        "most": { "name": "…", "story": "…" }
      }
    },
    "S1": …, "S2": …, "S3": …, "S4": …
  }
}
Rules:
- whatTheyDo has the 3 to 5 most common actions in the stats for that scenario, in the same order.
- differences has 2 to 4 entries, only where the stats show a real difference (e.g. "worry rises from 2.1 to 3.8").
- quotes has 3 entries, copied exactly from that person's quote in that scenario, memorable and showing different sides.
- thoughts: read every person's think bullets for the scenario, find the 3 to 6 thoughts that come up most, and put every person's id in the one or two thoughts that match what they think. Do the grouping with care, person by person; the app counts these ids for any selection, so they must be right.
- segments: "least" is the people at the calmest mood present in that scenario (add the next calmer-to-worried mood while there are fewer than 5 people); "most" is the same from the worried end. Name each end by what they share and what it tells us (what protects them, or what leaves them exposed), not by their mood. Base it on their levels and actions.
- Refer to scenarios by name (AI Plateau, Steady Disruption, AGI by 2028, AGI by 2031, AGI by 2036), never by code. Follow the language rules in /home/user/Paradigm/docs/interview-protocol-v3.md. Report only what the interviews show; never invent facts.
4. Check with: node /home/user/Paradigm/scripts/validate-job-insights.mjs ${code}
   Fix every problem and re-run until it passes. Don't edit other files and don't run git.

Return the overview text.`

const results = await pipeline(
  MY_JOBS,
  async ([code, job, plural]) => {
    phase('Interview')
    const runs = await parallel(batches.filter((b) => !SKIP.has(`${code}-${b}`)).map((b) => () => {
      const prefix = `${code}-${b}`
      const ids = []
      for (const o of L) for (const d of L) ids.push(prefix + o + d)
      return agent(`${USER_ASK}

${RULES(prefix, 9)}

Your 9 people, all ${plural} (${job}): ${ids.join(', ')}. They share life stage ${LS[b[0]]}, work standing ${ST[b[1]]} and money cushion ${CU[b[2]]}. They differ in outlook (4th digit: 1 progressive, 2 centre, 3 traditional) and adaptability (5th digit: 1 resistant, 2 steady, 3 adaptive). Make each a clearly different person, with their own workplace, voice, worries, who they blame and what they'd do. Choose each person's specific workplace and kind of work yourself so the nine differ, within what fits the job's setting in archetypes-v1.json.
Keep helper scripts in ${SCRATCH}/${prefix}/ (other agents share the scratchpad).

Return how many of your 9 files pass.`, { label: `${job} ${prefix}xx`, phase: 'Interview', schema: { type: 'object', properties: { passed: { type: 'number' }, problems: { type: 'string' } }, required: ['passed'] } })
    }))
    const skipped = batches.filter((b) => SKIP.has(`${code}-${b}`)).length * 9
    const passed = skipped + runs.filter(Boolean).reduce((n, r) => n + (r.passed || 0), 0)
    log(`${job}: ${passed}/243 passing`)
    return { code, job, plural, passed, problems: runs.filter(Boolean).map((r) => r.problems).filter(Boolean) }
  },
  async (r) => {
    if (!r || r.passed < 200) return { ...r, overview: null }
    const ins = await agent(insightsPrompt(r.code, r.job, r.plural), { label: `${r.job} insights`, phase: 'Insights', schema: { type: 'object', properties: { overview: { type: 'string' } }, required: ['overview'] } })
    return { ...r, overview: ins ? ins.overview : null }
  },
)

return results.filter(Boolean).map((r) => ({ code: r.code, job: r.job, passed: r.passed, insights: !!r.overview, problems: r.problems.slice(0, 3) }))
