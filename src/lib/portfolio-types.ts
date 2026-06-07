/* ============================================================
   PORTFOLIO TYPE DEFINITIONS
   ============================================================
   Typed section system for the portfolio builder.
   11 section types, each with its own data shape.
   Sections are stored as a JSON array in the Portfolio model.
   ============================================================ */

/* ---- Template names ---- */
export const TEMPLATES = [
  "minimal", "developer", "creative", "corporate", "academic", "modern",
  "videographer", "photographer", "architect",
] as const;

export type TemplateName = (typeof TEMPLATES)[number];

/* ---- Template display info for the picker UI ---- */
export const TEMPLATE_INFO: Record<TemplateName, { name: string; desc: string; accent: string }> = {
  minimal:      { name: "Minimal",      desc: "Pearl × Graphite — clean edge-to-edge typography",   accent: "#a8a29e" },
  developer:    { name: "Developer",    desc: "Emerald × Cyan — terminal aesthetic, matrix glow",   accent: "#059669" },
  creative:     { name: "Creative",     desc: "Teal × Magenta — bold gradients, stacked cards",     accent: "#0891b2" },
  corporate:    { name: "Corporate",    desc: "Gold × Warm Ivory — luxury serif, executive feel",   accent: "#b8960c" },
  academic:     { name: "Academic",     desc: "Sapphire × Steel Blue — scholarly paper style",      accent: "#1d4ed8" },
  modern:       { name: "Modern",       desc: "Violet × Electric Blue — mesh gradient, bento grid", accent: "#7c3aed" },
  videographer: { name: "Videographer", desc: "Crimson × Amber — cinematic widescreen, film grain", accent: "#b91c1c" },
  photographer: { name: "Photographer", desc: "Rose × Golden Peach — full-bleed gallery, lightbox", accent: "#be185d" },
  architect:    { name: "Architect",    desc: "Copper × Navy Steel — blueprint grid, plan view",    accent: "#c2410c" },
};

/* ---- Section types ---- */
export const SECTION_TYPES = [
  "about", "experience", "education", "skills", "projects",
  "certifications", "publications", "awards", "gallery",
  "testimonials", "contact",
] as const;

export type SectionType = (typeof SECTION_TYPES)[number];

/* ---- Section display info ---- */
export const SECTION_INFO: Record<SectionType, { name: string; icon: string }> = {
  about:          { name: "About",          icon: "U" },
  experience:     { name: "Experience",     icon: "B" },
  education:      { name: "Education",      icon: "E" },
  skills:         { name: "Skills",         icon: "S" },
  projects:       { name: "Projects",       icon: "P" },
  certifications: { name: "Certifications", icon: "C" },
  publications:   { name: "Publications",   icon: "D" },
  awards:         { name: "Awards",         icon: "A" },
  gallery:        { name: "Gallery",        icon: "G" },
  testimonials:   { name: "Testimonials",   icon: "T" },
  contact:        { name: "Contact",        icon: "M" },
};

/* ---- Section data shapes ---- */

export interface AboutSection {
  type: "about";
  visible: boolean;
  bio: string;
  tagline: string;
  avatarUrl: string;
  socialLinks: Record<string, string>;
}

export interface ExperienceEntry {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  achievements: string[];
}

export interface ExperienceSection {
  type: "experience";
  visible: boolean;
  entries: ExperienceEntry[];
}

export interface EducationEntry {
  degree: string;
  school: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface EducationSection {
  type: "education";
  visible: boolean;
  entries: EducationEntry[];
}

export interface SkillGroup {
  category: string;
  skills: { name: string; proficiency?: number }[];
}

export interface SkillsSection {
  type: "skills";
  visible: boolean;
  groups: SkillGroup[];
}

export interface ProjectEntry {
  title: string;
  description: string;
  techStack: string[];
  liveUrl: string;
  repoUrl: string;
  imageUrl: string;
  videoUrl: string;
}

export interface ProjectsSection {
  type: "projects";
  visible: boolean;
  entries: ProjectEntry[];
}

export interface CertificationEntry {
  name: string;
  issuer: string;
  date: string;
  link: string;
}

export interface CertificationsSection {
  type: "certifications";
  visible: boolean;
  entries: CertificationEntry[];
}

export interface PublicationEntry {
  title: string;
  venue: string;
  date: string;
  link: string;
}

export interface PublicationsSection {
  type: "publications";
  visible: boolean;
  entries: PublicationEntry[];
}

export interface AwardEntry {
  title: string;
  issuer: string;
  date: string;
  description: string;
}

export interface AwardsSection {
  type: "awards";
  visible: boolean;
  entries: AwardEntry[];
}

export interface GalleryEntry {
  title: string;
  description: string;
  imageUrl: string;
  videoUrl: string;
  category: string;
  link: string;
}

export interface GallerySection {
  type: "gallery";
  visible: boolean;
  entries: GalleryEntry[];
}

export interface TestimonialEntry {
  quote: string;
  author: string;
  role: string;
  company: string;
}

export interface TestimonialsSection {
  type: "testimonials";
  visible: boolean;
  entries: TestimonialEntry[];
}

export interface ContactSection {
  type: "contact";
  visible: boolean;
  email: string;
  phone: string;
  location: string;
  calendarLink: string;
  socialLinks: Record<string, string>;
}

/* ---- Union type for all sections ---- */
export type PortfolioSection =
  | AboutSection
  | ExperienceSection
  | EducationSection
  | SkillsSection
  | ProjectsSection
  | CertificationsSection
  | PublicationsSection
  | AwardsSection
  | GallerySection
  | TestimonialsSection
  | ContactSection;

/* ---- Theme colors ---- */
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}

/* ---- Full portfolio data for rendering ---- */
export interface PortfolioData {
  id: string;
  slug: string;
  title: string;
  tagline: string | null;
  bio: string | null;
  template: TemplateName;
  themeColors: ThemeColors | null;
  socialLinks: Record<string, string> | null;
  avatarUrl: string | null;
  published: boolean;
  sections: PortfolioSection[];
  userName: string;
  userImage: string | null;
}

/* ---- Default sections for a new portfolio ---- */
export function getDefaultSections(): PortfolioSection[] {
  return [
    { type: "about", visible: true, bio: "", tagline: "", avatarUrl: "", socialLinks: {} },
    { type: "experience", visible: true, entries: [] },
    { type: "education", visible: true, entries: [] },
    { type: "skills", visible: true, groups: [] },
    { type: "projects", visible: true, entries: [] },
    { type: "contact", visible: true, email: "", phone: "", location: "", calendarLink: "", socialLinks: {} },
  ];
}
