interface TipTapMark {
  type: string;
  attrs?: Record<string, unknown>;
}

interface TipTapNode {
  type: string;
  content?: TipTapNode[];
  text?: string;
  marks?: TipTapMark[];
  attrs?: Record<string, unknown>;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(str: string): string {
  return String(str).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function applyMarks(text: string, marks: TipTapMark[]): string {
  let result = escapeHtml(text);
  for (const mark of marks) {
    switch (mark.type) {
      case 'bold':      result = `<strong>${result}</strong>`; break;
      case 'italic':    result = `<em>${result}</em>`; break;
      case 'underline': result = `<u>${result}</u>`; break;
      case 'code':      result = `<code>${result}</code>`; break;
      case 'link': {
        const href = escapeAttr((mark.attrs?.href as string) ?? '#');
        result = `<a href="${href}" target="_blank" rel="noopener noreferrer">${result}</a>`;
        break;
      }
    }
  }
  return result;
}

function renderNode(node: TipTapNode): string {
  const children = () => (node.content ?? []).map(renderNode).join('');

  switch (node.type) {
    case 'doc':
      return children();

    case 'paragraph':
      return `<p>${children() || '<br>'}</p>\n`;

    case 'heading': {
      const l = (node.attrs?.level as number) ?? 2;
      return `<h${l}>${children()}</h${l}>\n`;
    }

    case 'text':
      return node.marks?.length
        ? applyMarks(node.text ?? '', node.marks)
        : escapeHtml(node.text ?? '');

    case 'hardBreak':
      return '<br>';

    case 'bulletList':
      return `<ul>\n${children()}</ul>\n`;

    case 'orderedList':
      return `<ol>\n${children()}</ol>\n`;

    case 'listItem':
      return `<li>${children()}</li>\n`;

    case 'taskList':
      return `<ul class="task-list">\n${children()}</ul>\n`;

    case 'taskItem': {
      const checked = node.attrs?.checked ? 'checked' : '';
      return `<li class="task-item"><input type="checkbox" ${checked} disabled>${children()}</li>\n`;
    }

    case 'codeBlock': {
      const lang = escapeAttr((node.attrs?.language as string) ?? '');
      const code = (node.content ?? []).map(n => escapeHtml(n.text ?? '')).join('');
      return `<pre><code class="language-${lang}">${code}</code></pre>\n`;
    }

    case 'image': {
      const src  = escapeAttr((node.attrs?.src as string) ?? '');
      const alt  = escapeAttr((node.attrs?.alt as string) ?? '');
      const title = node.attrs?.title
        ? ` title="${escapeAttr(node.attrs.title as string)}"`
        : '';
      return `<img src="${src}" alt="${alt}"${title} loading="lazy">\n`;
    }

    case 'blockquote':
      return `<blockquote>${children()}</blockquote>\n`;

    default:
      return children();
  }
}

export function renderTipTap(json: unknown): string {
  if (!json || typeof json !== 'object') return '';
  return renderNode(json as TipTapNode);
}

export function getExcerpt(plain: string, max = 160): string {
  if (!plain) return '';
  const s = plain.replace(/\s+/g, ' ').trim();
  if (s.length <= max) return s;
  return s.slice(0, max).replace(/\s+\S*$/, '') + '…';
}

export function readingTime(plain: string): string {
  const words = (plain ?? '').split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}
