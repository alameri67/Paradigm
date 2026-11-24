#!/usr/bin/env node
// Builds every version of every archetype: 5 grouped traits × 3 levels = 243 per job.
// Reads data/archetypes/archetypes-v1.json, writes data/archetypes/grid.json.
// Usage: node scripts/build-archetype-grid.mjs
import { readFileSync, renameSync, writeFileSync } from "node:fs";

const root = new URL("../data/archetypes/", import.meta.url).pathname;
const { archetypes } = JSON.parse(readFileSync(root + "archetypes-v1.json", "utf8"));

/* Each group has 3 levels. Every person sits in exactly one level of each group. */
export const GROUPS = [
  {
    key: "lifeStage",
    label: "Life stage",
    levels: [
      { key: "early", label: "Early", age: 27, household: "Single or living with a partner, no children" },
      { key: "mid", label: "Mid", age: 43, household: "Partner and two school-age children, a mortgage" },
      { key: "late", label: "Late", age: 58, household: "Partner, grown-up children, retirement in sight" },
    ],
  },
  {
    key: "standing",
    label: "Work standing",
    levels: [
      { key: "low", label: "Low", seniority: "Entry level or junior", skill: "Below average for the job, still learning" },
      { key: "mid", label: "Mid", seniority: "Experienced, mid level", skill: "About average for the job" },
      { key: "high", label: "High", seniority: "Senior or team lead", skill: "Among the best at the job" },
    ],
  },
  {
    key: "cushion",
    label: "Money cushion",
    levels: [
      { key: "thin", label: "Thin", savings: "Less than 1 month of expenses saved", income: "Lower pay for this job", options: "Few similar jobs nearby" },
      { key: "moderate", label: "Moderate", savings: "1 to 6 months of expenses saved", income: "Typical pay for this job", options: "Some similar jobs nearby" },
      { key: "strong", label: "Strong", savings: "More than 6 months saved, or other assets", income: "Higher pay for this job", options: "Plenty of similar jobs nearby" },
    ],
  },
  {
    key: "outlook",
    label: "Outlook",
    levels: [
      { key: "progressive", label: "Progressive", views: "Leans left on the economy and progressive on social issues. Favours unions, regulation and public support." },
      { key: "centre", label: "Centre", views: "Pragmatic and in the middle on both the economy and social issues." },
      { key: "traditional", label: "Traditional", views: "Leans to free markets on the economy and traditional on family, faith and community. Favours work, apprenticeships and family support over handouts." },
    ],
  },
  {
    key: "adaptability",
    label: "Adaptability",
    levels: [
      { key: "resistant", label: "Resistant", traits: "Prefers the familiar, avoids risk, slow to pick up new technology, never uses AI tools" },
      { key: "steady", label: "Steady", traits: "Open to change when it's proven, takes some risks, picks up technology once others have, uses AI tools now and then" },
      { key: "adaptive", label: "Adaptive", traits: "Curious, comfortable with risk, picks up new technology early, uses AI tools every day" },
    ],
  },
];

const FIRST = {
  F: ["Amira", "Beth", "Carla", "Dana", "Elena", "Fatima", "Grace", "Hana", "Iris", "Jade", "Kira", "Lena", "Maya", "Nora", "Olga", "Priya", "Rosa", "Sara", "Tara", "Uma", "Vera", "Wendy", "Yara", "Zoe", "Aisha", "Bianca", "Chloe", "Daria", "Esther", "Freya"],
  M: ["Adam", "Ben", "Carlos", "David", "Emeka", "Felix", "Gareth", "Hassan", "Ivan", "Jamal", "Karl", "Liam", "Marco", "Nikhil", "Omar", "Pedro", "Rafael", "Sam", "Tomas", "Umar", "Victor", "Wei", "Yusuf", "Zane", "Aaron", "Bilal", "Colin", "Diego", "Erik", "Femi"],
};
const LAST = ["Abbott", "Alvarez", "Baker", "Bauer", "Chen", "Costa", "Diaz", "Dubois", "Evans", "Farah", "Fischer", "Garcia", "Gupta", "Haddad", "Hansen", "Ibrahim", "Ito", "Jensen", "Khan", "Kowalski", "Larsen", "Lopez", "Mensah", "Moreau", "Nakamura", "Novak", "Okafor", "Olsen", "Patel", "Petrov", "Quinn", "Rahman", "Reyes", "Rossi", "Santos", "Schmidt", "Silva", "Tanaka", "Torres", "Usman", "Varga", "Wagner", "Walsh", "Weber", "Yilmaz", "Young", "Zhang", "Ziegler"];

const people = [];
/* Cohorts (graduates, retirees, people not in paid work) bring their own groups. Outlook and adaptability
   stay in positions 4 and 5 so every cohort can be compared on them. */
const STORY = ["status", "record", "health", "job", "reason", "time"];
const story = (l) => STORY.map((k) => l[k]).find(Boolean) ?? "";
for (const a of archetypes) {
  const groups = a.groups ?? GROUPS;
  let n = 0;
  const idx = [0, 0, 0, 0, 0];
  for (idx[0] = 0; idx[0] < 3; idx[0]++)
    for (idx[1] = 0; idx[1] < 3; idx[1]++)
      for (idx[2] = 0; idx[2] < 3; idx[2]++)
        for (idx[3] = 0; idx[3] < 3; idx[3]++)
          for (idx[4] = 0; idx[4] < 3; idx[4]++) {
            const levels = Object.fromEntries(groups.map((g, i) => [g.key, g.levels[idx[i]].key]));
            const gender = n % 2 === 0 ? "F" : "M";
            const k = (a.code.startsWith("A") ? 0 : a.code.charCodeAt(0) * 5) + Number(a.code.slice(1)) * 7 + n;
            const first = FIRST[gender][(k * 7) % FIRST[gender].length];
            const last = LAST[(k * 11 + Math.floor(n / 2)) % LAST.length];
            const [l0, l1, l2, ou, ad] = groups.map((g, i) => g.levels[idx[i]]);
            const chosen = [l0, l1, l2];
            const cohort = !!a.groups;
            const pick = (k) => chosen.map((l) => l[k]).find(Boolean);
            people.push({
              id: `${a.code}-${idx.map((i) => i + 1).join("")}`,
              archetype: a.code,
              sector: a.sector,
              job: a.job,
              name: `${first} ${last}`,
              gender,
              levels,
              profile: {
                age: pick("age"),
                household: cohort ? pick("household") ?? story(l0) : l0.household,
                seniority: cohort ? story(l0) : l1.seniority,
                skill: cohort ? story(l1) : l1.skill,
                education: a.education.length === 3 ? a.education[idx[1]] : a.education[0],
                savings: l2.savings,
                income: l2.income,
                localJobs: l2.options ?? "",
                views: ou.views,
                adaptability: ad.traits,
                aiExposure: pick("aiExposure") ?? `Thinking AI: ${a.exposure.ai}. Robots: ${a.exposure.robots}.`,
                setting: pick("setting") ?? a.setting,
              },
            });
            n++;
          }
}

// Write then rename, so agents reading grid.json while it is rebuilt never see half a file.
writeFileSync(root + "grid.tmp", JSON.stringify({ version: "1.0", groups: GROUPS, people }, null, 1) + "\n");
renameSync(root + "grid.tmp", root + "grid.json");
console.log(`${archetypes.length} archetypes, ${people.length} people`);
