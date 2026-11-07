import { useMemo, useState } from 'react';
import { ChevronDown, ExternalLink } from 'lucide-react';
import { cheatSheets, type CheatSheet } from '../../data/resources/cheatSheets';
import { cheatSheetCategories } from '../../config';
import { card, CodeBlock, CopyButton, Count, Empty, Tag } from './ui';

/** Grid of expandable cheat sheets with a category filter. */
export function CheatSheets({ query }: { query: string }) {
  const [category, setCategory] = useState('all');
  const sheets = useMemo(() => {
    const q = query.toLowerCase();
    return cheatSheets.filter(
      (s) =>
        (category === 'all' || s.category === category) &&
        (!q || s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.tags.some((t) => t.toLowerCase().includes(q))),
    );
  }, [category, query]);

  return (
    <div>
      <h2 className="sr-only">Cheat Sheets</h2>
      <div className="mb-6 flex flex-wrap gap-2">
        {cheatSheetCategories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCategory(c.id)}
            aria-pressed={category === c.id}
            className={`rounded-full px-3.5 py-1.5 text-sm transition ${
              category === c.id ? 'bg-emerald-400 font-medium text-slate-950' : 'border border-white/10 text-slate-400 hover:border-white/25 hover:text-white'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
      <Count n={sheets.length} one="cheat sheet" many="cheat sheets" />
      {sheets.length === 0 ? (
        <Empty what="cheat sheets" />
      ) : (
        <div className="grid items-start gap-5 md:grid-cols-2 lg:grid-cols-3">
          {sheets.map((s) => <SheetCard key={s.id} sheet={s} />)}
        </div>
      )}
    </div>
  );
}

function SheetCard({ sheet }: { sheet: CheatSheet }) {
  const [open, setOpen] = useState(false);
  return (
    <article className={`${card} p-5 ${open ? 'md:col-span-2 lg:col-span-3' : ''}`}>
      <div className="flex items-start gap-4">
        <div className={`rounded-xl p-2.5 ${sheet.color}`} aria-hidden="true">{sheet.icon}</div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-white">{sheet.title}</h3>
          <p className="mt-1 text-sm text-slate-400">{sheet.description}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {sheet.tags.map((t) => <Tag key={t} tone="indigo">{t}</Tag>)}
      </div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-2 text-sm text-slate-300 transition hover:border-emerald-400/40 hover:text-white"
      >
        <ChevronDown className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`} />
        {open ? 'Hide details' : 'View cheat sheet'}
      </button>
      {open && (
        <div className="mt-6 grid gap-6 border-t border-white/10 pt-6 lg:grid-cols-2">
          {sheet.sections.map((section) => (
            <section key={section.title}>
              <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                <span className="h-4 w-1 rounded-full bg-emerald-400" /> {section.title}
              </h4>
              <ul className="space-y-3">
                {section.items.map((item, i) => (
                  <li key={i} className="text-sm text-slate-400">
                    {item.code ? (
                      <div>
                        <div className="flex items-start gap-2">
                          <div className="min-w-0 flex-1"><CodeBlock code={item.code} maxHeight={false} /></div>
                          <CopyButton text={item.code} />
                        </div>
                        {item.description && <p className="mt-1.5 text-xs text-slate-500">{item.description}</p>}
                      </div>
                    ) : (
                      <p className="flex gap-2"><span className="text-emerald-400">›</span>{item.description}</p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))}
          {sheet.resources && sheet.resources.length > 0 && (
            <section className="lg:col-span-2">
              <h4 className="mb-3 text-sm font-semibold text-white">Further reading</h4>
              <div className="flex flex-wrap gap-2">
                {sheet.resources.map((r) => (
                  <a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-300 hover:border-emerald-400/40 hover:text-emerald-300">
                    <ExternalLink className="h-3.5 w-3.5" /> {r.label}
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </article>
  );
}
