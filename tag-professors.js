const fs = require("fs");

const TARGET_FILES = ["data.json", "data2.json"];

const PROFESSOR_PROSPECTS = [
  {"id":17,"name":"Development & Education Lab (DEL Lab)","university":"University of Colorado Boulder"},
  {"id":27,"name":"Hanbin Mao — Mao Research Lab","university":"Kent State University"},
  {"id":28,"name":"Ran Blekhman — Blekhman Lab","university":"University of Chicago"},
  {"id":30,"name":"Andrés Vidal-Gadea — Vidal-Gadea Lab","university":"Illinois State University"},
  {"id":31,"name":"Robert Landick — Landick Lab","university":"University of Wisconsin–Madison"},
  {"id":32,"name":"Hillel Chiel — Chiel Lab","university":"Case Western Reserve University"},
  {"id":33,"name":"Ryoko Oono — Oono Lab","university":"University of California, Santa Barbara"},
  {"id":34,"name":"Tatiana Segura — Segura Lab","university":"Duke University"},
  {"id":35,"name":"Diehl Lab","university":"Kansas State University"},
  {"id":36,"name":"Andrew Leber — Cognitive Control Laboratory","university":"The Ohio State University"},
  {"id":37,"name":"Eugene Koay — Cancer Physics & Engineering Lab","university":"UT MD Anderson Cancer Center"},
  {"id":38,"name":"Subree Lab","university":"University of Minnesota"},
  {"id":39,"name":"Dolmetsch Lab","university":"Stanford University"},
  {"id":43,"name":"Robotics & Autonomous Systems Lab (RASL)","university":"Vanderbilt University"},
  {"id":44,"name":"Utah NeuroRobotics Lab","university":"University of Utah"},
  {"id":52,"name":"Markman Lab","university":"Stanford University"},
  {"id":62,"name":"Computational Biomedicine Lab","university":"University of Houston"},
  {"id":64,"name":"MIN Lab K-12 Research Project","university":"University of Wisconsin–Madison"},
  {"id":78,"name":"MELNHE Forest Ecology Research","university":"SUNY College of Environmental Science and Forestry"},
  {"id":87,"name":"Biomaterials & Regenerative Medicine Lab","university":"University of Kentucky"},
  {"id":90,"name":"Mohan Lab High School Research Internship","university":"University of Houston"},
  {"id":92,"name":"Burke Lab","university":"University of Missouri"},
  {"id":93,"name":"Lake Lab","university":"Yale University"},
  {"id":94,"name":"Liu Lab","university":"University of Georgia"},
  {"id":95,"name":"D'Orazio Laboratory","university":"University of Kentucky"},
  {"id":96,"name":"JSeeliger Lab","university":"Stony Brook University"},
  {"id":97,"name":"Hematian Research Group","university":"University of North Carolina at Greensboro"},
  {"id":99,"name":"Smith Research Group","university":"Iowa State University"},
  {"id":102,"name":"Needleman Lab","university":"Harvard University"},
  {"id":103,"name":"Shafiee Laboratory","university":"Harvard Medical School / Brigham and Women's Hospital"},
  {"id":104,"name":"Visual Attention Lab — Jeremy Wolfe","university":"Harvard Medical School / Brigham and Women's Hospital"},
  {"id":105,"name":"RWE Laboratory","university":"Massachusetts General Hospital / Harvard Medical School"},
  {"id":107,"name":"Chandra Lab","university":"Yale School of Medicine"},
  {"id":108,"name":"Saxena Lab","university":"Yale University"},
  {"id":109,"name":"Massilani Lab","university":"Yale University"},
  {"id":110,"name":"O'Hern Lab","university":"Yale University"},
  {"id":111,"name":"Natarajan Lab","university":"Yale University"},
  {"id":112,"name":"SCALE Lab","university":"Cornell University"},
  {"id":122,"name":"Bugaj Lab","university":"University of Pennsylvania"},
  {"id":137,"name":"Personality Across Development Lab (PADLab)","university":"Northwestern University"},
  {"id":142,"name":"Ocean, Climate & Ecosystems (OCE) Data Science Research Internship","university":"Brown University"},
  {"id":156,"name":"Torres-Vázquez Lab","university":"New York University"},
  {"id":157,"name":"Hartman Research Laboratory — K-12 Research","university":"New York University"},
  {"id":158,"name":"LINC Research Program — Jonesy Lab","university":"New York University"},
  {"id":166,"name":"Shen Lab","university":"Stanford University"},
  {"id":168,"name":"Hansen Experimental Physics Laboratory (HEPL)","university":"Stanford University"},
  {"id":179,"name":"Phase I Biomarker Laboratory Summer Program","university":"Duke University"},
  {"id":186,"name":"Stathopoulos Lab","university":"California Institute of Technology"},
  {"id":188,"name":"Solar Energy Activity Lab (SEAL)","university":"California Institute of Technology"},
  {"id":190,"name":"Tumber-Dávila Lab","university":"Dartmouth College"},
  {"id":192,"name":"Cottingham Lab","university":"Dartmouth College"},
  {"id":193,"name":"STEM RISE Research Experience — Thesen Laboratory","university":"Dartmouth College"},
  {"id":195,"name":"Sohn Research Lab","university":"University of California, Berkeley"},
  {"id":208,"name":"Andrade Lab High School Research","university":"University of Toronto Scarborough"},
  {"id":221,"name":"Zhou Lab","university":"Vanderbilt University"},
  {"id":227,"name":"Intelligent Control Lab","university":"Carnegie Mellon University"},
  {"id":228,"name":"Wood Neuro Research Group","university":"Carnegie Mellon University"},
  {"id":238,"name":"Research Experience for High School Students — Environmental Engineering","university":"University of Notre Dame"},
  {"id":242,"name":"Blodgett Lab","university":"Washington University in St. Louis"},
  {"id":250,"name":"Tong Lab","university":"Georgetown University"},
  {"id":251,"name":"Evidence for Justice Lab","university":"Georgetown University"},
  {"id":255,"name":"Linnstaedt Lab","university":"University of North Carolina at Chapel Hill"},
  {"id":256,"name":"Griffith Lab","university":"University of North Carolina at Chapel Hill"},
  {"id":258,"name":"Redinbo Lab","university":"University of North Carolina at Chapel Hill"},
  {"id":260,"name":"Jomaa Lab","university":"University of Virginia"},
  {"id":263,"name":"Link Lab — Charlottesville High School Mentorship Program","university":"University of Virginia"},
  {"id":267,"name":"Wang Lab","university":"University of Southern California"},
  {"id":270,"name":"Komor Lab","university":"University of California, San Diego"},
  {"id":283,"name":"Hofmann Lab / Crockett High School Research Internship Program","university":"University of Texas at Austin"},
  {"id":320,"name":"Facciotti Lab","university":"University of California, Davis"},
  {"id":326,"name":"Morita Lab — Research Intensives","university":"University of Massachusetts Amherst"},
  {"id":351,"name":"Djire Lab High School Summer Research Internship","university":"Texas A&M University"},
  {"id":352,"name":"Liu Research Group High School Internship","university":"University of Delaware"},
  {"id":375,"name":"Building a 2-Arm Automated Robot","university":"Missouri University of Science and Technology"},
  {"id":395,"name":"Inclusive Interaction Lab High School Internship","university":"University of California, Merced"},
  {"id":426,"name":"GRU Lab High School Research","university":"Tennessee Technological University"},
  {"id":429,"name":"Duscher Materials Science Research Group","university":"University of Tennessee, Knoxville"},
  {"id":431,"name":"Thamattoor Lab High School Summer Research Scholars","university":"Colby College"},
  {"id":438,"name":"SAVE Lab High School Research","university":"Arizona State University"},
  {"id":452,"name":"Mohan Lab High School Summer Internship","university":"University of Houston"},
  {"id":464,"name":"Gas Turbine Laboratory High School Research","university":"Ohio State University"},
  {"id":488,"name":"Lin Research Group","university":"University of Connecticut"},
  {"id":492,"name":"Mohan Lab Summer Internship (MLSI)","university":"University of Houston"},
  {"id":493,"name":"Computational Biomedicine Lab Summer Internship","university":"University of Houston"},
  {"id":507,"name":"Galbraith Lab Quantitative Biology and Biophysics Internship","university":"Oregon Health & Science University"},
  {"id":570,"name":"Subree Lab","university":"University of Minnesota"},
  {"id":571,"name":"Dolmetsch Lab","university":"Stanford University"},
  {"id":572,"name":"Wu Research Group","university":"Texas Tech University"},
  {"id":575,"name":"Blekhman Lab","university":"University of Chicago"},
  {"id":576,"name":"Lewis Lab","university":"Fordham University"},
  {"id":577,"name":"Oono Lab","university":"University of California, Santa Barbara"},
  {"id":578,"name":"Adalsteinsson Ecology Lab","university":"Washington University in St. Louis"},
  {"id":579,"name":"Tumber-Dávila Lab","university":"Dartmouth College"},
  {"id":580,"name":"Quantum Science & Engineering Laboratory","university":"Wichita State University"},
  {"id":581,"name":"Hansen Experimental Physics Laboratory (HEPL)","university":"Stanford University"},
  {"id":582,"name":"GRU Lab","university":"Tennessee Technological University"},
  {"id":583,"name":"Materials Physics for Energy Management Lab","university":"Rice University"},
  {"id":584,"name":"Chen Lab","university":"University of Hawaiʻi at Mānoa"},
  {"id":585,"name":"Robotics and Autonomous Systems Lab (RASL)","university":"Vanderbilt University"},
  {"id":590,"name":"Boyes Research Group","university":"George Washington University"},
  {"id":591,"name":"Accelerated Materials Development Lab","university":"University of Oklahoma"},
  {"id":596,"name":"Human Behavioral Pharmacology Laboratory Training Program","university":"University of Chicago"},
  {"id":605,"name":"Hosseinizadeh Research Group","university":"University of Wisconsin–Milwaukee"},
  {"id":606,"name":"ECSyD Lab","university":"Colorado State University"},
  {"id":607,"name":"FLUENT Lab","university":"University of Connecticut"},
  {"id":608,"name":"Quantum Materials Lab","university":"University of Arkansas"},
  {"id":609,"name":"Samia Research Group","university":"Case Western Reserve University"},

  {"id":596,"name":"Karras Laboratory","university":"UT MD Anderson Cancer Center"},
  {"id":597,"name":"Tanaka Lab","university":"Washington State University"},
  {"id":598,"name":"Jeffrey Kim Lab","university":"University of California, Irvine"},
  {"id":599,"name":"Egervari Lab","university":"Washington University in St. Louis"},
  {"id":600,"name":"Rao Lab","university":"Johns Hopkins University School of Medicine"},
  {"id":601,"name":"Andrew Leakey Laboratory","university":"University of Illinois Urbana-Champaign"},
  {"id":602,"name":"Ping He Laboratory — Molecular Plant-Microbe Interaction Group","university":"Texas A&M University"},
  {"id":603,"name":"Krishnan Lab","university":"UT Southwestern Medical Center"},

  {"id":601,"name":"Mohan Somasundaran Lab","university":"UMass Chan Medical School"},
  {"id":602,"name":"Gang Han Lab","university":"UMass Chan Medical School"},
  {"id":603,"name":"Sean Ryder Lab","university":"UMass Chan Medical School"},
  {"id":604,"name":"Steve Miller","university":"UMass Chan Medical School"},
  {"id":605,"name":"Nick Rhind Lab","university":"UMass Chan Medical School"},
  {"id":606,"name":"Virgil Percec Research Laboratory","university":"University of Pennsylvania"},
  {"id":607,"name":"Non-Traditional Isotope Laboratory","university":"University of Washington"},
  {"id":608,"name":"Rapp Lab","university":"University of Oregon"},
  {"id":609,"name":"Global Environmental Change Lab","university":"University of California, Davis"},
  {"id":610,"name":"Hansen Experimental Physics Laboratory Student Research","university":"Stanford University"},
  {"id":611,"name":"Price Laboratory","university":"University of Delaware"},
  {"id":612,"name":"Developing Intelligence Lab","university":"University of Texas at Austin"},
  {"id":613,"name":"Moseley Laboratory","university":"Monash University"},
  {"id":614,"name":"Neuromuscular Physiology Laboratory","university":"Vanderbilt University Medical Center"},
  {"id":615,"name":"Hadland Lab","university":"Fred Hutch Cancer Center / University of Washington"},
  {"id":616,"name":"Stacey M. Louie Lab","university":"University of Houston"},
  {"id":617,"name":"Dongming Xie Lab","university":"University of Massachusetts Lowell"},
  {"id":618,"name":"Goodman Lab","university":"Stanford University"},
  {"id":619,"name":"Supekar Lab","university":"Stanford University School of Medicine"},
  {"id":620,"name":"Jonghyun Park Additive Manufacturing Research","university":"Missouri University of Science and Technology"},
  {"id":621,"name":"Academic Orientations Project","university":"University of California, Santa Cruz"},
  {"id":622,"name":"Cox Lab","university":"University of Virginia"},
  {"id":623,"name":"Dávalos Lab","university":"Stony Brook University"},
  {"id":624,"name":"Bashey Lab","university":"Indiana University Bloomington"},
  {"id":625,"name":"Ashish Aphale — OREO Research Program","university":"Kennesaw State University"}
];

function signature(entry) {
  return JSON.stringify({
    id: entry.id,
    name: entry.name,
    university: entry.university
  });
}

function stop(message) {
  console.error("\nERROR:", message);
  console.error("No JSON files were changed.");
  process.exit(1);
}

function loadJson(file) {
  let raw;

  try {
    raw = fs.readFileSync(file, "utf8");
  } catch (error) {
    stop(`Could not read ${file}: ${error.message}`);
  }

  let data;

  try {
    data = JSON.parse(raw);
  } catch (error) {
    stop(`${file} is not valid JSON: ${error.message}`);
  }

  if (!Array.isArray(data)) {
    stop(`${file} must contain one top-level JSON array.`);
  }

  return { raw, data };
}

/*
  STEP 1:
  Make sure both database files actually exist.
*/
for (const file of TARGET_FILES) {
  if (!fs.existsSync(file)) {
    stop(`Missing ${file}.`);
  }
}

/*
  STEP 2:
  Build an exact list using ID + name + university.

  This is important because your database contains overlapping IDs.
  An ID BY ITSELF is NOT enough to tag an entry.
*/
const wanted = new Set(
  PROFESSOR_PROSPECTS.map(prospect => signature(prospect))
);

if (wanted.size !== PROFESSOR_PROSPECTS.length) {
  stop("The Professor Prospect list accidentally contains an exact duplicate.");
}

/*
  STEP 3:
  Load both files, but DO NOT modify anything yet.
*/
const loaded = TARGET_FILES.map(file => {
  const result = loadJson(file);

  return {
    file,
    raw: result.raw,
    data: result.data
  };
});

/*
  STEP 4:
  Pre-flight safety check.

  Every Professor Prospect listed above must correspond to EXACTLY ONE
  database entry across data.json and data2.json.

  If even ONE is missing or ambiguous, the script stops BEFORE editing.
*/
const matchCounts = new Map();

for (const key of wanted) {
  matchCounts.set(key, 0);
}

for (const item of loaded) {
  for (const entry of item.data) {
    const key = signature(entry);

    if (matchCounts.has(key)) {
      matchCounts.set(key, matchCounts.get(key) + 1);
    }
  }
}

const missing = [];
const ambiguous = [];

for (const prospect of PROFESSOR_PROSPECTS) {
  const key = signature(prospect);
  const count = matchCounts.get(key);

  if (count === 0) {
    missing.push(prospect);
  }

  if (count > 1) {
    ambiguous.push({
      ...prospect,
      matches: count
    });
  }
}

if (missing.length > 0 || ambiguous.length > 0) {
  console.error("\nPRE-FLIGHT CHECK FAILED.");

  if (missing.length > 0) {
    console.error("\nThese approved entries could not be found:");

    for (const entry of missing) {
      console.error(
        `- ID ${entry.id} | ${entry.name} | ${entry.university}`
      );
    }
  }

  if (ambiguous.length > 0) {
    console.error("\nThese approved entries matched more than once:");

    for (const entry of ambiguous) {
      console.error(
        `- ${entry.matches} matches | ID ${entry.id} | ${entry.name} | ${entry.university}`
      );
    }
  }

  stop(
    "The current database does not exactly match the database this tagging list was built from."
  );
}

/*
  STEP 5:
  Create backups before changing anything.
*/
for (const item of loaded) {
  const backupName = `${item.file}.before-professor-tags.bak`;

  fs.writeFileSync(
    backupName,
    item.raw,
    "utf8"
  );

  console.log(`Backup created: ${backupName}`);
}

/*
  STEP 6:
  Add listingType ONLY to the approved Professor Prospects.
*/
let totalTagged = 0;

for (const item of loaded) {
  let taggedInThisFile = 0;

  for (const entry of item.data) {
    if (wanted.has(signature(entry))) {
      entry.listingType = "Professor Prospect";
      taggedInThisFile++;
    }
  }

  const output =
    JSON.stringify(item.data, null, 2) + "\n";

  /*
    Validate the finished JSON before replacing the original file.
  */
  try {
    JSON.parse(output);
  } catch (error) {
    stop(
      `Internal validation failed for ${item.file}: ${error.message}`
    );
  }

  const temporaryFile = `${item.file}.tmp`;

  fs.writeFileSync(
    temporaryFile,
    output,
    "utf8"
  );

  fs.renameSync(
    temporaryFile,
    item.file
  );

  totalTagged += taggedInThisFile;

  console.log(
    `${item.file}: ${taggedInThisFile} Professor Prospects tagged`
  );
}

/*
  STEP 7:
  Final count check.
*/
if (totalTagged !== PROFESSOR_PROSPECTS.length) {
  stop(
    `Expected ${PROFESSOR_PROSPECTS.length} tags but produced ${totalTagged}.`
  );
}

console.log(
  `\nDone. Exactly ${totalTagged} Professor Prospects were tagged.`
);

console.log(
  "No IDs were changed or renumbered."
);

console.log(
  "Backup copies of both original JSON files were created."
);
