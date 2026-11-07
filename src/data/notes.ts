/**
 * Field notes: short write-ups of real work, in my own words. Each note is a
 * list of blocks so it renders without a Markdown dependency.
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
  {
    slug: 'junit-screenshots-in-gitlab',
    title: 'Failure screenshots in GitLab test reports',
    summary: 'GitLab can show a failed test\'s screenshot right in the pipeline report, if the JUnit XML points at it the right way.',
    date: '2026-11-07',
    tags: ['JUnit', 'GitLab CI', 'Reporting'],
    links: [
      { label: 'tester-army/e2e#1526', url: 'https://github.com/tester-army/e2e/pull/1526' },
    ],
    body: [
      { type: 'p', text: 'GitLab\'s test report shows a failed test\'s message, but the screenshot usually sits in the job artifacts where nobody opens it. GitLab will display it inline if the testcase\'s system-out holds an attachment line with a path relative to the project directory.' },
      { type: 'code', code: '<testcase name="checkout [web]" classname="tests/checkout.e2e.ts">\n  <failure message="cart is empty" type="ASSERTION_FAILED">...</failure>\n  <system-out>[[ATTACHMENT|.e2e/results/checkout/attempt-1/screenshots/001-failure.png]]</system-out>\n</testcase>' },
      { type: 'p', text: 'I added this to the e2e framework\'s JUnit reporter. The interesting part was the path, not the XML:' },
      { type: 'list', items: [
        'The base is $CI_PROJECT_DIR when set, else the project root. A monorepo whose tests live in apps/web needs the apps/web/ prefix, or GitLab finds nothing.',
        'Paths go through realpath on both sides, so a symlinked checkout or artifacts folder still resolves.',
        'A screenshot outside the base gets no link: GitLab could not serve it anyway.',
        'Failed, timed-out, flaky, and test.fail cases all link their screenshot, through one helper that writes every system-out.',
      ] },
      { type: 'p', text: 'Mutation testing showed where the unit tests were thin: dropping the realpath on one side still passed until I added a test where the artifacts folder itself is a symlink.' },
    ],
  },
];
