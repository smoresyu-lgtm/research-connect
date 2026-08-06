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
  "summary": "A sentence or two describing what the lab does and who they're looking for.",
  "email": "professor@university.edu",
  "labUrl": "https://link-to-lab-page.edu",
  "dateAdded": "2026-08-05"
}
```

A few rules to keep it working:
- Every entry needs a unique `id` (just the next number in order).
- `field` should be a single value (e.g. `"Biology"`) — this is what the "Field" filter
  buttons are built from.
- `levels` and `opportunityTypes` are **lists**, so an entry can belong to more than one
  (e.g. a lab welcoming both high schoolers and undergrads).
- `labUrl` and any other optional value can be left as an empty string `""` if you don't
  have it — just don't delete the field entirely.
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

## Trying it locally before you publish

You can just double-click `index.html` to open it in a browser, but some browsers
block a local page from loading `data.json` directly. If the listings don't appear,
run this from inside the folder (requires Python, which most computers already have):

```
python3 -m http.server 8000
```

Then visit `http://localhost:8000` in your browser.
