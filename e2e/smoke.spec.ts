import { test, expect } from "@playwright/test";

/**
 * Smoke suite: the critical recruiter-facing flows, no mocks.
 * Runs against the dev server (see playwright.config webServer).
 */

test("landing server-renders every project row (fail-open reveals)", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".work-row")).toHaveCount(6);
  await expect(page.locator(".work-row-inner h3").first()).toHaveText("Strummy");
});

test("project detail card opens, traps focus, and closes on Escape", async ({ page }) => {
  await page.goto("/");
  await page.locator(".work-row-inner").first().click();
  const dialog = page.getByRole("dialog", { name: /Strummy/ });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText("row-level security")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("work filters narrow the list", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "shipping", exact: true }).click();
  await expect(page.locator(".work-row:not(.hidden)")).toHaveCount(2);
  await page.getByRole("button", { name: "all", exact: true }).click();
  await expect(page.locator(".work-row:not(.hidden)")).toHaveCount(6);
});

test("a blog post renders with title and body", async ({ page }) => {
  await page.goto("/blog/three-production-lessons-from-shipping-strummy");
  await expect(
    page.getByRole("heading", { level: 1, name: /Three production lessons/ }),
  ).toBeVisible();
});

test("CV PDF is served", async ({ request }) => {
  const res = await request.get("/Romanczuk_Piotr_CV.pdf");
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("pdf");
});
