/* ============================================================
   OUTREACH EMAIL — AI-generated recruiting emails
   ============================================================
   Generates personalized outreach emails for external candidates
   using Gemini. Source-specific prompts reference the candidate's
   actual work:
   - GitHub → reference repos and contributions
   - Stack Overflow → reference answers and reputation
   - Portfolio → reference projects

   All emails include:
   - Personal hook (specific to their profile)
   - Role pitch (2-3 sentences)
   - Company pitch (1-2 sentences)
   - CTA: join link or reply
   - CAN-SPAM/GDPR opt-out link (mandatory)
   ============================================================ */

import { callGemini } from "@/lib/gemini";

/* # The generated email content */
export interface OutreachEmail {
  subject: string;
  body: string;
}

/* # Candidate profile data for email personalization */
export interface OutreachCandidate {
  name: string;
  source: string;                     // github, stackoverflow, portfolio
  profileUrl: string;
  skills: string[];
  experience: Record<string, unknown>;
  rawData: Record<string, unknown>;
}

/* # Role data for the email pitch */
export interface OutreachRole {
  title: string;
  description: string;
  skills: string[];
  locationType: string;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;
}

/* # Employer data for the company pitch */
export interface OutreachEmployer {
  name: string;
  industry: string | null;
  size: string | null;
  description: string | null;
}

/* # Generate a personalized outreach email */
export async function generateOutreachEmail(
  candidate: OutreachCandidate,
  role: OutreachRole,
  employer: OutreachEmployer,
  inviteUrl: string,
  optOutUrl: string,
  followUpNumber: number = 0,
): Promise<OutreachEmail> {
  /* # Build the source-specific personal hook prompt */
  const hookPrompt = buildHookPrompt(candidate);

  const isFollowUp = followUpNumber > 0;
  const followUpContext = isFollowUp
    ? `\n\nThis is follow-up #${followUpNumber}. The candidate did not respond to the initial email. Be brief and reference the previous outreach. Do not repeat the full pitch.`
    : "";

  const prompt = `Write a ${isFollowUp ? "follow-up " : ""}recruiting outreach email for a candidate.

CANDIDATE:
- Name: ${candidate.name}
- Source: ${candidate.source}
- Profile: ${candidate.profileUrl}
${hookPrompt}

ROLE:
- Title: ${role.title}
- Required skills: ${role.skills.join(", ")}
- Location: ${role.locationType}
${role.salaryMin ? `- Salary range: ${role.salaryCurrency} ${role.salaryMin.toLocaleString()}${role.salaryMax ? ` - ${role.salaryMax.toLocaleString()}` : "+"}` : ""}

COMPANY:
- Name: ${employer.name}
${employer.industry ? `- Industry: ${employer.industry}` : ""}
${employer.size ? `- Size: ${employer.size}` : ""}
${employer.description ? `- About: ${employer.description.substring(0, 200)}` : ""}
${followUpContext}

RULES:
1. Subject line: "${employer.name} is looking for a ${role.title} -- your [specific thing] caught our attention" (customize the specific thing)
2. Opening: personal hook referencing their actual work (NOT generic)
3. Role pitch: 2-3 sentences on why this role is interesting
4. Company pitch: 1-2 sentences
5. CTA: "Interested? Join JobPilot to connect: ${inviteUrl}" or "Reply to this email"
6. Closing: professional, warm, not pushy
7. Tone: professional but human. No corporate jargon. No exclamation marks.
8. Length: under 200 words total
9. No emoji anywhere in the email
10. Do NOT include the opt-out link in the body (it will be appended automatically)

Return a JSON object: {"subject": "...", "body": "..."}
The body should use plain text with line breaks (\\n), not HTML.`;

  try {
    const result = await callGemini(prompt, 0.6);
    const cleaned = result.text
      .replace(/```json?\n?/g, "")
      .replace(/```/g, "")
      .trim();
    const parsed = JSON.parse(cleaned);

    if (!parsed.subject || !parsed.body) {
      throw new Error("Missing subject or body in AI response");
    }

    /* # Append the mandatory opt-out footer */
    const fullBody = `${parsed.body}\n\n---\nYou received this because your public profile matched a role on JobPilot AI.\nTo stop receiving these emails: ${optOutUrl}`;

    return {
      subject: parsed.subject,
      body: fullBody,
    };
  } catch (err) {
    console.error("[outreach-email] AI generation failed:", err);

    /* # Fallback: generic but functional email */
    return {
      subject: `${employer.name} is looking for a ${role.title}`,
      body: `Hi ${candidate.name},\n\nYour profile on ${candidate.source} caught our attention. We're looking for a ${role.title} at ${employer.name}, and your skills in ${candidate.skills.slice(0, 3).join(", ")} are a strong match.\n\nInterested? Join JobPilot to connect: ${inviteUrl}\n\nOr simply reply to this email.\n\nBest,\nThe ${employer.name} team via JobPilot AI\n\n---\nYou received this because your public profile matched a role on JobPilot AI.\nTo stop receiving these emails: ${optOutUrl}`,
    };
  }
}

/* # Build source-specific hook context for the AI prompt */
function buildHookPrompt(candidate: OutreachCandidate): string {
  const raw = candidate.rawData;

  switch (candidate.source) {
    case "github": {
      const topRepos = (raw.topRepos as Array<{
        name: string;
        description: string | null;
        stars: number;
        language: string | null;
      }>) ?? [];
      const repoList = topRepos
        .slice(0, 3)
        .map((r) => `  - ${r.name}${r.stars > 0 ? ` (${r.stars} stars)` : ""}: ${r.description ?? "No description"}`)
        .join("\n");
      return `- GitHub highlights:\n${repoList}\n- Languages: ${candidate.skills.join(", ")}\n- Followers: ${raw.followers ?? "N/A"}`;
    }

    case "stackoverflow": {
      const exp = candidate.experience;
      return `- Stack Overflow highlights:\n  - Reputation: ${exp.reputation ?? "N/A"}\n  - Answers: ${exp.answers ?? "N/A"}\n  - Top tags: ${candidate.skills.join(", ")}`;
    }

    case "portfolio": {
      const exp = candidate.experience as {
        bio?: string;
        projects?: Array<{ name: string; description: string | null }>;
      };
      const projectList = (exp.projects ?? [])
        .slice(0, 3)
        .map((p) => `  - ${p.name}: ${p.description ?? "No description"}`)
        .join("\n");
      return `- Portfolio highlights:\n${exp.bio ? `  - Bio: ${exp.bio}\n` : ""}${projectList ? `- Projects:\n${projectList}` : ""}`;
    }

    default:
      return `- Skills: ${candidate.skills.join(", ")}`;
  }
}
