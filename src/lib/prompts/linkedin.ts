/* ============================================================
   LINKEDIN PROMPT TEMPLATES
   ============================================================
   Functions: linkedinAudit, linkedinRewrite, craftOutreach,
   linkedinContentStrategy
   ============================================================ */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { SCORE_CALIBRATION } from "./shared";

export function linkedinAudit(payload: Record<string, any>): string {
  const hasPostImages = payload.images?.length > 0;
  return `You are a LinkedIn optimization expert, personal branding strategist, and content coach. Audit this LinkedIn profile and${hasPostImages ? " their recent post screenshots" : ""} provide a comprehensive score and improvement plan.

IMPORTANT RULES:
- Use the person's ACTUAL name, headline, and content — never use placeholders
- Be specific — reference their actual experience and wording
- Score each section honestly, not generously
${hasPostImages ? "- For post screenshots: analyze the ACTUAL content visible in each image — text, formatting, engagement metrics, visuals" : ""}
${payload.postContext ? `\nADDITIONAL CONTEXT FROM USER: ${payload.postContext}` : ""}
${SCORE_CALIBRATION}

Provide this EXACT structure:

## Overall LinkedIn Score: X/100

---

## PROFILE AUDIT

### Headline
**Current:** (quote their current headline)
**Score:** X/10
**Issues:** (what's wrong)
**Suggested Headline:** (write a specific improved headline using their real info)

### About / Summary
**Score:** X/10
**Issues:** (what's missing or weak)
**Suggestions:** (specific improvements with examples)

### Experience Section
**Score:** X/10
**Issues:** (vague bullets, missing metrics, weak verbs, etc.)
**Key Fixes:** (rewrite 2-3 of their weakest bullet points as examples)

### Skills & Endorsements
**Score:** X/10
**Suggestions:** (specific skills they should add based on their field)

### Recommendations
**Score:** X/10
**Suggestions:** (who to ask and how)

### Profile Completeness
**Missing Sections:** (list any missing: banner image, featured, volunteer, certifications, etc.)
${hasPostImages ? `
---

## POST CONTENT AUDIT

### Per-Post Breakdown
(For EACH screenshot, analyze:)
- **Content Quality** — Is the hook strong? Message clear and valuable?
- **Engagement Potential** — Will people like, comment, share? Why or why not?
- **Visual Appeal** — Formatting, whitespace, emojis, line breaks?
- **Score:** X/10

### Content Strategy Score: X/100

### What You're Doing Well
(Specific strengths across all posts)

### Top Issues to Fix
(Ranked list of the most impactful improvements)

### Recommended Content Pillars
(3-5 content themes they should regularly post about)

### Post Templates
(2-3 ready-to-use post templates/frameworks they can fill in and post immediately)

### Posting Strategy
(Frequency, best times, hashtag strategy, engagement tips)
` : ""}
---

## Top 5 Priority Actions
(Numbered list of the highest-impact changes they should make immediately${hasPostImages ? " — include both profile AND content improvements" : ""})

LinkedIn Profile:
${payload.linkedinText}`;
}

export function linkedinRewrite(payload: Record<string, any>): string {
  return `You are a LinkedIn copywriter and personal branding expert. Rewrite this person's LinkedIn profile sections to be compelling, keyword-rich, and optimized for recruiter search.

CRITICAL RULES:
- Use their REAL name, job titles, companies, and experience
- NEVER use placeholders like [Your Name] or [Industry]
- Write in first person for the About section
- Keep the tone professional but personable — not corporate-speak
- Inject relevant industry keywords naturally for LinkedIn SEO
- Quantify achievements where the original data supports it
${payload.targetRole ? `- Optimize for this target role: ${payload.targetRole}` : ""}

Provide this EXACT structure:

## Optimized Headline
(One powerful headline, max 220 characters)

## Optimized About
(3-4 paragraphs: hook, value proposition, key achievements, call to action)

## Optimized Experience
(Rewrite each role with 4-5 strong bullet points starting with action verbs)

## Recommended Skills
(List 15-20 relevant skills they should add to their profile, ordered by importance)

## Recommended Hashtags
(5-7 hashtags they should follow/use for visibility in their field)

LinkedIn Profile:
${payload.linkedinText}`;
}

export function craftOutreach(payload: Record<string, any>): string {
  const messageType = payload.messageType?.replace("_", " ") || "cold outreach";
  const recipientName = payload.recipientName || "Unknown";
  const recipientTitle = payload.recipientTitle || "professional";
  const recipientCompany = payload.recipientCompany || "their company";
  const targetRole = payload.targetRole || "";
  const senderBackground = payload.senderBackground || "";
  const context = payload.context || "";
  const tone = payload.tone || "professional";
  const platform = payload.platform || "LinkedIn";

  const toneInstructions: Record<string, string> = {
    professional: "TONE: Professional and polished. Formal but not stiff — like a well-spoken colleague. Use complete sentences, measured language, and a confident but respectful approach. Avoid slang or overly casual phrases.",
    friendly: "TONE: Friendly and warm. Approachable, genuine, and personable — like messaging someone you'd enjoy grabbing coffee with. Use a conversational style with warmth, light humor where appropriate, and show authentic enthusiasm. Still professional, but noticeably warmer than a standard business message.",
    confident: "TONE: Confident and bold. Direct, assertive, and unapologetic about your value. Lead with what you bring to the table, not with requests. Use strong statements rather than hedging language — replace 'I think I could' with 'I bring' or 'I've done'. Show ambition without arrogance.",
    casual: "TONE: Casual and relaxed. Write like you're texting a professional friend — short sentences, contractions, no corporate formality. Skip formal greetings and sign-offs where natural. Keep it breezy and authentic, but still respectful and purposeful.",
  };

  const platformRules: Record<string, string> = {
    LinkedIn: `PLATFORM: LinkedIn Message
- LinkedIn messages should feel like a direct conversation, not a letter
- Connection requests: HARD LIMIT 300 characters including spaces — be ultra-concise
- Regular messages: Keep under 200 words for Version 1, under 350 for Versions 2-3
- No subject line needed — jump straight into the message
- Sign off casually (no "Sincerely" or "Regards" — use "Best," or "Thanks!" or just end naturally)`,
    Email: `PLATFORM: Email
- MUST include a compelling subject line as the FIRST line: "Subject: [your subject]"
- Use proper email structure: greeting → body → sign-off → name
- Emails can be slightly longer than LinkedIn messages — but still concise
- Version 1: 3-5 sentences. Version 2: 3-4 short paragraphs. Version 3: 2-3 natural paragraphs
- Sign off with "Best," or "Thanks," or "Cheers," followed by sender's name on the next line
- Subject line should be specific and intriguing — NOT generic like "Inquiry" or "Reaching Out"`,
    Twitter: `PLATFORM: X / Twitter DM
- Keep ALL versions very short — Twitter DMs that are too long get ignored
- Version 1: 1-2 sentences max (under 280 characters). Version 2: 2-3 sentences. Version 3: 2-3 sentences
- No formal greetings or sign-offs — just get to the point
- Match the casual, fast-paced feel of the platform
- Use natural abbreviations where appropriate but don't force them
- No "Dear" or "Sincerely" — end with a quick ask or nothing at all`,
  };

  return `Write 3 versions of a ${platform} ${messageType} message.
Each version must be a COMPLETE, ready-to-send message — not a template with blanks.

CONTEXT:
- Message type: ${messageType}
- Platform: ${platform}
- Recipient: ${recipientName}, ${recipientTitle} at ${recipientCompany}
${targetRole ? `- Sender is targeting this role: ${targetRole}` : ""}
${senderBackground ? `- Sender's background:\n${senderBackground}` : ""}
${context ? `- Additional context: ${context}` : ""}

${toneInstructions[tone] || toneInstructions.professional}

${platformRules[platform] || platformRules.LinkedIn}

THE 3 VERSIONS:

**Version 1 — Short & Direct**
The most concise option. Gets straight to the point. One clear ask. Perfect for busy recipients.

**Version 2 — Detailed & Compelling**
Longer, more fleshed out. Shows enthusiasm for the specific role/company. Includes 1-2 concrete skills or experiences that make the sender relevant. Clear ask at the end.

**Version 3 — Conversational & Natural**
Most human-sounding. Reads like a real person wrote it, not a template. Connects the sender's background to the opportunity naturally. Warm, approachable feel.

ALL 3 versions must follow the ${tone} tone described above. The versions differ in LENGTH and DETAIL, not in tone.

MESSAGE TYPE RULES:
- connection_request: ${platform === "LinkedIn" ? "LinkedIn connection note. Keep ALL versions under 300 characters. Ultra-concise." : "Short connection/intro message."}
- cold_outreach: First message to someone you don't know. Lead with relevance, not flattery.
- recruiter_pitch: Message to a recruiter about a specific role. Lead with relevant experience.
- follow_up: Nudge after no reply or a past conversation. Reference previous interaction.
- thank_you: After interview or coffee chat. Specific callback to something discussed.
- referral_request: Asking for a referral. Make it easy — include why the sender is a fit.
- informational_interview: Requesting an informational chat. Show genuine curiosity about their work.

CRITICAL WRITING RULES (apply to ALL 3 versions):
1. ${platform === "Email" ? `Start with "Hi ${recipientName}," and include a subject line BEFORE the greeting` : platform === "Twitter" ? `Start casually — "Hey ${recipientName}" or just jump in` : `Start with "Hi ${recipientName}," — NEVER "Dear" or "Hello"`}
2. NEVER use "I hope this message finds you well" or "I hope you're doing well" — go straight to the point
3. NEVER use "I'd love to connect" as the opening — it's generic and gets ignored
4. Mention the SPECIFIC role and SPECIFIC company by name naturally
5. Reference the sender's ACTUAL background — pull specific skills, job titles, education, achievements from what they provided. Don't be vague.
6. Sound like a real human wrote this — use contractions (I'm, I'd, I've), no corporate buzzwords
7. NO words like "synergy", "leverage", "utilize", "facilitate", "cross-functional collaboration" — use normal human words
8. End each version with ONE clear, easy-to-answer ask
9. If the sender provided background info, pick out 2-3 SPECIFIC and RELEVANT details — don't summarize their entire career
${targetRole ? `10. Weave in the sender's target role (${targetRole}) naturally — show why they're a fit for this type of position` : ""}

FORMAT — Return EXACTLY this structure (no JSON, no code fences):

## 1. Short & Direct
${platform === "Email" ? "\nSubject: [compelling subject line]\n" : ""}
${platform === "Twitter" ? `[message — keep under 280 chars if possible]` : `Hi ${recipientName},

[message text]

[sign-off]`}

## 2. Detailed & Compelling
${platform === "Email" ? "\nSubject: [compelling subject line]\n" : ""}
${platform === "Twitter" ? `[message — 2-3 sentences]` : `Hi ${recipientName},

[message text]

[sign-off]`}

## 3. Conversational & Natural
${platform === "Email" ? "\nSubject: [compelling subject line]\n" : ""}
${platform === "Twitter" ? `[message — 2-3 sentences, most casual]` : `Hi ${recipientName},

[message text]

[sign-off]`}`;
}

export function linkedinContentStrategy(payload: Record<string, any>): string {
  const targetRole = payload.targetRole ? payload.targetRole : "";
  return `You are a LinkedIn content strategist and personal branding coach who has helped professionals grow from 0 to 50K+ followers. Create a personalized 30-day LinkedIn content strategy based on this person's profile${targetRole ? ` and their target role: ${targetRole}` : ""}.

IMPORTANT RULES:
- Use the person's ACTUAL name, job titles, skills, and background — NEVER use placeholders
- Every recommendation must be specific to THEIR expertise and industry
- Content ideas must be things THEY can credibly write about based on their experience
- Be practical — assume they have 30-60 minutes per day for LinkedIn

Provide this EXACT structure:

## Content Strategy Score: X/100
(Rate their current positioning for content creation based on their profile — do they have a clear niche, expertise to share, unique perspective?)

---

## Your Content Niche
(1-2 sentences defining their ideal content niche based on their background and target role. Be specific: "AI-powered operations for mid-size companies" not just "technology")

## Content Pillars
Define 4-5 content pillars — recurring themes they should post about consistently. For each:

### Pillar: [Name]
**Why this works for you:** (1 sentence connecting to their actual experience)
**Example topics:**
- (3-4 specific post ideas they can write from personal experience)

---

## Post Templates
Provide 5 ready-to-use post frameworks they can fill in immediately:

### Template 1: [Name] (e.g., "The Contrarian Take")
**Format:** (Text / Carousel / Poll / Document / Video)
**Hook:** (The exact first line — this is what appears before "See more")
**Structure:**
(The post body framework with placeholder lines they fill in)
**CTA:** (Call-to-action to drive engagement)

(Repeat for all 5 templates — each should be a DIFFERENT format and style)

---

## Posting Schedule
**Recommended frequency:** X posts per week
**Best days:** (specific days based on their industry)
**Best times:** (specific times with timezone consideration)

### Weekly Calendar
| Day | Content Type | Pillar | Time |
|-----|-------------|--------|------|
(Fill in a full week schedule)

---

## Engagement Strategy
**Daily routine (15 min):**
- (3-4 specific actions: comment on X type of posts, engage with Y accounts, etc.)

**Weekly routine (30 min):**
- (2-3 actions: DM outreach, group participation, etc.)

**Accounts to engage with:**
- (Types of accounts in their industry they should follow and comment on — be specific to their field)

---

## Hashtag Strategy
**Primary hashtags (use on every post):**
- (5-7 hashtags specific to their niche — not generic ones like #business)

**Rotating hashtags (mix 2-3 per post):**
- (10-15 hashtags organized by sub-topic)

**Hashtags to AVOID:**
- (Common mistakes in their industry)

---

## Growth Milestones
**Month 1 goal:** (realistic follower/engagement target)
**Month 3 goal:** (with specific tactics to get there)
**Month 6 goal:** (where consistent execution leads)

**Key metrics to track:**
- (4-5 specific metrics with what "good" looks like)

---

## Quick Wins
(5 things they can do TODAY to start building their LinkedIn presence — specific, actionable, takes less than 10 minutes each)

TONE: Practical, encouraging, specific. No fluff. Every recommendation should pass the test: "Can they act on this TODAY?"

LinkedIn Profile:
${payload.linkedinText}`;
}
