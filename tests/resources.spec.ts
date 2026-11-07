import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/#resources');
});

test('shows cheat sheets by default and switches between resource tabs', async ({ page }) => {
  const resources = page.locator('#resources');
  await expect(resources.getByRole('tab', { name: 'Cheat sheets' })).toHaveAttribute('aria-selected', 'true');
  await expect(resources.getByRole('heading', { name: 'Cheat Sheets' })).toBeVisible();

  for (const [tab, heading] of [
    ['Templates', 'Templates & Boilerplates'],
    ['Test cases', 'Test Cases'],
    ['Test scripts', 'Test Scripts'],
  ] as const) {
    await resources.getByRole('tab', { name: tab }).click();
    await expect(resources.getByRole('tab', { name: tab })).toHaveAttribute('aria-selected', 'true');
    await expect(resources.getByRole('heading', { name: heading, exact: true })).toBeVisible();
  }
});

test('search narrows the cheat sheets and reports no match', async ({ page }) => {
  const resources = page.locator('#resources');
  const count = resources.getByText(/^\d+ cheat sheets?$/);
  await expect(count).toHaveText('9 cheat sheets');

  await resources.getByRole('searchbox', { name: 'Search resources' }).fill('selenium');
  await expect(count).toHaveText(/^[1-8] cheat sheets?$/);
  await expect(resources.getByText('Selenium WebDriver').first()).toBeVisible();

  await resources.getByRole('searchbox', { name: 'Search resources' }).fill('no-such-resource-xyz');
  await expect(resources.getByText('No cheat sheets found')).toBeVisible();
});

test('category filter narrows the cheat sheets', async ({ page }) => {
  const resources = page.locator('#resources');
  await resources.getByRole('button', { name: 'API Testing' }).click();
  await expect(resources.getByRole('button', { name: 'API Testing' })).toHaveAttribute('aria-pressed', 'true');
  await expect(resources.getByText(/^\d+ cheat sheets?$/)).toHaveText('2 cheat sheets');
});

test('the suggest link points at the site repository issues', async ({ page }) => {
  await expect(page.locator('#resources').getByRole('link', { name: 'Open an issue' })).toHaveAttribute(
    'href',
    'https://github.com/Mohsintl/qa-automation-resources/issues/new',
  );
});
