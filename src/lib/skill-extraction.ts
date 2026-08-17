/* ============================================================
   SKILL EXTRACTION — Extract structured data from resumes/JDs
   ============================================================
   Uses Gemini to extract skills, experience level, and other
   structured data from unstructured text (resumes, job descriptions).
   Results are cached per content hash to avoid redundant API calls.
   ============================================================ */

import { callGemini } from "@/lib/gemini";
import { cacheGet, cacheSet } from "@/lib/redis";
import crypto from "crypto";

/* # Extracted resume profile */
export interface ExtractedResume {
  skills: string[];
  experienceYears: number | null;
  seniorityLevel: string | null;
  industries: string[];
  jobTitles: string[];
  education: string | null;
}

/* # Extracted job description */
export interface ExtractedJD {
  requiredSkills: string[];
  niceToHaveSkills: string[];
  experienceMin: number | null;
  experienceMax: number | null;
  industry: string | null;
  seniorityLevel: string | null;
}

/* # Cache TTL: 7 days for extraction results */
const EXTRACTION_CACHE_TTL = 60 * 60 * 24 * 7;

/* # Hash content for cache key */
function hashContent(text: string): string {
  return crypto.createHash("sha256").update(text).digest("hex").substring(0, 16);
}

/* # System prompt for resume extraction */
const RESUME_SYSTEM_PROMPT = `You are a structured data extractor. Given a resume or CV text, extract the following into JSON:
- skills: array of technical and professional skills mentioned
- experienceYears: estimated total years of professional experience (number or null)
- seniorityLevel: one of "entry", "mid", "senior", "lead", "executive" or null
- industries: array of industries the person has worked in
- jobTitles: array of job titles held
- education: highest education level or null

Return ONLY valid JSON. No markdown, no explanation.`;

/* # System prompt for JD extraction */
const JD_SYSTEM_PROMPT = `You are a structured data extractor. Given a job description, extract the following into JSON:
- requiredSkills: array of must-have skills
- niceToHaveSkills: array of preferred/bonus skills
- experienceMin: minimum years required (number or null)
- experienceMax: maximum years (number or null)
- industry: the primary industry (string or null)
- seniorityLevel: one of "entry", "mid", "senior", "lead", "executive" or null

Return ONLY valid JSON. No markdown, no explanation.`;

/* # Extract skills and metadata from resume text */
export async function extractFromResume(resumeText: string): Promise<ExtractedResume | null> {
  if (!resumeText || resumeText.length < 50) return null;

  /* # Check cache first */
  const cacheKey = `extract:resume:${hashContent(resumeText)}`;
  const cached = await cacheGet<ExtractedResume>(cacheKey);
  if (cached) return cached;

  try {
    const result = await callGemini(
      `Extract structured data from this resume:\n\n${resumeText.substring(0, 8000)}`,
      0.1,
      RESUME_SYSTEM_PROMPT
    );

    /* # Parse the JSON response, handling markdown code blocks */
    let jsonText = result.text.trim();
    if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/^```json?\n?/, "").replace(/\n?```$/, "");
    }

    const extracted = JSON.parse(jsonText) as ExtractedResume;

    /* # Validate shape */
    if (!Array.isArray(extracted.skills)) extracted.skills = [];
    if (!Array.isArray(extracted.industries)) extracted.industries = [];
    if (!Array.isArray(extracted.jobTitles)) extracted.jobTitles = [];

    /* # Cache the result */
    await cacheSet(cacheKey, extracted, EXTRACTION_CACHE_TTL);

    return extracted;
  } catch {
    return null;
  }
}

/* # Extract structured requirements from a job description */
export async function extractFromJD(jdText: string): Promise<ExtractedJD | null> {
  if (!jdText || jdText.length < 30) return null;

  /* # Check cache first */
  const cacheKey = `extract:jd:${hashContent(jdText)}`;
  const cached = await cacheGet<ExtractedJD>(cacheKey);
  if (cached) return cached;

  try {
    const result = await callGemini(
      `Extract structured data from this job description:\n\n${jdText.substring(0, 8000)}`,
      0.1,
      JD_SYSTEM_PROMPT
    );

    let jsonText = result.text.trim();
    if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/^```json?\n?/, "").replace(/\n?```$/, "");
    }

    const extracted = JSON.parse(jsonText) as ExtractedJD;

    if (!Array.isArray(extracted.requiredSkills)) extracted.requiredSkills = [];
    if (!Array.isArray(extracted.niceToHaveSkills)) extracted.niceToHaveSkills = [];

    await cacheSet(cacheKey, extracted, EXTRACTION_CACHE_TTL);

    return extracted;
  } catch {
    return null;
  }
}
