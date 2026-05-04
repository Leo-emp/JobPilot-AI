# JobPilot AI - Your Career Co-Pilot

AI-powered career platform built with Next.js 16, featuring resume optimization, job matching, cover letter generation, and interview prep — all wrapped in a premium space-themed UI.

## Features

- **Resume Intelligence** — Upload your resume and get AI-powered ATS scoring, keyword analysis, full rebuilds, and career pivot mode
- **Job Search & Match** — Paste a job description and get an AI match score with detailed gap analysis
- **Cover Letter Generator** — Generate tailored, professional cover letters in seconds
- **Interview Prep AI** — Predict likely interview questions and practice answers with AI coaching
- **Application Tracker** — Track all your job applications with status management
- **Settings & Billing** — Plan management with Stripe integration for Pro/Enterprise upgrades

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 with custom space theme
- **Database:** SQLite via Prisma ORM + libSQL adapter
- **Auth:** NextAuth.js v5 (Credentials provider, JWT sessions)
- **AI:** Google Gemini (2.5 Flash with auto-fallback)
- **Payments:** Stripe (Checkout, Billing Portal, Webhooks)
- **Fonts:** Geist Sans, Geist Mono, Space Grotesk

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy the `.env.example` or create a `.env` file:

```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="your-secret-here"
AUTH_URL="http://localhost:3000"
GEMINI_API_KEY="your-gemini-api-key"
```

Get a free Gemini API key at: https://aistudio.google.com/apikey

### 3. Set up the database

```bash
npx prisma migrate dev
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login & Signup pages
│   ├── (marketing)/     # Contact, Privacy, Terms pages
│   ├── api/             # API routes (AI, auth, Stripe, CRUD)
│   ├── dashboard/       # Protected app pages (6 features)
│   ├── layout.tsx       # Root layout with fonts & metadata
│   ├── page.tsx         # Landing page
│   └── globals.css      # Space theme (colors, glow, glass cards)
├── components/          # Reusable UI components
├── lib/                 # Auth, Prisma, Stripe config
└── types/               # TypeScript type extensions
prisma/
├── schema.prisma        # Database schema (5 models)
└── migrations/          # SQL migration files
```

## Pricing Model

| Plan | Price | AI Calls |
|------|-------|----------|
| Free | $0/forever | 3/month |
| Pro | $19/month | Unlimited |
| Enterprise | Custom | Unlimited + Team features |

## License

MIT
