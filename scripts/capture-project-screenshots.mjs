// Captures 1600x900 hero screenshots for the four portfolio projects
// and writes them to public/projects/.
//
// Usage:
//   1. Start IG Webhook locally (only needed for the IG Webhook capture):
//        cd ../Marszal/instagram-stories-webhook && npm run dev
//      (defaults to http://localhost:3000)
//   2. Run from landing-portfolio/:
//        npm run screenshots:projects
//      Optional flags:
//        --only=inborr,pizza,strummy,ig    capture a subset
//        --ig-url=http://localhost:3000    override IG webhook URL
//
// Requires the local dev server for IG Webhook to be reachable; the others
// hit production URLs directly.

import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectsDir = resolve(__dirname, "..", "public", "projects");

const VIEWPORT = { width: 1600, height: 900 };
const SCALE = 2;

const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [k, v = "true"] = arg.replace(/^--/, "").split("=");
    return [k, v];
  })
);
const onlySet = args.has("only")
  ? new Set(args.get("only").split(",").map((s) => s.trim()))
  : null;
const igUrl = args.get("ig-url") ?? "http://localhost:3000";

const shouldRun = (name) => !onlySet || onlySet.has(name);

async function settle(page, ms = 1500) {
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.evaluate(() => document.fonts?.ready).catch(() => {});
  await page.waitForTimeout(ms);
}

async function shot(page, file) {
  const out = resolve(projectsDir, file);
  await page.screenshot({
    path: out,
    clip: { x: 0, y: 0, ...VIEWPORT },
    type: "png",
  });
  console.log(`  ✓ ${file}`);
}

async function captureInborr(context) {
  console.log("→ INBORR");
  const page = await context.newPage();
  await page.goto("https://inborr-landing-page.vercel.app", {
    waitUntil: "domcontentloaded",
  });
  await settle(page, 4000);
  await shot(page, "Inborr.png");
  await page.close();
}

async function capturePizzaStore(context) {
  console.log("→ Pizza Store");
  const page = await context.newPage();
  await page.goto("https://pizzayolo-pr.vercel.app", {
    waitUntil: "domcontentloaded",
  });
  await settle(page, 4000);
  await shot(page, "PizzaStore.png");
  await page.close();
}

async function captureStrummy(context) {
  console.log("→ Strummy (demo dashboard)");
  const page = await context.newPage();
  await page.goto("https://strummy.vercel.app/sign-in", {
    waitUntil: "domcontentloaded",
  });
  // Wait for the form to render (initial isChecking session probe finishes)
  await page
    .locator('[data-testid="email"]')
    .waitFor({ state: "visible", timeout: 45000 });
  await page.fill('[data-testid="email"]', "sarah@strummy.app");
  await page.fill('[data-testid="password"]', "Demo2024!");
  await page.click('[data-testid="signin-button"]');
  await page.waitForURL((url) => !url.pathname.includes("/sign-in"), {
    timeout: 45000,
  });
  // Land on dashboard explicitly in case of intermediate routing
  if (!page.url().includes("/dashboard")) {
    await page.goto("https://strummy.vercel.app/dashboard", {
      waitUntil: "domcontentloaded",
    });
  }
  await settle(page, 3500);
  await shot(page, "Strummy.png");
  await page.close();
}

async function captureIgWebhook(context) {
  console.log(`→ IG Webhook (via ${igUrl})`);
  const page = await context.newPage();
  try {
    await page.goto(`${igUrl}/auth/signin`, {
      waitUntil: "domcontentloaded",
      timeout: 8000,
    });
  } catch {
    console.warn(
      `  ! cannot reach ${igUrl} — skipping. Start the IG Webhook dev server first.`
    );
    await page.close();
    return;
  }
  await settle(page, 800);
  // Click the "Try the demo →" button
  await page.getByRole("button", { name: /try the demo/i }).click();
  // Wait for redirect to root or dashboard
  await page
    .waitForURL(
      (url) => !url.pathname.includes("/auth/signin"),
      { timeout: 20000 }
    )
    .catch(() => {});
  // Try the distinctive swipe/review UI; fall back to dashboard root
  try {
    await page.goto(`${igUrl}/review/v0`, {
      waitUntil: "domcontentloaded",
      timeout: 10000,
    });
    await settle(page, 2000);
    // If review redirected back to signin, fall back to root
    if (page.url().includes("/auth/signin")) {
      await page.goto(igUrl, { waitUntil: "domcontentloaded" });
      await settle(page, 2000);
    }
  } catch {
    await page.goto(igUrl, { waitUntil: "domcontentloaded" });
    await settle(page, 2000);
  }
  await shot(page, "IGWebhook.png");
  await page.close();
}

async function main() {
  await mkdir(projectsDir, { recursive: true });

  const browser = await chromium.launch({
    headless: false,
    args: ["--disable-blink-features=AutomationControlled"],
  });
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: SCALE,
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
    locale: "en-US",
    timezoneId: "Europe/Warsaw",
  });
  // Hide navigator.webdriver flag
  await context.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => undefined });
  });

  try {
    if (shouldRun("inborr")) await captureInborr(context);
    if (shouldRun("pizza")) await capturePizzaStore(context);
    if (shouldRun("strummy")) await captureStrummy(context);
    if (shouldRun("ig")) await captureIgWebhook(context);
  } finally {
    await context.close();
    await browser.close();
  }

  console.log(`\nDone. Files in ${projectsDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
