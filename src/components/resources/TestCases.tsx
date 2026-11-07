import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { testCases } from '../../data/resources/testCases';
import { card, Count, Empty, Tag } from './ui';

const PRIORITY: Record<string, string> = {
  Critical: 'text-fail',
  High: 'text-review',
};

/** Manual test cases grouped by app; each app and case expands. */
export function TestCases({ query }: { query: string }) {
  const [openApp, setOpenApp] = useState<string | null>(null);
  const [openCase, setOpenCase] = useState<string | null>(null);
  const q = query.toLowerCase();
  const apps = testCases.filter(
    (a) => !q || a.app.toLowerCase().includes(q) || a.category.toLowerCase().includes(q) || a.cases.some((c) => c.title.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)),
  );

  return (
    <div>
      <h2 className="sr-only">Test Cases</h2>
      <Count n={apps.length} one="application with test cases" many="applications with test cases" />
      {apps.length === 0 && <Empty what="test cases" />}
      <div className="space-y-4">
        {apps.map((app) => {
          const isOpen = openApp === app.id;
          return (
            <article key={app.id} className={card}>
              <button type="button" onClick={() => setOpenApp(isOpen ? null : app.id)} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
                <div>
                  <h3 className="text-lg font-bold">{app.app}</h3>
                  <div className="mt-1.5 flex items-center gap-2">
                    <Tag>{app.category}</Tag>
                    <span className="tabular text-sm text-ink-3">{app.cases.length} cases</span>
                  </div>
                </div>
                <ChevronDown className={`h-5 w-5 shrink-0 text-ink-3 transition ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div className="space-y-2 border-t border-rule px-5 py-4">
                  {app.cases.map((tc) => {
                    const caseOpen = openCase === tc.id + app.id;
                    return (
                      <div key={tc.id} className="rounded-sm border border-rule bg-paper">
                        <button type="button" onClick={() => setOpenCase(caseOpen ? null : tc.id + app.id)} aria-expanded={caseOpen} className="flex w-full flex-wrap items-center gap-2 px-4 py-3 text-left">
                          <span className="tabular font-mono text-xs text-ink-3">{tc.id}</span>
                          <span className="flex-1 text-[15px] font-medium">{tc.title}</span>
                          <span className={`text-sm font-semibold ${PRIORITY[tc.priority] ?? 'text-ink-2'}`}>{tc.priority}</span>
                          <ChevronDown className={`h-4 w-4 text-ink-3 transition ${caseOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {caseOpen && (
                          <dl className="grid gap-5 border-t border-rule px-4 py-4 text-[15px] sm:grid-cols-3">
                            <div>
                              <dt className="mb-1 text-sm font-bold">Preconditions</dt>
                              <dd className="text-ink-2">{tc.preconditions}</dd>
                            </div>
                            <div>
                              <dt className="mb-1 text-sm font-bold">Steps</dt>
                              <dd>
                                <ol className="list-inside list-decimal space-y-1 text-ink-2">
                                  {tc.steps.map((s) => <li key={s}>{s}</li>)}
                                </ol>
                              </dd>
                            </div>
                            <div>
                              <dt className="mb-1 text-sm font-bold">Expected</dt>
                              <dd className="text-ink-2">{tc.expected}</dd>
                            </div>
                          </dl>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
