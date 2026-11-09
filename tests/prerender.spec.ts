import { expect, test } from '@playwright/test';
import { contributions, experience, profile, projects } from '../src/data/profile';
import { notes } from '../src/data/notes';
import { ALL_ROUTES, pageMeta, pathFor, RESOURCE_TABS, SITE_URL } from '../src/routes';

// What a crawler, link-preview bot or AI tool sees: the HTML as served, with no JavaScript run.
/** The text a reader without JavaScript gets from served HTML: tags and scripts removed, entities decoded. */
function textOf(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

const pages = ALL_ROUTES.filter((route) => route.page !== 'not-found');

test.describe('served HTML, before any JavaScript runs', () => {
  for (const route of pages) {
    const path = pathFor(route);
    test(`${path} has its own title, description, canonical URL and preview tags`, async ({ request }) => {
      const response = await request.get(path);
      expect(response.status()).toBe(200);
      const html = await response.text();
      const { title, description } = pageMeta(route);
      const attr = (text: string) => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
      expect(html).toContain(`<title>${attr(title)}</title>`);
      expect(html).toContain(`<meta name="description" content="${attr(description)}" />`);
      expect(html).toContain(`<link rel="canonical" href="${SITE_URL}${path}" />`);
      expect(html).toContain(`<meta property="og:image" content="${SITE_URL}/og-image.png" />`);
      expect(html.match(/<meta name="description"/g)).toHaveLength(1);
    });
  }

  test('the home page carries the whole profile as text', async ({ request }) => {
    const text = textOf(await (await request.get('/')).text());
    for (const expected of [profile.role, profile.tagline, profile.email, ...experience.flatMap((j) => j.roles.map((r) => r.title)), ...projects.map((p) => p.name), ...contributions.flatMap((c) => c.items.map((i) => i.label)), ...notes.map((n) => n.title)]) {
      expect(text, expected).toContain(expected);
    }
  });

  test('each note page carries its own text', async ({ request }) => {
    for (const note of notes) {
      const text = textOf(await (await request.get(pathFor({ page: 'note', note }))).text());
      const paragraphs = note.body.flatMap((b) => (b.type === 'p' ? [b.text] : []));
      expect(text).toContain(note.title);
      for (const paragraph of paragraphs) expect(text).toContain(paragraph);
    }
  });

  test('each resources tab is its own page', async ({ request }) => {
    for (const tab of RESOURCE_TABS) {
      const html = await (await request.get(pathFor({ page: 'resources', tab: tab.id }))).text();
      expect(html).toContain(tab.blurb);
      expect(html).toMatch(new RegExp(`aria-selected="true"[^>]*>${tab.label}<`));
    }
  });

  test('404.html is the not-found page and is kept out of search results', async ({ request }) => {
    const html = await (await request.get('/404.html')).text();
    expect(html).toContain('Page not found');
    expect(html).toContain('<meta name="robots" content="noindex" />');
    expect(html).not.toContain('rel="canonical"');
  });

  test('llms.txt, sitemap.xml and robots.txt describe the site', async ({ request }) => {
    const llms = await (await request.get('/llms.txt')).text();
    expect(llms).toContain(`# ${profile.fullName}`);
    expect(llms).toContain(profile.linkedin);
    for (const role of experience.flatMap((j) => j.roles)) expect(llms).toContain(`- ${role.title}, ${role.dates}`);
    for (const item of contributions.flatMap((c) => c.items)) expect(llms).toContain(item.url);

    const sitemap = await (await request.get('/sitemap.xml')).text();
    for (const route of pages) expect(sitemap).toContain(`<loc>${SITE_URL}${pathFor(route)}</loc>`);
    expect(sitemap).not.toContain('404');

    expect(await (await request.get('/robots.txt')).text()).toContain(`Sitemap: ${SITE_URL}/sitemap.xml`);
    expect((await request.get('/og-image.png')).headers()['content-type']).toBe('image/png');
  });
});

test.describe('with JavaScript turned off', () => {
  test.use({ javaScriptEnabled: false });

  test('the profile and a note are still readable', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(`Hi, I'm ${profile.name}`);
    await expect(page.locator('#open-source').getByRole('link', { name: contributions[0]!.items[0]!.label })).toBeVisible();
    await page.goto(pathFor({ page: 'note', note: notes[0]! }));
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(notes[0]!.title);
  });
});

test('links from before real URLs still land on their page', async ({ page }) => {
  await page.goto('/#/resources/templates');
  await expect(page).toHaveURL(/\/resources\/templates\/$/);
  await expect(page.getByRole('tab', { name: 'Templates' })).toHaveAttribute('aria-selected', 'true');

  await page.goto(`/#/notes/${notes[1]!.slug}`);
  await expect(page).toHaveURL(new RegExp(`/notes/${notes[1]!.slug}/$`));
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(notes[1]!.title);
});

test('every page hydrates without console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (msg) => msg.type() === 'error' && errors.push(`${page.url()}: ${msg.text()}`));
  page.on('pageerror', (err) => errors.push(`${page.url()}: ${err.message}`));
  for (const route of pages) {
    await page.goto(pathFor(route));
    await page.waitForLoadState('networkidle');
  }
  expect(errors).toEqual([]);
});
