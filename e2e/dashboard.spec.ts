import { test, expect } from "@playwright/test";

/* ============================================================
   DASHBOARD E2E TESTS
   ============================================================
   Verifies that protected routes require authentication and
   redirect unauthenticated users appropriately.
   ============================================================ */

test.describe("Dashboard — unauthenticated access", () => {
  const protectedRoutes = [
    "/dashboard",
    "/dashboard/resume",
    "/dashboard/jobs",
    "/dashboard/cover-letter",
    "/dashboard/tracker",
    "/dashboard/interview",
    "/dashboard/network",
    "/dashboard/templates",
    "/dashboard/settings",
  ];

  for (const route of protectedRoutes) {
    test(`redirects ${route} to login`, async ({ page }) => {
      await page.goto(route);

      /* # Should redirect to login or show auth wall */
      await page.waitForURL(/\/(login|api\/auth)/, { timeout: 10000 });
      const url = page.url();
      expect(url).toMatch(/\/(login|api\/auth)/);
    });
  }
});

test.describe("Marketing pages — public access", () => {
  const publicPages = [
    { path: "/about", text: /about/i },
    { path: "/contact", text: /contact/i },
    { path: "/privacy", text: /privacy/i },
    { path: "/terms", text: /terms/i },
  ];

  for (const { path, text } of publicPages) {
    test(`loads ${path} without auth`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBeLessThan(400);

      /* # Page should contain expected content */
      await expect(page.getByText(text).first()).toBeVisible();
    });
  }
});
