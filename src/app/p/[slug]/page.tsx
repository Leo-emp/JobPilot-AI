/* ============================================================
   PUBLIC PORTFOLIO PAGE — Server component for SEO
   ============================================================
   Renders at jobpilotai.co/p/[slug]. Server-side fetches the
   portfolio data, generates dynamic OG meta tags for rich social
   sharing, then passes data to the client PortfolioRenderer
   (which needs Framer Motion, hence the split).
   ============================================================ */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { PortfolioData, TemplateName } from "@/lib/portfolio-types";
import { TEMPLATES } from "@/lib/portfolio-types";
import { PortfolioRenderer } from "@/components/portfolio/PortfolioRenderer";

/* # Fetch the portfolio record — shared between generateMetadata and the page */
async function getPortfolio(slug: string) {
  const portfolio = await prisma.portfolio.findUnique({
    where: { slug },
    include: { user: { select: { name: true, image: true } } },
  });

  if (!portfolio || !portfolio.published) return null;

  return {
    id: portfolio.id,
    slug: portfolio.slug,
    title: portfolio.title,
    tagline: portfolio.tagline,
    bio: portfolio.bio,
    template: (TEMPLATES.includes(portfolio.template as TemplateName) ? portfolio.template : "minimal") as TemplateName,
    themeColors: portfolio.themeColors ? JSON.parse(portfolio.themeColors) : null,
    socialLinks: portfolio.socialLinks ? JSON.parse(portfolio.socialLinks) : null,
    avatarUrl: portfolio.avatarUrl,
    published: portfolio.published,
    sections: JSON.parse(portfolio.sections),
    userName: portfolio.user.name ?? "User",
    userImage: portfolio.user.image ?? null,
  } satisfies PortfolioData;
}

/* # Dynamic OG meta tags — powers rich link previews on social media */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPortfolio(slug);
  if (!data) return { title: "Portfolio Not Found" };

  const title = data.title || data.userName;
  const description = data.tagline || `${data.userName}'s professional portfolio`;

  return {
    title: `${title} — Portfolio`,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      url: `https://jobpilotai.co/p/${slug}`,
      ...(data.avatarUrl && { images: [{ url: data.avatarUrl, width: 400, height: 400 }] }),
    },
    twitter: {
      card: "summary",
      title,
      description,
      ...(data.avatarUrl && { images: [data.avatarUrl] }),
    },
  };
}

export default async function PortfolioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getPortfolio(slug);

  if (!data) notFound();

  return <PortfolioRenderer data={data} />;
}
