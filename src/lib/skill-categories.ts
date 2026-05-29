/* # Smart skill auto-categorization — maps flat skill lists into meaningful groups */

import type { SkillGroup } from "./portfolio-types";

const CATEGORY_MAP: Record<string, string[]> = {
  "Programming Languages": [
    "python", "javascript", "typescript", "java", "go", "golang", "rust", "c++", "c#",
    "ruby", "php", "swift", "kotlin", "scala", "r", "matlab", "perl", "lua",
    "dart", "elixir", "haskell", "objective-c", "shell", "bash", "powershell",
    "sql", "html", "css", "sass", "less", "solidity",
  ],
  "AI & Machine Learning": [
    "ai", "artificial intelligence", "machine learning", "deep learning", "nlp",
    "natural language processing", "computer vision", "llm", "llms", "large language models",
    "prompt engineering", "langchain", "llamaindex", "rag",
    "retrieval augmented generation", "fine-tuning", "tensorflow", "pytorch",
    "keras", "scikit-learn", "hugging face", "transformers", "openai", "gpt",
    "claude", "gemini", "llama", "llama 3", "stable diffusion", "midjourney",
    "vector databases", "pinecone", "weaviate", "chromadb", "embeddings",
    "neural networks", "reinforcement learning", "generative ai", "gen ai",
    "ai engineering", "mlops", "llmops", "model deployment", "ai agents",
    "chatbots", "conversational ai",
  ],
  "Frontend & Design": [
    "react", "react.js", "reactjs", "next.js", "nextjs", "vue", "vue.js", "vuejs",
    "angular", "svelte", "nuxt", "gatsby", "remix", "astro",
    "tailwind", "tailwindcss", "tailwind css", "bootstrap", "material ui", "mui",
    "chakra ui", "styled-components", "framer motion", "three.js", "webgl",
    "figma", "sketch", "adobe xd", "photoshop", "illustrator", "canva",
    "ui design", "ux design", "ui/ux", "responsive design", "web design",
    "wireframing", "prototyping", "design systems", "accessibility", "a11y",
  ],
  "Backend & Infrastructure": [
    "node.js", "nodejs", "express", "express.js", "fastapi", "django", "flask",
    "spring", "spring boot", "nestjs", "hono", "rails", "ruby on rails",
    "graphql", "rest api", "restful", "api design", "microservices",
    "docker", "kubernetes", "k8s", "aws", "amazon web services", "azure",
    "google cloud", "gcp", "vercel", "netlify", "heroku", "digitalocean",
    "terraform", "ansible", "ci/cd", "jenkins", "github actions",
    "linux", "nginx", "apache", "serverless", "lambda", "cloud computing",
    "devops", "sre", "site reliability", "monitoring", "observability",
  ],
  "Data & Analytics": [
    "sql", "mysql", "postgresql", "postgres", "mongodb", "redis", "elasticsearch",
    "dynamodb", "cassandra", "firebase", "supabase", "prisma",
    "data analysis", "data analytics", "data science", "data engineering",
    "data visualization", "pandas", "numpy", "scipy", "jupyter",
    "tableau", "power bi", "looker", "metabase", "grafana",
    "etl", "data pipeline", "apache spark", "airflow", "kafka",
    "big data", "data warehousing", "snowflake", "databricks", "dbt",
    "excel", "google sheets", "statistics", "a/b testing",
  ],
  "Cybersecurity": [
    "cybersecurity", "security", "penetration testing", "pen testing",
    "ethical hacking", "vulnerability assessment", "soc", "siem",
    "incident response", "threat modeling", "owasp", "encryption",
    "network security", "application security", "cloud security",
    "identity management", "iam", "zero trust", "compliance",
    "gdpr", "soc 2", "iso 27001", "nist", "risk assessment",
    "malware analysis", "forensics", "burp suite", "metasploit",
    "wireshark", "nmap", "kali linux",
  ],
  "Business & Strategy": [
    "strategic management", "business strategy", "business development",
    "project management", "product management", "agile", "scrum", "kanban",
    "lean", "six sigma", "stakeholder management", "change management",
    "digital transformation", "business analysis", "requirements gathering",
    "process improvement", "operations management", "supply chain",
    "consulting", "management consulting", "business operations",
    "market research", "competitive analysis", "swot analysis",
    "business intelligence", "kpi", "okr", "business planning",
    "revenue operations", "go-to-market", "business ethics",
  ],
  "Marketing & Sales": [
    "marketing", "digital marketing", "content marketing", "seo",
    "sem", "google ads", "facebook ads", "social media marketing",
    "email marketing", "marketing automation", "hubspot", "salesforce",
    "crm", "lead generation", "conversion optimization", "cro",
    "brand strategy", "branding", "copywriting", "content strategy",
    "public relations", "pr", "communications", "international marketing",
    "growth hacking", "growth marketing", "affiliate marketing",
    "influencer marketing", "analytics", "google analytics",
    "sales", "b2b sales", "b2c", "account management",
    "business communication", "negotiation", "presentation skills",
  ],
  "Leadership & Management": [
    "leadership", "team leadership", "team management", "people management",
    "executive leadership", "c-suite", "mentoring", "coaching",
    "talent acquisition", "recruitment", "hr", "human resources",
    "performance management", "organizational development",
    "cross-functional", "cross-functional collaboration",
    "conflict resolution", "decision making", "emotional intelligence",
    "communication", "public speaking", "team building",
  ],
};

/* # Normalize skill name for matching — lowercase, trim, remove special chars */
function normalize(s: string): string {
  return s.toLowerCase().trim().replace(/[^\w\s./+#-]/g, "");
}

/* # Find the best category for a skill name */
function categorize(skillName: string): string | null {
  const n = normalize(skillName);
  for (const [category, keywords] of Object.entries(CATEGORY_MAP)) {
    if (keywords.some(k => n === k || n.includes(k) || k.includes(n))) {
      return category;
    }
  }
  return null;
}

/* # Auto-categorize a flat or single-group skill list into meaningful categories.
   If skills are already in multiple groups, returns them unchanged. */
export function autoCategorizeSkills(groups: SkillGroup[]): SkillGroup[] {
  /* # Already categorized — 2+ groups means user or import did the work */
  if (groups.length > 1) return groups;
  if (groups.length === 0) return groups;

  const singleGroup = groups[0];
  /* # Small groups don't need splitting */
  if (singleGroup.skills.length < 8) return groups;

  /* # Categorize each skill */
  const buckets: Record<string, { name: string; proficiency?: number }[]> = {};

  for (const skill of singleGroup.skills) {
    const cat = categorize(skill.name) || "Other";
    if (!buckets[cat]) buckets[cat] = [];
    buckets[cat].push(skill);
  }

  /* # Build sorted groups — largest categories first, "Other" always last */
  const result: SkillGroup[] = Object.entries(buckets)
    .filter(([cat]) => cat !== "Other")
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 6) // max 6 categories for visual balance
    .map(([category, skills]) => ({ category, skills }));

  /* # Merge remaining small categories + "Other" into a final group */
  const overflow = Object.entries(buckets)
    .filter(([cat]) => cat !== "Other")
    .sort((a, b) => b[1].length - a[1].length)
    .slice(6)
    .flatMap(([, skills]) => skills);

  const other = [...(buckets["Other"] || []), ...overflow];
  if (other.length > 0) {
    result.push({ category: "Other", skills: other });
  }

  /* # If categorization didn't help (everything went to "Other"), return original */
  if (result.length <= 1) return groups;

  return result;
}
