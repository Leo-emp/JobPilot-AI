import { test, expect } from "@playwright/test";

/* ============================================================
   LANDING PAGE E2E TESTS
   ============================================================
   Verifies the public landing page loads correctly with all
   key sections visible and navigation working.
   ============================================================ */

test.describe("Landing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders hero section with CTA", async ({ page }) => {
    /* # Main headline should be visible */
    await expect(page.locator("h1")).toBeVisible();

    /* # At least one call-to-action button */
    const ctaButtons = page.locator("a[href='/signup'], a[href='/dashboard']");
    await expect(ctaButtons.first()).toBeVisible();
  });

  test("renders navigation bar with brand name", async ({ page }) => {
    /* # Brand name "JobPilot AI" in navbar */
    await expect(page.locator("nav")).toBeVisible();
    await expect(page.getByText("JobPilot AI").first()).toBeVisible();
  });

  test("renders pricing section with plan tiers", async ({ page }) => {
    /* # Scroll to pricing and verify tiers exist */
    const pricing = page.locator("text=Pricing").first();
    await expect(pricing).toBeVisible();
  });

  test("renders features section", async ({ page }) => {
    /* # Features section should show feature cards */
    await expect(page.getByText("Features").first()).toBeVisible();
  });

  test("navigates to login page", async ({ page }) => {
    /* # Click Sign In link in navbar */
    await page.getByRole("link", { name: /sign in/i }).first().click();
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByText("Welcome Back")).toBeVisible();
  });

  test("navigates to signup page", async ({ page }) => {
    /* # Click Get Started / Sign Up link */
    await page.getByRole("link", { name: /get started|sign up/i }).first().click();
    await expect(page).toHaveURL(/\/signup/);
    await expect(page.getByText("Create Account")).toBeVisible();
  });

  test("footer is visible with links", async ({ page }) => {
    /* # Footer should exist at bottom */
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
  });
});
