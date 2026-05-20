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
  "https://jobpilot-website.vercel.app",
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
   INITIALIZATION - Check login status on popup open
   ============================================================ */
document.addEventListener("DOMContentLoaded", async () => {
  /* Auto-fill the URL field with the current tab's URL */
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.url && !tab.url.startsWith("chrome://")) {
      jobUrlInput.value = tab.url;
    }
  } catch {
    /* Can't access tab URL — that's fine */
  }

  /* Enable/disable save button based on required fields */
  jobTitleInput.addEventListener("input", toggleSaveButton);
  companyInput.addEventListener("input", toggleSaveButton);

  /* Show AI tools section when description is entered */
  descriptionInput.addEventListener("input", () => {
    aiSection.style.display = descriptionInput.value.trim() ? "block" : "none";
  });

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
