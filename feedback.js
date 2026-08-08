// ---------------------------------------------------------------
// Research Connect — outcome feedback
// Tracks (anonymously, in this browser only) when someone clicks
// "Draft email" or "View program & apply." If they're still on the
// same browser roughly two weeks later, a small on-brand prompt asks
// what happened — tapping an answer opens your real Google Form in a
// new tab, pre-filled with the program name and that answer, so it
// takes about 30 seconds to finish. See README.md "Feedback & stats."
// ---------------------------------------------------------------

const FEEDBACK_CONFIG = {
  // Already wired up to your form — no editing needed unless you
  // change the form's questions or their order.
  FORM_BASE_URL: "https://docs.google.com/forms/d/e/1FAIpQLScnun-SDtvOr16DPQV87cpSYC4vodeO6NxC_g8TGUctyx4RdA/viewform",
  ENTRY_PROGRAM_NAME: "entry.216554960",  // "Which Research Connect opportunity did you pursue?"
  ENTRY_OUTCOME: "entry.37755728",        // "What has happened so far?"

  DAYS_BEFORE_FOLLOWUP: 14,   // how long to wait before asking
  SNOOZE_DAYS: 3,             // if dismissed, wait this long before asking again
};

// Must match your form's "What has happened so far?" options exactly,
// or Google won't be able to pre-select the right one.
const OUTCOME_OPTIONS = [
  "Waiting for a response",
  "Received a response",
  "Invited to interview or meet",
  "Received an offer",
  "Joined or began working with the research team",
  "Was not selected",
  "Decided not to pursue it"
];

const STORAGE_KEY = "rc_interactions";

function loadInteractions() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveInteractions(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // localStorage unavailable (e.g. private browsing) — fail silently
  }
}

// Call this the moment someone clicks "Draft email" or "View program & apply."
function trackInteraction(entry) {
  if (!FEEDBACK_CONFIG.FORM_BASE_URL) return; // feature not configured yet
  const list = loadInteractions();
  const alreadyTracked = list.some(i => i.id === entry.id);
  if (alreadyTracked) return; // don't reset the clock on repeat clicks
  list.push({
    id: entry.id,
    name: entry.name,
    clickedAt: new Date().toISOString(),
    answered: false,
    snoozedUntil: null
  });
  saveInteractions(list);
}

function checkForFollowUp() {
  if (!FEEDBACK_CONFIG.FORM_BASE_URL) return;
  const list = loadInteractions();
  const now = Date.now();
  const msPerDay = 24 * 60 * 60 * 1000;

  const candidates = list.filter(i => {
    if (i.answered) return false;
    const age = now - new Date(i.clickedAt).getTime();
    if (age < FEEDBACK_CONFIG.DAYS_BEFORE_FOLLOWUP * msPerDay) return false;
    if (i.snoozedUntil && new Date(i.snoozedUntil).getTime() > now) return false;
    return true;
  }).sort((a, b) => new Date(a.clickedAt) - new Date(b.clickedAt));

  if (candidates.length > 0) {
    showToast(candidates[0]);
  }
}

function showToast(interaction) {
  const existing = document.getElementById("rc-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.id = "rc-toast";
  toast.className = "rc-toast";
  toast.setAttribute("role", "dialog");
  toast.setAttribute("aria-label", "Quick feedback");

  toast.innerHTML = `
    <button class="rc-toast-close" aria-label="Not now">&times;</button>
    <p class="rc-toast-title">How'd it go?</p>
    <p class="rc-toast-body">You recently looked into <strong>${escapeHtmlLocal(interaction.name)}</strong>.
    Tap an answer to open your (pre-filled) response — about 30 seconds.</p>
    <div class="rc-toast-options"></div>
  `;

  const optionsEl = toast.querySelector(".rc-toast-options");
  OUTCOME_OPTIONS.forEach(option => {
    const btn = document.createElement("button");
    btn.className = "rc-toast-option";
    btn.type = "button";
    btn.textContent = option;
    btn.addEventListener("click", () => respondAndOpenForm(interaction, option));
    optionsEl.appendChild(btn);
  });

  const otherBtn = document.createElement("button");
  otherBtn.className = "rc-toast-option rc-toast-option-other";
  otherBtn.type = "button";
  otherBtn.textContent = "Something else — open full form";
  otherBtn.addEventListener("click", () => respondAndOpenForm(interaction, null));
  optionsEl.appendChild(otherBtn);

  toast.querySelector(".rc-toast-close").addEventListener("click", () => {
    snoozeInteraction(interaction);
    toast.remove();
  });

  document.body.appendChild(toast);
}

function snoozeInteraction(interaction) {
  const list = loadInteractions();
  const idx = list.findIndex(i => i.id === interaction.id);
  if (idx !== -1) {
    const snoozeUntil = new Date(Date.now() + FEEDBACK_CONFIG.SNOOZE_DAYS * 24 * 60 * 60 * 1000);
    list[idx].snoozedUntil = snoozeUntil.toISOString();
    saveInteractions(list);
  }
}

function respondAndOpenForm(interaction, outcomeText) {
  const params = new URLSearchParams();
  params.set("usp", "pp_url");
  params.set(FEEDBACK_CONFIG.ENTRY_PROGRAM_NAME, interaction.name);
  if (outcomeText) {
    params.set(FEEDBACK_CONFIG.ENTRY_OUTCOME, outcomeText);
  }
  const url = `${FEEDBACK_CONFIG.FORM_BASE_URL}?${params.toString()}`;
  window.open(url, "_blank", "noopener");

  const list = loadInteractions();
  const idx = list.findIndex(i => i.id === interaction.id);
  if (idx !== -1) {
    list[idx].answered = true;
    saveInteractions(list);
  }

  const toast = document.getElementById("rc-toast");
  if (toast) {
    toast.innerHTML = `<p class="rc-toast-thanks">Thanks — opening your form now! 🙏</p>`;
    setTimeout(() => toast.remove(), 1800);
  }
}

function escapeHtmlLocal(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

document.addEventListener("DOMContentLoaded", () => {
  // Small delay so this never competes with the page's initial render.
  setTimeout(checkForFollowUp, 1200);
});

window.RCFeedback = { trackInteraction };
