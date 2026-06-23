// Live GitHub data for the homepage activity widget. Fetched server-side with
// an hourly ISR cache so the public, unauthenticated API is hit at most once an
// hour regardless of traffic. Every path is defensive: any failure returns null
// and the widget renders nothing — the page never breaks on a GitHub hiccup.
//
// We surface recently-*pushed public repos* (not the events feed): this account
// does most work in private repos, so the public events feed is empty, but the
// public repo list reliably reflects what's being worked on.

const GITHUB_USER = "tonyx1998";
const REVALIDATE_SECONDS = 3600;

export type RepoSummary = {
  name: string;
  description: string | null;
  url: string;
  language: string | null;
  stars: number;
  pushedAt: string; // ISO
};

export type GitHubActivity = {
  publicRepos: number;
  totalStars: number;
  profileUrl: string;
  repos: RepoSummary[];
};

const headers: HeadersInit = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  // GitHub requires a User-Agent on every request.
  "User-Agent": "toyinyu-portfolio",
};

type GitHubUser = {
  public_repos?: number;
  html_url?: string;
};

type GitHubRepo = {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  pushed_at: string;
  fork: boolean;
  private: boolean;
};

export async function getGitHubActivity(): Promise<GitHubActivity | null> {
  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USER}`, {
        headers,
        next: { revalidate: REVALIDATE_SECONDS },
      }),
      fetch(
        `https://api.github.com/users/${GITHUB_USER}/repos?type=owner&sort=pushed&direction=desc&per_page=100`,
        { headers, next: { revalidate: REVALIDATE_SECONDS } },
      ),
    ]);

    if (!userRes.ok || !reposRes.ok) return null;

    const user = (await userRes.json()) as GitHubUser;
    const allRepos = (await reposRes.json()) as GitHubRepo[];
    if (!Array.isArray(allRepos)) return null;

    const owned = allRepos.filter((r) => !r.fork && !r.private);
    const totalStars = owned.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);

    const repos: RepoSummary[] = owned.slice(0, 6).map((r) => ({
      name: r.name,
      description: r.description,
      url: r.html_url,
      language: r.language,
      stars: r.stargazers_count || 0,
      pushedAt: r.pushed_at,
    }));

    if (repos.length === 0) return null;

    return {
      publicRepos: user.public_repos ?? owned.length,
      totalStars,
      profileUrl: user.html_url ?? `https://github.com/${GITHUB_USER}`,
      repos,
    };
  } catch {
    return null;
  }
}

export function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const seconds = Math.round((Date.now() - then) / 1000);
  const divisions: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [7, "day"],
    [4.345, "week"],
    [12, "month"],
    [Number.POSITIVE_INFINITY, "year"],
  ];
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  let value = seconds;
  let unit: Intl.RelativeTimeFormatUnit = "second";
  for (const [span, u] of divisions) {
    if (Math.abs(value) < span) {
      unit = u;
      break;
    }
    value = Math.round(value / span);
  }
  return rtf.format(-value, unit);
}
