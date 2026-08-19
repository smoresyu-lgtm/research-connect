const fs = require("fs");

const FILES = ["data.json", "data2.json"];

const APPROVED_TYPES = [
  "Direct PI/Lab Inquiry",
  "Cold Email",
  "Direct Application",
  "Online Application",
  "Program Application",
  "Research Matching",
  "Faculty Matching",
  "School Nomination",
  "Teacher Nomination",
  "Partner Organization",
  "Invitation/Referral",
  "Open Inquiry"
];

function normalizeApplicationType(originalType) {
  if (!originalType || typeof originalType !== "string") {
    return null;
  }

  const type = originalType.trim();
  const lower = type.toLowerCase();

  // Already standardized
  const exactApproved = APPROVED_TYPES.find(
    approved => approved.toLowerCase() === lower
  );

  if (exactApproved) {
    return exactApproved;
  }

  // --------------------------------------------------
  // 1. COLD EMAIL
  // Highest priority because it is a distinct user action.
  // --------------------------------------------------
  if (
    lower.includes("cold email") ||
    lower.includes("cold-email")
  ) {
    return "Cold Email";
  }

  // --------------------------------------------------
  // 2. SCHOOL NOMINATION
  // --------------------------------------------------
  if (
    lower.includes("school nomination") ||
    lower.includes("school-nominated") ||
    lower.includes("school nominated") ||
    lower.includes("nominated by school") ||
    lower.includes("school must nominate")
  ) {
    return "School Nomination";
  }

  // --------------------------------------------------
  // 3. TEACHER NOMINATION
  // --------------------------------------------------
  if (
    lower.includes("teacher nomination") ||
    lower.includes("teacher-nominated") ||
    lower.includes("teacher nominated") ||
    lower.includes("nominated by teacher") ||
    lower.includes("teacher must nominate")
  ) {
    return "Teacher Nomination";
  }

  // --------------------------------------------------
  // 4. INVITATION / REFERRAL
  // --------------------------------------------------
  if (
    lower.includes("invitation") ||
    lower.includes("invite only") ||
    lower.includes("invite-only") ||
    lower.includes("referral") ||
    lower.includes("referred by")
  ) {
    return "Invitation/Referral";
  }

  // --------------------------------------------------
  // 5. PARTNER ORGANIZATION
  // --------------------------------------------------
  if (
    lower.includes("partner organization") ||
    lower.includes("partner programme") ||
    lower.includes("partner program") ||
    lower.includes("partner school") ||
    lower.includes("community partner")
  ) {
    return "Partner Organization";
  }

  // --------------------------------------------------
  // 6. RESEARCH MATCHING
  // Applicant applies, then gets matched with a project,
  // mentor, lab, research group, etc.
  // --------------------------------------------------
  if (
    lower.includes("research matching") ||
    lower.includes("research match") ||
    lower.includes("matched to research") ||
    lower.includes("matched with research") ||
    lower.includes("matched to a research") ||
    lower.includes("matched with a research") ||
    lower.includes("mentor matching") ||
    lower.includes("lab matching") ||
    lower.includes("project matching")
  ) {
    return "Research Matching";
  }

  // --------------------------------------------------
  // 7. FACULTY MATCHING
  // --------------------------------------------------
  if (
    lower.includes("faculty matching") ||
    lower.includes("faculty match") ||
    lower.includes("matched with faculty") ||
    lower.includes("matched to faculty") ||
    lower.includes("faculty placement") ||
    lower.includes("professor matching")
  ) {
    return "Faculty Matching";
  }

  // --------------------------------------------------
  // 8. PROGRAM APPLICATION
  // Program-linked alone is NOT enough to force this.
  // We only use this when the wording actually indicates
  // that applying to a program is the route.
  // --------------------------------------------------
  if (
    lower.includes("program application") ||
    lower.includes("programme application") ||
    lower.includes("apply through program") ||
    lower.includes("apply through the program") ||
    lower.includes("apply via program") ||
    lower.includes("apply via the program") ||
    lower.includes("structured program") ||
    lower.includes("structured internship") ||
    lower.includes("formal program application") ||
    lower.includes("summer program application")
  ) {
    return "Program Application";
  }

  // --------------------------------------------------
  // 9. ONLINE APPLICATION
  // --------------------------------------------------
  if (
    lower.includes("online application") ||
    lower.includes("online form") ||
    lower.includes("application portal") ||
    lower.includes("web application") ||
    lower.includes("online portal")
  ) {
    return "Online Application";
  }

  // --------------------------------------------------
  // 10. DIRECT APPLICATION
  // --------------------------------------------------
  if (
    lower.includes("direct application") ||
    lower.includes("apply directly") ||
    lower.includes("application form") ||
    lower.includes("submit application")
  ) {
    return "Direct Application";
  }

  // --------------------------------------------------
  // 11. OPEN INQUIRY
  // --------------------------------------------------
  if (
    lower.includes("open inquiry") ||
    lower.includes("general inquiry") ||
    lower.includes("open enquiry") ||
    lower.includes("general enquiry")
  ) {
    return "Open Inquiry";
  }

  // --------------------------------------------------
  // 12. DIRECT PI / LAB INQUIRY
  //
  // All qualifiers like:
  // - availability dependent
  // - historical precedent
  // - program linked
  // - local preference
  // - summer research
  // - volunteer research
  //
  // do NOT create separate How to Apply categories.
  // --------------------------------------------------
  if (
    lower.includes("direct pi") ||
    lower.includes("pi inquiry") ||
    lower.includes("pi/lab inquiry") ||
    lower.includes("direct lab") ||
    lower.includes("lab inquiry") ||
    lower.includes("direct faculty") ||
    lower.includes("faculty inquiry") ||
    lower.includes("faculty/lab inquiry") ||
    lower.includes("researcher inquiry") ||
    lower.includes("direct researcher") ||
    lower.includes("staff inquiry") ||
    lower.includes("institute inquiry") ||
    lower.includes("center inquiry") ||
    lower.includes("centre inquiry") ||
    lower.includes("contact professor") ||
    lower.includes("contact the professor") ||
    lower.includes("contact pi") ||
    lower.includes("contact the pi") ||
    lower.includes("contact lab") ||
    lower.includes("contact the lab") ||
    lower.includes("contact faculty")
  ) {
    return "Direct PI/Lab Inquiry";
  }

  // Don't guess if nothing matched.
  return null;
}

let totalEntries = 0;
let changedEntries = 0;
let alreadyStandardized = 0;
let missingApplicationType = 0;

const unmapped = new Map();
const changes = new Map();

for (const file of FILES) {
  if (!fs.existsSync(file)) {
    console.error(`ERROR: Could not find ${file}`);
    process.exitCode = 1;
    continue;
  }

  let data;

  try {
    data = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    console.error(`ERROR: Could not parse ${file}`);
    console.error(error.message);
    process.exitCode = 1;
    continue;
  }

  if (!Array.isArray(data)) {
    console.error(`ERROR: ${file} is not a JSON array.`);
    process.exitCode = 1;
    continue;
  }

  for (const entry of data) {
    totalEntries++;

    const oldType = entry.applicationType;

    if (!oldType || typeof oldType !== "string") {
      missingApplicationType++;
      continue;
    }

    const newType = normalizeApplicationType(oldType);

    if (!newType) {
      unmapped.set(oldType, (unmapped.get(oldType) || 0) + 1);
      continue;
    }

    if (oldType === newType) {
      alreadyStandardized++;
      continue;
    }

    entry.applicationType = newType;
    changedEntries++;

    const changeKey = `${oldType}  --->  ${newType}`;
    changes.set(changeKey, (changes.get(changeKey) || 0) + 1);
  }

  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
  console.log(`Finished processing ${file}`);
}

console.log("\n========================================");
console.log("APPLICATION TYPE CLEANUP SUMMARY");
console.log("========================================");
console.log(`Total entries checked: ${totalEntries}`);
console.log(`Entries changed: ${changedEntries}`);
console.log(`Already standardized: ${alreadyStandardized}`);
console.log(`Missing applicationType: ${missingApplicationType}`);

console.log("\n========================================");
console.log("CHANGES MADE");
console.log("========================================");

if (changes.size === 0) {
  console.log("No changes were necessary.");
} else {
  [...changes.entries()]
    .sort((a, b) => b[1] - a[1])
    .forEach(([change, count]) => {
      console.log(`${count}x  ${change}`);
    });
}

console.log("\n========================================");
console.log("UNMAPPED APPLICATION TYPES");
console.log("========================================");

if (unmapped.size === 0) {
  console.log("None! Every applicationType was recognized.");
} else {
  [...unmapped.entries()]
    .sort((a, b) => b[1] - a[1])
    .forEach(([type, count]) => {
      console.log(`${count}x  ${type}`);
    });

  console.log(
    "\nIMPORTANT: Unmapped values were left completely unchanged."
  );
}

console.log("\n========================================");
console.log("APPROVED HOW TO APPLY OPTIONS");
console.log("========================================");

APPROVED_TYPES.forEach(type => console.log(`- ${type}`));

console.log("\nDone.");
