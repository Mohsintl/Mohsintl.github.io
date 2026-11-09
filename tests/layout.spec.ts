import { expect, test, type Page } from '@playwright/test';
import { ALL_ROUTES, pathFor } from '../src/routes';

/**
 * Elements that reach past the right edge of the screen. The page clips sideways
 * overflow, so a too-wide element is cut off rather than scrollable; the
 * page's scroll width can't catch that, so this measures the elements themselves.
 * Content inside its own sideways scroller (a code block, a table) is fine.
 */
async function overflowing(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    const scrolls = (el: Element | null): boolean => {
      for (let node = el; node && node !== document.body; node = node.parentElement) {
        const overflowX = getComputedStyle(node).overflowX;
        if (overflowX === 'auto' || overflowX === 'scroll') return true;
      }
      return false;
    };
    return [...document.body.querySelectorAll('*')]
      .filter((el) => {
        const box = el.getBoundingClientRect();
        return box.width > 0 && box.right > width + 1 && !scrolls(el.parentElement) && getComputedStyle(el).position !== 'fixed';
      })
      .map((el) => `${el.tagName.toLowerCase()}.${el.className.toString().slice(0, 60)}`);
  });
}

/**
 * Opens each section once, checking after every click: some lists are accordions
 * that close one item when another opens, so they can't all be open at the same time.
 */
async function overflowWithEachSectionOpen(page: Page): Promise<string[]> {
  const found = new Set(await overflowing(page));
  const toggles = page.locator('[aria-expanded]');
  const count = Math.min(await toggles.count(), 40);
  for (let i = 0; i < count; i++) {
    const toggle = toggles.nth(i);
    if ((await toggle.getAttribute('aria-expanded')) === 'false') await toggle.click();
    for (const el of await overflowing(page)) found.add(el);
  }
  return [...found];
}

test.describe('fits the screen', () => {
  for (const route of ALL_ROUTES.filter((r) => r.page !== 'not-found')) {
    const path = pathFor(route);
    test(`${path} has nothing wider than the screen, with every section opened`, async ({ page }) => {
      await page.goto(path);
      expect(await overflowWithEachSectionOpen(page)).toEqual([]);
    });
  }

  test('the resource tabs fit without scrolling sideways, even on a small phone', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto('/resources/');
    const tabs = page.getByRole('tablist', { name: 'Resource type' });
    expect(await tabs.evaluate((n) => n.scrollWidth <= n.clientWidth)).toBe(true);
  });

  test('the header section links do not scroll sideways', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Sections' }).filter({ visible: true });
    await expect(nav).toHaveCount(page.viewportSize()!.width < 1024 ? 0 : 1);
    if (await nav.count()) {
      expect(await nav.evaluate((n) => n.scrollWidth <= n.clientWidth)).toBe(true);
    }
  });
});

test.describe('menu on narrow screens', () => {
  test.skip(({ viewport }) => viewport!.width >= 1024, 'wide screens show the links in the header');

  test('opens, takes you to a section, and closes', async ({ page }) => {
    await page.goto('/');
    const menu = page.getByLabel('Menu');
    const links = page.getByRole('navigation', { name: 'Sections' });
    await expect(links).toBeHidden();

    await menu.click();
    await expect(links.getByRole('link', { name: 'QA resources' })).toBeVisible();
    await links.getByRole('link', { name: 'Contact' }).click();
    await expect(page).toHaveURL(/#contact$/);
    await expect(links).toBeHidden();

    await menu.click();
    await page.keyboard.press('Escape');
    await expect(links).toBeHidden();
  });

  test('opens with JavaScript turned off', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    await page.goto(`${test.info().project.use.baseURL}/`);
    await page.getByLabel('Menu').click();
    await expect(page.getByRole('link', { name: 'Experience' })).toBeVisible();
    await context.close();
  });
});
