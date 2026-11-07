import { useState } from 'react';
import { ChevronDown, Play } from 'lucide-react';
import { testScripts } from '../../data/resources/testScripts';
import { card, CodeBlock, CopyButton, Count, Empty, Tag } from './ui';

/** Automation scripts; each expands to its code. */
export function TestScripts({ query }: { query: string }) {
  const [open, setOpen] = useState<string | null>(null);
  const q = query.toLowerCase();
  const scripts = testScripts.filter(
    (s) => !q || [s.app, s.framework, s.title, s.description].some((f) => f.toLowerCase().includes(q)),
  );

  return (
    <div>
      <h2 className="sr-only">Test Scripts</h2>
      <Count n={scripts.length} one="test script" many="test scripts" />
      {scripts.length === 0 && <Empty what="test scripts" />}
      <div className="space-y-4">
        {scripts.map((s) => {
          const isOpen = open === s.id;
          return (
            <article key={s.id} className={card}>
              <button type="button" onClick={() => setOpen(isOpen ? null : s.id)} aria-expanded={isOpen} className="flex w-full items-start gap-4 px-5 py-4 text-left">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-500/15 text-emerald-300"><Play className="h-5 w-5" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-white">{s.title}</span>
                  <span className="mt-0.5 block text-sm text-slate-400">{s.description}</span>
                  <span className="mt-2 flex flex-wrap gap-1.5"><Tag tone="sky">{s.app}</Tag><Tag tone="indigo">{s.framework}</Tag></span>
                </span>
                <ChevronDown className={`mt-1 h-5 w-5 shrink-0 text-slate-500 transition ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div className="border-t border-white/10 px-5 py-4">
                  <div className="mb-3 flex justify-end"><CopyButton text={s.code} label="Copy script" /></div>
                  <CodeBlock code={s.code} />
                </div>
              )}
            </article>
          );
        })}
      </div>
      <p className="mt-8 rounded-2xl border border-emerald-400/20 bg-emerald-500/5 p-5 text-sm text-emerald-200/80">
        Update URLs, credentials, and locators to match your environment before running these scripts.
      </p>
    </div>
  );
}
