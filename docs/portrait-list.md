# Portraits to generate

The app shows one portrait per job. All 20 are now in `public/portraits/`, each with a background-free cut-out (`<sector>-cutout.png`) made by `scripts/make-portrait-cutout.py`.

## Match the doctor's style

Use the same wording at the start of every prompt, so all the portraits look like a set:

> Vintage sepia-toned studio portrait photograph, 1950s style, soft warm light. Head and shoulders, the person facing the camera and smiling gently. The edges fade softly into a pure white background, with no frame and no border. Square image.

Then add the person and their work clothes from the table below.

Tips:

- **Square, at least 640 × 640 pixels.** Larger is fine.
- **Pure white background** with soft faded edges, so the picture blends into the white page.
- **One person, head and shoulders,** with one or two things that tell you their job at a glance (like the doctor's stethoscope).
- **No text, logos or brand names** on clothes or tools.
- **Mix ages, genders and backgrounds** across the set. The doctor is a man in his 40s, so the list below leans the other way where it fits.

## The list

| # | Job | Sector | Save as | Who to show |
|---|---|---|---|---|
| 1 | Farmer | Agriculture | `public/portraits/agriculture.jpg` | A woman in her 40s in a work shirt and quilted vest, sleeves rolled up, a wisp of straw on her shoulder. |
| 2 | Miner | Mining, oil and gas | `public/portraits/mining.jpg` | A man in his 30s in a hard hat with a head lamp, a high-visibility jacket over overalls, a smudge of dust on his cheek. |
| 3 | Lineworker | Utilities | `public/portraits/utilities.jpg` | A man in his 20s in a hard hat and safety glasses pushed up, a climbing harness strap across his chest, insulated gloves tucked in a pocket. |
| 4 | Construction worker | Construction | `public/portraits/construction.jpg` | A man in his 50s in a hard hat and work shirt, a pencil behind his ear, a carpenter's tool belt strap on his shoulder. |
| 5 | Factory machine operator | Manufacturing | `public/portraits/manufacturing.jpg` | A woman in her 30s in a factory work jacket, safety glasses and ear defenders around her neck, hair tied back. |
| 6 | Wholesale buyer | Wholesale trade | `public/portraits/wholesale.jpg` | A man in his 40s in a shirt and tie with a lanyard badge, holding a clipboard, a warehouse shelf softly blurred behind him. |
| 7 | Cashier and shop assistant | Retail trade | `public/portraits/retail.jpg` | A woman in her 50s in a shop uniform tabard with a blank name badge, a friendly smile. |
| 8 | Truck driver | Transportation and warehousing | `public/portraits/transport.jpg` | A man in his 40s in a work jacket and cap, one hand resting on a big steering wheel. |
| 9 | Software developer | Information | `public/portraits/information.jpg` | A young woman in her 20s in a casual sweater, headphones around her neck, glasses. |
| 10 | Insurance clerk | Finance and insurance | `public/portraits/finance.jpg` | A woman in her 30s in a neat blouse and cardigan, a pen in hand, a stack of files beside her. |
| 11 | Estate agent | Real estate | `public/portraits/realestate.jpg` | A man in his 30s in a smart suit, holding up a set of house keys. |
| 12 | Lawyer | Professional, scientific and technical services | `public/portraits/professional.jpg` | A woman in her 40s in a dark tailored suit, holding a thick legal file. |
| 13 | Middle manager | Management of companies | `public/portraits/management.jpg` | A man in his 50s in a suit with the tie loosened, reading glasses in his top pocket. |
| 14 | Office administrator | Administrative and support services | `public/portraits/admin.jpg` | A woman in her 50s in a blouse, a phone headset on, a diary open in front of her. |
| 15 | Teacher | Educational services | `public/portraits/education.jpg` | A man in his 30s in a shirt and knitted vest, chalk dust on his hands, a book under his arm. |
| 16 | Musician | Arts, entertainment and recreation | `public/portraits/arts.jpg` | A woman in her 20s holding an acoustic guitar against her shoulder. |
| 17 | Cook | Accommodation and food services | `public/portraits/accommodation.jpg` | A man in his 40s in chef's whites and a neckerchief, a kitchen towel over his shoulder. |
| 18 | Mechanic | Other services | `public/portraits/other.jpg` | A woman in her 30s in work overalls, a wrench in hand, a grease mark on her forearm. |
| 19 | Civil servant caseworker | Government | `public/portraits/government.jpg` | A man in his 60s in a cardigan over a shirt and tie, an ID badge on a lanyard, a folder under his arm. |

The file names match the sector IDs the app already uses, so once a file is in `public/portraits/`, I only need to point that job at it.

## Optional: a portrait for every age

Each job has 243 versions of the worker, at three ages: early career (27), mid career (43) and late career (58). If you want the picture to change with the age you pick, make three portraits per job: **60 in total**, or 57 more on top of the doctor. Name them by age, for example `agriculture-early.jpg`, `agriculture-mid.jpg` and `agriculture-late.jpg`, and keep the same person's look and clothing across the three ages.

## Second set: the other gender for each job

Each job's 243 versions are half men and half women, so every job needs a second portrait of the other gender. The app picks the one that matches the person on screen. Save each one in `public/portraits/` under the name in the table, then run `python3 scripts/make-portrait-cutout.py` on it.

### Shared prompt

Use this with two reference images: **image 1** is the job's current portrait (for the clothes, props, pose and framing) and **image 2** is the doctor (`health.jpg`, for the colour, contrast and grain).

> Create a new vintage studio portrait photograph of a different person: [PERSON]. Match image 1 closely in everything except the person: the same work clothes and props, the same pose, the same head-and-shoulders framing, and the same soft feathered shoulder edges that fade into a pure white #FFFFFF background. Match image 2 exactly in photographic treatment: nearly black-and-white warm grayscale, charcoal-black shadows, gray midtones, muted ivory highlights, a very subtle warm tint, strong photographic contrast, clear facial detail and fine analog grain. 1950s style, soft warm studio light, facing the camera with a gentle natural smile. Empty canvas is opaque pure white. No text, logos, border or frame. One person only. Square, at least 1024 × 1024.

Replace `[PERSON]` with the description for each job.

| Job | Image 1 (reference) | [PERSON] | Save as |
|---|---|---|---|
| Farmer | `agriculture.jpg` | a man in his 40s with a weathered, sun-lined face and short dark hair | `agriculture-m.jpg` |
| Miner | `mining.jpg` | a woman in her 30s with her hair tied back under the hard hat | `mining-f.jpg` |
| Lineworker | `utilities.jpg` | a woman in her 20s with a short practical haircut | `utilities-f.jpg` |
| Construction worker | `construction.jpg` | a woman in her 50s with greying hair tucked under the hard hat | `construction-f.jpg` |
| Factory machine operator | `manufacturing.jpg` | a man in his 30s with a neat short haircut | `manufacturing-m.jpg` |
| Wholesale buyer | `wholesale.jpg` | a woman in her 40s with shoulder-length hair | `wholesale-f.jpg` |
| Cashier and shop assistant | `retail.jpg` | a man in his 50s with thinning grey hair and glasses | `retail-m.jpg` |
| Truck driver | `transport.jpg` | a woman in her 40s with curly hair under a cap | `transport-f.jpg` |
| Software developer | `information.jpg` | a man in his 20s with glasses and tousled hair | `information-m.jpg` |
| Insurance clerk | `finance.jpg` | a man in his 30s wearing a cardigan over a shirt and tie | `finance-m.jpg` |
| Estate agent | `realestate.jpg` | a woman in her 30s in a smart skirt suit | `realestate-f.jpg` |
| Lawyer | `professional.jpg` | a man in his 40s in a dark three-piece suit | `professional-m.jpg` |
| Middle manager | `management.jpg` | a woman in her 50s in a tailored jacket, reading glasses on a chain | `management-f.jpg` |
| Office administrator | `admin.jpg` | a man in his 50s wearing the phone headset, sleeves neatly rolled | `admin-m.jpg` |
| Teacher | `education.jpg` | a woman in her 30s in a blouse and knitted cardigan | `education-f.jpg` |
| Family doctor | `health.jpg` | a woman in her 40s in a white coat with a stethoscope around her neck | `health-f.jpg` |
| Musician | `arts.jpg` | a man in his 20s with wavy hair | `arts-m.jpg` |
| Cook | `accommodation.jpg` | a woman in her 40s in chef's whites, her hair under the chef's hat | `accommodation-f.jpg` |
| Mechanic | `other.jpg` | a man in his 30s with a grease mark on his forearm | `other-m.jpg` |
| Civil servant caseworker | `government.jpg` | a woman in her 60s with short grey hair | `government-f.jpg` |

For the family doctor, use `health.jpg` as both image 1 and image 2.

## New jobs (added 16 Nov 2026)

12 jobs were added: accountant, journalist, nurse, care worker, customer service agent, graphic designer, translator, warehouse worker, electrician, police officer, marketing specialist and delivery driver. Each needs **two portraits, a woman and a man**: 24 images.

### Shared prompt for new jobs

Use one reference image: the doctor (`health.jpg`), for the colour, contrast and grain only.

> Create a new vintage studio portrait photograph of [PERSON]. Match the reference image exactly in photographic treatment: nearly black-and-white warm grayscale, charcoal-black shadows, gray midtones, muted ivory highlights, a very subtle warm tint, strong photographic contrast, clear facial detail and fine analog grain. Do not copy the reference person or their clothes. 1950s style, soft warm studio light. Head and shoulders, facing the camera with a gentle natural smile. The shoulders have soft feathered edges that fade into a pure white #FFFFFF background. Empty canvas is opaque pure white. No text, logos, border or frame. One person only. Square, at least 1024 × 1024.

| Job | [PERSON] (woman) | Save as | [PERSON] (man) | Save as |
|---|---|---|---|---|
| Accountant | a woman in her 40s in a neat blouse and cardigan, reading glasses, holding a ledger book and a pencil | `accountant-f.jpg` | a man in his 50s in a shirt, tie and sleeve garters, reading glasses, holding a ledger book | `accountant.jpg` |
| Journalist | a woman in her 30s in a trench coat, a reporter's notebook and pencil in hand | `journalist.jpg` | a man in his 40s in a rumpled jacket with his tie loosened, a notebook in his breast pocket | `journalist-m.jpg` |
| Nurse | a woman in her 30s in a nurse's uniform with a fob watch pinned to it | `nurse.jpg` | a man in his 40s in a nurse's tunic with a fob watch pinned to it | `nurse-m.jpg` |
| Care worker | a woman in her 50s in a tabard over a cardigan, a kind, tired smile | `care-worker.jpg` | a man in his 30s in a tabard over a shirt, a kind smile | `care-worker-m.jpg` |
| Customer service agent | a woman in her 20s with a telephone headset, a blank name badge | `customer-service-f.jpg` | a man in his 20s with a telephone headset, a blank name badge | `customer-service.jpg` |
| Graphic designer | a woman in her 20s in a turtleneck, a pencil behind her ear, holding a sketchbook | `graphic-designer.jpg` | a man in his 30s in a turtleneck and glasses, holding a sketchbook | `graphic-designer-m.jpg` |
| Translator | a woman in her 40s in a blouse, holding a dictionary, glasses on | `translator-f.jpg` | a man in his 50s in a cardigan and glasses, holding a dictionary | `translator.jpg` |
| Warehouse worker | a woman in her 30s in a work jacket and high-visibility vest, holding a handheld scanner | `warehouse-f.jpg` | a man in his 20s in a work jacket and high-visibility vest, holding a handheld scanner | `warehouse.jpg` |
| Electrician | a woman in her 30s in overalls, a coil of cable over her shoulder, a screwdriver in her top pocket | `electrician.jpg` | a man in his 40s in overalls, a coil of cable over his shoulder | `electrician-m.jpg` |
| Police officer | a woman in her 30s in a police uniform and peaked cap, no badges with text | `police-f.jpg` | a man in his 40s in a police uniform and peaked cap, no badges with text | `police.jpg` |
| Marketing specialist | a woman in her 30s in a smart blouse, holding a layout board | `marketing.jpg` | a man in his 30s in a smart shirt, holding a layout board | `marketing-m.jpg` |
| Delivery driver | a woman in her 20s in a cap and work jacket, carrying a parcel | `delivery-f.jpg` | a man in his 30s in a cap and work jacket, carrying a parcel | `delivery.jpg` |

## Still missing, all together

- **24 portraits for the new jobs** (table above).
- **20 other-gender portraits for the first 20 jobs** (the "Second set" table).

That's 44 images in total. Until a portrait exists, the app shows no picture for that person rather than the wrong face.
