/* ============================================================
   JOBPILOT AI CHROME EXTENSION - Popup Logic
   ============================================================
   Handles:
   - Detecting if user is logged in to JobPilot
   - Saving jobs to the user's dashboard
   - Running AI match score and cover letter tools
   - Showing recent applications
   ============================================================ */

/* ---- Configuration ---- */
/* Switch between local dev and production URLs */
const API_URLS = [
  "https://jobpilotai.co",
  "http://localhost:3000",
];

/* We try the production URL first, fall back to localhost */
let BASE_URL = API_URLS[0];

/* ---- DOM Elements ---- */
const loginPrompt = document.getElementById("login-prompt");
const mainContent = document.getElementById("main-content");
const statusDot = document.querySelector(".dot");
const statusText = document.getElementById("status-text");
const btnLogin = document.getElementById("btn-login");
const btnSave = document.getElementById("btn-save");
const btnMatch = document.getElementById("btn-match");
const btnCover = document.getElementById("btn-cover");
const btnDashboard = document.getElementById("btn-dashboard");
const aiSection = document.getElementById("ai-section");
const aiResult = document.getElementById("ai-result");
const recentJobs = document.getElementById("recent-jobs");
const toast = document.getElementById("toast");

/* ---- Form Inputs ---- */
const jobTitleInput = document.getElementById("job-title");
const companyInput = document.getElementById("company");
const locationInput = document.getElementById("location");
const jobUrlInput = document.getElementById("job-url");
const descriptionInput = document.getElementById("description");

/* ============================================================
   EXTRACT JOB DATA - Runs directly in the active tab via
   chrome.scripting.executeScript (no content script needed)
   ============================================================ */
async function extractFromTab(tabId) {
  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        /* --- This runs inside the job page itself --- */

        /* Try multiple CSS selectors, return first match */
        function q(...sels) {
          for (const s of sels) {
            const el = document.querySelector(s);
            const t = el?.textContent?.trim();
            if (t) return t;
          }
          return "";
        }

        /* Parse structured data (JSON-LD) */
        function jsonLd() {
          for (const s of document.querySelectorAll('script[type="application/ld+json"]')) {
            try {
              let d = JSON.parse(s.textContent);
              if (Array.isArray(d)) d = d.find(x => x["@type"] === "JobPosting") || d[0];
              if (d?.["@graph"]) d = d["@graph"].find(x => x["@type"] === "JobPosting") || d;
              if (d?.["@type"] === "JobPosting") return d;
            } catch {}
          }
          return null;
        }

        /* Parse the browser tab title — most reliable on LinkedIn */
        /* Format: "Job Title - Company | LinkedIn" or "(3) Job Title - Company | Site" */
        function fromTitle() {
          const raw = (document.title || "").replace(/^\(\d+\)\s*/, "");
          const dash = raw.split(" - ");
          if (dash.length >= 2) {
            const t = dash[0].trim();
            const rest = dash.slice(1).join(" - ");
            const pipes = rest.split("|");
            const c = pipes.length > 1 ? pipes.slice(0, -1).join("|").trim() : pipes[0].trim();
            if (t && c) return { title: t, company: c };
          }
          const pipes = raw.split("|").map(s => s.trim());
          if (pipes.length >= 3) return { title: pipes[0], company: pipes[1] };
          return null;
        }

        /* Meta tag helper */
        function meta(name) {
          const el = document.querySelector(`meta[property="${name}"], meta[name="${name}"]`);
          return el?.getAttribute("content")?.trim() || "";
        }

        let title = "", company = "", location_ = "", description = "";
        const host = location.hostname;

        /* Site-specific CSS selectors */
        if (host.includes("linkedin.com")) {
          title = q(
            ".job-details-jobs-unified-top-card__job-title a",
            ".job-details-jobs-unified-top-card__job-title h1",
            ".job-details-jobs-unified-top-card__job-title",
            ".jobs-unified-top-card__job-title a",
            ".artdeco-entity-lockup__title",
            ".jobs-details__main-content h1",
            ".scaffold-layout__detail h1",
            ".t-24.job-details-jobs-unified-top-card__job-title",
            "h1.t-24"
          );
          company = q(
            ".job-details-jobs-unified-top-card__company-name a",
            ".job-details-jobs-unified-top-card__company-name",
            ".job-details-jobs-unified-top-card__primary-description a",
            ".job-details-jobs-unified-top-card__primary-description-container a",
            ".jobs-unified-top-card__company-name a",
            ".artdeco-entity-lockup__subtitle"
          );

          /* --- Location: find country name near the job title --- */
          const COUNTRIES = [
            "Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda",
            "Argentina","Armenia","Australia","Austria","Azerbaijan","Bahamas","Bahrain",
            "Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia",
            "Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso",
            "Burundi","Cabo Verde","Cambodia","Cameroon","Canada","Central African Republic",
            "Chad","Chile","China","Colombia","Comoros","Congo","Costa Rica","Croatia","Cuba",
            "Cyprus","Czech Republic","Czechia","Denmark","Djibouti","Dominica",
            "Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea",
            "Estonia","Eswatini","Ethiopia","Fiji","Finland","France","Gabon","Gambia","Georgia",
            "Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana",
            "Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland",
            "Israel","Italy","Ivory Coast","Jamaica","Japan","Jordan","Kazakhstan","Kenya",
            "Kiribati","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho",
            "Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Madagascar","Malawi",
            "Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius",
            "Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco",
            "Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands","New Zealand",
            "Nicaragua","Niger","Nigeria","North Korea","North Macedonia","Norway","Oman",
            "Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru",
            "Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda",
            "Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa",
            "San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles",
            "Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia",
            "South Africa","South Korea","South Sudan","Spain","Sri Lanka","Sudan","Suriname",
            "Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand",
            "Timor-Leste","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan",
            "Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States",
            "Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Yemen",
            "Zambia","Zimbabwe","UAE","UK","US","USA","Remote"
          ];
          /* Walk up from the H1, check each parent level for a country.
             The subtitle with the country is near the H1 so the closest
             parent that contains it wins — before we reach the sidebar. */
          const h1El = document.querySelector("h1");
          if (h1El) {
            let el = h1El.parentElement;
            for (let lvl = 0; lvl < 6 && el && el !== document.body && !location_; lvl++) {
              const txt = el.innerText || "";
              for (const c of COUNTRIES) {
                const re = new RegExp("\\b" + c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "i");
                if (re.test(txt)) { location_ = c; break; }
              }
              el = el.parentElement;
            }
          }

          /* --- Description & Requirements --- */
          /* Strategy: get all text from the job detail panel, then filter to
             keep only job description / requirements / qualifications content */

          /* Step 1: Try LinkedIn's known description container */
          const descEl = document.getElementById("job-details")
            || document.querySelector(".jobs-description__content")
            || document.querySelector(".jobs-description-content__text")
            || document.querySelector(".jobs-box__html-content")
            || document.querySelector("[class*='jobs-description']");
          if (descEl) description = (descEl.innerText || "").trim();

          /* Step 2: If that failed, grab text from the job detail panel and filter */
          if (!description) {
            /* Get ALL text visible on the right/detail panel */
            let fullText = "";
            /* Try various panel containers */
            const panelSelectors = [
              ".jobs-search__job-details",
              ".scaffold-layout__detail",
              ".job-view-layout",
              "main",
              "[role='main']"
            ];
            for (const sel of panelSelectors) {
              const el = document.querySelector(sel);
              if (el && (el.innerText || "").length > 200) {
                fullText = el.innerText;
                break;
              }
            }

            if (fullText) {
              const lines = fullText.split("\n").map(l => l.trim()).filter(Boolean);

              /* Lines to cut: LinkedIn UI, profile prompts, company overview section */
              const skipPatterns = [
                /^your profile/i, /^beta/i, /^people you can/i,
                /^school alum/i, /^is this information/i,
                /^show (more|less|fewer)/i, /^see who/i,
                /^repost$/i, /^save$/i, /^share$/i, /^apply$/i, /^easy apply$/i,
                /^report this/i, /^message$/i, /^follow$/i,
                /^\d+ applicant/i, /^\d+ (day|week|hour|minute|month|year)s? ago$/i,
                /^(am|pm)$/i, /^promoted$/i, /^viewed$/i
              ];

              /* Markers where the description ends */
              const endMarkers = [
                /^about the company$/i, /^about .+ company$/i,
                /^company size/i, /^headquarters/i, /^founded/i,
                /^specialties/i, /^people also viewed/i, /^similar jobs/i,
                /^show more jobs/i
              ];

              /* Find where the role-specific content starts (skip company overview) */
              /* These indicate the text is about the ROLE, not the company */
              const roleStartMarkers = [
                /^(about|the)\s+(role|position|opportunity|job)/i,
                /^position\s+(overview|summary|description)/i,
                /^job\s+(description|summary|overview)/i,
                /^(key\s+)?responsibilities/i, /^what\s+you'?ll\s+do/i,
                /^requirements$/i, /^qualifications$/i,
                /^must[\s-]have/i, /^nice[\s-]to[\s-]have/i,
                /^what\s+we'?re\s+looking\s+for/i,
                /^who\s+you\s+are/i, /^what\s+you\s+(bring|need)/i,
                /^about\s+you/i, /^ideal\s+candidate/i,
                /^skills/i, /^experience/i,
                /we'?re\s+(hiring|looking\s+for|seeking)/i,
                /^in\s+this\s+role/i, /^as\s+(a|an|the)\s+/i,
                /^you\s+will/i, /^you'?ll\s+(be|own|lead|work|manage|build|drive)/i
              ];
              let startIdx = 0;
              for (let i = 0; i < lines.length; i++) {
                if (roleStartMarkers.some(r => r.test(lines[i]))) {
                  startIdx = i;
                  break;
                }
              }
              /* If no marker found, fall back to first long paragraph */
              if (startIdx === 0) {
                for (let i = 0; i < lines.length; i++) {
                  if (lines[i].length > 60 && !skipPatterns.some(r => r.test(lines[i]))) {
                    startIdx = i;
                    break;
                  }
                }
              }

              /* Find where to stop: "About the company" or similar */
              let endIdx = lines.length;
              for (let i = startIdx; i < lines.length; i++) {
                if (endMarkers.some(r => r.test(lines[i]))) {
                  endIdx = i;
                  break;
                }
              }

              /* Filter the description range, remove noise lines */
              const filtered = lines
                .slice(startIdx, endIdx)
                .filter(l => !skipPatterns.some(r => r.test(l)))
                .filter(l => l.length > 3);

              description = filtered.join("\n").trim();
              if (description.length > 5000) description = description.slice(0, 5000);
            }
          }
        } else if (host.includes("indeed.com")) {
          title = q(".jobsearch-JobInfoHeader-title", "h1[data-testid='jobsearch-JobInfoHeader-title']", "h1");
          company = q("[data-testid='inlineHeader-companyName']", ".jobsearch-InlineCompanyRating div:first-child a");
          location_ = q("[data-testid='inlineHeader-companyLocation']", ".jobsearch-JobInfoHeader-subtitle div:last-child");
          description = q("#jobDescriptionText", ".jobsearch-jobDescriptionText");
        } else if (host.includes("glassdoor.com")) {
          title = q("[data-test='job-title']", "h1");
          company = q("[data-test='employer-name']");
          location_ = q("[data-test='emp-location']");
          description = q(".jobDescriptionContent", "[data-test='job-description']");
        } else {
          /* Generic: try common patterns */
          title = q("h1", "[itemprop='title']");
          company = q("[itemprop='hiringOrganization'] [itemprop='name']", "[itemprop='name']");
          location_ = q("[itemprop='jobLocation']", ".location");
          description = q("[itemprop='description']", ".job-description", "#job-description");
        }

        /* Fallback 1: JSON-LD structured data */
        const ld = jsonLd();
        if (ld) {
          if (!title) title = ld.title || "";
          if (!company) company = typeof ld.hiringOrganization === "object" ? ld.hiringOrganization.name || "" : ld.hiringOrganization || "";
          if (!description) description = ld.description?.replace(/<[^>]*>/g, " ").trim() || "";
          if (!location_ && ld.jobLocation) {
            const jl = ld.jobLocation;
            location_ = typeof jl === "object" ? (jl.address?.addressLocality || jl.name || "") : jl;
          }
        }

        /* Fallback 2: meta tags */
        if (!title) title = meta("og:title");
        if (!description) description = meta("og:description");

        /* Fallback 3: page title (most reliable for LinkedIn) */
        if (!title || !company) {
          const pt = fromTitle();
          if (pt) {
            if (!title) title = pt.title;
            if (!company) company = pt.company;
          }
        }

        /* Fallback 4: meta tags for location */
        if (!location_) {
          location_ = meta("og:locality") || meta("geo.placename") || "";
        }

        if (!title && !company) return null;
        return { title, company, location: location_, description, url: location.href };
      },
    });

    if (results?.[0]?.result) return results[0].result;
  } catch {}
  return null;
}

/* ============================================================
   INITIALIZATION - Check login status on popup open
   ============================================================ */
document.addEventListener("DOMContentLoaded", async () => {
  let autoFilled = false;
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    /* Extract job data directly from the tab (most reliable) */
    let job = null;
    if (tab?.id && tab.url && !tab.url.startsWith("chrome://")) {
      job = await extractFromTab(tab.id);
    }

    /* Fallback: check content script's stored data */
    if (!job) {
      const stored = await chrome.storage.local.get("jp_current_job");
      const cached = stored.jp_current_job;
      if (cached && (Date.now() - cached.timestamp) < 1800000) {
        job = cached;
      }
    }

    /* Auto-fill the form */
    if (job) {
      if (job.title) { jobTitleInput.value = job.title; autoFilled = true; }
      if (job.company) { companyInput.value = job.company; autoFilled = true; }
      if (job.location) { locationInput.value = job.location; autoFilled = true; }
      if (job.description) { descriptionInput.value = job.description; autoFilled = true; }
      jobUrlInput.value = job.url || tab?.url || "";
    } else if (tab?.url && !tab.url.startsWith("chrome://")) {
      jobUrlInput.value = tab.url;
    }
  } catch {}

  /* Enable/disable save button based on required fields */
  jobTitleInput.addEventListener("input", toggleSaveButton);
  companyInput.addEventListener("input", toggleSaveButton);
  toggleSaveButton();

  /* Show AI tools section when description is entered */
  descriptionInput.addEventListener("input", () => {
    aiSection.style.display = descriptionInput.value.trim() ? "block" : "none";
  });

  /* If auto-filled with description, show AI tools immediately */
  if (autoFilled && descriptionInput.value.trim()) {
    aiSection.style.display = "block";
  }

  /* Check if user is authenticated */
  await checkAuth();
});

/* ---- Toggle save button based on required fields ---- */
function toggleSaveButton() {
  btnSave.disabled = !(jobTitleInput.value.trim() && companyInput.value.trim());
}

/* ============================================================
   AUTH CHECK - See if user is logged into JobPilot
   ============================================================ */
async function checkAuth() {
  for (const url of API_URLS) {
    try {
      const res = await fetch(`${url}/api/extension/status`, {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          /* User is logged in — show main content */
          BASE_URL = url;
          statusDot.classList.add("connected");
          statusText.textContent = "Connected";
          loginPrompt.style.display = "none";
          mainContent.style.display = "block";
          btnDashboard.href = `${BASE_URL}/dashboard`;

          /* Load recent applications */
          loadRecentApplications();
          return;
        }
      }
    } catch {
      /* This URL didn't work — try the next one */
    }
  }

  /* Not logged in — show login prompt */
  statusDot.classList.add("disconnected");
  statusText.textContent = "Not connected";
  loginPrompt.style.display = "block";
  mainContent.style.display = "none";
}

/* ============================================================
   SAVE JOB - Send job data to JobPilot API
   ============================================================ */
btnSave.addEventListener("click", async () => {
  const jobTitle = jobTitleInput.value.trim();
  const company = companyInput.value.trim();
  const location = locationInput.value.trim();
  const url = jobUrlInput.value.trim();
  const description = descriptionInput.value.trim();

  if (!jobTitle || !company) return;

  /* Show loading state */
  btnSave.disabled = true;
  btnSave.innerHTML = '<span class="spinner"></span> Saving...';

  try {
    const res = await fetch(`${BASE_URL}/api/extension/save-job`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobTitle, company, location, url, description }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to save job");
    }

    /* Success — show toast and clear form */
    showToast("Job saved to your dashboard!", "success");
    jobTitleInput.value = "";
    companyInput.value = "";
    locationInput.value = "";
    descriptionInput.value = "";
    aiSection.style.display = "none";
    toggleSaveButton();

    /* Refresh recent applications */
    loadRecentApplications();
  } catch (err) {
    showToast(err.message || "Failed to save job", "error");
  } finally {
    btnSave.disabled = false;
    btnSave.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 5v14M5 12h14"/>
      </svg>
      Save to JobPilot
    `;
    toggleSaveButton();
  }
});

/* ============================================================
   AI TOOLS - Match Score & Cover Letter
   ============================================================ */

/* ---- Match Score ---- */
btnMatch.addEventListener("click", async () => {
  const description = descriptionInput.value.trim();
  if (!description) return;

  btnMatch.disabled = true;
  btnMatch.textContent = "Analyzing...";
  aiResult.style.display = "block";
  aiResult.textContent = "Calculating match score...";

  try {
    const res = await fetch(`${BASE_URL}/api/extension/ai`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "match_score", description }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "AI request failed");
    }

    const data = await res.json();
    aiResult.textContent = data.result;
  } catch (err) {
    aiResult.textContent = err.message || "Failed to get match score";
  } finally {
    btnMatch.disabled = false;
    btnMatch.textContent = "Match Score";
  }
});

/* ---- Cover Letter ---- */
btnCover.addEventListener("click", async () => {
  const description = descriptionInput.value.trim();
  const jobTitle = jobTitleInput.value.trim();
  const company = companyInput.value.trim();
  if (!description) return;

  btnCover.disabled = true;
  btnCover.textContent = "Generating...";
  aiResult.style.display = "block";
  aiResult.textContent = "Generating cover letter...";

  try {
    const res = await fetch(`${BASE_URL}/api/extension/ai`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "cover_letter", description, jobTitle, company }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "AI request failed");
    }

    const data = await res.json();
    aiResult.textContent = data.result;
  } catch (err) {
    aiResult.textContent = err.message || "Failed to generate cover letter";
  } finally {
    btnCover.disabled = false;
    btnCover.textContent = "Cover Letter";
  }
});

/* ============================================================
   RECENT APPLICATIONS - Load from API
   ============================================================ */
async function loadRecentApplications() {
  try {
    const res = await fetch(`${BASE_URL}/api/applications`, {
      credentials: "include",
    });

    if (!res.ok) return;

    const applications = await res.json();

    if (!applications.length) {
      recentJobs.innerHTML = '<div class="empty-state small"><p>No applications yet</p></div>';
      return;
    }

    /* Show the 5 most recent */
    const recent = applications.slice(0, 5);
    recentJobs.innerHTML = recent.map((app) => {
      /* Pick status badge color */
      const statusClass = app.status === "Applied" ? "status-applied"
        : app.status === "Interview" ? "status-interview"
        : "status-saved";

      return `
        <div class="recent-item">
          <div class="recent-item-info">
            <div class="recent-item-title">${escapeHtml(app.jobTitle)}</div>
            <div class="recent-item-company">${escapeHtml(app.company)}</div>
          </div>
          <span class="recent-item-status ${statusClass}">${escapeHtml(app.status)}</span>
        </div>
      `;
    }).join("");
  } catch {
    /* Failed to load — keep the empty state */
  }
}

/* ============================================================
   LOGIN BUTTON - Opens JobPilot in a new tab
   ============================================================ */
btnLogin.addEventListener("click", () => {
  chrome.tabs.create({ url: `${BASE_URL}/login` });
});

/* ---- Dashboard link ---- */
btnDashboard.addEventListener("click", () => {
  chrome.tabs.create({ url: `${BASE_URL}/dashboard` });
});

/* ============================================================
   HELPERS
   ============================================================ */

/* ---- Show Toast Notification ---- */
function showToast(message, type) {
  toast.textContent = message;
  toast.className = `toast ${type}`;
  toast.style.display = "block";

  setTimeout(() => {
    toast.style.display = "none";
  }, 3000);
}

/* ---- Escape HTML to Prevent XSS ---- */
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
