// Parses MANIFESTO.md into structured sections so the /statement page renders the real text
// (one source of truth: edit the markdown and the page follows).

export type Block =
  | { type: 'p'; lines: string[] }
  | { type: 'ul'; items: string[] };

export interface Sub {
  id: string;
  title: string;
  blocks: Block[];
}

export interface Section {
  n: number;
  title: string;
  blocks: Block[];
  subs: Sub[];
}

export interface Statement {
  title: string;
  subtitle: string;
  edition: string;
  /** e.g. "By [@zee](https://...), an independent project" (markdown link, rendered by inline()) */
  byline: string;
  sections: Section[];
}

export function parseStatement(raw: string): Statement {
  const lines = raw.replace(/\r\n/g, '\n').split('\n');
  const doc: Statement = { title: '', subtitle: '', edition: '', byline: '', sections: [] };

  let section: Section | null = null;
  let sub: Sub | null = null;
  let para: string[] = [];
  let list: string[] = [];

  const target = (): Block[] | null => (sub ? sub.blocks : section ? section.blocks : null);
  const flush = () => {
    const t = target();
    if (para.length && t) t.push({ type: 'p', lines: para });
    if (list.length && t) t.push({ type: 'ul', items: list });
    para = [];
    list = [];
  };

  for (const line of lines) {
    const l = line.trimEnd();
    let m: RegExpMatchArray | null;

    if ((m = l.match(/^# (.+)/))) { doc.title = m[1]; continue; }
    if (!section && (m = l.match(/^## (.+)/))) { doc.subtitle = m[1]; continue; }
    if (!section && (m = l.match(/^\*\*(.+)\*\*$/))) { doc.edition = m[1]; continue; }
    if (!section && (m = l.match(/^By\s+(.+)/))) { doc.byline = m[0]; continue; }

    if ((m = l.match(/^### (\d+)\.\s+(.+)/))) {
      flush();
      section = { n: Number(m[1]), title: m[2], blocks: [], subs: [] };
      doc.sections.push(section);
      sub = null;
      continue;
    }
    if (section && (m = l.match(/^#### (\d+\.\d+)\s+(.+)/))) {
      flush();
      sub = { id: m[1], title: m[2], blocks: [] };
      section.subs.push(sub);
      continue;
    }
    if (l.trim() === '---') { flush(); continue; }
    if (l.trim() === '') { flush(); continue; }
    if (l.startsWith('- ')) {
      if (para.length) flush();
      list.push(l.slice(2));
      continue;
    }
    if (list.length) flush();
    para.push(l);
  }
  flush();
  return doc;
}

/**
 * Escapes HTML, then turns **bold**, *italic* and `code` into tags. Only ever fed our own markdown.
 * `[text](soon)` renders a button that shows a small "more on this coming soon" popover instead of linking
 * anywhere (for things that are announced but not published yet); `[text](soon:Your own message)` overrides it.
 */
export function inline(s: string): string {
  const esc = s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return esc
    .replace(
      /\[([^\]]+)\]\(soon(?::([^)]+))?\)/g,
      (_m, text: string, msg?: string) =>
        `<button type="button" class="stmt-soon" data-soon aria-expanded="false">${text}<span class="stmt-soon__pop" role="status">${msg ?? 'More on this coming soon.'}</span></button>`,
    )
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-foreground underline decoration-muted-foreground underline-offset-4 transition-colors hover:decoration-foreground">$1</a>',
    )
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="rounded border border-border bg-muted px-1 font-mono text-[0.85em] text-foreground">$1</code>');
}

export function sentenceCase(s: string): string {
  const t = s.trim();
  return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
}
