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
      <div className="mb-6 inline-flex rounded-full border border-white/10 p-1">
        {([['templates', 'Templates', FileText, docs.length], ['boilerplates', 'Boilerplates', Code, starters.length]] as const).map(([id, label, Icon, n]) => (
          <button
            key={id}
            type="button"
            onClick={() => setKind(id)}
            aria-pressed={kind === id}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm transition ${kind === id ? 'bg-white text-slate-950' : 'text-slate-400 hover:text-white'}`}
          >
            <Icon className="h-4 w-4" /> {label} <span className="font-mono text-xs opacity-60">{n}</span>
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
                  <div className="flex items-center gap-3">
                    <div className={`rounded-xl p-2 ${t.color}`} aria-hidden="true">{t.icon}</div>
                    <div>
                      <h3 className="font-semibold text-white">{t.title}</h3>
                      <div className="mt-1"><Tag>{t.category}</Tag></div>
                    </div>
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
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sky-500/15 text-sky-300"><Code className="h-5 w-5" /></span>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-white">{b.title}</h3>
                    <p className="mt-1 text-sm text-slate-400">{b.description}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5"><Tag tone="sky">{b.framework}</Tag><Tag tone="indigo">{b.language}</Tag></div>
                  </div>
                </div>
                {b.repoLink && (
                  <a href={b.repoLink} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-sm text-emerald-300 hover:underline">
                    <ExternalLink className="h-4 w-4" /> View repository
                  </a>
                )}
                <div className="mt-4 flex gap-2">
                  <button type="button" onClick={() => setOpenCode(openCode === b.id ? null : b.id)} aria-expanded={openCode === b.id} className="flex-1 rounded-lg border border-white/10 py-1.5 text-sm text-slate-300 transition hover:border-white/25 hover:text-white">
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
