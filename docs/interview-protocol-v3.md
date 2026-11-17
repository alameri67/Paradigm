# Interview protocol v3: industry archetypes

Version 3.0 · 16 November 2026

This guide runs the archetype study. Each industry has one typical job (see `data/archetypes/archetypes-v1.json`), and each job has 243 versions of the same worker (see `data/archetypes/grid.json`). The versions differ on five things: life stage, work standing, money cushion, outlook and adaptability.

Version 3 keeps everything from version 2 (longer interviews, two follow-ups, field notes and memorable quotes) and changes two things:

1. **A new set of five scenarios** (section 3), each with a name. The interviewer always says the scenario's name, never its code.
2. **Action tags.** Each scenario records what the person would do as tags from a fixed list (section 6), so their actions can be counted across all the versions of a job.

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

Today is November 2026. Read each card in everyday words, as written, and always call the scenario by its name. Don't add events that aren't on the card.

| Code | Name | Card the interviewer reads out |
|---|---|---|
| S0 | AI Plateau | "Picture this. AI turns out to be mostly hype. It automates some routine tasks and saves a bit of time here and there, but nothing radical changes. Jobs, pay and prices carry on much as they would have anyway." |
| S1 | Steady Disruption | "Now picture this. AI brings strong change, but not a revolution. Over the next few years it takes over many thinking tasks in many jobs: writing, checking, planning, buying, booking, coding and answering customers. Robots spread into hands-on work more slowly. Some jobs shrink, new ones appear, and lots of people have to change how they work. Most people still have work, and there is some time to adjust." |
| S2 | AGI by 2028 | "Next one. The singularity hits fast. Within 2 years, by 2028, there is full AGI: artificial general intelligence, meaning AI that can do almost any thinking work a person can do, as well or better, and cheaper. Robots that can do hands-on work as well as people come about 3 years later, around 2031. It arrives before most companies, governments and families have time to prepare." |
| S3 | AGI by 2031 | "Now the same thing, a bit slower. Full AGI arrives within 5 years, by 2031: AI that can do almost any thinking work a person can do. Robots that can do hands-on work as well as people come about 3 years later, around 2034. There are a few years to see it coming, but it's still fast." |
| S4 | AGI by 2036 | "Last one. Full AGI arrives within 10 years, by 2036: AI that can do almost any thinking work a person can do. Robots that can do hands-on work as well as people come about 3 years later, around 2039. It's the same end point, but there's about a decade to prepare, change careers and make plans." |

The three AGI scenarios have the same end point and differ only in how much time there is. In each, thinking AI arrives first and robots for hands-on work follow about 3 years later. So how much of this person's work is thinking work and how much is hands-on matters: someone whose job is mostly desk and screen work faces AGI on the stated date, while someone whose job is mostly hands-on gets roughly 3 more years, though the thinking parts of their job (planning, paperwork, ordering, scheduling) change on the stated date. Use the job's exposure ratings to judge this. Explore what the extra time changes: what the person would do now, while they see it coming, and what they'd do once it arrives. Someone near retirement may feel safe with 10 years but not with 2. Someone at the start of their career may feel the opposite. No country context is applied in this run.

## 4. How the interview runs

**Opening (2 to 4 turns).** The interviewer introduces the Panel and promises confidentiality, then asks the person to describe a normal working day. The person answers with real texture: what they do, what they like, what wears them out.

**Each scenario, in order S0 to S4:**

1. **Read the card.**
2. **Say:** "If this happened, what would you say about it at work, to friends, or online?"
3. **Think:** "And just between us, off the record, what do you really think it means for you?"
4. **Do:** "What would you actually do, starting now and in the first year after it arrives? Be as specific as you can."
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
- **Clear on its own.** A reader sees the quote alone, with no question and no story around it. It must be full sentences that make sense to a stranger. Name every person, place and thing it points to: say "my daughter", "my boss" or "the mine", not "her", "him", "they", "it" or "that place". Don't start with "And", "But", "So", "Yeah", "Well", "It", "That" or "This" when they point back to something said before. For example, "I'd tell her not to rent" doesn't work, because no one knows who "her" is. "I'd tell my daughter never to rent, and to get the education I didn't" does.

Avoid clichés like "it's a double-edged sword" or "only time will tell". If no line in the transcript is good enough, or the best line only makes sense with the question around it, improve the persona's answer so it contains a line that stands alone, before you pick it.

## 6. What to record

After each scenario, the interviewer writes:

| Field | Voice | Length | What it captures |
|---|---|---|---|
| `say` | First person, bullets | 2 or 3 bullets | Their public line, as they'd actually put it out loud. |
| `think` | First person, bullets | 2 or 3 bullets | Their private view, which may differ from `say`. |
| `do` | Bullets, each starting with a verb | 2 or 3 bullets | Concrete actions in the first year, with timing or money where possible. |
| `feel` | Plain words, bullets | 1 or 2 bullets | Their emotions, including mixed ones. |
| `mood` | One key | — | `calm`, `uneasy`, `anxious`, `alarmed` or `panicked`. |
| `quote` | Word for word from the transcript | Up to 30 words | The most memorable line in this scenario (section 5). |
| `fieldNote` | The interviewer's own notes, bullets | 2 to 4 bullets | What stood out: what drives them, any gap between say and think, what surprised you. |
| `actions` | Tags | 1 to 4 | What they'd do, as tags from the list below. Only tag actions they actually describe. |
| `steps` | Short plain phrases | 1 to 4 | The concrete things this person will actually do in the first year, in words a stranger understands. Each starts with a verb and names the real thing in their job and life: "Sell 40 of the 120 cows and rent out the top field", not "Cut back" or "Adapt". Each step carries the one action tag it belongs to, and every tag in `actions` has at least one step. |

Action tags:

| Tag | Meaning |
|---|---|
| `keep-going` | Carries on as normal |
| `cut-spending` | Cuts back on spending |
| `save-more` | Saves more or pays down debt to build a cushion |
| `retrain` | Retrains, studies or learns a new trade |
| `learn-ai` | Learns to use AI tools in their current work |
| `change-job` | Looks for or moves to a different job or field |
| `side-income` | Starts a side business or a second source of income |
| `invest` | Invests money, for example in shares, property, the business or new machines |
| `automate` | Brings in AI or robots in their own work or business |
| `sell-or-exit` | Sells up, closes the business or leaves the job |
| `retire-early` | Retires early or brings retirement plans forward |
| `collective-action` | Joins a union, association, protest or other group action |
| `politics` | Lobbies, votes or campaigns for a policy |
| `seek-support` | Leans on government help, family or community |
| `move` | Moves home or region |
| `family-plans` | Changes family plans, such as children's studies, a house move or a wedding |
| `wait-and-see` | Waits to see what happens before acting |

Mood scale, from calmest to most distressed. Mood is how the person feels about their work and their living over the next few years in that world. It includes the worries they already carry, not only the ones AI brings:

- `calm`: their work and money feel secure, or the change looks good for them.
- `uneasy`: their own job and income look safe, but things around them are shifting and it's on their mind.
- `anxious`: their own job, hours or income could realistically shrink or go in the next few years, or the household's could; they still feel they have some control.
- `alarmed`: they expect to lose their job or a big part of their income, or a household earner will, and it's keeping them up at night.
- `panicked`: overwhelmed, with no plan and no time or money to make one.

Pick the mood from what the person says is likely to happen to them and their household, not from how calmly they say it. If they think their team will be cut and they might be one of the ones to go, that's at least anxious, even if they sound composed.

**Let each person's own life decide their mood, one person at a time.** There is no right mix of moods and no target to hit. Don't read other interviews, and don't steer towards the middle of the scale or towards what seems typical for the job. Work it out from this person alone: how exposed their work is, how much money they have to fall back on, how many similar jobs are nearby, what's at stake at their life stage, and how they handle change. Someone with thin savings, few local jobs and little appetite for change may already be anxious or alarmed in a mild scenario. Someone secure and adaptable may stay calm even when AGI arrives in 2 years. Both are fine if they follow from the person. The same goes for what they do: let each person's choices come from their own situation.

**"Nothing changes" doesn't mean "nothing to worry about".** In AI Plateau, AI adds little, but the person's life still has its own pressures: rent or a mortgage, bills, a thin cushion, a firm that's struggling, seasonal or short-term work, few jobs nearby, ageing parents, their own health. Someone who was already worried before AI came up stays worried in AI Plateau. Only call them calm if their work and money really feel secure. The same applies to the routine tasks AI does take over in AI Plateau: if much of this person's day is routine screen work, even that small change can touch them.

**Steady Disruption hits desk work first.** In Steady Disruption, AI takes over many tasks in many jobs. A job that's high on thinking AI (writing, checking, buying, booking, coding, answering customers) feels it now: fewer hires, new targets, tasks moved to software, colleagues not replaced. A mostly hands-on job feels it later and less. Judge how much of this person's own day is thinking work and let that shape the answer.

After the closing, the interviewer also writes:

| Field | Length | What it captures |
|---|---|---|
| `headlineQuote` | Up to 30 words, word for word | The single best line from the whole interview. It must be a different line from every scenario's `quote`, and the five scenario quotes must all be different from each other. |
| `portrait` | 3 to 5 bullets | Who this person is and how they move through the five scenarios, written so a reader who skips the transcript still knows them. |
| `biggestWorry` | 1 or 2 bullets | Their answer to "which scenario worries you most". |
| `whatWouldHelp` | 1 or 2 bullets | What they said would help. |

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
  "protocolVersion": "3.0",
  "countryContext": "none",
  "opening": [ { "speaker": "interviewer", "text": "…" }, { "speaker": "persona", "text": "…" } ],
  "scenarios": {
    "S0": {
      "transcript": [ { "speaker": "interviewer", "text": "…" }, { "speaker": "persona", "text": "…" } ],
      "say": ["…", "…"], "think": ["…", "…"], "do": ["…", "…"], "feel": ["…"], "mood": "calm",
      "quote": "…", "fieldNote": ["…", "…"], "actions": ["keep-going", "learn-ai"],
      "steps": [ { "text": "Keep milking twice a day and keep the same buyer", "tag": "keep-going" }, { "text": "Try the co-op's feed-planning app this winter", "tag": "learn-ai" } ]
    },
    "S1": { "…": "same shape" },
    "S2": { "…": "same shape" },
    "S3": { "…": "same shape" },
    "S4": { "…": "same shape" }
  },
  "closing": [ { "speaker": "interviewer", "text": "…" }, { "speaker": "persona", "text": "…" } ],
  "headlineQuote": "…",
  "portrait": ["…", "…", "…"],
  "biggestWorry": ["…"],
  "whatWouldHelp": ["…"]
}
```

- `say`, `quote` and `headlineQuote` have no quote marks around them; the app adds them.
- `say`, `think`, `do`, `feel`, `fieldNote`, `portrait`, `biggestWorry` and `whatWouldHelp` are lists of bullets (JSON arrays of strings), because readers scan rather than read paragraphs. Each bullet is one full sentence of at most 22 words and makes one point. Within a field the bullets don't overlap and together they cover what matters (MECE). Mark the one or two key words in each bullet with `**double asterisks**`, such as the thing at stake, the number or the decision. Bold at most 4 words per bullet, and never a whole bullet. Quotes stay as they are: no bullets and no bold.
- `steps` are what the person does, so they come from their own answers and `do`. Make them specific to this person's job, money and family. Two people in the same job should only share a step when they'd really do the same thing.
- The file must be valid JSON. Use straight double quotes for JSON strings; curly quotes and apostrophes inside the text are fine.
- Each scenario's transcript has at least 12 turns: the card plus the 4 core questions, the 2 follow-ups, and an answer to each.
