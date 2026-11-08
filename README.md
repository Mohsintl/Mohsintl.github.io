# Mohsin · SDET

My profile site: projects, open-source contributions, skills, and a library of **QA resources** (cheat sheets, templates and boilerplates, test cases, and test scripts).

Live at **[mohsintl.is-a.dev](https://mohsintl.is-a.dev/)**.

It is a static React site. There is no backend: every word comes from files in this repository.

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
| Notes (write-ups, each at `#/notes/<slug>`) | `src/data/notes.ts` |
| Cheat sheets | `src/data/resources/cheatSheets.tsx` |
| Templates and boilerplates | `src/data/resources/templates.tsx` |
| Test cases | `src/data/resources/testCases.ts` |
| Test scripts | `src/data/resources/testScripts.ts` |

The resources live on their own page, `#/resources`, with a link per tab (`#/resources/templates`, `#/resources/testcases`, `#/resources/testscripts`).

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

## Deploy

`.github/workflows/deploy.yml` runs the tests on every pull request. A push to `main` runs them again and, if they pass, deploys `build/` to GitHub Pages.

The site is served at `https://mohsintl.is-a.dev/`, a free is-a.dev subdomain set as the Pages custom domain. The build uses relative paths, so it also works at a project path such as `https://mohsintl.github.io/portfolio/`.

## Suggest a resource

Open an issue or a pull request.
