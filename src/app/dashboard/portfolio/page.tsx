/* ============================================================
   PORTFOLIO BUILDER — Dashboard Editor
   ============================================================
   Full portfolio management page with:
   - Template picker (6 premium templates)
   - Section list (reorder, toggle visibility, edit)
   - Per-section edit forms
   - Live preview panel (renders actual template at scale)
   - Publish bar (slug, copy link, toggle)
   - Import from Resume button
   ============================================================ */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import type {
  PortfolioData, PortfolioSection, TemplateName, SectionType,
  ExperienceEntry, EducationEntry, SkillGroup, ProjectEntry,
  CertificationEntry, PublicationEntry, AwardEntry, GalleryEntry,
  TestimonialEntry,
} from "@/lib/portfolio-types";
import { TEMPLATES, TEMPLATE_INFO, SECTION_TYPES, SECTION_INFO, getDefaultSections } from "@/lib/portfolio-types";

/* # Lazy-load the renderer so the editor bundle stays lean */
const PortfolioRenderer = dynamic(() => import("@/components/portfolio/PortfolioRenderer").then(m => ({ default: m.PortfolioRenderer })), { ssr: false });

/* ---- Tabs for the editor sidebar ---- */
const editorTabs = [
  { id: "template", label: "Template" },
  { id: "sections", label: "Sections" },
  { id: "settings", label: "Settings" },
];

/* ---- Empty entries for adding new items ---- */
const EMPTY_EXPERIENCE: ExperienceEntry = { title: "", company: "", location: "", startDate: "", endDate: "", description: "", achievements: [] };
const EMPTY_EDUCATION: EducationEntry = { degree: "", school: "", location: "", startDate: "", endDate: "", description: "" };
const EMPTY_PROJECT: ProjectEntry = { title: "", description: "", techStack: [], liveUrl: "", repoUrl: "", imageUrl: "" };
const EMPTY_CERTIFICATION: CertificationEntry = { name: "", issuer: "", date: "", link: "" };
const EMPTY_PUBLICATION: PublicationEntry = { title: "", venue: "", date: "", link: "" };
const EMPTY_AWARD: AwardEntry = { title: "", issuer: "", date: "", description: "" };
const EMPTY_GALLERY: GalleryEntry = { title: "", description: "", imageUrl: "", link: "" };
const EMPTY_TESTIMONIAL: TestimonialEntry = { quote: "", author: "", role: "", company: "" };

export default function PortfolioPage() {
  const { data: session } = useSession();

  /* ---- Core state ---- */
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasPortfolio, setHasPortfolio] = useState(false);
  const [portfolioId, setPortfolioId] = useState("");

  /* ---- Portfolio data ---- */
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [template, setTemplate] = useState<TemplateName>("minimal");
  const [sections, setSections] = useState<PortfolioSection[]>(getDefaultSections());
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({});
  const [avatarUrl, setAvatarUrl] = useState("");
  const [published, setPublished] = useState(false);

  /* ---- Editor state ---- */
  const [activeTab, setActiveTab] = useState("template");
  const [editingSection, setEditingSection] = useState<number | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [slugError, setSlugError] = useState("");
  const [copied, setCopied] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ---- Fetch existing portfolio on mount ---- */
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/portfolio");
        if (res.ok) {
          const { portfolio } = await res.json();
          setHasPortfolio(true);
          setPortfolioId(portfolio.id);
          setSlug(portfolio.slug);
          setTitle(portfolio.title);
          setTagline(portfolio.tagline || "");
          setTemplate(portfolio.template);
          setSections(portfolio.sections);
          setSocialLinks(portfolio.socialLinks || {});
          setAvatarUrl(portfolio.avatarUrl || "");
          setPublished(portfolio.published);
        }
      } catch { /* # No portfolio yet — that's fine */ }
      setLoading(false);
    }
    load();
  }, []);

  /* ---- Create portfolio ---- */
  const createPortfolio = useCallback(async () => {
    if (!slug.trim() || !title.trim()) return;
    setSaving(true);
    setSlugError("");
    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, title, tagline, template }),
      });
      if (res.ok) {
        const { portfolio } = await res.json();
        setHasPortfolio(true);
        setPortfolioId(portfolio.id);
        setSections(portfolio.sections);
        setPublished(false);
      } else {
        const data = await res.json();
        if (res.status === 409) setSlugError("This URL is already taken.");
        else setSlugError(data.error || "Failed to create portfolio.");
      }
    } catch { setSlugError("Network error. Please try again."); }
    setSaving(false);
  }, [slug, title, tagline, template]);

  /* ---- Auto-save on changes (debounced) ---- */
  const savePortfolio = useCallback(async (updates: Record<string, unknown>) => {
    if (!hasPortfolio) return;
    setSaving(true);
    try {
      await fetch("/api/portfolio", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
    } catch { /* # Silent fail — will retry on next change */ }
    setSaving(false);
  }, [hasPortfolio]);

  const debouncedSave = useCallback((updates: Record<string, unknown>) => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => savePortfolio(updates), 800);
  }, [savePortfolio]);

  /* ---- Section helpers ---- */
  const updateSection = useCallback((index: number, updated: PortfolioSection) => {
    setSections(prev => {
      const next = [...prev];
      next[index] = updated;
      debouncedSave({ sections: JSON.stringify(next) });
      return next;
    });
  }, [debouncedSave]);

  const toggleSectionVisibility = useCallback((index: number) => {
    setSections(prev => {
      const next = [...prev];
      next[index] = { ...next[index], visible: !next[index].visible };
      debouncedSave({ sections: JSON.stringify(next) });
      return next;
    });
  }, [debouncedSave]);

  const moveSection = useCallback((from: number, to: number) => {
    if (to < 0 || to >= sections.length) return;
    setSections(prev => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      debouncedSave({ sections: JSON.stringify(next) });
      return next;
    });
  }, [sections.length, debouncedSave]);

  const addSection = useCallback((type: SectionType) => {
    const existing = sections.find(s => s.type === type);
    if (existing) return;

    let newSection: PortfolioSection;
    switch (type) {
      case "about": newSection = { type, visible: true, bio: "", tagline: "", avatarUrl: "", socialLinks: {} }; break;
      case "experience": newSection = { type, visible: true, entries: [] }; break;
      case "education": newSection = { type, visible: true, entries: [] }; break;
      case "skills": newSection = { type, visible: true, groups: [] }; break;
      case "projects": newSection = { type, visible: true, entries: [] }; break;
      case "certifications": newSection = { type, visible: true, entries: [] }; break;
      case "publications": newSection = { type, visible: true, entries: [] }; break;
      case "awards": newSection = { type, visible: true, entries: [] }; break;
      case "gallery": newSection = { type, visible: true, entries: [] }; break;
      case "testimonials": newSection = { type, visible: true, entries: [] }; break;
      case "contact": newSection = { type, visible: true, email: "", phone: "", location: "", calendarLink: "", socialLinks: {} }; break;
      default: return;
    }
    setSections(prev => {
      const next = [...prev, newSection];
      debouncedSave({ sections: JSON.stringify(next) });
      return next;
    });
  }, [sections, debouncedSave]);

  const removeSection = useCallback((index: number) => {
    setSections(prev => {
      const next = prev.filter((_, i) => i !== index);
      debouncedSave({ sections: JSON.stringify(next) });
      return next;
    });
    setEditingSection(null);
  }, [debouncedSave]);

  /* ---- Publish toggle ---- */
  const togglePublish = useCallback(async () => {
    const newState = !published;
    try {
      const res = await fetch("/api/portfolio/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: newState }),
      });
      if (res.ok) setPublished(newState);
    } catch { /* # Network error */ }
  }, [published]);

  /* ---- Copy link ---- */
  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(`https://jobpilotai.co/p/${slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [slug]);

  /* ---- Import from resume ---- */
  const importResume = useCallback(async () => {
    setImportLoading(true);
    try {
      const res = await fetch("/api/portfolio/import", { method: "POST" });
      if (res.ok) {
        const { sections: imported } = await res.json();
        setSections(imported);
        debouncedSave({ sections: JSON.stringify(imported) });
      }
    } catch { /* # No resume to import */ }
    setImportLoading(false);
  }, [debouncedSave]);

  /* ---- Template change ---- */
  const changeTemplate = useCallback((t: TemplateName) => {
    setTemplate(t);
    debouncedSave({ template: t });
  }, [debouncedSave]);

  /* ---- Build preview data object ---- */
  const previewData: PortfolioData = {
    id: portfolioId,
    slug,
    title: title || session?.user?.name || "Your Name",
    tagline: tagline || null,
    bio: null,
    template,
    themeColors: null,
    socialLinks: Object.keys(socialLinks).length > 0 ? socialLinks : null,
    avatarUrl: avatarUrl || session?.user?.image || null,
    published,
    sections,
    userName: session?.user?.name || "User",
    userImage: session?.user?.image || null,
  };

  /* ---- Loading state ---- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  /* ---- Creation form (no portfolio yet) ---- */
  if (!hasPortfolio) {
    return (
      <div className="max-w-xl mx-auto py-20 px-6">
        <h1 className="text-3xl font-bold text-white mb-2 font-[family-name:var(--font-space-grotesk)]">
          Create Your Portfolio
        </h1>
        <p className="text-text-secondary mb-8">Build a premium, shareable portfolio website in minutes.</p>

        {/* # Name / Title */}
        <label className="block text-sm font-medium text-text-secondary mb-1">Display Name</label>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder={session?.user?.name || "Your Name"}
          className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-indigo mb-4" />

        <label className="block text-sm font-medium text-text-secondary mb-1">Tagline</label>
        <input value={tagline} onChange={e => setTagline(e.target.value)} placeholder="Full-Stack Developer & AI Enthusiast"
          className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-indigo mb-4" />

        {/* # Slug */}
        <label className="block text-sm font-medium text-text-secondary mb-1">Portfolio URL</label>
        <div className="flex items-center gap-0 mb-1">
          <span className="px-3 py-3 rounded-l-xl bg-space-800 border border-r-0 border-card-border text-text-muted text-sm">
            jobpilotai.co/p/
          </span>
          <input value={slug} onChange={e => { setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")); setSlugError(""); }}
            placeholder="your-name" maxLength={40}
            className="flex-1 px-4 py-3 rounded-r-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-indigo" />
        </div>
        {slugError && <p className="text-red-400 text-xs mb-4">{slugError}</p>}

        {/* # Template picker */}
        <label className="block text-sm font-medium text-text-secondary mb-3 mt-6">Choose a Template</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
          {TEMPLATES.map(t => (
            <button key={t} onClick={() => setTemplate(t)}
              className={`p-4 rounded-xl border text-left transition-all ${
                template === t
                  ? "border-brand-indigo bg-brand-indigo/10 ring-2 ring-brand-indigo/30"
                  : "border-card-border bg-space-700 hover:border-text-muted"
              }`}>
              <div className="w-6 h-6 rounded-full mb-2" style={{ backgroundColor: TEMPLATE_INFO[t].accent }} />
              <p className="text-sm font-semibold text-white">{TEMPLATE_INFO[t].name}</p>
              <p className="text-xs text-text-muted mt-0.5">{TEMPLATE_INFO[t].desc}</p>
            </button>
          ))}
        </div>

        <button onClick={createPortfolio} disabled={saving || !slug.trim() || !title.trim()}
          className="w-full py-3 rounded-xl font-semibold text-white bg-brand-indigo hover:bg-brand-indigo/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
          {saving ? "Creating..." : "Create Portfolio"}
        </button>

        <button onClick={importResume} disabled={importLoading}
          className="w-full mt-3 py-3 rounded-xl font-semibold text-text-secondary border border-card-border hover:bg-space-700 transition-all">
          {importLoading ? "Importing..." : "Import from Resume"}
        </button>
      </div>
    );
  }

  /* ---- Main Editor ---- */
  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* ---- Left: Editor Panel ---- */}
      <div className={`w-full ${showPreview ? "lg:w-1/2" : "lg:w-full"} max-w-3xl mx-auto lg:mx-0 px-4 py-6 overflow-y-auto`}>
        {/* # Top bar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-space-grotesk)]">Portfolio Editor</h1>
            <p className="text-sm text-text-muted">
              {saving ? "Saving..." : "All changes auto-saved"}
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowPreview(!showPreview)}
              className="px-4 py-2 rounded-xl text-sm font-medium border border-card-border text-text-secondary hover:text-white hover:bg-space-700 transition-all">
              {showPreview ? "Hide Preview" : "Show Preview"}
            </button>
            <button onClick={togglePublish}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                published
                  ? "bg-green-500/15 text-green-400 border border-green-500/30 hover:bg-green-500/25"
                  : "bg-brand-indigo text-white hover:bg-brand-indigo/90"
              }`}>
              {published ? "Published" : "Publish"}
            </button>
          </div>
        </div>

        {/* # Publish bar */}
        {published && (
          <div className="flex items-center gap-2 mb-6 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
            <span className="text-green-400 text-sm flex-1 truncate">
              jobpilotai.co/p/{slug}
            </span>
            <button onClick={copyLink} className="px-3 py-1 rounded-lg text-xs font-medium bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-all">
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>
        )}

        {/* # Editor tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl bg-space-700">
          {editorTabs.map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setEditingSection(null); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-brand-indigo text-white"
                  : "text-text-muted hover:text-white"
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ---- Template Picker Tab ---- */}
        {activeTab === "template" && (
          <div>
            <p className="text-sm text-text-muted mb-4">Choose a template that matches your style. You can switch anytime.</p>
            <div className="grid grid-cols-2 gap-3">
              {TEMPLATES.map(t => (
                <button key={t} onClick={() => changeTemplate(t)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    template === t
                      ? "border-brand-indigo bg-brand-indigo/10 ring-2 ring-brand-indigo/30"
                      : "border-card-border bg-space-700 hover:border-text-muted"
                  }`}>
                  <div className="w-8 h-8 rounded-full mb-3" style={{ backgroundColor: TEMPLATE_INFO[t].accent }} />
                  <p className="text-sm font-semibold text-white">{TEMPLATE_INFO[t].name}</p>
                  <p className="text-xs text-text-muted mt-0.5">{TEMPLATE_INFO[t].desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ---- Sections Tab ---- */}
        {activeTab === "sections" && editingSection === null && (
          <div>
            <p className="text-sm text-text-muted mb-4">Drag to reorder, toggle visibility, or click to edit content.</p>

            {/* # Section list */}
            <div className="space-y-2 mb-6">
              {sections.map((section, i) => (
                <div key={`${section.type}-${i}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-space-700 border border-card-border group">
                  {/* # Reorder buttons */}
                  <div className="flex flex-col gap-0.5">
                    <button onClick={() => moveSection(i, i - 1)} disabled={i === 0}
                      className="text-text-muted hover:text-white disabled:opacity-20 text-xs">▲</button>
                    <button onClick={() => moveSection(i, i + 1)} disabled={i === sections.length - 1}
                      className="text-text-muted hover:text-white disabled:opacity-20 text-xs">▼</button>
                  </div>

                  {/* # Section info */}
                  <span className="text-lg">{SECTION_INFO[section.type]?.icon}</span>
                  <span className="flex-1 text-sm font-medium text-white">{SECTION_INFO[section.type]?.name || section.type}</span>

                  {/* # Visibility toggle */}
                  <button onClick={() => toggleSectionVisibility(i)}
                    className={`w-10 h-5 rounded-full transition-colors ${section.visible ? "bg-green-500" : "bg-space-600"}`}>
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${section.visible ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>

                  {/* # Edit */}
                  <button onClick={() => setEditingSection(i)}
                    className="px-3 py-1 rounded-lg text-xs text-text-muted hover:text-white hover:bg-space-600 transition-all">
                    Edit
                  </button>

                  {/* # Remove */}
                  <button onClick={() => removeSection(i)}
                    className="px-2 py-1 rounded-lg text-xs text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100">
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* # Add section */}
            <div className="border-t border-card-border pt-4">
              <p className="text-sm font-medium text-text-secondary mb-3">Add a Section</p>
              <div className="flex flex-wrap gap-2">
                {SECTION_TYPES.filter(t => !sections.find(s => s.type === t)).map(type => (
                  <button key={type} onClick={() => addSection(type)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-card-border text-text-muted hover:text-white hover:bg-space-700 transition-all">
                    <span>{SECTION_INFO[type].icon}</span>
                    {SECTION_INFO[type].name}
                  </button>
                ))}
              </div>
            </div>

            {/* # Import from resume */}
            <button onClick={importResume} disabled={importLoading}
              className="mt-6 w-full py-3 rounded-xl text-sm font-medium border border-card-border text-text-secondary hover:text-white hover:bg-space-700 transition-all">
              {importLoading ? "Importing from resume..." : "Import from Resume"}
            </button>
          </div>
        )}

        {/* ---- Section Edit Form ---- */}
        {activeTab === "sections" && editingSection !== null && (
          <SectionEditForm
            section={sections[editingSection]}
            onUpdate={(updated) => updateSection(editingSection, updated)}
            onBack={() => setEditingSection(null)}
          />
        )}

        {/* ---- Settings Tab ---- */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Display Name</label>
              <input value={title} onChange={e => { setTitle(e.target.value); debouncedSave({ title: e.target.value }); }}
                className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white focus:outline-none focus:ring-2 focus:ring-brand-indigo" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Tagline</label>
              <input value={tagline} onChange={e => { setTagline(e.target.value); debouncedSave({ tagline: e.target.value }); }}
                className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white focus:outline-none focus:ring-2 focus:ring-brand-indigo" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Avatar URL</label>
              <input value={avatarUrl} onChange={e => { setAvatarUrl(e.target.value); debouncedSave({ avatarUrl: e.target.value }); }}
                placeholder="https://..." className="w-full px-4 py-3 rounded-xl bg-space-700 border border-card-border text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-indigo" />
            </div>

            {/* # Social links */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-3">Social Links</label>
              {["github", "linkedin", "twitter", "website", "youtube", "behance", "dribbble"].map(platform => (
                <div key={platform} className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-text-muted w-16 capitalize">{platform}</span>
                  <input value={socialLinks[platform] || ""} placeholder={`https://${platform}.com/...`}
                    onChange={e => {
                      const next = { ...socialLinks, [platform]: e.target.value };
                      if (!e.target.value) delete next[platform];
                      setSocialLinks(next);
                      debouncedSave({ socialLinks: JSON.stringify(next) });
                    }}
                    className="flex-1 px-3 py-2 rounded-lg bg-space-700 border border-card-border text-white text-sm placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-indigo" />
                </div>
              ))}
            </div>

            {/* # Slug */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Portfolio URL</label>
              <div className="flex items-center gap-0">
                <span className="px-3 py-3 rounded-l-xl bg-space-800 border border-r-0 border-card-border text-text-muted text-sm">
                  jobpilotai.co/p/
                </span>
                <input value={slug} readOnly
                  className="flex-1 px-3 py-3 rounded-r-xl bg-space-700 border border-card-border text-text-muted text-sm cursor-not-allowed" />
              </div>
              <p className="text-xs text-text-muted mt-1">Slug cannot be changed after creation.</p>
            </div>

            {/* # Danger zone */}
            <div className="border-t border-card-border pt-6">
              <h3 className="text-sm font-semibold text-red-400 mb-3">Danger Zone</h3>
              <button onClick={async () => {
                if (!confirm("Are you sure? This will permanently delete your portfolio.")) return;
                await fetch("/api/portfolio", { method: "DELETE" });
                setHasPortfolio(false);
                setPortfolioId("");
                setSections(getDefaultSections());
                setPublished(false);
              }}
                className="px-4 py-2 rounded-xl text-sm font-medium text-red-400 border border-red-500/30 hover:bg-red-500/10 transition-all">
                Delete Portfolio
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ---- Right: Live Preview ---- */}
      {showPreview && (
        <div className="hidden lg:block flex-1 border-l border-card-border bg-space-900 overflow-hidden">
          <div className="sticky top-0 z-10 px-4 py-2 border-b border-card-border bg-space-800 flex items-center justify-between">
            <span className="text-xs text-text-muted">Live Preview</span>
            <span className="text-xs text-text-muted">{TEMPLATE_INFO[template].name} Template</span>
          </div>
          <div className="overflow-y-auto" style={{ height: "calc(100vh - 40px)" }}>
            <div style={{ transform: "scale(0.5)", transformOrigin: "top left", width: "200%" }}>
              <PortfolioRenderer data={previewData} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   SECTION EDIT FORM — renders per-section editing fields
   ============================================================ */

function SectionEditForm({
  section,
  onUpdate,
  onBack,
}: {
  section: PortfolioSection;
  onUpdate: (s: PortfolioSection) => void;
  onBack: () => void;
}) {
  const sectionInfo = SECTION_INFO[section.type];

  return (
    <div>
      {/* # Back button + title */}
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-text-muted hover:text-white mb-4 transition-colors">
        <span>←</span> Back to Sections
      </button>
      <h3 className="text-lg font-bold text-white mb-1">
        {sectionInfo?.icon} {sectionInfo?.name || section.type}
      </h3>
      <p className="text-xs text-text-muted mb-6">Edit the content for this section.</p>

      {/* # Render the right form based on section type */}
      {section.type === "about" && (
        <AboutForm section={section} onUpdate={onUpdate} />
      )}
      {section.type === "experience" && (
        <EntriesForm section={section} onUpdate={onUpdate} emptyEntry={EMPTY_EXPERIENCE} label="Experience" />
      )}
      {section.type === "education" && (
        <EntriesForm section={section} onUpdate={onUpdate} emptyEntry={EMPTY_EDUCATION} label="Education" />
      )}
      {section.type === "skills" && (
        <SkillsForm section={section} onUpdate={onUpdate} />
      )}
      {section.type === "projects" && (
        <EntriesForm section={section} onUpdate={onUpdate} emptyEntry={EMPTY_PROJECT} label="Project" />
      )}
      {section.type === "certifications" && (
        <EntriesForm section={section} onUpdate={onUpdate} emptyEntry={EMPTY_CERTIFICATION} label="Certification" />
      )}
      {section.type === "publications" && (
        <EntriesForm section={section} onUpdate={onUpdate} emptyEntry={EMPTY_PUBLICATION} label="Publication" />
      )}
      {section.type === "awards" && (
        <EntriesForm section={section} onUpdate={onUpdate} emptyEntry={EMPTY_AWARD} label="Award" />
      )}
      {section.type === "gallery" && (
        <EntriesForm section={section} onUpdate={onUpdate} emptyEntry={EMPTY_GALLERY} label="Gallery Item" />
      )}
      {section.type === "testimonials" && (
        <EntriesForm section={section} onUpdate={onUpdate} emptyEntry={EMPTY_TESTIMONIAL} label="Testimonial" />
      )}
      {section.type === "contact" && (
        <ContactForm section={section} onUpdate={onUpdate} />
      )}
    </div>
  );
}

/* ---- Styled input helper ---- */
function Field({ label, value, onChange, placeholder, type = "text", multiline = false }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; multiline?: boolean;
}) {
  const cls = "w-full px-3 py-2 rounded-lg bg-space-700 border border-card-border text-white text-sm placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-indigo";
  return (
    <div className="mb-3">
      <label className="block text-xs font-medium text-text-muted mb-1">{label}</label>
      {multiline ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} className={cls} />
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={cls} />
      )}
    </div>
  );
}

/* ---- About section form ---- */
function AboutForm({ section, onUpdate }: { section: PortfolioSection & { type: "about" }; onUpdate: (s: PortfolioSection) => void }) {
  return (
    <div>
      <Field label="Bio" value={section.bio} onChange={v => onUpdate({ ...section, bio: v })} placeholder="Tell people about yourself..." multiline />
      <Field label="Tagline" value={section.tagline} onChange={v => onUpdate({ ...section, tagline: v })} placeholder="Full-Stack Developer" />
      <Field label="Avatar URL" value={section.avatarUrl} onChange={v => onUpdate({ ...section, avatarUrl: v })} placeholder="https://..." />
    </div>
  );
}

/* ---- Contact section form ---- */
function ContactForm({ section, onUpdate }: { section: PortfolioSection & { type: "contact" }; onUpdate: (s: PortfolioSection) => void }) {
  return (
    <div>
      <Field label="Email" value={section.email} onChange={v => onUpdate({ ...section, email: v })} placeholder="you@email.com" type="email" />
      <Field label="Phone" value={section.phone} onChange={v => onUpdate({ ...section, phone: v })} placeholder="+1 (555) 123-4567" />
      <Field label="Location" value={section.location} onChange={v => onUpdate({ ...section, location: v })} placeholder="San Francisco, CA" />
      <Field label="Calendar Link" value={section.calendarLink} onChange={v => onUpdate({ ...section, calendarLink: v })} placeholder="https://calendly.com/..." />
    </div>
  );
}

/* ---- Skills section form ---- */
function SkillsForm({ section, onUpdate }: { section: PortfolioSection & { type: "skills" }; onUpdate: (s: PortfolioSection) => void }) {
  const addGroup = () => {
    onUpdate({ ...section, groups: [...section.groups, { category: "New Category", skills: [] }] });
  };
  const updateGroup = (gi: number, g: typeof section.groups[0]) => {
    const next = [...section.groups];
    next[gi] = g;
    onUpdate({ ...section, groups: next });
  };
  const removeGroup = (gi: number) => {
    onUpdate({ ...section, groups: section.groups.filter((_, i) => i !== gi) });
  };

  return (
    <div>
      {section.groups.map((group, gi) => (
        <div key={gi} className="mb-4 p-4 rounded-xl bg-space-700 border border-card-border">
          <div className="flex justify-between mb-3">
            <input value={group.category} onChange={e => updateGroup(gi, { ...group, category: e.target.value })}
              className="bg-transparent text-sm font-semibold text-white focus:outline-none" placeholder="Category Name" />
            <button onClick={() => removeGroup(gi)} className="text-xs text-red-400/60 hover:text-red-400">Remove</button>
          </div>
          {/* # Skills list */}
          <div className="space-y-2">
            {group.skills.map((skill, si) => (
              <div key={si} className="flex items-center gap-2">
                <input value={skill.name} placeholder="Skill name"
                  onChange={e => {
                    const next = [...group.skills];
                    next[si] = { ...skill, name: e.target.value };
                    updateGroup(gi, { ...group, skills: next });
                  }}
                  className="flex-1 px-2 py-1 rounded bg-space-600 border border-card-border text-white text-sm focus:outline-none" />
                <button onClick={() => {
                  updateGroup(gi, { ...group, skills: group.skills.filter((_, i) => i !== si) });
                }} className="text-xs text-red-400/40 hover:text-red-400">×</button>
              </div>
            ))}
          </div>
          <button onClick={() => updateGroup(gi, { ...group, skills: [...group.skills, { name: "" }] })}
            className="mt-2 text-xs text-brand-light hover:underline">
            + Add Skill
          </button>
        </div>
      ))}
      <button onClick={addGroup} className="text-sm text-brand-light hover:underline">+ Add Category</button>
    </div>
  );
}

/* ---- Generic entries form (experience, education, projects, etc.) ---- */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function EntriesForm({ section, onUpdate, emptyEntry, label }: {
  section: PortfolioSection;
  onUpdate: (s: PortfolioSection) => void;
  emptyEntry: any;
  label: string;
}) {
  /* # Get entries array from the section (works for all entry-based sections) */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const entries: any[] = "entries" in section ? (section as any).entries : [];

  const addEntry = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onUpdate({ ...section, entries: [...entries, { ...emptyEntry }] } as any);
  };

  const updateEntry = (index: number, field: string, value: unknown) => {
    const next = [...entries];
    next[index] = { ...next[index], [field]: value };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onUpdate({ ...section, entries: next } as any);
  };

  const removeEntry = (index: number) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onUpdate({ ...section, entries: entries.filter((_: any, i: number) => i !== index) } as any);
  };

  /* # Render fields based on the entry shape */
  const fieldKeys = Object.keys(emptyEntry).filter(k => k !== "achievements" && k !== "techStack");

  return (
    <div>
      {entries.map((entry, i) => (
        <div key={i} className="mb-4 p-4 rounded-xl bg-space-700 border border-card-border">
          <div className="flex justify-between mb-3">
            <span className="text-xs font-medium text-text-muted">{label} {i + 1}</span>
            <button onClick={() => removeEntry(i)} className="text-xs text-red-400/60 hover:text-red-400">Remove</button>
          </div>
          {fieldKeys.map(key => (
            <Field key={key} label={key.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())}
              value={String(entry[key] || "")} onChange={v => updateEntry(i, key, v)}
              multiline={key === "description" || key === "bio" || key === "quote"} />
          ))}

          {/* # Achievements (experience) */}
          {"achievements" in emptyEntry && (
            <div className="mt-2">
              <label className="block text-xs font-medium text-text-muted mb-1">Achievements</label>
              {((entry.achievements || []) as string[]).map((a, ai) => (
                <div key={ai} className="flex gap-2 mb-1">
                  <input value={a} onChange={e => {
                    const next = [...(entry.achievements as string[])];
                    next[ai] = e.target.value;
                    updateEntry(i, "achievements", next);
                  }} className="flex-1 px-2 py-1 rounded bg-space-600 border border-card-border text-white text-sm focus:outline-none" />
                  <button onClick={() => {
                    updateEntry(i, "achievements", (entry.achievements as string[]).filter((_, j) => j !== ai));
                  }} className="text-xs text-red-400/40 hover:text-red-400">×</button>
                </div>
              ))}
              <button onClick={() => updateEntry(i, "achievements", [...(entry.achievements as string[] || []), ""])}
                className="text-xs text-brand-light hover:underline">+ Add Achievement</button>
            </div>
          )}

          {/* # Tech stack (projects) */}
          {"techStack" in emptyEntry && (
            <div className="mt-2">
              <label className="block text-xs font-medium text-text-muted mb-1">Tech Stack (comma-separated)</label>
              <input value={((entry.techStack || []) as string[]).join(", ")}
                onChange={e => updateEntry(i, "techStack", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                className="w-full px-2 py-1 rounded bg-space-600 border border-card-border text-white text-sm focus:outline-none"
                placeholder="React, TypeScript, Node.js" />
            </div>
          )}
        </div>
      ))}
      <button onClick={addEntry} className="text-sm text-brand-light hover:underline">+ Add {label}</button>
    </div>
  );
}
