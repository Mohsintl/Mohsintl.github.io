/**
 * Notes: short write-ups of real work, in my own words. Each note is a list of
 * blocks so it renders without a Markdown dependency.
 *
 * A note with `pr` is a PR note: one merged pull request, written up as the
 * problem, what I did, and what I learned.
 */

export type Block =
  | { type: 'p'; text: string }
  | { type: 'h'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'code'; code: string };

export type Note = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  tags: string[];
  links: { label: string; url: string }[];
  body: Block[];
  /** Set on PR notes: the project and the merged pull request the note is about. */
  pr?: { project: string; repo: string; number: number };
};

export const notes: Note[] = [
  {
    slug: 'smoke-on-prs-regression-nightly',
    title: 'Smoke on every PR, three browsers every night',
    summary: 'How I split a Playwright suite into a fast PR gate and a full cross-browser regression, without hammering a public demo site.',
    date: '2026-11-07',
    tags: ['Playwright', 'GitHub Actions', 'CI'],
    links: [{ label: 'automation-exercise-playwright', url: 'https://github.com/Mohsintl/automation-exercise-playwright' }],
    body: [
      { type: 'p', text: 'My Playwright suite for automationexercise.com has 24 tests across 10 spec files. Running all of them on three browsers for every pull request is slow, and the site is a shared public demo: it throttles busy clients and sometimes answers with a "heavy load" page. So I split the work in two.' },
      { type: 'h', text: 'Smoke: the pull request gate' },
      { type: 'p', text: 'Seven tests carry a @smoke tag: home, the login page and an invalid login, the product list and search, add to cart, and the main navigation. Every pull request runs only those, on Chromium.' },
      { type: 'code', code: "test('should load home page successfully', { tag: '@smoke' }, async ({ page }) => {\n  // ...\n});\n\n// smoke.yml\nnpx playwright test --grep @smoke --project=chromium" },
      { type: 'h', text: 'Regression: everything, everywhere, one at a time' },
      { type: 'p', text: 'The full suite runs on Chromium, Firefox, and WebKit as a matrix on every push to main and nightly at 02:17 UTC. The nightly run matters because the site changes without any commit of mine.' },
      { type: 'code', code: 'strategy:\n  fail-fast: false   # one red browser must not hide the others\n  max-parallel: 1    # one browser\'s traffic on the public site at a time\n  matrix:\n    browser: [chromium, firefox, webkit]' },
      { type: 'h', text: 'Making failures cheap to read' },
      { type: 'list', items: [
        'One worker and two retries on CI, to stay under the site\'s load limits.',
        'A screenshot and a video on failure, and a trace on the first retry.',
        'The HTML report and test-results/ uploaded as an artifact even when tests fail.',
        'A BasePage that blocks ad networks and reloads the "heavy load" page up to three times, so a test fails on the app, not on an ad covering a button.',
      ] },
      { type: 'p', text: 'A required Smoke check on main finishes the setup: a pull request cannot merge until the smoke tests pass.' },
    ],
  },
  {
    slug: 'porting-playwright-to-e2e',
    title: 'Porting 23 Playwright tests to an agentic framework',
    summary: 'What broke when I moved the same journeys to the e2e framework: 15 locators, ads that only load in CI, and a "bug" that was really the site.',
    date: '2026-11-07',
    tags: ['e2e', 'Locators', 'Debugging'],
    links: [
      { label: 'e2e-automation-exercise', url: 'https://github.com/Mohsintl/e2e-automation-exercise' },
      { label: 'e2e framework', url: 'https://github.com/tester-army/e2e' },
    ],
    body: [
      { type: 'p', text: 'I ported the same automationexercise.com journeys to e2e, a framework that reads the page as an accessibility tree and locates by role and name. The suite had not run in a while, and the first honest run failed 15 of 23 tests.' },
      { type: 'h', text: 'Strict locators find loose assumptions' },
      { type: 'p', text: 'e2e refuses a locator that matches more than one node, so every loose regex showed up at once:' },
      { type: 'list', items: [
        '/men/i also matched "Women", and /kids/i matched "Kookie Kids". Exact names fixed both.',
        'The login page has two "Email Address" boxes, one for login and one for signup. .first() and .last() say which one I mean.',
        '"Add to cart" on product cards is an anchor without an href, so its role is text, not link.',
        'The search and subscribe buttons have no accessible name. I located them by position and by their container, and that is worth a bug report to the site.',
      ] },
      { type: 'h', text: 'Green locally, red in CI' },
      { type: 'p', text: 'Three tests passed on my machine and failed in GitHub Actions with "locator matched 2 nodes". The CI log printed the second match: a link named "Polo T-Shirts" next to the real brand link "(6) Polo". My sandbox blocked Google ads; CI loaded them, and the ads injected links that collided with the site\'s own. Blocking ad networks before each test made every run see the same page.' },
      { type: 'code', code: "const AD_HOSTS = /googlesyndication|doubleclick|googleadservices|adservice\\.google/;\n\nexport async function blockAds(browser: Browser) {\n  await browser.route(AD_HOSTS, (route) => route.abort());\n}" },
      { type: 'h', text: 'The bug that wasn\'t' },
      { type: 'p', text: 'One or two random tests still failed per run, with the framework reading the page as a near-empty 2-node tree. It looked like an engine bug. Before filing it, I recorded the framework\'s view and the real DOM side by side every 400 ms.' },
      { type: 'p', text: 'They agreed every time. The site sometimes serves a "One moment, please..." holding page for about five seconds, and the default assertion timeout is five seconds. The framework was reading a nearly empty page correctly. Checking against ground truth first saved me from filing a false bug report with the maintainers.' },
    ],
  },

  // ---------------------------------------------------------------------------
  // PR notes, newest first: one merged pull request each.
  // ---------------------------------------------------------------------------

  {
    slug: 'pr-element-profile-picture-test',
    title: 'Element: the profile picture test that lost its token',
    summary: 'A flaky avatar test on Firefox and WebKit was really a 404: without a service worker, media requests go out without the access token.',
    date: '2026-11-20',
    tags: ['Playwright', 'Flaky tests', 'Service workers'],
    pr: { project: 'Element', repo: 'element-hq/element-web', number: 35935 },
    links: [
      { label: 'element-hq/element-web#35935', url: 'https://github.com/element-hq/element-web/pull/35935' },
      { label: 'Issue #35267', url: 'https://github.com/element-hq/element-web/issues/35267' },
    ],
    body: [
      { type: 'h', text: 'The problem' },
      { type: 'p', text: 'The account settings test "should support adding and removing a profile picture" was flaky on Firefox and WebKit (issue #35267). After the upload, the avatar sometimes showed the letter "B" instead of the picture.' },
      { type: 'h', text: 'What I did' },
      { type: 'list', items: [
        'Logged the network during the test. The upload and the avatar save returned 200, but the thumbnail request returned 404 every time, whether the test passed or failed.',
        'Found why: Element adds the access token to media requests from its service worker. Element\'s Playwright config blocks service workers on Firefox and WebKit, so the thumbnail went out without the token and the homeserver rejected it. The test only passed when it checked before the image fell back to the letter.',
        'My first version mocked the thumbnail request. A maintainer (t3chguy) preferred to skip the test where it cannot work, so I removed the mock and skipped Firefox and WebKit. Chrome still runs it and checks that the real thumbnail loads.',
        'Before: Firefox failed 5 of 10 runs, WebKit 2 of 5. After: both skipped, Chrome passed 5 of 5.',
      ] },
      { type: 'code', code: 'test("should support adding and removing a profile picture", async ({ uut, page, browserName }) => {\n    // Firefox and WebKit block service workers (see playwright.config.ts), so the avatar thumbnail is\n    // requested without the access token, which the test homeserver rejects with a 404.\n    test.skip(browserName !== "chromium", "needs the service worker to load authenticated media");' },
      { type: 'h', text: 'What I learned' },
      { type: 'list', items: [
        'A flaky test can sit on top of a request that fails every time. Watching the network shows that faster than rerunning the test.',
        'A mock can make a test pass while hiding what users actually get. When a browser setup cannot support a feature, a skip with a clear reason is more honest.',
        'Ask the maintainers which fix they want. The change they asked for was smaller than mine.',
      ] },
    ],
  },
  {
    slug: 'pr-element-emoji-verification',
    title: 'Element: two users racing to verify',
    summary: 'An emoji verification test failed 11 times in 15 because both users clicked the same button, and one of them no longer had it.',
    date: '2026-11-19',
    tags: ['Playwright', 'Flaky tests', 'Race conditions'],
    pr: { project: 'Element', repo: 'element-hq/element-web', number: 35934 },
    links: [
      { label: 'element-hq/element-web#35934', url: 'https://github.com/element-hq/element-web/pull/35934' },
      { label: 'Issue #33134', url: 'https://github.com/element-hq/element-web/issues/33134' },
    ],
    body: [
      { type: 'h', text: 'The problem' },
      { type: 'p', text: 'A crypto test, "verified devices should be able to decrypt while global blacklist is toggled", was flaky (issue #33134). It verifies two users, Alice and Bob, with emoji, and it often timed out waiting for a button.' },
      { type: 'h', text: 'What I did' },
      { type: 'list', items: [
        'Ran it 15 times with --repeat-each: it failed 11 times.',
        'Bob\'s failure screenshot showed he was already on the emoji screen. Once Alice starts verification, Bob\'s app moves straight to the emoji, so his "Verify by emoji" button is often gone before the test clicks it.',
        'Removed Bob\'s click, so only Alice starts. Another helper in the same file already did this, and its comment described the same race.',
        'After: 15 of 15 on a quiet machine, 14 of 15 under heavy load, where the one failure was a different, earlier step timing out.',
      ] },
      { type: 'code', code: '// Only Alice starts emoji verification: Bob\'s app then goes straight to the emoji. If Bob also clicked\n// "Verify by emoji", the two starts would race, and the button is often gone before he can click it.\n- await bobElementApp.page.getByRole("button", { name: "Verify by emoji" }).click();' },
      { type: 'h', text: 'What I learned' },
      { type: 'list', items: [
        'In a two-user test, one user\'s action can change the other user\'s screen. The test has to follow the real protocol, not click everything on both sides.',
        'Read the neighbouring helpers first. The fix, and the reason for it, were already in the codebase.',
        'Measure a flake before and after: a pass rate out of N runs is evidence, one green run is not.',
      ] },
    ],
  },
  {
    slug: 'pr-openvsx-tabs-and-namespace',
    title: 'Open VSX: testing tabs without hardcoding their content',
    summary: 'Smoke tests for the Changes and Ratings & Reviews tabs and the namespace link that work for any extension on production and staging.',
    date: '2026-11-19',
    tags: ['Playwright', 'Smoke tests', 'Locators'],
    pr: { project: 'Eclipse Open VSX', repo: 'eclipse-openvsx/openvsx', number: 2463 },
    links: [
      { label: 'eclipse-openvsx/openvsx#2463', url: 'https://github.com/eclipse-openvsx/openvsx/pull/2463' },
      { label: 'Issue #1998', url: 'https://github.com/eclipse-openvsx/openvsx/issues/1998' },
    ],
    body: [
      { type: 'h', text: 'The problem' },
      { type: 'p', text: 'Open VSX\'s smoke tests run against production on a schedule and against staging, with a different extension on each. The extension page\'s tabs and its namespace link had no tests (part of issue #1998).' },
      { type: 'h', text: 'What I did' },
      { type: 'list', items: [
        'Changes tab: the test checks the URL moves to …/changes, then reads the first line of the CHANGELOG.md the page fetched, strips the Markdown, and checks that text is on screen. Production\'s changelog starts with a sentence and a link, staging\'s with a "### v1.4.0" heading, and the same test handles both.',
        'Ratings & Reviews tab: the URL moves to …/reviews and the page shows User Reviews with a "Log in to Review" link, since the smoke tests run logged out.',
        'Namespace link: it opens /namespace/<name>, which links back to the extension.',
        'Proved the tests can fail: with an empty changelog served, the tabs test fails; with a namespace listing no extensions, the namespace test fails.',
        'Review: the namespace test assumed the link shows the namespace id, which only holds without a display name. I switched to finding the link by its target.',
        'Left one step out on purpose: going back from the namespace page opened an empty error dialog on production (v1.3.2) but worked on staging (v1.4.0), which looked like a bug already fixed but not yet deployed. I wrote that up in the PR instead of adding a test that fails on production.',
      ] },
      { type: 'code', code: '// the link shows the namespace\'s display name, so find it by its target\nawait page.locator(`a[href$="/namespace/${namespace}"]`).click();\nawait expect(page).toHaveURL(new RegExp(`/namespace/${namespace}$`));' },
      { type: 'h', text: 'What I learned' },
      { type: 'list', items: [
        'Derive the expected value from the data the page loaded, not from a hardcoded string, when one test runs against several environments.',
        'When the visible text depends on data, locate by something stable, like the link\'s href.',
        'A failure that is a known, already-fixed bug belongs in the PR description, not in a test that will stay red.',
      ] },
    ],
  },
  {
    slug: 'pr-element-service-worker-toast',
    title: 'Element: one toast behind four flaky tests',
    summary: 'A "Failed to load service worker" toast covered buttons on Firefox and WebKit. One Playwright locator handler fixed four flaky-test issues.',
    date: '2026-11-19',
    tags: ['Playwright', 'Flaky tests', 'Fixtures'],
    pr: { project: 'Element', repo: 'element-hq/element-web', number: 35936 },
    links: [
      { label: 'element-hq/element-web#35936', url: 'https://github.com/element-hq/element-web/pull/35936' },
      { label: 'Issue #35391', url: 'https://github.com/element-hq/element-web/issues/35391' },
    ],
    body: [
      { type: 'h', text: 'The problem' },
      { type: 'p', text: 'Four flaky-test issues (#35391, #29876, #27853, #28584) failed on Firefox and WebKit with the same Playwright error: an element "intercepts pointer events". Those browsers block service workers in Element\'s tests, so Element shows a "Failed to load service worker" toast, and it sat on top of whatever the test clicked next. Helpers like viewRoomByName closed other toasts but not this one.' },
      { type: 'h', text: 'What I did' },
      { type: 'list', items: [
        'Matched the CI failure log of #35391 to the toast, then found three more issues with the same cause.',
        'Added a page fixture that registers a Playwright locator handler: whenever the toast blocks an action, it clicks OK and the action continues.',
        'Enabled it only for projects that block service workers, so Chrome runs exactly as before.',
        'Before, several of these failed 5 of 5 runs on Firefox or WebKit; after, all passed 5 of 5.',
      ] },
      { type: 'code', code: 'page: async ({ page }, use, testInfo) => {\n    if (testInfo.project.use.serviceWorkers === "block") {\n        const toast = page.locator(".mx_Toast_toast", { hasText: "Failed to load service worker" });\n        await page.addLocatorHandler(toast, () => toast.getByRole("button", { name: "OK" }).click());\n    }\n    await use(page);\n},' },
      { type: 'h', text: 'What I learned' },
      { type: 'list', items: [
        'page.addLocatorHandler() is the tool for an overlay that can appear at any time: no sleeps and no "dismiss if visible" checks in every test.',
        'Group flaky-test issues by their error message. Four issues can share one root cause, and one fix closes them all.',
        'Scope a workaround to where the problem exists, so it cannot change behaviour anywhere else.',
      ] },
    ],
  },
  {
    slug: 'pr-openvsx-switch-versions',
    title: 'Open VSX: switching versions, and a race in the search',
    summary: 'A smoke test for switching an extension to an older version and back, plus a search race the maintainer and I found on staging.',
    date: '2026-11-18',
    tags: ['Playwright', 'Smoke tests', 'Race conditions'],
    pr: { project: 'Eclipse Open VSX', repo: 'eclipse-openvsx/openvsx', number: 2462 },
    links: [
      { label: 'eclipse-openvsx/openvsx#2462', url: 'https://github.com/eclipse-openvsx/openvsx/pull/2462' },
      { label: 'Issue #1998', url: 'https://github.com/eclipse-openvsx/openvsx/issues/1998' },
    ],
    body: [
      { type: 'h', text: 'The problem' },
      { type: 'p', text: 'The smoke tests only checked that the version picker had options. Nothing checked that picking a version actually switched the page (part of issue #1998).' },
      { type: 'h', text: 'What I did' },
      { type: 'list', items: [
        'Wrote a test that picks an older version and checks three things switch to it: the URL, the selected value and the Download link. Then it switches back to the latest version and checks them again.',
        'Polled the option list, because the older versions can load after the latest one.',
        'Proved it can fail: with page.route serving the latest version\'s data for an older version\'s URL, the test failed at the selected value (expected 2.5.0, received 2.5.1).',
        'On staging, my test and an existing one both failed at the same step. The maintainer (netomi) traced it to a race: on staging the extension is already listed before the search runs, so the click hit the old results grid while the debounced search re-rendered it.',
        'Fixed it in a shared openExtension() helper that waits for the search response before clicking, used by both tests. The maintainer then ran the full suite 30 of 30 on production and staging, where the two extension tests had failed 5 of 10 before.',
      ] },
      { type: 'code', code: 'const searched = page.waitForResponse(\n    response =>\n        response.url().includes(\'/api/-/search\') &&\n        response.url().includes(encodeURIComponent(extension.searchTerm))\n);\nawait searchField(page).fill(extension.searchTerm);\nawait searched;\nawait page.getByRole(\'link\', { name: extension.heading }).click();' },
      { type: 'h', text: 'What I learned' },
      { type: 'list', items: [
        'A failure that also happens without your change is still worth chasing. This one was a real race in an existing test.',
        'With a debounced search, waiting for the element is not enough, because the old element is still there. Wait for the response that replaces it.',
        'Inject a fault to prove a new test fails when the feature breaks. A test that never fails proves nothing.',
      ] },
    ],
  },
  {
    slug: 'pr-selenium-select-by-value',
    title: 'Selenium: an XPath escaper inside a CSS selector',
    summary: 'select_by_value built a CSS selector with an XPath escaper, so values with both quote types or a backslash could not be selected.',
    date: '2026-11-15',
    tags: ['Selenium', 'Python', 'Unit tests'],
    pr: { project: 'Selenium', repo: 'SeleniumHQ/selenium', number: 18305 },
    links: [
      { label: 'SeleniumHQ/selenium#18305', url: 'https://github.com/SeleniumHQ/selenium/pull/18305' },
    ],
    body: [
      { type: 'h', text: 'The problem' },
      { type: 'p', text: 'In Selenium\'s Python bindings, select_by_value and deselect_by_value found options with a CSS selector, but escaped the value with _escape_string, which makes an XPath string literal. Two kinds of values broke:' },
      { type: 'list', items: [
        'Both quote types, like a\'b"c: the escaper returns concat(...), which is not valid CSS, so the browser throws a SyntaxError.',
        'A backslash, like a\\b: plain in XPath, but an escape character in CSS, so the selector looked for "ab" and found nothing.',
      ] },
      { type: 'h', text: 'What I did' },
      { type: 'list', items: [
        'Switched both methods to the XPath .//option[@value = ...], the language the escaper was written for. The Java, .NET, Ruby and JavaScript bindings already find options this way.',
        'Added unit tests with a fake select element that records the locator it is asked for, so no browser is needed. 8 of the new cases fail on trunk and pass with the change.',
        'Checked in Chromium: the old CSS threw or found nothing, the new XPath found the option. Also ran the new XPath through lxml on 20,000 random values made of letters, spaces, quotes and backslashes, and it matched the right option every time.',
      ] },
      { type: 'code', code: '- css = f"option[value ={self._escape_string(value)}]"\n- opts = self._el.find_elements(By.CSS_SELECTOR, css)\n+ xpath = f".//option[@value = {self._escape_string(value)}]"\n+ opts = self._el.find_elements(By.XPATH, xpath)' },
      { type: 'h', text: 'What I learned' },
      { type: 'list', items: [
        'Escaping belongs to a language. An XPath escaper inside a CSS selector is wrong for exactly the inputs that need escaping.',
        'When one binding differs from the others, check how the others do it. Matching them was the smaller fix.',
        'A fake object that records calls lets you unit-test locator logic without starting a browser.',
      ] },
    ],
  },
  {
    slug: 'pr-e2e-automation-exercise-example',
    title: 'e2e: an example PR that was closed, then merged',
    summary: 'My Automation Exercise suite was first rejected as a community example because it did not run. Fixing it taught me more than the PR itself.',
    date: '2026-11-12',
    tags: ['e2e', 'Community examples', 'Code review'],
    pr: { project: 'e2e', repo: 'e2e-inc/e2e', number: 1512 },
    links: [
      { label: 'e2e-inc/e2e#1512', url: 'https://github.com/e2e-inc/e2e/pull/1512' },
      { label: 'e2e-automation-exercise', url: 'https://github.com/Mohsintl/e2e-automation-exercise' },
    ],
    body: [
      { type: 'h', text: 'The problem' },
      { type: 'p', text: 'I proposed my e2e suite for automationexercise.com as a community example on the e2e framework\'s site. A maintainer\'s automated review closed the PR on 3 November: the example did not run on the current release.' },
      { type: 'list', items: [
        'Its config used defineConfig, which had been removed, so e2e run failed to load the config and ran 0 tests.',
        'With the config patched, 14 of 23 tests still failed on ambiguous or missing locators.',
        'They also pointed out that e-commerce was already covered by another example.',
      ] },
      { type: 'h', text: 'What I did' },
      { type: 'list', items: [
        'Fixed the suite in my own repository: the config, the strict-locator failures, and ads that only loaded in CI. The note "Porting 23 Playwright tests to an agentic framework" covers that work.',
        'A maintainer reopened the PR on 12 November, and it merged pinned to the newer commit of my repository.',
      ] },
      { type: 'h', text: 'What I learned' },
      { type: 'list', items: [
        'Run your example on the current release before you submit it. The maintainers do, and they found what I had not.',
        'A closed PR is feedback, not the end. Each point in the review was a concrete thing to fix.',
        'Read the contribution rules for examples: what is already covered, and which tags mean what.',
      ] },
    ],
  },
  {
    slug: 'pr-e2e-omadeck-example',
    title: 'e2e: OmaDeck as a community example',
    summary: 'Listing my own app on the e2e framework\'s site: tests that tap a phone deck while fake desktop tools record what each tap sends.',
    date: '2026-11-12',
    tags: ['e2e', 'Community examples', 'Test doubles'],
    pr: { project: 'e2e', repo: 'e2e-inc/e2e', number: 1707 },
    links: [
      { label: 'e2e-inc/e2e#1707', url: 'https://github.com/e2e-inc/e2e/pull/1707' },
      { label: 'OmaDeck', url: 'https://github.com/Mohsintl/omadeck' },
    ],
    body: [
      { type: 'h', text: 'The problem' },
      { type: 'p', text: 'The e2e framework lists community examples on its site. I wanted OmaDeck, my phone remote for Hyprland desktops, on that list. It is a Python app, and its tests need a desktop that CI does not have.' },
      { type: 'h', text: 'What I did' },
      { type: 'list', items: [
        'The example\'s tests open the deck in a phone-sized browser and tap its keys. The server runs with fake hyprctl and wtype commands on its PATH, which only log each call, so the tests check what reached the desktop without Hyprland.',
        'Added the entry to examples.json and a python framework tag, since it was the first Python app on the list. The repository\'s check script passed with all 60 examples, and the example\'s own CI passed.',
        'The maintainer asked for the community title format, "Testing X with e2e", because "e2e with <framework>" is for official starters. I renamed it to "Testing OmaDeck\'s phone deck with e2e".',
      ] },
      { type: 'h', text: 'What I learned' },
      { type: 'list', items: [
        'Fakes on PATH are a cheap way to test side effects of a program that calls system tools.',
        'Small naming rules matter to maintainers. Follow the existing entries exactly.',
      ] },
    ],
  },
  {
    slug: 'pr-selenium-select-quotes',
    title: 'Selenium: a quote added twice',
    summary: 'select_by_visible_text could not select text with both quote types ending in a double quote, because Python\'s split keeps a trailing empty string.',
    date: '2026-11-12',
    tags: ['Selenium', 'Python', 'Unit tests'],
    pr: { project: 'Selenium', repo: 'SeleniumHQ/selenium', number: 18292 },
    links: [
      { label: 'SeleniumHQ/selenium#18292', url: 'https://github.com/SeleniumHQ/selenium/pull/18292' },
    ],
    body: [
      { type: 'h', text: 'The problem' },
      { type: 'p', text: 'I found this reading the Select code. For text with both quote types, _escape_string builds an XPath concat(). It split the text on double quotes, then added one more if the text ended with one. But Python\'s split keeps an empty string at the end, so that last quote was added twice. For it\'s "quoted" the XPath read it\'s "quoted"", and nothing matched. Java\'s version does not hit this, because Java\'s split drops trailing empty strings.' },
      { type: 'h', text: 'What I did' },
      { type: 'list', items: [
        'Rebuilt concat() from the pieces: a double quote between pieces, and empty pieces skipped, so every quote in the text appears exactly once. Text with one kind of quote or none is handled as before.',
        'Added the first unit tests for this helper, with no browser needed. 4 of the cases fail on trunk and pass with the fix.',
        'Checked the output against lxml\'s XPath engine on 20,000 random strings of letters, spaces and both quotes: every one matched.',
        'Noted in the PR that Java\'s version may lose a quote in a rarer case, and that select_by_value had a separate bug. That became my next PR.',
      ] },
      { type: 'code', code: 'parts = []\nfor index, substring in enumerate(value.split(\'"\')):\n    if index:\n        parts.append("\'\\"\'")\n    if substring:\n        parts.append(f\'"{substring}"\')\nreturn f"concat({\', \'.join(parts)})"' },
      { type: 'h', text: 'What I learned' },
      { type: 'list', items: [
        'Code ported between languages can break on library details: split() behaves differently in Python and Java.',
        'A reference engine plus random inputs (here lxml and 20,000 strings) catches cases that hand-written examples miss.',
        'Write down what you found but left out. It shows the reviewers the scope, and it gave me the next PR.',
      ] },
    ],
  },
  {
    slug: 'junit-screenshots-in-gitlab',
    title: 'e2e: failure screenshots in GitLab test reports',
    summary: 'GitLab can show a failed test\'s screenshot right in the pipeline report, if the JUnit XML points at it the right way. Three review rounds got the path right.',
    date: '2026-11-09',
    tags: ['JUnit', 'GitLab CI', 'Mutation testing'],
    pr: { project: 'e2e', repo: 'e2e-inc/e2e', number: 1526 },
    links: [
      { label: 'e2e-inc/e2e#1526', url: 'https://github.com/e2e-inc/e2e/pull/1526' },
      { label: 'Issue #1507', url: 'https://github.com/e2e-inc/e2e/issues/1507' },
    ],
    body: [
      { type: 'h', text: 'The problem' },
      { type: 'p', text: 'GitLab\'s test report shows a failed test\'s message, but the screenshot usually sits in the job artifacts where nobody opens it. GitLab will display it inline if the testcase\'s system-out holds an attachment line with a path relative to the project directory. The e2e framework\'s JUnit reporter did not write one (issue #1507).' },
      { type: 'code', code: '<testcase name="checkout [web]" classname="tests/checkout.e2e.ts">\n  <failure message="cart is empty" type="ASSERTION_FAILED">...</failure>\n  <system-out>[[ATTACHMENT|.e2e/results/checkout/attempt-1/screenshots/001-failure.png]]</system-out>\n</testcase>' },
      { type: 'h', text: 'What I did' },
      { type: 'list', items: [
        'Added the attachment line for tests that failed, timed out, passed only on a retry, or failed as test.fail expected. One systemOut() helper writes every system-out: the flaky note, the expected-failure note, then the attachment.',
        'The base is $CI_PROJECT_DIR when set, else the project root. A monorepo whose tests live in apps/web needs the apps/web/ prefix, or GitLab finds nothing. A screenshot outside the base gets no link, since GitLab could not serve it.',
        'Review round 1: the path check broke on symlinks (macOS /tmp is really /private/tmp), I read the environment directly instead of with the project\'s helper, and mutation testing showed the reporter logic was barely tested.',
        'Round 2: the tests did not typecheck, the base-dir logic had two rules that disagreed, and the tests had grown to +454 lines. I made it one rule, shared a posixRelative() helper across three reporters, and cut the tests to +229 lines with a builder and it.each.',
        'Round 3: rebased over a new test.fail feature and routed its note through the same helper. Final state: 45 reporter tests, and 23 of 25 mutations killed.',
      ] },
      { type: 'h', text: 'What I learned' },
      { type: 'list', items: [
        'Mutation testing shows where tests are thin: dropping the realpath on one side still passed until I added a test where the artifacts folder itself is a symlink.',
        'Use the project\'s own helpers (paths, environment) instead of writing new ones. Reviewers notice the duplicates.',
        'Never change the real environment in a test: vi.stubEnv instead of delete process.env.X.',
        'Keep the PR description true to the latest commit. Stale numbers in it were one of the review comments.',
      ] },
    ],
  },
  {
    slug: 'pr-e2e-date-patterns',
    title: 'e2e: when "Marketing 12" looked like a date',
    summary: 'A loose month pattern made the replay cache treat text like "Marketing 12" as a date. Shared, stricter patterns and tests that fail on main fixed it.',
    date: '2026-11-07',
    tags: ['e2e', 'Regex', 'Code review'],
    pr: { project: 'e2e', repo: 'e2e-inc/e2e', number: 1511 },
    links: [
      { label: 'e2e-inc/e2e#1511', url: 'https://github.com/e2e-inc/e2e/pull/1511' },
    ],
    body: [
      { type: 'h', text: 'The problem' },
      { type: 'p', text: 'The e2e framework\'s replay cache ignores text that changes between runs, like dates and times, when it checks a replay\'s end state. Its month pattern allowed any letters after "mar", "may" or "aug", so "Marketing 12", "Mayor 3", "Augusta 3" and "12 Marketing" all counted as dates and were skipped. The same patterns were also copied in two files.' },
      { type: 'h', text: 'What I did' },
      { type: 'list', items: [
        'Moved the date and time patterns (ISO date, clock time, month-day and day-month dates) into one shared file, internal/dates.ts, used by both places.',
        'Replaced the loose month prefix with exact month names and abbreviations, so the false positives are gone.',
        'Added tests with those four inputs. On main they were skipped as dates, so the test saw 4 new texts instead of 8; with the fix it sees all 8.',
        'Wrote down two side effects in the PR: some non-English months had matched by accident and no longer do, and dates with extra spaces or tabs now count.',
        'The maintainers\' review asked for five things, including a rebase without duplicate tests and a user-facing changeset. I did each one and said so in my reply.',
      ] },
      { type: 'code', code: '/** A month followed by day with optional year (e.g. `October 26th`, `Sep 8, 2026`). */\nexport const MONTH_DAY_DATE = new RegExp(String.raw`\\b${MONTH}\\s+${DAY}(?:,?\\s+\\d{4})?\\b`, \'i\');' },
      { type: 'h', text: 'What I learned' },
      { type: 'list', items: [
        'A regex needs negative tests: inputs that must not match. A test that fails on main is the proof the fix does something.',
        'Write down behaviour changes, even the good ones, so reviewers do not discover them.',
        'Answer review asks one by one, so the reviewer can check them off.',
      ] },
    ],
  },
];

/** Notes about my own work, in the order they were written. */
export const fieldNotes = notes.filter((note) => !note.pr);

/** PR notes, newest first. */
export const prNotes = notes.filter((note) => note.pr);
