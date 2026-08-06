:root {
  --paper: #EEF0E6;
  --card-bg: #FBFAF4;
  --ink: #1F2A24;
  --ink-soft: #4A5750;
  --line: #C7C2AE;
  --accent: #C8952B;
  --accent-ink: #6B4F14;
  --teal: #3B6E5E;
  --teal-soft: #E4ECE8;
  --radius: 3px;
  --shadow-card: 0 1px 0 rgba(31,42,36,0.06), 0 4px 10px rgba(31,42,36,0.06);
}

* { box-sizing: border-box; }

body {
  margin: 0;
  background-color: var(--paper);
  background-image:
    linear-gradient(var(--line) 1px, transparent 1px);
  background-size: 100% 2.1em;
  background-position: 0 7.4em;
  color: var(--ink);
  font-family: 'Inter', sans-serif;
  line-height: 1.55;
}

.visually-hidden {
  position: absolute;
  width: 1px; height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
}

a { color: var(--teal); }

/* ---------- Header ---------- */
.site-header {
  border-bottom: 2px solid var(--ink);
  background: var(--paper);
}
.header-inner {
  max-width: 980px;
  margin: 0 auto;
  padding: 1.6rem 1.5rem 1.2rem;
}
.wordmark {
  display: flex;
  align-items: center;
  gap: 0.7rem;
}
.wordmark-tab {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.06em;
  background: var(--ink);
  color: var(--paper);
  padding: 0.3rem 0.55rem;
  border-radius: var(--radius);
}
.wordmark-text {
  font-family: 'Fraunces', serif;
  font-size: 1.5rem;
  font-weight: 600;
}
.header-tagline {
  margin: 0.6rem 0 0;
  color: var(--ink-soft);
  max-width: 46ch;
  font-size: 0.98rem;
}

/* ---------- Hero ---------- */
.hero {
  max-width: 980px;
  margin: 0 auto;
  padding: 3.2rem 1.5rem 1.6rem;
}
.hero h1 {
  font-family: 'Fraunces', serif;
  font-weight: 500;
  font-size: clamp(2rem, 4.2vw, 3.1rem);
  line-height: 1.12;
  margin: 0 0 0.9rem;
  max-width: 16ch;
}
.hero-sub {
  color: var(--ink-soft);
  max-width: 58ch;
  font-size: 1.05rem;
  margin: 0 0 2rem;
}

.search-card {
  position: relative;
  background: var(--card-bg);
  border: 1.5px solid var(--ink);
  border-radius: var(--radius);
  box-shadow: var(--shadow-card);
  display: flex;
  align-items: center;
  max-width: 620px;
  padding: 0.2rem 0.2rem 0.2rem 1rem;
}
.search-card::before {
  content: "";
  position: absolute;
  top: -1px; left: 1.4rem;
  width: 34px; height: 3px;
  background: var(--accent);
}
#search-input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 0.85rem 0.5rem;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: var(--ink);
  outline: none;
}
#search-input::placeholder { color: #8B8677; }
.search-card-index {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.75rem;
  color: var(--ink-soft);
  background: var(--teal-soft);
  padding: 0.35rem 0.6rem;
  border-radius: var(--radius);
  margin-right: 0.35rem;
  white-space: nowrap;
}

/* ---------- Filters ---------- */
.filters {
  max-width: 980px;
  margin: 0 auto;
  padding: 0.5rem 1.5rem 2.2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1.6rem 2.2rem;
  align-items: flex-start;
}
.filter-group { display: flex; flex-direction: column; gap: 0.5rem; }
.filter-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-soft);
}
.tab-row { display: flex; flex-wrap: wrap; gap: 0.4rem; }
.tab-btn {
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  background: var(--card-bg);
  border: 1px solid var(--line);
  border-bottom: 3px solid var(--line);
  border-radius: var(--radius) var(--radius) 0 0;
  padding: 0.4rem 0.75rem;
  cursor: pointer;
  color: var(--ink-soft);
  transition: border-color 0.15s ease, color 0.15s ease, background 0.15s ease;
}
.tab-btn:hover { color: var(--ink); border-color: var(--ink-soft); }
.tab-btn:focus-visible { outline: 2px solid var(--teal); outline-offset: 2px; }
.tab-btn.active {
  color: var(--ink);
  font-weight: 600;
  background: var(--card-bg);
  border-color: var(--line);
  border-bottom: 3px solid var(--accent);
}
.clear-btn {
  align-self: flex-end;
  margin-left: auto;
  background: none;
  border: none;
  color: var(--teal);
  font-size: 0.85rem;
  text-decoration: underline;
  cursor: pointer;
  padding: 0.4rem 0;
}

/* ---------- Listings ---------- */
.listings {
  max-width: 980px;
  margin: 0 auto;
  padding: 0 1.5rem 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.1rem;
}

.card {
  position: relative;
  background: var(--card-bg);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 1.2rem 1.2rem 1.1rem;
  box-shadow: var(--shadow-card);
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}
.card::before {
  content: "";
  position: absolute;
  top: 0.85rem; left: -1px;
  width: 8px; height: 8px;
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 50%;
}
.card:hover, .card:focus-visible {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(31,42,36,0.12);
  outline: none;
}
.card-field-tag {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.7rem;
  color: var(--accent-ink);
  background: #F3E4C4;
  align-self: flex-start;
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius);
  letter-spacing: 0.03em;
}
.card h3 {
  font-family: 'Fraunces', serif;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
}
.card-university {
  font-size: 0.9rem;
  color: var(--ink-soft);
  margin: -0.3rem 0 0;
}
.card-summary {
  font-size: 0.88rem;
  color: var(--ink-soft);
  margin: 0;
  flex-grow: 1;
}
.card-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-top: 0.2rem;
}
.badge {
  font-size: 0.72rem;
  border: 1px solid var(--line);
  border-radius: 20px;
  padding: 0.18rem 0.6rem;
  color: var(--ink-soft);
}
.badge.level { background: var(--teal-soft); border-color: var(--teal-soft); color: var(--teal); }

.empty-state {
  max-width: 980px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
  color: var(--ink-soft);
  font-size: 0.95rem;
}

/* ---------- Footer ---------- */
.site-footer {
  border-top: 1px solid var(--line);
  padding: 1.5rem;
  text-align: center;
}
.site-footer p {
  max-width: 60ch;
  margin: 0 auto;
  font-size: 0.8rem;
  color: var(--ink-soft);
}

/* ---------- Modal ---------- */
.email-modal {
  position: fixed;
  inset: 0;
  background: rgba(31,42,36,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  z-index: 10;
}
.email-modal[hidden] {
  display: none;
}
.email-modal-card {
  position: relative;
  background: var(--card-bg);
  border: 1.5px solid var(--ink);
  border-radius: var(--radius);
  max-width: 480px;
  width: 100%;
  padding: 2rem 1.8rem 1.8rem;
  box-shadow: 0 14px 40px rgba(31,42,36,0.28);
}
.modal-close {
  position: absolute;
  top: 0.8rem; right: 0.9rem;
  background: none;
  border: none;
  font-size: 1.4rem;
  line-height: 1;
  cursor: pointer;
  color: var(--ink-soft);
}
.modal-eyebrow {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.7rem;
  color: var(--accent-ink);
  letter-spacing: 0.04em;
}
.email-modal-card h2 {
  font-family: 'Fraunces', serif;
  margin: 0.3rem 0 0.1rem;
  font-size: 1.4rem;
}
.modal-university {
  color: var(--ink-soft);
  margin: 0 0 0.9rem;
  font-size: 0.92rem;
}
.modal-summary {
  font-size: 0.92rem;
  margin: 0 0 1rem;
}
.modal-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 1.4rem;
}
.modal-actions { display: flex; gap: 0.7rem; flex-wrap: wrap; }
.btn-primary, .btn-secondary {
  display: inline-block;
  text-decoration: none;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  padding: 0.65rem 1.1rem;
  border-radius: var(--radius);
}
.btn-primary { background: var(--ink); color: var(--paper); }
.btn-primary:hover { background: var(--teal); }
.btn-secondary { border: 1px solid var(--line); color: var(--ink); }

@media (max-width: 560px) {
  .hero h1 { max-width: none; }
  .clear-btn { margin-left: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .card, .tab-btn, .btn-primary { transition: none; }
}
