/* ============================================================
   JOB SEARCH API - Adzuna Job Board Integration
   ============================================================
   GET /api/jobs/search?q=...&location=...&page=1
   Searches for jobs using the Adzuna API and returns results.
   Falls back to a curated sample if Adzuna keys aren't configured.
   Requires authentication.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

/* ---- Adzuna API Configuration ---- */
const ADZUNA_BASE_URL = "https://api.adzuna.com/v1/api/jobs";

/* ---- Type for Adzuna API response ---- */
interface AdzunaJob {
  id: string;
  title: string;
  company: { display_name: string };
  location: { display_name: string };
  description: string;
  redirect_url: string;
  salary_min?: number;
  salary_max?: number;
  created: string;
  category?: { label: string };
  contract_time?: string;
}

interface AdzunaResponse {
  results: AdzunaJob[];
  count: number;
}

/* ---- GET: Search for jobs ---- */
export async function GET(req: NextRequest) {
  /* Check authentication */
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  /* Parse search parameters */
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";
  const location = searchParams.get("location") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const country = searchParams.get("country") || "us";

  /* Get Adzuna API credentials */
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;

  /* If Adzuna keys aren't configured, return sample data */
  if (!appId || !appKey) {
    return NextResponse.json({
      jobs: getSampleJobs(query, location),
      total: 50,
      page: 1,
      source: "sample",
      message: "Showing sample jobs. Configure ADZUNA_APP_ID and ADZUNA_APP_KEY for real job listings.",
    });
  }

  try {
    /* Build the Adzuna API URL */
    const params = new URLSearchParams({
      app_id: appId,
      app_key: appKey,
      results_per_page: "20",
      what: query,
      content_type: "application/json",
    });

    /* Add location filter if provided */
    if (location) {
      params.set("where", location);
    }

    const url = `${ADZUNA_BASE_URL}/${country}/search/${page}?${params.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Adzuna API error: ${response.status}`);
    }

    const data: AdzunaResponse = await response.json();

    /* Transform Adzuna results into our format */
    const jobs = data.results.map((job) => ({
      id: job.id,
      title: job.title,
      company: job.company?.display_name || "Unknown Company",
      location: job.location?.display_name || "Remote",
      description: job.description,
      url: job.redirect_url,
      salary: formatSalary(job.salary_min, job.salary_max),
      category: job.category?.label || "",
      contractTime: job.contract_time || "",
      postedDate: job.created,
    }));

    return NextResponse.json({
      jobs,
      total: data.count,
      page,
      source: "adzuna",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Job search failed";
    return NextResponse.json(
      { error: message, jobs: getSampleJobs(query, location), source: "sample" },
      { status: 200 }
    );
  }
}

/* ---- Format salary range into readable string ---- */
function formatSalary(min?: number, max?: number): string {
  if (!min && !max) return "";
  if (min && max) {
    return `$${Math.round(min / 1000)}k - $${Math.round(max / 1000)}k`;
  }
  if (min) return `From $${Math.round(min / 1000)}k`;
  if (max) return `Up to $${Math.round(max / 1000)}k`;
  return "";
}

/* ---- Sample Jobs Fallback ---- */
/* Returns realistic sample jobs when Adzuna API is not configured */
function getSampleJobs(query: string, location: string) {
  const title = query || "Software Engineer";
  const loc = location || "Remote";

  return [
    {
      id: "sample-1",
      title: `Senior ${title}`,
      company: "TechCorp Inc.",
      location: loc,
      description: `We're looking for an experienced ${title} to join our growing team. You'll be working on cutting-edge projects, collaborating with cross-functional teams, and mentoring junior developers. Requirements: 5+ years of experience, strong problem-solving skills, and excellent communication abilities. We offer competitive salary, equity, unlimited PTO, and remote work options.`,
      url: "",
      salary: "$120k - $160k",
      category: "IT Jobs",
      contractTime: "full_time",
      postedDate: new Date().toISOString(),
    },
    {
      id: "sample-2",
      title: `${title} - Mid Level`,
      company: "InnovateTech",
      location: loc,
      description: `Join our dynamic team as a ${title}. You'll design and implement scalable solutions, participate in code reviews, and contribute to architectural decisions. We value collaboration, continuous learning, and work-life balance. Requirements: 3+ years of experience, proficiency in modern frameworks, and a passion for clean code.`,
      url: "",
      salary: "$90k - $120k",
      category: "IT Jobs",
      contractTime: "full_time",
      postedDate: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "sample-3",
      title: `Junior ${title}`,
      company: "StartupXYZ",
      location: loc,
      description: `Exciting opportunity for a motivated ${title} to join our fast-growing startup! You'll work directly with senior engineers, ship features rapidly, and have massive impact on our product. Requirements: 1+ years of experience or relevant bootcamp/degree, eagerness to learn, and a growth mindset. We offer mentorship, equity, and flexible hours.`,
      url: "",
      salary: "$65k - $85k",
      category: "IT Jobs",
      contractTime: "full_time",
      postedDate: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: "sample-4",
      title: `Lead ${title}`,
      company: "Enterprise Solutions",
      location: loc,
      description: `We're seeking a Lead ${title} to drive technical strategy and lead a team of 8 engineers. You'll set coding standards, architect solutions for scale, and work closely with product leadership. Requirements: 7+ years of experience, team leadership experience, and expertise in distributed systems. Competitive compensation package with bonus and RSUs.`,
      url: "",
      salary: "$150k - $200k",
      category: "IT Jobs",
      contractTime: "full_time",
      postedDate: new Date(Date.now() - 259200000).toISOString(),
    },
    {
      id: "sample-5",
      title: `${title} (Contract)`,
      company: "ConsultingPro",
      location: "Remote",
      description: `6-month contract role for an experienced ${title}. You'll be embedded in a client team working on a greenfield project. Requirements: 4+ years of experience, ability to work independently, and strong documentation skills. Competitive hourly rate with possibility of extension or conversion to full-time.`,
      url: "",
      salary: "$70 - $95/hr",
      category: "IT Jobs",
      contractTime: "contract",
      postedDate: new Date(Date.now() - 345600000).toISOString(),
    },
    {
      id: "sample-6",
      title: `Remote ${title}`,
      company: "GlobalTech",
      location: "Fully Remote",
      description: `100% remote position for a talented ${title}. Join a distributed team across 15 countries working on products used by millions. Flexible hours, async-first culture, annual team retreats. Requirements: 3+ years of experience, self-motivated, excellent written communication. Salary adjusted by location with transparent bands.`,
      url: "",
      salary: "$80k - $140k",
      category: "IT Jobs",
      contractTime: "full_time",
      postedDate: new Date(Date.now() - 432000000).toISOString(),
    },
  ];
}
