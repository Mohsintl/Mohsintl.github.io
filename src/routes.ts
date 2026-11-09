/**
 * Every page of the site and the URL it lives at. The app, the browser entry
 * point and the build-time prerender all read routes from here, so a page can't
 * exist in one place and be missing from another.
 */
import { profile } from './data/profile';
import { notes, type Note } from './data/notes';

export const RESOURCE_TABS = [
  { id: 'cheatsheets', label: 'Cheat sheets', blurb: 'Commands and patterns for Selenium, Playwright, Cypress, API, performance, and security testing.' },
  { id: 'templates', label: 'Templates', blurb: 'Bug reports, triage, test plans, and framework starter code, ready to copy.' },
  { id: 'testcases', label: 'Test cases', blurb: 'Manual test cases for well-known apps: steps, preconditions, and expected results.' },
  { id: 'testscripts', label: 'Test scripts', blurb: 'Automation scripts in Selenium, Playwright, Cypress, REST Assured, and Appium.' },
] as const;

export type ResourceTab = (typeof RESOURCE_TABS)[number]['id'];

export type Route =
  | { page: 'home' }
  | { page: 'resources'; tab: ResourceTab }
  | { page: 'note'; note: Note }
  | { page: 'not-found' };

/** The site's public address; canonical and preview URLs are built from it. */
export const SITE_URL = 'https://mohsintl.is-a.dev';

/** The path a route is served at. Directories end in `/`, as GitHub Pages serves them. */
export function pathFor(route: Route): string {
  switch (route.page) {
    case 'home':
      return '/';
    case 'resources':
      return route.tab === 'cheatsheets' ? '/resources/' : `/resources/${route.tab}/`;
    case 'note':
      return `/notes/${route.note.slug}/`;
    case 'not-found':
      return '/404.html';
  }
}

/** The route for a pathname; anything unknown is the not-found page. */
export function routeFromPath(pathname: string): Route {
  const path = pathname.replace(/index\.html$/, '').replace(/\/?$/, '/');
  if (path === '/') return { page: 'home' };
  const resources = path.match(/^\/resources\/(?:([a-z]+)\/)?$/);
  if (resources) {
    const tab = RESOURCE_TABS.find((t) => t.id === (resources[1] ?? 'cheatsheets'));
    if (tab) return { page: 'resources', tab: tab.id };
  }
  const note = path.match(/^\/notes\/([a-z0-9-]+)\/$/);
  const found = note && notes.find((n) => n.slug === note[1]);
  if (found) return { page: 'note', note: found };
  return { page: 'not-found' };
}

/**
 * Where an old hash link (`#/resources/templates`, `#/notes/<slug>`) now lives,
 * so links shared before the site had real URLs keep working.
 */
export function pathForLegacyHash(hash: string): string | null {
  const resources = hash.match(/^#\/resources(?:\/([a-z]+))?\/?$/);
  if (resources) return resources[1] ? `/resources/${resources[1]}/` : '/resources/';
  const note = hash.match(/^#\/notes\/([a-z0-9-]+)\/?$/);
  if (note) return `/notes/${note[1]}/`;
  return null;
}

/** Every page the build writes as its own HTML file. */
export const ALL_ROUTES: Route[] = [
  { page: 'home' },
  ...RESOURCE_TABS.map((t) => ({ page: 'resources' as const, tab: t.id })),
  ...notes.map((note) => ({ page: 'note' as const, note })),
  { page: 'not-found' },
];

/** Title and description for a page's <head>, search results and link previews. */
export function pageMeta(route: Route): { title: string; description: string } {
  const who = `${profile.name} · ${profile.role}`;
  switch (route.page) {
    case 'home':
      return {
        title: `${profile.name} · SDET`,
        description: `${profile.role}. ${profile.tagline} Projects, open-source contributions, notes, and free QA resources.`,
      };
    case 'resources': {
      const tab = RESOURCE_TABS.find((t) => t.id === route.tab)!;
      return { title: `${tab.label} · QA resources · ${profile.name}`, description: tab.blurb };
    }
    case 'note':
      return { title: `${route.note.title} · ${profile.name}`, description: route.note.summary };
    case 'not-found':
      return { title: `Page not found · ${profile.name}`, description: who };
  }
}
