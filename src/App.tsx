/**
 * Mohsin's profile site: about, projects, open-source work, notes, skills, and
 * a library of QA resources. Static: every word comes from files in src/data
 * and the resource components, so it needs no backend.
 */
import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Github, Search } from 'lucide-react';
import { contributions, profile, projects, skills, type Contribution } from './data/profile';
import { notes, type Note } from './data/notes';
import { CheatSheets } from './components/resources/CheatSheets';
import { Templates } from './components/resources/Templates';
import { TestCases } from './components/resources/TestCases';
import { TestScripts } from './components/resources/TestScripts';

const NAV = [
  { href: '#about', label: 'About' },
  { href: '#projects', label: 'Projects' },
  { href: '#open-source', label: 'Open source' },
  { href: '#notes', label: 'Notes' },
  { href: '#skills', label: 'Skills' },
  { href: '#/resources', label: 'QA resources' },
];

const RESOURCE_TABS = [
  { id: 'cheatsheets', label: 'Cheat sheets', blurb: 'Commands and patterns for Selenium, Playwright, Cypress, API, performance, and security testing.' },
  { id: 'templates', label: 'Templates', blurb: 'Bug reports, triage, test plans, and framework starter code, ready to copy.' },
  { id: 'testcases', label: 'Test cases', blurb: 'Manual test cases for well-known apps: steps, preconditions, and expected results.' },
  { id: 'testscripts', label: 'Test scripts', blurb: 'Automation scripts in Selenium, Playwright, Cypress, REST Assured, and Appium.' },
] as const;

type ResourceTab = (typeof RESOURCE_TABS)[number]['id'];

const STATUS: Record<Contribution['items'][number]['status'], string> = {
  merged: 'text-pass',
  'in review': 'text-review',
  'co-authored': 'text-co',
};

/** The hero sheet replays this site's own Playwright run (tests/*.spec.ts, desktop and mobile). */
const TEST_RUN = [
  'profile › loads without console errors',
  'profile › lists every project and contribution',
  'profile › every section in the nav is reachable',
  'resources › opens on its own page, tabs link',
  'resources › search narrows the cheat sheets',
  'profile › does not scroll sideways',
];
const TEST_TOTAL = '40 passed';

const allItems = contributions.flatMap((c) => c.items);
const landed = allItems.filter((i) => i.status !== 'in review').length;
const inReview = allItems.length - landed;

/** The crash-test target: the quadrant marker painted on test vehicles and dummies. */
function Mark({ className = 'h-7 w-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <circle cx="16" cy="16" r="15" className="fill-signal" />
      <path d="M16 1a15 15 0 0 1 15 15H16z M16 31A15 15 0 0 1 1 16h15z" className="fill-ink" />
      <circle cx="16" cy="16" r="15" fill="none" className="stroke-ink" strokeWidth="2" />
    </svg>
  );
}

/** Section heading: the heading carries itself, with an optional line of context beside it. */
function SectionTitle({ title, aside }: { title: string; aside?: string }) {
  return (
    <div className="mb-10 flex flex-col gap-3 border-b-2 border-ink pb-4 sm:flex-row sm:items-end sm:justify-between">
      <h2 className="display text-4xl uppercase sm:text-5xl">{title}</h2>
      {aside && <p className="max-w-sm text-ink-2 sm:text-right">{aside}</p>}
    </div>
  );
}

/** PR number from a pull request URL, for the open-source log. */
const prNumber = (url: string) => url.match(/\/pull\/(\d+)/)?.[1];

type Route = { page: 'home' } | { page: 'resources'; tab: ResourceTab } | { page: 'note'; note: Note };

/** Reads the route from the URL hash: `#/resources[/tab]` is the resources page, anything else is home. */
function readRoute(): Route {
  const noteMatch = window.location.hash.match(/^#\/notes\/([a-z0-9-]+)/);
  const note = noteMatch && notes.find((n) => n.slug === noteMatch[1]);
  if (note) return { page: 'note', note };
  const m = window.location.hash.match(/^#\/resources(?:\/([a-z]+))?/);
  if (!m) return { page: 'home' };
  const tab = RESOURCE_TABS.find((t) => t.id === m[1])?.id ?? 'cheatsheets';
  return { page: 'resources', tab };
}

/** Follows hash changes; on home, scrolls to the section the hash names. */
function useRoute(): Route {
  const [route, setRoute] = useState(readRoute);
  useEffect(() => {
    const onHash = () => setRoute(readRoute());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  useEffect(() => {
    if (route.page !== 'home') {
      window.scrollTo({ top: 0 });
      return;
    }
    const id = window.location.hash.slice(1);
    if (id) document.getElementById(id)?.scrollIntoView();
  }, [route.page, route.page === 'note' ? route.note.slug : '']);
  return route;
}

const backLink = 'inline-flex items-center gap-1.5 text-sm font-medium text-ink-2 underline decoration-rule hover:text-ink hover:decoration-ink';

/** One field note on its own page. */
function NotePage({ note }: { note: Note }) {
  return (
    <main>
      <article className="mx-auto max-w-3xl px-4 pb-24 pt-10">
        <a href="#notes" className={backLink}>
          <ArrowLeft className="h-4 w-4" /> all notes
        </a>
        <header className="mt-10 border-b-2 border-ink pb-8">
          <p className="tabular text-sm text-ink-3">
            <time dateTime={note.date}>{note.date}</time> · {note.tags.join(' · ')}
          </p>
          <h1 className="display mt-4 text-4xl sm:text-6xl">{note.title}</h1>
          <p className="mt-6 text-xl leading-relaxed text-ink-2">{note.summary}</p>
        </header>
        <div className="mt-10 max-w-[68ch] space-y-6 text-[18px] leading-[1.7]">
          {note.body.map((block, i) => {
            if (block.type === 'h') return <h2 key={i} className="display pt-8 text-2xl">{block.text}</h2>;
            if (block.type === 'code') return <pre key={i} className="overflow-x-auto rounded-sm bg-ink p-5 font-mono text-[13px] leading-6 text-paper"><code>{block.code}</code></pre>;
            if (block.type === 'list') return (
              <ul key={i} className="space-y-3">
                {block.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden="true" className="mt-[0.7em] h-1.5 w-3 shrink-0 bg-signal-deep" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );
            return <p key={i}>{block.text}</p>;
          })}
        </div>
        <footer className="mt-14 border-t-2 border-ink pt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-2">Links</h2>
          <ul className="mt-3 space-y-2">
            {note.links.map((l) => (
              <li key={l.url}>
                <a href={l.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-medium underline decoration-signal-deep decoration-2 hover:decoration-ink">
                  {l.label} <ArrowUpRight className="h-4 w-4" />
                </a>
              </li>
            ))}
          </ul>
        </footer>
      </article>
    </main>
  );
}

/** The resources library: its own page, one tab per resource type. */
function ResourcesPage({ tab }: { tab: ResourceTab }) {
  const [query, setQuery] = useState('');
  const current = RESOURCE_TABS.find((t) => t.id === tab)!;
  return (
    <main>
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-10">
        <a href="#about" className={backLink}>
          <ArrowLeft className="h-4 w-4" /> back to profile
        </a>
        <h1 className="display mt-10 text-5xl uppercase sm:text-7xl">QA resources</h1>
        <p className="mt-5 max-w-2xl text-lg text-ink-2">
          Cheat sheets, templates, test cases, and scripts I keep for my own work, shared for anyone who finds them useful.
          Spotted a mistake or have one to add?{' '}
          <a href={`${profile.repository}/issues/new`} target="_blank" rel="noopener noreferrer" className="font-medium text-ink underline decoration-signal-deep decoration-2 hover:decoration-ink">Open an issue</a> or a pull request.
        </p>

        <div className="sticky top-[61px] z-40 -mx-4 mt-10 border-b-2 border-ink bg-paper px-4 pt-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <nav role="tablist" aria-label="Resource type" className="-mb-0.5 flex overflow-x-auto">
              {RESOURCE_TABS.map(({ id, label }) => (
                <a
                  key={id}
                  role="tab"
                  href={`#/resources/${id}`}
                  aria-selected={tab === id}
                  className={`whitespace-nowrap border-b-4 px-3 py-3 text-[15px] font-semibold transition-colors first:pl-0 sm:px-4 ${tab === id ? 'border-signal-deep text-ink' : 'border-transparent text-ink-3 hover:text-ink'}`}
                >
                  {label}
                </a>
              ))}
            </nav>
            <div className="relative mb-3 w-full lg:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" />
              <input
                type="search"
                aria-label="Search resources"
                placeholder="Search resources"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-sm border border-ink/40 bg-sheet py-2 pl-9 pr-3 text-[15px] text-ink placeholder:text-ink-3 focus:border-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ink"
              />
            </div>
          </div>
        </div>

        <p className="mb-8 mt-6 text-ink-2">{current.blurb}</p>
        <div role="tabpanel" aria-label={current.label}>
          {tab === 'cheatsheets' && <CheatSheets query={query} />}
          {tab === 'templates' && <Templates query={query} />}
          {tab === 'testcases' && <TestCases query={query} />}
          {tab === 'testscripts' && <TestScripts query={query} />}
        </div>
      </div>
    </main>
  );
}

/** The hero's test sheet: the run is listed from the start, and each box is ticked in turn. */
function TestSheet() {
  const step = 0.32;
  const start = 0.4;
  return (
    <figure className="relative rounded-sm bg-sheet text-ink shadow-[0_18px_40px_-18px_rgb(22_21_15/0.45)]">
      <figcaption className="flex items-center justify-between gap-3 border-b border-rule px-5 py-3 text-sm">
        <span className="font-semibold">This site's own test run</span>
        <span className="text-ink-3">desktop + mobile</span>
      </figcaption>
      <div className="px-5 py-4">
        <p className="font-mono text-[13px] text-ink-2">$ npx playwright test</p>
        <ol className="mt-3 space-y-2.5">
          {TEST_RUN.map((line, i) => {
            const delay = `${start + i * step}s`;
            return (
              <li key={line} className="flex items-start gap-3 text-[15px] leading-snug">
                <span className="relative mt-0.5 grid h-[18px] w-[18px] shrink-0 place-items-center rounded-[2px] border-2 border-ink">
                  <span className="check-box absolute inset-0" style={{ animationDelay: delay }} />
                  <svg viewBox="0 0 16 16" className="relative h-3 w-3" aria-hidden="true">
                    <path d="M3 8.5l3.2 3L13 4.5" fill="none" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="check-mark stroke-signal" style={{ animationDelay: delay }} />
                  </svg>
                </span>
                <span className="min-w-0">{line}</span>
              </li>
            );
          })}
        </ol>
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-rule px-5 py-3">
        <span className="verdict display tabular text-2xl uppercase text-pass" style={{ animationDelay: `${start + TEST_RUN.length * step}s` }}>{TEST_TOTAL}</span>
        <Mark className="h-8 w-8" />
      </div>
    </figure>
  );
}

export default function App() {
  const route = useRoute();

  return (
    <div className="min-h-screen overflow-x-hidden bg-paper font-sans text-ink antialiased">
      <header className="sticky top-0 z-50 border-b border-ink/15 bg-paper">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <a href="#about" className="flex shrink-0 items-center gap-2.5 font-bold">
            <Mark />
            <span className="display hidden text-lg uppercase sm:inline">{profile.name}</span>
          </a>
          <nav aria-label="Sections" className="flex gap-0.5 overflow-x-auto text-[15px]">
            {NAV.map((item) => (
              <a key={item.href} href={item.href} className="whitespace-nowrap rounded-sm px-2.5 py-1.5 font-medium text-ink-2 transition-colors hover:bg-signal hover:text-ink">
                {item.label}
              </a>
            ))}
          </nav>
          <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile" className="hidden shrink-0 rounded-sm p-2 text-ink-2 transition-colors hover:bg-signal hover:text-ink sm:block">
            <Github className="h-5 w-5" />
          </a>
        </div>
      </header>

      {route.page === 'resources' ? (
        <ResourcesPage tab={route.tab} />
      ) : route.page === 'note' ? (
        <NotePage note={route.note} />
      ) : (
      <main>
        {/* Hero: the yellow field */}
        <section id="about" className="scroll-mt-16 bg-signal">
          <div className="mx-auto grid max-w-6xl items-end gap-12 px-4 pb-16 pt-14 sm:pt-20 lg:grid-cols-[1.25fr_1fr] lg:pb-20 [&>*]:min-w-0">
            <div>
              <p className="text-lg font-semibold">{profile.role}</p>
              <h1 className="display mt-4 text-6xl uppercase sm:text-8xl">Hi, I'm {profile.name}</h1>
              <p className="mt-8 max-w-xl text-xl font-medium leading-snug sm:text-2xl">{profile.tagline}</p>
              <div className="mt-5 max-w-xl space-y-2 text-[17px] leading-relaxed text-ink/80">
                {profile.about.map((line) => <p key={line}>{line}</p>)}
              </div>
              <div className="mt-9 flex flex-wrap gap-3">
                <a href={profile.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-sm bg-ink px-5 py-3 font-semibold text-signal transition-colors hover:bg-ink/85">
                  <Github className="h-4 w-4" /> GitHub
                </a>
                <a href="#resources" className="inline-flex items-center gap-2 rounded-sm border-2 border-ink px-5 py-2.5 font-semibold transition-colors hover:bg-ink hover:text-signal">
                  Browse QA resources <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
            <TestSheet />
          </div>
        </section>

        {/* Projects: a ledger, one row per project */}
        <section id="projects" className="mx-auto max-w-6xl scroll-mt-16 px-4 pt-24">
          <SectionTitle title="Projects" aside="Test suites and tools I built and maintain." />
          <ol className="divide-y divide-rule">
            {projects.map((project) => (
              <li key={project.name} className="group grid gap-4 py-8 first:pt-2 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-10">
                <div className="min-w-0">
                  <h3 className="text-2xl font-bold leading-tight [overflow-wrap:anywhere]">
                    <a href={project.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-baseline gap-1.5 decoration-signal-deep decoration-[3px] hover:underline">
                      {project.name} <ArrowUpRight className="h-5 w-5 shrink-0 self-center text-ink-3 transition-colors group-hover:text-ink" />
                    </a>
                  </h3>
                  <p className="mt-2 text-[17px] text-ink-2">{project.summary}</p>
                  <p className="mt-4 text-sm font-medium text-ink-3">{project.tech.join(' · ')}</p>
                </div>
                <ul className="space-y-2 text-[16px] md:pt-1">
                  {project.highlights.map((h) => (
                    <li key={h} className="flex gap-3">
                      <span aria-hidden="true" className="mt-[0.6em] h-1.5 w-3 shrink-0 bg-signal-deep" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </section>

        {/* Open source: a pull request log */}
        <section id="open-source" className="mx-auto max-w-6xl scroll-mt-16 px-4 pt-24">
          <SectionTitle
            title="Open source"
            aside={`${landed} pull requests merged or co-authored across ${contributions.length} projects, ${inReview} more in review.`}
          />
          <div className="divide-y divide-rule">
            {contributions.map((c) => (
              <div key={c.project} className="grid gap-3 py-6 first:pt-2 md:grid-cols-[minmax(0,3fr)_minmax(0,8fr)] md:gap-10">
                <div>
                  <h3 className="text-xl font-bold">
                    <a href={c.projectUrl} target="_blank" rel="noopener noreferrer" className="decoration-signal-deep decoration-[3px] hover:underline">{c.project}</a>
                  </h3>
                  <p className="text-ink-2">{c.about}</p>
                </div>
                <ul className="space-y-3">
                  {c.items.map((item) => (
                    <li key={item.url} className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-4 gap-y-0.5 sm:grid-cols-[4.5rem_minmax(0,1fr)_7rem]">
                      <span className="tabular font-mono text-sm text-ink-3">#{prNumber(item.url)}</span>
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="font-medium underline decoration-rule underline-offset-4 hover:decoration-ink">
                        {item.label}
                      </a>
                      <span className={`col-start-2 text-sm font-semibold sm:col-start-3 sm:text-right ${STATUS[item.status]}`}>{item.status}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Notes: a reading list */}
        <section id="notes" className="mx-auto max-w-6xl scroll-mt-16 px-4 pt-24">
          <SectionTitle title="Notes" aside="Short write-ups of what I learned doing the work." />
          <ul className="divide-y divide-rule">
            {notes.map((n) => (
              <li key={n.slug}>
                <a href={`#/notes/${n.slug}`} className="group grid gap-2 py-6 first:pt-2 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)_auto] md:items-baseline md:gap-10">
                  <h3 className="text-xl font-bold leading-snug decoration-signal-deep decoration-[3px] group-hover:underline">{n.title}</h3>
                  <p className="text-ink-2">{n.summary}</p>
                  <ArrowRight className="hidden h-5 w-5 text-ink-3 transition-transform group-hover:translate-x-1 group-hover:text-ink md:block" />
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* Skills: a spec sheet */}
        <section id="skills" className="mx-auto max-w-6xl scroll-mt-16 px-4 py-24">
          <SectionTitle title="Skills" />
          <dl className="divide-y divide-rule">
            {skills.map((s) => (
              <div key={s.group} className="grid gap-1 py-4 first:pt-0 sm:grid-cols-[14rem_minmax(0,1fr)] sm:gap-10">
                <dt className="font-semibold text-ink-2">{s.group}</dt>
                <dd className="text-lg">{s.items.join(', ')}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Resources: the ink band */}
        <section id="resources" className="scroll-mt-16 bg-ink text-paper">
          <div className="mx-auto max-w-6xl px-4 py-20">
            <div className="mb-10 flex flex-col gap-3 border-b-2 border-signal pb-4 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="display text-4xl uppercase sm:text-5xl">QA resources</h2>
              <p className="max-w-sm text-paper/75 sm:text-right">A library I keep for my own work and share, free for anyone.</p>
            </div>
            <ul className="grid gap-px bg-paper/15 sm:grid-cols-2 lg:grid-cols-4">
              {RESOURCE_TABS.map(({ id, label, blurb }) => (
                <li key={id} className="bg-ink">
                  <a href={`#/resources/${id}`} className="group flex h-full flex-col p-5 transition-colors hover:bg-signal hover:text-ink sm:p-6">
                    <h3 className="flex items-center justify-between gap-2 text-xl font-bold">
                      {label} <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </h3>
                    <p className="mt-2 text-paper/70 group-hover:text-ink/80">{blurb}</p>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      )}

      <footer className="border-t border-ink/15">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-ink-2 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {profile.fullName}</p>
          <p>Built with React, tested with Playwright on every pull request.</p>
          <a href={profile.repository} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium underline decoration-rule hover:text-ink hover:decoration-ink">
            Source on GitHub <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </footer>
    </div>
  );
}
