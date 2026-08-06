// ---------------------------------------------------------------
// Research Connect — filtering & rendering logic
// You shouldn't need to edit this file to add new listings.
// To add listings, edit data.json instead.
// ---------------------------------------------------------------

let allEntries = [];
let activeFilters = { field: null, level: null, type: null };
let searchTerm = "";

const listingsEl = document.getElementById("listings");
const emptyStateEl = document.getElementById("empty-state");
const resultCountEl = document.getElementById("result-count");
const searchInput = document.getElementById("search-input");
const clearBtn = document.getElementById("clear-filters");

const fieldFilterEl = document.getElementById("field-filters");
const levelFilterEl = document.getElementById("level-filters");
const typeFilterEl = document.getElementById("type-filters");

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

  searchInput.addEventListener("input", (e) => {
    searchTerm = e.target.value.trim().toLowerCase();
    render();
  });

  clearBtn.addEventListener("click", () => {
    activeFilters = { field: null, level: null, type: null };
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

function render() {
  const filtered = allEntries.filter(entry => {
    if (activeFilters.field && entry.field !== activeFilters.field) return false;
    if (activeFilters.level && !entry.levels.includes(activeFilters.level)) return false;
    if (activeFilters.type && !entry.opportunityTypes.includes(activeFilters.type)) return false;

    if (searchTerm) {
      const haystack = [
        entry.name, entry.university, entry.department, entry.field,
        entry.summary, ...(entry.tags || [])
      ].join(" ").toLowerCase();
      if (!haystack.includes(searchTerm)) return false;
    }
    return true;
  });

  const anyFilterActive = activeFilters.field || activeFilters.level || activeFilters.type || searchTerm;
  clearBtn.hidden = !anyFilterActive;

  resultCountEl.textContent = `${filtered.length} ${filtered.length === 1 ? "entry" : "entries"}`;

  listingsEl.innerHTML = "";
  emptyStateEl.hidden = filtered.length !== 0;

  filtered.forEach(entry => {
    listingsEl.appendChild(buildCard(entry));
  });
}

function buildCard(entry) {
  const card = document.createElement("article");
  card.className = "card";
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", `View details for ${entry.name}`);

  card.innerHTML = `
    <span class="card-field-tag">${escapeHtml(entry.field.toUpperCase())} &middot; ${escapeHtml(entry.department)}</span>
    <h3>${escapeHtml(entry.name)}</h3>
    <p class="card-university">${escapeHtml(entry.university)} &mdash; ${escapeHtml(entry.state)}</p>
    <p class="card-summary">${escapeHtml(entry.summary)}</p>
    <div class="card-badges">
      ${entry.levels.map(l => `<span class="badge level">${escapeHtml(l)}</span>`).join("")}
      ${entry.opportunityTypes.map(t => `<span class="badge">${escapeHtml(t)}</span>`).join("")}
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
  document.getElementById("modal-field").textContent = `${entry.field.toUpperCase()} · ${entry.department}`;
  document.getElementById("modal-title").textContent = `${entry.name}, ${entry.title}`;
  document.getElementById("modal-university").textContent = `${entry.university} — ${entry.state}`;
  document.getElementById("modal-summary").textContent = entry.summary;

  const metaEl = document.getElementById("modal-meta");
  metaEl.innerHTML = [
    ...entry.levels.map(l => `<span class="badge level">${escapeHtml(l)}</span>`),
    ...entry.opportunityTypes.map(t => `<span class="badge">${escapeHtml(t)}</span>`)
  ].join("");

  const subject = encodeURIComponent(`Interested in research opportunities in your lab`);
  const body = encodeURIComponent(
    `Dear ${entry.name},\n\nMy name is [your name], and I'm a [high school / undergraduate] student interested in ${entry.field.toLowerCase()}. I came across your work in ${entry.department} at ${entry.university} and wanted to reach out about ${entry.opportunityTypes.join("/").toLowerCase()} opportunities in your lab.\n\n[A sentence or two about your background and why this lab specifically.]\n\nThank you for your time, and I look forward to hearing from you.\n\nBest,\n[Your name]`
  );

  const emailBtn = document.getElementById("modal-email-btn");
  emailBtn.href = `mailto:${entry.email}?subject=${subject}&body=${body}`;

  const labBtn = document.getElementById("modal-lab-btn");
  if (entry.labUrl) {
    labBtn.href = entry.labUrl;
    labBtn.hidden = false;
  } else {
    labBtn.hidden = true;
  }

  const modal = document.getElementById("email-modal");
  modal.hidden = false;
  document.getElementById("modal-close").focus();
}

function closeModal() {
  document.getElementById("email-modal").hidden = true;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}
