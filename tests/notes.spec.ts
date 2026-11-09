import { expect, test } from '@playwright/test';
import { notes } from '../src/data/notes';

test('the home page lists every note', async ({ page }) => {
  await page.goto('/');
  const section = page.locator('#notes');
  for (const note of notes) {
    await expect(section.getByRole('link', { name: new RegExp(note.title) })).toHaveAttribute('href', `/notes/${note.slug}/`);
  }
});

test('each note opens on its own page with its links', async ({ page }) => {
  for (const note of notes) {
    await page.goto(`/notes/${note.slug}/`);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(note.title);
    for (const link of note.links) {
      await expect(page.getByRole('link', { name: link.label })).toHaveAttribute('href', link.url);
    }
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, note.slug).toBeLessThanOrEqual(0);
  }
});

test('a note links back to the list of notes', async ({ page }) => {
  await page.goto(`/notes/${notes[0]!.slug}/`);
  await page.getByRole('link', { name: 'all notes' }).click();
  await expect(page).toHaveURL(/\/#notes$/);
  await expect(page.locator('#notes')).toBeInViewport();
});

test('an unknown note shows the not-found page', async ({ page }) => {
  await page.goto('/notes/no-such-note/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found');
  await expect(page.getByRole('link', { name: 'Home', exact: true })).toHaveAttribute('href', '/');
});
