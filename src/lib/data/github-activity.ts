import snapshot from "@/data/github-contrib.json";
import { fetchContributionCounts } from "@/lib/data/github-counts";

/**
 * Live GitHub activity, fetched server-side with ISR so the numbers
 * shown on the landing page can never drift months behind reality
 * (the checked-in snapshot only refreshes on deploy). Falls back to
 * the snapshot when the API is unreachable or rate-limited.
 */

export type RepoStats = {
  slug: string;
  stars: number;
  forks: number;
  pushedAt: string | null;
  language: string | null;
};

export type GithubActivity = {
  lastPush: string | null;
  commitsLast30d: number;
  commitsThisWeek: number;
  repos: Record<string, RepoStats>;
};

const USER = "PiotrRomanczuk";
const SHOWCASED_REPOS = [
  "PiotrRomanczuk/guitar-crm",
  "PiotrRomanczuk/ShortsCannon",
  "PiotrRomanczuk/home-ops",
  "PiotrRomanczuk/pizzayolo",
];
const REVALIDATE_SECONDS = 3600;

function apiHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "User-Agent": "romanczuk-portfolio",
    Accept: "application/vnd.github+json",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

function fromSnapshot(): GithubActivity & { ageDays: number } {
  const s = snapshot as {
    generatedAt?: string;
    lastPush?: string | null;
    commitsLast30d?: number;
    commitsThisWeek?: number;
    repos?: Record<string, RepoStats>;
  };
  const generated = s.generatedAt ? new Date(s.generatedAt).getTime() : 0;
  return {
    lastPush: s.lastPush ?? null,
    commitsLast30d: s.commitsLast30d ?? 0,
    commitsThisWeek: s.commitsThisWeek ?? 0,
    repos: s.repos ?? {},
    ageDays: (Date.now() - generated) / 86_400_000,
  };
}

type PushEvent = {
  type: string;
  created_at: string;
  payload?: { commits?: unknown[] };
};

async function fetchPushActivity(): Promise<
  Pick<GithubActivity, "lastPush" | "commitsLast30d" | "commitsThisWeek">
> {
  const res = await fetch(
    `https://api.github.com/users/${USER}/events/public?per_page=100`,
    { headers: apiHeaders(), next: { revalidate: REVALIDATE_SECONDS } },
  );
  if (!res.ok) throw new Error(`events HTTP ${res.status}`);
  const events = (await res.json()) as PushEvent[];
  const pushes = events.filter((e) => e.type === "PushEvent");

  const now = Date.now();
  const cutoff30d = now - 30 * 86_400_000;
  const cutoff7d = now - 7 * 86_400_000;
  let commitsLast30d = 0;
  let commitsThisWeek = 0;
  for (const push of pushes) {
    const at = new Date(push.created_at).getTime();
    const commitCount = push.payload?.commits?.length ?? 1;
    if (at >= cutoff30d) commitsLast30d += commitCount;
    if (at >= cutoff7d) commitsThisWeek += commitCount;
  }
  return { lastPush: pushes[0]?.created_at ?? null, commitsLast30d, commitsThisWeek };
}

async function fetchRepoStats(slug: string): Promise<RepoStats | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${slug}`, {
      headers: apiHeaders(),
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    const repo = (await res.json()) as {
      stargazers_count?: number;
      forks_count?: number;
      pushed_at?: string | null;
      language?: string | null;
    };
    return {
      slug,
      stars: repo.stargazers_count ?? 0,
      forks: repo.forks_count ?? 0,
      pushedAt: repo.pushed_at ?? null,
      language: repo.language ?? null,
    };
  } catch {
    return null;
  }
}

export async function getGithubActivity(): Promise<GithubActivity> {
  const { ageDays, ...fallback } = fromSnapshot();
  try {
    const [pushActivity, repoResults, calendarCounts] = await Promise.all([
      fetchPushActivity(),
      Promise.all(SHOWCASED_REPOS.map(fetchRepoStats)),
      fetchContributionCounts(USER, REVALIDATE_SECONDS).catch(() => null),
    ]);
    const repos = { ...fallback.repos };
    for (const stats of repoResults) {
      if (stats) repos[stats.slug] = stats;
    }
    // Public events miss private-repo pushes and undercount badly. Prefer
    // the GraphQL calendar (token required); otherwise a fresh build-time
    // snapshot (regenerated on every deploy) is the more complete count.
    let { commitsLast30d, commitsThisWeek } = pushActivity;
    if (calendarCounts) {
      ({ commitsLast30d, commitsThisWeek } = calendarCounts);
    } else if (ageDays < 7) {
      commitsLast30d = Math.max(commitsLast30d, fallback.commitsLast30d);
      commitsThisWeek = Math.max(commitsThisWeek, fallback.commitsThisWeek);
    }
    return { lastPush: pushActivity.lastPush, commitsLast30d, commitsThisWeek, repos };
  } catch (err) {
    console.warn(`[github-activity] live fetch failed, using snapshot: ${String(err)}`);
    return fallback;
  }
}
