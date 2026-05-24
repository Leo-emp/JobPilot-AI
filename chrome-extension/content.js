/* ============================================================
   JOBPILOT AI - Content Script
   ============================================================
   Runs on 25+ job sites: LinkedIn, Indeed, Glassdoor,
   Greenhouse, Lever, Workday, and many more.
   - Extracts job title, company, and description from the page
   - Shows a floating badge with instant match score
   - One-click save to application tracker
   - Passively tracks viewed jobs for career intelligence
   ============================================================ */

/* ---- Configuration ---- */
const API_URLS = ["https://jobpilotai.co", "http://localhost:3000"];
let BASE_URL = API_URLS[0];
let isLoggedIn = false;

/* ---- Extraction helpers ---- */

/* Try multiple CSS selectors, return first match's text */
function queryText(...selectors) {
  for (const sel of selectors) {
    const el = document.querySelector(sel);
    const text = el?.textContent?.trim();
    if (text) return text;
  }
  return "";
}

/* Extract company name from subdomain (e.g. "acme.wd5.myworkdayjobs.com" → "Acme") */
function companyFromHostname() {
  const host = window.location.hostname;
  const sub = host.split(".")[0].replace(/^careers?-?/, "");
  return sub.charAt(0).toUpperCase() + sub.slice(1);
}

/* Parse JSON-LD structured data for JobPosting schema */
function getJsonLd() {
  const scripts = document.querySelectorAll('script[type="application/ld+json"]');
  for (const script of scripts) {
    try {
      let data = JSON.parse(script.textContent);
      if (Array.isArray(data)) data = data.find(d => d["@type"] === "JobPosting") || data[0];
      if (data?.["@graph"]) data = data["@graph"].find(d => d["@type"] === "JobPosting") || data;
      if (data?.["@type"] === "JobPosting") return data;
    } catch { /* malformed JSON-LD */ }
  }
  return null;
}

/* Get a meta tag's content attribute */
function metaContent(name) {
  const el = document.querySelector(`meta[property="${name}"], meta[name="${name}"]`);
  return el?.getAttribute("content")?.trim() || "";
}

/* Strip HTML tags from a string */
function stripTags(html) {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent?.trim() || "";
}

/* ---- Site-specific extractors (25+ sites) ---- */
const extractors = {
  /* === Major Job Boards === */
  linkedin: {
    test: () => window.location.hostname.includes("linkedin.com"),
    title: () => queryText(
      ".job-details-jobs-unified-top-card__job-title a",
      ".jobs-unified-top-card__job-title a",
      "h1.t-24", "h1"
    ),
    company: () => queryText(
      ".job-details-jobs-unified-top-card__company-name a",
      ".jobs-unified-top-card__company-name a",
      ".jobs-unified-top-card__subtitle-primary-grouping span"
    ),
    description: () => queryText(
      ".jobs-description__content",
      "#job-details",
      ".jobs-box__html-content"
    ),
    source: "linkedin",
  },
  indeed: {
    test: () => window.location.hostname.includes("indeed.com"),
    title: () => queryText(
      ".jobsearch-JobInfoHeader-title",
      "h1[data-testid='jobsearch-JobInfoHeader-title']",
      "h1.icl-u-xs-mb--xs"
    ),
    company: () => queryText(
      "[data-testid='inlineHeader-companyName']",
      ".jobsearch-InlineCompanyRating div:first-child a",
      ".icl-u-lg-mr--sm"
    ),
    description: () => queryText(
      "#jobDescriptionText",
      ".jobsearch-jobDescriptionText"
    ),
    source: "indeed",
  },
  glassdoor: {
    test: () => window.location.hostname.includes("glassdoor.com"),
    title: () => queryText("[data-test='job-title']", ".css-1vg6q84", "h1"),
    company: () => queryText("[data-test='employer-name']", ".css-87uc0g"),
    description: () => queryText(
      ".jobDescriptionContent",
      "[data-test='job-description']",
      ".desc"
    ),
    source: "glassdoor",
  },
  ziprecruiter: {
    test: () => window.location.hostname.includes("ziprecruiter.com"),
    title: () => queryText("h1.job_title", "h1.job-title", "h1"),
    company: () => queryText(
      ".t-company-name a",
      ".hiring_company_text",
      "[data-testid='job-company']"
    ),
    description: () => queryText(
      ".job_description",
      ".jobDescriptionSection",
      "[data-testid='job-description']"
    ),
    source: "ziprecruiter",
  },
  monster: {
    test: () => window.location.hostname.includes("monster.com"),
    title: () => queryText("h1.JobViewTitle", "h1[name='viewjobtitle']", "h1"),
    company: () => queryText(
      ".headerstyle__JobViewHeaderCompany a",
      "[data-testid='company-name']",
      ".company-name"
    ),
    description: () => queryText(
      ".descriptionstyles__DescriptionContainer",
      "[name='viewjobbody']",
      ".job-description"
    ),
    source: "monster",
  },
  dice: {
    test: () => window.location.hostname.includes("dice.com"),
    title: () => queryText("h1[data-cy='jobTitle']", "h1.jobTitle", "h1"),
    company: () => queryText(
      "[data-cy='companyNameLink']",
      "a[data-cy='companyNameLink']"
    ),
    description: () => queryText(
      "[data-testid='jobDescriptionHtml']",
      "#jobDescriptionHtml",
      ".job-description"
    ),
    source: "dice",
  },
  simplyhired: {
    test: () => window.location.hostname.includes("simplyhired.com"),
    title: () => queryText(
      "h1[data-testid='viewJobTitle']",
      "h2.viewjob-jobTitle", "h1"
    ),
    company: () => queryText(
      "[data-testid='viewJobCompanyName']",
      ".viewjob-labelWithIcon span"
    ),
    description: () => queryText(
      ".viewjob-jobDescription",
      "[data-testid='viewJobBody']"
    ),
    source: "simplyhired",
  },
  careerbuilder: {
    test: () => window.location.hostname.includes("careerbuilder.com"),
    title: () => queryText("h1.data-results-title", "h2.job-title", "h1"),
    company: () => queryText(".data-details .company span", ".data-details a"),
    description: () => queryText(
      ".jdp-description-content",
      ".data-details .description"
    ),
    source: "careerbuilder",
  },
  flexjobs: {
    test: () => window.location.hostname.includes("flexjobs.com"),
    title: () => queryText("h1#JobTitle", "h1.job-title", "h1"),
    company: () => queryText(".company-name a", ".job-company a"),
    description: () => queryText(
      "#job-description",
      ".job-description",
      ".dsp-description"
    ),
    source: "flexjobs",
  },
  themuse: {
    test: () => window.location.hostname.includes("themuse.com"),
    title: () => queryText("h1[class*='JobTitle']", "h1.job-title", "h1"),
    company: () => queryText("a[class*='CompanyName']", ".company-name a"),
    description: () => queryText(
      ".job-post-description",
      "[class*='JobDescription']",
      ".job-description"
    ),
    source: "themuse",
  },
  builtin: {
    test: () => window.location.hostname.includes("builtin.com"),
    title: () => queryText("h1.field-title", "h1"),
    company: () => queryText(".company-title a", ".field-company a", "h2 a"),
    description: () => queryText(".job-description", ".field-description"),
    source: "builtin",
  },
  wellfound: {
    test: () => window.location.hostname.includes("wellfound.com"),
    title: () => queryText("h1.listing-title", "h1"),
    company: () => queryText(
      "h2.company-name a",
      "a[data-test='company-name']",
      "[class*='CompanyName']"
    ),
    description: () => queryText(
      "[data-test='job-description']",
      ".description",
      ".job-description"
    ),
    source: "wellfound",
  },
  seek: {
    test: () => window.location.hostname.includes("seek.com"),
    title: () => queryText(
      "h1[data-automation='job-detail-title']",
      "h1"
    ),
    company: () => queryText(
      "[data-automation='advertiser-name']",
      ".job-header .company"
    ),
    description: () => queryText(
      "[data-automation='jobAdDetails']",
      ".job-detail-body"
    ),
    source: "seek",
  },
  reed: {
    test: () => window.location.hostname.includes("reed.co.uk"),
    title: () => queryText("h1[itemprop='title']", "h1.job-title", "h1"),
    company: () => queryText("[itemprop='name']", ".company-name a"),
    description: () => queryText(
      "[itemprop='description']",
      ".job-description",
      ".description"
    ),
    source: "reed",
  },
  totaljobs: {
    test: () => window.location.hostname.includes("totaljobs.com"),
    title: () => queryText("h1.job-title", "h1"),
    company: () => queryText(".company-link", ".recruiter-name"),
    description: () => queryText(".job-description", ".description"),
    source: "totaljobs",
  },

  /* === ATS Platforms === */
  greenhouse: {
    test: () => window.location.hostname.includes("greenhouse.io"),
    title: () => queryText("h1.app-title", ".opening h1", "h1"),
    company: () => queryText(".company-name", ".logo span") || metaContent("og:site_name"),
    description: () => queryText("#content", ".body .content"),
    source: "greenhouse",
  },
  lever: {
    test: () => window.location.hostname.includes("lever.co"),
    title: () => queryText(".posting-headline h2", "h2.posting-title", "h2"),
    company: () => queryText(
      ".main-header-logo a",
      ".posting-headline .display-name"
    ) || metaContent("og:site_name"),
    description: () => queryText(
      ".posting-page .content",
      ".section-wrapper .posting-requirements",
      ".section-wrapper"
    ),
    source: "lever",
  },
  workday: {
    test: () => window.location.hostname.includes("myworkdayjobs.com"),
    title: () => queryText(
      "h2[data-automation-id='jobPostingHeader']",
      "h1[data-automation-id='jobPostingHeader']",
      "h1"
    ),
    company: () => companyFromHostname(),
    description: () => queryText(
      "[data-automation-id='jobPostingDescription']",
      ".css-1uoojr6",
      ".job-description"
    ),
    source: "workday",
  },
  smartrecruiters: {
    test: () => window.location.hostname.includes("smartrecruiters.com"),
    title: () => queryText("h1.job-title", "h1"),
    company: () => queryText(".company-name", ".topbar-logo") || metaContent("og:site_name"),
    description: () => queryText(".job-description", ".sectionBody"),
    source: "smartrecruiters",
  },
  ashby: {
    test: () => window.location.hostname.includes("ashbyhq.com"),
    title: () => queryText(
      "h1.ashby-job-posting-brief-title",
      "h1[class*='JobPostingTitle']",
      "h1"
    ),
    company: () => queryText(
      ".ashby-job-posting-brief-company-name",
      "[class*='CompanyName']"
    ) || metaContent("og:site_name"),
    description: () => queryText(
      ".ashby-job-posting-description",
      "[class*='JobPostingDescription']",
      ".job-description"
    ),
    source: "ashby",
  },
  workable: {
    test: () => window.location.hostname.includes("workable.com"),
    title: () => queryText("h1[data-ui='job-title']", "h1"),
    company: () => queryText(
      "[data-ui='company-name']",
      ".company-name"
    ) || metaContent("og:site_name"),
    description: () => queryText(
      "[data-ui='job-description']",
      ".job-description"
    ),
    source: "workable",
  },
  icims: {
    test: () => window.location.hostname.includes("icims.com"),
    title: () => queryText(".iCIMS_Header h1", "h1.iCIMS_Header", "h1"),
    company: () => queryText(".iCIMS_CompanyName") || companyFromHostname(),
    description: () => queryText(
      ".iCIMS_JobContent",
      ".iCIMS_InfoMsg_Job",
      "#job-description"
    ),
    source: "icims",
  },
  bamboohr: {
    test: () => window.location.hostname.includes("bamboohr.com"),
    title: () => queryText("h2.ResearchHeader__title", "h1"),
    company: () => queryText(".ResearchHeader__companyName") || companyFromHostname(),
    description: () => queryText(".BambooRichText", ".JobPost__description"),
    source: "bamboohr",
  },
  jobvite: {
    test: () => window.location.hostname.includes("jobvite.com"),
    title: () => queryText("h2.jv-header", ".jv-job-detail-name", "h1"),
    company: () => queryText(".jv-company-name", ".company-name") || metaContent("og:site_name"),
    description: () => queryText(
      ".jv-job-detail-description",
      ".job-description"
    ),
    source: "jobvite",
  },
};

/* ---- Generic fallback — uses JSON-LD structured data and common patterns ---- */
const genericExtractor = {
  title: () => {
    const ld = getJsonLd();
    if (ld?.title) return stripTags(ld.title);
    return queryText(
      "[itemprop='title']", "[itemprop='name']",
      "h1.job-title", "h1.job_title", "h1"
    ) || metaContent("og:title");
  },
  company: () => {
    const ld = getJsonLd();
    const org = ld?.hiringOrganization;
    if (org?.name) return stripTags(org.name);
    return queryText(
      "[itemprop='hiringOrganization'] [itemprop='name']",
      ".company-name", ".company_name"
    ) || metaContent("og:site_name");
  },
  description: () => {
    const ld = getJsonLd();
    if (ld?.description) return stripTags(ld.description);
    return queryText(
      "[itemprop='description']",
      ".job-description", ".job_description",
      "#job-description", "#jobDescriptionText"
    ) || metaContent("og:description");
  },
  source: "other",
};

/* ---- Detect which site we're on ---- */
function getExtractor() {
  for (const ext of Object.values(extractors)) {
    if (ext.test()) return ext;
  }
  /* Fall back to generic JSON-LD / meta-tag extraction */
  return genericExtractor;
}

/* ---- Extract job data from current page ---- */
function extractJobData() {
  const ext = getExtractor();

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

/* ---- Extract skills/keywords from a job description ---- */
function extractSkills(description) {
  if (!description) return [];

  /* Common technical and professional skills to look for */
  const skillPatterns = [
    "JavaScript", "TypeScript", "Python", "Java", "C\\+\\+", "C#", "Go", "Rust", "Ruby", "PHP", "Swift", "Kotlin",
    "React", "Angular", "Vue", "Next\\.js", "Node\\.js", "Express", "Django", "Flask", "Spring",
    "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform", "CI/CD",
    "SQL", "PostgreSQL", "MySQL", "MongoDB", "Redis", "GraphQL", "REST",
    "Git", "Linux", "Agile", "Scrum", "Jira",
    "Machine Learning", "Deep Learning", "NLP", "Computer Vision", "Data Science",
    "Figma", "Sketch", "Adobe", "UI/UX",
    "Salesforce", "SAP", "Tableau", "Power BI", "Excel",
    "Communication", "Leadership", "Problem.Solving", "Teamwork", "Project Management",
  ];

  const text = description;
  const found = [];
  for (const pattern of skillPatterns) {
    const regex = new RegExp(`\\b${pattern}\\b`, "i");
    if (regex.test(text)) {
      /* Use the pattern name cleaned up as the display text */
      const display = pattern.replace(/\\\+/g, "+").replace(/\\\./g, ".").replace(/\\./, " ");
      if (!found.includes(display)) found.push(display);
    }
  }
  return found.slice(0, 12);
}

/* ---- Store extracted job data for the popup to read ---- */
function storeJobDataForPopup(jobData, skills) {
  try {
    chrome.storage.local.set({
      jp_current_job: {
        title: jobData.title,
        company: jobData.company,
        description: jobData.description,
        url: jobData.url,
        source: jobData.source,
        skills: skills,
        timestamp: Date.now(),
      },
    });
  } catch { /* storage unavailable */ }
}

/* ---- Build and inject the floating badge ---- */
async function injectBadge(jobData) {
  /* Don't inject twice */
  if (document.getElementById("jobpilot-badge")) return;

  /* Extract skills from description */
  const skills = extractSkills(jobData.description);

  /* Store job data so the popup can auto-fill */
  storeJobDataForPopup(jobData, skills);

  /* Check if user previously minimized the badge */
  let minimized = false;
  try {
    const stored = await chrome.storage.local.get("jp_badge_minimized");
    minimized = stored.jp_badge_minimized === true;
  } catch { /* storage unavailable — show full */ }

  /* Build skills HTML for the panel */
  const skillsHtml = skills.length > 0
    ? `<div class="jp-badge-skills">
        <div class="jp-badge-skills-title">Skills Detected</div>
        <div class="jp-badge-skills-tags">${skills.map(s => `<span class="jp-badge-skill-tag">${escapeHtml(s)}</span>`).join("")}</div>
      </div>`
    : "";

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
      ${skillsHtml}
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

/* SPA sites — watch for URL changes and re-init */
const spaHosts = ["linkedin.com", "wellfound.com", "builtin.com", "glassdoor.com", "dice.com"];
if (spaHosts.some(h => window.location.hostname.includes(h))) {
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
