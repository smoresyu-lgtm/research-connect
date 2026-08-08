// ---------------------------------------------------------------
// Research Connect — filtering & rendering logic
// You shouldn't need to edit this file to add new listings.
// To add listings, edit data.json instead.
// ---------------------------------------------------------------

// ---- Follow-up feedback tracking (see README for setup) ----
// After you set up the Google Sheet + Apps Script (README has the steps),
// paste the Web App URL you get below. Until it's filled in, this
// feature stays silently off — the rest of the site works fine either way.
const FEEDBACK_ENDPOINT_URL = "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";

const FEEDBACK_STORAGE_KEY = "rc_feedback_tracker_v1";
const FOLLOWUP_DELAY_DAYS = 14; // how many days to wait before asking. Set to 0 temporarily to test.
const FEEDBACK_STATUSES = [
  "Didn't apply",
  "Applied / contacted them",
  "Got a response",
  "Interviewed",
  "Got an offer 🎉"
];

let allEntries = [];
let activeFilters = { field: null, level: null, type: null, appType: null };
let searchTerm = "";
let currentModalEntry = null;

const listingsEl = document.getElementById("listings");
const emptyStateEl = document.getElementById("empty-state");
const resultCountEl = document.getElementById("result-count");
const searchInput = document.getElementById("search-input");
const clearBtn = document.getElementById("clear-filters");

const fieldFilterEl = document.getElementById("field-filters");
const levelFilterEl = document.getElementById("level-filters");
const typeFilterEl = document.getElementById("type-filters");
const appTypeFilterEl = document.getElementById("apptype-filters");

init();

async function init() {
  try {
    const res = await fetch("data.json");
    allEntries = await res.json();
  } catch (err) {
    listingsEl.innerHTML = `<p>Couldn't load listings. Make sure data.json is in the same folder as index.html.</p>`;
    console.error(err);
    return;
  }

  buildFilterTabs("field", fieldFilterEl, uniqueValues(allEntries, e => [e.field]));
  buildFilterTabs("level", levelFilterEl, uniqueValues(allEntries, e => e.levels));
  buildFilterTabs("type", typeFilterEl, uniqueValues(allEntries, e => e.opportunityTypes));
  buildFilterTabs("appType", appTypeFilterEl, uniqueValues(allEntries, e => [e.applicationType || "Direct Outreach"]));

  searchInput.addEventListener("input", (e) => {
    searchTerm = e.target.value.trim().toLowerCase();
    render();
  });

  clearBtn.addEventListener("click", () => {
    activeFilters = { field: null, level: null, type: null, appType: null };
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

  render();

  setTimeout(checkForFollowup, 1200);
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

function render() {
  const filtered = allEntries.filter(entry => {
    const appType = entry.applicationType || "Direct Outreach";
    if (activeFilters.field && entry.field !== activeFilters.field) return false;
    if (activeFilters.level && !entry.levels.includes(activeFilters.level)) return false;
    if (activeFilters.type && !entry.opportunityTypes.includes(activeFilters.type)) return false;
    if (activeFilters.appType && appType !== activeFilters.appType) return false;

    if (searchTerm) {
      const haystack = [
        entry.name, entry.university, entry.department, entry.field,
        entry.summary, ...(entry.tags || [])
      ].join(" ").toLowerCase();
      if (!haystack.includes(searchTerm)) return false;
    }
    return true;
  });

  const anyFilterActive = activeFilters.field || activeFilters.level || activeFilters.type || activeFilters.appType || searchTerm;
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
    emailBtn.onclick = () => trackInteraction(entry);
  } else if (entry.applyUrl) {
    emailBtn.hidden = true;
    applyBtn.hidden = false;
    applyBtn.textContent = "View program & apply";
    applyBtn.href = entry.applyUrl;
    applyBtn.onclick = () => trackInteraction(entry);
  } else {
    emailBtn.hidden = true;
    applyBtn.hidden = true;
  }

  if (entry.labUrl) {
    labBtn.href = entry.labUrl;
    labBtn.hidden = false;
    labBtn.onclick = () => trackInteraction(entry);
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

// ---------------------------------------------------------------
// Follow-up feedback tracking
// ---------------------------------------------------------------

function feedbackConfigured() {
  return !FEEDBACK_ENDPOINT_URL.includes("PASTE_YOUR");
}

function loadFeedbackStore() {
  try {
    return JSON.parse(localStorage.getItem(FEEDBACK_STORAGE_KEY) || "{}");
  } catch (e) {
    return {};
  }
}

function saveFeedbackStore(store) {
  try {
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(store));
  } catch (e) {
    // localStorage unavailable (e.g. private browsing) — fail silently
  }
}

function trackInteraction(entry) {
  if (!feedbackConfigured()) return;

  const store = loadFeedbackStore();
  store[entry.id] = {
    name: entry.name,
    field: entry.field,
    timestamp: Date.now(),
    prompted: false
  };
  saveFeedbackStore(store);

  // Log the click itself (anonymous) so you can see total clicks per
  // listing, not just the outcomes of people who come back to answer.
  sendToSheet({ event: "click", listingName: entry.name, field: entry.field, outcome: "" });
}

function checkForFollowup() {
  if (!feedbackConfigured()) return;
  if (sessionStorage.getItem("rc_feedback_dismissed_session")) return;

  const store = loadFeedbackStore();
  const now = Date.now();
  const dueMs = FOLLOWUP_DELAY_DAYS * 24 * 60 * 60 * 1000;

  const due = Object.entries(store)
    .filter(([id, rec]) => !rec.prompted && (now - rec.timestamp) >= dueMs)
    .sort((a, b) => a[1].timestamp - b[1].timestamp);

  if (due.length === 0) return;
  showFollowupToast(due[0][0], due[0][1], store);
}

function showFollowupToast(id, rec, store) {
  const existing = document.getElementById("feedback-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = "feedback-toast";
  toast.id = "feedback-toast";
  toast.setAttribute("role", "dialog");
  toast.setAttribute("aria-label", "Quick follow-up question");

  toast.innerHTML = `
    <button class="feedback-close" aria-label="Close">&times;</button>
    <p class="feedback-eyebrow">Quick check-in &mdash; for research purposes</p>
    <p class="feedback-question">How'd it go with <strong>${escapeHtml(rec.name)}</strong>?</p>
    <div class="feedback-options"></div>
    <p class="feedback-note">Anonymous, one tap. It genuinely helps show how many students Research Connect has actually helped &mdash; answering means a lot!</p>
  `;

  const optionsEl = toast.querySelector(".feedback-options");
  FEEDBACK_STATUSES.forEach(status => {
    const btn = document.createElement("button");
    btn.className = "feedback-option-btn";
    btn.type = "button";
    btn.textContent = status;
    btn.addEventListener("click", () => {
      sendToSheet({ event: "response", listingName: rec.name, field: rec.field, outcome: status });
      store[id].prompted = true;
      saveFeedbackStore(store);
      toast.innerHTML = `<p class="feedback-thanks">Thanks — that really helps. 🙏</p>`;
      setTimeout(() => toast.remove(), 2000);
    });
    optionsEl.appendChild(btn);
  });

  toast.querySelector(".feedback-close").addEventListener("click", () => {
    sessionStorage.setItem("rc_feedback_dismissed_session", "1");
    toast.remove();
  });

  document.body.appendChild(toast);
}

function sendToSheet(payload) {
  if (!feedbackConfigured()) return;
  fetch(FEEDBACK_ENDPOINT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
    keepalive: true
  }).catch(() => {
    // A network hiccup here shouldn't interrupt the visitor's experience.
  });
}
