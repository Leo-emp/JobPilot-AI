/* ============================================================
   JOBPILOT AI - Content Script
   ============================================================
   Runs on LinkedIn, Indeed, and Glassdoor job pages.
   - Extracts job title, company, and description from the page
   - Shows a floating badge with instant match score
   - One-click save to application tracker
   - Passively tracks viewed jobs for career intelligence
   ============================================================ */

/* ---- Configuration ---- */
const API_URLS = ["https://jobpilotai.co", "http://localhost:3000"];
let BASE_URL = API_URLS[0];
let isLoggedIn = false;

/* ---- Site-specific extractors ---- */
const extractors = {
  linkedin: {
    test: () => window.location.hostname.includes("linkedin.com"),
    title: () => {
      const el = document.querySelector(".job-details-jobs-unified-top-card__job-title a") ||
                 document.querySelector(".jobs-unified-top-card__job-title a") ||
                 document.querySelector("h1.t-24") ||
                 document.querySelector("h1");
      return el?.textContent?.trim() || "";
    },
    company: () => {
      const el = document.querySelector(".job-details-jobs-unified-top-card__company-name a") ||
                 document.querySelector(".jobs-unified-top-card__company-name a") ||
                 document.querySelector(".jobs-unified-top-card__subtitle-primary-grouping span");
      return el?.textContent?.trim() || "";
    },
    description: () => {
      const el = document.querySelector(".jobs-description__content") ||
                 document.querySelector("#job-details") ||
                 document.querySelector(".jobs-box__html-content");
      return el?.textContent?.trim()?.slice(0, 2000) || "";
    },
    source: "linkedin",
  },
  indeed: {
    test: () => window.location.hostname.includes("indeed.com"),
    title: () => {
      const el = document.querySelector(".jobsearch-JobInfoHeader-title") ||
                 document.querySelector("h1[data-testid='jobsearch-JobInfoHeader-title']") ||
                 document.querySelector("h1.icl-u-xs-mb--xs");
      return el?.textContent?.trim() || "";
    },
    company: () => {
      const el = document.querySelector("[data-testid='inlineHeader-companyName']") ||
                 document.querySelector(".jobsearch-InlineCompanyRating div:first-child a") ||
                 document.querySelector(".icl-u-lg-mr--sm");
      return el?.textContent?.trim() || "";
    },
    description: () => {
      const el = document.querySelector("#jobDescriptionText") ||
                 document.querySelector(".jobsearch-jobDescriptionText");
      return el?.textContent?.trim()?.slice(0, 2000) || "";
    },
    source: "indeed",
  },
  glassdoor: {
    test: () => window.location.hostname.includes("glassdoor.com"),
    title: () => {
      const el = document.querySelector("[data-test='job-title']") ||
                 document.querySelector(".css-1vg6q84") ||
                 document.querySelector("h1");
      return el?.textContent?.trim() || "";
    },
    company: () => {
      const el = document.querySelector("[data-test='employer-name']") ||
                 document.querySelector(".css-87uc0g");
      return el?.textContent?.trim() || "";
    },
    description: () => {
      const el = document.querySelector(".jobDescriptionContent") ||
                 document.querySelector("[data-test='job-description']") ||
                 document.querySelector(".desc");
      return el?.textContent?.trim()?.slice(0, 2000) || "";
    },
    source: "glassdoor",
  },
};

/* ---- Detect which site we're on ---- */
function getExtractor() {
  for (const ext of Object.values(extractors)) {
    if (ext.test()) return ext;
  }
  return null;
}

/* ---- Extract job data from current page ---- */
function extractJobData() {
  const ext = getExtractor();
  if (!ext) return null;

  const title = ext.title();
  const company = ext.company();
  if (!title && !company) return null;

  return {
    title,
    company,
    description: ext.description(),
    url: window.location.href,
    source: ext.source,
  };
}

/* ---- API helpers ---- */
async function checkAuth() {
  for (const url of API_URLS) {
    try {
      const res = await fetch(`${url}/api/extension/status`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          BASE_URL = url;
          isLoggedIn = true;
          return true;
        }
      }
    } catch { /* try next */ }
  }
  return false;
}

async function getQuickMatch(description) {
  try {
    const res = await fetch(`${BASE_URL}/api/extension/quick-match?description=${encodeURIComponent(description.slice(0, 500))}`, {
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      return data.score;
    }
  } catch { /* silent */ }
  return null;
}

async function trackJobView(jobData) {
  try {
    await fetch(`${BASE_URL}/api/extension/job-view`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(jobData),
    });
  } catch { /* fire and forget */ }
}

async function saveJob(jobData) {
  try {
    const res = await fetch(`${BASE_URL}/api/extension/save-job`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        jobTitle: jobData.title,
        company: jobData.company,
        location: "",
        url: jobData.url,
        description: jobData.description,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/* ---- Toast notification ---- */
function showToast(message) {
  let toast = document.getElementById("jp-content-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "jp-content-toast";
    toast.className = "jp-toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

/* ---- Build and inject the floating badge ---- */
async function injectBadge(jobData) {
  /* Don't inject twice */
  if (document.getElementById("jobpilot-badge")) return;

  /* Check if user previously minimized the badge */
  let minimized = false;
  try {
    const stored = await chrome.storage.local.get("jp_badge_minimized");
    minimized = stored.jp_badge_minimized === true;
  } catch { /* storage unavailable — show full */ }

  const badge = document.createElement("div");
  badge.id = "jobpilot-badge";
  if (minimized) badge.classList.add("jp-minimized");

  badge.innerHTML = `
    <div class="jp-badge-panel" id="jp-panel">
      <h3>JobPilot AI</h3>
      <div class="jp-badge-job-info">
        <strong>${escapeHtml(jobData.title)}</strong>
        ${escapeHtml(jobData.company)}
      </div>
      <button class="jp-badge-btn jp-badge-btn-save" id="jp-save-btn">
        Save + Track
      </button>
      <button class="jp-badge-btn jp-badge-btn-open" id="jp-open-btn">
        Open Dashboard
      </button>
    </div>
    <div class="jp-badge-main" id="jp-trigger">
      <div class="jp-badge-logo">JP</div>
      <div class="jp-badge-text">
        <span class="jp-badge-title">JobPilot AI</span>
        <span class="jp-badge-score loading" id="jp-score">Checking match...</span>
      </div>
      <button class="jp-badge-minimize" id="jp-minimize" title="Minimize badge">×</button>
    </div>
    <div class="jp-badge-mini" id="jp-mini-trigger" title="Open JobPilot AI">
      <div class="jp-badge-logo">JP</div>
    </div>
  `;

  document.body.appendChild(badge);

  /* Toggle panel */
  const trigger = document.getElementById("jp-trigger");
  const panel = document.getElementById("jp-panel");
  let panelOpen = false;

  trigger.addEventListener("click", (e) => {
    if (e.target.id === "jp-minimize") return;
    panelOpen = !panelOpen;
    panel.classList.toggle("open", panelOpen);
  });

  /* Minimize button — collapse to small icon */
  document.getElementById("jp-minimize").addEventListener("click", (e) => {
    e.stopPropagation();
    badge.classList.add("jp-minimized");
    panel.classList.remove("open");
    panelOpen = false;
    try { chrome.storage.local.set({ jp_badge_minimized: true }); } catch {}
  });

  /* Mini trigger — expand back to full badge */
  document.getElementById("jp-mini-trigger").addEventListener("click", () => {
    badge.classList.remove("jp-minimized");
    try { chrome.storage.local.set({ jp_badge_minimized: false }); } catch {}
  });

  /* Save button */
  const saveBtn = document.getElementById("jp-save-btn");
  saveBtn.addEventListener("click", async () => {
    saveBtn.disabled = true;
    saveBtn.textContent = "Saving...";
    const ok = await saveJob(jobData);
    if (ok) {
      saveBtn.className = "jp-badge-btn jp-badge-btn-saved";
      saveBtn.textContent = "Saved!";
      showToast("Job saved to your tracker");
    } else {
      saveBtn.disabled = false;
      saveBtn.textContent = "Save + Track";
      showToast("Failed to save — are you logged in?");
    }
  });

  /* Dashboard link */
  document.getElementById("jp-open-btn").addEventListener("click", () => {
    window.open(`${BASE_URL}/dashboard/tracker`, "_blank");
  });

  /* Fetch match score */
  if (jobData.description) {
    getQuickMatch(jobData.description).then(score => {
      const scoreEl = document.getElementById("jp-score");
      if (score !== null) {
        scoreEl.textContent = `Match: ${score}%`;
        scoreEl.classList.remove("loading");
        scoreEl.style.color = score >= 70 ? "#4ade80" : score >= 50 ? "#fbbf24" : "#f87171";
      } else {
        scoreEl.textContent = "Upload resume for score";
      }
    });
  }
}

/* ---- HTML escape ---- */
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/* ---- Main: Initialize on page load ---- */
async function init() {
  /* Wait a moment for dynamic content to render (SPAs like LinkedIn) */
  await new Promise(r => setTimeout(r, 2000));

  const jobData = extractJobData();
  if (!jobData) return;

  const loggedIn = await checkAuth();
  if (!loggedIn) return;

  /* Track the view passively */
  trackJobView(jobData);

  /* Show the badge */
  injectBadge(jobData);
}

/* Run on load */
init();

/* LinkedIn is an SPA — watch for URL changes */
if (window.location.hostname.includes("linkedin.com")) {
  let lastUrl = location.href;
  const observer = new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      const existing = document.getElementById("jobpilot-badge");
      if (existing) existing.remove();
      setTimeout(init, 2000);
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}
