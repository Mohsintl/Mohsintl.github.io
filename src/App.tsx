/**
 * Mohsin's profile site: about, projects, open-source work, skills, and a
 * library of QA resources. Static: every word comes from files in src/data
 * and the resource components, so it needs no backend.
 */
import { useState } from 'react';
import { BookOpen, Code, ExternalLink, FileText, Github, GitPullRequest, Search, TestTube } from 'lucide-react';
import { contributions, profile, projects, skills } from './data/profile';
import { CheatSheetGrid } from './components/CheatSheetGrid';
import { TemplatesAndBoilerplates } from './components/TemplatesAndBoilerplates';
import { TestCases } from './components/TestCases';
import { TestScripts } from './components/TestScripts';

const NAV = [
  { href: '#about', label: 'About' },
  { href: '#projects', label: 'Projects' },
  { href: '#open-source', label: 'Open source' },
  { href: '#skills', label: 'Skills' },
  { href: '#resources', label: 'QA resources' },
];

const RESOURCE_TABS = [
  { id: 'cheatsheets', label: 'Cheat sheets', icon: BookOpen },
  { id: 'templates', label: 'Templates', icon: FileText },
  { id: 'testcases', label: 'Test cases', icon: TestTube },
  { id: 'testscripts', label: 'Test scripts', icon: Code },
] as const;

type ResourceTab = (typeof RESOURCE_TABS)[number]['id'];

const STATUS_STYLE = {
  merged: 'bg-violet-100 text-violet-800',
  'in review': 'bg-amber-100 text-amber-800',
  'co-authored': 'bg-sky-100 text-sky-800',
};

/** Root component: the whole site is one scrolling page. */
export default function App() {
  const [tab, setTab] = useState<ResourceTab>('cheatsheets');
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <a href="#about" className="font-semibold text-slate-900">{profile.name}</a>
          <nav aria-label="Sections" className="flex gap-1 overflow-x-auto text-sm">
            {NAV.map((item) => (
              <a key={item.href} href={item.href} className="whitespace-nowrap rounded-md px-3 py-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900">
                {item.label}
              </a>
            ))}
          </nav>
          <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile" className="hidden shrink-0 text-slate-600 hover:text-slate-900 sm:block">
            <Github className="h-5 w-5" />
          </a>
        </div>
      </header>

      <main>
        <section id="about" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-12 pt-16">
          <p className="text-sm font-medium uppercase tracking-wide text-indigo-600">{profile.role}</p>
          <h1 className="mt-2 text-4xl font-bold text-slate-900 sm:text-5xl">Hi, I'm {profile.name}</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-600">{profile.tagline}</p>
          <div className="mt-6 max-w-2xl space-y-3 text-slate-600">
            {profile.about.map((line) => <p key={line}>{line}</p>)}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-700">
              <Github className="h-4 w-4" /> GitHub
            </a>
            <a href="#resources" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 hover:bg-slate-100">
              <BookOpen className="h-4 w-4" /> Browse QA resources
            </a>
          </div>
        </section>

        <section id="projects" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-12">
          <h2 className="text-2xl font-bold text-slate-900">Projects</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {projects.map((project) => (
              <article key={project.name} className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">
                  <a href={project.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-indigo-600">
                    {project.name} <ExternalLink className="h-4 w-4" />
                  </a>
                </h3>
                <p className="mt-2 text-slate-600">{project.summary}</p>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
                  {project.highlights.map((h) => <li key={h}>{h}</li>)}
                </ul>
                <div className="mt-auto flex flex-wrap gap-2 pt-4">
                  {project.tech.map((t) => <span key={t} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-700">{t}</span>)}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="open-source" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-12">
          <h2 className="text-2xl font-bold text-slate-900">Open source</h2>
          <div className="mt-6 space-y-4">
            {contributions.map((c) => (
              <article key={c.project} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="font-semibold text-slate-900">
                  <a href={c.projectUrl} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600">{c.project}</a>
                  <span className="ml-2 font-normal text-slate-500">· {c.about}</span>
                </h3>
                <ul className="mt-3 space-y-2">
                  {c.items.map((item) => (
                    <li key={item.url} className="flex flex-wrap items-center gap-2 text-sm">
                      <GitPullRequest className="h-4 w-4 text-slate-400" />
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-slate-700 hover:text-indigo-600">{item.label}</a>
                      <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_STYLE[item.status]}`}>{item.status}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="skills" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-12">
          <h2 className="text-2xl font-bold text-slate-900">Skills</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {skills.map((s) => (
              <div key={s.group} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="font-semibold text-slate-900">{s.group}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {s.items.map((i) => <span key={i} className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-sm text-indigo-800">{i}</span>)}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="resources" className="scroll-mt-16 border-t border-slate-200 bg-white pt-12">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-2xl font-bold text-slate-900">QA resources</h2>
            <p className="mt-2 max-w-2xl text-slate-600">
              Cheat sheets, templates, test cases, and scripts I keep for my own work, shared for anyone who finds them useful.
              Spotted a mistake or have one to add? <a href={`${profile.repository}/issues/new`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Open an issue</a> or a pull request.
            </p>
            <div className="relative mt-6 max-w-xl">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                aria-label="Search resources"
                placeholder="Search resources"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div role="tablist" aria-label="Resource type" className="mt-6 flex gap-2 overflow-x-auto">
              {RESOURCE_TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  role="tab"
                  aria-selected={tab === id}
                  onClick={() => setTab(id)}
                  className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm ${tab === id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                >
                  <Icon className="h-4 w-4" /> {label}
                </button>
              ))}
            </div>
          </div>
          <div role="tabpanel" className="-mt-6">
            {tab === 'cheatsheets' && <CheatSheetGrid selectedCategory={category} setSelectedCategory={setCategory} searchQuery={query} />}
            {tab === 'templates' && <TemplatesAndBoilerplates searchQuery={query} />}
            {tab === 'testcases' && <TestCases searchQuery={query} />}
            {tab === 'testscripts' && <TestScripts searchQuery={query} />}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} {profile.fullName}</p>
          <a href={profile.repository} target="_blank" rel="noopener noreferrer" className="hover:text-slate-900">Source on GitHub</a>
        </div>
      </footer>
    </div>
  );
}
