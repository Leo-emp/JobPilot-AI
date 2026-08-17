/* ============================================================
   GITHUB SOURCING — Search GitHub for candidates
   ============================================================
   Uses the GitHub public API to find developers by skills,
   language, and location. Fetches profile + repo data to
   build an external candidate profile.

   Rate limits:
   - Unauthenticated: 10 search requests/min, 60 core/hr
   - With GITHUB_TOKEN: 30 search/min, 5000 core/hr
   ============================================================ */

/* # Represents a raw GitHub user profile + repos */
export interface GitHubProfile {
  login: string;
  name: string | null;
  email: string | null;
  bio: string | null;
  location: string | null;
  publicRepos: number;
  followers: number;
  profileUrl: string;
  languages: string[];       // # Aggregated from top repos
  topRepos: Array<{
    name: string;
    description: string | null;
    language: string | null;
    stars: number;
    forks: number;
  }>;
}

/* # Build GitHub search query from role requirements */
export function buildGitHubSearchQuery(
  skills: string[],
  location?: string | null,
): string {
  /* # GitHub search syntax: language:X location:Y followers:>N */
  const parts: string[] = [];

  /* # Map common skill names to GitHub language filters */
  const languageMap: Record<string, string> = {
    javascript: "javascript",
    typescript: "typescript",
    python: "python",
    java: "java",
    go: "go",
    rust: "rust",
    ruby: "ruby",
    php: "php",
    swift: "swift",
    kotlin: "kotlin",
    "c#": "csharp",
    "c++": "cpp",
  };

  /* # Add language filters for skills that match programming languages */
  const matchedLanguages: string[] = [];
  for (const skill of skills.slice(0, 3)) {
    const lang = languageMap[skill.toLowerCase()];
    if (lang) {
      matchedLanguages.push(lang);
    }
  }

  /* # Use the first matched language as the primary filter */
  if (matchedLanguages.length > 0) {
    parts.push(`language:${matchedLanguages[0]}`);
  }

  /* # Add location if provided */
  if (location) {
    parts.push(`location:${location}`);
  }

  /* # Only find users with meaningful activity */
  parts.push("followers:>5");
  parts.push("repos:>3");

  /* # Add remaining skills as keyword search */
  const keywordSkills = skills
    .filter((s) => !languageMap[s.toLowerCase()])
    .slice(0, 3);
  if (keywordSkills.length > 0) {
    parts.unshift(keywordSkills.join(" "));
  }

  return parts.join(" ");
}

/* # Search GitHub for users matching a query */
export async function searchGitHubUsers(
  query: string,
  maxResults: number = 20,
): Promise<GitHubProfile[]> {
  const token = process.env.GITHUB_TOKEN;

  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "JobPilot-AI-Sourcing",
  };

  /* # Add auth header if token available (30 search req/min vs 10) */
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    /* # Search users endpoint */
    const searchUrl = `https://api.github.com/search/users?q=${encodeURIComponent(query)}&per_page=${Math.min(maxResults, 30)}&sort=followers&order=desc`;

    const searchRes = await fetch(searchUrl, {
      headers,
      signal: AbortSignal.timeout(15000),
    });

    if (!searchRes.ok) {
      /* # Rate limited or API error — return empty, don't crash */
      console.warn(`[github-sourcing] Search API returned ${searchRes.status}`);
      return [];
    }

    const searchData = await searchRes.json();
    const users = searchData.items ?? [];

    /* # Fetch detailed profile + repos for each user (limit concurrency) */
    const profiles: GitHubProfile[] = [];

    for (const user of users.slice(0, maxResults)) {
      try {
        const profile = await fetchGitHubProfile(user.login, headers);
        if (profile) {
          profiles.push(profile);
        }
      } catch {
        /* # Skip individual profile fetch errors */
        continue;
      }
    }

    return profiles;
  } catch (err) {
    console.error("[github-sourcing] Search failed:", err);
    return [];
  }
}

/* # Fetch detailed profile + top repos for a GitHub user */
async function fetchGitHubProfile(
  login: string,
  headers: Record<string, string>,
): Promise<GitHubProfile | null> {
  /* # Fetch user profile and repos in parallel */
  const [userRes, reposRes] = await Promise.all([
    fetch(`https://api.github.com/users/${login}`, {
      headers,
      signal: AbortSignal.timeout(10000),
    }),
    fetch(`https://api.github.com/users/${login}/repos?sort=stars&per_page=10`, {
      headers,
      signal: AbortSignal.timeout(10000),
    }),
  ]);

  if (!userRes.ok) return null;

  const userData = await userRes.json();
  const reposData = reposRes.ok ? await reposRes.json() : [];

  /* # Extract languages from top repos */
  const languageCounts: Record<string, number> = {};
  const topRepos = (Array.isArray(reposData) ? reposData : [])
    .filter((r: { fork: boolean }) => !r.fork)
    .slice(0, 10)
    .map((r: {
      name: string;
      description: string | null;
      language: string | null;
      stargazers_count: number;
      forks_count: number;
    }) => {
      if (r.language) {
        languageCounts[r.language] = (languageCounts[r.language] ?? 0) + 1;
      }
      return {
        name: r.name,
        description: r.description,
        language: r.language,
        stars: r.stargazers_count,
        forks: r.forks_count,
      };
    });

  /* # Sort languages by frequency */
  const languages = Object.entries(languageCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([lang]) => lang);

  return {
    login: userData.login,
    name: userData.name,
    email: userData.email,
    bio: userData.bio,
    location: userData.location,
    publicRepos: userData.public_repos,
    followers: userData.followers,
    profileUrl: userData.html_url,
    languages,
    topRepos,
  };
}
