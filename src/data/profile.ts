/**
 * Everything the profile pages show. Edit this file to update the site;
 * no component needs to change.
 */

export const profile = {
  name: 'Mohsin',
  fullName: 'Mohsin Mohammed T L',
  role: 'Senior Quality Engineer Analyst & SDET',
  tagline: 'I build reliable test automation, CI pipelines, and the tooling around them.',
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
    highlights: ['23 tests with smoke and regression workflows', 'Ad-network blocking for deterministic runs'],
    tech: ['e2e', 'TypeScript', 'GitHub Actions'],
  },
  {
    name: 'OmaDeck',
    url: 'https://github.com/Mohsintl/omadeck',
    summary: 'Turns a phone into a Stream Deck and voice remote for Omarchy and Hyprland, served as a PWA from a small Python bridge.',
    highlights: [
      'Phone-deck end-to-end tests with a fake desktop, featured as a community example on e2e',
      '400+ unit tests and the e2e suite in CI on every pull request',
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
  project: string;
  projectUrl: string;
  about: string;
  items: { label: string; url: string; status: 'merged' | 'in review' | 'co-authored' }[];
};

export const contributions: Contribution[] = [
  {
    project: 'e2e',
    projectUrl: 'https://github.com/e2e-inc/e2e',
    about: 'Agentic end-to-end testing framework',
    items: [
      { label: 'Fix date patterns in the replay cache', url: 'https://github.com/e2e-inc/e2e/pull/1511', status: 'merged' },
      { label: 'JUnit failure screenshots as GitLab attachments', url: 'https://github.com/e2e-inc/e2e/pull/1526', status: 'merged' },
      { label: 'OmaDeck added as a community example', url: 'https://github.com/e2e-inc/e2e/pull/1707', status: 'merged' },
    ],
  },
  {
    project: 'Selenium',
    projectUrl: 'https://github.com/SeleniumHQ/selenium',
    about: 'Browser automation framework',
    items: [
      { label: 'Fix Select escaping of trailing double quotes (Python)', url: 'https://github.com/SeleniumHQ/selenium/pull/18292', status: 'merged' },
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
