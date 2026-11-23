import { expect, test } from '@playwright/test';
import { latestNotes, notes, prNotes } from '../src/data/notes';

test('the home page shows the three newest notes and links to the rest', async ({ page }) => {
  await page.goto('/');
  const section = page.locator('#notes');
  const noteLinks = section.locator('li a');
  await expect(noteLinks).toHaveCount(3);
  for (const [i, note] of latestNotes.entries()) {
    await expect(noteLinks.nth(i)).toHaveAttribute('href', `/notes/${note.slug}/`);
  }
  await section.getByRole('link', { name: 'Read more notes' }).click();
  await expect(page).toHaveURL(/\/notes\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Notes');
});

test('the notes page lists every note', async ({ page }) => {
  await page.goto('/notes/');
  for (const note of notes) {
    await expect(page.getByRole('link', { name: new RegExp(note.title) })).toHaveAttribute('href', `/notes/${note.slug}/`);
  }
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
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

test('each PR note has the problem, what I did and what I learned, and links its PR', async ({ page }) => {
  expect(prNotes.length).toBeGreaterThan(0);
  for (const note of prNotes) {
    await page.goto(`/notes/${note.slug}/`);
    const sections = page.getByRole('heading', { level: 2 });
    await expect(sections.filter({ hasText: /^(The problem|What I did|What I learned)$/ })).toHaveText(['The problem', 'What I did', 'What I learned']);
    await expect(page.getByRole('link', { name: `${note.pr!.repo}#${note.pr!.number}` })).toHaveAttribute('href', `https://github.com/${note.pr!.repo}/pull/${note.pr!.number}`);
  }
});

test('a note links back to the list of notes', async ({ page }) => {
  await page.goto(`/notes/${notes[0]!.slug}/`);
  await page.getByRole('link', { name: 'all notes' }).click();
  await expect(page).toHaveURL(/\/notes\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Notes');
});

test('an unknown note shows the not-found page', async ({ page }) => {
  await page.goto('/notes/no-such-note/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found');
  await expect(page.getByRole('link', { name: 'Home', exact: true })).toHaveAttribute('href', '/');
});
