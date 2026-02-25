import { test, expect } from "@playwright/test";

test.describe("Landing page section screenshots", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for page to be fully loaded and animations to settle
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);
  });

  test("Navbar", async ({ page }, testInfo) => {
    const navbar = page.locator("header").first();
    await expect(navbar).toBeVisible();
    await navbar.screenshot({
      path: `e2e/screenshots/${testInfo.project.name}/navbar.png`,
    });
  });

  test("Hero section", async ({ page }, testInfo) => {
    const hero = page.locator("section").first();
    await expect(hero).toBeVisible();
    await hero.screenshot({
      path: `e2e/screenshots/${testInfo.project.name}/hero.png`,
    });
  });

  test("About section", async ({ page }, testInfo) => {
    const about = page.locator("#about");
    await about.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await expect(about).toBeVisible();
    await about.screenshot({
      path: `e2e/screenshots/${testInfo.project.name}/about.png`,
    });
  });

  test("Projects section", async ({ page }, testInfo) => {
    const projects = page.locator("#projects");
    await projects.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await expect(projects).toBeVisible();
    await projects.screenshot({
      path: `e2e/screenshots/${testInfo.project.name}/projects.png`,
    });
  });

  test("Timeline section", async ({ page }, testInfo) => {
    // Timeline has no id, it's between projects and contact
    const timeline = page.locator("section").filter({ hasText: "PATH" });
    await timeline.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await expect(timeline).toBeVisible();
    await timeline.screenshot({
      path: `e2e/screenshots/${testInfo.project.name}/timeline.png`,
    });
  });

  test("Contact section", async ({ page }, testInfo) => {
    const contact = page.locator("#contact");
    await contact.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await expect(contact).toBeVisible();
    await contact.screenshot({
      path: `e2e/screenshots/${testInfo.project.name}/contact.png`,
    });
  });

  test("Footer", async ({ page }, testInfo) => {
    const footer = page.locator("footer");
    await footer.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await expect(footer).toBeVisible();
    await footer.screenshot({
      path: `e2e/screenshots/${testInfo.project.name}/footer.png`,
    });
  });
});
