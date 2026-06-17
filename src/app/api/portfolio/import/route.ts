/* ============================================================
   PORTFOLIO IMPORT API - Populate sections from resume data
   ============================================================
   POST /api/portfolio/import — parses user's latest resume
   and maps the extracted fields into portfolio sections.
   Returns the sections array for the client to merge.
   ============================================================ */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { PortfolioSection, ExperienceEntry, EducationEntry, SkillGroup, CertificationEntry } from "@/lib/portfolio-types";
import { autoCategorizeSkills } from "@/lib/skill-categories";
import { authHandler } from "@/lib/api-handler";
import { dbRetry } from "@/lib/db-retry";

/* # Parse "Title | Company · Location | Date" format used by resume builder */
function parseExperienceBlock(text: string): ExperienceEntry[] {
  const entries: ExperienceEntry[] = [];
  const blocks = text.split(/\n(?=[A-Z])/);

  for (const block of blocks) {
    const lines = block.trim().split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) continue;

    const titleLine = lines[0] || "";
    const parts = titleLine.split(/[|·]/);
    const title = parts[0]?.trim() || titleLine;
    const company = parts[1]?.trim() || "";
    const location = parts[2]?.trim() || "";

    /* # Extract date from second line if it looks like a date range */
    let startDate = "";
    let endDate = "";
    const dateLine = lines[1] || "";
    const dateMatch = dateLine.match(/(\d{1,2}\/?\d{0,4})\s*[-–]\s*(\w+|\d{1,2}\/?\d{0,4})/);
    if (dateMatch) {
      startDate = dateMatch[1];
      endDate = dateMatch[2];
    }

    /* # Remaining lines are achievements */
    const achievements = lines.slice(dateMatch ? 2 : 1)
      .map((l) => l.replace(/^[-•·]\s*/, "").trim())
      .filter(Boolean);

    entries.push({ title, company, location, startDate, endDate, description: "", achievements });
  }

  return entries;
}

/* # Parse skills from "Category: Skill1, Skill2" format */
function parseSkillGroups(text: string): SkillGroup[] {
  const groups: SkillGroup[] = [];
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  for (const line of lines) {
    const colonIdx = line.indexOf(":");
    if (colonIdx > 0) {
      const category = line.slice(0, colonIdx).trim().replace(/^[-•·]\s*/, "");
      const skills = line.slice(colonIdx + 1).split(",").map((s) => s.trim()).filter(Boolean);
      groups.push({ category, skills: skills.map((name) => ({ name })) });
    } else {
      /* # No category — flat list */
      const skills = line.split(",").map((s) => s.trim().replace(/^[-•·]\s*/, "")).filter(Boolean);
      if (skills.length > 0) {
        groups.push({ category: "Skills", skills: skills.map((name) => ({ name })) });
      }
    }
  }

  return groups;
}

/* # Parse education entries */
function parseEducationBlock(text: string): EducationEntry[] {
  const entries: EducationEntry[] = [];
  const blocks = text.split(/\n(?=[A-Z])/);

  for (const block of blocks) {
    const lines = block.trim().split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) continue;

    const titleLine = lines[0] || "";
    const parts = titleLine.split(/[|·]/);
    const degree = parts[0]?.trim() || titleLine;
    const school = parts[1]?.trim() || "";
    const location = parts[2]?.trim() || "";

    let startDate = "";
    let endDate = "";
    const dateLine = lines[1] || "";
    const dateMatch = dateLine.match(/(\d{4})\s*[-–]\s*(\w+|\d{4})/);
    if (dateMatch) {
      startDate = dateMatch[1];
      endDate = dateMatch[2];
    }

    entries.push({ degree, school, location, startDate, endDate, description: lines.slice(2).join(" ") });
  }

  return entries;
}

/* # Parse certifications */
function parseCertifications(text: string): CertificationEntry[] {
  const entries: CertificationEntry[] = [];
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  for (const line of lines) {
    const clean = line.replace(/^[-•·]\s*/, "");
    const parts = clean.split(/[|·—–]/);
    entries.push({
      name: parts[0]?.trim() || clean,
      issuer: parts[1]?.trim() || "",
      date: parts[2]?.trim() || "",
      link: "",
    });
  }

  return entries;
}

export const POST = authHandler(async (_req, session) => {

  /* # Find user's most recent resume */
  const resume = await dbRetry(() =>
    prisma.resume.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    })
  );

  if (!resume) {
    return NextResponse.json(
      { error: "No resume found. Upload a resume first to import data." },
      { status: 404 }
    );
  }

  const user = await dbRetry(() =>
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true, image: true, topSkills: true },
    })
  );

  /* # Try to parse structured data from AI analysis JSON */
  let parsed: Record<string, string> = {};
  if (resume.analysis) {
    try {
      const analysis = JSON.parse(resume.analysis);
      if (analysis.fields) parsed = analysis.fields;
      else parsed = analysis;
    } catch {
      /* # Analysis isn't structured JSON — fall back to raw content */
    }
  }

  /* # Build sections from whatever data we have */
  const sections: PortfolioSection[] = [];
  const _content = resume.content || "";

  /* # About section */
  sections.push({
    type: "about",
    visible: true,
    bio: parsed.summary || parsed.professionalSummary || "",
    tagline: parsed.jobTitle || parsed.title || "",
    avatarUrl: user?.image || "",
    socialLinks: parsed.linkedin ? { linkedin: parsed.linkedin } : {},
  });

  /* # Experience section */
  const expText = parsed.experience || parsed.workExperience || "";
  if (expText) {
    sections.push({
      type: "experience",
      visible: true,
      entries: parseExperienceBlock(expText),
    });
  } else {
    sections.push({ type: "experience", visible: true, entries: [] });
  }

  /* # Education section */
  const eduText = parsed.education || "";
  if (eduText) {
    sections.push({
      type: "education",
      visible: true,
      entries: parseEducationBlock(eduText),
    });
  } else {
    sections.push({ type: "education", visible: true, entries: [] });
  }

  /* # Skills section — auto-categorize flat skill lists into meaningful groups */
  const skillsText = parsed.skills || parsed.coreSkills || "";
  const topSkills = user?.topSkills ? JSON.parse(user.topSkills) : [];
  if (skillsText) {
    sections.push({
      type: "skills",
      visible: true,
      groups: autoCategorizeSkills(parseSkillGroups(skillsText)),
    });
  } else if (topSkills.length > 0) {
    sections.push({
      type: "skills",
      visible: true,
      groups: autoCategorizeSkills([{ category: "Top Skills", skills: topSkills.map((s: string) => ({ name: s })) }]),
    });
  } else {
    sections.push({ type: "skills", visible: true, groups: [] });
  }

  /* # Projects section (if available) */
  const projectsText = parsed.projects || "";
  if (projectsText) {
    sections.push({
      type: "projects",
      visible: true,
      entries: parseExperienceBlock(projectsText).map((e) => ({
        title: e.title,
        description: e.achievements.join(". "),
        techStack: [],
        liveUrl: "",
        repoUrl: "",
        imageUrl: "",
        videoUrl: "",
      })),
    });
  }

  /* # Certifications section (if available) */
  const certsText = parsed.certifications || parsed.certificationsAndTraining || "";
  if (certsText) {
    sections.push({
      type: "certifications",
      visible: true,
      entries: parseCertifications(certsText),
    });
  }

  /* # Contact section */
  sections.push({
    type: "contact",
    visible: true,
    email: parsed.email || user?.email || "",
    phone: parsed.phone || "",
    location: parsed.location || "",
    calendarLink: "",
    socialLinks: parsed.linkedin ? { linkedin: parsed.linkedin } : {},
  });

  return NextResponse.json({ sections });
});
