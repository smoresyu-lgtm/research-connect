# Research Connect

A simple website that helps high schoolers and undergrads find professors currently
looking for research assistants, interns, or shadows — searchable by field of study.

## How the project is organized

```
research-connect/
├── index.html      the page structure (you probably won't need to touch this often)
├── styles.css       all the colors, fonts, and layout
├── script.js        the search/filter logic — reads data.json and builds the cards
├── data.json        THE FILE YOU'LL EDIT — every listing lives here
└── README.md         this file
```

## Adding or updating a listing (do this weekly)

Open `data.json` in any text editor (even GitHub's own web editor works). Each listing
is one entry like this — copy an existing one and change the values:

There are two kinds of listings, and the fields differ slightly:

**A) Direct Outreach** — a professor you email directly, no application form.

```json
{
  "id": 7,
  "name": "Dr. First Last",
  "title": "Assistant Professor",
  "university": "Name of University",
  "state": "State/Province, Country",
  "department": "Department name",
  "field": "Biology",
  "tags": ["a few", "keywords", "for search"],
  "levels": ["High School", "Undergraduate"],
  "opportunityTypes": ["Research Assistant", "Shadowing", "Internship"],
  "applicationType": "Direct Outreach",
  "applicationWindow": "Rolling — reach out directly, no formal deadline",
  "summary": "A sentence or two describing what the lab does and who they're looking for.",
  "email": "professor@university.edu",
  "labUrl": "https://link-to-lab-page.edu",
  "applyUrl": "",
  "dateAdded": "2026-08-05"
}
```

**B) Structured Program** — a formal program with its own application and deadline
(no individual professor email — students apply through the program's site).

```json
{
  "id": 8,
  "name": "Name of the Program",
  "title": "Structured Summer Research Program",
  "university": "Name of University",
  "state": "State/Province, Country",
  "department": "Department(s) involved",
  "field": "Biology",
  "tags": ["a few", "keywords"],
  "levels": ["High School"],
  "opportunityTypes": ["Research Assistant"],
  "applicationType": "Structured Program",
  "applicationWindow": "When applications typically open/close, and whether this year's cycle is open or closed",
  "resumeRating": 4,
  "ratingNote": "One sentence on why it earned that score — prestige/selectivity weighed against real accessibility.",
  "summary": "What the program actually involves, and any eligibility restrictions (location, school, income status, etc.) students should know before getting excited about it.",
  "email": "",
  "labUrl": "",
  "applyUrl": "https://link-to-program-application-page.edu",
  "dateAdded": "2026-08-05"
}
```

A few rules to keep it working:
- Every entry needs a unique `id` (just the next number in order).
- `field` should be a single value (e.g. `"Biology"`) — this is what the "Field" filter
  buttons are built from.
- `levels` and `opportunityTypes` are **lists**, so an entry can belong to more than one
  (e.g. a lab welcoming both high schoolers and undergrads).
- `resumeRating` (1–5) and `ratingNote` are **optional** and only make sense for
  Structured Programs where you can actually judge selectivity. This is an editorial,
  subjective call weighing prestige against real accessibility (a locally-restricted
  Ivy League lab isn't automatically a 5 just because of the name) — always pair the
  number with a one-line reason so visitors can judge for themselves.
- Any optional value (`labUrl`, `applyUrl`, `email`, `resumeRating`) can be left out or
  set to `""` if it doesn't apply — just don't delete the field entirely.
- Keep commas between entries, and make sure the whole file is still wrapped in `[ ]`.

**Tip:** if you're not sure the file is still valid after editing, paste it into
[jsonlint.com](https://jsonlint.com) — it'll tell you exactly where a comma or bracket
is missing.

### Using AI to help you find new listings
Each week, you can ask an AI assistant (like me) to search for current professors
looking for student researchers, and ask it to hand the results back to you in the
exact JSON format above so you can paste them straight into `data.json`. Always
double-check a listing (does the professor's page still exist? is the email right?)
before publishing — treat the AI's list as a first draft.

## Publishing it for free with GitHub Pages

1. Create a new repository on GitHub (e.g. `research-connect`).
2. Upload all five files in this folder to that repository (drag-and-drop works on
   github.com, or use `git` if you're comfortable with it).
3. In the repository, go to **Settings → Pages**.
4. Under "Build and deployment," set **Source** to "Deploy from a branch," pick the
   `main` branch and the `/ (root)` folder, then save.
5. GitHub will give you a live URL, usually
   `https://your-username.github.io/research-connect/` — it can take a minute or two
   to go live the first time.
6. From then on, any time you edit `data.json` (or any file) directly on GitHub and
   commit the change, the live site updates automatically within a minute or so.

## Setting up outcome tracking (optional)

The site can quietly ask visitors "how'd it go?" about opportunities they clicked into,
and log anonymous answers to a Google Form — giving you real stats (how many applied,
heard back, got interviews, got offers) without running any server of your own.

**It's off by default.** Until you complete these steps, nothing is tracked.

1. Go to [forms.google.com](https://forms.google.com) and create a new form. Name it
   whatever you like (e.g. "Research Connect Outcomes").
2. Add three questions, all set to **Short answer** or **Multiple choice** — the exact
   type doesn't matter much since the site fills them in automatically:
   - "Listing name" (Short answer)
   - "Field" (Short answer)
   - "Status" (Short answer, or Multiple choice with the same 5 options used on the site)
3. Click the eye icon (Preview) to open the live form, then open your browser's
   developer tools (F12 or right-click → Inspect), go to the **Network** tab, fill in
   the three fields with anything, and click Submit.
4. In the Network tab, find the request named `formResponse`, click it, and look at
   its **Payload** (or "Form Data"). You'll see three field names that look like
   `entry.1234567890` — note which one corresponds to which question.
5. Also copy the request's URL — it'll look like
   `https://docs.google.com/forms/d/e/1FAIpQLS.../formResponse`.
6. Open `script.js`, and near the top, replace these four placeholder lines with your
   real values from steps 4–5:
   ```js
   const FEEDBACK_FORM_URL = "https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse";
   const FEEDBACK_FIELD_LISTING = "entry.YOUR_LISTING_FIELD_ID";
   const FEEDBACK_FIELD_FIELD   = "entry.YOUR_FIELD_FIELD_ID";
   const FEEDBACK_FIELD_STATUS  = "entry.YOUR_STATUS_FIELD_ID";
   ```
7. Commit the updated `script.js` to GitHub like usual.
8. To see results, open your Form on forms.google.com and click the **Responses** tab
   — Google automatically builds charts and counts for you.

By default, the site waits 14 days after someone clicks into a listing before asking
about it (`FOLLOWUP_DELAY_DAYS` near the top of `script.js`) — change that number if
you want to test it sooner (try `0` temporarily, then set it back).

## Feedback & stats (optional)

The site can quietly ask visitors how their outreach went, using a small on-brand
prompt — not a raw Google Form. Tapping an answer opens your real Google Form in a
new tab, already pre-filled with the opportunity name and their answer, so finishing
it takes about 30 seconds. This is already wired up to your form in `feedback.js` —
you shouldn't need to touch it unless you change your form's questions.

### How it works
1. When someone clicks "Draft email" or "View program & apply," the site quietly
   notes it in *their own browser* (nothing is sent anywhere yet).
2. If they're still on the same browser and device roughly two weeks later, a small
   toast appears asking "How'd it go?" with your form's real answer options as
   one-tap buttons, plus a "Something else" option for anything not listed.
3. Tapping an option opens your actual Google Form in a new tab with the opportunity
   name and that answer already filled in — they just confirm or finish the rest
   (helpfulness rating, offer details, etc.) themselves.
4. If they close the prompt without answering, it waits a few days before asking again.

### Checking your stats
Open your Form and click the **Responses** tab. The **Summary** view auto-generates a
percentage breakdown and chart for each question. Click the green Sheets icon there to
see every individual response as a spreadsheet row (with timestamps) if you want to
filter, count, or export numbers for a college application.

### If you ever edit your form's questions
`feedback.js` has to know two things about your form to pre-fill it correctly:
- The exact wording of each option in **"What has happened so far?"** (the `OUTCOME_OPTIONS`
  list near the top of the file) — these must match your form's option text exactly, or
  Google won't be able to pre-select the right one.
- The `entry.XXXXXXXXX` ID for that question and for "Which opportunity did you pursue?"
  (the `ENTRY_OUTCOME` and `ENTRY_PROGRAM_NAME` values in `FEEDBACK_CONFIG`).

To get a fresh set of these IDs after editing your form, use the same "Get pre-filled
link" trick from before (three-dot menu on your form → Get pre-filled link → fill in
every question → Get link), then update the relevant lines in `feedback.js`.

### How it works, and its limits
No name, email, or IP address is collected by this site — the toast only ever knows
what you can see in `data.json` (the program name) plus whatever the student chooses
to tap. The honest limitation: since there's no login system, "remembering" a visitor
only works on the same browser and device. A student who applies on their phone but
browses on a laptop later, or clears their browsing data, won't get prompted. Treat the
numbers as a useful sample, not a complete count.

You can just double-click `index.html` to open it in a browser, but some browsers
block a local page from loading `data.json` directly. If the listings don't appear,
run this from inside the folder (requires Python, which most computers already have):

```
python3 -m http.server 8000
```

Then visit `http://localhost:8000` in your browser.
