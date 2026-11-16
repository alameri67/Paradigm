# Portraits to generate

The app shows one portrait per job. We have the family doctor already (`public/portraits/health.jpg`), so **19 portraits are needed**.

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
