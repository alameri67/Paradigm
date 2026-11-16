# Synthetic population for AI-scenario simulation (Say-Do-Think-Feel)

Version 1.3 · 16 November 2026 · 115 personas

This is a stylised, country-neutral sample. It is not calibrated to any national census. Workers are spread equally across 20 sectors (5 each, P001 to P100) so every sector can be compared. Fifteen more people sit outside paid work (N01 to N15): job seekers, students, retirees, carers and people on disability support. Income is relative to a generic national distribution, so the same file works for any country once you map the quintiles to local money. Population weights (section 5) and country settings (section 6) let you scale results up and rerun the same people under different national institutions.

## 1. Scenario ladder

Run every persona through each scenario. Suggested time horizon is 5 years from today.

| Code | Scenario | What the persona experiences |
|---|---|---|
| S0 | No major impact | AI stays a productivity tool. Hiring, wages and prices move as they would anyway. |
| S1 | Capable but slow | Strong AI exists but spreads over 10+ years. Some tasks vanish, few whole jobs do. Entry-level hiring softens. |
| S2 | Moderately fast | AI agents handle most routine desk work within 5 years. White-collar layoffs and wage pressure, new AI-adjacent roles, policy debate heats up. |
| S3 | Fast | Agents match skilled professionals in most cognitive work within 2 to 3 years. Large white-collar displacement, asset prices boom, political crisis over redistribution. Physical jobs mostly untouched. |
| S4 | Fast AI + fast robotics | S3 plus general-purpose robots reaching warehouses, kitchens, construction sites, farms and care homes within 3 to 5 years. Manual work loses its safe-haven status. |

## 2. Attribute legend

| Field | Values | Meaning |
|---|---|---|
| Gender | M, F | Male, female |
| Seniority | Entry, Junior, Mid, Senior, Exec, Owner | Position in the organisation. Owner means owner-operator or business owner. |
| Edu | LS, Sec, Voc, Assoc, Bach, Mast, Prof, Doc | Highest completed education. LS less than secondary, Sec secondary school, Voc vocational or trade certificate, Assoc some university or a two-year degree, Bach bachelor's, Mast master's (incl. MBA), Prof professional degree (medicine, law), Doc doctorate. An asterisk (Bach*) means currently studying for that level. |
| Income | Q1 to Q5, Q5+ | Personal income quintile (Q1 bottom 20%, Q5 top 20%, Q5+ top 1%). For students, household quintile. |
| Comp | C1 to C5 | Competence relative to peers in the same role. C1 struggling, C3 average, C5 exceptional. Separate from seniority on purpose: some seniors are weak, some juniors are strong. |
| Econ | 1 to 7 | Economic worldview. 1 Socialist, 2 Democratic socialist, 3 Social democrat, 4 Centrist / pragmatic, 5 Market liberal, 6 Free-market capitalist, 7 Libertarian. |
| Social | 1 to 7 | Social and cultural values. 1 Strongly progressive, 2 Progressive, 3 Moderately progressive, 4 Moderate, 5 Moderately traditional, 6 Traditional, 7 Strongly traditional. Independent of Econ: P022 is economically left and socially traditional, P047 is libertarian on economics and socially liberal. |
| AI exposure | C:L/M/H R:L/M/H | C is exposure of their tasks to cognitive AI. R is exposure to robotics. R matters mainly in S4. For non-workers, exposure of their prior, target or household job. |
| AI use | None, Occasional, Weekly, Daily, Builds | How often they use AI tools today, at work or at home. Builds means they develop or deploy AI systems as part of their job. |
| OCEAN | five letters, each H/M/L | Big Five order: Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism. "HHMLM" means high O, high C, mid E, low A, mid N. |
| Risk / Tech / Trust | L/M/H · Early/Main/Late/Resistant · L/M/H | Risk tolerance · technology adoption · trust in government and large institutions |
| Buffer | <1m, 1-6m, 6m+, Wealthy | Months of expenses covered by savings. Wealthy means assets well beyond that. |
| Place · Options | Metro, Suburb, Town, Rural · L/M/H | Where they live, and how easy it is to find comparable work locally if they lose their job. L means few local alternatives, for example a one-plant town. n/a for retirees. |
| Wt | number | Default weight: how many adults this persona stands for, per 1,000 adults. All 115 weights sum to 1,000. Section 5 explains how to change them. |
| Anchor | free text | Their situation, what they care about and their starting stance on AI. Use it to keep the persona's voice consistent. |

## 3. How the attributes map to Say-Do-Think-Feel

These are default rules of thumb for the simulator. Override them where an anchor says otherwise.

- **Say** (public statements). Driven mostly by Econ, Social, Trust and Agreeableness. Social decides how people frame AI: progressives talk about bias, inequality and corporate power; traditionalists talk about work ethic, family, faith and community. High-A, low-N people soften what they say in public. Low-A, low-Trust people say the angry version. Professionals with reputations (Exec, Senior, Q5) say what their role expects, which can differ from what they think.
- **Do** (actions). Driven by Buffer, Risk, Tech, household, Edu and Options. Degree holders retrain more easily and more often. People with low local Options cannot simply switch employer, so they either move, which is costly with family ties, or hold on. Low buffer plus dependents means people cut spending and cling to jobs even when they say they are calm. High risk plus Early tech means they retrain, start side businesses or invest. Late or Resistant adopters delay action until the change reaches their own workplace.
- **Think** (private assessment). Driven by AI exposure, AI use, Edu, Comp and Openness. People who use AI daily judge its abilities from experience; non-users borrow their picture of AI from the news and the people around them, so they tend to over- or underestimate it. Higher education usually means faster updating but also a stronger sense of entitlement to the career they trained for. High-Comp people tend to believe they will be the last to go, even in exposed jobs. High-O people update fast on new evidence. Econ shapes the preferred fix: 1 to 3 lean to UBI, unions and regulation, 5 to 7 to retraining, tax cuts and market adjustment. Social shapes which fix feels legitimate: traditionalists (5 to 7) prefer job guarantees, apprenticeships and family support over cash with no strings, even when they are economically left.
- **Feel** (emotion). Driven by Neuroticism, Buffer, Options, dependents and how much of their identity sits in their craft. A gap between Think and Say is common for people whose job title is part of who they are.

Apply the country context rules in section 6 on top of these defaults. Expect the R exposure to stay dormant until S4. Many manual workers who feel safe in S2 and S3 should flip sharply in S4.

## 4. Sample summary

All 115 personas unless noted. Count is the raw number of personas; weighted share uses the Wt column (section 5).

| Gender | F | M |
|---|---|---|
| Count | 56 | 59 |
| Weighted share | 54% | 46% |

| Age band | <25 | 25-34 | 35-44 | 45-54 | 55-64 | 65+ |
|---|---|---|---|---|---|---|
| Count | 13 | 32 | 27 | 23 | 16 | 4 |
| Weighted share | 12% | 22% | 19% | 17% | 8% | 22% |

| Education | LS | Sec | Voc | Assoc | Bach | Mast | Prof | Doc |
|---|---|---|---|---|---|---|---|---|
| Count | 6 | 21 | 13 | 14 | 34 | 20 | 3 | 4 |
| Weighted share | 4% | 24% | 9% | 12% | 33% | 9% | 4% | 5% |

| Income | Q1 | Q2 | Q3 | Q4 | Q5 | Q5+ |
|---|---|---|---|---|---|---|
| Count | 22 | 23 | 30 | 21 | 13 | 6 |
| Weighted share | 29% | 22% | 19% | 18% | 8% | 4% |

| Econ view | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|---|---|---|---|---|---|---|---|
| Count | 4 | 13 | 28 | 25 | 26 | 14 | 5 |
| Weighted share | 2% | 13% | 34% | 18% | 20% | 12% | 1% |

| Social values | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|---|---|---|---|---|---|---|---|
| Count | 4 | 16 | 24 | 26 | 24 | 19 | 2 |
| Weighted share | 3% | 9% | 19% | 20% | 21% | 29% | 0% |

| AI use now | None | Occasional | Weekly | Daily | Builds |
|---|---|---|---|---|---|
| Count | 25 | 28 | 31 | 27 | 4 |
| Weighted share | 31% | 22% | 24% | 20% | 3% |

| Place | Metro | Suburb | Town | Rural |
|---|---|---|---|---|
| Count | 48 | 34 | 28 | 5 |
| Weighted share | 33% | 30% | 36% | 1% |

| Competence (workers) | C1 | C2 | C3 | C4 | C5 |
|---|---|---|---|---|---|
| Count | 3 | 3 | 35 | 40 | 19 |

| AI exposure (workers) | Low | Mid | High |
|---|---|---|---|
| Cognitive | 36 | 23 | 41 |
| Robotics | 60 | 25 | 15 |

Built-in correlations, as checks that the sample behaves like a real population (Pearson correlations on the ordered codes, unweighted):

| Pair | Correlation | Expected direction |
|---|---|---|
| Education and income (workers) | +0.66 | positive |
| Age and income (workers) | +0.50 | positive |
| Education and AI use | +0.60 | positive |
| Age and AI use | -0.40 | negative |

Weighting pulls the sample older, because retirees carry 22% of the weight, and towards health care, retail and government workers. The weighted top-1% share is above 1% because five of the six Q5+ personas are workers in heavily weighted sectors; treat Q5+ results as indicative only. Robotics exposure is mostly low or mid today; S4 is the scenario that makes it bite. Only five personas are rural, so rural views come through clearly in the qualitative run but carry little weight in totals.

## 5. Population weights

Five people per sector lets you compare sectors. It does not tell you how a whole population reacts, because a mining engineer and a retail worker are not equally common. The Wt column fixes that. Each persona's weight is the number of adults it stands for out of 1,000.

For a population-level result, multiply each persona's outcome by its Wt, add them up and divide by 1,000. For a sector-level result, use the five personas unweighted.

### 5.1 Default adult population split

| Group | Per 1,000 adults | Personas | Wt each |
|---|---|---|---|
| In paid work | 580 | P001 to P100 | by sector, see 5.2 |
| Unemployed, looking for work | 30 | N01 to N04 | 7.50 |
| Students (16+) | 70 | N05 to N08 | 17.50 |
| Retired | 220 | N09 to N12 | N09 60, N10 90, N11 5, N12 65 |
| Full-time carers and homemakers | 60 | N13, N14 | 30.00 |
| Out of work through disability or illness | 40 | N15 | 40.00 |

### 5.2 Default sector shares

These are stylised shares for an advanced service economy. Public school teachers, public hospital staff and civil servants all count under Government here, so Educational services covers private education only. Each worker's Wt is 580 × share ÷ 5.

| Sector | Share of workers | Wt per persona |
|---|---|---|
| Agriculture (logging and farm support) | 0.5% | 0.58 |
| Mining, oil and gas | 0.4% | 0.46 |
| Utilities | 0.4% | 0.46 |
| Construction | 5.2% | 6.03 |
| Manufacturing | 8.2% | 9.51 |
| Wholesale trade | 3.9% | 4.52 |
| Retail trade | 9.8% | 11.37 |
| Transportation and warehousing | 4.4% | 5.10 |
| Information | 1.9% | 2.20 |
| Finance and insurance | 4.2% | 4.87 |
| Real estate | 1.5% | 1.74 |
| Professional, scientific and technical services | 7.4% | 8.58 |
| Management of companies | 1.8% | 2.09 |
| Administrative and support services | 6.0% | 6.96 |
| Educational services (private) | 2.6% | 3.02 |
| Health care and social assistance | 14.0% | 16.24 |
| Arts, entertainment and recreation | 1.6% | 1.86 |
| Accommodation and food services | 8.5% | 9.86 |
| Other services | 3.6% | 4.18 |
| Government (incl. public education and health) | 14.1% | 16.36 |

To fit a real country, replace the shares with its labour force survey figures and the group sizes in 5.1 with its population data, then recompute Wt. The persona rows do not change.

### 5.3 Small-cell warning

Weights are uneven. The retirees are weighted by how common each type is: the pension-only retiree (N10) stands for 90 adults and the wealthy early retiree (N11) for 5. Each retiree stands for far more people than each Government or Health care worker (about 16), while each Mining or Utilities worker stands for under half an adult. One retiree's simulated mood moves the weighted total more than an entire small sector. Run each scenario several times per persona and average, so one unusual reaction does not swing the population result.

## 6. Country context

The personas are country-neutral, but national institutions change how the same person reacts. A laid-off claims processor in a strong welfare state and one on an employer-tied work visa face very different stakes. Set one context per simulation run, then apply its adjustment rules on top of each persona's own attributes.

### 6.1 Context parameters and what they change

| Parameter | Levels | Adjustment rule for the simulator |
|---|---|---|
| Safety net (unemployment pay level and duration) | Low / Med / High | High: lower fear in Feel by one step for anyone with Buffer <1m, and make Do more willing to retrain or wait for a better job. Low: people with Buffer <1m take any job fast and cut spending at the first rumour. |
| Union strength | Low / Med / High | High: unionised roles (P012, P040, P071, P075, P077, P096, and most manufacturing and utilities workers) Say collective demands and Do strike or negotiate; displacement in S1 and S2 arrives a year or two later. Low: responses stay individual. |
| Job protection (cost and difficulty of firing) | Low / Med / High | High: layoffs lag, but firms freeze hiring, so Entry and Junior personas and N04 take the hit. Insiders are protected, outsiders locked out. Low: displacement in S2 to S4 hits fast and at every seniority level. |
| Employer-tied visas | None / Some / Most of private sector | Where it applies, an expat who loses their job must find another or leave within a short grace period. Say becomes muted with little public criticism, Do becomes rapid job hunting and cutting remittances, Feel becomes high anxiety whatever the person's Neuroticism. |
| Informal economy | Small / Large | Large: displaced workers drift into cash jobs and street trade instead of registered unemployment. Cheap labour slows robot adoption, so soften the R exposure effect in S4 by one step. |
| Asset ownership spread | Narrow / Broad | Broad: Q3 to Q5 personas with pensions or shares gain from the AI boom in S3 and S4, which softens their Think. Narrow: only Wealthy personas gain, and S3 and S4 widen the gap. |
| Institutional trust baseline | −1 / 0 / +1 | Shift every persona's Trust by this many steps on the L, M, H scale, capped at the ends. |
| State as employer | Small / Large public sector | Large: Government personas and citizens expect the state to absorb displaced workers, so their Feel stays calmer. Scale the Government weight in 5.2 to match. |

### 6.2 Presets

| Parameter | A. Liberal market | B. Nordic welfare state | C. Gulf citizen-expat economy | D. Emerging economy |
|---|---|---|---|---|
| Safety net | Low | High | High for citizens, Low for expats | Low |
| Union strength | Low | High | Low | Low to Med |
| Job protection | Low | Med | High for citizens, Low for expats | Med on paper, Low in practice |
| Employer-tied visas | None | None | Most of private sector | None |
| Informal economy | Small | Small | Small | Large |
| Asset ownership spread | Broad (via pensions) | Broad | Med for citizens, Narrow for expats | Narrow |
| Trust baseline | −1 | +1 | +1 for citizens, 0 for expats | −1 |
| State as employer | Small | Large | Large for citizens | Med |

### 6.3 Citizenship flag for preset C

Preset C needs a citizen or expat flag that the base personas do not carry. Default assignment: P007, P011, P049, P061, P062, P080, P096 to P100, N05, N06, N09, N12 and N13 are citizens. Everyone else is an expat on an employer-tied visa. Citizens get the "for citizens" values in 6.2, expats the "for expats" values. Gulf populations are also younger and more male than the default weights assume, so replace sections 5.1 and 5.2 with national data before reading population-level results under this preset.

## 7. Workers by sector

Columns: ID | Name · Age · Gender | Role · Seniority | Edu | Income | Comp | Econ | Social | AI exposure | AI use | OCEAN | Risk / Tech / Trust | Buffer · Household | Place · Options | Wt | Anchor

### 7.1 Agriculture (logging and farm support)

| ID | Name · Age · Gender | Role · Seniority | Edu | Income | Comp | Econ | Social | AI exposure | AI use | OCEAN | Risk / Tech / Trust | Buffer · Household | Place · Options | Wt | Anchor |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| P001 | Tomas Varga · 52 · M | Logging crew foreman · Senior | Sec | Q2 | C4 | 6 | 6 | C:L R:M | None | LHMML | H / Late / L | 1-6m · married, 2 adult kids | Rural · L | 0.58 | Proud of his safety record. Treats AI as office hype until a machine turns up in his forest. |
| P002 | Ana Ruiz · 27 · F | Seasonal crew member, farm labour contractor · Entry | LS | Q1 | C3 | 2 | 5 | C:L R:H | None | MMHHM | M / Main / L | <1m · single mother, 1 child | Rural · L | 0.58 | Lives paycheck to paycheck. Harvest robots are the AI story she actually notices. |
| P003 | Dale Hoffman · 61 · M | Owner, custom harvesting and spraying service · Owner | Assoc | Q4 | C4 | 7 | 7 | C:L R:M | Occasional | MHMLL | H / Main / L | 6m+ (equipment-rich, cash-poor) · married, succession unresolved | Rural · M | 0.58 | Will buy autonomous equipment the day it pays back. Hates regulation more than robots. |
| P004 | Priya Nair · 34 · F | Precision-ag data technician · Mid | Bach | Q3 | C5 | 4 | 3 | C:H R:L | Daily | HHMMM | M / Early / M | 1-6m · partner, no kids | Town · M | 0.58 | Already runs drone imagery through models. Thinks AI makes her either indispensable or redundant within two years. |
| P005 | Kofi Mensah · 23 · M | Trainee timber equipment operator · Junior | Sec | Q2 | C2 | 3 | 4 | C:L R:H | Occasional | MLHMM | H / Main / M | <1m · lives with parents | Rural · L | 0.58 | Took the job for the pay and struggles with the controls. Would retrain if someone else paid for it. |

### 7.2 Mining, oil and gas

| ID | Name · Age · Gender | Role · Seniority | Edu | Income | Comp | Econ | Social | AI exposure | AI use | OCEAN | Risk / Tech / Trust | Buffer · Household | Place · Options | Wt | Anchor |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| P006 | Gareth Owens · 45 · M | Underground mine shift supervisor · Senior | Voc | Q4 | C4 | 5 | 5 | C:L R:H | Occasional | LHHLL | M / Main / M | 1-6m · married, 3 kids, mortgage | Town · L | 0.46 | Autonomous haul trucks already run on his site. Worries about his crew more than himself. |
| P007 | Leila Haddad · 38 · F | Reservoir engineer · Senior | Mast | Q5 | C5 | 5 | 3 | C:H R:L | Daily | HHMML | M / Early / H | 6m+ · married, 2 kids | Metro · H | 0.46 | Her work is simulation-heavy and AI speeds it up. The energy transition worries her more than AI does. |
| P008 | Jake Morrison · 29 · M | Rig floorhand · Entry | Sec | Q3 | C3 | 7 | 6 | C:L R:H | None | LMHML | H / Late / L | <1m · single, high spending | Town · M | 0.46 | Rotation pay funds his truck and his lifestyle. Distrusts "tech bros" and anyone who wants to slow drilling. |
| P009 | Marta Kowalski · 57 · F | Site HR and safety compliance manager · Senior | Bach | Q4 | C3 | 4 | 4 | C:M R:L | Occasional | LHMHM | L / Late / H | 6m+ · divorced, 1 adult kid | Town · L | 0.46 | Five years from her pension in a paperwork-heavy job. Quietly afraid of being "streamlined". |
| P010 | Samuel Adeyemi · 41 · M | CEO, mid-size oilfield services firm · Exec | Mast | Q5+ | C4 | 7 | 6 | C:M R:M | Weekly | HMHLL | H / Early / M | Wealthy · married, 4 kids | Metro · H | 0.46 | Wants AI to cut headcount and win bids. Fears larger rivals automate first. |

### 7.3 Utilities

| ID | Name · Age · Gender | Role · Seniority | Edu | Income | Comp | Econ | Social | AI exposure | AI use | OCEAN | Risk / Tech / Trust | Buffer · Household | Place · Options | Wt | Anchor |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| P011 | Helen Brooks · 49 · F | Grid control room operator · Mid | Assoc | Q4 | C4 | 3 | 3 | C:M R:L | Weekly | MHLMM | L / Main / H | 1-6m · married, 2 teens | Suburb · M | 0.46 | Sees keeping the lights on as a public duty. Uneasy about handing dispatch decisions to software. |
| P012 | Diego Santos · 31 · M | Electrical lineworker · Junior | Voc | Q3 | C4 | 4 | 4 | C:L R:M | Occasional | MHHML | H / Main / M | 1-6m · engaged | Suburb · H | 0.46 | Union member. Says no robot climbs a pole in a storm, and data-centre demand means overtime is booming. |
| P013 | Yuki Tanaka · 26 · F | Billing and customer service agent · Entry | Assoc | Q2 | C3 | 2 | 2 | C:H R:L | Weekly | MMMHH | L / Main / M | <1m · shares a flat | Metro · H | 0.46 | Chatbots already take a third of calls. Expects her job to be among the first to go. |
| P014 | Robert Klein · 63 · M | Water treatment plant manager · Senior | Bach | Q4 | C3 | 5 | 5 | C:M R:M | None | LHMML | L / Late / H | 6m+ · married, grandchildren | Town · L | 0.46 | Near retirement and sceptical of change. Trusts written procedures over algorithms. |
| P015 | Amara Okafor · 37 · F | Data scientist, renewables integration · Mid | Mast | Q5 | C5 | 3 | 2 | C:H R:L | Builds | HHMHM | M / Early / M | 6m+ · married, 1 child | Metro · H | 0.46 | Builds forecasting models and loves the tools. Worries about who captures the gains. |

### 7.4 Construction

| ID | Name · Age · Gender | Role · Seniority | Edu | Income | Comp | Econ | Social | AI exposure | AI use | OCEAN | Risk / Tech / Trust | Buffer · Household | Place · Options | Wt | Anchor |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| P016 | Mick O'Brien · 55 · M | Owner, residential builder with 8 staff · Owner | Voc | Q4 | C4 | 6 | 6 | C:L R:M | Occasional | MHHMM | H / Late / L | 1-6m · married, 3 kids | Suburb · M | 6.03 | Cannot find enough skilled trades. Would welcome a robot that shows up on time. |
| P017 | Luis Hernández · 34 · M | Carpenter / framer · Mid | LS | Q2 | C4 | 3 | 5 | C:L R:M | None | MHMHL | M / Main / L | <1m · married, 3 kids, sends money to family | Suburb · M | 6.03 | Proud of his skill and paid by the job. Any housing slowdown hits him the same week. |
| P018 | Sarah Chen · 29 · F | Project engineer and estimator · Junior | Bach | Q3 | C4 | 4 | 3 | C:H R:L | Daily | HHMMM | M / Early / M | 1-6m · single, student debt | Metro · H | 6.03 | Estimating and scheduling software already does half her job. |
| P019 | Darnell Washington · 22 · M | General labourer · Entry | LS | Q1 | C1 | 2 | 4 | C:L R:H | None | MLHMH | H / Main / L | <1m · lives with grandmother | Metro · M | 6.03 | Patchy attendance. This job is his only route up and he does not follow AI news. |
| P020 | Ingrid Larsen · 46 · F | Site safety manager, commercial projects · Senior | Bach | Q4 | C5 | 4 | 3 | C:M R:M | Weekly | MHMML | L / Main / H | 6m+ · partner, 2 kids | Metro · H | 6.03 | Respected on site. Likes AI camera monitoring but insists a human signs off. |

### 7.5 Manufacturing

| ID | Name · Age · Gender | Role · Seniority | Edu | Income | Comp | Econ | Social | AI exposure | AI use | OCEAN | Risk / Tech / Trust | Buffer · Household | Place · Options | Wt | Anchor |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| P021 | Frank Müller · 58 · M | CNC machinist · Senior | Voc | Q3 | C5 | 4 | 5 | C:L R:H | None | LHLML | L / Late / M | 1-6m · married, 2 adult kids | Town · L | 9.51 | Thirty-five years on machines and two automation waves behind him. Expects to retire before the next one lands. |
| P022 | Rosa Martínez · 41 · F | Assembly line worker, electronics · Junior | Sec | Q2 | C3 | 1 | 4 | C:L R:H | None | LMMHH | L / Late / L | <1m · single mother, 2 kids | Town · L | 9.51 | The plant cut a shift after the last robot install. Scared and angry. |
| P023 | Arjun Mehta · 36 · M | Automation engineer · Mid | Mast | Q4 | C5 | 5 | 3 | C:H R:L | Builds | HHMML | H / Early / M | 6m+ · married, 1 kid | Suburb · H | 9.51 | Installs the robots himself. Believes upskilling solves it and underestimates other people's pain. |
| P024 | Claire Dubois · 50 · F | Plant manager, food processing · Exec | Mast | Q5 | C4 | 5 | 4 | C:M R:M | Weekly | MHHMM | M / Main / M | 6m+ · married, 2 teens | Town · L | 9.51 | The board pushes automation to protect margins. Feels responsible for the town's jobs. |
| P025 | Tyler Reed · 24 · M | Quality inspector · Entry | Sec | Q2 | C2 | 4 | 4 | C:M R:H | Weekly | MLMMM | M / Early / L | <1m · roommate, car loan | Town · M | 9.51 | Vision systems catch defects better than he does. Spends evenings on crypto and YouTube. |

### 7.6 Wholesale trade

| ID | Name · Age · Gender | Role · Seniority | Edu | Income | Comp | Econ | Social | AI exposure | AI use | OCEAN | Risk / Tech / Trust | Buffer · Household | Place · Options | Wt | Anchor |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| P026 | Paul Anderson · 47 · M | B2B sales rep, industrial supplies · Senior | Bach | Q4 | C4 | 6 | 5 | C:H R:L | Weekly | MMHML | H / Main / M | 1-6m · divorced, 2 kids | Suburb · M | 4.52 | Relationships are his edge. Worries procurement bots will cut him out of the deal. |
| P027 | Fatima Zahra Benali · 33 · F | Purchasing and inventory analyst · Mid | Bach | Q3 | C4 | 3 | 5 | C:H R:L | Daily | HHLHM | M / Early / M | 1-6m · married, expecting | Metro · H | 4.52 | Forecasting tools are replacing her spreadsheets. Wants to be the one who runs them. |
| P028 | Greg Thompson · 60 · M | Owner, family food distributor · Owner | Sec | Q5 | C3 | 6 | 6 | C:M R:M | None | LHMMM | L / Late / M | Wealthy (asset-rich) · married, son in the business | Suburb · M | 4.52 | His son pushes AI and he resists. Fears losing control of what he built. |
| P029 | Kayla Morgan · 21 · F | Order picker and van driver · Entry | Sec | Q1 | C3 | 2 | 3 | C:L R:H | Weekly | MMHHM | M / Main / L | <1m · lives with boyfriend | Suburb · M | 4.52 | Part-time stopgap while she studies nursing online. |
| P030 | Hassan Raza · 39 · M | Customs broker, self-employed · Mid | Bach | Q4 | C4 | 5 | 5 | C:H R:L | Daily | MHMMM | H / Early / M | 1-6m · married, 3 kids | Metro · M | 4.52 | Paperwork is his whole business. Sees AI as a tool and a threat at the same time. |

### 7.7 Retail trade

| ID | Name · Age · Gender | Role · Seniority | Edu | Income | Comp | Econ | Social | AI exposure | AI use | OCEAN | Risk / Tech / Trust | Buffer · Household | Place · Options | Wt | Anchor |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| P031 | Linda Foster · 54 · F | Supermarket cashier, long tenure · Junior | Sec | Q1 | C4 | 4 | 5 | C:L R:H | None | LHMHM | L / Late / M | <1m · widowed, raises her grandson | Town · L | 11.37 | Got moved to "assist" the self-checkouts. Dreads the next step. |
| P032 | Marcus Lee · 19 · M | Sales associate, electronics store · Entry | Sec | Q1 | C3 | 5 | 3 | C:M R:M | Daily | HMHML | H / Early / L | <1m · lives with parents | Suburb · M | 11.37 | Loves tech and assumes he will ride the wave. Has no plan. |
| P033 | Olivia Grant · 42 · F | Store manager, apparel chain · Senior | Assoc | Q3 | C4 | 4 | 4 | C:M R:L | Weekly | MHHMM | M / Main / M | 1-6m · married, 2 kids | Suburb · M | 11.37 | Headcount targets keep dropping. Stuck between her staff and head office. |
| P034 | Raj Patel · 50 · M | Owner, two convenience stores · Owner | Bach | Q4 | C4 | 6 | 6 | C:L R:M | Occasional | MHMML | H / Main / L | 1-6m · married, 3 kids | Suburb · M | 11.37 | Works 70-hour weeks. Would automate the night shift tomorrow if he could afford it. |
| P035 | Sam Rivera · 30 · F | E-commerce merchandiser · Mid | Bach | Q3 | C3 | 2 | 1 | C:H R:L | Daily | HMMHH | M / Early / L | <1m · shares a flat, student debt | Metro · H | 11.37 | Generative tools now write the product copy. Anxious and politically active. |

### 7.8 Transportation and warehousing

| ID | Name · Age · Gender | Role · Seniority | Edu | Income | Comp | Econ | Social | AI exposure | AI use | OCEAN | Risk / Tech / Trust | Buffer · Household | Place · Options | Wt | Anchor |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| P036 | Bill Jackson · 48 · M | Long-haul truck driver, owner-operator · Mid | Sec | Q3 | C4 | 6 | 6 | C:L R:H | None | LHLMM | M / Late / L | <1m (truck loan) · married, 2 kids | Rural · L | 5.10 | Driverless trucks are the headline he fears most, and he still owes on his rig. |
| P037 | Nadia Ivanova · 35 · F | Warehouse fulfilment associate · Entry | Sec | Q1 | C3 | 3 | 4 | C:L R:H | Occasional | MMMHM | L / Main / L | <1m · single mother, 1 child | Suburb · M | 5.10 | Already works beside robots. The pick-rate quotas wear her out. |
| P038 | Carlos Mendes · 28 · M | Rideshare and delivery gig driver · Entry | Sec | Q2 | C3 | 5 | 4 | C:L R:H | Weekly | MMHMM | H / Early / L | <1m · single | Metro · H | 5.10 | Runs three apps at once. Knows robotaxis are coming and keeps hustling. |
| P039 | Emily Watson · 44 · F | Operations director, logistics provider · Exec | Mast | Q5 | C5 | 5 | 3 | C:H R:M | Daily | HHHML | M / Early / M | 6m+ · married, 2 kids | Metro · H | 5.10 | Leads the automation programme. Sees AI as table stakes for winning contracts. |
| P040 | Ahmed Yusuf · 62 · M | City bus driver · Senior | Sec | Q3 | C3 | 3 | 5 | C:L R:M | None | LHMHL | L / Late / H | 1-6m · married, adult kids | Metro · M | 5.10 | The union protects him. Counting the years to his pension. |

### 7.9 Information

| ID | Name · Age · Gender | Role · Seniority | Edu | Income | Comp | Econ | Social | AI exposure | AI use | OCEAN | Risk / Tech / Trust | Buffer · Household | Place · Options | Wt | Anchor |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| P041 | Jordan Kim · 27 · M | Software developer · Junior | Bach | Q3 | C3 | 4 | 2 | C:H R:L | Daily | HMMMH | M / Early / M | <1m · single, renting | Metro · M | 2.20 | Coding agents write most of his code. The hiring freeze rattled him. |
| P042 | Natalie Brennan · 39 · F | Reporter, regional newspaper · Mid | Bach | Q3 | C4 | 1 | 2 | C:H R:L | Weekly | HMMMH | L / Main / M | <1m · partner, 1 child | Town · L | 2.20 | Her newsroom has halved twice. Sees AI-generated content as a threat to local democracy. |
| P043 | Victor Alvarez · 45 · M | Engineering director, software company · Exec | Mast | Q5 | C5 | 5 | 2 | C:H R:L | Builds | HHMLL | H / Early / M | Wealthy (equity) · married, 2 kids | Metro · H | 2.20 | Reorganising his teams around AI agents and enjoying it. |
| P044 | Mei Lin Zhao · 31 · F | Data centre technician · Mid | Assoc | Q3 | C3 | 4 | 3 | C:L R:M | Weekly | MHLML | M / Main / M | 1-6m · married, no kids | Town · H | 2.20 | AI is the reason her work is booming. |
| P045 | Ethan Cole · 23 · M | Freelance video editor and creator · Entry | Assoc | Q1 | C3 | 3 | 2 | C:H R:L | Daily | HLHMH | H / Early / L | <1m · lives with parents | Suburb · M | 2.20 | Generative video tools let him do more and let clients pay him less. |

### 7.10 Finance and insurance

| ID | Name · Age · Gender | Role · Seniority | Edu | Income | Comp | Econ | Social | AI exposure | AI use | OCEAN | Risk / Tech / Trust | Buffer · Household | Place · Options | Wt | Anchor |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| P046 | Catherine Hale · 52 · F | Insurance claims adjuster · Senior | Bach | Q3 | C3 | 5 | 5 | C:H R:L | Occasional | LHMMM | L / Late / M | 1-6m · married, 2 kids at university | Suburb · M | 4.87 | Claims triage is automated. She handles the hard cases, for now. |
| P047 | David Okonkwo · 34 · M | Investment banking associate · Mid | Mast | Q5 | C4 | 7 | 3 | C:H R:L | Daily | MHHLM | H / Early / M | 1-6m (high spending) · single | Metro · H | 4.87 | The modelling grunt work is disappearing and the fight for VP slots is getting harder. |
| P048 | Grace Liu · 26 · F | Bank branch teller / personal banker · Entry | Bach | Q2 | C3 | 3 | 4 | C:H R:L | Weekly | MHMHM | L / Main / M | <1m · lives with parents, saving | Suburb · M | 4.87 | Branches keep closing. Wants to move into compliance. |
| P049 | Henrik Svensson · 58 · M | Chief Risk Officer, regional bank · Exec | Mast | Q5+ | C5 | 5 | 4 | C:M R:L | Weekly | MHMML | L / Main / H | Wealthy · married, 3 adult kids | Metro · H | 4.87 | Worries about model failures and correlated AI errors across banks more than about jobs. |
| P050 | Tasha Brown · 37 · F | Independent financial adviser · Mid | Bach | Q4 | C3 | 4 | 4 | C:H R:L | Weekly | MMHHM | M / Main / M | 1-6m · divorced, 1 child | Suburb · M | 4.87 | Robo-advisers are taking her younger clients. Leans on trust and face time. |

### 7.11 Real estate

| ID | Name · Age · Gender | Role · Seniority | Edu | Income | Comp | Econ | Social | AI exposure | AI use | OCEAN | Risk / Tech / Trust | Buffer · Household | Place · Options | Wt | Anchor |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| P051 | Kevin Murphy · 43 · M | Residential estate agent · Mid | Assoc | Q3 | C3 | 6 | 5 | C:M R:L | Weekly | MMHMM | H / Main / L | <1m (volatile commission) · married, 2 kids | Suburb · M | 1.74 | Income swings with the market. AI listing tools shrink what he adds. |
| P052 | Sofia Rossi · 61 · F | Owner, property management firm · Owner | Bach | Q5 | C4 | 6 | 5 | C:M R:L | Occasional | MHMML | M / Main / M | Wealthy (rental portfolio) · widowed | Metro · H | 1.74 | Sees AI as cheaper admin. Her assets stand to gain in a boom. |
| P053 | Andre Baptiste · 30 · M | Building maintenance technician · Junior | Voc | Q2 | C3 | 3 | 4 | C:L R:M | Occasional | MHMHL | M / Main / L | <1m · partner, 1 baby | Metro · H | 1.74 | Fixes things by hand and thinks robots are far off. His rent keeps rising. |
| P054 | Hannah Weiss · 36 · F | Commercial real estate analyst · Mid | Mast | Q4 | C5 | 5 | 3 | C:H R:L | Daily | HHMMM | M / Early / M | 6m+ · married, no kids | Metro · H | 1.74 | Her modelling is automated, so she is pivoting to data-centre site selection. |
| P055 | Joe Castillo · 25 · M | Leasing consultant, apartment complex · Entry | Sec | Q1 | C1 | 4 | 4 | C:H R:L | Occasional | MLHMM | M / Main / L | <1m · roommates | Suburb · M | 1.74 | A leasing chatbot already answers most enquiries. Unsure what his job is now. |

### 7.12 Professional, scientific and technical services

| ID | Name · Age · Gender | Role · Seniority | Edu | Income | Comp | Econ | Social | AI exposure | AI use | OCEAN | Risk / Tech / Trust | Buffer · Household | Place · Options | Wt | Anchor |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| P056 | Rebecca Stone · 44 · F | Corporate law partner · Exec | Prof | Q5+ | C5 | 5 | 2 | C:H R:L | Weekly | MHHLM | M / Main / H | Wealthy · married, 2 kids | Metro · H | 8.58 | The billable hour is under threat and her firm cut its junior intake by half. |
| P057 | Michael Tan · 25 · M | Audit associate · Entry | Bach | Q3 | C3 | 4 | 4 | C:H R:L | Daily | MMMMH | L / Main / M | <1m · lives alone, student debt | Metro · M | 8.58 | Chose accounting because it felt safe. Now thinks it is one of the most exposed jobs. |
| P058 | Elena Petrova · 50 · F | Senior research scientist, biotech · Senior | Doc | Q5 | C5 | 3 | 2 | C:M R:L | Daily | HHLML | M / Early / H | 6m+ · married, 1 teen | Metro · M | 8.58 | AI has sped up her lab's work. Worries about the pace and about safety. |
| P059 | Chris Walker · 38 · M | Management consultant · Mid | Mast | Q5 | C3 | 5 | 3 | C:H R:L | Daily | MMHMM | H / Early / M | 1-6m (high spending) · married, 2 kids | Metro · H | 8.58 | AI now makes his slides and research. He sells "AI transformation" to clients anyway. |
| P060 | Aisha Bello · 32 · F | Architect · Mid | Mast | Q3 | C3 | 3 | 3 | C:H R:L | Daily | HHMHM | M / Early / M | 1-6m · married, 1 child | Metro · M | 8.58 | Uses generative design tools and loves the craft. Fears her work becomes a commodity. |

### 7.13 Management of companies

| ID | Name · Age · Gender | Role · Seniority | Edu | Income | Comp | Econ | Social | AI exposure | AI use | OCEAN | Risk / Tech / Trust | Buffer · Household | Place · Options | Wt | Anchor |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| P061 | Richard Hayes · 59 · M | CFO, holding company · Exec | Mast | Q5+ | C4 | 6 | 5 | C:M R:L | Occasional | LHMLL | M / Main / H | Wealthy · married | Metro · H | 2.09 | Reads AI through the cost lines. Shareholder value comes first. |
| P062 | Laura Bennett · 41 · F | Corporate strategy manager · Senior | Mast | Q5 | C4 | 4 | 3 | C:H R:L | Daily | HHHMM | M / Early / M | 6m+ · married, 2 kids | Metro · H | 2.09 | Writing the group AI strategy and aware that middle management is the main target. |
| P063 | Omar Farouk · 29 · M | HR business partner · Junior | Bach | Q3 | C3 | 3 | 4 | C:H R:L | Weekly | MMHHM | L / Main / M | 1-6m · newly married | Metro · H | 2.09 | Expects to be the one who runs the layoffs. Feels torn about it. |
| P064 | Patricia Gomez · 48 · F | Executive assistant to the CEO · Senior | Assoc | Q3 | C5 | 4 | 5 | C:H R:L | Weekly | LHMHM | L / Main / H | 1-6m · divorced, 1 teen | Metro · H | 2.09 | Indispensable because she knows everything. AI agents now schedule and draft. |
| P065 | Ben Nakamura · 35 · M | Shared-services finance team lead · Mid | Bach | Q4 | C2 | 5 | 4 | C:H R:L | Occasional | LMMMH | L / Main / M | 1-6m · married, 2 kids, mortgage | Suburb · M | 2.09 | Promoted on tenure, not skill. Process automation will expose that. |

### 7.14 Administrative and support services

| ID | Name · Age · Gender | Role · Seniority | Edu | Income | Comp | Econ | Social | AI exposure | AI use | OCEAN | Risk / Tech / Trust | Buffer · Household | Place · Options | Wt | Anchor |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| P066 | Maria Lopez · 46 · F | Contract office cleaner · Entry | LS | Q1 | C4 | 3 | 6 | C:L R:M | None | LHLHM | L / Late / L | <1m · married, 3 kids, sends money home | Metro · H | 6.96 | Holds two jobs. Floor-cleaning robots have started showing up in the lobbies. |
| P067 | Jason Park · 32 · M | Outsourced call centre agent · Junior | Assoc | Q1 | C3 | 2 | 3 | C:H R:L | Occasional | MMMMH | L / Main / L | <1m · lives with parents, in debt | Town · L | 6.96 | AI voice agents replace colleagues every week. |
| P068 | Denise Carter · 55 · F | Branch manager, temp staffing agency · Senior | Assoc | Q3 | C4 | 5 | 5 | C:M R:L | Occasional | MHHHL | M / Main / M | 1-6m · married | Town · M | 6.96 | Her business lives on demand for human labour. |
| P069 | Tom Fischer · 40 · M | Security guard · Junior | Sec | Q2 | C3 | 6 | 6 | C:L R:H | None | LMLML | L / Late / L | <1m · single | Suburb · M | 6.96 | AI camera monitoring means fewer guards per site. |
| P070 | Ngozi Eze · 27 · F | Data entry and document clerk · Entry | Bach | Q1 | C4 | 3 | 5 | C:H R:L | Weekly | MHLHM | L / Main / M | <1m · sends money home | Metro · M | 6.96 | Highly exposed and studying part-time for a coding certificate. |

### 7.15 Educational services

| ID | Name · Age · Gender | Role · Seniority | Edu | Income | Comp | Econ | Social | AI exposure | AI use | OCEAN | Risk / Tech / Trust | Buffer · Household | Place · Options | Wt | Anchor |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| P071 | Karen Mitchell · 51 · F | High school maths teacher · Senior | Mast | Q3 | C4 | 3 | 3 | C:M R:L | Weekly | MHMHM | L / Main / H | 1-6m · married, 2 kids | Suburb · M | 3.02 | Students use AI to skip the thinking. Worries about learning, not her job. |
| P072 | James Whitfield · 64 · M | Tenured history professor · Senior | Doc | Q4 | C4 | 2 | 2 | C:M R:L | None | HHMML | L / Late / H | 6m+ · married | Town · L | 3.02 | Sees AI as a threat to the humanities and to careful thought. |
| P073 | Lucy Adams · 28 · F | Freelance online language tutor · Junior | Bach | Q2 | C3 | 3 | 2 | C:H R:L | Daily | HMHHM | M / Early / L | <1m · single | Metro · M | 3.02 | AI tutors have already pushed her rates down. |
| P074 | Daniel Reyes · 39 · M | School district edtech lead · Mid | Mast | Q4 | C4 | 5 | 3 | C:H R:L | Daily | HHMML | H / Early / M | 1-6m · married, 1 child | Suburb · M | 3.02 | Champions AI in classrooms and runs the pilots. |
| P075 | Fiona Walsh · 33 · F | Kindergarten teacher · Mid | Bach | Q2 | C5 | 2 | 3 | C:L R:L | Occasional | MHHHM | L / Main / M | <1m · partner, 1 child | Suburb · H | 3.02 | Her work is care, so it feels safe. Worries about children raised by screens. |

### 7.16 Health care and social assistance

| ID | Name · Age · Gender | Role · Seniority | Edu | Income | Comp | Econ | Social | AI exposure | AI use | OCEAN | Risk / Tech / Trust | Buffer · Household | Place · Options | Wt | Anchor |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| P076 | Rajesh Kumar · 47 · M | Radiologist · Senior | Prof | Q5+ | C4 | 5 | 4 | C:H R:L | Daily | MHMMM | M / Early / M | Wealthy · married, 2 kids | Metro · H | 16.24 | Uses AI reads daily. The "AI will replace radiologists" headline still nags at him. |
| P077 | Angela Moore · 39 · F | ICU registered nurse · Mid | Bach | Q3 | C5 | 3 | 3 | C:L R:L | Weekly | MHMHM | M / Main / M | 1-6m · married, 3 kids | Metro · H | 16.24 | Burned out. Wants AI charting, rejects AI at the bedside. |
| P078 | Juan Pérez · 31 · M | Home health aide · Entry | Voc | Q1 | C4 | 3 | 6 | C:L R:M | None | LHMHL | L / Late / L | <1m · married, 2 kids | Suburb · H | 16.24 | Demand for care keeps rising. Care robots are his long-run worry. |
| P079 | Brenda Collins · 56 · F | Medical billing and coding specialist · Mid | Voc | Q2 | C3 | 5 | 5 | C:H R:L | Weekly | LHLMH | L / Late / M | <1m · divorced, adult son at home | Town · L | 16.24 | Coding automation is ramping up and she has few skills that transfer. |
| P080 | Mei Wong · 35 · F | Family doctor · Mid | Prof | Q5 | C4 | 3 | 2 | C:M R:L | Daily | HHMHM | M / Main / H | 1-6m (medical school debt) · partner, 1 baby | Suburb · H | 16.24 | An AI scribe saves her two hours a day. Worries about patients diagnosing themselves with chatbots. |

### 7.17 Arts, entertainment and recreation

| ID | Name · Age · Gender | Role · Seniority | Edu | Income | Comp | Econ | Social | AI exposure | AI use | OCEAN | Risk / Tech / Trust | Buffer · Household | Place · Options | Wt | Anchor |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| P081 | Leo Martins · 29 · M | Freelance illustrator and concept artist · Junior | Bach | Q1 | C4 | 1 | 1 | C:H R:L | None | HMLMH | M / Resistant / L | <1m · shares a flat | Metro · L | 1.86 | Image generators gutted his commissions. Furious that his work trained them. |
| P082 | Chloe Bernard · 45 · F | Theatre and live-event producer · Senior | Bach | Q3 | C4 | 3 | 2 | C:M R:L | Occasional | HHHMM | H / Main / M | 1-6m · married | Metro · M | 1.86 | Betting that live human performance becomes a premium product. |
| P083 | Malik Johnson · 24 · M | Gym personal trainer · Entry | Voc | Q2 | C3 | 5 | 4 | C:L R:L | Weekly | MMHML | H / Early / M | <1m · single | Suburb · H | 1.86 | AI fitness apps compete with him, but in-person sessions still sell. |
| P084 | Isabelle Fontaine · 37 · F | Session musician and music teacher · Mid | Mast | Q2 | C5 | 2 | 2 | C:H R:L | Occasional | HMMHM | M / Main / L | <1m · partner | Metro · L | 1.86 | AI music has eaten her studio work. Teaching still pays the rent. |
| P085 | Steve Russo · 52 · M | Owner, bowling and amusement centre · Owner | Sec | Q4 | C3 | 6 | 6 | C:L R:M | None | LMHML | M / Late / L | 1-6m · married, 2 kids | Town · M | 1.86 | Thinks people will always pay for offline fun. Wary of taking on debt. |

### 7.18 Accommodation and food services

| ID | Name · Age · Gender | Role · Seniority | Edu | Income | Comp | Econ | Social | AI exposure | AI use | OCEAN | Risk / Tech / Trust | Buffer · Household | Place · Options | Wt | Anchor |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| P086 | Carmen Delgado · 44 · F | Line cook · Junior | LS | Q1 | C4 | 3 | 5 | C:L R:M | None | LHMMM | M / Late / L | <1m · single mother, 2 kids | Metro · H | 9.86 | Fast and reliable. Has seen robot kitchens on the news and cannot afford a gap in work. |
| P087 | Tyrone Harris · 20 · M | Fast-food crew member · Entry | Sec | Q1 | C1 | 4 | 4 | C:L R:H | Weekly | MLHMM | H / Early / L | <1m · lives with his mother | Metro · H | 9.86 | Kiosks and AI drive-through ordering already took the till jobs. |
| P088 | Irina Sokolova · 33 · F | Hotel front desk supervisor · Mid | Bach | Q2 | C4 | 4 | 4 | C:M R:M | Weekly | MHHHL | M / Main / M | <1m · married | Metro · M | 9.86 | Mobile check-in shrinks the desk. Wants to move into revenue management. |
| P089 | Antonio Ricci · 58 · M | Owner and chef, family restaurant · Owner | Voc | Q3 | C5 | 5 | 6 | C:L R:L | None | MHHMM | M / Late / L | <1m (business debt) · married, kids work there | Town · M | 9.86 | Thin margins and a strong craft identity. |
| P090 | Jasmine Taylor · 26 · F | Server and bartender · Entry | Assoc | Q2 | C4 | 2 | 1 | C:L R:L | Weekly | HMHHM | H / Main / L | <1m · roommates | Metro · H | 9.86 | Lives on tips. Values human service and votes progressive. |

### 7.19 Other services

| ID | Name · Age · Gender | Role · Seniority | Edu | Income | Comp | Econ | Social | AI exposure | AI use | OCEAN | Risk / Tech / Trust | Buffer · Household | Place · Options | Wt | Anchor |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| P091 | Gloria Ramirez · 49 · F | Owner and stylist, hair salon · Owner | Voc | Q3 | C5 | 4 | 5 | C:L R:L | Occasional | MHHHM | M / Main / M | 1-6m · married, 2 teens | Suburb · H | 4.18 | Her clients are friends. Feels AI-proof. |
| P092 | Mike Sullivan · 37 · M | Auto mechanic · Mid | Voc | Q3 | C3 | 6 | 6 | C:M R:M | Occasional | LHMML | M / Main / L | 1-6m · married, 3 kids | Town · M | 4.18 | EVs and diagnostic software keep changing the job. Relies on his hands. |
| P093 | Emmanuel Okeke · 60 · M | Church pastor · Senior | Mast | Q2 | C4 | 4 | 7 | C:L R:L | None | MHHHL | L / Late / M | 1-6m · married, adult kids | Town · L | 4.18 | Thinks about meaning and community. Many of his congregants work exposed jobs. |
| P094 | Kim Nguyen · 31 · F | Nail technician · Junior | Voc | Q1 | C4 | 4 | 5 | C:L R:M | Occasional | MHMHM | M / Main / L | <1m · married, 1 child, supports her parents | Suburb · H | 4.18 | Steady trade. Nail-painting kiosks in the mall worry her a little. |
| P095 | Alex Turner · 42 · M | Programme manager, advocacy nonprofit · Mid | Bach | Q3 | C4 | 1 | 1 | C:H R:L | Weekly | HHHHM | M / Early / L | <1m · partner | Metro · M | 4.18 | Sees AI as concentrating power. Organises around worker rights. |

### 7.20 Government

| ID | Name · Age · Gender | Role · Seniority | Edu | Income | Comp | Econ | Social | AI exposure | AI use | OCEAN | Risk / Tech / Trust | Buffer · Household | Place · Options | Wt | Anchor |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| P096 | Susan Price · 53 · F | Benefits eligibility caseworker · Mid | Bach | Q3 | C3 | 3 | 4 | C:H R:L | Occasional | LHMHM | L / Late / H | 1-6m · married, 2 adult kids | Town · L | 16.36 | Her agency is piloting AI eligibility checks. Civil-service rules protect her, for now. |
| P097 | Mark Davies · 47 · M | Military logistics officer · Senior | Mast | Q4 | C4 | 5 | 6 | C:M R:M | Weekly | MHMML | M / Main / H | 6m+ · married, 3 kids | Suburb · M | 16.36 | Sees AI as a national-security race the country cannot lose. |
| P098 | Lisa Romero · 34 · F | Police patrol officer · Mid | Assoc | Q3 | C3 | 5 | 5 | C:L R:M | Occasional | MHHML | H / Main / M | 1-6m · married, 2 kids | Suburb · M | 16.36 | Body-cam analytics and drones are arriving. Distrusts automated decisions about people. |
| P099 | Anil Sharma · 44 · M | Senior policy adviser, ministry of economy · Senior | Doc | Q5 | C5 | 4 | 3 | C:H R:L | Daily | HHMMM | L / Early / H | 6m+ · married, 2 kids | Metro · H | 16.36 | Drafts the national AI policy. Torn between growth and displacement. |
| P100 | Megan Clarke · 24 · F | Municipal administrative clerk · Entry | Assoc | Q2 | C3 | 3 | 3 | C:H R:L | Weekly | MMMHH | L / Main / M | <1m · lives with partner | Town · M | 16.36 | Permits and records are going digital. Her job feels secure until it isn't. |

## 8. People outside paid work

Same columns. Role · Seniority becomes Status. Comp is shown as n/a for retirees and carers where workplace competence no longer applies. AI exposure refers to the prior job, the target career or the household earner.

| ID | Name · Age · Gender | Status | Edu | Income | Comp | Econ | Social | AI exposure | AI use | OCEAN | Risk / Tech / Trust | Buffer · Household | Place · Options | Wt | Anchor |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| N01 | Ray Dawson · 51 · M | Unemployed 8 months, laid-off claims processor (finance) | Sec | Q1 | C3 | 6 | 6 | C:H R:L | Occasional | LMLMH | L / Late / L | <1m (savings gone) · divorced | Town · L | 7.50 | Blames AI one week and immigration the next. Applying everywhere. |
| N02 | Neha Desai · 28 · F | Unemployed 3 months, laid-off UX copywriter (information) | Bach | Q2 | C4 | 2 | 2 | C:H R:L | Daily | HMHMH | M / Early / M | 1-6m · single | Metro · M | 7.50 | Reskilling and angry at the tech companies. |
| N03 | Walter Gibbs · 59 · M | Long-term unemployed, ex-factory worker, on disability benefit | LS | Q1 | C2 | 4 | 6 | C:L R:H | None | LMLMH | L / Resistant / L | <1m · lives alone | Town · L | 7.50 | Disengaged. Gets news from TV and is open to conspiracy theories. |
| N04 | Bianca Lima · 23 · F | Job seeker, marketing graduate with no first job yet | Bach | Q1 | C3 | 3 | 2 | C:H R:L | Daily | HMHMH | M / Early / L | <1m · lives with parents | Suburb · L | 7.50 | The entry-level postings she trained for have vanished. |
| N05 | Aiden Kowal · 17 · M | High school student | Sec* | Q3 | C3 | 5 | 4 | C:H R:L | Daily | MLHMM | H / Early / M | Dependent · lives with parents | Suburb · M | 17.50 | Wants to be a game developer. Uses AI for homework. |
| N06 | Zara Khan · 20 · F | Undergraduate, computer science | Bach* | Q4 | C4 | 3 | 3 | C:H R:L | Daily | HHMMH | M / Early / M | Dependent · student loans | Metro · H | 17.50 | Weighing whether to switch from CS to medicine. |
| N07 | Liam O'Connor · 19 · M | Electrician apprentice at vocational college | Voc* | Q2 | C4 | 5 | 5 | C:L R:M | Occasional | MHMML | M / Main / M | <1m · lives with family | Town · H | 17.50 | Picked a trade because he thought it was AI-safe. |
| N08 | Wanjiru Mwangi · 26 · F | PhD student, machine learning | Doc* | Q2 | C5 | 4 | 2 | C:H R:L | Builds | HHMMM | H / Early / M | <1m · stipend, single | Metro · H | 17.50 | Has an insider's view of the field and is ambivalent about it. |
| N09 | Harold Jenkins · 72 · M | Retiree, ex-utility engineer, pension plus investments | Bach | Q4 | n/a | 6 | 6 | C:L R:L | Occasional | LHMML | L / Late / H | Wealthy · married, grandchildren | Suburb · n/a | 60.00 | His portfolio is up on AI stocks. Worries about his grandchildren's jobs. |
| N10 | Dorothy Evans · 68 · F | Retiree, ex-retail, state pension only | Sec | Q1 | n/a | 3 | 6 | C:L R:L | None | LHLHM | L / Resistant / M | <1m · widowed | Town · n/a | 90.00 | Price-sensitive. Scared of AI voice scams. |
| N11 | Kenji Watanabe · 66 · M | Early retiree, ex-tech executive | Mast | Q5+ | n/a | 7 | 4 | C:L R:L | Daily | HHMLL | H / Early / M | Wealthy · married | Metro · n/a | 5.00 | Invests in AI start-ups. Wants it to go faster. |
| N12 | Margaret Hughes · 75 · F | Retiree, ex-teacher, in assisted living | Bach | Q2 | n/a | 3 | 5 | C:L R:M | None | MHMHM | L / Late / H | 1-6m (pension) · widowed | Town · n/a | 65.00 | Care robots could serve her. She wants human company. |
| N13 | Sana Ali · 38 · F | Full-time homemaker, 3 kids, spouse in IT | Bach | Q4 | n/a | 4 | 6 | C:H R:L | Occasional | MHMHM | L / Main / M | 1-6m · married, 3 kids | Suburb · M | 30.00 | Household income hangs on her husband's exposed job. |
| N14 | Peter Novak · 45 · M | Full-time carer for a disabled parent, ex-construction | Sec | Q1 | n/a | 2 | 4 | C:L R:M | None | LHLHH | L / Late / L | <1m · lives with his mother | Town · L | 30.00 | Relies on carer benefits. Interested in basic income. |
| N15 | Isaac Boateng · 34 · M | On disability benefit, chronic illness, ex-call centre | Assoc | Q1 | n/a | 2 | 3 | C:H R:L | Weekly | MMLHH | L / Main / L | <1m · single | Metro · M | 40.00 | AI assistive tools might let him work from home again. |

## 9. Remaining limits

- The default weights are stylised for a generic advanced economy. They fit no specific country until you replace them with national data (section 5).
- The country presets are qualitative. They tell the simulator which direction to push a reaction, not by how much. Calibrate the size of each adjustment against survey data if you have it.
- Personas react on their own. The simulation does not model people influencing each other, such as a worker hearing a colleague was laid off or a family pooling income. Add a social-network step if contagion of fear or optimism matters to you.
