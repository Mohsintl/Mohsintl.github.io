import { useState } from 'react';
import { Code, ExternalLink, FileText } from 'lucide-react';
import { boilerplates, templates } from '../../data/resources/templates';
import { card, CodeBlock, CopyButton, Count, Empty, Tag } from './ui';

/** QA document templates and framework boilerplates, in two sub-tabs. */
export function Templates({ query }: { query: string }) {
  const [kind, setKind] = useState<'templates' | 'boilerplates'>('templates');
  const [openCode, setOpenCode] = useState<string | null>(null);
  const q = query.toLowerCase();
  const docs = templates.filter((t) => !q || t.title.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
  const starters = boilerplates.filter((b) => !q || [b.title, b.framework, b.language, b.description].some((f) => f.toLowerCase().includes(q)));

  return (
    <div>
      <h2 className="sr-only">Templates & Boilerplates</h2>
      <div className="mb-6 inline-flex rounded-sm border border-ink/30 p-1">
        {([['templates', 'Templates', FileText, docs.length], ['boilerplates', 'Boilerplates', Code, starters.length]] as const).map(([id, label, Icon, n]) => (
          <button
            key={id}
            type="button"
            onClick={() => setKind(id)}
            aria-pressed={kind === id}
            className={`inline-flex items-center gap-2 rounded-[2px] px-4 py-1.5 text-[15px] font-semibold transition-colors ${kind === id ? 'bg-signal text-paper' : 'text-ink-2 hover:text-ink'}`}
          >
            <Icon className="h-4 w-4" /> {label} <span className="tabular text-sm opacity-70">{n}</span>
          </button>
        ))}
      </div>

      {kind === 'templates' && (
        <>
          <Count n={docs.length} one="template" many="templates" />
          {docs.length === 0 && <Empty what="templates" />}
          <div className="grid items-start gap-5 lg:grid-cols-2">
            {docs.map((t) => (
              <article key={t.id} className={`${card} p-5`}>
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold">{t.title}</h3>
                    <div className="mt-1"><Tag>{t.category}</Tag></div>
                  </div>
                  <CopyButton text={t.template} />
                </div>
                <CodeBlock code={t.template} wrap />
              </article>
            ))}
          </div>
        </>
      )}

      {kind === 'boilerplates' && (
        <>
          <Count n={starters.length} one="boilerplate" many="boilerplates" />
          {starters.length === 0 && <Empty what="boilerplates" />}
          <div className="grid items-start gap-5 lg:grid-cols-2">
            {starters.map((b) => (
              <article key={b.id} className={`${card} p-5`}>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold">{b.title}</h3>
                  <p className="mt-1 text-ink-2">{b.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5"><Tag strong>{b.framework}</Tag><Tag>{b.language}</Tag></div>
                </div>
                {b.repoLink && (
                  <a href={b.repoLink} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium underline">
                    <ExternalLink className="h-4 w-4" /> View repository
                  </a>
                )}
                <div className="mt-4 flex gap-2">
                  <button type="button" onClick={() => setOpenCode(openCode === b.id ? null : b.id)} aria-expanded={openCode === b.id} className="flex-1 rounded-sm border border-ink/30 py-1.5 text-[15px] font-semibold transition-colors hover:border-signal hover:bg-signal hover:text-paper">
                    {openCode === b.id ? 'Hide code' : 'View code'}
                  </button>
                  <CopyButton text={b.code} />
                </div>
                {openCode === b.id && <div className="mt-4"><CodeBlock code={b.code} /></div>}
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
