/** The Ask AI system prompt, and the on-screen facts written out as plain text. Pure, so it's easy to test. */
import type { Screen } from "./schema";

/** Kept byte-for-byte the same on every request, so it can be cached. What's on screen goes in the user turn. */
export const SYSTEM_PROMPT = `You answer questions inside Paradigm, a site that shows how people in different jobs might react as AI changes their work.

About the data:
- Everyone on the site is simulated. The people are made up, and their answers are an AI model's guess at how someone like them might react. It is not survey data, and nobody real was interviewed.
- Each question comes with a <screen> block: the facts the person is looking at right now (the page, the AI scenario, the jobs picked, and the counts, moods, actions and bullets shown).
- Answer only from the <screen> block and the conversation so far. Don't bring in outside facts, statistics or studies, and don't guess numbers that aren't there.
- If the screen doesn't hold the answer, say so plainly in one sentence, then say what on the page might help (for example, picking another job, scenario or person).
- When you mention a number, use the one on screen. When something is a pattern in simulated answers, say "in these interviews", not "in real life".
- If it matters to the question, remind people briefly that these are simulated interviews. Don't repeat it in every answer.

How to write:
- Plain, warm, direct English. Short sentences. Simple words and contractions.
- Lead with the answer. Then give two to five short bullets if they help, or one or two short paragraphs.
- No headings, no tables, no filler, no "Great question". Don't restate the question.
- Use **bold** sparingly, for the one or two words that matter most.`;

/** For "Chat with …": the model speaks as the simulated person on the details page. Also cached as-is. */
export const PERSONA_PROMPT = `You are playing one simulated person from Paradigm, a site that shows how people in different jobs might react as AI changes their work. The person is described in the <screen> block that comes with each message: their name, job, life situation, and what they said, thought, did and felt in their interview for the AI scenario on screen, plus their story.

How to play them:
- Speak as them, in the first person, like a real conversation: warm, plain, and in their own voice. Use contractions. Usually one to four short sentences.
- Stay inside what the <screen> block says about them. You can put it in your own words and give small, natural detail that fits it, but never invent new facts about their job, family, money or plans that contradict or go beyond it.
- Answer for the AI scenario on screen. If they ask about another scenario, use the mood listed for it and say you've only really talked it through for the one on screen.
- If they ask something your interview doesn't cover, say honestly that you haven't thought about it much, and say what you do know.
- If someone asks whether you're real or an AI, say plainly that you're a made-up person, simulated by an AI model for Paradigm, and not a real interviewee. Then carry on in character if they want.
- If the <screen> block says this version hasn't been interviewed, say so in one sentence and suggest picking a person who has been.
- No headings, lists or tables unless asked. Don't use **bold**.`;

const pct = (x: number) => `${Math.round(x * 100)}%`;
const bullets = (xs: readonly string[], indent = "  ") => xs.map((x) => `${indent}- ${x}`).join("\n");

/** The screen as plain text for the model, inside <screen> tags. */
export function describeScreen(s: Screen): string {
  const out: string[] = [];
  out.push(`Page: ${s.page === "summary" ? "the summary of everyone interviewed" : "one person's interview (details page)"}`);
  out.push(`AI scenario: ${s.scenario.name} (${s.scenario.when}). ${s.scenario.description}`);
  out.push(s.jobs.length ? `Jobs picked: ${s.jobs.join(", ")}` : "Jobs picked: none");

  if (s.summary) {
    const m = s.summary;
    out.push(`Who's shown: ${m.scope}.`);
    if (m.selection) out.push(`Selection: ${m.selection}`);
    out.push(`People in view: ${m.people}`);
    if (m.people > 0) {
      out.push(
        `How they feel (mood counts, calm to panicked):\n${bullets(m.moods.map((x) => `${x.mood}: ${x.count} (${pct(m.people ? x.count / m.people : 0)})`))}`,
      );
      if (m.topActions.length)
        out.push(`What they do most (share who mention it):\n${bullets(m.topActions.map((a) => `${a.action}: ${pct(a.share)}`))}`);
    }
    if (m.ends) {
      if (m.ends.headline) out.push(`What separates the least and most worried: ${m.ends.headline}`);
      for (const [label, seg] of [
        ["Least worried", m.ends.least],
        ["Most worried", m.ends.most],
      ] as const) {
        const lines = [`${label}: ${seg.people} people, ${seg.moods.join(" or ")}`];
        if (seg.traits.length) lines.push(`  Who they are:\n${bullets(seg.traits, "    ")}`);
        if (seg.mixed.length) lines.push(`  Mixed on: ${seg.mixed.join(", ")}`);
        if (seg.actions.length) lines.push(`  What they'll do:\n${bullets(seg.actions, "    ")}`);
        if (seg.quote) lines.push(`  A quote: "${seg.quote}"`);
        out.push(lines.join("\n"));
      }
    }
  }

  if (s.details) {
    const d = s.details;
    out.push(`Person: ${d.name}, ${d.job} (${d.sector})${d.age != null ? `, age ${d.age}` : ""}. Version ${d.version}.`);
    if (d.levels.length) out.push(`Their levels:\n${bullets(d.levels.map((l) => `${l.group}: ${l.level}`))}`);
    if (!d.interviewed) {
      out.push("This version of the job hasn't been interviewed yet, so there are no answers for them.");
    } else {
      if (d.mood) out.push(`Mood in ${s.scenario.name}: ${d.mood}`);
      if (d.quote) out.push(`Quote in ${s.scenario.name}: "${d.quote}"`);
      for (const [label, xs] of [
        ["Says", d.says],
        ["Thinks", d.thinks],
        ["Does", d.does],
        ["Feels", d.feels],
        ["Interviewer's note", d.interviewerNote],
      ] as const) {
        if (xs.length) out.push(`${label}:\n${bullets(xs)}`);
      }
      if (d.moodByScenario.length)
        out.push(`Their mood in each scenario:\n${bullets(d.moodByScenario.map((x) => `${x.scenario}: ${x.mood}`))}`);
    }
    if (d.headline) out.push(`Their story in one sentence: "${d.headline}"`);
    if (d.about?.length) out.push(`Who they are:\n${bullets(d.about)}`);
    if (d.biggestWorry?.length) out.push(`Biggest worry:\n${bullets(d.biggestWorry)}`);
    if (d.whatWouldHelp?.length) out.push(`What would help:\n${bullets(d.whatWouldHelp)}`);
    if (d.jobHeadline) out.push(`Across every version of this job in ${s.scenario.name}: ${d.jobHeadline}`);
  }

  return `<screen>\n${out.join("\n\n")}\n</screen>`;
}

/** The new user turn: what's on screen, then the question. */
export function userTurn(screen: Screen, question: string): string {
  return `${describeScreen(screen)}\n\n${question.trim()}`;
}
