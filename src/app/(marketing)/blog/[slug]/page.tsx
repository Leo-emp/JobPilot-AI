/* ============================================================
   BLOG POST PAGE - Individual Article View
   ============================================================
   Dynamic route that renders full blog articles based on slug.
   Static content for SEO — each post has its own metadata.
   Uses generateStaticParams for static generation at build time.
   ============================================================ */

import Link from "next/link";
import { notFound } from "next/navigation";

/* ---- Full blog post data with article content ---- */
const posts: Record<string, {
  title: string;
  category: string;
  date: string;
  readTime: string;
  color: string;
  content: string;
}> = {
  "how-to-beat-ats-systems-2026": {
    title: "How to Beat ATS Systems in 2026",
    category: "Resume Tips",
    date: "May 2, 2026",
    readTime: "5 min read",
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    content: `
## What Is an ATS?

An Applicant Tracking System (ATS) is software that companies use to manage job applications. It scans, parses, and ranks resumes before a human recruiter ever sees them. In 2026, over 99% of Fortune 500 companies and 75% of mid-size companies use some form of ATS.

The harsh reality: **up to 75% of resumes are rejected by ATS before reaching a human**. Your resume could be perfect, but if it's not formatted correctly for the ATS, it goes straight to the digital trash.

## Why Most Resumes Get Rejected

ATS software isn't reading your resume the way a person would. It's parsing text, looking for keywords, and trying to extract structured data. Here's what trips it up:

- **Fancy formatting** — columns, tables, text boxes, and headers/footers confuse most ATS parsers
- **Graphics and icons** — ATS can't read images, icons, or infographics
- **Unusual file formats** — always submit .docx or .pdf unless told otherwise
- **Missing keywords** — if the job description says "project management" and you wrote "managed projects," some ATS won't make the connection

## How to Format Your Resume for ATS

### 1. Use a Clean, Single-Column Layout

Stick to a simple, top-to-bottom layout. No columns, no sidebars, no text boxes. Use standard section headings: "Work Experience," "Education," "Skills." ATS software looks for these exact headings to categorize your information.

### 2. Mirror the Job Description

This is the single most impactful thing you can do. Read the job posting carefully and incorporate the exact phrases and keywords they use. If they say "cross-functional collaboration," use that phrase — don't paraphrase it as "worked with different teams."

### 3. Use Standard Fonts and Formatting

Stick with Arial, Calibri, or Times New Roman. Use bold for headings, but avoid underlining or italics for critical information. Don't use special characters or symbols — spell things out.

### 4. Include a Skills Section

Create a dedicated "Skills" section near the top of your resume. List both hard skills (Python, SQL, Figma) and soft skills (leadership, communication) that match the job description. This gives the ATS a clear keyword match.

### 5. Save in the Right Format

Unless the job posting specifies otherwise, submit your resume as a **.docx file**. While PDFs preserve formatting, some older ATS systems struggle to parse them. When in doubt, .docx is the safest bet.

## Test Your Resume

Before submitting, run your resume through an ATS simulator. Tools like JobPilot AI can analyze your resume against a specific job description and give you an ATS compatibility score, highlighting exactly what to fix.

## The Bottom Line

Beating the ATS isn't about gaming the system — it's about presenting your real qualifications in a format that software can actually read. A well-formatted, keyword-optimized resume gets through the ATS AND impresses the human on the other side.

**Your resume is great. Make sure it actually gets seen.**
    `,
  },
  "linkedin-profile-mistakes": {
    title: "7 LinkedIn Profile Mistakes That Cost You Interviews",
    category: "LinkedIn",
    date: "Apr 28, 2026",
    readTime: "4 min read",
    color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    content: `
## Your LinkedIn Profile Is Your Digital First Impression

Recruiters spend an average of **7.4 seconds** scanning a LinkedIn profile before deciding whether to reach out. In those few seconds, small mistakes can cost you big opportunities. Here are the seven most common mistakes — and how to fix them.

## 1. A Weak or Generic Headline

Your headline is the most visible part of your profile. "Looking for opportunities" or "Unemployed" tells recruiters nothing about your value. Instead, lead with your expertise:

**Bad:** "Marketing Professional | Open to Work"
**Good:** "Growth Marketing Manager | Scaled B2B SaaS from $2M to $15M ARR"

## 2. No Profile Photo (or a Bad One)

Profiles without photos get 21x fewer views. But a low-quality selfie or a cropped group photo isn't much better. Invest in a professional headshot — or at minimum, use a well-lit photo with a clean background where you're dressed appropriately for your industry.

## 3. An Empty "About" Section

The About section is your elevator pitch. Don't leave it blank. Write 3-5 short paragraphs covering:

- What you do and what you're passionate about
- Your key achievements (with numbers)
- What you're looking for next
- A call to action (e.g., "Let's connect — reach me at...")

## 4. Job Descriptions That Read Like Resumes

Don't just list your responsibilities. LinkedIn is a storytelling platform. For each role, highlight 2-3 accomplishments with measurable results:

**Bad:** "Responsible for managing social media accounts"
**Good:** "Grew Instagram following from 5K to 85K in 12 months, driving 40% increase in website traffic from social channels"

## 5. Ignoring the Skills Section

LinkedIn's algorithm uses your Skills section to determine which searches you appear in. Add at least 10 relevant skills, prioritizing the ones that match roles you're targeting. Ask colleagues to endorse your top skills — profiles with 5+ endorsements per skill rank significantly higher.

## 6. No Recommendations

Recommendations are social proof. A profile with zero recommendations looks bare. Reach out to 3-5 former colleagues, managers, or clients and ask for specific recommendations. Tip: write one for them first — most people will reciprocate.

## 7. Not Engaging with Content

LinkedIn rewards active users. If you never post, comment, or share, you're invisible to the algorithm. Start small: comment thoughtfully on 2-3 posts per day in your industry. Share an insight or article once a week. Consistency beats virality.

## Quick Wins You Can Do Today

1. Update your headline to showcase your value proposition
2. Add a professional photo
3. Write or refresh your About section
4. Add 10+ relevant skills
5. Request 3 recommendations

**Your LinkedIn profile works for you 24/7 — make sure it's saying the right things.**
    `,
  },
  "cover-letter-that-gets-read": {
    title: "How to Write a Cover Letter That Actually Gets Read",
    category: "Cover Letters",
    date: "Apr 21, 2026",
    readTime: "6 min read",
    color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    content: `
## Do Cover Letters Still Matter?

Yes — but only if they're good. A generic "Dear Hiring Manager, I am writing to express my interest..." letter gets skimmed and forgotten. A compelling, specific cover letter can be the difference between getting an interview and getting ghosted.

Research shows that **83% of hiring managers say a strong cover letter can convince them to interview a candidate** even if their resume isn't a perfect match.

## The 4-Paragraph Structure That Works

### Paragraph 1: The Hook

Open with something specific to the company or role. Show that you've done your research and explain why THIS role at THIS company excites you.

**Bad:** "I am writing to apply for the Marketing Manager position I saw on your website."

**Good:** "When I saw that Acme Corp is building out a content-led growth engine after your Series B, I knew I had to apply — I've done exactly this at two previous startups, growing organic traffic by 300% and 450% respectively."

### Paragraph 2: Your Proof

Pick 2-3 accomplishments from your career that directly relate to the job requirements. Use specific numbers and outcomes. This paragraph should make the reader think "this person has done what we need."

### Paragraph 3: Why This Company

Show genuine interest in the company's mission, product, or culture. Reference something specific — a recent blog post, product launch, company value, or industry position. This proves you're not mass-applying.

### Paragraph 4: The Close

End with a clear call to action. Express enthusiasm and make it easy for them to reach out.

**Example:** "I'd love to discuss how my experience scaling content programs could help Acme Corp hit its growth targets. I'm available for a call anytime this week — looking forward to connecting."

## Common Mistakes to Avoid

- **Repeating your resume** — the cover letter should complement your resume, not duplicate it
- **Making it about you** — focus on what you can do for THEM, not what you want
- **Being too long** — keep it under 400 words. Respect their time
- **Generic templates** — hiring managers can spot a template from a mile away
- **Typos** — one typo can sink an otherwise great letter. Proofread, then proofread again

## When to Skip the Cover Letter

If the application explicitly says "no cover letter needed" or doesn't have a field for one, don't force it. But if there's an option to include one, always do. It's a chance to stand out that most candidates waste.

## Pro Tip: Use AI as a Starting Point

Tools like JobPilot AI can generate a tailored cover letter based on your resume and the job description. Use it as a first draft, then add your personal voice and specific details. The best cover letters feel human — let the AI handle the structure while you bring the personality.

**A great cover letter doesn't just get read — it gets you remembered.**
    `,
  },
  "career-change-resume-guide": {
    title: "The Complete Guide to Career Change Resumes",
    category: "Career Change",
    date: "Apr 15, 2026",
    readTime: "7 min read",
    color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    content: `
## Switching Careers? Your Resume Needs a Different Strategy

A career change resume isn't about hiding your past — it's about reframing it. The skills you've built are more transferable than you think. The challenge is helping hiring managers see the connection.

## Step 1: Identify Your Transferable Skills

Every career has core skills that translate across industries. Before you write anything, map your existing skills to the requirements of your target role:

- **Project management** — planning, deadlines, budgets, stakeholder communication
- **Data analysis** — working with numbers, spotting trends, making data-driven decisions
- **Communication** — writing, presenting, negotiating, training
- **Leadership** — managing teams, mentoring, driving initiatives
- **Problem-solving** — troubleshooting, process improvement, creative solutions

Write down every skill you use in your current role, then highlight the ones that appear in job descriptions for your target role.

## Step 2: Use a Functional or Combination Format

Traditional chronological resumes highlight your job history — which works against you in a career change. Instead, consider:

**Combination format (recommended):** Lead with a skills-based summary and a "Relevant Skills" section, then list your work history chronologically below. This puts your transferable skills front and center while still showing your career progression.

**Functional format:** Organize your resume entirely by skill category rather than by job. This can work but some recruiters view it skeptically — they want to see where and when you used those skills.

## Step 3: Write a Powerful Summary Statement

Your summary (top of resume, 3-4 lines) is crucial for career changers. It bridges your past and your future:

**Example:** "Operations manager with 8 years of experience in logistics and supply chain optimization, transitioning to product management. Proven track record of leading cross-functional teams, analyzing user data to improve processes, and delivering projects that increased efficiency by 35%. Currently completing Google Product Management Certificate."

## Step 4: Reframe Your Experience

Don't just list what you did — translate it into the language of your target industry:

**Before (teacher → UX):** "Taught 30 students per class, created lesson plans, graded assignments"

**After:** "Designed learning experiences for diverse user groups, conducted iterative feedback sessions to improve curriculum engagement, analyzed performance data to identify areas for improvement"

Same experience, different framing. The key is using the vocabulary and priorities of your target role.

## Step 5: Fill the Gaps

If you lack direct experience, show initiative:

- **Online certifications** — Google, Coursera, or industry-specific programs
- **Side projects** — built an app, started a blog, freelanced in the new field
- **Volunteer work** — used target skills in a non-profit or community setting
- **Relevant coursework** — even a single class shows commitment

## Step 6: Address the Change in Your Cover Letter

Your resume shows the what. Your cover letter explains the why. Be honest about your career change and enthusiastic about the new direction. Hiring managers appreciate self-awareness and genuine motivation.

## Tools to Help

JobPilot AI's Career Pivot Mode is specifically designed for career changers. It analyzes your current experience, identifies transferable skills, and helps you rewrite your resume bullets in the language of your target industry.

**Your past experience isn't a liability — it's your unfair advantage. Frame it right.**
    `,
  },
  "interview-questions-you-will-be-asked": {
    title: "The 20 Interview Questions You Will Be Asked (And How to Answer Them)",
    category: "Interview Prep",
    date: "Apr 8, 2026",
    readTime: "8 min read",
    color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    content: `
## Preparation Beats Improvisation

The best interviewees aren't naturally gifted speakers — they're well-prepared. Most interviews draw from the same pool of common questions. Master these 20, and you'll walk into any interview with confidence.

## The Big 5 (Asked in Almost Every Interview)

### 1. "Tell me about yourself."

This is your 60-second elevator pitch. Structure it as: **Present → Past → Future.**

"I'm currently a senior developer at X, where I lead a team building Y. Before that, I spent 3 years at Z where I developed my expertise in A and B. I'm now looking to bring that experience to a role where I can C — which is exactly why I'm excited about this position."

### 2. "Why do you want to work here?"

Show genuine research. Reference the company's mission, recent news, product, or culture. Connect it to your own career goals.

### 3. "What are your greatest strengths?"

Pick 2-3 strengths that directly relate to the role. Back each one with a brief example: "I'm strong at data analysis — at my last company, I built a dashboard that identified $200K in cost savings."

### 4. "What is your greatest weakness?"

Choose a real weakness, but one you're actively working on. Never say "I'm a perfectionist" — it sounds rehearsed. Try: "I sometimes take on too much myself instead of delegating. I've been working on this by setting clearer boundaries and trusting my team more."

### 5. "Where do you see yourself in 5 years?"

Show ambition that aligns with the company's trajectory. "I'd love to grow into a leadership role here, potentially managing a team and driving strategy for this product area."

## Behavioral Questions (The STAR Method)

For questions starting with "Tell me about a time when...", use the STAR framework:

- **Situation** — set the scene briefly
- **Task** — what was your responsibility
- **Action** — what specifically YOU did
- **Result** — the measurable outcome

### 6. "Tell me about a time you faced a conflict at work."
### 7. "Describe a situation where you had to meet a tight deadline."
### 8. "Tell me about a time you failed."
### 9. "Give an example of when you showed leadership."
### 10. "Describe a time you had to learn something quickly."

For each of these, prepare a specific story using STAR. Keep it concise — 90 seconds max per answer.

## Role-Specific Questions

### 11. "Why are you leaving your current job?"

Stay positive. Focus on what you're moving toward, not what you're running from. "I'm looking for more growth opportunities in X area, and this role offers exactly that."

### 12. "What do you know about our company?"

This tests your research. Mention their product, recent news, mission, and market position.

### 13. "How do you handle pressure/stress?"

Give a specific example and describe your coping strategies: prioritization, communication, breaking problems into smaller pieces.

### 14. "What makes you unique?"

Combine 2-3 qualities that aren't common together: "I have both deep technical skills and strong client-facing communication — I can build the product AND sell it."

### 15. "What are your salary expectations?"

Research the market rate on Glassdoor/Levels.fyi first. Give a range: "Based on my experience and market research, I'm looking in the $X-$Y range, but I'm open to discussing the full compensation package."

## Questions to Ask the Interviewer

### 16-20: Always Have Questions Ready

- "What does success look like in this role in the first 90 days?"
- "What's the biggest challenge the team is facing right now?"
- "How would you describe the team culture?"
- "What's the growth path for this role?"
- "What do you personally enjoy most about working here?"

Asking thoughtful questions shows genuine interest and helps you evaluate if the role is right for YOU.

## Final Tips

- **Practice out loud** — thinking about answers isn't the same as saying them
- **Record yourself** — you'll catch filler words and rambling
- **Prepare 5-7 STAR stories** that can be adapted to different behavioral questions
- **Use JobPilot AI's Interview Prep** tool to practice with AI-generated questions tailored to specific job descriptions

**The interview is a conversation, not an interrogation. Prepare well, be authentic, and remember — they want you to succeed.**
    `,
  },
  "remote-job-search-strategy": {
    title: "How to Land a Remote Job: A Step-by-Step Strategy",
    category: "Job Search",
    date: "Apr 1, 2026",
    readTime: "6 min read",
    color: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    content: `
## Remote Jobs Are Competitive — Here's How to Stand Out

Remote positions receive **10x more applications** than on-site roles. The flexibility is appealing, but the competition is fierce. You need a targeted strategy to stand out.

## Step 1: Optimize Your Profile for Remote Work

Before you apply anywhere, make sure your online presence signals "remote-ready":

- **LinkedIn headline:** Add "Remote" as a location preference and mention remote experience in your headline
- **Resume:** Include a "Remote Work" section or highlight remote experience in your summary
- **Portfolio/website:** If applicable, showcase work you've done remotely with distributed teams

## Step 2: Know Where to Look

Not all job boards are created equal for remote work. The best sources:

- **Remote-first job boards** — We Work Remotely, Remote.co, FlexJobs, Remotive
- **Company career pages** — many remote-first companies (GitLab, Zapier, Buffer, Automattic) list jobs on their own sites first
- **LinkedIn** — use the "Remote" filter and set up job alerts
- **AngelList/Wellfound** — great for remote startup positions
- **Industry-specific boards** — many niche job boards have remote filters

## Step 3: Target Remote-First Companies

There's a big difference between companies that "allow remote" and companies that are "remote-first." Remote-first companies have built their entire culture around distributed work. They have better tools, processes, and support for remote employees.

Look for signals:
- "Remote-first" or "distributed team" in the job description
- Team members listed across multiple time zones on LinkedIn
- Company blog posts about remote culture
- Tools like Notion, Slack, Loom, and Figma mentioned in job descriptions

## Step 4: Highlight Remote-Specific Skills

Remote work requires a distinct skill set. Make sure your application emphasizes:

- **Written communication** — remote teams run on written updates, docs, and async messages
- **Self-management** — ability to stay productive without supervision
- **Async collaboration** — experience working across time zones
- **Tool proficiency** — Slack, Zoom, Notion, project management tools (Jira, Linear, Asana)
- **Documentation habits** — writing things down so distributed teams stay aligned

## Step 5: Nail the Remote Interview

Remote interviews have unique dynamics:

- **Test your tech** — camera, mic, lighting, and internet connection BEFORE the interview
- **Professional background** — clean, well-lit space. Virtual backgrounds are fine if they're not distracting
- **Look at the camera** — not the screen. This simulates eye contact
- **Have examples ready** — prepare stories about how you've successfully worked remotely or managed distributed projects
- **Ask remote-specific questions:** "How does the team handle async communication?" "What does a typical day look like?" "How do you maintain team culture remotely?"

## Step 6: Stand Out in Your Application

With 10x the competition, generic applications won't cut it:

- **Customize every application** — reference the specific company, role, and why remote work at their company appeals to you
- **Include a brief video introduction** — some platforms allow this. A 60-second video showing your communication skills and personality can set you apart
- **Show, don't tell** — if you've worked remotely before, quantify the results. "Led a 12-person distributed team across 4 time zones, delivering projects 15% ahead of schedule"

## Common Mistakes to Avoid

- **Applying to everything** — be strategic. 10 tailored applications beat 100 generic ones
- **Ignoring time zone requirements** — many "remote" jobs still require specific time zone overlap
- **Not mentioning remote experience** — even informal remote work (freelancing, side projects) counts
- **Focusing only on the flexibility** — employers want to hear about your productivity, not your desire to work in pajamas

## The Bottom Line

Landing a remote job in 2026 requires the same fundamentals as any job search — great resume, tailored applications, strong interview skills — plus a clear demonstration that you thrive in a distributed environment.

**Remote work isn't just about where you work. It's about how you work. Show employers you've mastered both.**
    `,
  },
};

/* ---- Generate static paths for all blog posts at build time ---- */
export function generateStaticParams() {
  return Object.keys(posts).map((slug) => ({ slug }));
}

/* ---- Generate metadata for each blog post (SEO) ---- */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts[slug];

  if (!post) {
    return { title: "Post Not Found — JobPilot AI" };
  }

  return {
    title: `${post.title} — JobPilot AI Blog`,
    description: post.content.slice(0, 160).replace(/[#*\n]/g, "").trim(),
  };
}

/* ---- Blog Post Page Component ---- */
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts[slug];

  /* 404 if slug doesn't match any post */
  if (!post) {
    notFound();
  }

  /* Convert markdown-style content to JSX */
  const contentLines = post.content.trim().split("\n");
  const contentElements = contentLines.map((line, i) => {
    const trimmed = line.trim();

    if (!trimmed) return <br key={i} />;

    /* H2 heading */
    if (trimmed.startsWith("## ")) {
      return (
        <h2 key={i} className="text-2xl font-bold text-white mt-10 mb-4">
          {trimmed.replace("## ", "")}
        </h2>
      );
    }

    /* H3 heading */
    if (trimmed.startsWith("### ")) {
      return (
        <h3 key={i} className="text-xl font-bold text-white mt-8 mb-3">
          {trimmed.replace("### ", "")}
        </h3>
      );
    }

    /* Bullet list item */
    if (trimmed.startsWith("- ")) {
      const text = trimmed.replace("- ", "");
      return (
        <li key={i} className="ml-6 text-text-secondary leading-relaxed list-disc">
          {renderInlineFormatting(text)}
        </li>
      );
    }

    /* Regular paragraph */
    return (
      <p key={i} className="text-text-secondary leading-relaxed mb-4">
        {renderInlineFormatting(trimmed)}
      </p>
    );
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24">
      {/* ---- Back link ---- */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-brand-light transition-colors mb-10"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Blog
      </Link>

      {/* ---- Post Header ---- */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-5">
          <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${post.color}`}>
            {post.category}
          </span>
          <span className="text-xs text-text-muted">{post.readTime}</span>
          <span className="text-xs text-text-muted">{post.date}</span>
        </div>
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl sm:text-4xl font-bold glow-text-strong leading-tight">
          {post.title}
        </h1>
      </div>

      {/* ---- Article Content ---- */}
      <article className="space-y-1">
        {contentElements}
      </article>

      {/* ---- CTA at the bottom ---- */}
      <div className="mt-16 rounded-2xl border border-card-border bg-space-800/60 p-8 text-center">
        <h3 className="text-xl font-bold mb-3">Ready to Put This Into Practice?</h3>
        <p className="text-text-secondary text-base mb-6 max-w-md mx-auto">
          JobPilot AI helps you build ATS-optimized resumes, write tailored cover letters, and prepare for interviews — all powered by AI.
        </p>
        <Link
          href="/signup"
          className="btn-primary inline-block px-8 py-3 text-base"
        >
          Try JobPilot AI Free
        </Link>
      </div>

      {/* ---- Back to Blog ---- */}
      <div className="mt-10 text-center">
        <Link
          href="/blog"
          className="text-sm text-brand-light hover:text-white transition-colors"
        >
          &larr; Back to all posts
        </Link>
      </div>
    </div>
  );
}

/* ---- Helper: render bold and inline code in text ---- */
function renderInlineFormatting(text: string) {
  /* Split on **bold** patterns */
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="text-white font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}
