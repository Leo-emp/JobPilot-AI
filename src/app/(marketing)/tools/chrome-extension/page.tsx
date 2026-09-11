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
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-center mb-10">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {[
            { step: "1", title: "Install the Extension", desc: "Add JobPilot AI to Chrome in one click. Sign in with your existing account." },
            { step: "2", title: "Browse & Save Jobs", desc: "Visit any job listing. Click the extension icon. Job details are extracted automatically." },
            { step: "3", title: "Track in Your Dashboard", desc: "Saved jobs appear in your tracker with AI match scores. Track, apply, and manage your pipeline." },
          ].map((s) => (
            <div key={s.step} className="text-center">
              <div className="w-12 h-12 rounded-full bg-brand-indigo/20 border border-brand-indigo/30 flex items-center justify-center mx-auto mb-4">
                <span className="text-brand-light font-bold text-lg">{s.step}</span>
              </div>
              <h3 className="font-bold mb-2">{s.title}</h3>
              <p className="text-sm text-text-secondary">{s.desc}</p>
            </div>
          ))}
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
