/**
 * Mohsin's profile site: about, projects, open-source work, skills, and a
 * library of QA resources. Static: every word comes from files in src/data
 * and the resource components, so it needs no backend.
 */
import { useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Code,
  FileText,
  Github,
  GitMerge,
  GitPullRequest,
  Search,
  Sparkles,
  TestTube,
  Users,
  ArrowLeft,
} from 'lucide-react';
import { contributions, profile, projects, skills } from './data/profile';
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
  { id: 'cheatsheets', label: 'Cheat sheets', icon: BookOpen, blurb: 'Commands and patterns for Selenium, Playwright, Cypress, API, performance, and security testing.' },
  { id: 'templates', label: 'Templates', icon: FileText, blurb: 'Bug reports, triage, test plans, and framework starter code, ready to copy.' },
  { id: 'testcases', label: 'Test cases', icon: TestTube, blurb: 'Manual test cases for well-known apps: steps, preconditions, and expected results.' },
  { id: 'testscripts', label: 'Test scripts', icon: Code, blurb: 'Automation scripts in Selenium, Playwright, Cypress, REST Assured, and Appium.' },
] as const;

type ResourceTab = (typeof RESOURCE_TABS)[number]['id'];

const STATUS = {
  merged: { style: 'bg-violet-500/15 text-violet-300 ring-violet-400/30', icon: GitMerge },
  'in review': { style: 'bg-amber-500/15 text-amber-300 ring-amber-400/30', icon: GitPullRequest },
  'co-authored': { style: 'bg-sky-500/15 text-sky-300 ring-sky-400/30', icon: Users },
};

/** The hero terminal replays this site's own Playwright run (tests/*.spec.ts, desktop and mobile). */
const TEST_RUN = [
  'profile › loads without console errors',
  'profile › lists every project and contribution',
  'profile › every section in the nav is reachable',
  'resources › opens on its own page, tabs link',
  'resources › search narrows the cheat sheets',
  'profile › does not scroll sideways',
];

const allItems = contributions.flatMap((c) => c.items);
const STATS = [
  { value: allItems.filter((i) => i.status !== 'in review').length, label: 'Contributions merged' },
  { value: contributions.length, label: 'Open-source projects' },
  { value: projects.length, label: 'Projects of my own' },
  { value: allItems.filter((i) => i.status === 'in review').length, label: 'PRs in review' },
];

/** Section heading with a small monospace label above it. */
function SectionTitle({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="mb-10">
      <p className="font-mono text-sm text-emerald-400">// {kicker}</p>
      <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h2>
    </div>
  );
}

/** Root component: the whole site is one scrolling page. */
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

/** One field note on its own page. */
function NotePage({ note }: { note: Note }) {
  return (
    <main className="relative">
      <div className="bg-grid pointer-events-none absolute inset-x-0 top-0 h-80" />
      <article className="relative mx-auto max-w-3xl px-4 pb-24 pt-12">
        <a href="#notes" className="inline-flex items-center gap-1.5 font-mono text-xs text-slate-500 hover:text-white">
          <ArrowLeft className="h-3.5 w-3.5" /> all notes
        </a>
        <p className="mt-8 font-mono text-sm text-emerald-400">// {note.date}</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">{note.title}</h1>
        <p className="mt-4 text-lg text-slate-400">{note.summary}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {note.tags.map((t) => <span key={t} className="rounded-full border border-indigo-400/20 bg-indigo-500/10 px-2.5 py-0.5 font-mono text-xs text-indigo-200">{t}</span>)}
        </div>
        <div className="mt-10 space-y-5 text-[17px] leading-8 text-slate-300">
          {note.body.map((block, i) => {
            if (block.type === 'h') return <h2 key={i} className="pt-6 text-2xl font-bold text-white">{block.text}</h2>;
            if (block.type === 'code') return <pre key={i} className="overflow-x-auto rounded-xl border border-white/10 bg-slate-900 p-4 font-mono text-[13px] leading-6 text-slate-200"><code>{block.code}</code></pre>;
            if (block.type === 'list') return (
              <ul key={i} className="space-y-2">
                {block.items.map((item) => <li key={item} className="flex gap-3"><CheckCircle2 className="mt-1.5 h-4 w-4 shrink-0 text-emerald-400" /><span>{item}</span></li>)}
              </ul>
            );
            return <p key={i}>{block.text}</p>;
          })}
        </div>
        <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="font-mono text-xs uppercase tracking-wide text-slate-500">Links</p>
          <ul className="mt-3 space-y-2">
            {note.links.map((l) => (
              <li key={l.url}>
                <a href={l.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-emerald-300 underline-offset-4 hover:underline">
                  {l.label} <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </article>
    </main>
  );
}

/** The resources library: its own page, one tab per resource type. */
function ResourcesPage({ tab }: { tab: ResourceTab }) {
  const [query, setQuery] = useState('');
  const current = RESOURCE_TABS.find((t) => t.id === tab)!;
  return (
    <main className="relative">
      <div className="bg-grid pointer-events-none absolute inset-x-0 top-0 h-80" />
      <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-12">
        <a href="#about" className="inline-flex items-center gap-1.5 font-mono text-xs text-slate-500 hover:text-white">
          <ArrowLeft className="h-3.5 w-3.5" /> back to profile
        </a>
        <p className="mt-8 font-mono text-sm text-emerald-400">// free for anyone</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">QA resources</h1>
        <p className="mt-4 max-w-2xl text-slate-400">
          Cheat sheets, templates, test cases, and scripts I keep for my own work, shared for anyone who finds them useful.
          Spotted a mistake or have one to add?{' '}
          <a href={`${profile.repository}/issues/new`} target="_blank" rel="noopener noreferrer" className="text-emerald-300 underline-offset-4 hover:underline">Open an issue</a> or a pull request.
        </p>

        <div className="sticky top-[57px] z-40 -mx-4 mt-10 border-b border-white/5 bg-slate-950/80 px-4 py-4 backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <nav role="tablist" aria-label="Resource type" className="flex gap-1 overflow-x-auto">
              {RESOURCE_TABS.map(({ id, label, icon: Icon }) => (
                <a
                  key={id}
                  role="tab"
                  href={`#/resources/${id}`}
                  aria-selected={tab === id}
                  className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm transition ${tab === id ? 'bg-white font-medium text-slate-950' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                >
                  <Icon className="h-4 w-4" /> {label}
                </a>
              ))}
            </nav>
            <div className="relative w-full lg:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="search"
                aria-label="Search resources"
                placeholder="Search resources"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-full border border-white/10 bg-white/5 py-2 pl-9 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
              />
            </div>
          </div>
        </div>

        <p className="mb-8 mt-6 text-sm text-slate-500">{current.blurb}</p>
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

export default function App() {
  const route = useRoute();

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950 font-sans text-slate-300 antialiased selection:bg-indigo-500/40 selection:text-white">
      <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <a href="#about" className="flex shrink-0 items-center gap-2 font-semibold text-white">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-indigo-500 to-emerald-400 font-mono text-sm text-slate-950">M</span>
            <span className="hidden sm:inline">{profile.name}</span>
          </a>
          <nav aria-label="Sections" className="flex gap-1 overflow-x-auto text-sm">
            {NAV.map((item) => (
              <a key={item.href} href={item.href} className="whitespace-nowrap rounded-full px-3 py-1.5 text-slate-400 transition hover:bg-white/5 hover:text-white">
                {item.label}
              </a>
            ))}
          </nav>
          <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile" className="hidden shrink-0 rounded-full p-2 text-slate-400 transition hover:bg-white/5 hover:text-white sm:block">
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
        {/* Hero */}
        <section id="about" className="relative scroll-mt-20">
          <div className="bg-grid pointer-events-none absolute inset-0" />
          <div className="glow-float pointer-events-none absolute -top-40 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-indigo-600/25 blur-3xl sm:left-1/4" />
          <div className="glow-float pointer-events-none absolute right-0 top-40 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl [animation-delay:-4s]" />

          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-16 sm:pt-24 lg:grid-cols-[1.1fr_1fr] [&>*]:min-w-0">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 font-mono text-xs text-emerald-300">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:animate-none" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                {profile.role}
              </p>
              <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
                Hi, I'm{' '}
                <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-300 bg-clip-text text-transparent">{profile.name}</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg text-slate-300 sm:text-xl">{profile.tagline}</p>
              <div className="mt-4 max-w-xl space-y-2 text-slate-400">
                {profile.about.map((line) => <p key={line}>{line}</p>)}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={profile.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 font-medium text-slate-950 shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:bg-indigo-100">
                  <Github className="h-4 w-4" /> GitHub
                </a>
                <a href="#resources" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 font-medium text-white transition hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10">
                  <BookOpen className="h-4 w-4" /> Browse QA resources
                </a>
              </div>
            </div>

            {/* Terminal */}
            <div className="relative">
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-indigo-500/50 via-transparent to-emerald-400/40 blur-sm" />
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/90 shadow-2xl shadow-black/50">
                <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
                  <span className="h-3 w-3 rounded-full bg-rose-400/80" />
                  <span className="h-3 w-3 rounded-full bg-amber-400/80" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
                  <span className="ml-3 truncate font-mono text-xs text-slate-500">~/{profile.githubHandle.toLowerCase()} · this site's own test suite</span>
                </div>
                <div className="overflow-x-auto p-5 font-mono text-xs leading-6 sm:text-[13px] sm:leading-7">
                  <p className="term-line text-slate-300" style={{ animationDelay: '0.2s' }}>
                    <span className="text-emerald-400">$</span> npx playwright test
                  </p>
                  {TEST_RUN.map((line, i) => (
                    <p key={line} className="term-line text-slate-400 sm:whitespace-nowrap" style={{ animationDelay: `${0.6 + i * 0.35}s` }}>
                      <span className="text-emerald-400">✓</span> {line}
                    </p>
                  ))}
                  <p className="term-line mt-2 text-emerald-300" style={{ animationDelay: `${0.6 + TEST_RUN.length * 0.35 + 0.2}s` }}>
                    40 passed <span className="text-slate-500">· desktop + mobile</span>
                    <span className="cursor ml-1 inline-block h-4 w-2 translate-y-0.5 bg-emerald-300" />
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="relative mx-auto max-w-6xl px-4 pb-16">
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label} className="flex flex-col-reverse bg-slate-950/90 px-6 py-6 text-center">
                  <dt className="mt-1 text-sm text-slate-400">{s.label}</dt>
                  <dd className="bg-gradient-to-b from-white to-slate-400 bg-clip-text text-4xl font-bold text-transparent">{s.value}</dd>
                </div>
              ))}
            </dl>
            <a href="#projects" aria-label="Scroll to projects" className="mx-auto mt-10 flex w-fit text-slate-500 transition hover:text-white">
              <ArrowDown className="h-5 w-5 animate-bounce motion-reduce:animate-none" />
            </a>
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20">
          <SectionTitle kicker="things I've built" title="Projects" />
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((project, i) => (
              <article key={project.name} className="group relative rounded-2xl bg-gradient-to-br from-white/10 to-white/0 p-px transition duration-300 hover:-translate-y-1 hover:from-indigo-500/60 hover:to-emerald-400/40">
                <div className="flex h-full flex-col rounded-2xl bg-slate-900/95 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <span className="font-mono text-xs text-slate-500">0{i + 1}</span>
                    <ArrowUpRight className="h-5 w-5 text-slate-500 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-emerald-300" />
                  </div>
                  <h3 className="mt-3 text-xl font-semibold text-white">
                    <a href={project.url} target="_blank" rel="noopener noreferrer" className="after:absolute after:inset-0 after:rounded-2xl focus:outline-none">
                      {project.name}
                    </a>
                  </h3>
                  <p className="mt-2 text-slate-400">{project.summary}</p>
                  <ul className="mt-4 space-y-2 text-sm text-slate-300">
                    {project.highlights.map((h) => (
                      <li key={h} className="flex gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex flex-wrap gap-2 pt-6">
                    {project.tech.map((t) => (
                      <span key={t} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-xs text-slate-300">{t}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Open source */}
        <section id="open-source" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20">
          <SectionTitle kicker="pull requests upstream" title="Open source" />
          <ol className="relative space-y-6 border-l border-white/10 pl-6 sm:pl-8">
            {contributions.map((c) => (
              <li key={c.project} className="relative">
                <span className="absolute -left-[31px] top-6 grid h-4 w-4 place-items-center rounded-full border border-emerald-400/50 bg-slate-950 sm:-left-[39px]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/20 hover:bg-white/[0.05]">
                  <h3 className="text-lg font-semibold text-white">
                    <a href={c.projectUrl} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-300">{c.project}</a>
                  </h3>
                  <p className="text-sm text-slate-400">{c.about}</p>
                  <ul className="mt-4 space-y-3">
                    {c.items.map((item) => {
                      const { style, icon: Icon } = STATUS[item.status];
                      return (
                        <li key={item.url} className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-mono text-xs ring-1 ${style}`}>
                            <Icon className="h-3.5 w-3.5" /> {item.status}
                          </span>
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-slate-200 underline-offset-4 hover:text-white hover:underline">
                            {item.label}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </article>
              </li>
            ))}
          </ol>
        </section>

        {/* Notes */}
        <section id="notes" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20">
          <SectionTitle kicker="what I learned doing it" title="Notes" />
          <div className="grid gap-6 md:grid-cols-3">
            {notes.map((n) => (
              <a key={n.slug} href={`#/notes/${n.slug}`} className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-emerald-400/40">
                <span className="font-mono text-xs text-slate-500">{n.date}</span>
                <h3 className="mt-3 text-lg font-semibold leading-snug text-white">{n.title}</h3>
                <p className="mt-2 flex-1 text-sm text-slate-400">{n.summary}</p>
                <span className="mt-5 inline-flex items-center gap-1 font-mono text-xs text-slate-500 group-hover:text-emerald-300">
                  read <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section id="skills" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20">
          <SectionTitle kicker="what I work with" title="Skills" />
          <div className="grid gap-6 md:grid-cols-3">
            {skills.map((s) => (
              <div key={s.group} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <h3 className="flex items-center gap-2 font-semibold text-white">
                  <Sparkles className="h-4 w-4 text-indigo-300" /> {s.group}
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {s.items.map((i) => (
                    <span key={i} className="rounded-lg border border-indigo-400/20 bg-indigo-500/10 px-3 py-1 text-sm text-indigo-200">{i}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Resources teaser */}
        <section id="resources" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20">
          <SectionTitle kicker="free for anyone" title="QA resources" />
          <p className="-mt-6 mb-8 max-w-2xl text-slate-400">
            A library I keep for my own work and share: cheat sheets, templates, manual test cases, and automation scripts.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {RESOURCE_TABS.map(({ id, label, icon: Icon, blurb }) => (
              <a key={id} href={`#/resources/${id}`} className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:-translate-y-1 hover:border-emerald-400/40">
                <Icon className="h-6 w-6 text-emerald-300" />
                <h3 className="mt-4 font-semibold text-white">{label}</h3>
                <p className="mt-1 text-sm text-slate-400">{blurb}</p>
                <span className="mt-4 inline-flex items-center gap-1 font-mono text-xs text-slate-500 group-hover:text-emerald-300">
                  open <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </a>
            ))}
          </div>
        </section>
      </main>
      )}


      <footer className="border-t border-white/5">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} {profile.fullName}</p>
          <p className="font-mono text-xs">built with React · tested with Playwright</p>
          <a href={profile.repository} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-white">
            Source on GitHub <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </footer>
    </div>
  );
}
