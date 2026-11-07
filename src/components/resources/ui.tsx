import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

/** Copies `text` and confirms for two seconds. */
export function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async (e) => {
        e.stopPropagation();
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          // Clipboard access can be refused (insecure context, permissions); the code stays selectable.
        }
      }}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 font-mono text-xs text-slate-300 transition hover:border-emerald-400/40 hover:text-emerald-300"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? 'Copied' : label}
    </button>
  );
}

/** A dark code block that scrolls instead of widening the page. */
export function CodeBlock({ code, wrap = false, maxHeight = true }: { code: string; wrap?: boolean; maxHeight?: boolean }) {
  return (
    <pre className={`overflow-x-auto rounded-xl border border-white/5 bg-slate-950 p-4 font-mono text-xs leading-relaxed text-slate-300 ${wrap ? 'whitespace-pre-wrap' : ''} ${maxHeight ? 'max-h-96 overflow-y-auto' : ''}`}>
      <code>{code}</code>
    </pre>
  );
}

/** Small pill for tags and categories. */
export function Tag({ children, tone = 'slate' }: { children: React.ReactNode; tone?: 'slate' | 'indigo' | 'emerald' | 'sky' }) {
  const tones = {
    slate: 'border-white/10 bg-white/5 text-slate-300',
    indigo: 'border-indigo-400/20 bg-indigo-500/10 text-indigo-200',
    emerald: 'border-emerald-400/20 bg-emerald-500/10 text-emerald-200',
    sky: 'border-sky-400/20 bg-sky-500/10 text-sky-200',
  };
  return <span className={`inline-flex rounded-full border px-2.5 py-0.5 font-mono text-[11px] ${tones[tone]}`}>{children}</span>;
}

/** Shown when the search leaves nothing in a list. */
export function Empty({ what }: { what: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center">
      <p className="text-slate-300">No {what} found</p>
      <p className="mt-1 text-sm text-slate-500">Try adjusting your search or filters.</p>
    </div>
  );
}

/** "N things" with the right plural. */
export function Count({ n, one, many }: { n: number; one: string; many: string }) {
  return <p className="mb-6 font-mono text-xs text-slate-500">{n} {n === 1 ? one : many}</p>;
}

/** Card shell shared by every resource type. */
export const card = 'rounded-2xl border border-white/10 bg-white/[0.03] transition hover:border-white/20';
