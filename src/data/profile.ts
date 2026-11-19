/**
 * Everything the profile pages show. Edit this file to update the site;
 * no component needs to change.
 */

export const profile = {
  name: 'Mohsin',
  fullName: 'Mohsin Mohammed T L',
  role: 'Senior Quality Engineer Analyst & SDET',
  tagline: 'I break software before your users do, then automate the test so the bug never comes back.',
  about: [
    'Computer Science graduate with about five years in quality engineering at Accenture, testing web, Android and iOS apps at scale.',
    'I write end-to-end suites in Playwright and agentic frameworks, wire them into CI as quality gates, and contribute fixes back to the open-source testing tools I use.',
  ],
  github: 'https://github.com/Mohsintl',
  linkedin: 'https://www.linkedin.com/in/mohsintl',
  email: 'tlmdmohsin782@gmail.com',
  githubHandle: 'Mohsintl',
  /** Where readers suggest a resource or fix: the site's own repository. */
  repository: 'https://github.com/Mohsintl/portfolio',
};

export type Role = { title: string; dates: string; points: string[] };

/** Work history, newest role first. */
export const experience: { company: string; context: string; roles: Role[] }[] = [
  {
    company: 'Accenture',
    context: 'Client: a leading social media platform',
    roles: [
      {
        title: 'Senior Quality Engineer Analyst',
        dates: 'Dec 2025 – present',
        points: [
          'Functional quality for client-facing features on web, Android and iOS: regression planning, test-result validation and release readiness.',
          'Help train three client AI agents: one turns application logs into test steps, one tries to reproduce issues on an emulator, and one proposes Jira labels for a reviewer to approve.',
          'Evaluate the agents\' proposals with structured feedback (correct, incorrect and other categories) to improve the accuracy and ranking of later recommendations.',
          'Mentor junior QA engineers, and use GitHub Copilot and AI-assisted workflows in test development.',
        ],
      },
      {
        title: 'Quality Engineer Analyst',
        dates: 'Dec 2022 – Nov 2025',
        points: [
          'End-to-end functional testing of communication, calling and chat features on web, Android and iOS.',
          'Maintained and ran regression suites, including two-cycle regression for web and mobile releases.',
          'Defect triage, prioritisation, verification and SLA tracking with engineering teams.',
        ],
      },
      {
        title: 'Quality Engineer Associate',
        dates: 'Oct 2021 – Nov 2022',
        points: [
          'Manual functional testing of web and mobile features on Android and iOS in an Agile team: regression cycles, defect verification and test-result validation.',
        ],
      },
    ],
  },
];

export const certifications = ['AWS Certified Cloud Practitioner'];

export type Project = {
  name: string;
  url: string;
  summary: string;
  highlights: string[];
  tech: string[];
};

export const projects: Project[] = [
  {
    name: 'automation-exercise-playwright',
    url: 'https://github.com/Mohsintl/automation-exercise-playwright',
    summary: 'End-to-end suite for an e-commerce demo site using the Page Object Model.',
    highlights: [
      '24 tests across 10 user journeys',
      'Smoke tests on every pull request; regression on Chromium, Firefox, and WebKit on main and nightly',
      'Screenshots, videos, and traces kept on failure',
    ],
    tech: ['Playwright', 'TypeScript', 'GitHub Actions'],
  },
  {
    name: 'e2e-automation-exercise',
    url: 'https://github.com/Mohsintl/e2e-automation-exercise',
    summary: 'The same journeys ported to the agentic e2e framework, to compare it with Playwright.',
    highlights: [
      'Featured as a community example on e2e',
      '23 tests with smoke and regression workflows',
      'Ad-network blocking for deterministic runs',
    ],
    tech: ['e2e', 'TypeScript', 'GitHub Actions'],
  },
  {
    name: 'OmaDeck',
    url: 'https://github.com/Mohsintl/omadeck',
    summary: 'Turns a phone into a Stream Deck and voice remote for Omarchy and Hyprland, served as a PWA from a small Python bridge.',
    highlights: [
      'Phone-deck end-to-end tests with a fake desktop, featured as a community example on e2e',
      '500+ unit tests and the e2e suite in CI on every pull request',
      'Token and PIN authentication with rate limiting',
    ],
    tech: ['Python', 'PWA', 'e2e', 'GitHub Actions'],
  },
  {
    name: 'AI Conversation Control',
    url: 'https://github.com/Mohsintl/ai-conversation-control',
    summary: 'A browser extension that saves your messages to ChatGPT and Claude as checkpoints you can search and jump back to.',
    highlights: ['Early MVP: capture, search, and jump-back'],
    tech: ['TypeScript', 'Chrome Extensions'],
  },
];

export type Contribution = {
  /** Which part of the Open source section it is listed in. */
  group: 'tests' | 'tools' | 'examples' | 'other';
  project: string;
  projectUrl: string;
  about: string;
  items: { label: string; url: string; status: 'merged' | 'in review' | 'co-authored' }[];
};

export const contributionGroups: { id: Contribution['group']; title: string; about: string }[] = [
  { id: 'tests', title: 'Tests for other products', about: 'End-to-end tests I wrote for open-source products, so their bugs get caught in CI.' },
  { id: 'tools', title: 'Fixes in testing tools', about: 'Bugs I fixed inside the tools testers rely on.' },
  { id: 'examples', title: 'Community examples', about: 'Test suites a testing project shows its users as reference examples.' },
  { id: 'other', title: 'Other open source', about: 'Widgets, tooling and fixes outside testing.' },
];

export const contributions: Contribution[] = [
  {
    group: 'tools',
    project: 'e2e',
    projectUrl: 'https://github.com/e2e-inc/e2e',
    about: 'Next-generation agentic e2e framework for web and mobile',
    items: [
      { label: 'Fix date patterns in the replay cache', url: 'https://github.com/e2e-inc/e2e/pull/1511', status: 'merged' },
      { label: 'JUnit failure screenshots as GitLab attachments', url: 'https://github.com/e2e-inc/e2e/pull/1526', status: 'merged' },
    ],
  },
  {
    group: 'tests',
    project: 'Eclipse Open VSX',
    projectUrl: 'https://github.com/eclipse-openvsx/openvsx',
    about: 'Extension registry behind VS Code forks',
    items: [
      { label: 'Playwright test: switch an extension to an older version and back', url: 'https://github.com/eclipse-openvsx/openvsx/pull/2462', status: 'merged' },
      { label: 'Playwright tests: changelog and reviews tabs, and the namespace link', url: 'https://github.com/eclipse-openvsx/openvsx/pull/2463', status: 'merged' },
    ],
  },
  {
    group: 'tests',
    project: 'Element',
    projectUrl: 'https://github.com/element-hq/element-web',
    about: 'Matrix chat client for the web and desktop',
    items: [
      { label: 'Fix flaky emoji verification between two users', url: 'https://github.com/element-hq/element-web/pull/35934', status: 'merged' },
      { label: 'Dismiss the service worker toast that broke four tests on Firefox and WebKit', url: 'https://github.com/element-hq/element-web/pull/35936', status: 'merged' },
      { label: 'Fix the flaky profile picture test', url: 'https://github.com/element-hq/element-web/pull/35935', status: 'in review' },
      { label: 'Wait for the leave to sync before reopening a 1:1 chat', url: 'https://github.com/element-hq/element-web/pull/35941', status: 'in review' },
    ],
  },
  {
    group: 'tools',
    project: 'Selenium',
    projectUrl: 'https://github.com/SeleniumHQ/selenium',
    about: 'Browser automation framework',
    items: [
      { label: 'Fix Select escaping of trailing double quotes (Python)', url: 'https://github.com/SeleniumHQ/selenium/pull/18292', status: 'merged' },
      { label: 'Find Select options by value with XPath (Python)', url: 'https://github.com/SeleniumHQ/selenium/pull/18305', status: 'merged' },
      { label: 'Keep waiting when an element goes stale in three expected conditions (Python)', url: 'https://github.com/SeleniumHQ/selenium/pull/18319', status: 'in review' },
    ],
  },
  {
    group: 'tests',
    project: 'Tabularis',
    projectUrl: 'https://github.com/TabularisDB/tabularis',
    about: 'Database client for desktop and the browser',
    items: [
      { label: 'Phone and tablet Playwright projects with a responsive smoke spec', url: 'https://github.com/TabularisDB/tabularis/pull/1612', status: 'in review' },
    ],
  },
  {
    group: 'tools',
    project: 'test-reporter',
    projectUrl: 'https://github.com/dorny/test-reporter',
    about: 'Test results in GitHub Actions',
    items: [
      { label: 'Document when checks: write is needed', url: 'https://github.com/dorny/test-reporter/pull/865', status: 'in review' },
    ],
  },
  {
    group: 'examples',
    project: 'e2e examples',
    projectUrl: 'https://e2e.com/examples/omadeck',
    about: 'Community examples on the e2e site',
    items: [
      { label: 'OmaDeck added as a community example', url: 'https://github.com/e2e-inc/e2e/pull/1707', status: 'merged' },
      { label: 'Automation Exercise added as a community example', url: 'https://github.com/e2e-inc/e2e/pull/1512', status: 'merged' },
    ],
  },
  {
    group: 'examples',
    project: 'Selenium docs',
    projectUrl: 'https://github.com/SeleniumHQ/seleniumhq.github.io',
    about: 'The documentation on selenium.dev',
    items: [
      { label: 'Tested Java and Python examples for the Listeners page', url: 'https://github.com/SeleniumHQ/seleniumhq.github.io/pull/3000', status: 'in review' },
    ],
  },
  {
    group: 'other',
    project: 'omarchy-widgets',
    projectUrl: 'https://github.com/SimonSchubert/omarchy-widgets',
    about: 'Desktop widgets for Omarchy',
    items: [
      { label: 'Pressure widget: free RAM the way the kernel sees it', url: 'https://github.com/SimonSchubert/omarchy-widgets/pull/463', status: 'merged' },
      { label: 'Pressure 1.2: poll every 30 s instead of every 2', url: 'https://github.com/SimonSchubert/omarchy-widgets/pull/471', status: 'merged' },
      { label: 'Capture widget: dictate a thought and save it to ~/inbox.md', url: 'https://github.com/SimonSchubert/omarchy-widgets/pull/474', status: 'merged' },
      { label: 'Capture 1.1: a look that says what it is doing', url: 'https://github.com/SimonSchubert/omarchy-widgets/pull/488', status: 'merged' },
    ],
  },
  {
    group: 'other',
    project: 'OpenRig',
    projectUrl: 'https://github.com/mvschwarz/openrig',
    about: 'Multi-agent orchestration CLI and daemon',
    items: [
      { label: 'Warn on an unrecognized --kind in rig specs commands', url: 'https://github.com/mvschwarz/openrig/pull/2365', status: 'merged' },
      { label: 'Readable error when daemon workspace validation refuses', url: 'https://github.com/mvschwarz/openrig/pull/2367', status: 'merged' },
      { label: 'Refocus traces work in catalogued projects outside the workspace root', url: 'https://github.com/mvschwarz/openrig/pull/2717', status: 'merged' },
    ],
  },
  {
    group: 'other',
    project: 'brag',
    projectUrl: 'https://github.com/latent-spaces/brag',
    about: 'Launch videos for the project you just built',
    items: [
      { label: 'CI that runs the skill-sync and docs checks on every pull request', url: 'https://github.com/latent-spaces/brag/pull/72', status: 'merged' },
    ],
  },
  {
    group: 'other',
    project: 'awesome-omarchy',
    projectUrl: 'https://github.com/aorumbayev/awesome-omarchy',
    about: 'Curated list of Omarchy tools',
    items: [
      { label: 'OmaDeck added to the list', url: 'https://github.com/aorumbayev/awesome-omarchy/pull/93', status: 'merged' },
    ],
  },
  {
    group: 'other',
    project: 'Sellbird',
    projectUrl: 'https://github.com/ethanplusai/sellbird',
    about: 'Sales reply agent',
    items: [
      { label: 'Replies follow the configured offer and booking settings', url: 'https://github.com/ethanplusai/sellbird/pull/203', status: 'co-authored' },
    ],
  },
  {
    group: 'other',
    project: 'omalauncher',
    projectUrl: 'https://github.com/SimonSchubert/omalauncher',
    about: 'Android launcher in the Omarchy style',
    items: [
      { label: 'Galaxy Z Fold inner screen counts as phone-shaped', url: 'https://github.com/SimonSchubert/omalauncher/pull/281', status: 'in review' },
      { label: 'Keep panels open when their list is scrolled past its end', url: 'https://github.com/SimonSchubert/omalauncher/pull/282', status: 'in review' },
    ],
  },
  {
    group: 'other',
    project: 'Paperclip',
    projectUrl: 'https://github.com/paperclipai/paperclip',
    about: 'Agent management platform',
    items: [
      { label: 'Reconcile stranded agents behind pending accounting', url: 'https://github.com/paperclipai/paperclip/pull/18590', status: 'in review' },
    ],
  },
];

export const skills: { group: string; items: string[] }[] = [
  { group: 'Test automation', items: ['Playwright', 'e2e (agentic)', 'Selenium', 'Vitest', 'pytest', 'API testing'] },
  { group: 'Languages', items: ['TypeScript', 'JavaScript', 'Python', 'Java'] },
  { group: 'CI and tooling', items: ['GitHub Actions', 'Docker', 'Node.js', 'Git'] },
];
