# Mohsin · SDET

My profile site: projects, open-source contributions, skills, and a library of **QA resources** (cheat sheets, templates and boilerplates, test cases, and test scripts).

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
| Cheat sheets | `src/data/cheatSheets.tsx` |
| Templates and boilerplates | `src/components/TemplatesAndBoilerplates.tsx` |
| Test cases | `src/components/TestCases.tsx` |
| Test scripts | `src/components/TestScripts.tsx` |

## Tests

`tests/` holds Playwright tests that run against the production build on a desktop and a phone viewport:

- every project and contribution in `profile.ts` is listed with its link
- each nav link reaches its section, and the page never scrolls sideways
- external links open in a new tab with `rel="noopener"`
- resource tabs switch, search narrows the cheat sheets, and the category filter works
- the page loads with no console errors

## Deploy

`.github/workflows/deploy.yml` runs the tests on every pull request. A push to `main` runs them again and, if they pass, deploys `build/` to GitHub Pages.

The build uses relative paths, so it works at `https://mohsintl.github.io/qa-automation-resources/` and on a custom domain such as a free `*.is-a.dev` subdomain.

## Suggest a resource

Open an issue or a pull request.
