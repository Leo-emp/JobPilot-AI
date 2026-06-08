# Premium Elevation — Landing Page Design Spec

**Date:** 2026-06-08
**Direction:** High-end, clean, sophisticated, luxury SaaS. Airy yet authoritative.
**Approach:** Premium dark tech — refine execution, not redesign. Same theme, same content, elevated craft.

## Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Direction | Premium dark tech | Keep space theme, elevate execution details |
| Glow text | Replace with subtle gradients | Text-shadow glow reads gaming/crypto, gradients read premium |
| Navbar | Keep current full-width, refine | Floating pill is trendy but marginal difference |
| Typography | Keep Space Grotesk + Geist | Fits space theme, already working well |

## Changes

### 1. Spacing — Airy Atmosphere

The single biggest lever. Luxury = room to breathe.

**Sections:**
- Hero: `pt-32 pb-36 sm:pt-40 sm:pb-44 lg:pt-48 lg:pb-52` (was `pt-24 pb-32 sm:pt-32 sm:pb-36 lg:pt-40 lg:pb-44`)
- Standard sections: `py-32 sm:py-40` (was `py-24 sm:py-32`)
- Compact sections (TrustBar): `py-16 sm:py-20` (was `py-12 sm:py-16`)
- CTA section: `py-36 sm:py-44` (extra tall for dramatic finale)

**Section headers:**
- Margin below: `mb-20 sm:mb-24` (was `mb-16 sm:mb-20`)

**Cards:**
- Inner padding: `p-8 sm:p-10` (was `p-7`)
- Grid gap: `gap-6` (was `gap-5`)
- Feature showcase spacing: `space-y-32 sm:space-y-40` (was `space-y-24 sm:space-y-32`)

**Files:** Hero.tsx, TrustBar.tsx, Features.tsx, FeatureShowcase.tsx, EcosystemShowcase.tsx, HowItWorks.tsx, Testimonials.tsx, Pricing.tsx, CTA.tsx, NewsletterSignup.tsx

### 2. Background Noise Texture

Add a subtle SVG noise overlay to the body via CSS pseudo-element. Opacity ~0.015-0.02. Breaks up flat black, adds tactile depth.

Implementation: Inline SVG noise filter in `globals.css` on `body::after` with `position: fixed`, `pointer-events: none`, `z-index: 1` (below content at z-10).

**Files:** globals.css

### 3. Gradient Text — Replace All Glow

**Remove:**
- `.glow-text` — cyan color + text-shadow
- `.glow-text-subtle` — cyan + text-shadow

**Replace with:**
- `.glow-text` → white-to-blue gradient text, no text-shadow
- `.glow-text-subtle` → lighter gradient variant, no text-shadow
- `.glow-text-strong` (hero title) — keep gradient, remove `filter: drop-shadow`

**Files:** globals.css

### 4. Card Refinement

**Glass card base:**
- Padding: `p-8 sm:p-10` (was `p-7` on features, `p-6 sm:p-8` on others)
- Border: `rgba(255,255,255,0.05)` (was `0.07`)
- Border-radius: keep `12px`

**Glass card hover:**
- Remove border-color change on hover
- Replace with soft radial box-shadow glow: `box-shadow: 0 0 40px rgba(56,189,248,0.06), 0 0 80px rgba(56,189,248,0.03)`
- Keep subtle border brighten but less aggressive: `rgba(255,255,255,0.08)` (was `rgba(56,189,248,0.18)`)

**Feature cards:**
- Reduce hover lift from `y: -4` to `y: -2`
- Hover border: `border-white/[0.08]` instead of `border-brand-indigo/30`

**Files:** globals.css, Features.tsx

### 5. Typography Weight Contrast

**Headings:** Stay at 700 (authoritative)

**Body/description text:** Drop to `font-light` (300) on supporting paragraphs. Creates a sharper hierarchy — bold headings feel even bolder next to light body text.

Applies to:
- Hero description
- Feature card descriptions
- FeatureShowcase descriptions and bullet text
- EcosystemShowcase descriptions and bullet text
- HowItWorks step descriptions
- Testimonial quotes
- Pricing feature row labels
- CTA supporting text
- Newsletter description

**Section labels** (FEATURES, HOW IT WORKS, etc.): Increase letter-spacing from `tracking-widest` to `tracking-[0.2em]` for more refinement.

**Files:** All landing page components

### 6. Visual Rhythm — Alternating Section Heights

Create a breathe-dense-breathe pattern:

| Section | Padding | Feel |
|---------|---------|------|
| Hero | Extra tall | Airy entrance |
| TrustBar | Compact | Data-dense, intentional |
| Features | Tall | Breathing room around grid |
| FeatureShowcase | Standard | Content-heavy, density OK |
| EcosystemShowcase | Standard | Same as showcase |
| HowItWorks | Tall | Clean, spacious steps |
| Testimonials | Tall | Let quotes breathe |
| Pricing | Standard | Functional density |
| CTA | Extra tall | Dramatic finale |
| Newsletter | Compact | Quick capture |

**Files:** All landing page components (via padding changes)

### 7. Section Dividers

Add subtle gradient fade lines at 3 major transitions:
- After TrustBar (before Features)
- Before HowItWorks
- Before Pricing

Implementation: A `<div>` with `h-px` and `background: linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)` with `max-w-4xl mx-auto`.

**Files:** page.tsx (add divider elements between sections)

## What Does NOT Change

- All content, features, copy, and section order
- Space theme + starfield + shooting stars
- Component structure and Framer Motion animations
- Color palette (#3b82f6 blue accent, #09090b background)
- Space Grotesk (display) + Geist Sans (body) fonts
- Responsive breakpoints and mobile layout
- All functionality (newsletter form, pricing toggle, nav links)

## Files Modified

| File | Changes |
|------|---------|
| `globals.css` | Noise texture, gradient text classes, card hover, body text weight |
| `page.tsx` | Add section dividers |
| `Hero.tsx` | Spacing, body font weight |
| `TrustBar.tsx` | Spacing |
| `Features.tsx` | Spacing, card padding/gap, hover refinement, font weight |
| `FeatureShowcase.tsx` | Spacing, font weight |
| `EcosystemShowcase.tsx` | Spacing, font weight |
| `HowItWorks.tsx` | Spacing, font weight |
| `Testimonials.tsx` | Spacing, card padding, font weight |
| `Pricing.tsx` | Spacing, font weight |
| `CTA.tsx` | Spacing, font weight |
| `NewsletterSignup.tsx` | Spacing, font weight |
