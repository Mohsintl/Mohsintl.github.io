# Mohsin · SDET

My profile site: projects, open-source contributions, skills, and a library of **QA resources** (cheat sheets, templates and boilerplates, test cases, and test scripts).

Live at **[mohsintl.is-a.dev](https://mohsintl.is-a.dev/)**.

It is a static React site. There is no backend: every word comes from files in this repository.

Every page is prerendered to its own HTML file at build time, so search engines, link previews and AI tools that don't run JavaScript see the full content. React then hydrates the page in the browser.

## Run it

Requires Node.js 20 or later.

```bash
npm ci
npm run dev        # http://localhost:5173
npm run build      # typecheck and build to build/
npm test           # Playwright tests against the production build
```

The first `npm test` needs a browser: `npx playwright install chromium`.

## Edit the content

| What | Where |
| :--- | :--- |
| Name, role, about, projects, contributions, skills | `src/data/profile.ts` |
| Notes (write-ups, each at `/notes/<slug>/`) | `src/data/notes.ts` |
| Cheat sheets | `src/data/resources/cheatSheets.tsx` |
| Templates and boilerplates | `src/data/resources/templates.tsx` |
| Test cases | `src/data/resources/testCases.ts` |
| Test scripts | `src/data/resources/testScripts.ts` |

The resources live on their own page, `/resources/`, with a page per tab (`/resources/templates/`, `/resources/testcases/`, `/resources/testscripts/`). Old `#/resources` and `#/notes/...` links redirect to these.

### Pages and prerendering

- `src/routes.ts` lists every page, its URL, and its title and description.
- `npm run build` builds the browser bundle, then a server bundle of `src/entry-server.tsx`, then runs `scripts/prerender.mjs`.
- The script writes one `index.html` per page with its title, description, canonical URL and link-preview tags, plus `404.html`, `llms.txt` (a plain-text summary for AI tools), `sitemap.xml` and `robots.txt`.
- `public/og-image.png` is the link-preview image.

## Tests

`tests/` holds Playwright tests that run against the production build on a desktop and a phone viewport:

- every project and contribution in `profile.ts` is listed with its link
- each nav link reaches its section, and the page never scrolls sideways
- the hero heading, tagline, and terminal stay inside the viewport on a phone
- external links open in a new tab with `rel="noopener"`
- the resources page opens from the nav, each tab has its own link, and back to profile returns home
- search and the category filter narrow the cheat sheets; cheat sheets and scripts expand to their code
- no resource links to a repository that does not exist
- every note is listed on the home page and opens on its own page with its links
- the page loads with no console errors
- every page's served HTML, before any JavaScript runs, has its own title, description, canonical URL, preview tags and full text
- the profile and a note are readable with JavaScript turned off
- old `#/` links redirect to their new page, and unknown addresses show the not-found page
- `llms.txt`, `sitemap.xml`, `robots.txt` and the preview image are served
- every page hydrates without console errors

## Deploy

`.github/workflows/deploy.yml` runs the tests on every pull request. A push to `main` runs them again and, if they pass, deploys `build/` to GitHub Pages.

The site is served at `https://mohsintl.is-a.dev/`, a free is-a.dev subdomain set as the Pages custom domain. The build uses relative paths, so it also works at a project path such as `https://mohsintl.github.io/portfolio/`.

## Suggest a resource

Open an issue or a pull request.
