/* ============================================================
   KEYWORD MATCHER — Lightweight Resume-to-Job Matching
   ============================================================
   Client-side keyword extraction and scoring utility.
   Used by:
   - Job Search page to show match % badges on results
   - No AI calls, no API calls — runs entirely in the browser
   ============================================================ */

/* # Common English stop words to filter out during extraction.
   These words appear in every job posting and resume, so they
   add noise without signal to the match calculation. */
const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "with", "by", "from", "is", "are", "was", "were", "be", "been",
  "being", "have", "has", "had", "do", "does", "did", "will", "would",
  "could", "should", "may", "might", "shall", "can", "need", "must",
  "this", "that", "these", "those", "it", "its", "i", "me", "my", "we",
  "our", "you", "your", "he", "she", "they", "them", "their", "who",
  "which", "what", "when", "where", "how", "all", "each", "every",
  "both", "few", "more", "most", "other", "some", "such", "no", "not",
  "only", "same", "so", "than", "too", "very", "just", "about", "above",
  "after", "again", "also", "as", "because", "before", "between", "but",
  "during", "if", "into", "new", "now", "over", "per", "then", "through",
  "under", "until", "up", "well", "while", "work", "working", "role",
  "experience", "ability", "strong", "excellent", "including", "using",
  "based", "looking", "join", "team", "company", "position", "required",
  "preferred", "etc", "minimum", "plus", "years", "year", "day", "time",
  "ensure", "within", "across", "provide", "develop", "support", "manage",
  "lead", "create", "build", "make", "use", "take", "get", "set", "help",
  "part", "good", "great", "best", "high", "key", "like", "relevant",
]);

/* # Known technical skills and tools — these get weighted higher
   because they represent specific, measurable competencies that
   ATS systems and recruiters actively search for. */
const TECHNICAL_SKILLS = new Set([
  /* Programming languages */
  "python", "javascript", "typescript", "java", "c++", "c#", "ruby",
  "go", "golang", "rust", "swift", "kotlin", "php", "scala", "r",
  "matlab", "perl", "dart", "lua", "haskell", "elixir",
  /* Web frameworks */
  "react", "angular", "vue", "svelte", "next.js", "nextjs", "nuxt",
  "django", "flask", "fastapi", "express", "nestjs", "rails",
  "spring", "laravel", "asp.net", "blazor",
  /* Data & ML */
  "sql", "nosql", "mongodb", "postgresql", "mysql", "redis", "elasticsearch",
  "kafka", "spark", "hadoop", "airflow", "dbt", "snowflake", "bigquery",
  "tensorflow", "pytorch", "scikit-learn", "pandas", "numpy",
  "machine learning", "deep learning", "nlp", "computer vision",
  "llm", "genai", "langchain", "pinecone", "rag",
  /* Cloud & DevOps */
  "aws", "azure", "gcp", "docker", "kubernetes", "k8s", "terraform",
  "ansible", "jenkins", "ci/cd", "github actions", "gitlab",
  "linux", "bash", "shell", "nginx", "apache",
  /* Tools & platforms */
  "git", "jira", "confluence", "figma", "sketch", "adobe",
  "tableau", "power bi", "looker", "grafana",
  "salesforce", "hubspot", "zendesk", "intercom",
  "stripe", "twilio", "sendgrid",
  /* Methodologies */
  "agile", "scrum", "kanban", "devops", "microservices", "rest",
  "graphql", "api", "oauth", "jwt", "websocket",
  /* Certifications */
  "pmp", "aws certified", "google certified", "azure certified",
  "cissp", "cka", "ckad", "comptia", "itil", "six sigma",
  /* Business & analytics */
  "excel", "powerpoint", "google analytics", "seo", "sem",
  "crm", "erp", "sap", "oracle", "asana", "trello", "notion",
  "data analysis", "data analytics", "business intelligence",
  "project management", "product management", "stakeholder management",
]);

/* # Multi-word skill phrases to detect before splitting into
   single tokens. Without this, "machine learning" would be split
   into "machine" and "learning" and matched individually. */
const MULTI_WORD_SKILLS = [
  "machine learning", "deep learning", "computer vision", "natural language processing",
  "data analysis", "data analytics", "data engineering", "data science",
  "business intelligence", "project management", "product management",
  "stakeholder management", "change management", "risk management",
  "supply chain", "user experience", "user interface",
  "ci/cd", "next.js", "node.js", "asp.net", "power bi",
  "google analytics", "google cloud", "amazon web services",
  "six sigma", "design thinking", "full stack", "front end", "back end",
  "market research", "financial analysis", "financial modeling",
  "strategic planning", "business development", "lead generation",
  "content marketing", "digital marketing", "social media",
  "customer success", "customer service", "quality assurance",
  "test automation", "software engineering", "systems design",
  "aws certified", "google certified", "azure certified",
];

/* # Extract meaningful keywords from a block of text.
   Returns a Set of lowercase keywords found in the text. */
export function extractKeywords(text: string): Set<string> {
  const lower = text.toLowerCase();
  const keywords = new Set<string>();

  /* # First pass: extract multi-word skill phrases before splitting.
     This prevents "machine learning" from becoming two separate
     tokens that match "machine" and "learning" independently. */
  for (const phrase of MULTI_WORD_SKILLS) {
    if (lower.includes(phrase)) {
      keywords.add(phrase);
    }
  }

  /* # Second pass: extract single-word tokens.
     Split on non-alphanumeric chars (except + # . for C++, C#, Next.js) */
  const tokens = lower
    .replace(/[^a-z0-9+#./\s-]/g, " ")
    .split(/\s+/)
    .filter(t => t.length >= 2 && !STOP_WORDS.has(t));

  for (const token of tokens) {
    /* # Skip pure numbers (years, percentages, etc.) */
    if (/^\d+$/.test(token)) continue;
    keywords.add(token);
  }

  return keywords;
}

/* # Calculate match score between a resume and a job description.
   Returns a score 0-100 and lists of matched/missing keywords. */
export interface MatchResult {
  score: number;
  matched: string[];
  missing: string[];
  total: number;
}

export function calculateMatch(resumeText: string, jobDescription: string): MatchResult {
  const resumeKeywords = extractKeywords(resumeText);
  const jobKeywords = extractKeywords(jobDescription);

  /* # Separate job keywords into technical (weighted 2x) and general (1x).
     Technical skills are more important for ATS matching because they
     represent concrete, filterable competencies. */
  let totalWeight = 0;
  let matchedWeight = 0;
  const matched: string[] = [];
  const missing: string[] = [];

  for (const keyword of jobKeywords) {
    const isTechnical = TECHNICAL_SKILLS.has(keyword);
    const weight = isTechnical ? 2 : 1;
    totalWeight += weight;

    if (resumeKeywords.has(keyword)) {
      matchedWeight += weight;
      matched.push(keyword);
    } else {
      missing.push(keyword);
    }
  }

  /* # Avoid division by zero when job description is empty */
  const score = totalWeight > 0 ? Math.round((matchedWeight / totalWeight) * 100) : 0;

  /* # Sort missing keywords: technical skills first (more actionable),
     then alphabetically within each group */
  missing.sort((a, b) => {
    const aTech = TECHNICAL_SKILLS.has(a) ? 0 : 1;
    const bTech = TECHNICAL_SKILLS.has(b) ? 0 : 1;
    if (aTech !== bTech) return aTech - bTech;
    return a.localeCompare(b);
  });

  return {
    score: Math.min(score, 100),
    matched,
    missing: missing.slice(0, 15),
    total: jobKeywords.size,
  };
}

/* # Quick match score for search results — lighter version that
   only returns the percentage, skipping matched/missing lists
   for performance when scoring 50+ jobs at once. */
export function quickMatchScore(resumeKeywords: Set<string>, jobDescription: string): number {
  const jobTokens = jobDescription.toLowerCase()
    .replace(/[^a-z0-9+#./\s-]/g, " ")
    .split(/\s+/)
    .filter(t => t.length >= 2 && !STOP_WORDS.has(t) && !/^\d+$/.test(t));

  /* # Deduplicate job tokens */
  const jobSet = new Set(jobTokens);

  let totalWeight = 0;
  let matchedWeight = 0;

  for (const keyword of jobSet) {
    const isTechnical = TECHNICAL_SKILLS.has(keyword);
    const weight = isTechnical ? 2 : 1;
    totalWeight += weight;

    if (resumeKeywords.has(keyword)) {
      matchedWeight += weight;
    }
  }

  /* # Also check multi-word phrases in the job description */
  const jobLower = jobDescription.toLowerCase();
  for (const phrase of MULTI_WORD_SKILLS) {
    if (jobLower.includes(phrase)) {
      totalWeight += 2;
      if (resumeKeywords.has(phrase)) {
        matchedWeight += 2;
      }
    }
  }

  return totalWeight > 0 ? Math.min(Math.round((matchedWeight / totalWeight) * 100), 100) : 0;
}
