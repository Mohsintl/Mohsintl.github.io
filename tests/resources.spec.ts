import { expect, test } from '@playwright/test';

test('the nav opens the resources page and back to profile returns home', async ({ page, isMobile }) => {
  await page.goto('/');
  const link = page.getByRole('navigation', { name: 'Sections' }).getByRole('link', { name: 'QA resources' });
  if (isMobile) await link.scrollIntoViewIfNeeded();
  await link.click();
  await expect(page).toHaveURL(/#\/resources$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('QA resources');
  await expect(page.getByRole('tab', { name: 'Cheat sheets' })).toHaveAttribute('aria-selected', 'true');

  await page.getByRole('link', { name: 'back to profile' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Hi, I'm/);
});

test('each tab has its own link and shows its content', async ({ page }) => {
  for (const [id, tab, text] of [
    ['templates', 'Templates', 'Bug Report Template'],
    ['testcases', 'Test cases', 'Google Search'],
    ['testscripts', 'Test scripts', 'Automated Search Test'],
    ['cheatsheets', 'Cheat sheets', 'Selenium WebDriver'],
  ] as const) {
    await page.goto(`/#/resources/${id}`);
    await expect(page.getByRole('tab', { name: tab })).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tabpanel').getByText(text).first()).toBeVisible();
  }
});

test('search narrows the cheat sheets and reports no match', async ({ page }) => {
  await page.goto('/#/resources');
  const count = page.getByText(/^\d+ cheat sheets?$/);
  await expect(count).toHaveText('9 cheat sheets');

  const search = page.getByRole('searchbox', { name: 'Search resources' });
  await search.fill('selenium');
  await expect(count).toHaveText(/^[1-8] cheat sheets?$/);
  await expect(page.getByRole('heading', { name: 'Selenium WebDriver' })).toBeVisible();

  await search.fill('no-such-resource-xyz');
  await expect(page.getByText('No cheat sheets found')).toBeVisible();
});

test('category filter narrows the cheat sheets', async ({ page }) => {
  await page.goto('/#/resources');
  const api = page.getByRole('button', { name: 'API Testing' });
  await api.click();
  await expect(api).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByText(/^\d+ cheat sheets?$/)).toHaveText('2 cheat sheets');
});

test('a cheat sheet expands to its commands', async ({ page }) => {
  await page.goto('/#/resources');
  const card = page.getByRole('article').filter({ has: page.getByRole('heading', { name: 'Selenium WebDriver' }) });
  await card.getByRole('button', { name: 'View cheat sheet' }).click();
  await expect(card.getByText('WebDriver driver = new ChromeDriver();')).toBeVisible();
  await expect(card.getByRole('button', { name: 'Hide details' })).toHaveAttribute('aria-expanded', 'true');
});

test('a test script expands to its code', async ({ page }) => {
  await page.goto('/#/resources/testscripts');
  const script = page.getByRole('article').filter({ hasText: 'Automated Search Test' });
  await script.getByRole('button', { name: /Automated Search Test/ }).click();
  await expect(script.getByRole('button', { name: 'Copy script' })).toBeVisible();
  await expect(script.locator('pre')).toContainText('GoogleSearchTest');
});

test('no resource links to a repository that does not exist', async ({ page }) => {
  await page.goto('/#/resources/templates');
  await page.getByRole('button', { name: /Boilerplates/ }).click();
  await expect(page.getByText(/^\d+ boilerplates?$/)).toBeVisible();
  await expect(page.getByRole('link', { name: 'View repository' })).toHaveCount(0);
});

test('the suggest link points at the site repository issues', async ({ page }) => {
  await page.goto('/#/resources');
  await expect(page.getByRole('link', { name: 'Open an issue' })).toHaveAttribute(
    'href',
    'https://github.com/Mohsintl/portfolio/issues/new',
  );
});

test('the resources page does not scroll sideways', async ({ page }) => {
  for (const id of ['cheatsheets', 'templates', 'testcases', 'testscripts']) {
    await page.goto(`/#/resources/${id}`);
    await page.getByRole('tabpanel').waitFor();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, id).toBeLessThanOrEqual(0);
    const panel = (await page.getByRole('tabpanel').boundingBox())!;
    expect(panel.x + panel.width, id).toBeLessThanOrEqual(page.viewportSize()!.width);
  }
});
