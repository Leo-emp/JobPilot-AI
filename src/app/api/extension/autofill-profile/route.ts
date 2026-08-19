/* ============================================================
   EXTENSION AUTOFILL PROFILE — GET /api/extension/autofill-profile
   ============================================================
   Returns structured profile data for the Chrome Extension's
   application form autofill feature. Pulls from:
   - User record (name, email)
   - Default resume (parsed text → structured fields)
   - Portfolio (social links, bio)
   - Candidate preferences (location, desired title)
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { dbRetry } from "@/lib/db-retry";
import { safeHandler } from "@/lib/api-handler";
import { extensionCorsHeaders as corsHeaders } from "@/lib/extension-cors";

/* ---- OPTIONS: Handle CORS preflight ---- */
export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get("origin");
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(origin),
  });
}

/* ---- Parse resume text into structured fields ---- */
function parseResumeFields(text: string) {
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  const fields: Record<string, string> = {};

  /* # Phone: look for phone number patterns */
  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/);
  if (phoneMatch) fields.phone = phoneMatch[0].trim();

  /* # LinkedIn URL */
  const linkedinMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w-]+/i);
  if (linkedinMatch) fields.linkedinUrl = linkedinMatch[0];

  /* # GitHub URL */
  const githubMatch = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[\w-]+/i);
  if (githubMatch) fields.githubUrl = githubMatch[0];

  /* # Website/portfolio URL */
  const websiteMatch = text.match(/(?:https?:\/\/)?(?:www\.)?[\w-]+\.(?:com|io|dev|co|org|net)(?:\/[\w-]*)?/i);
  if (websiteMatch && !websiteMatch[0].includes("linkedin") && !websiteMatch[0].includes("github")) {
    fields.website = websiteMatch[0];
  }

  /* # Location: look for city, state patterns */
  const locationMatch = text.match(/(?:^|\n)\s*([A-Z][a-z]+(?:\s[A-Z][a-z]+)*,\s*[A-Z]{2}(?:\s+\d{5})?)\s*(?:\n|$)/m);
  if (locationMatch) fields.location = locationMatch[1].trim();

  /* # Extract work experience blocks */
  const expHeaders = /(?:experience|employment|work\s*history)/i;
  const eduHeaders = /(?:education|academic|degree|university|college)/i;
  const skillHeaders = /(?:skills|technologies|competencies|proficiencies)/i;

  let currentSection = "";
  const experience: string[] = [];
  const education: string[] = [];
  const skills: string[] = [];

  for (const line of lines) {
    if (expHeaders.test(line) && line.length < 40) { currentSection = "exp"; continue; }
    if (eduHeaders.test(line) && line.length < 40) { currentSection = "edu"; continue; }
    if (skillHeaders.test(line) && line.length < 40) { currentSection = "skills"; continue; }
    if (/^(?:certifications?|projects?|awards?|publications?|references?|summary|objective|about)/i.test(line) && line.length < 40) {
      currentSection = "other";
      continue;
    }

    if (currentSection === "exp") experience.push(line);
    if (currentSection === "edu") education.push(line);
    if (currentSection === "skills") skills.push(line);
  }

  if (experience.length) fields.experience = experience.join("\n");
  if (education.length) fields.education = education.join("\n");
  if (skills.length) fields.skills = skills.join(", ");

  /* # Summary: first long paragraph that isn't a header */
  const summaryLine = lines.find(l => l.length > 80 && !/^[A-Z\s]+$/.test(l));
  if (summaryLine) fields.summary = summaryLine;

  return fields;
}

/* ---- GET: Return autofill profile data ---- */
export const GET = safeHandler(async (req: NextRequest) => {
  const origin = req.headers.get("origin");
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401, headers: corsHeaders(origin) }
    );
  }

  /* # Fetch user + default resume + portfolio + preferences in parallel */
  const [user, portfolio, preferences] = await dbRetry(() =>
    Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          id: true,
          name: true,
          email: true,
          defaultResumeId: true,
          topSkills: true,
          resumes: {
            orderBy: { createdAt: "desc" },
            take: 1,
            select: { content: true },
          },
        },
      }),
      prisma.portfolio.findUnique({
        where: { userId: session.user.id },
        select: { socialLinks: true, bio: true },
      }),
      prisma.candidatePreference.findUnique({
        where: { userId: session.user.id },
        select: { desiredTitle: true, locationPref: true, locations: true, salaryMin: true, salaryCurrency: true },
      }),
    ])
  );

  if (!user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404, headers: corsHeaders(origin) }
    );
  }

  /* # Get resume text (prefer default, fall back to most recent) */
  let resumeText = "";
  if (user.defaultResumeId) {
    const defaultResume = await dbRetry(() =>
      prisma.resume.findUnique({
        where: { id: user.defaultResumeId! },
        select: { content: true },
      })
    );
    if (defaultResume?.content) resumeText = defaultResume.content;
  }
  if (!resumeText && user.resumes.length > 0) {
    resumeText = user.resumes[0].content;
  }

  /* # Parse resume into structured fields */
  const resumeFields = resumeText ? parseResumeFields(resumeText) : {};

  /* # Parse portfolio social links */
  let socialLinks: Record<string, string> = {};
  if (portfolio?.socialLinks) {
    try { socialLinks = JSON.parse(portfolio.socialLinks); } catch {}
  }

  /* # Parse top skills */
  let topSkills: string[] = [];
  if (user.topSkills) {
    try { topSkills = JSON.parse(user.topSkills); } catch {}
  }

  /* # Parse preferred locations */
  let preferredLocations: string[] = [];
  if (preferences?.locations) {
    try { preferredLocations = JSON.parse(preferences.locations); } catch {}
  }

  /* # Build the autofill profile */
  const profile = {
    /* # Core identity */
    fullName: user.name || "",
    email: user.email || "",
    phone: resumeFields.phone || "",

    /* # Location */
    location: resumeFields.location || (preferredLocations.length > 0 ? preferredLocations[0] : ""),

    /* # Links */
    linkedinUrl: socialLinks.linkedin || resumeFields.linkedinUrl || "",
    githubUrl: socialLinks.github || resumeFields.githubUrl || "",
    website: socialLinks.website || resumeFields.website || "",

    /* # Professional */
    currentTitle: preferences?.desiredTitle || "",
    summary: portfolio?.bio || resumeFields.summary || "",
    experience: resumeFields.experience || "",
    education: resumeFields.education || "",
    skills: topSkills.length > 0 ? topSkills.join(", ") : (resumeFields.skills || ""),

    /* # Preferences */
    salaryMin: preferences?.salaryMin || null,
    salaryCurrency: preferences?.salaryCurrency || "USD",
    locationPref: preferences?.locationPref || "remote",

    /* # Whether the profile has enough data for autofill */
    completeness: calculateCompleteness(user, resumeFields),
  };

  return NextResponse.json(
    { profile },
    { headers: corsHeaders(origin) }
  );
});

/* ---- Calculate profile completeness for autofill ---- */
function calculateCompleteness(
  user: { name: string | null; email: string | null },
  resumeFields: Record<string, string>
): number {
  const fields = [
    user.name,
    user.email,
    resumeFields.phone,
    resumeFields.location,
    resumeFields.experience,
    resumeFields.education,
    resumeFields.skills,
  ];
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
}
