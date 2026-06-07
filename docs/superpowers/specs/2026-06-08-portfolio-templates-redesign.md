# Portfolio Templates v2 — Premium Landing Page Redesign

**Date:** 2026-06-08  
**Status:** Approved  
**Scope:** Full visual redesign of all 9 portfolio templates + editor skill proficiency slider

---

## 1. Design Philosophy

Every template must feel like a **polished brand showcase landing page**, not a digital resume. Key principles:

- Full-viewport hero sections with cinematic presence
- Projects, gallery images, and videos are the visual centerpieces
- Glassmorphism cards, radial glow effects, SVG decorative patterns
- Framer Motion scroll-triggered animations throughout
- Each template is **structurally different** — unique layout grids, not just color swaps
- Dark-theme foundation with per-template dual-tone gradient palette
- Real demo images from Unsplash/picsum (themed per template purpose)

---

## 2. Dual-Tone Color Palettes

Each template is built around a **signature two-color gradient blend** with 4 derived tones:

| Template | Blend Name | Primary Gradient | Highlight | Mid-Dark | Background |
|---|---|---|---|---|---|
| **Modern** | Violet × Electric Blue | `#7c3aed → #4f46e5` | `#c7d2fe` | `#1e1b4b` | `#0c0a1a` |
| **Creative** | Teal × Magenta | `#0891b2 → #db2777` | `#67e8f9 → #fbcfe8` | `#164e63 → #4a1942` | `#060d1a` |
| **Developer** | Emerald × Cyan | `#059669 → #0d9488` | `#a7f3d0 → #99f6e4` | `#134e4a → #164e63` | `#021a17` |
| **Corporate** | Gold × Warm Ivory | `#b8960c → #92400e` | `#f5e6b8 → #fef7e0` | `#292524` | `#0c0a09` |
| **Academic** | Sapphire × Steel Blue | `#1d4ed8 → #2563eb` | `#93c5fd → #cbd5e1` | `#1e3a5f` | `#0a1628` |
| **Minimal** | Pearl × Graphite | `#f5f5f4 → #e7e5e4` | `#a8a29e` | `#57534e` | `#0c0a09` |
| **Videographer** | Crimson × Amber | `#b91c1c → #f59e0b` | `#fca5a5 → #fde68a` | `#451a03 → #7f1d1d` | `#0a0505` |
| **Photographer** | Rose × Golden Peach | `#be185d → #fb923c` | `#fbcfe8 → #fed7aa` | `#4a1942 → #431407` | `#0a0608` |
| **Architect** | Copper × Navy Steel | `#c2410c → #64748b` | `#fdba74 → #94a3b8` | `#1e293b` | `#0f172a` |

Each palette produces:
- **Signature gradient bar** — the primary dual-tone used for skill bars, dividers, and accent lines
- **Glass card borders** — `rgba(primary, 0.1)` border with `backdrop-filter: blur(8px)`
- **Radial glow orbs** — positioned absolutely, `rgba(primary, 0.08-0.12)` with large radial gradients
- **Text hierarchy** — white for headings, highlight color for labels, `rgba(255,255,255, 0.4-0.5)` for body

---

## 3. Template-Specific SVG Patterns

Each template has a signature decorative SVG element rendered at low opacity (~3-5%):

| Template | Pattern | Description |
|---|---|---|
| Modern | Constellation dots | Random small circles connected by thin lines |
| Creative | Geometric scatter | Rotated triangles, circles, rectangles floating |
| Developer | Matrix rain | Vertical columns of fading monospace characters |
| Corporate | Diagonal pinstripes | Fine 45° lines at 0.5px weight |
| Academic | Molecular orbits | Atom-like concentric ellipses with dots |
| Minimal | Single rule lines | Horizontal hairline at 0.5px |
| Videographer | Horizontal scanlines | Repeating 2px-spaced lines |
| Photographer | Aperture rings | Concentric circles (camera lens motif) |
| Architect | Blueprint grid | 20px square grid in accent color |

---

## 4. Section Layouts — 27 Unique Structures

### 4.1 Hero Sections (per template)

| Template | Hero Layout |
|---|---|
| Modern | Full-viewport gradient background + floating radial orb + centered name |
| Creative | Split diagonal background + dual-color splash effect |
| Developer | Terminal window frame with blinking cursor + prompt-style name |
| Corporate | Centered serif title card + horizontal stats bar |
| Academic | Journal-style header block with affiliation and metrics |
| Minimal | Edge-to-edge typography, large whitespace, thin rule separator |
| Videographer | Cinematic letterbox (black bars top/bottom) + film grain overlay |
| Photographer | Full-bleed hero photo with name overlay and camera metadata |
| Architect | Technical plan-view header with dimension lines and specs |

### 4.2 Projects Layouts

| Template | Layout | Structure |
|---|---|---|
| Modern | Floating Bento Grid | `grid: 4col × 2row`, featured spans 2×2, others 1×1 |
| Creative | Stacked Overlap Cards | 2×2 equal grid, each card with image + gradient overlay + tags |
| Developer | Terminal Tiles | Cards styled as terminal windows with title bar dots |
| Corporate | Case Study Spread | Featured left (60%), stats + secondary right (40%) |
| Academic | Research Paper Cards | Cards with DOI-style metadata, citation count, abstract |
| Minimal | Full-Width Horizontal Scroll | Single row, horizontal scroll, `scroll-snap-x` |
| Videographer | Film Strip Reel | Horizontal strip with sprocket holes, thumbnail + timecode |
| Photographer | Pinterest Masonry Wall | 3-column masonry with varied heights, camera EXIF overlays |
| Architect | Technical Plan View | Featured + grid below, blueprint grid background, sq.ft specs |

### 4.3 Gallery Layouts

| Template | Layout | Structure |
|---|---|---|
| Modern | Floating Glass Masonry | 3-column masonry, glass-border cards, hover scale |
| Creative | Duotone Collage | Mixed-size tiles with duotone hover filter effect |
| Developer | Code Screenshot Grid | Even grid, monospace captions, dark card backgrounds |
| Corporate | Editorial Full-Bleed | Alternating full-width / 2-column with editorial captions |
| Academic | Figure Plates | Academic figure style: `Fig. 1`, `Fig. 2` captions below |
| Minimal | Single-Column Full-Width | One image per row, edge-to-edge, minimal caption below |
| Videographer | Contact Sheet | Dense grid mimicking film contact sheet, frame numbers |
| Photographer | Masonry + Lightbox | Masonry grid, click opens full-screen lightbox overlay |
| Architect | Gridline Plates | Grid with technical gridlines, material labels |

### 4.4 Video Layouts

| Template | Layout | Structure |
|---|---|---|
| Modern | Orb-Glow Player | Centered player, radial glow behind, floating metadata |
| Creative | Split-Screen Feature | Video left (60%), description + tags right (40%) |
| Developer | Terminal Playback | Player inside terminal window frame, ASCII progress bar |
| Corporate | Presentation Stage | Stage-style frame with podium/curtain aesthetic |
| Academic | Lecture Embed | Journal-figure style embed with DOI-style reference |
| Minimal | Edge-to-Edge Clean | Full-width player, no chrome, thin progress line |
| Videographer | Full Cinema Widescreen | 21:9 letterbox with film grain, REC indicator, timecode |
| Photographer | Behind-the-Scenes | Smaller player with surrounding BTS photo thumbnails |
| Architect | Walkthrough Window | Player with blueprint frame, dimension annotations |

---

## 5. Skills Proficiency System

### 5.1 Data Model

Already in place — `portfolio-types.ts` line 98:
```typescript
skills: { name: string; proficiency?: number }[];
```
`proficiency` is `1-100` (integer). Default when omitted: render bar at 0% (hidden until set).

### 5.2 Editor UI

Add a **range slider** (`<input type="range" min="1" max="100">`) next to each skill in the portfolio editor (`src/app/dashboard/portfolio/page.tsx`). Shows numeric value and updates in real-time.

### 5.3 Portfolio Render

Each template renders proficiency as an **animated gradient bar**:
- Bar background: `rgba(255,255,255, 0.04)`
- Bar fill: template's signature dual-tone gradient (`linear-gradient(90deg, primaryA, primaryB)`)
- Fill width: `proficiency%`
- Animation: Framer Motion `initial={{ width: 0 }}` → `animate={{ width: proficiency% }}` on scroll into view
- Glow: `box-shadow: 0 0 12px rgba(primary, 0.3)` on the fill
- Percentage text shown to the right of the bar

---

## 6. Demo Content Strategy

### 6.1 Image Sources

- **Primary:** Unsplash CDN — `https://images.unsplash.com/photo-{ID}?w={w}&h={h}&fit=crop&auto=format`
- **Backup:** picsum.photos — `https://picsum.photos/seed/{theme}/{w}/{h}` (guaranteed delivery)
- **Fallback:** CSS gradient background with "DEMO" text overlay (JS `onerror` handler)

### 6.2 Demo Image Themes

| Template | Projects | Gallery | Video Thumbnails |
|---|---|---|---|
| Modern | SaaS dashboards, mobile apps, code editors | Tech workspace, product shots | Product demos, app walkthroughs |
| Creative | Brand identities, UI redesigns, packaging | Design process, mockups, studio | Motion graphics, brand films |
| Developer | GitHub repos, terminal UIs, API docs | Code screenshots, architecture | Conference talks, live coding |
| Corporate | Strategy decks, exec dashboards | Conference stages, boardrooms | Keynotes, corporate films |
| Academic | Research papers, lab equipment, data viz | Campus, lab work, whiteboards | Lectures, presentations |
| Minimal | Clean product shots, editorial layouts | B&W photography, abstract textures | Silent process, product reveals |
| Videographer | Film stills, BTS, color grades | On-set photos, equipment | Brand films, documentaries |
| Photographer | Photo series, wedding, editorial | Landscapes, street, portraits, architecture | BTS of shoots, timelapse |
| Architect | Luxury homes, interiors, commercial | Exteriors, materials, construction | 3D walkthroughs, drone flyovers |

### 6.3 Demo Content Flow

1. **Template picker** — shows demos so users see the full visual potential
2. **Editor preview** — unfilled slots show demo content as placeholder
3. **Published portfolio** — shows ONLY user's real content, no demos

### 6.4 Demo Constants

Each template file exports a `DEMO_CONTENT` constant containing 8-12 curated image URLs + sample text, co-located with the template component.

---

## 7. Shared Visual Components

### 7.1 Updates to Existing Components

| Component | Changes |
|---|---|
| `SkillBar.tsx` | Rewrite: gradient fill, glow effect, percentage display, scroll-triggered animation |
| `SectionWrapper.tsx` | Add support for SVG pattern backgrounds per template |
| `VideoEmbed.tsx` | Add template-aware styling (letterbox, terminal, etc.) |
| `SectionDivider.tsx` | Gradient line using template's dual-tone palette |
| `SocialIcons.tsx` | Glass-style icon buttons with hover glow |
| `StatsBar.tsx` | Animated counter numbers with template accent colors |

### 7.2 New Shared Elements

| Component | Purpose |
|---|---|
| `GlassCard` | Reusable glassmorphism card (backdrop-blur, frosted border, glow) |
| `GlowOrb` | Positioned radial gradient orb for ambient lighting |
| `ImageWithFallback` | `<img>` wrapper with Unsplash → picsum → CSS gradient fallback chain |

---

## 8. Animation System

All animations use Framer Motion with scroll-triggered reveals:

| Animation | Usage | Config |
|---|---|---|
| Fade-up | Section headings, cards | `initial={{ opacity: 0, y: 20 }}` → `whileInView={{ opacity: 1, y: 0 }}` |
| Stagger children | Grid items, skill bars | `staggerChildren: 0.08` in parent `variants` |
| Skill bar fill | Proficiency bars | `initial={{ width: 0 }}` → `whileInView={{ width: n% }}`, `duration: 1` |
| Scale on hover | Project/gallery cards | `whileHover={{ scale: 1.02 }}`, `transition: { duration: 0.2 }` |
| Counter | Stats numbers | Count from 0 to value using `useMotionValue` + `useTransform` |

All animations respect `prefers-reduced-motion` — disable transforms, keep opacity.

---

## 9. Files to Modify

### 9.1 Core (4 files)

| File | Change |
|---|---|
| `src/lib/portfolio-types.ts` | Update `TEMPLATE_INFO` accent colors and descriptions to match new palettes |
| `src/components/portfolio/SkillBar.tsx` | Full rewrite: gradient bar + glow + animation |
| `src/app/dashboard/portfolio/page.tsx` | Add proficiency range slider to skills editor |
| `src/components/portfolio/PortfolioRenderer.tsx` | Pass updated props if needed |

### 9.2 Shared Components (6 files)

| File | Change |
|---|---|
| `src/components/portfolio/SectionWrapper.tsx` | SVG pattern backgrounds |
| `src/components/portfolio/SocialIcons.tsx` | Glass-style buttons |
| `src/components/portfolio/StatsBar.tsx` | Animated counters |
| `src/components/portfolio/SectionDivider.tsx` | Gradient divider |
| `src/components/portfolio/VideoEmbed.tsx` | Template-aware styling |
| `src/components/portfolio/ImageWithFallback.tsx` | **New** — fallback chain |

### 9.3 Template Rewrites (9 files)

Each template file gets a **full rewrite** with its unique:
- Hero section
- Color palette constants
- SVG pattern
- Projects layout
- Gallery layout
- Video layout
- Skills rendering (using shared SkillBar)
- Demo content constants
- Framer Motion animations

| File | ~Lines | Template |
|---|---|---|
| `src/components/portfolio/templates/ModernTemplate.tsx` | 950 | Violet × Electric Blue |
| `src/components/portfolio/templates/CreativeTemplate.tsx` | 924 | Teal × Magenta |
| `src/components/portfolio/templates/DeveloperTemplate.tsx` | 1102 | Emerald × Cyan |
| `src/components/portfolio/templates/CorporateTemplate.tsx` | 896 | Gold × Warm Ivory |
| `src/components/portfolio/templates/AcademicTemplate.tsx` | 862 | Sapphire × Steel Blue |
| `src/components/portfolio/templates/MinimalTemplate.tsx` | 876 | Pearl × Graphite |
| `src/components/portfolio/templates/VideographerTemplate.tsx` | 834 | Crimson × Amber |
| `src/components/portfolio/templates/PhotographerTemplate.tsx` | 757 | Rose × Golden Peach |
| `src/components/portfolio/templates/ArchitectTemplate.tsx` | 917 | Copper × Navy Steel |

---

## 10. Implementation Order

1. **Shared foundations** — `ImageWithFallback`, `GlassCard`, `GlowOrb`, update `SkillBar`
2. **Editor changes** — proficiency slider in portfolio editor
3. **Template rewrites** — one at a time, starting with Modern (reference implementation), then remaining 8
4. **Update TEMPLATE_INFO** — new accent colors and descriptions
5. **QA pass** — verify all demo images load, check responsive behavior, test reduced motion

---

## 11. Responsive Behavior

All templates must be fully responsive:

| Breakpoint | Behavior |
|---|---|
| Desktop (≥1024px) | Full layout as designed |
| Tablet (768-1023px) | Bento grids collapse to 2 columns, horizontal scrolls become vertical |
| Mobile (<768px) | Single column, stacked sections, full-width images, touch-friendly |

---

## 12. Constraints

- No new npm dependencies — Framer Motion is already installed
- All images loaded via CDN URLs — no local storage
- Template components remain self-contained (no cross-template imports)
- Backward compatible — existing user data renders without migration
- `proficiency` field is optional — old portfolios without it render bars at 0% or hidden
