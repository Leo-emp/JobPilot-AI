/* ============================================================
   SHARED PROMPT UTILITIES
   ============================================================
   Constants and helpers used across all prompt modules.
   ============================================================ */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* # Wraps user-provided text in XML-style tags for clear prompt boundaries */
export function wrapUserInput(label: string, text: string): string {
  return `<${label}>\n${text}\n</${label}>`;
}

/* # Score calibration block — anchors AI scoring for consistency */
export const SCORE_CALIBRATION = `
SCORE CALIBRATION (use these anchors for consistency):
90-100: Exceptional — top 5%, ready for FAANG/Fortune 500
75-89: Strong — competitive candidate, minor improvements needed
60-74: Average — meets basics but won't stand out
40-59: Below average — significant gaps to address
Below 40: Needs major rework`;

/* # Shared formatting rules for all resume-output prompts */
export const RESUME_RULES = `CRITICAL RULES:
- Use the candidate's REAL name, contact info, experience, and education — NEVER invent or fabricate
- NEVER use placeholders like [Your Name], [Company], [X years], or [quantify] — use actual data only
- When the resume contains achievements, results, or measurable impact, prioritize those over responsibilities. But if responsibilities are all the candidate has for a role, describe them with strong action verbs. Always prefer: "Led a 12-person engineering team that shipped 3 products ahead of schedule" over "Responsible for managing a team"
- Every bullet must follow the formula: POWER VERB + WHAT you did + HOW/FOR WHOM + MEASURABLE RESULT
- If the resume contains a number or metric, ALWAYS preserve and highlight it
- If no metric exists, write a strong impact-driven bullet WITHOUT fake numbers — never add brackets or placeholders
- Prioritize bullets by impact: lead with the most impressive achievement for each role
- NEVER invent achievements, metrics, skills, or experience the candidate does not have — only reframe and strengthen what actually exists
- NEVER claim the candidate already holds the target job title — state their ACTUAL current role

WRITING QUALITY:
- Every bullet starts with a different power verb — never repeat: Led, Spearheaded, Orchestrated, Engineered, Transformed, Accelerated, Streamlined, Delivered, Implemented, Optimized, Drove, Launched, Executed, Negotiated, Cultivated
- Remove filler words: "responsible for", "helped with", "assisted in", "worked on" — replace with direct action

FORMATTING RULES:
- NEVER use bold (**text**) in Professional Summary or bullet points — all plain text
- NEVER bold skill category names in Core Skills — write them as plain text like "Category Name: Skill, Skill" with NO ** markers
- Use bold for job title lines under Work Experience: **Job Title, Company, Location — MM/YYYY – MM/YYYY**
- For Education entries, keep title as plain text but bold ONLY the dates: Degree, Institution, Location — **MM/YYYY – MM/YYYY**
- For Certifications entries: if the original resume includes dates, format as: Certification Name, Institution — **MM/YYYY – MM/YYYY**. If the original resume has NO dates for a certification, output it as plain text WITHOUT any date
- ALL dates MUST be in numeric MM/YYYY format (e.g., 07/2024). NEVER spell out month names. Use "Current" for ongoing roles.
- Do NOT use ### headings — use **bold** inline text only where specified above
- LinkedIn URL must be a full clickable URL: https://linkedin.com/in/username

STRUCTURE (follow this EXACT order):
1. # Name (from resume)
   Contact info on one line: Location • Phone • Email • https://linkedin.com/in/username
2. ## Professional Summary (3-4 sentences in first person, ALL PLAIN TEXT — no bold. NEVER use the candidate's name. NEVER use third-person pronouns. NEVER start with "I am". START with a strong adjective + their actual role title. Use "I" sparingly mid-sentence only. NEVER claim they already hold the target title.)
3. ## Core Skills
   Bullet points grouped by category:
   - Category Name: Skill, Skill, Skill
   (Exactly 4 categories, 3-4 skills each. Only list skills the candidate ACTUALLY has — never invent. Each category MUST fit on a single line.)
4. ## Work Experience (if the resume has work experience)
   For EACH role: **Job Title, Company, Location — MM/YYYY – MM/YYYY**
   Then EXACTLY 4 bullet points per role. Every bullet MUST be a markdown list item starting with "- " on its own line. NEVER output work experience as plain paragraphs or numbered lists — ALWAYS use bullet points. ALL bullet text must be plain text.
   If NO work experience, replace with ## Projects or ## Relevant Experience using academic/volunteer/freelance projects.
5. ## Education
   For each entry: Degree, Institution, Location — **MM/YYYY – MM/YYYY** (use "Current" for ongoing: **MM/YYYY – Current**)
6. ## Certifications and Trainings (if applicable): Certification Name, Institution — **MM/YYYY – MM/YYYY** (use "Current" for ongoing: **MM/YYYY – Current**)
   IMPORTANT: Only include dates on certifications if the original resume provides them. If a certification has NO date in the original resume, output it WITHOUT any date — NEVER invent or guess dates.
7. ## Languages (each with proficiency level)

Return the COMPLETE resume in clean markdown format.`;

/* # PromptParts separates static instructions (cached by Gemini) from dynamic user data */
export interface PromptParts {
  system?: string;
  prompt: string;
}

/* # System instructions for high-traffic actions — Gemini caches these automatically,
   reducing latency and cost when different users invoke the same action type */
export const RESUME_SYSTEM = `You are a world-class resume writer and ATS expert with 15 years of experience in hiring.\n\n${RESUME_RULES}`;
export const SCORING_SYSTEM = `You are a senior career coach and ATS expert with 15 years of experience in hiring.\n\n${SCORE_CALIBRATION}`;
