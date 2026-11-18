/**
 * What the five AI scenarios are, what each one assumes, and what the interviewer asks.
 * Taken from docs/interview-protocol-v3.md (sections 3 and 4). Safe to import on client and server.
 */
import type { ScenarioCode } from "./types";

export interface ScenarioGuide {
  /** One line: what the world looks like. */
  summary: string;
  /** The card the interviewer reads out, word for word. */
  card: string;
  /** What the scenario takes as given. */
  assumptions: string[];
  /** When AI that can do almost any thinking work arrives, or null if it never does. */
  agi: number | null;
  /** When robots for hands-on work catch up, or null if they never fully do. */
  robots: number | null;
  /** How much time people have to prepare, in a few words. */
  runway: string;
  /** Where it falls in the interview (1st to 5th). The dial shows them mildest to most extreme instead. */
  askedAt: number;
}

export const SCENARIO_GUIDE: Record<ScenarioCode, ScenarioGuide> = {
  S0: {
    summary: "AI turns out to be mostly hype.",
    card: "Picture this. AI turns out to be mostly hype. It automates some routine tasks and saves a bit of time here and there, but nothing radical changes. Jobs, pay and prices carry on much as they would have anyway.",
    assumptions: [
      "AI automates **some routine tasks** and saves a bit of time",
      "**No AGI** and no wave of robots",
      "Jobs, pay and prices **carry on as before**",
    ],
    agi: null,
    robots: null,
    runway: "Nothing to prepare for",
    askedAt: 1,
  },
  S1: {
    summary: "Strong change, but not a revolution.",
    card: "Now picture this. AI brings strong change, but not a revolution. Over the next few years it takes over many thinking tasks in many jobs: writing, checking, planning, buying, booking, coding and answering customers. Robots spread into hands-on work more slowly. Some jobs shrink, new ones appear, and lots of people have to change how they work. Most people still have work, and there is some time to adjust.",
    assumptions: [
      "AI takes over **many thinking tasks**: writing, checking, planning, buying, booking, coding, customer service",
      "Robots reach **hands-on work more slowly**",
      "Some jobs shrink and **new ones appear**",
      "**Most people still have work**, with time to adjust",
    ],
    agi: null,
    robots: null,
    runway: "A few years to adjust",
    askedAt: 2,
  },
  S4: {
    summary: "Full AGI in 10 years, with a decade to prepare.",
    card: "Last one. Full AGI arrives within 10 years, by 2036: AI that can do almost any thinking work a person can do. Robots that can do hands-on work as well as people come about 3 years later, around 2039. It's the same end point, but there's about a decade to prepare, change careers and make plans.",
    assumptions: [
      "**Full AGI by 2036**: AI does almost any thinking work a person can",
      "Robots for hands-on work **around 2039**",
      "The **same end point** as the faster AGI scenarios",
      "About **a decade** to retrain, change careers and plan",
    ],
    agi: 2036,
    robots: 2039,
    runway: "About 10 years",
    askedAt: 5,
  },
  S3: {
    summary: "Full AGI in 5 years. A few years to see it coming.",
    card: "Now the same thing, a bit slower. Full AGI arrives within 5 years, by 2031: AI that can do almost any thinking work a person can do. Robots that can do hands-on work as well as people come about 3 years later, around 2034. There are a few years to see it coming, but it's still fast.",
    assumptions: [
      "**Full AGI by 2031**: AI does almost any thinking work a person can",
      "Robots for hands-on work **around 2034**",
      "A **few years of warning**, but still fast",
    ],
    agi: 2031,
    robots: 2034,
    runway: "About 5 years",
    askedAt: 4,
  },
  S2: {
    summary: "The singularity hits fast, within 2 years.",
    card: "Next one. The singularity hits fast. Within 2 years, by 2028, there is full AGI: artificial general intelligence, meaning AI that can do almost any thinking work a person can do, as well or better, and cheaper. Robots that can do hands-on work as well as people come about 3 years later, around 2031. It arrives before most companies, governments and families have time to prepare.",
    assumptions: [
      "**Full AGI by 2028**: AI does any thinking work as well or better, and cheaper",
      "Robots for hands-on work **around 2031**",
      "Arrives **before companies, governments and families** can prepare",
    ],
    agi: 2028,
    robots: 2031,
    runway: "About 2 years",
    askedAt: 3,
  },
};

/** True of every scenario. */
export const SHARED_ASSUMPTIONS = [
  "Today is **November 2026**",
  "In the AGI scenarios, **thinking work goes first**; hands-on work follows about **3 years later**",
  "**No country context**: the same picture for everyone",
  "The interviewer is **neutral** and never says which scenario is likely",
];

/** The four core questions, asked in every scenario after the card is read out. */
export const CORE_QUESTIONS = [
  { key: "say", label: "Say", text: "If this happened, what would you say about it at work, to friends, or online?" },
  { key: "think", label: "Think", text: "And just between us, off the record, what do you really think it means for you?" },
  { key: "do", label: "Do", text: "What would you actually do, starting now and in the first year after it arrives? Be as specific as you can." },
  { key: "feel", label: "Feel", text: "How does it feel, picturing that?" },
] as const;

/** Two follow-ups per scenario dig for detail; these are the kinds the interviewer uses. */
export const FOLLOW_UPS = ["What would you tell your kids?", "What gets cut first?", "Who at work would you worry about?", "You said you'd be fine, but you're also cutting back. Which is it?"];

/** Asked once, after all five scenarios. */
export const CLOSING_QUESTION = "Of the five pictures, which one worries you most, and what would actually help you if it happened?";

export const GUIDE_LAYOUTS = ["columns", "matrix", "timeline", "focus"] as const;
export type GuideLayout = (typeof GUIDE_LAYOUTS)[number];
export const isGuideLayout = (x: unknown): x is GuideLayout => GUIDE_LAYOUTS.includes(x as GuideLayout);
