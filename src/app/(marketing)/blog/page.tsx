/* ============================================================
   BLOG PAGE
   ============================================================
   Career advice and job search tips blog. Static articles for
   now — helps with SEO and positions the brand as an authority.
   Each post is a card linking to its own page (future).
   ============================================================ */

import Link from "next/link";

export const revalidate = 3600;

export const metadata = {
  title: "Blog — JobPilot AI",
  description: "Career tips, resume advice, and job search strategies from the JobPilot AI team.",
};

/* ---- Blog post data ---- */
const posts = [
  {
    slug: "how-to-beat-ats-systems-2026",
    title: "How to Beat ATS Systems in 2026",
    excerpt: "Applicant Tracking Systems reject 75% of resumes before a human ever sees them. Here's exactly how to format your resume to get through every time.",
    category: "Resume Tips",
    date: "May 2, 2026",
    readTime: "5 min read",
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  {
    slug: "linkedin-profile-mistakes",
    title: "7 LinkedIn Profile Mistakes That Cost You Interviews",
    excerpt: "Your LinkedIn profile is your digital first impression. These common mistakes are silently killing your chances of getting contacted by recruiters.",
    category: "LinkedIn",
    date: "Apr 28, 2026",
    readTime: "4 min read",
    color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  },
  {
    slug: "cover-letter-that-gets-read",
    title: "How to Write a Cover Letter That Actually Gets Read",
    excerpt: "Most cover letters get skimmed in under 10 seconds. Learn the structure that hooks hiring managers and makes them want to read your resume.",
    category: "Cover Letters",
    date: "Apr 21, 2026",
    readTime: "6 min read",
    color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  {
    slug: "career-change-resume-guide",
    title: "The Complete Guide to Career Change Resumes",
    excerpt: "Switching industries? Your resume needs a different strategy. Learn how to reframe your experience and highlight transferable skills that matter.",
    category: "Career Change",
    date: "Apr 15, 2026",
    readTime: "7 min read",
    color: "bg-sky-500/10 text-blue-400 border-sky-500/20",
  },
  {
    slug: "interview-questions-you-will-be-asked",
    title: "The 20 Interview Questions You Will Be Asked (And How to Answer Them)",
    excerpt: "From 'Tell me about yourself' to 'Why should we hire you?' — proven answer frameworks for every common interview question in 2026.",
    category: "Interview Prep",
    date: "Apr 8, 2026",
    readTime: "8 min read",
    color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  {
    slug: "remote-job-search-strategy",
    title: "How to Land a Remote Job: A Step-by-Step Strategy",
    excerpt: "Remote jobs get 10x more applications than on-site roles. Here's how to stand out, where to look, and what remote-first companies actually want to see.",
    category: "Job Search",
    date: "Apr 1, 2026",
    readTime: "6 min read",
    color: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  },
];

export default function BlogPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
      {/* ---- Page Header ---- */}
      <div className="mb-16">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl sm:text-5xl font-bold mb-4 glow-text-strong">
          Blog
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl">
          Career advice, resume tips, and job search strategies to help you land your next role faster.
        </p>
      </div>

      {/* ---- Blog Post Grid ---- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group rounded-2xl border border-card-border bg-space-800/60 p-7 hover:border-brand-indigo/30 hover:bg-space-700/60 transition-all duration-300"
          >
            {/* Category + Read time */}
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${post.color}`}>
                {post.category}
              </span>
              <span className="text-xs text-text-muted">{post.readTime}</span>
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold mb-3 group-hover:text-brand-light transition-colors leading-tight">
              {post.title}
            </h2>

            {/* Excerpt */}
            <p className="text-base text-text-secondary leading-relaxed mb-4">
              {post.excerpt}
            </p>

            {/* Date + Read more */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-muted">{post.date}</span>
              <span className="text-sm text-brand-light font-medium group-hover:text-white transition-colors">
                Read more &rarr;
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
