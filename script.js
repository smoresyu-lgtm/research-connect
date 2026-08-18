// ---------------------------------------------------------------
// Research Connect — filtering & rendering logic
// You shouldn't need to edit this file to add new listings.
// To add listings, edit data.json instead.
// Follow-up feedback (the "how'd it go?" popup) lives in feedback.js,
// not here — that's the one place to edit if you ever change your
// Google Form's questions or timing.
// ---------------------------------------------------------------

let allEntries = [];
let activeFilters = {
  field: null,
  level: null,
  type: null,
  appType: null,
  rating: null
};
let searchTerm = "";
let currentModalEntry = null;
let activeListingType = "all";

const listingsEl = document.getElementById("listings");
const emptyStateEl = document.getElementById("empty-state");
const resultCountEl = document.getElementById("result-count");
const searchInput = document.getElementById("search-input");
const clearBtn = document.getElementById("clear-filters");
const listingTypeBtns = document.querySelectorAll(".listing-type-btn");

const fieldFilterEl = document.getElementById("field-filters");
const levelFilterEl = document.getElementById("level-filters");
const typeFilterEl = document.getElementById("type-filters");
const appTypeFilterEl = document.getElementById("apptype-filters");
const ratingFilterEl = document.getElementById("rating-filters");

init();

async function init() {
  try {
    const [res1, res2] = await Promise.all([
      fetch("data.json"),
      fetch("data2.json")
    ]);

    const [data1, data2] = await Promise.all([
      res1.json(),
      res2.json()
    ]);

    allEntries = [...data1, ...data2];
  } catch (err) {
    listingsEl.innerHTML = `<p>Couldn't load listings. Make sure data.json and data2.json are in the same folder as index.html.</p>`;
    console.error(err);
    return;
  }

  buildFilterTabs("field", fieldFilterEl, uniqueValues(allEntries, e => [e.field]));
  buildFilterTabs("level", levelFilterEl, uniqueValues(allEntries, e => e.levels));
  buildFilterTabs("type", typeFilterEl, uniqueValues(allEntries, e => e.opportunityTypes));
  buildFilterTabs("appType", appTypeFilterEl, uniqueValues(allEntries, e => [e.applicationType || "Direct Outreach"]));
  buildRatingTabs(ratingFilterEl);

  searchInput.addEventListener("input", (e) => {
    searchTerm = e.target.value.trim().toLowerCase();
    render();
  });

  clearBtn.addEventListener("click", () => {
    activeFilters = {
  field: null,
  level: null,
  type: null,
  appType: null,
  rating: null
};
    searchTerm = "";
    searchInput.value = "";
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    render();
  });

  document.getElementById("modal-close").addEventListener("click", closeModal);
  document.getElementById("email-modal").addEventListener("click", (e) => {
    if (e.target.id === "email-modal") closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  document.getElementById("modal-email-btn").addEventListener("click", () => {
    if (currentModalEntry && window.RCFeedback) window.RCFeedback.trackInteraction(currentModalEntry);
  });
  document.getElementById("modal-apply-btn").addEventListener("click", () => {
    if (currentModalEntry && window.RCFeedback) window.RCFeedback.trackInteraction(currentModalEntry);
  });

  listingTypeBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    activeListingType = btn.dataset.listingType;

    listingTypeBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    render();
  });
});
  
  render();
}

function uniqueValues(entries, getArr) {
  const set = new Set();
  entries.forEach(e => getArr(e).forEach(v => set.add(v)));
  return Array.from(set).sort();
}

function buildFilterTabs(key, container, values) {
  values.forEach(value => {
    const btn = document.createElement("button");
    btn.className = "tab-btn";
    btn.type = "button";
    btn.textContent = value;
    btn.addEventListener("click", () => {
      const isActive = activeFilters[key] === value;
      activeFilters[key] = isActive ? null : value;
      container.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      if (!isActive) btn.classList.add("active");
      render();
    });
    container.appendChild(btn);
  });
}
function buildRatingTabs(container) {
  const options = [
    { label: "5★", value: 5 },
    { label: "4★+", value: 4 },
    { label: "3★+", value: 3 }
  ];

  options.forEach(option => {
    const btn = document.createElement("button");
    btn.className = "tab-btn";
    btn.type = "button";
    btn.textContent = option.label;

    btn.addEventListener("click", () => {
      const isActive = activeFilters.rating === option.value;

      activeFilters.rating = isActive ? null : option.value;

      container.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));

      if (!isActive) btn.classList.add("active");

      render();
    });

    container.appendChild(btn);
  });
}

function render() {
  const filtered = allEntries.filter(entry => {
    const appType = entry.applicationType || "Direct Outreach";
    const listingType = entry.listingType || "General Opportunity";

if (
  activeListingType !== "all" &&
  listingType !== activeListingType
) {
  return false;
}
    if (activeFilters.field && entry.field !== activeFilters.field) return false;
    if (activeFilters.level && !entry.levels.includes(activeFilters.level)) return false;
    if (activeFilters.type && !entry.opportunityTypes.includes(activeFilters.type)) return false;
    if (activeFilters.appType && appType !== activeFilters.appType) return false;
    if (activeFilters.rating && (entry.resumeRating || 0) < activeFilters.rating) return false;

    if (searchTerm) {
  const haystack = JSON.stringify(entry).toLowerCase();

  if (!haystack.includes(searchTerm)) return false;
}
    return true;
  });

  const anyFilterActive =
  activeFilters.field ||
  activeFilters.level ||
  activeFilters.type ||
  activeFilters.appType ||
  activeFilters.rating ||
  searchTerm;
  clearBtn.hidden = !anyFilterActive;

  resultCountEl.textContent = `${filtered.length} ${filtered.length === 1 ? "entry" : "entries"}`;

  listingsEl.innerHTML = "";
  emptyStateEl.hidden = filtered.length !== 0;

  filtered.forEach(entry => {
    listingsEl.appendChild(buildCard(entry));
  });
}

function starRating(rating) {
  if (!rating) return "";
  const full = "★".repeat(rating);
  const empty = "☆".repeat(5 - rating);
  return `${full}${empty}`;
}

function buildCard(entry) {
  const card = document.createElement("article");
  card.className = "card";
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", `View details for ${entry.name}`);

  const appType = entry.applicationType || "Direct Outreach";
  const ratingHtml = entry.resumeRating
    ? `<span class="card-rating" title="Resume/application impact (subjective editorial rating)">${starRating(entry.resumeRating)}</span>`
    : "";

  card.innerHTML = `
    <div class="card-top-row">
      <span class="card-field-tag">${escapeHtml(entry.field.toUpperCase())} &middot; ${escapeHtml(entry.department)}</span>
      ${ratingHtml}
    </div>
    <h3>${escapeHtml(entry.name)}</h3>
    <p class="card-university">${escapeHtml(entry.university)} &mdash; ${escapeHtml(entry.state)}</p>
    <p class="card-summary">${escapeHtml(entry.summary)}</p>
    ${entry.applicationWindow ? `<p class="card-window">${escapeHtml(entry.applicationWindow)}</p>` : ""}
    <div class="card-badges">
      ${entry.levels.map(l => `<span class="badge level">${escapeHtml(l)}</span>`).join("")}
      ${entry.opportunityTypes.map(t => `<span class="badge">${escapeHtml(t)}</span>`).join("")}
      <span class="badge apptype">${escapeHtml(appType)}</span>
    </div>
  `;

  const openIt = () => openModal(entry);
  card.addEventListener("click", openIt);
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openIt(); }
  });

  return card;
}

function openModal(entry) {
  currentModalEntry = entry;
  const appType = entry.applicationType || "Direct Outreach";

  document.getElementById("modal-field").textContent = `${entry.field.toUpperCase()} · ${entry.department}`;
  document.getElementById("modal-title").textContent = `${entry.name}, ${entry.title}`;
  document.getElementById("modal-university").textContent = `${entry.university} — ${entry.state}`;
  document.getElementById("modal-summary").textContent = entry.summary;

  const ratingEl = document.getElementById("modal-rating");
  if (entry.resumeRating) {
    ratingEl.textContent = `${starRating(entry.resumeRating)}  ${entry.ratingNote || ""}`;
    ratingEl.hidden = false;
  } else {
    ratingEl.hidden = true;
  }

  const windowEl = document.getElementById("modal-window");
  if (entry.applicationWindow) {
    windowEl.textContent = `How to apply: ${entry.applicationWindow}`;
    windowEl.hidden = false;
  } else {
    windowEl.hidden = true;
  }

  const metaEl = document.getElementById("modal-meta");
  metaEl.innerHTML = [
    ...entry.levels.map(l => `<span class="badge level">${escapeHtml(l)}</span>`),
    ...entry.opportunityTypes.map(t => `<span class="badge">${escapeHtml(t)}</span>`),
    `<span class="badge apptype">${escapeHtml(appType)}</span>`
  ].join("");

  const emailBtn = document.getElementById("modal-email-btn");
  const applyBtn = document.getElementById("modal-apply-btn");
  const labBtn = document.getElementById("modal-lab-btn");

  if (entry.email) {
    applyBtn.hidden = true;
    emailBtn.hidden = false;
    const subject = encodeURIComponent(`Interested in research opportunities in your lab`);
    const body = encodeURIComponent(
      `Dear ${entry.name},\n\nMy name is [your name], and I'm a [high school / undergraduate] student interested in ${entry.field.toLowerCase()}. I came across your work in ${entry.department} at ${entry.university} and wanted to reach out about ${entry.opportunityTypes.join("/").toLowerCase()} opportunities in your lab.\n\n[A sentence or two about your background and why this lab specifically.]\n\nThank you for your time, and I look forward to hearing from you.\n\nBest,\n[Your name]`
    );
    emailBtn.href = `mailto:${entry.email}?subject=${subject}&body=${body}`;
  } else if (entry.applyUrl) {
    emailBtn.hidden = true;
    applyBtn.hidden = false;
    applyBtn.textContent = "View program & apply";
    applyBtn.href = entry.applyUrl;
  } else {
    emailBtn.hidden = true;
    applyBtn.hidden = true;
  }

  if (entry.labUrl) {
    labBtn.href = entry.labUrl;
    labBtn.hidden = false;
  } else {
    labBtn.hidden = true;
  }

  const modal = document.getElementById("email-modal");
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  document.getElementById("modal-close").focus();
}

function closeModal() {
  document.getElementById("email-modal").hidden = true;
  document.body.style.overflow = "";
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}
