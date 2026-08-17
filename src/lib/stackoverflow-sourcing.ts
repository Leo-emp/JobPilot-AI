/* ============================================================
   STACK OVERFLOW SOURCING — Search SO for candidates
   ============================================================
   Uses the Stack Exchange public API to find developers by
   tags (skills), reputation, and location.

   Rate limits:
   - Without key: 300 requests/day
   - With STACKOVERFLOW_KEY: 10,000 requests/day
   - Responses are always gzip-compressed by the API

   API docs: https://api.stackexchange.com/docs
   ============================================================ */

/* # Represents a raw Stack Overflow user profile */
export interface StackOverflowProfile {
  userId: number;
  displayName: string;
  profileUrl: string;
  websiteUrl: string | null;
  location: string | null;
  reputation: number;
  topTags: string[];          // # Top answer tags (proxy for skills)
  answerCount: number;
  questionCount: number;
}

/* # Build SO search parameters from role requirements */
export function buildSOSearchParams(
  skills: string[],
  minReputation: number = 500,
): URLSearchParams {
  const params = new URLSearchParams({
    site: "stackoverflow",
    order: "desc",
    sort: "reputation",
    min: String(minReputation),
    pagesize: "20",
    filter: "!9_bDE(fI5",     // # Custom filter for user + basic fields
  });

  /* # Add API key if available (higher rate limits) */
  const apiKey = process.env.STACKOVERFLOW_KEY;
  if (apiKey) {
    params.set("key", apiKey);
  }

  /* # SO uses "tagged" for tag-based filtering on answers/questions */
  /* # For user search, we search by inname or use the /users endpoint */
  if (skills.length > 0) {
    params.set("inname", skills[0]);
  }

  return params;
}

/* # Search Stack Overflow for users with relevant skills */
export async function searchStackOverflowUsers(
  skills: string[],
  maxResults: number = 15,
): Promise<StackOverflowProfile[]> {
  if (skills.length === 0) return [];

  try {
    /* # Search for users — SO API returns gzip by default */
    const params = buildSOSearchParams(skills);
    params.set("pagesize", String(Math.min(maxResults, 30)));

    const url = `https://api.stackexchange.com/2.3/users?${params.toString()}`;

    const res = await fetch(url, {
      headers: { "Accept-Encoding": "gzip" },
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      console.warn(`[so-sourcing] API returned ${res.status}`);
      return [];
    }

    const data = await res.json();
    const users = data.items ?? [];

    /* # Fetch top tags for each user to determine skills */
    const profiles: StackOverflowProfile[] = [];

    for (const user of users.slice(0, maxResults)) {
      try {
        const profile = await enrichSOProfile(user, skills);
        if (profile) {
          profiles.push(profile);
        }
      } catch {
        continue;
      }
    }

    return profiles;
  } catch (err) {
    console.error("[so-sourcing] Search failed:", err);
    return [];
  }
}

/* # Enrich a basic SO user with their top tags */
async function enrichSOProfile(
  user: {
    user_id: number;
    display_name: string;
    link: string;
    website_url?: string;
    location?: string;
    reputation: number;
    answer_count: number;
    question_count: number;
  },
  targetSkills: string[],
): Promise<StackOverflowProfile | null> {
  /* # Fetch user's top answer tags */
  const params = new URLSearchParams({
    site: "stackoverflow",
    pagesize: "10",
  });
  const apiKey = process.env.STACKOVERFLOW_KEY;
  if (apiKey) params.set("key", apiKey);

  const tagsUrl = `https://api.stackexchange.com/2.3/users/${user.user_id}/top-answer-tags?${params.toString()}`;

  let topTags: string[] = [];

  try {
    const tagsRes = await fetch(tagsUrl, {
      headers: { "Accept-Encoding": "gzip" },
      signal: AbortSignal.timeout(10000),
    });

    if (tagsRes.ok) {
      const tagsData = await tagsRes.json();
      topTags = (tagsData.items ?? []).map(
        (t: { tag_name: string }) => t.tag_name,
      );
    }
  } catch {
    /* # Tags fetch failed — still include the user with empty tags */
  }

  /* # Check if any of the user's top tags overlap with target skills */
  const normalizedTarget = targetSkills.map((s) => s.toLowerCase());
  const hasRelevantSkill = topTags.some((tag) =>
    normalizedTarget.includes(tag.toLowerCase()),
  );

  /* # Skip users with no relevant skills unless they have high reputation */
  if (!hasRelevantSkill && user.reputation < 5000) {
    return null;
  }

  return {
    userId: user.user_id,
    displayName: user.display_name,
    profileUrl: user.link,
    websiteUrl: user.website_url ?? null,
    location: user.location ?? null,
    reputation: user.reputation,
    topTags,
    answerCount: user.answer_count,
    questionCount: user.question_count,
  };
}
