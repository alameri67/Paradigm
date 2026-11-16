# AI Transition Simulator

A web app that shows how people in 20 work sectors might react as AI takes over more of their work. You pick a sector, set a few traits, and move a dial from "AI stalls" to "full takeover in 2 years". The page then shows what that person says, thinks, does and feels.

It started as a single-page prototype. This repo turns it into a proper app built with Next.js, TypeScript and Tailwind.

## Running it

```bash
npm install
```

```bash
npm run dev
```

Then open http://localhost:3000.

Other commands:

| Command | What it does |
|---|---|
| `npm test` | Runs the unit tests for the simulation engine |
| `npm run lint` | Checks the code style |
| `npm run typecheck` | Checks the TypeScript types |
| `npm run build` | Builds the production version |

## What you can do

- **Persona**: pick a sector, set the traits, and move the dial or click one of the five levels.
- **Compare**: put 2 or 3 personas side by side under the same dial.
- **Sector overview**: see the mood across all 20 sectors, in list order or most affected first.
- **Export brief**: a clean one-page summary you can copy as text or print.

Every choice is saved in the address bar, so you can share or bookmark any view. For example, `/?view=compare&sector=finance&level=4`.

## How the code is laid out

```
app/
  page.tsx               loads the data on the server, then hands it to the simulator
  api/sim-data/route.ts  GET /api/sim-data returns the same data as JSON
data/sim-data.json       all the words and numbers the simulator shows
lib/sim/
  schema.ts              checks that the data has the right shape
  engine.ts              picks the right persona for a sector and set of traits
  url-state.ts           reads and writes the state in the address bar
  brief.ts               the plain-text version of the brief
lib/ui/liquid-pill.ts    the WebGL "liquid glass" buttons
components/ui/           reusable pieces: glass navbar, amount slider, tilt card
components/simulator/    the simulator's screens
public/portraits/        portrait images
```

## How a persona is chosen

1. If a hand-written persona matches your traits exactly, it's used.
2. If not, the closest one in that sector is used. "Closest" means the fewest steps away across all traits, so Income "Low" is two steps from "High".
3. If a sector has no hand-written personas yet, the page fills in a template with that sector's own words.

## Swapping in real data

All the data lives in `data/sim-data.json`. Its shape is:

```
sectors[]  { id, name, role, portraitUrl|null }
traits[]   { key, label, options[], ordinal?=true, weight?=1 }
levels[]   { code:"L0".."L4", name, year, description }
moods[]    { key, label, tone:"success|warning|destructive" }
personas[] { id, sectorId, title?, traits:{key:optionIndex},
             responses:{ L0..L4:{ say, think, do, feel, mood } } }
templates  fallback text for sectors with no personas yet
```

`lib/sim/data.ts` is the one place the app reads data from. To move to a database, change that one function so it returns the same shape. The schema check stops broken data from reaching the page.

For portraits, set `portraitUrl` on a sector. Square images with white backgrounds blend in best.

## Current data is sample data

Everything in `data/sim-data.json` is sample text written for the prototype: 16 hand-written personas (4 each in Health care, Finance and insurance, Transportation and warehousing, and Educational services) plus template text for the other 16 sectors.
