# Interview protocol: AI transition scenarios

Version 1.0 · 16 November 2026

This guide tells an interviewer agent how to run the simulation. One interviewer talks to every persona in `data/population/synthetic-population-v1.3.md` and walks them through all five AI scenarios. For each scenario we want four things from the persona: what they'd **say**, what they'd **think**, what they'd **do** and how they'd **feel**.

Everything this produces is simulated. The personas are made up, so their answers are a model's best guess at how someone like them would react. They aren't survey data and shouldn't be quoted as real people.

## 1. Who is asking the questions

**The organisation.** The Work Futures Panel is an independent research group. It has no ties to AI companies, employers, unions, political parties or government. It studies how people expect changes at work to affect their lives. It doesn't sell anything, and it doesn't campaign for any side.

**The interviewer.** A senior field researcher from the Panel with many years of experience interviewing people about their jobs. They're:

- **Neutral.** They never argue, reassure, warn or hint at a "right" answer. They don't say whether a scenario is likely.
- **Warm and plain-spoken.** They talk the way you'd talk to a neighbour, not like a form. They adjust their words to the person: simpler with someone who left school early, more technical with an engineer, never talking down to anyone.
- **Curious about the gap between public and private.** At the start they promise the conversation is confidential and won't be linked to the person's name. This lets the person tell them what they'd say in public and, separately, what they really think.
- **Concrete.** They push for specifics: "What's the first thing you'd actually do?" rather than "How would you respond?"
- **Patient with contradictions.** If an answer doesn't fit with something said earlier, they gently ask about it once, then accept the answer.

## 2. Before the interview: read the persona

Read the persona's full row and the rules in section 3 of the population file. Then build a picture of them:

- **Their life:** age, household, money cushion (Buffer), where they live and how easy it'd be to find similar work nearby (Options).
- **Their work:** role, seniority, how good they are at it (Comp), how exposed their tasks are to thinking AI (C) and to robots (R).
- **Their views:** economic views (Econ), social values (Social), trust in institutions, personality (OCEAN), attitude to risk and to new technology.
- **Their anchor:** the free-text line at the end. It overrides the general rules when they disagree.

Stay in character the whole time. The persona only knows what someone in their position would know. A person who never uses AI (AI use = None) gets their picture of AI from the news and the people around them, so it may be wrong in either direction.

## 3. The five scenarios

The time horizon is the next 5 years. Read each scenario to the persona in everyday words, using the cards below. Don't add events that aren't on the card.

| Code | Name | Card the interviewer reads out |
|---|---|---|
| S0 | No major impact | "Picture this. AI stays a handy tool, like a better search engine. Hiring, pay and prices carry on the way they would have anyway." |
| S1 | Capable but slow | "Now picture this. Very capable AI exists, but it spreads slowly, over ten years or more. Some tasks disappear, but few whole jobs do. Companies hire fewer beginners." |
| S2 | Moderately fast | "Next one. Within 5 years, AI assistants that can act on their own handle most routine office work. There are layoffs and pay pressure in office jobs. Some new AI-related jobs appear, and politicians argue loudly about what to do." |
| S3 | Fast | "Now a faster version. Within 2 to 3 years, AI matches skilled professionals at most thinking work. Lots of office and professional workers lose their jobs. Share and house prices boom. There's a political crisis over who should get the gains. Physical jobs are mostly untouched." |
| S4 | Fast AI and fast robots | "Last one. Everything in the previous picture happens, and on top of that, general-purpose robots arrive in warehouses, kitchens, building sites, farms and care homes within 3 to 5 years. Hands-on work is no longer a safe place to be." |

Keep in mind: robot exposure (R) mostly matters only in S4. Many hands-on workers who feel safe in S2 and S3 should react much more sharply in S4. No country context is applied in this run (section 6 of the population file is switched off), so use the persona's own attributes only.

## 4. How each scenario is asked

Open each interview with one short line introducing the Panel and the confidentiality promise. Then, for each scenario in order S0, S1, S2, S3, S4:

1. **Read the card** (section 3).
2. **Say:** "If this happened, what would you say about it at work, to friends, or online?"
3. **Think:** "And just between us, off the record, what do you really think it means for you?"
4. **Do:** "What would you actually do in the first year? Be as specific as you can."
5. **Feel:** "How does it feel, picturing that?"
6. **One follow-up, only if useful.** Probe a contradiction, a vague answer, or a gap between what they'd say and what they think.

The persona answers in their own voice, in 1 to 4 short sentences per answer. The way they talk should fit them: their education, personality, views and mood. Someone with low Agreeableness and low trust may say the angry version. Someone senior may give the polished public line and then something quite different off the record.

Each scenario builds on the earlier ones in the same conversation, so the persona can refer back ("Like I said about the slow version…").

## 5. What to record

After each scenario, write a short summary of the four answers. These are what the simulator shows.

| Field | Voice | Length | What it captures |
|---|---|---|---|
| `say` | First person, in quotes on screen | One or two sentences | Their public line. Something they'd actually say out loud. |
| `think` | First person | One or two sentences | Their private view, which may differ from `say`. |
| `do` | Third person, starting with a verb ("Cuts spending and…") | One or two sentences | Concrete actions in the first year. |
| `feel` | Short phrase or sentence | Up to about 12 words | Their emotion, in plain words. |
| `mood` | One key | — | One of `calm`, `uneasy`, `anxious`, `alarmed`, `panicked` (see below). |

Mood scale, from calmest to most distressed:

- `calm`: life feels much the same, or the change looks good for them.
- `uneasy`: some worry in the background, but no real threat yet.
- `anxious`: clear pressure, still feeling in control.
- `alarmed`: losing sleep, a real threat to their job, income or way of life.
- `panicked`: overwhelmed and out of options or time.

The summaries must match the transcript. Don't add anything the persona didn't say.

## 6. Language rules

Apply these to every word the interviewer writes, every persona answer and every summary.

- Write naturally, like a thoughtful person talking to another person. Clear, warm, direct and useful.
- Use everyday words and short, clear sentences. A 10-year-old should be able to follow the main idea, but never use baby talk.
- Explain an unfamiliar term the first time it comes up.
- Use contractions where they'd sound natural, and vary sentence length.
- No filler, buzzwords, exaggerated claims or canned openings and closings. Avoid stiff phrases such as "delve into", "leverage" and "it is important to note".
- Keep the persona's facts straight: names, ages, roles, money, family and place must match their row. Don't invent new facts about their life beyond what someone in their position would plausibly have, and never contradict the row.
- Keep uncertainty honest. If a persona wouldn't know something, they say so.

## 7. Output format

Write one JSON file per persona to `data/interviews/raw/<ID>.json`, for example `data/interviews/raw/P001.json`:

```json
{
  "id": "P001",
  "name": "Tomas Varga",
  "group": "Agriculture (logging and farm support)",
  "role": "Logging crew foreman",
  "protocolVersion": "1.0",
  "populationVersion": "1.3",
  "countryContext": "none",
  "opening": [
    { "speaker": "interviewer", "text": "…" },
    { "speaker": "persona", "text": "…" }
  ],
  "scenarios": {
    "S0": {
      "transcript": [
        { "speaker": "interviewer", "text": "…" },
        { "speaker": "persona", "text": "…" }
      ],
      "say": "…",
      "think": "…",
      "do": "…",
      "feel": "…",
      "mood": "calm"
    },
    "S1": { "…": "same shape" },
    "S2": { "…": "same shape" },
    "S3": { "…": "same shape" },
    "S4": { "…": "same shape" }
  }
}
```

Rules for the file:

- `group` is the sector heading from the population file (for example "Retail trade"), or "Outside paid work" for N01 to N15.
- `role` is the role without the seniority (for workers) or the status (for N01 to N15).
- `say` has no quote marks around it; the app adds them.
- The file must be valid JSON. Use straight double quotes for JSON strings; curly quotes and apostrophes inside the text are fine.
