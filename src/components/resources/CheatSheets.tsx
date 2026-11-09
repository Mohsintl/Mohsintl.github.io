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
            className={`rounded-sm border px-3 py-1.5 text-[15px] font-medium transition-colors ${
              category === c.id ? 'border-signal bg-signal text-paper' : 'border-ink/25 text-ink-2 hover:border-ink hover:text-ink'
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
      <h3 className="text-lg font-bold">{sheet.title}</h3>
      <p className="mt-1 text-ink-2">{sheet.description}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {sheet.tags.map((t) => <Tag key={t}>{t}</Tag>)}
      </div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-sm border border-ink/30 py-2 text-[15px] font-semibold transition-colors hover:border-signal hover:bg-signal hover:text-paper"
      >
        <ChevronDown className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`} />
        {open ? 'Hide details' : 'View cheat sheet'}
      </button>
      {open && (
        <div className="mt-6 grid gap-8 border-t border-rule pt-6 lg:grid-cols-2 [&>*]:min-w-0">
          {sheet.sections.map((section) => (
            <section key={section.title}>
              <h4 className="mb-3 border-b-2 border-signal-deep pb-1 font-bold">{section.title}</h4>
              <ul className="space-y-3">
                {section.items.map((item, i) => (
                  <li key={i} className="text-[15px] text-ink-2">
                    {item.code ? (
                      <div>
                        <div className="flex items-start gap-2">
                          <div className="min-w-0 flex-1"><CodeBlock code={item.code} maxHeight={false} /></div>
                          <CopyButton text={item.code} />
                        </div>
                        {item.description && <p className="mt-1.5 text-sm text-ink-3">{item.description}</p>}
                      </div>
                    ) : (
                      <p className="flex gap-3"><span aria-hidden="true" className="mt-[0.6em] h-1.5 w-3 shrink-0 bg-signal-deep" />{item.description}</p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))}
          {sheet.resources && sheet.resources.length > 0 && (
            <section className="lg:col-span-2">
              <h4 className="mb-3 font-bold">Further reading</h4>
              <div className="flex flex-wrap gap-2">
                {sheet.resources.map((r) => (
                  <a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-sm border border-ink/25 px-3 py-1.5 text-sm font-medium hover:border-signal hover:bg-signal hover:text-paper">
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
