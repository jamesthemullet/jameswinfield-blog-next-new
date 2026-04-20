import { test, expect } from '@playwright/test';

test('nav links route to correct pages', async ({ page }) => {
  await page.goto('/');

  await page.click('nav a[href="/blog"]');
  await expect(page).toHaveURL(/\/blog/);

  await page.click('nav a[href="/projects"]');
  await expect(page).toHaveURL(/\/projects/);

  await page.click('nav a[href="/timeline"]');
  await expect(page).toHaveURL(/\/timeline/);

  await page.click('nav a[href="/"]');
  await expect(page).toHaveURL(/\/$/);
});

test('mobile menu toggle shows and hides nav links', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');

  const blogLink = page.locator('nav a[href="/blog"]');
  await expect(blogLink).not.toBeVisible();

  await page.click('button[aria-label="Toggle navigation menu"]');
  await expect(blogLink).toBeVisible();

  await page.click('nav a[href="/blog"]');
  await expect(page).toHaveURL(/\/blog/);
});
