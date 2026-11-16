# Interview protocol v2: industry archetypes

Version 2.0 · 16 November 2026

This guide runs the archetype study. Each industry has one typical job (see `data/archetypes/archetypes-v1.json`), and each job has 243 versions of the same worker (see `data/archetypes/grid.json`). The versions differ on five things: life stage, work standing, money cushion, outlook and adaptability.

Version 2 changes three things from version 1 (`docs/interview-protocol.md`):

1. **Longer interviews.** Each scenario has two follow-up questions, not one, and answers can run longer.
2. **Richer notes.** The summaries are fuller, and the interviewer writes field notes.
3. **A memorable quote** for each scenario and for the whole interview.

Everything this produces is simulated. These are made-up people, and their answers are a model's guess at how someone like them would react. They aren't survey data and aren't real quotes.

## 1. Who is asking the questions

**The organisation.** The Work Futures Panel is an independent research group. It has no ties to AI companies, employers, unions, political parties or government, and it doesn't sell anything or campaign for any side.

**The interviewer.** A senior field researcher from the Panel, with years of experience interviewing people about their work. They're:

- **Neutral.** They never argue, reassure, warn or hint at a "right" answer, and they never say whether a scenario is likely.
- **Warm and plain-spoken.** They talk like a good neighbour, not a form. They match the person's way of talking and never talk down to anyone.
- **Curious about the gap between public and private.** They promise confidentiality at the start, so the person can say what they'd say in public and, separately, what they really think.
- **Hungry for detail.** They ask for the specific moment, the specific number, the specific person: "What would you say to your daughter that night?" "Which bill goes unpaid first?"
- **Patient with contradictions.** They name a contradiction once, gently, then accept the answer.

## 2. Before the interview: become the person

Read the person's entry in `grid.json` and their job in `archetypes-v1.json`. Build a full picture:

- **Their life:** age, household, savings, pay, how many similar jobs there are nearby.
- **Their work:** the job, the setting, how senior and how skilled they are, their education, and how exposed the job is to thinking AI and to robots.
- **Their views:** their outlook (progressive, centre or traditional) and how adaptable they are.

From this, invent small, ordinary details that fit: the name of their town's main road, the model of their tractor, what their partner does, a colleague they eat lunch with. Keep these details consistent all the way through the interview. Never contradict the profile.

**Every version must sound like a different person.** Two farmers who differ only in savings should still differ in voice, worries and plans. Money shapes what they can do. Outlook shapes how they explain the world and who they blame. Adaptability shapes whether they move first or dig in. Life stage shapes what's at stake: a first job, a family, a pension.

## 3. The five scenarios

The time horizon is the next 5 years. Read each card in everyday words, as written. Don't add events that aren't on the card.

| Code | Name | Card the interviewer reads out |
|---|---|---|
| S0 | No major impact | "Picture this. AI stays a handy tool, like a better search engine. Hiring, pay and prices carry on the way they would have anyway." |
| S1 | Capable but slow | "Now picture this. Very capable AI exists, but it spreads slowly, over ten years or more. Some tasks disappear, but few whole jobs do. Companies hire fewer beginners." |
| S2 | Moderately fast | "Next one. Within 5 years, AI assistants that can act on their own handle most routine office work. There are layoffs and pay pressure in office jobs. Some new AI-related jobs appear, and politicians argue loudly about what to do." |
| S3 | Fast | "Now a faster version. Within 2 to 3 years, AI matches skilled professionals at most thinking work. Lots of office and professional workers lose their jobs. Share and house prices boom. There's a political crisis over who should get the gains. Physical jobs are mostly untouched." |
| S4 | Fast AI and fast robots | "Last one. Everything in the previous picture happens, and on top of that, general-purpose robots arrive in warehouses, kitchens, building sites, farms and care homes within 3 to 5 years. Hands-on work is no longer a safe place to be." |

Robot exposure mostly bites only in S4. A hands-on worker who feels safe in S2 and S3 may react much more sharply in S4. No country context is applied in this run.

## 4. How the interview runs

**Opening (2 to 4 turns).** The interviewer introduces the Panel and promises confidentiality, then asks the person to describe a normal working day. The person answers with real texture: what they do, what they like, what wears them out.

**Each scenario, in order S0 to S4:**

1. **Read the card.**
2. **Say:** "If this happened, what would you say about it at work, to friends, or online?"
3. **Think:** "And just between us, off the record, what do you really think it means for you?"
4. **Do:** "What would you actually do in the first year? Be as specific as you can."
5. **Feel:** "How does it feel, picturing that?"
6. **Two follow-ups.** Use them to dig for detail or to probe a gap. Good follow-ups ask about a concrete moment ("What would you tell your kids?"), money ("What gets cut first?"), people ("Who at work would you worry about?"), or a contradiction ("You said you'd be fine, but you're also cutting back. Which is it?").

The person answers in their own voice, in 2 to 5 sentences per answer. Let them tell small stories, name people and places, use the words of their trade, and sometimes go off on a tangent and come back. Each scenario builds on the earlier ones ("Like I said with the slow one…").

**Closing (2 to 4 turns).** The interviewer asks: "Of the five pictures, which one worries you most, and what would actually help you if it happened?" Then: "Is there anything I didn't ask that I should have?"

## 5. Memorable quotes

A memorable quote is the line a reader would repeat to a friend. For each scenario, pick one sentence or two short sentences, at most 30 words, from the person's answers. It must be **copied word for word from the transcript**.

Good quotes are:

- **Concrete.** Built from their own world: the tractor, the till, the lunch break, the mortgage letter. For example: "My dad drove this land with a horse. I'll be the one who watches a robot do it from the kitchen window."
- **Surprising or honest.** They admit something, flip an expectation, or show a contradiction.
- **In their own voice.** Their words, not a slogan or a news headline.

Avoid clichés like "it's a double-edged sword" or "only time will tell". If no line in the transcript is good enough, improve the persona's answer so it contains one, before you pick it.

## 6. What to record

After each scenario, the interviewer writes:

| Field | Voice | Length | What it captures |
|---|---|---|---|
| `say` | First person | 2 or 3 sentences | Their public line, as they'd actually put it out loud. |
| `think` | First person | 2 or 3 sentences | Their private view, which may differ from `say`. |
| `do` | Third person, starting with a verb | 2 or 3 sentences | Concrete actions in the first year, with timing or money where possible. |
| `feel` | Plain words | 1 or 2 sentences | Their emotions, including mixed ones. |
| `mood` | One key | — | `calm`, `uneasy`, `anxious`, `alarmed` or `panicked`. |
| `quote` | Word for word from the transcript | Up to 30 words | The most memorable line in this scenario (section 5). |
| `fieldNote` | The interviewer's own notes | 2 to 4 sentences | What stood out: what drives them, any gap between say and think, what surprised you. |

Mood scale, from calmest to most distressed:

- `calm`: life feels much the same, or the change looks good for them.
- `uneasy`: some worry in the background, but no real threat yet.
- `anxious`: clear pressure, still feeling in control.
- `alarmed`: losing sleep, a real threat to their job, income or way of life.
- `panicked`: overwhelmed and out of options or time.

After the closing, the interviewer also writes:

| Field | Length | What it captures |
|---|---|---|
| `headlineQuote` | Up to 30 words, word for word | The single best line from the whole interview. |
| `portrait` | 3 to 5 sentences | Who this person is and how they move through the five scenarios, written so a reader who skips the transcript still knows them. |
| `biggestWorry` | 1 or 2 sentences | Their answer to "which scenario worries you most". |
| `whatWouldHelp` | 1 or 2 sentences | What they said would help. |

The summaries must match the transcript. Don't add anything the person didn't say.

## 7. Language rules

Apply these to every word the interviewer writes, every answer and every note.

- Write naturally, like a thoughtful person talking to another person. Clear, warm, direct and useful.
- Use everyday words and short, clear sentences. A 10-year-old should be able to follow the main idea, but never use baby talk.
- Explain an unfamiliar term the first time it comes up.
- Use contractions where they'd sound natural, and vary sentence length.
- No filler, buzzwords, exaggerated claims or canned openings and closings. Avoid stiff phrases such as "delve into", "leverage" and "it is important to note".
- Use plain international English. Avoid strong regional slang, because the study isn't tied to one country.
- Keep the person's facts straight. Never contradict their profile.
- Keep uncertainty honest. If the person wouldn't know something, they say so.

## 8. Output format

Write one JSON file per person to `data/interviews/archetypes/raw/<ID>.json`, for example `data/interviews/archetypes/raw/A01-11111.json`:

```json
{
  "id": "A01-11111",
  "archetype": "A01",
  "job": "Farmer",
  "sector": "Agriculture (logging and farm support)",
  "name": "Uma Petrov",
  "levels": { "lifeStage": "early", "standing": "low", "cushion": "thin", "outlook": "progressive", "adaptability": "resistant" },
  "protocolVersion": "2.0",
  "countryContext": "none",
  "opening": [ { "speaker": "interviewer", "text": "…" }, { "speaker": "persona", "text": "…" } ],
  "scenarios": {
    "S0": {
      "transcript": [ { "speaker": "interviewer", "text": "…" }, { "speaker": "persona", "text": "…" } ],
      "say": "…", "think": "…", "do": "…", "feel": "…", "mood": "calm",
      "quote": "…", "fieldNote": "…"
    },
    "S1": { "…": "same shape" },
    "S2": { "…": "same shape" },
    "S3": { "…": "same shape" },
    "S4": { "…": "same shape" }
  },
  "closing": [ { "speaker": "interviewer", "text": "…" }, { "speaker": "persona", "text": "…" } ],
  "headlineQuote": "…",
  "portrait": "…",
  "biggestWorry": "…",
  "whatWouldHelp": "…"
}
```

- `say`, `quote` and `headlineQuote` have no quote marks around them; the app adds them.
- The file must be valid JSON. Use straight double quotes for JSON strings; curly quotes and apostrophes inside the text are fine.
- Each scenario's transcript has at least 12 turns: the card plus the 4 core questions, the 2 follow-ups, and an answer to each.
