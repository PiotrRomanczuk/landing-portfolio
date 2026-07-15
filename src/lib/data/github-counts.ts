/**
 * Accurate 30d / 7d contribution counts via the GraphQL contributions
 * calendar (includes private-repo activity). Returns null when no
 * GITHUB_TOKEN is configured — callers fall back to public-events counts.
 */

export type ContributionCounts = {
  commitsLast30d: number;
  commitsThisWeek: number;
};

type CalendarDay = { date: string; contributionCount: number };

export async function fetchContributionCounts(
  user: string,
  revalidateSeconds: number,
): Promise<ContributionCounts | null> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;

  const query = `query($login:String!){
    user(login:$login){
      contributionsCollection{
        contributionCalendar{
          weeks{ contributionDays{ date contributionCount } }
        }
      }
    }
  }`;
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "romanczuk-portfolio",
    },
    body: JSON.stringify({ query, variables: { login: user } }),
    next: { revalidate: revalidateSeconds },
  });
  if (!res.ok) throw new Error(`GraphQL HTTP ${res.status}`);

  const body = (await res.json()) as {
    data?: {
      user?: {
        contributionsCollection?: {
          contributionCalendar?: { weeks?: { contributionDays: CalendarDay[] }[] };
        };
      };
    };
  };
  const weeks = body.data?.user?.contributionsCollection?.contributionCalendar?.weeks;
  if (!Array.isArray(weeks)) throw new Error("GraphQL: no contribution weeks");

  const now = Date.now();
  const cutoff30d = now - 30 * 86_400_000;
  const cutoff7d = now - 7 * 86_400_000;
  let commitsLast30d = 0;
  let commitsThisWeek = 0;
  for (const day of weeks.flatMap((w) => w.contributionDays)) {
    const at = new Date(day.date).getTime();
    if (at >= cutoff30d) commitsLast30d += day.contributionCount;
    if (at >= cutoff7d) commitsThisWeek += day.contributionCount;
  }
  return { commitsLast30d, commitsThisWeek };
}
