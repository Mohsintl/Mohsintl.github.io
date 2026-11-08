/**
 * Everything the profile pages show. Edit this file to update the site;
 * no component needs to change.
 */

export const profile = {
  name: 'Mohsin',
  fullName: 'Tingri Lohar Mohammed Mohsin',
  role: 'Senior Quality Engineer & SDET',
  tagline: 'I build reliable test automation, CI pipelines, and the tooling around them.',
  about: [
    'Computer Science graduate working as a Senior Quality Engineer and SDET.',
    'I write end-to-end suites in Playwright and agentic frameworks, wire them into CI as quality gates, and contribute fixes back to the open-source testing tools I use.',
  ],
  github: 'https://github.com/Mohsintl',
  githubHandle: 'Mohsintl',
  /** Where readers suggest a resource or fix: the site's own repository. */
  repository: 'https://github.com/Mohsintl/portfolio',
};

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
    highlights: ['23 tests with smoke and regression workflows', 'Ad-network blocking for deterministic runs'],
    tech: ['e2e', 'TypeScript', 'GitHub Actions'],
  },
  {
    name: 'Omadeck',
    url: 'https://github.com/Mohsintl/omadeck',
    summary: 'A phone-as-remote PWA and AI voice companion for Hyprland Linux.',
    highlights: ['400+ tests in CI on Python 3.11 to 3.13', 'Token and PIN authentication with rate limiting'],
    tech: ['Python', 'PWA', 'WebSockets', 'pytest'],
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
  project: string;
  projectUrl: string;
  about: string;
  items: { label: string; url: string; status: 'merged' | 'in review' | 'co-authored' }[];
};

export const contributions: Contribution[] = [
  {
    project: 'e2e',
    projectUrl: 'https://github.com/tester-army/e2e',
    about: 'Agentic end-to-end testing framework',
    items: [
      { label: 'Fix date patterns in the replay cache', url: 'https://github.com/tester-army/e2e/pull/1511', status: 'merged' },
      { label: 'JUnit failure screenshots as GitLab attachments', url: 'https://github.com/tester-army/e2e/pull/1526', status: 'in review' },
    ],
  },
  {
    project: 'test-reporter',
    projectUrl: 'https://github.com/dorny/test-reporter',
    about: 'Test results in GitHub Actions',
    items: [
      { label: 'Document when checks: write is needed', url: 'https://github.com/dorny/test-reporter/pull/865', status: 'in review' },
    ],
  },
  {
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
    project: 'Sellbird',
    projectUrl: 'https://github.com/ethanplusai/sellbird',
    about: 'Sales reply agent',
    items: [
      { label: 'Replies follow the configured offer and booking settings', url: 'https://github.com/ethanplusai/sellbird/pull/203', status: 'co-authored' },
    ],
  },
  {
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
  { group: 'Languages', items: ['TypeScript', 'JavaScript', 'Python'] },
  { group: 'CI and tooling', items: ['GitHub Actions', 'Docker', 'Node.js', 'Git'] },
];
