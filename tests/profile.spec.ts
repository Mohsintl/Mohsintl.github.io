import { expect, test } from '@playwright/test';
import { contributions, profile, projects } from '../src/data/profile';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('loads without console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (msg) => msg.type() === 'error' && errors.push(msg.text()));
  page.on('pageerror', (err) => errors.push(err.message));
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(`Hi, I'm ${profile.name}`);
  expect(errors).toEqual([]);
});

test('lists every project and contribution from the profile data', async ({ page }) => {
  for (const project of projects) {
    await expect(page.locator('#projects').getByRole('link', { name: project.name })).toHaveAttribute('href', project.url);
  }
  for (const c of contributions) {
    for (const item of c.items) {
      await expect(page.locator('#open-source').getByRole('link', { name: item.label })).toHaveAttribute('href', item.url);
    }
  }
});

test('every section in the nav exists and is reachable', async ({ page, isMobile }) => {
  const nav = page.getByRole('navigation', { name: 'Sections' });
  for (const id of ['about', 'projects', 'open-source', 'skills', 'resources']) {
    const link = nav.locator(`a[href="#${id}"]`);
    if (isMobile) await link.scrollIntoViewIfNeeded();
    await link.click();
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    await expect(page.locator(`#${id}`)).toBeInViewport();
  }
});

test('external links open in a new tab safely', async ({ page }) => {
  const external = page.locator('a[target="_blank"]');
  expect(await external.count()).toBeGreaterThan(5);
  for (const link of await external.all()) {
    await expect(link).toHaveAttribute('rel', /noopener/);
    await expect(link).toHaveAttribute('href', /^https:\/\//);
  }
});

test('does not scroll sideways', async ({ page }) => {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});
