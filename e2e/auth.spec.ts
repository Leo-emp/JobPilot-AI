import { test, expect } from "@playwright/test";

/* ============================================================
   AUTH FLOW E2E TESTS
   ============================================================
   Tests signup and login forms — client-side validation,
   form interactions, and navigation between auth pages.
   ============================================================ */

test.describe("Signup Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/signup");
  });

  test("renders signup form with all fields", async ({ page }) => {
    await expect(page.getByText("Create Account")).toBeVisible();
    await expect(page.getByPlaceholder("John Doe")).toBeVisible();
    await expect(page.getByPlaceholder("you@example.com")).toBeVisible();
    /* # Two password fields (password + confirm) */
    const passwordFields = page.locator("input[type='password']");
    await expect(passwordFields).toHaveCount(2);
    /* # Terms checkbox */
    await expect(page.locator("#terms-consent")).toBeVisible();
    /* # Submit button */
    await expect(page.getByRole("button", { name: /create account/i })).toBeVisible();
  });

  test("shows OAuth buttons for Google and LinkedIn", async ({ page }) => {
    await expect(page.getByRole("button", { name: /google/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /linkedin/i })).toBeVisible();
  });

  test("submit button is disabled when terms not agreed", async ({ page }) => {
    /* # Fill all fields but don't check terms */
    await page.getByPlaceholder("John Doe").fill("Test User");
    await page.getByPlaceholder("you@example.com").fill("test@example.com");
    await page.locator("input[type='password']").first().fill("securepass123");
    await page.locator("input[type='password']").last().fill("securepass123");

    /* # Button should be disabled */
    const submitBtn = page.getByRole("button", { name: /create account/i });
    await expect(submitBtn).toBeDisabled();
  });

  test("shows error for password mismatch", async ({ page }) => {
    await page.getByPlaceholder("John Doe").fill("Test User");
    await page.getByPlaceholder("you@example.com").fill("test@example.com");
    await page.locator("input[type='password']").first().fill("securepass123");
    await page.locator("input[type='password']").last().fill("differentpass");
    await page.locator("#terms-consent").check();
    await page.getByRole("button", { name: /create account/i }).click();

    /* # Error banner about password mismatch */
    await expect(page.getByText(/passwords do not match/i)).toBeVisible();
  });

  test("shows error for short password", async ({ page }) => {
    await page.getByPlaceholder("John Doe").fill("Test User");
    await page.getByPlaceholder("you@example.com").fill("test@example.com");
    await page.locator("input[type='password']").first().fill("short");
    await page.locator("input[type='password']").last().fill("short");
    await page.locator("#terms-consent").check();
    await page.getByRole("button", { name: /create account/i }).click();

    /* # Error banner about password length */
    await expect(page.getByText(/at least 8 characters/i)).toBeVisible();
  });

  test("navigates to login page via sign in link", async ({ page }) => {
    await page.getByRole("link", { name: /sign in/i }).click();
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe("Login Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("renders login form with all fields", async ({ page }) => {
    await expect(page.getByText("Welcome Back")).toBeVisible();
    await expect(page.getByPlaceholder("you@example.com")).toBeVisible();
    await expect(page.locator("input[type='password']")).toBeVisible();
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });

  test("shows OAuth buttons for Google and LinkedIn", async ({ page }) => {
    await expect(page.getByRole("button", { name: /google/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /linkedin/i })).toBeVisible();
  });

  test("has forgot password link", async ({ page }) => {
    const forgotLink = page.getByRole("link", { name: /forgot password/i });
    await expect(forgotLink).toBeVisible();
    await forgotLink.click();
    await expect(page).toHaveURL(/\/forgot-password/);
  });

  test("navigates to signup page via sign up link", async ({ page }) => {
    await page.getByRole("link", { name: /sign up/i }).click();
    await expect(page).toHaveURL(/\/signup/);
  });

  test("shows error for invalid credentials", async ({ page }) => {
    await page.getByPlaceholder("you@example.com").fill("fake@example.com");
    await page.locator("input[type='password']").fill("wrongpassword");
    await page.getByRole("button", { name: /sign in/i }).click();

    /* # Should show error banner (either invalid credentials or network error) */
    await expect(page.locator(".bg-red-500\\/10")).toBeVisible({ timeout: 10000 });
  });
});
