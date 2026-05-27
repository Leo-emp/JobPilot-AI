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
  minimal:      { name: "Minimal",      desc: "Refined elegance with glassmorphism",           accent: "#3b82f6" },
  developer:    { name: "Developer",    desc: "Cyberpunk terminal with neon glow",             accent: "#00ff88" },
  creative:     { name: "Creative",     desc: "Bold gradients & floating glass panels",        accent: "#ec4899" },
  corporate:    { name: "Corporate",    desc: "Luxury serif with navy & gold textures",        accent: "#c8a96e" },
  academic:     { name: "Academic",     desc: "Scholarly paper with elegant citations",        accent: "#2c5282" },
  modern:       { name: "Modern",       desc: "Animated mesh gradient, bento cards",           accent: "#8b5cf6" },
  videographer: { name: "Videographer", desc: "Cinematic widescreen, dark film aesthetic",     accent: "#e50914" },
  photographer: { name: "Photographer", desc: "Full-bleed gallery, image-forward design",     accent: "#f5f5f5" },
  architect:    { name: "Architect",    desc: "Blueprint grid, clean structural lines",        accent: "#2dd4bf" },
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
  about:          { name: "About",          icon: "👤" },
  experience:     { name: "Experience",     icon: "💼" },
  education:      { name: "Education",      icon: "🎓" },
  skills:         { name: "Skills",         icon: "⚡" },
  projects:       { name: "Projects",       icon: "🚀" },
  certifications: { name: "Certifications", icon: "📜" },
  publications:   { name: "Publications",   icon: "📄" },
  awards:         { name: "Awards",         icon: "🏆" },
  gallery:        { name: "Gallery",        icon: "🖼️" },
  testimonials:   { name: "Testimonials",   icon: "💬" },
  contact:        { name: "Contact",        icon: "📧" },
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
