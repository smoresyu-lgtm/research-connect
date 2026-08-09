// ---------------------------------------------------------------
// Research Connect — follow-up email signup
// When someone clicks "Draft email" or "View program & apply,"
// ask whether Research Connect may check back in ~2 weeks.
// If they agree, save their email + opportunity to Google Sheets.
// ---------------------------------------------------------------

const FOLLOWUP_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbzFXMS5mkKPLNnn8qUGVIXf3Q3SQ4n0Q91VeRihDtmsUc58Bh431iQainDsnlr3Z3Cwhg/exec";

function trackInteraction(entry) {
  showFollowUpSignup(entry);
}

function showFollowUpSignup(entry) {
  const existing = document.getElementById("rc-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.id = "rc-toast";
  toast.className = "rc-toast";
  toast.setAttribute("role", "dialog");
  toast.setAttribute("aria-label", "Research Connect follow-up");

  toast.innerHTML = `
    <button class="rc-toast-close" aria-label="No thanks">&times;</button>

    <p class="rc-toast-title">Can we check back in on how it went?</p>

    <p class="rc-toast-body">
      Leave your email and we'll send you one quick follow-up in two weeks.
    </p>

    <input
      type="email"
      id="rc-followup-email"
      placeholder="you@example.com"
      autocomplete="email"
      style="
        width: 100%;
        box-sizing: border-box;
        margin-bottom: 0.6rem;
        padding: 0.6rem 0.7rem;
        border: 1px solid #C7C2AE;
        border-radius: 3px;
        font-family: Inter, sans-serif;
        font-size: 0.9rem;
      "
    >

    <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
      <button
        type="button"
        id="rc-followup-submit"
        class="rc-toast-option"
        style="flex:1;"
      >
        Sure!
      </button>

      <button
        type="button"
        id="rc-followup-no"
        class="rc-toast-option rc-toast-option-other"
        style="flex:1;"
      >
        No thanks
      </button>
    </div>

    <p class="rc-toast-body" style="font-size:0.72rem; margin-top:0.6rem;">
      We'll only use your email for this one follow-up and won't add you to a mailing list.
    </p>
  `;

  document.body.appendChild(toast);

  const emailInput = document.getElementById("rc-followup-email");
  const submitBtn = document.getElementById("rc-followup-submit");
  const noBtn = document.getElementById("rc-followup-no");
  const closeBtn = toast.querySelector(".rc-toast-close");

  const closeToast = () => toast.remove();

  noBtn.addEventListener("click", closeToast);
  closeBtn.addEventListener("click", closeToast);

  submitBtn.addEventListener("click", async () => {
    const email = emailInput.value.trim();

    if (!email || !email.includes("@")) {
      emailInput.focus();
      emailInput.style.borderColor = "#B94A48";
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Saving...";

    try {
      await fetch(FOLLOWUP_ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify({
          email: email,
          opportunity: entry.name
        })
      });

      toast.innerHTML = `
        <p class="rc-toast-thanks">
          Got it — we'll check back in about two weeks! 🙏
        </p>
      `;

      setTimeout(() => toast.remove(), 2200);

    } catch (error) {
      console.error("Research Connect follow-up signup failed:", error);

      submitBtn.disabled = false;
      submitBtn.textContent = "Sure!";

      alert("Something went wrong. Please try again.");
    }
  });
}

window.RCFeedback = { trackInteraction };
