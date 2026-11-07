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
      className="inline-flex shrink-0 items-center gap-1.5 rounded-sm border border-ink/30 bg-sheet px-2.5 py-1.5 text-sm font-medium text-ink transition-colors hover:border-ink hover:bg-signal"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-pass" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? 'Copied' : label}
    </button>
  );
}

/** An ink code block that scrolls instead of widening the page. */
export function CodeBlock({ code, wrap = false, maxHeight = true }: { code: string; wrap?: boolean; maxHeight?: boolean }) {
  return (
    <pre className={`overflow-x-auto rounded-sm bg-ink p-4 font-mono text-[12.5px] leading-relaxed text-paper ${wrap ? 'whitespace-pre-wrap' : ''} ${maxHeight ? 'max-h-96 overflow-y-auto' : ''}`}>
      <code>{code}</code>
    </pre>
  );
}

/** Small pill for tags and categories. */
export function Tag({ children, strong = false }: { children: React.ReactNode; strong?: boolean }) {
  return (
    <span className={`inline-flex rounded-sm px-2 py-0.5 text-[13px] font-medium ${strong ? 'bg-signal text-ink' : 'bg-ink/[0.07] text-ink-2'}`}>
      {children}
    </span>
  );
}

/** Shown when the search leaves nothing in a list. */
export function Empty({ what }: { what: string }) {
  return (
    <div className="rounded-sm border-2 border-dashed border-rule py-16 text-center">
      <p className="font-semibold">No {what} found</p>
      <p className="mt-1 text-ink-2">Try a shorter search, or another filter.</p>
    </div>
  );
}

/** "N things" with the right plural. */
export function Count({ n, one, many }: { n: number; one: string; many: string }) {
  return <p className="tabular mb-6 text-sm font-medium text-ink-3">{n} {n === 1 ? one : many}</p>;
}

/** Card shell shared by every resource type. */
export const card = 'rounded-sm border border-rule bg-sheet transition-colors hover:border-ink/40';
