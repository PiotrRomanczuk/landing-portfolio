#!/usr/bin/env node
/**
 * Build-time GitHub data snapshot.
 *
 * Produces src/data/github-contrib.json with:
 *   - days[]: { date, intensity }   (last 182 days = 26 weeks, oldest first)
 *   - lastPush: ISO timestamp of most recent public push
 *   - commitsLast30d, commitsThisWeek
 *
 * Prefers the GraphQL contributions calendar if GITHUB_TOKEN is set
 * (gives a full year of accurate daily counts). Falls back to the
 * public events endpoint, which is capped to ~300 events / 90 days.
 *
 * Run manually: node scripts/fetch-github-data.mjs
 * Or wire into CI; the JSON is checked in so the build is offline-safe.
 */

import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const USER = process.env.GITHUB_USER || "PiotrRomanczuk";
const TOKEN = process.env.GITHUB_TOKEN;
const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "../src/data/github-contrib.json");

function bucket(count) {
  if (count <= 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  return 3;
}

async function viaGraphQL() {
  const query = `query($login:String!){
    user(login:$login){
      contributionsCollection{
        contributionCalendar{
          weeks{ contributionDays{ date contributionCount } }
        }
      }
    }
  }`;
  const r = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
      "User-Agent": "romanczuk-portfolio",
    },
    body: JSON.stringify({ query, variables: { login: USER } }),
  });
  if (!r.ok) throw new Error(`GraphQL HTTP ${r.status}`);
  const j = await r.json();
  const weeks = j?.data?.user?.contributionsCollection?.contributionCalendar?.weeks;
  if (!Array.isArray(weeks)) throw new Error("GraphQL: no weeks");
  const flat = weeks.flatMap((w) => w.contributionDays);
  return flat.map((d) => ({ date: d.date, count: d.contributionCount }));
}

async function viaEvents() {
  const r = await fetch(`https://api.github.com/users/${USER}/events/public?per_page=100`, {
    headers: { "User-Agent": "romanczuk-portfolio", Accept: "application/vnd.github+json" },
  });
  if (!r.ok) throw new Error(`Events HTTP ${r.status}`);
  const evts = await r.json();
  const byDay = new Map();
  for (const e of evts) {
    if (e.type !== "PushEvent") continue;
    const day = e.created_at.slice(0, 10);
    const n = e.payload?.commits?.length ?? 1;
    byDay.set(day, (byDay.get(day) || 0) + n);
  }
  const today = new Date();
  const days = [];
  for (let i = 181; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({ date: key, count: byDay.get(key) || 0 });
  }
  return days;
}

async function lastPushTimestamp() {
  try {
    const r = await fetch(`https://api.github.com/users/${USER}/events/public?per_page=30`, {
      headers: { "User-Agent": "romanczuk-portfolio" },
    });
    if (!r.ok) return null;
    const evts = await r.json();
    const push = evts.find((e) => e.type === "PushEvent");
    return push?.created_at ?? null;
  } catch {
    return null;
  }
}

function trim(days, n) {
  return days.slice(-n);
}

function summarise(days) {
  const total30 = days.slice(-30).reduce((s, d) => s + d.count, 0);
  const total7 = days.slice(-7).reduce((s, d) => s + d.count, 0);
  return { commitsLast30d: total30, commitsThisWeek: total7 };
}

async function main() {
  let days;
  try {
    if (TOKEN) {
      days = await viaGraphQL();
    } else {
      console.warn("[github-data] No GITHUB_TOKEN; using public events (90d capped).");
      days = await viaEvents();
    }
  } catch (err) {
    console.warn(`[github-data] Fetch failed: ${err.message}`);
    // keep existing JSON if present, otherwise emit a flat zero-state
    if (existsSync(OUT)) {
      console.warn("[github-data] Keeping existing snapshot.");
      return;
    }
    days = [];
    const today = new Date();
    for (let i = 181; i >= 0; i--) {
      const d = new Date(today);
      d.setUTCDate(d.getUTCDate() - i);
      days.push({ date: d.toISOString().slice(0, 10), count: 0 });
    }
  }

  const window = trim(days, 182);
  const cells = window.map((d) => ({ date: d.date, intensity: bucket(d.count) }));
  const { commitsLast30d, commitsThisWeek } = summarise(window);
  const lastPush = await lastPushTimestamp();

  const payload = {
    user: USER,
    generatedAt: new Date().toISOString(),
    days: cells,
    commitsLast30d,
    commitsThisWeek,
    lastPush,
  };

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(payload, null, 2));
  console.log(`[github-data] wrote ${OUT} (${cells.length} days, ${commitsLast30d} commits/30d).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
