import { test, expect } from "@playwright/test";

/** Business card at / (PL) and /en: contact actions per device, language switch, vCard, share preview. */

test.describe("touch device (QR scan)", () => {
  test.use({ hasTouch: true, isMobile: true });

  test("leads with WhatsApp, offers Call and vCard", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1, name: "Piotr Romańczuk" })).toBeVisible();
    await expect(page.getByRole("link", { name: /Napisz na WhatsApp/ }).first()).toHaveAttribute("href", /^https:\/\/wa\.me\/48513602768\?text=/);
    await expect(page.getByRole("link", { name: /Zadzwoń/ })).toHaveAttribute("href", "tel:+48513602768");
    await expect(page.getByRole("link", { name: /Zapisz kontakt/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /Kopiuj/ })).toHaveCount(0);
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
});

test.describe("mouse device (laptop)", () => {
  test("leads with WhatsApp and copies the address", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/");
    await expect(page.getByRole("link", { name: /Zadzwoń/ })).toBeHidden();
    await expect(page.getByRole("link", { name: /Napisz na WhatsApp/ }).first()).toHaveAttribute("href", /^https:\/\/wa\.me\/48513602768\?text=Cze%C5%9B%C4%87%20Piotr/);
    await page.getByRole("button", { name: "Kopiuj e-mail" }).click();
    await expect(page.getByRole("button", { name: /Skopiowano/ })).toBeVisible();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("p.romanczuk@gmail.com");
  });

  test("recruiters reach the portfolio and the CV in one click", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: /Pobierz CV \(PDF\)/ })).toHaveAttribute("href", "/Romanczuk_Piotr_CV.pdf");
    await page.getByRole("link", { name: /Zobacz portfolio/ }).click();
    await expect(page).toHaveURL(/\/portfolio$/);
    await expect(page.locator(".work-row")).toHaveCount(6);
  });
});

test("vCard downloads with phone and e-mail", async ({ request }) => {
  const res = await request.get("/kontakt.vcf");
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("text/vcard");
  const body = await res.text();
  expect(body).toContain("TEL;TYPE=CELL:+48513602768");
  expect(body).toContain("EMAIL;TYPE=INTERNET:p.romanczuk@gmail.com");
});

test("card pages advertise a share preview image", async ({ page, request }) => {
  for (const [path, og] of [["/", "/og/card/pl"], ["/en", "/og/card/en"]]) {
    await page.goto(path);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", new RegExp(`${og}$`));
    const res = await request.get(og);
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("image/png");
  }
});

test("tutoring tiles link to their own landing pages", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: /Strona lekcji/ })).toHaveAttribute("href", "https://lekcje.romanczuk.online");
  await expect(page.getByRole("link", { name: /Oferta i zapisy/ })).toHaveAttribute("href", "https://gitarawarszawa.pl");
});

test("Vector Digital offers a pre-filled WhatsApp brief and an e-mail fallback", async ({ page }) => {
  await page.goto("/");
  const lead = page.locator(".card-tile.lead");
  const wa = await lead.getByRole("link", { name: /Napisz na WhatsApp/ }).getAttribute("href");
  expect(decodeURIComponent(wa ?? "")).toContain("audytu procesów (Vector Digital)");
  await expect(lead.getByRole("link", { name: /lub e-mailem/ })).toHaveAttribute("href", /^mailto:p\.romanczuk@gmail\.com\?subject=/);
});

/** Message form. Nothing here reaches the inbox: every case is rejected or dropped before the Formspree call. */
test.describe("message form API", () => {
  const origin = { Origin: "http://localhost:3000" };
  const valid = { name: "Test", contact: "test@example.com", topic: "vector", message: "Hello there", lang: "pl", elapsedMs: 5000 };

  test("rejects foreign origins", async ({ request }) => {
    const res = await request.post("/api/card-message", { data: valid, headers: { Origin: "https://evil.example" } });
    expect(res.status()).toBe(403);
  });

  test("rejects invalid input", async ({ request }) => {
    for (const bad of [{ ...valid, message: "hi" }, { ...valid, contact: "x" }, { ...valid, topic: "nope" }]) {
      const res = await request.post("/api/card-message", { data: bad, headers: origin });
      expect(res.status()).toBe(400);
    }
  });

  test("drops honeypot and instant submissions silently (looks like success to bots)", async ({ request }) => {
    for (const spam of [{ ...valid, website: "http://spam.example" }, { ...valid, elapsedMs: 100 }]) {
      const res = await request.post("/api/card-message", { data: spam, headers: origin });
      expect(res.status()).toBe(200);
      expect(await res.json()).toEqual({ ok: true });
    }
  });
});

test("message form shows a validation message and keeps the visitor's text", async ({ page }) => {
  await page.goto("/");
  const form = page.locator(".card-form");
  await form.getByLabel("Wiadomość").fill("hi");
  await form.getByLabel("E-mail lub telefon").fill("x");
  await page.waitForTimeout(2200); // past the bot timer, so the server validates instead of dropping
  await form.getByRole("button", { name: "Wyślij" }).click();
  await expect(form.getByRole("alert")).toContainText("Uzupełnij kontakt i wiadomość");
  await expect(form.getByLabel("Wiadomość")).toHaveValue("hi");
});

test("message form is mirrored in English", async ({ page }) => {
  await page.goto("/en");
  await expect(page.getByRole("heading", { name: "Send a message" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Send" })).toBeVisible();
});
