/* ============================================================
   CAREER INTELLIGENCE ENGINE
   ============================================================
   Connects data across all features (resumes, jobs, applications,
   AI results) to generate personalized career insights.
   - Skill extraction from resumes and job descriptions
   - Skill gap analysis (what jobs want vs what you have)
   - Application success pattern detection
   - Actionable recommendations
   ============================================================ */

import { prisma } from "./prisma";
import { callGemini } from "./gemini";

/* ---- Types ---- */

export interface SkillGap {
  skill: string;
  jobCount: number;
}

export interface SuccessPattern {
  label: string;
  value: string;
}

export interface CareerInsights {
  topSkills: string[];
  skillGaps: SkillGap[];
  successPatterns: SuccessPattern[];
  recommendations: string[];
  stats: {
    totalApplications: number;
    interviewRate: number;
    avgMatchScore: number;
    jobViewsThisWeek: number;
  };
}

/* ---- Skill Extraction ---- */

/* # Extract skills from resume text using Gemini (lightweight call) */
export async function extractSkillsFromText(text: string): Promise<string[]> {
  const prompt = `Extract all professional skills from this resume text. Return ONLY a JSON array of skill strings, nothing else. Include: technical skills, tools, frameworks, soft skills, certifications. Keep each skill concise (1-3 words). Example: ["Python","React","Project Management","AWS","Agile"]

<resume>
${text.slice(0, 3000)}
</resume>`;

  try {
    const gemini = await callGemini(prompt);
    const match = gemini.text.match(/\[[\s\S]*?\]/);
    if (!match) return [];
    return JSON.parse(match[0]).filter((s: unknown) => typeof s === "string" && s.length > 0);
  } catch {
    return [];
  }
}

/* # Extract required skills from a job description (no AI — keyword-based for speed) */
export function extractSkillsFromJD(description: string): string[] {
  const text = description.toLowerCase();

  /* Common skill keywords to look for */
  const skillPatterns = [
    "python", "javascript", "typescript", "react", "node.js", "nodejs", "next.js", "nextjs",
    "java", "c\\+\\+", "c#", "go", "golang", "rust", "ruby", "php", "swift", "kotlin",
    "sql", "nosql", "mongodb", "postgresql", "mysql", "redis", "elasticsearch",
    "aws", "azure", "gcp", "google cloud", "docker", "kubernetes", "terraform",
    "git", "ci/cd", "jenkins", "github actions",
    "html", "css", "tailwind", "sass", "bootstrap",
    "rest api", "graphql", "grpc", "microservices",
    "agile", "scrum", "kanban", "jira", "confluence",
    "machine learning", "deep learning", "nlp", "computer vision", "tensorflow", "pytorch",
    "data analysis", "data science", "pandas", "numpy", "tableau", "power bi",
    "excel", "powerpoint", "word",
    "project management", "product management", "stakeholder management",
    "communication", "leadership", "teamwork", "problem solving", "critical thinking",
    "figma", "sketch", "adobe", "photoshop", "illustrator",
    "salesforce", "hubspot", "sap", "oracle",
    "linux", "unix", "bash", "powershell",
    "blockchain", "web3", "solidity",
    "flutter", "react native", "android", "ios",
    "vue", "angular", "svelte", "django", "flask", "express", "fastapi",
    "spark", "hadoop", "kafka", "airflow",
    "selenium", "cypress", "jest", "playwright",
    "security", "penetration testing", "soc 2", "gdpr",
  ];

  const found: string[] = [];
  for (const skill of skillPatterns) {
    const regex = new RegExp(`\\b${skill}\\b`, "i");
    if (regex.test(text)) {
      /* Capitalize nicely */
      const original = description.match(new RegExp(`\\b${skill}\\b`, "i"));
      found.push(original ? original[0] : skill);
    }
  }

  return [...new Set(found)];
}

/* ---- Gap Analysis ---- */

/* # Compare user skills against job requirements */
export function computeSkillGaps(
  userSkills: string[],
  jobSkillsMap: Map<string, number>
): SkillGap[] {
  const userLower = new Set(userSkills.map(s => s.toLowerCase()));

  const gaps: SkillGap[] = [];
  for (const [skill, count] of jobSkillsMap.entries()) {
    if (!userLower.has(skill.toLowerCase())) {
      gaps.push({ skill, jobCount: count });
    }
  }

  /* Sort by frequency — most-requested gaps first */
  return gaps.sort((a, b) => b.jobCount - a.jobCount);
}

/* ---- Success Patterns ---- */

/* # Analyze application outcomes for patterns */
export function computeSuccessPatterns(
  applications: { status: string; matchScore?: number | null; company: string }[]
): SuccessPattern[] {
  const patterns: SuccessPattern[] = [];
  const total = applications.length;
  if (total === 0) return patterns;

  /* Interview rate */
  const interviewed = applications.filter(a =>
    a.status === "Interview" || a.status === "Offer"
  ).length;
  const applied = applications.filter(a =>
    a.status !== "Saved"
  ).length;

  if (applied > 0) {
    const rate = Math.round((interviewed / applied) * 100);
    patterns.push({
      label: "Interview Rate",
      value: `${rate}% (${interviewed} of ${applied} applications)`,
    });
  }

  /* High match score → interview correlation */
  const withScores = applications.filter(a => a.matchScore != null);
  if (withScores.length >= 3) {
    const highMatch = withScores.filter(a => (a.matchScore ?? 0) >= 70);
    const highMatchInterviews = highMatch.filter(a =>
      a.status === "Interview" || a.status === "Offer"
    ).length;
    const lowMatch = withScores.filter(a => (a.matchScore ?? 0) < 70);
    const lowMatchInterviews = lowMatch.filter(a =>
      a.status === "Interview" || a.status === "Offer"
    ).length;

    if (highMatch.length > 0 && lowMatch.length > 0) {
      const highRate = Math.round((highMatchInterviews / highMatch.length) * 100);
      const lowRate = Math.round((lowMatchInterviews / lowMatch.length) * 100);
      patterns.push({
        label: "Match Score Impact",
        value: `${highRate}% interview rate for 70+ match vs ${lowRate}% for below 70`,
      });
    }
  }

  /* Most successful companies (got interviews) */
  const interviewCompanies = applications
    .filter(a => a.status === "Interview" || a.status === "Offer")
    .map(a => a.company);

  if (interviewCompanies.length > 0) {
    patterns.push({
      label: "Companies That Responded",
      value: [...new Set(interviewCompanies)].slice(0, 5).join(", "),
    });
  }

  return patterns;
}

/* ---- Recommendations ---- */

/* # Generate actionable recommendations from gaps and patterns */
export function generateRecommendations(
  skillGaps: SkillGap[],
  interviewRate: number,
  avgMatchScore: number,
  totalApplications: number,
): string[] {
  const recs: string[] = [];

  /* Skill gap recommendations */
  if (skillGaps.length > 0) {
    const topGap = skillGaps[0];
    recs.push(
      `Add "${topGap.skill}" to your resume — it appeared in ${topGap.jobCount} of your saved jobs`
    );
  }
  if (skillGaps.length > 2) {
    const skills = skillGaps.slice(0, 3).map(g => g.skill).join(", ");
    recs.push(
      `Your top 3 skill gaps are: ${skills}. Consider highlighting these if you have any experience.`
    );
  }

  /* Match score recommendations */
  if (avgMatchScore > 0 && avgMatchScore < 60) {
    recs.push(
      "Your average match score is below 60%. Try using Resume Rebuild to tailor your resume for each application."
    );
  }

  /* Application volume */
  if (totalApplications < 5) {
    recs.push(
      "You have fewer than 5 tracked applications. Save more jobs to get better career insights."
    );
  }

  /* Interview rate */
  if (interviewRate > 0 && interviewRate < 15 && totalApplications >= 10) {
    recs.push(
      "Your interview rate is below 15%. Try optimizing your resume for each specific job description before applying."
    );
  }

  return recs.slice(0, 4);
}

/* ---- Main: Compute Full Insights ---- */

/* # Pulls all user data and computes career insights */
export async function computeCareerInsights(userId: string): Promise<CareerInsights> {
  /* Fetch all needed data in parallel */
  const [user, resumes, savedJobs, applications, jobViews] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { topSkills: true } }),
    prisma.resume.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 1, select: { content: true } }),
    prisma.savedJob.findMany({ where: { userId }, select: { description: true, requiredSkills: true, matchScore: true } }),
    prisma.application.findMany({
      where: { userId },
      select: { status: true, company: true, job: { select: { matchScore: true } } },
    }),
    prisma.jobView.count({
      where: {
        userId,
        viewedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    }),
  ]);

  /* Get user's skills (from cache or extract fresh) */
  let topSkills: string[] = [];
  if (user?.topSkills) {
    try { topSkills = JSON.parse(user.topSkills); } catch { /* ignore */ }
  }

  /* If no cached skills and resume exists, extract now */
  if (topSkills.length === 0 && resumes.length > 0) {
    topSkills = await extractSkillsFromText(resumes[0].content);
    if (topSkills.length > 0) {
      await prisma.user.update({
        where: { id: userId },
        data: { topSkills: JSON.stringify(topSkills) },
      }).catch(() => {});
    }
  }

  /* Build job skills frequency map */
  const jobSkillsMap = new Map<string, number>();
  for (const job of savedJobs) {
    let skills: string[] = [];
    if (job.requiredSkills) {
      try { skills = JSON.parse(job.requiredSkills); } catch { /* ignore */ }
    }
    if (skills.length === 0 && job.description) {
      skills = extractSkillsFromJD(job.description);
    }
    for (const skill of skills) {
      jobSkillsMap.set(skill, (jobSkillsMap.get(skill) || 0) + 1);
    }
  }

  /* Compute gaps */
  const skillGaps = computeSkillGaps(topSkills, jobSkillsMap);

  /* Compute success patterns */
  const appData = applications.map(a => ({
    status: a.status,
    matchScore: a.job?.matchScore ?? null,
    company: a.company,
  }));
  const successPatterns = computeSuccessPatterns(appData);

  /* Stats */
  const totalApplications = applications.length;
  const applied = applications.filter(a => a.status !== "Saved").length;
  const interviewed = applications.filter(a =>
    a.status === "Interview" || a.status === "Offer"
  ).length;
  const interviewRate = applied > 0 ? Math.round((interviewed / applied) * 100) : 0;

  const matchScores = savedJobs.filter(j => j.matchScore != null).map(j => j.matchScore!);
  const avgMatchScore = matchScores.length > 0
    ? Math.round(matchScores.reduce((a, b) => a + b, 0) / matchScores.length)
    : 0;

  /* Recommendations */
  const recommendations = generateRecommendations(
    skillGaps, interviewRate, avgMatchScore, totalApplications
  );

  return {
    topSkills,
    skillGaps: skillGaps.slice(0, 10),
    successPatterns,
    recommendations,
    stats: {
      totalApplications,
      interviewRate,
      avgMatchScore,
      jobViewsThisWeek: jobViews,
    },
  };
}

/* ---- Refresh Skills Cache ---- */

/* # Re-extract skills from the user's latest resume and update cache */
export async function refreshUserSkills(userId: string): Promise<string[]> {
  const resume = await prisma.resume.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: { content: true },
  });

  if (!resume) return [];

  const skills = await extractSkillsFromText(resume.content);

  if (skills.length > 0) {
    await prisma.user.update({
      where: { id: userId },
      data: { topSkills: JSON.stringify(skills) },
    }).catch(() => {});
  }

  return skills;
}

/* ---- Extract & Store Job Skills ---- */

/* # Extract skills from a job description and save to the SavedJob record */
export async function extractAndStoreJobSkills(jobId: string, description: string): Promise<string[]> {
  const skills = extractSkillsFromJD(description);

  if (skills.length > 0) {
    await prisma.savedJob.update({
      where: { id: jobId },
      data: { requiredSkills: JSON.stringify(skills) },
    }).catch(() => {});
  }

  return skills;
}
