import { Star } from "lucide-react";
import { getGitHubActivity, relativeTime } from "@/lib/github";
import { GithubIcon } from "./Icons";

// Maps the most common languages to a dot colour. Anything else falls back to
// the accent colour — no need to be exhaustive.
const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Go: "#00ADD8",
  Rust: "#dea584",
  Shell: "#89e051",
  Jupyter: "#DA5B0B",
  "Jupyter Notebook": "#DA5B0B",
};

// Server Component: renders live GitHub data fetched with an hourly ISR cache.
// If GitHub is unreachable, getGitHubActivity() returns null and we render
// nothing — the section disappears rather than showing a broken state.
export default async function GitHubActivity() {
  const data = await getGitHubActivity();
  if (!data) return null;

  return (
    <section id="activity" className="py-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between mb-8">
          <div>
            <p className="flex items-center gap-2 text-accent font-mono text-sm mb-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              live · github
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold flex items-center gap-2.5">
              <GithubIcon size={28} />
              What I&apos;m building
            </h2>
          </div>

          <div className="flex gap-8">
            <div>
              <p className="text-2xl font-bold font-mono">{data.publicRepos}</p>
              <p className="text-xs text-muted-foreground font-mono">
                public repos
              </p>
            </div>
            {data.totalStars > 0 && (
              <div>
                <p className="text-2xl font-bold font-mono">
                  {data.totalStars}
                </p>
                <p className="text-xs text-muted-foreground font-mono">stars</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.repos.map((repo) => (
            <a
              key={repo.name}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-3 p-5 rounded-xl border border-border bg-card hover:border-accent/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-mono text-sm font-semibold text-foreground group-hover:text-accent transition-colors truncate">
                  {repo.name}
                </span>
                {repo.stars > 0 && (
                  <span className="shrink-0 flex items-center gap-1 text-xs text-muted-foreground font-mono">
                    <Star size={12} />
                    {repo.stars}
                  </span>
                )}
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 flex-1">
                {repo.description ?? "No description"}
              </p>

              <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                {repo.language ? (
                  <span className="flex items-center gap-1.5">
                    <span
                      aria-hidden="true"
                      className="h-2.5 w-2.5 rounded-full"
                      style={{
                        backgroundColor:
                          LANG_COLORS[repo.language] ?? "var(--accent)",
                      }}
                    />
                    {repo.language}
                  </span>
                ) : (
                  <span />
                )}
                <span className="text-muted-foreground">
                  {relativeTime(repo.pushedAt)}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
