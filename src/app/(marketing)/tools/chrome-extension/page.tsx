/* ============================================================
   SEO LANDING PAGE — Chrome Extension
   ============================================================
   # Targets: "job search chrome extension", "save jobs extension",
   # "job tracker chrome extension", "LinkedIn job saver",
   # "job application tracker extension"
   ============================================================ */

import Link from "next/link";
import Image from "next/image";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata = {
  title: "Free Chrome Extension — Save Jobs from Any Job Board in One Click | JobPilot AI",
  description:
    "Save jobs from LinkedIn, Indeed, Glassdoor, and 40+ job boards with one click. Auto-extracts job details, AI match scores, and syncs to your tracker. Free extension.",
  alternates: { canonical: "https://jobpilotai.co/tools/chrome-extension" },
  openGraph: {
    title: "Free Job Saver Chrome Extension — JobPilot AI",
    description: "One click to save any job listing. Auto-extracts details, AI match scores, syncs to your tracker.",
    url: "https://jobpilotai.co/tools/chrome-extension",
  },
};

const supportedSites = [
  "LinkedIn", "Indeed", "Glassdoor", "Google Jobs", "ZipRecruiter", "Dice",
  "AngelList", "Wellfound", "RemoteOK", "We Work Remotely", "Hacker News Jobs",
  "Y Combinator", "BuiltIn", "FlexJobs", "SimplyHired", "CareerBuilder",
  "Monster", "Greenhouse", "Lever", "Workday", "iCIMS", "Jobvite",
  "BambooHR", "SmartRecruiters", "JazzHR", "Breezy HR", "Recruitee",
  "Ashby", "Rippling", "Deel", "Remote.co", "Working Nomads",
  "Otta", "Cord", "Hired", "Triplebyte", "Toptal", "Gun.io",
  "Authentic Jobs", "Dribbble Jobs", "Behance Jobs",
];

const benefits = [
  {
    title: "One-Click Save from 40+ Sites",
    desc: "See a job you like? Click the extension icon. Job title, company, location, salary, and description are extracted automatically — no copy-pasting into spreadsheets.",
  },
  {
    title: "Auto-Extracted Job Details",
    desc: "The extension reads the job listing page and pulls out structured data: title, company, location, salary range, job type, and the full description. All stored in your tracker.",
  },
  {
    title: "Instant AI Match Score",
    desc: "Every saved job gets an AI-generated match score based on your resume. See at a glance whether a job is a 94% match or a 60% stretch — before you spend time applying.",
  },
  {
    title: "Syncs to Application Tracker",
    desc: "Saved jobs appear instantly in your JobPilot AI dashboard tracker. Track status, add notes, and move jobs through your pipeline — all in one place.",
  },
  {
    title: "Works on ATS Pages Too",
    desc: "Not just job boards. The extension works on company career pages powered by Greenhouse, Lever, Workday, iCIMS, and other ATS platforms — where many of the best jobs live.",
  },
  {
    title: "Manual Save Fallback",
    desc: "On an unsupported site? Use the manual save button to enter job details yourself. The extension is smart enough to pre-fill what it can from the current page.",
  },
];

const faqs = [
  {
    q: "Which browsers are supported?",
    a: "The extension works on Google Chrome and all Chromium-based browsers (Edge, Brave, Arc, Opera, Vivaldi). Firefox support is planned for a future release.",
  },
  {
    q: "Is it really free?",
    a: "Yes. The Chrome extension is free to install and use. Saving jobs and syncing to your tracker costs nothing. AI match scores use your existing JobPilot AI credits (10 free per month).",
  },
  {
    q: "What if a job board isn't supported?",
    a: "The extension supports 40+ job boards and ATS platforms. For unsupported sites, use the manual save fallback — click the extension, and it opens a quick form pre-filled with whatever it can extract from the page.",
  },
  {
    q: "Does it work on LinkedIn?",
    a: "Yes. The extension works on LinkedIn job listings, including Easy Apply jobs. Click the extension icon while viewing any LinkedIn job posting to save it with all details extracted.",
  },
  {
    q: "How do saved jobs sync to the tracker?",
    a: "Instantly. When you save a job through the extension, it appears in your JobPilot AI dashboard tracker within seconds. No manual sync, no import needed — it's automatic.",
  },
];

export default function ChromeExtensionToolPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://jobpilotai.co" },
          { name: "Tools", url: "https://jobpilotai.co/tools" },
          { name: "Chrome Extension", url: "https://jobpilotai.co/tools/chrome-extension" },
        ]}
      />

      <div className="text-center mb-16">
        <p className="text-brand-light text-sm font-medium tracking-wider uppercase mb-3">Free Chrome Extension</p>
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 glow-text-strong">
          Save Any Job in One Click
        </h1>
        <p className="text-text-secondary text-lg sm:text-xl max-w-3xl mx-auto mb-8">
          Stop copy-pasting job listings into spreadsheets. Our Chrome extension saves jobs from
          LinkedIn, Indeed, Glassdoor, and 40+ sites — auto-extracts details, adds AI match scores,
          and syncs to your tracker instantly.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/signup" className="btn-primary text-base px-8 py-3">Install Extension Free</Link>
          <Link href="/login" className="border border-card-border text-text-secondary hover:text-white hover:border-white/30 px-8 py-3 rounded-xl text-base transition-colors">Already have an account?</Link>
        </div>
      </div>

      {/* # Extension Preview */}
      <div className="mb-20 max-w-2xl mx-auto">
        <div className="glass-card p-6 sm:p-8">
          {/* # Fake browser toolbar */}
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-card-border">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
            <div className="flex-1 mx-4 h-7 rounded-lg bg-space-700/80 border border-white/10 flex items-center px-3">
              <p className="text-[10px] text-text-muted truncate">linkedin.com/jobs/view/senior-product-manager-at-google...</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-brand-indigo/20 border border-brand-indigo/30 flex items-center justify-center shrink-0 overflow-hidden">
              <Image src="/jp-logo.svg" alt="JobPilot AI" width={24} height={24} className="rounded" />
            </div>
          </div>

          {/* # Extension popup */}
          <div className="max-w-xs mx-auto">
            <div className="rounded-xl bg-space-700/80 border border-white/10 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded bg-brand-indigo/20 flex items-center justify-center overflow-hidden">
                  <Image src="/jp-logo.svg" alt="JobPilot AI" width={20} height={20} className="rounded" />
                </div>
                <p className="text-xs font-bold text-white">JobPilot AI</p>
                <span className="ml-auto px-2 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">Detected</span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="p-2.5 rounded-lg bg-space-800/80 border border-white/5">
                  <p className="text-[10px] text-text-muted mb-0.5">Job Title</p>
                  <p className="text-xs text-white font-medium">Senior Product Manager</p>
                </div>
                <div className="p-2.5 rounded-lg bg-space-800/80 border border-white/5">
                  <p className="text-[10px] text-text-muted mb-0.5">Company</p>
                  <p className="text-xs text-white font-medium">Google</p>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 p-2.5 rounded-lg bg-space-800/80 border border-white/5">
                    <p className="text-[10px] text-text-muted mb-0.5">Location</p>
                    <p className="text-xs text-white font-medium">Mountain View, CA</p>
                  </div>
                  <div className="flex-1 p-2.5 rounded-lg bg-space-800/80 border border-white/5">
                    <p className="text-[10px] text-text-muted mb-0.5">AI Match</p>
                    <p className="text-xs text-emerald-400 font-bold">94%</p>
                  </div>
                </div>
              </div>

              <button className="w-full py-2.5 rounded-lg bg-brand-indigo/80 text-white text-xs font-semibold text-center">
                Save to Tracker
              </button>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-card-border text-center">
            <p className="text-xs text-text-muted">Auto-detects job details from 40+ sites &middot; Syncs to your dashboard instantly</p>
          </div>
        </div>
      </div>

      {/* # Supported Sites */}
      <div className="mb-20">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-center mb-4">Works on 40+ Job Boards & ATS Platforms</h2>
        <p className="text-text-secondary text-center max-w-2xl mx-auto mb-8">
          From major job boards to company career pages powered by popular ATS platforms — the extension works wherever you find jobs.
        </p>
        <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
          {supportedSites.map((site) => (
            <span key={site} className="px-3 py-1.5 rounded-lg text-xs bg-space-700/50 border border-card-border text-text-secondary">{site}</span>
          ))}
        </div>
      </div>

      <div className="mb-20">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-center mb-4">Stop Copy-Pasting Job Listings</h2>
        <p className="text-text-secondary text-center max-w-2xl mx-auto mb-10">
          Every minute spent copying job details into a spreadsheet is a minute not spent on your application. One click saves everything — and adds an AI match score too.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b) => (
            <div key={b.title} className="glass-card p-6 hover:border-brand-indigo/30 transition-colors">
              <h3 className="text-base font-bold mb-2">{b.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-20">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-center mb-4">How It Works</h2>
        <p className="text-text-secondary text-center max-w-2xl mx-auto mb-12">
          From install to your first saved job in under 2 minutes. Here&apos;s exactly what to do.
        </p>
        <div className="max-w-3xl mx-auto space-y-6">

          {/* # Step 1 — Sign up / Log in */}
          <div className="glass-card p-6 sm:p-8">
            <div className="flex items-start gap-5">
              <div className="w-10 h-10 rounded-full bg-brand-indigo/20 border border-brand-indigo/30 flex items-center justify-center shrink-0 mt-1">
                <span className="text-brand-light font-bold text-lg">1</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white text-lg mb-2">Create Your Free Account</h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-4">
                  Go to <span className="text-brand-light font-medium">jobpilotai.co/signup</span> and create your free account.
                  This takes 30 seconds — just your email and a password. Your account is where saved jobs, AI match scores, and your application tracker all live.
                </p>
                <div className="rounded-xl bg-space-700/50 border border-white/5 p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-7 h-7 rounded bg-brand-indigo/20 flex items-center justify-center overflow-hidden">
                      <Image src="/jp-logo.svg" alt="JobPilot AI" width={18} height={18} className="rounded" />
                    </div>
                    <p className="text-xs font-bold text-white">Create Account</p>
                  </div>
                  <div className="space-y-2">
                    <div className="h-8 rounded-lg bg-space-800/80 border border-white/10 flex items-center px-3">
                      <p className="text-[10px] text-text-muted">you@email.com</p>
                    </div>
                    <div className="h-8 rounded-lg bg-space-800/80 border border-white/10 flex items-center px-3">
                      <p className="text-[10px] text-text-muted">Create password</p>
                    </div>
                    <div className="h-8 rounded-lg bg-brand-indigo/80 flex items-center justify-center">
                      <p className="text-[10px] text-white font-semibold">Get Started Free</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* # Step 2 — Install from Chrome Web Store */}
          <div className="glass-card p-6 sm:p-8">
            <div className="flex items-start gap-5">
              <div className="w-10 h-10 rounded-full bg-brand-indigo/20 border border-brand-indigo/30 flex items-center justify-center shrink-0 mt-1">
                <span className="text-brand-light font-bold text-lg">2</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white text-lg mb-2">Install from Chrome Web Store</h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-4">
                  Go to the <span className="text-brand-light font-medium">Chrome Web Store</span> and search &quot;JobPilot AI&quot; — or click the install link in your dashboard.
                  Hit <span className="text-white font-medium">&quot;Add to Chrome&quot;</span> and confirm the permissions. The extension icon appears in your browser toolbar instantly.
                </p>
                <div className="rounded-xl bg-space-700/50 border border-white/5 p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <svg className="w-5 h-5 text-blue-400 shrink-0" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" opacity="0.2"/><circle cx="12" cy="12" r="4" fill="currentColor"/></svg>
                    <p className="text-[10px] text-text-muted">Chrome Web Store</p>
                    <div className="flex-1 h-6 rounded bg-space-800/80 border border-white/10 flex items-center px-2 ml-2">
                      <p className="text-[9px] text-text-muted">JobPilot AI</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-space-800/60 border border-white/5">
                    <div className="w-10 h-10 rounded-lg bg-brand-indigo/20 flex items-center justify-center overflow-hidden shrink-0">
                      <Image src="/jp-logo.svg" alt="JobPilot AI" width={28} height={28} className="rounded" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white font-bold">JobPilot AI — Job Saver</p>
                      <p className="text-[10px] text-text-muted">Save jobs from any site in one click</p>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg bg-blue-500 shrink-0">
                      <p className="text-[10px] text-white font-bold">Add to Chrome</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* # Step 3 — Pin the extension */}
          <div className="glass-card p-6 sm:p-8">
            <div className="flex items-start gap-5">
              <div className="w-10 h-10 rounded-full bg-brand-indigo/20 border border-brand-indigo/30 flex items-center justify-center shrink-0 mt-1">
                <span className="text-brand-light font-bold text-lg">3</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white text-lg mb-2">Pin It to Your Toolbar</h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-4">
                  Click the <span className="text-white font-medium">puzzle piece icon</span> (Extensions) in the top-right of Chrome.
                  Find JobPilot AI in the list and click the <span className="text-white font-medium">pin icon</span> so it&apos;s always visible.
                  Now you&apos;ll see the JobPilot AI icon right next to your address bar — ready to use on any page.
                </p>
                <div className="rounded-xl bg-space-700/50 border border-white/5 p-4">
                  <div className="flex items-center justify-end gap-2 mb-3">
                    <div className="w-6 h-6 rounded bg-space-800/80 border border-white/10 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-2.5 rounded-lg bg-space-800/60 border border-white/5">
                      <div className="w-5 h-5 rounded bg-brand-indigo/20 flex items-center justify-center overflow-hidden">
                        <Image src="/jp-logo.svg" alt="JobPilot AI" width={14} height={14} className="rounded" />
                      </div>
                      <p className="text-[10px] text-white font-medium flex-1">JobPilot AI</p>
                      <svg className="w-3.5 h-3.5 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M16 12l-4-4v3H4v2h8v3l4-4z" transform="rotate(-90 12 12)"/><rect x="10" y="14" width="4" height="8" rx="1"/></svg>
                    </div>
                    <div className="flex items-center gap-3 p-2.5 rounded-lg bg-space-800/60 border border-white/5 opacity-40">
                      <div className="w-5 h-5 rounded bg-gray-500/20 flex items-center justify-center">
                        <span className="text-[8px] text-gray-400">A</span>
                      </div>
                      <p className="text-[10px] text-text-muted flex-1">Another Extension</p>
                      <svg className="w-3.5 h-3.5 text-text-muted" fill="currentColor" viewBox="0 0 24 24"><path d="M16 12l-4-4v3H4v2h8v3l4-4z" transform="rotate(-90 12 12)"/><rect x="10" y="14" width="4" height="8" rx="1"/></svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* # Step 4 — Sign in to the extension */}
          <div className="glass-card p-6 sm:p-8">
            <div className="flex items-start gap-5">
              <div className="w-10 h-10 rounded-full bg-brand-indigo/20 border border-brand-indigo/30 flex items-center justify-center shrink-0 mt-1">
                <span className="text-brand-light font-bold text-lg">4</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white text-lg mb-2">Sign In to the Extension</h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-4">
                  Click the JobPilot AI icon in your toolbar. The first time, it asks you to sign in with the account you created in Step 1.
                  Enter your email and password — you only need to do this once. The extension stays logged in across browser sessions.
                </p>
                <div className="rounded-xl bg-space-700/50 border border-white/5 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded bg-brand-indigo/20 flex items-center justify-center overflow-hidden">
                      <Image src="/jp-logo.svg" alt="JobPilot AI" width={16} height={16} className="rounded" />
                    </div>
                    <p className="text-[10px] font-bold text-white">Sign in to JobPilot AI</p>
                  </div>
                  <div className="space-y-2">
                    <div className="h-7 rounded-lg bg-space-800/80 border border-white/10 flex items-center px-3">
                      <p className="text-[9px] text-text-muted">Email address</p>
                    </div>
                    <div className="h-7 rounded-lg bg-space-800/80 border border-white/10 flex items-center px-3">
                      <p className="text-[9px] text-text-muted">Password</p>
                    </div>
                    <div className="h-7 rounded-lg bg-brand-indigo/80 flex items-center justify-center">
                      <p className="text-[9px] text-white font-semibold">Sign In</p>
                    </div>
                  </div>
                  <p className="text-[9px] text-text-muted text-center mt-2">You only sign in once — stays connected</p>
                </div>
              </div>
            </div>
          </div>

          {/* # Step 5 — Visit a job listing */}
          <div className="glass-card p-6 sm:p-8">
            <div className="flex items-start gap-5">
              <div className="w-10 h-10 rounded-full bg-brand-indigo/20 border border-brand-indigo/30 flex items-center justify-center shrink-0 mt-1">
                <span className="text-brand-light font-bold text-lg">5</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white text-lg mb-2">Browse Any Job Board</h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-4">
                  Go to any supported job board — <span className="text-white font-medium">LinkedIn, Indeed, Glassdoor, Google Jobs</span>, or any of 40+ sites.
                  Find a job you&apos;re interested in and open the full job listing page. The extension works on individual job posting pages, not search results.
                </p>
                <div className="rounded-xl bg-space-700/50 border border-white/5 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full bg-red-500/60" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                    <div className="w-3 h-3 rounded-full bg-green-500/60" />
                    <div className="flex-1 mx-2 h-6 rounded bg-space-800/80 border border-white/10 flex items-center px-2">
                      <p className="text-[8px] text-text-muted truncate">linkedin.com/jobs/view/senior-product-manager-at-google</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-space-800/60 border border-white/5">
                    <p className="text-xs text-white font-bold mb-1">Senior Product Manager</p>
                    <p className="text-[10px] text-text-muted mb-2">Google &middot; Mountain View, CA &middot; $180k–$250k</p>
                    <div className="space-y-1">
                      <div className="h-2 rounded-full bg-white/5 w-full" />
                      <div className="h-2 rounded-full bg-white/5 w-4/5" />
                      <div className="h-2 rounded-full bg-white/5 w-3/4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* # Step 6 — Click the icon & save */}
          <div className="glass-card p-6 sm:p-8">
            <div className="flex items-start gap-5">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-1">
                <span className="text-emerald-400 font-bold text-lg">6</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white text-lg mb-2">Click the Icon &amp; Save</h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-4">
                  Click the <span className="text-white font-medium">JobPilot AI icon</span> in your toolbar. The extension reads the page and auto-extracts the job title, company, location, salary, and description.
                  Review the details, then hit <span className="text-emerald-400 font-medium">&quot;Save to Tracker&quot;</span>. Done — the job is saved with an AI match score.
                </p>
                <div className="rounded-xl bg-space-700/50 border border-white/5 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded bg-brand-indigo/20 flex items-center justify-center overflow-hidden">
                      <Image src="/jp-logo.svg" alt="JobPilot AI" width={16} height={16} className="rounded" />
                    </div>
                    <p className="text-[10px] font-bold text-white">JobPilot AI</p>
                    <span className="ml-auto px-1.5 py-0.5 rounded text-[8px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">Auto-Detected</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="p-2 rounded bg-space-800/80 border border-white/5">
                      <p className="text-[8px] text-text-muted">Title</p>
                      <p className="text-[10px] text-white font-medium">Senior PM</p>
                    </div>
                    <div className="p-2 rounded bg-space-800/80 border border-white/5">
                      <p className="text-[8px] text-text-muted">Company</p>
                      <p className="text-[10px] text-white font-medium">Google</p>
                    </div>
                    <div className="p-2 rounded bg-space-800/80 border border-white/5">
                      <p className="text-[8px] text-text-muted">Location</p>
                      <p className="text-[10px] text-white font-medium">Mountain View</p>
                    </div>
                    <div className="p-2 rounded bg-space-800/80 border border-white/5">
                      <p className="text-[8px] text-text-muted">AI Match</p>
                      <p className="text-[10px] text-emerald-400 font-bold">94%</p>
                    </div>
                  </div>
                  <div className="h-8 rounded-lg bg-emerald-500/80 flex items-center justify-center">
                    <p className="text-[10px] text-white font-bold">Save to Tracker</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* # Step 7 — Track in dashboard */}
          <div className="glass-card p-6 sm:p-8">
            <div className="flex items-start gap-5">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-1">
                <span className="text-emerald-400 font-bold text-lg">7</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white text-lg mb-2">Track Everything in Your Dashboard</h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-4">
                  Open <span className="text-brand-light font-medium">jobpilotai.co/dashboard</span>. Every saved job appears in your Application Tracker instantly — no sync button, no import.
                  Move jobs through stages (Saved → Applied → Interview → Offer), add notes, sort by AI match score, and manage your entire pipeline in one place.
                </p>
                <div className="rounded-xl bg-space-700/50 border border-white/5 p-4">
                  <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">Application Tracker</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-2.5 rounded-lg bg-space-800/60 border border-emerald-500/10">
                      <div className="w-1.5 h-8 rounded-full bg-emerald-500/60" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-white font-medium">Senior Product Manager</p>
                        <p className="text-[8px] text-text-muted">Google &middot; Saved just now</p>
                      </div>
                      <span className="text-[9px] text-emerald-400 font-bold">94%</span>
                      <span className="px-1.5 py-0.5 rounded text-[8px] bg-sky-500/10 text-sky-400 border border-sky-500/20">Saved</span>
                    </div>
                    <div className="flex items-center gap-3 p-2.5 rounded-lg bg-space-800/60 border border-white/5 opacity-50">
                      <div className="w-1.5 h-8 rounded-full bg-amber-500/60" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-white font-medium">Staff Engineer</p>
                        <p className="text-[8px] text-text-muted">Stripe &middot; Applied 2 days ago</p>
                      </div>
                      <span className="text-[9px] text-amber-400 font-bold">87%</span>
                      <span className="px-1.5 py-0.5 rounded text-[8px] bg-amber-500/10 text-amber-400 border border-amber-500/20">Applied</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="mb-20">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-6">
          {faqs.map((faq) => (
            <div key={faq.q} className="glass-card p-6">
              <h3 className="font-bold text-white mb-2">{faq.q}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-card-border bg-space-800/60 p-8 sm:p-10 text-center">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl sm:text-3xl font-bold mb-4">Save Jobs Faster Than Ever</h2>
        <p className="text-text-secondary text-base max-w-xl mx-auto mb-6">One click. Auto-extracted details. AI match scores. Synced to your tracker.</p>
        <Link href="/signup" className="btn-primary inline-block px-8 py-3 text-base">Install Extension Free</Link>
        <p className="text-xs text-text-muted mt-4">Works on Chrome, Edge, Brave, Arc, and all Chromium browsers. Free forever.</p>
      </div>
    </div>
  );
}
