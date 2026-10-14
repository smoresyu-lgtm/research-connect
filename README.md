# Research Connect

**Making research opportunities easier to discover.**

[Explore Research Connect →](https://smoresyu-lgtm.github.io/research-connect/) | [View the source code →](https://github.com/smoresyu-lgtm/research-connect)

Research Connect is a free, open-source website that helps high school and undergraduate students discover research opportunities across academic disciplines. It brings faculty laboratories, direct-outreach opportunities, and structured research programs into one searchable resource so students can spend less time finding opportunities and more time pursuing them.

Built and maintained by Morgan Yu, Research Connect aims to make the research search process more transparent and accessible, especially for students who do not already have academic connections.

**Please note:** Listings are informational resources, not guarantees of an open position or admission. Always confirm eligibility, deadlines, and availability with the relevant laboratory or program before applying.

## Key Features

- **Searchable research listings:** Explore research opportunities using fields of study and relevant keywords.
- **Filtering tools:** Narrow listings using research categories and eligibility information.
- **Direct faculty outreach:** Discover researchers and laboratories to contact about potential research positions.
- **Structured research programs:** Find formal programs with eligibility requirements and application procedures.
- **Application information:** Access laboratory websites, program links, descriptions, and application windows.
- **Student feedback:** Optional follow-up functionality allows visitors to report outcomes from opportunities they explored.

## How Opportunities Are Organized

Research Connect supports two primary opportunity types.

**1. Direct Outreach**

Faculty laboratories and researchers whom students may contact directly about potential research opportunities.

These listings provide research descriptions, academic affiliations, relevant links, and contact information when available.

A Direct Outreach listing does not necessarily indicate a confirmed vacancy.

**2. Structured Programs**

Organized research programs with formal applications, eligibility requirements, and application periods.

These listings provide program descriptions, eligibility information, and official application links when available.

## Technology Stack

Research Connect uses a lightweight, static web architecture.

- **HTML:** Website structure
- **CSS:** Styling and responsive layout
- **JavaScript:** Search, filtering, and interactive functionality
- **JSON:** Research opportunity database
- **GitHub Pages:** Website hosting

The platform can be browsed without creating an account.

## Project Structure

The repository contains the following core files:

| File | Purpose |
|---|---|
| `index.html` | Main website structure |
| `styles.css` | Visual design and layout |
| `script.js` | Website behavior and search functionality |
| `data.json` | Research opportunity records |
| `data2.json` | Additional project data |
| `feedback.js` | Feedback and follow-up functionality |
| `normalize-application-types.js` | Data maintenance utility |
| `tag-professors.js` | Data maintenance utility |
| `README.md` | Project documentation |
| `LICENSE` | MIT open-source license |

The repository also contains a `.github` directory for GitHub configuration.

## Getting Started

To run Research Connect locally:

**1. Clone the repository**

```bash
git clone https://github.com/smoresyu-lgtm/research-connect.git
cd research-connect
```

**2. Start a local server**

```bash
python3 -m http.server 8000
```

**3. Open the website**

Visit `http://localhost:8000` in your browser.

Running a local server is recommended because some browsers restrict JavaScript from loading JSON files directly from the local filesystem.

## Research Opportunity Database

Research Connect stores opportunity information in JSON records.

### Example: Direct Outreach

```json
{
  "id": 7,
  "name": "Dr. First Last",
  "title": "Assistant Professor",
  "university": "Name of University",
  "state": "State/Province, Country",
  "department": "Department name",
  "field": "Biology",
  "tags": ["ecology", "behavior"],
  "levels": ["High School", "Undergraduate"],
  "opportunityTypes": ["Research Assistant", "Shadowing"],
  "applicationType": "Direct Outreach",
  "applicationWindow": "Contact the laboratory for availability",
  "summary": "Brief description of the research.",
  "email": "professor@university.edu",
  "labUrl": "https://example.edu/lab",
  "applyUrl": "",
  "dateAdded": "2026-08-05"
}
```

### Example: Structured Program

```json
{
  "id": 8,
  "name": "Example Research Program",
  "title": "Structured Summer Research Program",
  "university": "Name of University",
  "state": "State/Province, Country",
  "department": "Department name",
  "field": "Biology",
  "tags": ["summer research", "laboratory"],
  "levels": ["High School"],
  "opportunityTypes": ["Research Assistant"],
  "applicationType": "Structured Program",
  "applicationWindow": "Check the official website",
  "resumeRating": 4,
  "ratingNote": "Editorial assessment of selectivity and accessibility.",
  "summary": "Program description and eligibility requirements.",
  "email": "",
  "labUrl": "",
  "applyUrl": "https://example.edu/apply",
  "dateAdded": "2026-08-05"
}
```

### Database Maintenance Guidelines

When adding or updating research opportunities:

1. Assign every listing a unique `id` and check existing records for duplicates.
2. Use existing field categories to maintain compatibility with the website's filters.
3. Keep `levels` and `opportunityTypes` formatted as arrays.
4. Verify academic affiliations, eligibility requirements, links, and application deadlines.
5. Treat `resumeRating` and `ratingNote` as optional editorial assessments, not official rankings.
6. Maintain valid JSON syntax.
7. Check for duplicate professors, laboratories, programs, and URLs before publishing new records.

## Feedback and Outcome Tracking

Research Connect includes an optional feedback system designed to help understand how students engage with research opportunities.

The website can remember certain interactions within a visitor's browser and later invite them to report an outcome through a Google Form.

Feedback participation is optional.

Because the platform does not require user accounts, follow-up functionality depends on browser-based information and may not work across devices or after browsing data is cleared.

Reported outcomes should therefore be treated as a partial sample rather than a complete record of applications or placements.

For implementation details, consult `feedback.js`.

## Contributing

Research Connect welcomes suggestions, corrections, and contributions that improve the accessibility and reliability of research opportunity information.

Contributions may include:

- Updating outdated research opportunities
- Reporting broken links or incorrect eligibility information
- Improving website accessibility and user experience
- Fixing bugs or improving search functionality
- Enhancing documentation
- Suggesting new research opportunities supported by official sources

### How to Contribute

1. Open a GitHub Issue describing your suggestion or the problem you've identified.
2. For code contributions, fork the repository and create a new branch.
3. Implement and test your changes.
4. Submit a Pull Request explaining your proposed improvements.

For database contributions, provide official laboratory or program sources whenever possible.

Please avoid submitting private student information, confidential correspondence, or unverified claims about research availability.

## License

Research Connect's original source code is released under the **MIT License**.

See the [LICENSE](LICENSE) file for details.

Third-party materials and external resources may have separate licensing requirements.

---

**Created and maintained by Morgan Yu**

[Research Connect Website](https://smoresyu-lgtm.github.io/research-connect/) | [GitHub Repository](https://github.com/smoresyu-lgtm/research-connect)
