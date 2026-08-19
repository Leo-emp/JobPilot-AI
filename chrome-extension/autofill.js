/* ============================================================
   JOBPILOT AI — Application Form Autofill Engine (v2)
   ============================================================
   Simplify-level autofill: handles inputs, textareas, selects,
   radio buttons, checkboxes, file uploads, date fields, and
   ATS-specific form structures. Stores a full profile locally
   in chrome.storage and syncs with the JobPilot API.

   Supported ATS: Greenhouse, Lever, Workday, SmartRecruiters,
   Ashby, Workable, iCIMS, BambooHR, Jobvite, Taleo, and any
   generic career page with standard form fields.
   ============================================================ */

/* ---- Configuration ---- */
const AF_API_URLS = ["https://jobpilotai.co", "http://localhost:3000"];
let AF_BASE = AF_API_URLS[0];

/* ============================================================
   1. PROFILE STORAGE — Full candidate profile in chrome.storage
   ============================================================ */

const DEFAULT_PROFILE = {
  /* # Identity */
  firstName: "", lastName: "", fullName: "",
  email: "", phone: "", phoneCountryCode: "+1",

  /* # Location */
  address: "", city: "", state: "", zip: "", country: "United States",

  /* # Links */
  linkedinUrl: "", githubUrl: "", website: "", portfolioUrl: "",

  /* # Professional */
  currentTitle: "", currentCompany: "",
  summary: "", skills: "",
  yearsOfExperience: "",

  /* # Education */
  school: "", degree: "", fieldOfStudy: "",
  graduationMonth: "", graduationYear: "", gpa: "",

  /* # Work history (most recent) */
  prevCompany1: "", prevTitle1: "", prevStart1: "", prevEnd1: "",
  prevCompany2: "", prevTitle2: "", prevStart2: "", prevEnd2: "",

  /* # Legal / Work auth */
  workAuthorized: "Yes",
  sponsorshipNeeded: "No",
  eighteenOrOlder: "Yes",

  /* # Salary */
  desiredSalary: "", salaryCurrency: "USD",

  /* # EEO defaults (user can change; "Decline" is safest) */
  gender: "Decline to self-identify",
  race: "Decline to self-identify",
  veteranStatus: "I am not a protected veteran",
  disabilityStatus: "I do not want to answer",

  /* # Preferences */
  startDate: "Immediately",
  willingToRelocate: "Yes",
  remotePreference: "Remote",

  /* # Resume file (stored as data URL for file upload) */
  resumeDataUrl: "",
  resumeFileName: "",

  /* # Sync metadata */
  lastSynced: 0,
  profileComplete: false,
};

/* # Load profile from chrome.storage */
async function loadProfile() {
  try {
    const result = await chrome.storage.local.get("jp_autofill_profile");
    if (result.jp_autofill_profile) {
      return { ...DEFAULT_PROFILE, ...result.jp_autofill_profile };
    }
  } catch {}
  return { ...DEFAULT_PROFILE };
}

/* # Save profile to chrome.storage */
async function saveProfile(profile) {
  try {
    await chrome.storage.local.set({ jp_autofill_profile: profile });
  } catch {}
}

/* # Sync profile from the JobPilot API (one-time pull) */
async function syncProfileFromAPI(profile) {
  /* # Only sync if stale (older than 10 minutes) or empty */
  if (profile.email && Date.now() - profile.lastSynced < 600000) return profile;

  for (const url of AF_API_URLS) {
    try {
      const res = await fetch(`${url}/api/extension/autofill-profile`, { credentials: "include" });
      if (!res.ok) continue;
      const data = await res.json();
      if (!data.profile) continue;
      AF_BASE = url;

      const api = data.profile;
      const names = (api.fullName || "").trim().split(/\s+/);

      /* # Only overwrite empty fields — user edits take priority */
      const merged = { ...profile };
      if (!merged.firstName && names[0]) merged.firstName = names[0];
      if (!merged.lastName && names.length > 1) merged.lastName = names.slice(1).join(" ");
      if (!merged.fullName) merged.fullName = api.fullName || "";
      if (!merged.email) merged.email = api.email || "";
      if (!merged.phone) merged.phone = api.phone || "";
      if (!merged.city && api.location) {
        const parts = api.location.split(",").map(s => s.trim());
        merged.city = parts[0] || "";
        if (parts[1]) merged.state = parts[1];
      }
      if (!merged.linkedinUrl) merged.linkedinUrl = api.linkedinUrl || "";
      if (!merged.githubUrl) merged.githubUrl = api.githubUrl || "";
      if (!merged.website) merged.website = api.website || "";
      if (!merged.currentTitle) merged.currentTitle = api.currentTitle || "";
      if (!merged.summary) merged.summary = api.summary || "";
      if (!merged.skills) merged.skills = api.skills || "";

      /* # Parse education from resume text */
      if (!merged.school && api.education) {
        const eduLines = api.education.split("\n");
        for (const line of eduLines) {
          if (/university|college|institute|school/i.test(line)) {
            const parts = line.split("|").map(s => s.trim());
            if (parts.length >= 2) {
              merged.degree = parts[0] || merged.degree;
              merged.school = parts[1] || merged.school;
              if (parts[2]) {
                const yearMatch = parts[2].match(/\d{4}/);
                if (yearMatch) merged.graduationYear = yearMatch[0];
              }
            } else {
              merged.school = line.trim();
            }
            break;
          }
        }
      }

      /* # Calculate years of experience from resume dates */
      if (!merged.yearsOfExperience && api.experience) {
        const years = calculateYearsOfExperience(api.experience);
        if (years > 0) merged.yearsOfExperience = String(years);
      }

      /* # Parse work history entries */
      if (!merged.prevCompany1 && api.experience) {
        const entries = parseWorkEntries(api.experience);
        if (entries[0]) {
          merged.prevCompany1 = entries[0].company;
          merged.prevTitle1 = entries[0].title;
          merged.prevStart1 = entries[0].start;
          merged.prevEnd1 = entries[0].end;
        }
        if (entries[1]) {
          merged.prevCompany2 = entries[1].company;
          merged.prevTitle2 = entries[1].title;
          merged.prevStart2 = entries[1].start;
          merged.prevEnd2 = entries[1].end;
        }
      }

      merged.lastSynced = Date.now();
      await saveProfile(merged);
      return merged;
    } catch { /* try next URL */ }
  }
  return profile;
}

/* # Parse work experience text into structured entries */
function parseWorkEntries(text) {
  const entries = [];
  const lines = text.split("\n").filter(l => l.trim());
  let current = null;
  for (const line of lines) {
    /* # Look for "Title | Company | Date" pattern */
    if (line.includes("|")) {
      if (current) entries.push(current);
      const parts = line.split("|").map(s => s.trim());
      current = { title: parts[0] || "", company: parts[1] || "", start: "", end: "" };
      if (parts[2]) {
        const dates = parts[2].split(/[-–—]/).map(s => s.trim());
        current.start = dates[0] || "";
        current.end = dates[1] || "Present";
      }
    }
  }
  if (current) entries.push(current);
  return entries;
}

/* # Calculate total years of experience from date ranges */
function calculateYearsOfExperience(text) {
  const yearPattern = /(\d{4})\s*[-–—]\s*(\d{4}|present|current)/gi;
  let totalMonths = 0;
  let match;
  while ((match = yearPattern.exec(text)) !== null) {
    const start = parseInt(match[1]);
    const end = /present|current/i.test(match[2]) ? new Date().getFullYear() : parseInt(match[2]);
    if (start && end && end >= start) {
      totalMonths += (end - start) * 12;
    }
  }
  return Math.round(totalMonths / 12);
}

/* ============================================================
   2. FIELD IDENTIFICATION — Comprehensive keyword matching
   ============================================================ */

/* # Get all text clues for identifying a form field */
function getClues(field) {
  const parts = [];

  /* # Direct attributes */
  const attrs = ["name", "id", "placeholder", "aria-label", "data-automation-id",
    "autocomplete", "data-testid", "data-qa", "data-field-name"];
  for (const attr of attrs) {
    const val = field.getAttribute(attr);
    if (val) parts.push(val);
  }

  /* # Label[for] */
  if (field.id) {
    const label = document.querySelector('label[for="' + CSS.escape(field.id) + '"]');
    if (label) parts.push(label.textContent.trim());
  }

  /* # Parent <label> */
  const parentLabel = field.closest("label");
  if (parentLabel) {
    const text = Array.from(parentLabel.childNodes)
      .filter(n => n.nodeType === 3)
      .map(n => n.textContent.trim())
      .join(" ");
    if (text) parts.push(text);
  }

  /* # Nearby label-like elements (walk up 3 levels) */
  let el = field.parentElement;
  for (let i = 0; i < 3 && el; i++) {
    const label = el.querySelector("label, .label, [class*='label'], [class*='Label'], legend");
    if (label && !label.contains(field)) {
      const text = label.textContent.trim();
      if (text && text.length < 120) parts.push(text);
    }
    el = el.parentElement;
  }

  /* # Preceding sibling text */
  const prev = field.previousElementSibling;
  if (prev && prev.textContent.trim().length < 100) {
    parts.push(prev.textContent.trim());
  }

  return parts.join(" ~~ ").toLowerCase();
}

/* # Master field identification — returns a profile key or null */
function identify(clues) {
  /* # ATS-specific data-automation-id (Workday) */
  if (/legalNameSection_firstName|given.?name.*input/i.test(clues)) return "firstName";
  if (/legalNameSection_lastName|family.?name.*input/i.test(clues)) return "lastName";

  /* # Greenhouse IDs */
  if (/\bfirst_name\b/.test(clues)) return "firstName";
  if (/\blast_name\b/.test(clues)) return "lastName";

  /* # Ordered from most specific to least to avoid false positives */
  const rules = [
    /* Name — must come before generic "name" */
    ["firstName", /first\s*name|given\s*name|prenom|fname|first$/i],
    ["lastName", /last\s*name|sur\s*name|family\s*name|lname|last$/i],
    ["fullName", /full\s*name|your\s*name|candidate\s*name|legal\s*name|applicant.*name/i],
    ["fullName", /^name$|^name ~~/i],

    /* Contact */
    ["email", /e-?mail|email\s*address/i],
    ["phone", /phone|telephone|mobile|cell|contact\s*number/i],

    /* Address */
    ["address", /street\s*address|address\s*line|mailing\s*address|home\s*address/i],
    ["city", /\bcity\b|municipality/i],
    ["state", /\bstate\b|province|region/i],
    ["zip", /\bzip\b|postal\s*code|post\s*code/i],
    ["country", /\bcountry\b|nation/i],

    /* Location (combined city/state field) */
    ["location", /\blocation\b|current\s*location|where.*based|city.*state/i],

    /* Links */
    ["linkedinUrl", /linkedin/i],
    ["githubUrl", /github/i],
    ["website", /website|portfolio|personal\s*site|homepage|blog\s*url/i],

    /* Professional */
    ["currentTitle", /current\s*title|job\s*title|current\s*role|current\s*position|headline/i],
    ["currentCompany", /current\s*company|current\s*employer|employer\s*name|company\s*name/i],
    ["yearsOfExperience", /years?\s*(of)?\s*experience|total\s*experience|experience.*years/i],

    /* Education */
    ["school", /school|university|college|institution|alma\s*mater/i],
    ["degree", /degree|level\s*of\s*education|highest.*education|education\s*level/i],
    ["fieldOfStudy", /field\s*of\s*study|major|concentration|discipline|area\s*of\s*study/i],
    ["gpa", /\bgpa\b|grade\s*point|cumulative\s*gpa/i],
    ["graduationYear", /graduation\s*(year|date)|year\s*of\s*graduation|grad\s*year|when.*graduat/i],

    /* Salary */
    ["desiredSalary", /salary|compensation|expected\s*pay|desired\s*pay|pay\s*expectation/i],

    /* Skills */
    ["skills", /\bskills\b|technical\s*skills|competencies|expertise|proficiencies/i],

    /* Summary / Cover letter */
    ["summary", /cover\s*letter|personal\s*statement|tell\s*us\s*about|why.*interested|why.*apply|why.*want|additional\s*info|anything\s*else|about\s*you|summary|introduction/i],

    /* Work experience (text areas) */
    ["prevTitle1", /previous.*title|most\s*recent.*title|last.*title/i],
    ["prevCompany1", /previous.*company|most\s*recent.*company|last.*employer/i],

    /* Dates */
    ["startDate", /start\s*date|availab|when.*start|earliest\s*start|notice\s*period/i],

    /* Legal */
    ["workAuthorized", /authorized.*work|legally.*authorized|eligible.*work|right\s*to\s*work|work\s*authorization|permission.*work/i],
    ["sponsorshipNeeded", /sponsorship|visa\s*sponsor|require.*sponsor|need.*sponsor|immigration.*sponsor/i],
    ["eighteenOrOlder", /18.*older|eighteen|legal\s*age|age\s*requirement/i],
    ["willingToRelocate", /relocat|willing.*move|open.*relocation/i],

    /* EEO / Diversity (these get "Decline" values) */
    ["gender", /\bgender\b|sex\b|gender\s*identity/i],
    ["race", /\brace\b|ethnic|racial|demographic/i],
    ["veteranStatus", /veteran|military\s*service|protected\s*veteran/i],
    ["disabilityStatus", /disabilit|handicap|impairment/i],
  ];

  for (const [key, pattern] of rules) {
    if (pattern.test(clues)) return key;
  }
  return null;
}

/* ============================================================
   3. FORM FILLING — Handle every input type
   ============================================================ */

/* # Set value on input/textarea, firing React/Angular/Vue events */
function fillText(field, value) {
  if (!value || !field) return false;
  if (field.disabled || field.readOnly) return false;
  if (field.value && field.value.trim()) return false; /* # Don't overwrite existing values */

  /* # React overrides the native value setter */
  const proto = field.tagName === "TEXTAREA"
    ? HTMLTextAreaElement.prototype
    : HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(proto, "value")?.set;

  if (setter) setter.call(field, value);
  else field.value = value;

  field.dispatchEvent(new Event("input", { bubbles: true }));
  field.dispatchEvent(new Event("change", { bubbles: true }));
  field.dispatchEvent(new Event("blur", { bubbles: true }));
  return true;
}

/* # Select a dropdown option via fuzzy text matching */
function fillSelect(select, value) {
  if (!value || !select || select.disabled) return false;

  const options = Array.from(select.options);
  const lower = value.toLowerCase().trim();

  /* # Try exact, then startsWith, then includes, then fuzzy */
  const match = options.find(o => o.text.trim().toLowerCase() === lower)
    || options.find(o => o.value.toLowerCase() === lower)
    || options.find(o => o.text.trim().toLowerCase().startsWith(lower))
    || options.find(o => lower.startsWith(o.text.trim().toLowerCase()) && o.text.trim().length > 2)
    || options.find(o => o.text.trim().toLowerCase().includes(lower) && lower.length > 2)
    || options.find(o => lower.includes(o.text.trim().toLowerCase()) && o.text.trim().length > 3);

  if (match && match.value !== select.value && match.value !== "") {
    select.value = match.value;
    select.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  }
  return false;
}

/* # Handle radio buttons — select the matching option */
function fillRadio(radios, value) {
  if (!value || !radios.length) return false;
  const lower = value.toLowerCase().trim();

  for (const radio of radios) {
    if (radio.disabled || radio.checked) continue;
    const clues = getClues(radio);
    const radioLabel = radio.parentElement?.textContent?.trim().toLowerCase() || "";
    const radioValue = (radio.value || "").toLowerCase();

    /* # Match "Yes"/"No" type answers */
    if (lower === "yes" && (/\byes\b/.test(radioLabel) || radioValue === "yes" || radioValue === "true" || radioValue === "1")) {
      radio.click();
      radio.dispatchEvent(new Event("change", { bubbles: true }));
      return true;
    }
    if (lower === "no" && (/\bno\b/.test(radioLabel) || radioValue === "no" || radioValue === "false" || radioValue === "0")) {
      radio.click();
      radio.dispatchEvent(new Event("change", { bubbles: true }));
      return true;
    }

    /* # Match by text content */
    if (radioLabel.includes(lower) || lower.includes(radioLabel)) {
      radio.click();
      radio.dispatchEvent(new Event("change", { bubbles: true }));
      return true;
    }
  }
  return false;
}

/* # Handle checkboxes — check agreement/terms boxes */
function fillCheckbox(checkbox, value) {
  if (!checkbox || checkbox.disabled || checkbox.checked) return false;
  const clues = getClues(checkbox);

  /* # Auto-check "I agree" / terms / privacy / consent boxes */
  if (/agree|consent|acknowledge|accept|confirm|certif/i.test(clues)) {
    checkbox.click();
    checkbox.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  }
  return false;
}

/* # Handle file inputs — attach resume */
function fillFileInput(input, profile) {
  if (!input || input.disabled) return false;
  if (!profile.resumeDataUrl || !profile.resumeFileName) return false;

  const clues = getClues(input);
  /* # Only fill resume/CV file inputs */
  if (!/resume|cv|curriculum/i.test(clues)) return false;

  try {
    /* # Convert data URL back to File object */
    const parts = profile.resumeDataUrl.split(",");
    const mime = parts[0].match(/:(.*?);/)?.[1] || "application/pdf";
    const binary = atob(parts[1]);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const file = new File([bytes], profile.resumeFileName, { type: mime });

    /* # Use DataTransfer to set files on the input */
    const dt = new DataTransfer();
    dt.items.add(file);
    input.files = dt.files;
    input.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  } catch {
    return false;
  }
}

/* # Handle date inputs */
function fillDate(input, value) {
  if (!value || !input || input.disabled) return false;
  if (input.value) return false;

  /* # Try to parse common date formats */
  let dateStr = value;

  /* # If just a year, use Jan 1 */
  if (/^\d{4}$/.test(value)) dateStr = value + "-01-01";
  /* # If "Month Year" format */
  else if (/^[A-Za-z]+\s+\d{4}$/.test(value)) {
    const d = new Date(value + " 1");
    if (!isNaN(d.getTime())) dateStr = d.toISOString().split("T")[0];
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
    if (setter) setter.call(input, dateStr);
    else input.value = dateStr;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  }
  return false;
}

/* ============================================================
   4. ATS-SPECIFIC HANDLERS — Known form structures
   ============================================================ */

const ATS_HANDLERS = {
  /* # Greenhouse: well-structured with known IDs */
  greenhouse: {
    test: () => location.hostname.includes("greenhouse.io"),
    fill: (profile) => {
      let count = 0;
      const map = {
        "#first_name": profile.firstName,
        "#last_name": profile.lastName,
        "#email": profile.email,
        "#phone": profile.phone,
        "#location": profile.city ? (profile.city + (profile.state ? ", " + profile.state : "")) : "",
        "#job_application_location": profile.city ? (profile.city + (profile.state ? ", " + profile.state : "")) : "",
      };
      for (const [sel, val] of Object.entries(map)) {
        const el = document.querySelector(sel);
        if (el && fillText(el, val)) count++;
      }
      /* # LinkedIn URL field (Greenhouse uses custom question fields) */
      const allInputs = document.querySelectorAll("input[type='text'], input[type='url']");
      for (const inp of allInputs) {
        const clues = getClues(inp);
        if (/linkedin/i.test(clues) && fillText(inp, profile.linkedinUrl)) count++;
        if (/github/i.test(clues) && fillText(inp, profile.githubUrl)) count++;
        if (/website|portfolio/i.test(clues) && fillText(inp, profile.website)) count++;
      }
      /* # Resume upload */
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput && fillFileInput(fileInput, profile)) count++;
      return count;
    },
  },

  /* # Lever: classes and structure-based */
  lever: {
    test: () => location.hostname.includes("lever.co"),
    fill: (profile) => {
      let count = 0;
      const nameField = document.querySelector('input[name="name"]');
      if (nameField && fillText(nameField, profile.fullName || (profile.firstName + " " + profile.lastName).trim())) count++;
      const emailField = document.querySelector('input[name="email"], input[type="email"]');
      if (emailField && fillText(emailField, profile.email)) count++;
      const phoneField = document.querySelector('input[name="phone"], input[type="tel"]');
      if (phoneField && fillText(phoneField, profile.phone)) count++;
      /* # Lever custom questions */
      const allInputs = document.querySelectorAll('.application-question input, .application-question textarea');
      for (const inp of allInputs) {
        const clues = getClues(inp);
        const key = identify(clues);
        if (key && profile[key] && fillText(inp, profile[key])) count++;
      }
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput && fillFileInput(fileInput, profile)) count++;
      return count;
    },
  },

  /* # Workday: data-automation-id attributes */
  workday: {
    test: () => location.hostname.includes("myworkdayjobs.com"),
    fill: (profile) => {
      let count = 0;
      const map = {
        '[data-automation-id="legalNameSection_firstName"]': profile.firstName,
        '[data-automation-id="legalNameSection_lastName"]': profile.lastName,
        '[data-automation-id="email"]': profile.email,
        '[data-automation-id="phone-number"]': profile.phone,
        '[data-automation-id="addressSection_city"]': profile.city,
        '[data-automation-id="addressSection_postalCode"]': profile.zip,
      };
      for (const [sel, val] of Object.entries(map)) {
        const el = document.querySelector(sel);
        if (el && fillText(el, val)) count++;
      }
      /* # Workday dropdowns */
      const countrySelect = document.querySelector('[data-automation-id="countryDropdown"], [data-automation-id="addressSection_countryRegion"]');
      if (countrySelect && countrySelect.tagName === "SELECT") {
        if (fillSelect(countrySelect, profile.country)) count++;
      }
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput && fillFileInput(fileInput, profile)) count++;
      return count;
    },
  },

  /* # Ashby */
  ashby: {
    test: () => location.hostname.includes("ashbyhq.com"),
    fill: (profile) => {
      let count = 0;
      /* # Ashby uses semantic input names */
      const inputs = document.querySelectorAll('input, textarea, select');
      for (const inp of inputs) {
        const clues = getClues(inp);
        const key = identify(clues);
        if (!key) continue;
        const val = resolveValue(key, profile);
        if (!val) continue;
        if (inp.tagName === "SELECT") { if (fillSelect(inp, val)) count++; }
        else if (inp.type === "date") { if (fillDate(inp, val)) count++; }
        else { if (fillText(inp, val)) count++; }
      }
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput && fillFileInput(fileInput, profile)) count++;
      return count;
    },
  },
};

/* # Resolve a profile key to its display value */
function resolveValue(key, profile) {
  /* # Composed fields */
  if (key === "fullName") return profile.fullName || (profile.firstName + " " + profile.lastName).trim();
  if (key === "location") {
    if (profile.city && profile.state) return profile.city + ", " + profile.state;
    return profile.city || profile.location || "";
  }
  return profile[key] || "";
}

/* ============================================================
   5. GENERIC AUTOFILL — Works on any form
   ============================================================ */

function genericFill(profile) {
  let filled = 0;
  let skipped = 0;

  /* # Process text inputs and textareas */
  const textFields = document.querySelectorAll(
    'input[type="text"], input[type="email"], input[type="tel"], input[type="url"], ' +
    'input[type="number"], input[type="search"], input:not([type]), textarea'
  );

  for (const field of textFields) {
    if (field.offsetParent === null && !field.closest('[role="dialog"]')) continue;
    if (field.closest('[style*="display: none"], [style*="display:none"], [hidden]')) continue;

    const clues = getClues(field);
    if (!clues) continue;

    const key = identify(clues);
    if (!key) continue;

    const value = resolveValue(key, profile);
    if (!value) continue;
    if (fillText(field, value)) {
      filled++;
      highlightFilled(field);
    }
  }

  /* # Process date inputs */
  const dateFields = document.querySelectorAll('input[type="date"], input[type="month"]');
  for (const field of dateFields) {
    if (field.offsetParent === null) continue;
    const clues = getClues(field);
    const key = identify(clues);
    if (!key) continue;
    const value = resolveValue(key, profile);
    if (value && fillDate(field, value)) {
      filled++;
      highlightFilled(field);
    }
  }

  /* # Process select dropdowns */
  const selects = document.querySelectorAll("select");
  for (const select of selects) {
    if (select.offsetParent === null) continue;
    const clues = getClues(select);
    if (!clues) continue;

    const key = identify(clues);
    if (!key) continue;

    const value = resolveValue(key, profile);
    if (value && fillSelect(select, value)) {
      filled++;
      highlightFilled(select);
    }
  }

  /* # Process radio button groups */
  const radioGroups = new Map();
  const radios = document.querySelectorAll('input[type="radio"]');
  for (const radio of radios) {
    const name = radio.name || radio.id;
    if (!name) continue;
    if (!radioGroups.has(name)) radioGroups.set(name, []);
    radioGroups.get(name).push(radio);
  }

  for (const [groupName, groupRadios] of radioGroups) {
    /* # Find the question for this radio group */
    const container = groupRadios[0].closest("fieldset, .field, [class*='question'], [class*='Question'], [role='radiogroup']")
      || groupRadios[0].parentElement?.parentElement;
    if (!container) continue;
    const questionText = container.querySelector("label, legend, [class*='label'], [class*='title']")?.textContent?.trim().toLowerCase() || "";
    const clues = questionText + " ~~ " + groupName.toLowerCase();

    const key = identify(clues);
    if (!key) continue;

    const value = resolveValue(key, profile);
    if (value && fillRadio(groupRadios, value)) {
      filled++;
    }
  }

  /* # Process checkboxes (terms/consent only) */
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  for (const cb of checkboxes) {
    if (cb.offsetParent === null) continue;
    if (fillCheckbox(cb)) filled++;
  }

  /* # Process file inputs (resume upload) */
  const fileInputs = document.querySelectorAll('input[type="file"]');
  for (const fi of fileInputs) {
    if (fillFileInput(fi, profile)) {
      filled++;
      highlightFilled(fi.parentElement || fi);
    }
  }

  return { filled, skipped };
}

/* # Add subtle highlight to filled fields */
function highlightFilled(field) {
  field.style.boxShadow = "0 0 0 2px rgba(99, 102, 241, 0.35)";
  field.style.transition = "box-shadow 0.3s ease";
  setTimeout(() => { field.style.boxShadow = ""; }, 4000);
}

/* ============================================================
   6. MAIN AUTOFILL ORCHESTRATOR
   ============================================================ */

async function runAutofill() {
  /* # Load and sync profile */
  let profile = await loadProfile();
  profile = await syncProfileFromAPI(profile);

  if (!profile.email && !profile.firstName) {
    return { success: false, error: "No profile data. Log in and upload a resume at jobpilotai.co" };
  }

  /* # Ensure fullName is set */
  if (!profile.fullName && profile.firstName) {
    profile.fullName = (profile.firstName + " " + profile.lastName).trim();
  }

  let totalFilled = 0;

  /* # Try ATS-specific handler first */
  for (const handler of Object.values(ATS_HANDLERS)) {
    if (handler.test()) {
      totalFilled += handler.fill(profile);
      break;
    }
  }

  /* # Then run generic fill for anything the ATS handler missed */
  const generic = genericFill(profile);
  totalFilled += generic.filled;

  return {
    success: true,
    filled: totalFilled,
    skipped: generic.skipped,
    profileComplete: Boolean(profile.firstName && profile.lastName && profile.email && profile.phone),
    completeness: calculateCompleteness(profile),
  };
}

/* # Profile completeness score */
function calculateCompleteness(p) {
  const fields = [
    p.firstName, p.lastName, p.email, p.phone,
    p.city || p.location, p.linkedinUrl,
    p.currentTitle, p.school, p.degree,
    p.skills, p.summary, p.workAuthorized,
    p.resumeDataUrl,
  ];
  return Math.round((fields.filter(Boolean).length / fields.length) * 100);
}

/* ============================================================
   7. APPLICATION PAGE DETECTION
   ============================================================ */

function isApplicationPage() {
  const path = location.pathname.toLowerCase();
  const host = location.hostname;

  /* # URL-based detection */
  if (/\/appl(y|ication)/i.test(path)) return true;
  if (/\/careers?\/.*\/(apply|submit)/i.test(path)) return true;

  /* # ATS platforms are almost always application pages */
  if (host.includes("greenhouse.io") && document.querySelector("#application, #app_apply, form#application")) return true;
  if (host.includes("lever.co") && document.querySelector(".application-form, .posting-apply")) return true;
  if (host.includes("myworkdayjobs.com")) return true;
  if (host.includes("smartrecruiters.com") && document.querySelector(".application-step, .st-apply")) return true;
  if (host.includes("ashbyhq.com") && (document.querySelector('[class*="ApplicationForm"]') || /application/i.test(path))) return true;
  if (host.includes("workable.com") && document.querySelector('[data-ui="application"]')) return true;
  if (host.includes("icims.com")) return true;
  if (host.includes("bamboohr.com") && document.querySelector(".ApplicationForm, .fab-Form")) return true;
  if (host.includes("jobvite.com") && document.querySelector(".jv-application")) return true;

  /* # Generic: detect forms with enough job-application-like fields */
  const forms = document.querySelectorAll("form");
  for (const form of forms) {
    const inputs = form.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]), textarea, select');
    if (inputs.length >= 3) {
      const allClues = Array.from(inputs).map(getClues).join(" ");
      const hasEmail = /email/i.test(allClues);
      const hasName = /name/i.test(allClues);
      const hasPhone = /phone|tel/i.test(allClues);
      const hasResume = /resume|cv|upload/i.test(allClues);
      if (hasEmail && (hasName || hasPhone || hasResume)) return true;
    }
  }

  return false;
}

/* ============================================================
   8. UI — Floating autofill button + result popup
   ============================================================ */

function injectAutofillUI() {
  if (document.getElementById("jp-autofill-btn")) return;

  /* # Inject styles */
  const style = document.createElement("style");
  style.id = "jp-autofill-styles";
  style.textContent = `
    #jp-autofill-btn {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 2147483647;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    #jp-af-trigger {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%);
      color: white;
      border: none;
      border-radius: 50px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(99, 102, 241, 0.45), 0 0 0 0 rgba(99, 102, 241, 0.3);
      transition: all 0.2s ease;
      font-family: inherit;
      animation: jp-af-pulse 2s ease-in-out 3;
    }
    @keyframes jp-af-pulse {
      0%, 100% { box-shadow: 0 4px 16px rgba(99, 102, 241, 0.45), 0 0 0 0 rgba(99, 102, 241, 0.3); }
      50% { box-shadow: 0 4px 16px rgba(99, 102, 241, 0.45), 0 0 0 8px rgba(99, 102, 241, 0); }
    }
    #jp-af-trigger:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 24px rgba(99, 102, 241, 0.55);
    }
    #jp-af-trigger:active { transform: translateY(0); }
    #jp-af-trigger:disabled { opacity: 0.7; cursor: wait; transform: none; }
    #jp-af-trigger .af-spin {
      width: 16px; height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: jp-af-spin 0.6s linear infinite;
      flex-shrink: 0;
    }
    @keyframes jp-af-spin { to { transform: rotate(360deg); } }
    #jp-af-result {
      position: absolute;
      bottom: 56px;
      right: 0;
      background: #fff;
      border-radius: 14px;
      padding: 16px 20px;
      box-shadow: 0 8px 30px rgba(0,0,0,0.18);
      font-size: 13px;
      min-width: 240px;
      color: #1a1f36;
      line-height: 1.6;
      display: none;
    }
    #jp-af-result .af-title { font-weight: 700; font-size: 14px; margin-bottom: 4px; }
    #jp-af-result .af-ok { color: #16a34a; }
    #jp-af-result .af-err { color: #dc2626; }
    #jp-af-result .af-note { color: #6b7194; font-size: 12px; margin-top: 4px; }
    #jp-af-result .af-bar { height: 4px; border-radius: 2px; background: #e5e7eb; margin-top: 8px; }
    #jp-af-result .af-bar-fill { height: 100%; border-radius: 2px; background: #6366f1; transition: width 0.4s ease; }
    #jp-af-dismiss {
      position: absolute; top: 8px; right: 10px;
      background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 16px; padding: 2px 6px;
    }
    @media (prefers-color-scheme: dark) {
      #jp-af-result { background: #1e293b; color: #e2e8f0; }
      #jp-af-result .af-note { color: #94a3b8; }
      #jp-af-result .af-bar { background: #334155; }
    }
  `;
  document.head.appendChild(style);

  /* # Build button */
  const container = document.createElement("div");
  container.id = "jp-autofill-btn";

  const trigger = document.createElement("button");
  trigger.id = "jp-af-trigger";
  const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  icon.setAttribute("width", "18"); icon.setAttribute("height", "18");
  icon.setAttribute("viewBox", "0 0 24 24"); icon.setAttribute("fill", "none");
  icon.setAttribute("stroke", "currentColor"); icon.setAttribute("stroke-width", "2");
  icon.setAttribute("stroke-linecap", "round"); icon.setAttribute("stroke-linejoin", "round");
  const p1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
  p1.setAttribute("d", "M12 20h9");
  const p2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
  p2.setAttribute("d", "M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z");
  icon.appendChild(p1); icon.appendChild(p2);
  const label = document.createElement("span");
  label.textContent = "Autofill with JobPilot";
  trigger.appendChild(icon);
  trigger.appendChild(label);

  const result = document.createElement("div");
  result.id = "jp-af-result";

  container.appendChild(trigger);
  container.appendChild(result);
  document.body.appendChild(container);

  /* # Click handler */
  trigger.addEventListener("click", async () => {
    trigger.disabled = true;
    trigger.textContent = "";
    const spinner = document.createElement("span");
    spinner.className = "af-spin";
    const fillingLabel = document.createElement("span");
    fillingLabel.textContent = "Filling application...";
    trigger.appendChild(spinner);
    trigger.appendChild(fillingLabel);

    const res = await runAutofill();

    result.style.display = "block";
    result.textContent = "";

    const dismiss = document.createElement("button");
    dismiss.id = "jp-af-dismiss";
    dismiss.textContent = "×";
    dismiss.addEventListener("click", () => { result.style.display = "none"; });
    result.appendChild(dismiss);

    if (res.success) {
      /* # Success state */
      trigger.textContent = "";
      const checkIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      checkIcon.setAttribute("width", "18"); checkIcon.setAttribute("height", "18");
      checkIcon.setAttribute("viewBox", "0 0 24 24"); checkIcon.setAttribute("fill", "none");
      checkIcon.setAttribute("stroke", "currentColor"); checkIcon.setAttribute("stroke-width", "2.5");
      checkIcon.setAttribute("stroke-linecap", "round"); checkIcon.setAttribute("stroke-linejoin", "round");
      const cp = document.createElementNS("http://www.w3.org/2000/svg", "path");
      cp.setAttribute("d", "M20 6L9 17l-5-5");
      checkIcon.appendChild(cp);
      const doneLabel = document.createElement("span");
      doneLabel.textContent = res.filled + " fields filled";
      trigger.appendChild(checkIcon);
      trigger.appendChild(doneLabel);
      trigger.style.background = "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)";
      trigger.style.boxShadow = "0 4px 16px rgba(22, 163, 74, 0.4)";

      const title = document.createElement("div");
      title.className = "af-title af-ok";
      title.textContent = "Application filled";
      result.appendChild(title);

      const detail = document.createElement("div");
      detail.className = "af-note";
      detail.textContent = res.filled + " field" + (res.filled !== 1 ? "s" : "") + " auto-filled from your JobPilot profile.";
      result.appendChild(detail);

      if (!res.profileComplete) {
        const tip = document.createElement("div");
        tip.className = "af-note";
        tip.style.marginTop = "8px";
        tip.textContent = "Tip: Complete your profile in the extension popup for better coverage.";
        result.appendChild(tip);
      }

      const barWrap = document.createElement("div");
      barWrap.className = "af-bar";
      const barFill = document.createElement("div");
      barFill.className = "af-bar-fill";
      barFill.style.width = res.completeness + "%";
      barWrap.appendChild(barFill);
      result.appendChild(barWrap);

      const barLabel = document.createElement("div");
      barLabel.className = "af-note";
      barLabel.textContent = "Profile completeness: " + res.completeness + "%";
      result.appendChild(barLabel);

      const review = document.createElement("div");
      review.className = "af-note";
      review.style.marginTop = "8px";
      review.style.fontWeight = "600";
      review.style.color = "#d97706";
      review.textContent = "Always review before submitting.";
      result.appendChild(review);
    } else {
      /* # Error state */
      trigger.textContent = "";
      const errLabel = document.createElement("span");
      errLabel.textContent = "Setup needed";
      trigger.appendChild(errLabel);
      trigger.style.background = "linear-gradient(135deg, #dc2626 0%, #f87171 100%)";

      const title = document.createElement("div");
      title.className = "af-title af-err";
      title.textContent = "Autofill unavailable";
      result.appendChild(title);

      const detail = document.createElement("div");
      detail.className = "af-note";
      detail.textContent = res.error;
      result.appendChild(detail);
    }

    /* # Auto-dismiss result after 8 seconds */
    setTimeout(() => { result.style.display = "none"; }, 8000);

    /* # Reset button after 4 seconds */
    setTimeout(() => {
      trigger.disabled = false;
      trigger.textContent = "";
      trigger.style.background = "linear-gradient(135deg, #6366f1 0%, #818cf8 100%)";
      trigger.style.boxShadow = "0 4px 16px rgba(99, 102, 241, 0.45)";
      const ri = icon.cloneNode(true);
      const rl = document.createElement("span");
      rl.textContent = "Autofill with JobPilot";
      trigger.appendChild(ri);
      trigger.appendChild(rl);
    }, 4000);
  });
}

/* ============================================================
   9. INITIALIZATION
   ============================================================ */

async function initAutofill() {
  /* # Wait for page to render */
  await new Promise(r => setTimeout(r, 1500));

  if (!isApplicationPage()) {
    /* # Try once more for slow SPAs */
    await new Promise(r => setTimeout(r, 3000));
    if (!isApplicationPage()) return;
  }

  /* # Check login */
  let loggedIn = false;
  for (const url of AF_API_URLS) {
    try {
      const res = await fetch(`${url}/api/extension/status`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) { AF_BASE = url; loggedIn = true; break; }
      }
    } catch {}
  }
  if (!loggedIn) return;

  injectAutofillUI();
  console.log("[JobPilot] Autofill v2 ready");
}

/* # Run */
initAutofill();

/* # SPA navigation watcher */
let _afLastUrl = location.href;
const _afObs = new MutationObserver(() => {
  if (location.href !== _afLastUrl) {
    _afLastUrl = location.href;
    const btn = document.getElementById("jp-autofill-btn");
    if (btn) btn.remove();
    const styles = document.getElementById("jp-autofill-styles");
    if (styles) styles.remove();
    setTimeout(initAutofill, 2000);
  }
});
if (document.body) {
  _afObs.observe(document.body, { childList: true, subtree: true });
}
