import { test, expect } from "@playwright/test";

/** Business card at / (PL) and /en: contact actions, language switch, vCard. */

test("card shows contact actions and links to the portfolio", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Piotr Romańczuk" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Zadzwoń/ })).toHaveAttribute("href", "tel:+48513602768");
  await expect(page.getByRole("link", { name: /Napisz/ }).first()).toHaveAttribute("href", /^mailto:p\.romanczuk@gmail\.com/);
  await page.getByRole("link", { name: /Zobacz portfolio/ }).click();
  await expect(page).toHaveURL(/\/portfolio$/);
  await expect(page.locator(".work-row")).toHaveCount(6);
});

test("language switch goes to English and back", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "EN", exact: true }).click();
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.getByRole("link", { name: /Save contact/ })).toBeVisible();
  await expect(page.locator(".card-root")).toHaveAttribute("lang", "en");
  await page.getByRole("link", { name: "PL", exact: true }).click();
  await expect(page.getByRole("link", { name: /Zapisz kontakt/ })).toBeVisible();
});

test("vCard downloads with phone and e-mail", async ({ request }) => {
  const res = await request.get("/kontakt.vcf");
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("text/vcard");
  const body = await res.text();
  expect(body).toContain("TEL;TYPE=CELL:+48513602768");
  expect(body).toContain("EMAIL;TYPE=INTERNET:p.romanczuk@gmail.com");
});
