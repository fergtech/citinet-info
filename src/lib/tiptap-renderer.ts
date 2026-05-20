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
      const src   = escapeAttr((node.attrs?.src as string) ?? '');
      const alt   = escapeAttr((node.attrs?.alt as string) ?? '');
      const title = node.attrs?.title ? ` title="${escapeAttr(node.attrs.title as string)}"` : '';
      return `<img src="${src}" alt="${alt}"${title} loading="lazy">\n`;
    }

    case 'video': {
      const src      = escapeAttr((node.attrs?.src as string) ?? '');
      const mimeType = escapeAttr((node.attrs?.mimeType as string) ?? 'video/mp4');
      return `<video controls preload="metadata" style="max-width:100%;border-radius:0.5rem;"><source src="${src}" type="${mimeType}"></video>\n`;
    }

    case 'youtube': {
      // TipTap stores the full YouTube watch URL in src; convert to embed URL.
      const raw = (node.attrs?.src as string) ?? '';
      let videoId = '';
      try {
        const u = new URL(raw);
        videoId = u.searchParams.get('v') ?? u.pathname.split('/').pop() ?? '';
      } catch { /* ignore */ }
      if (!videoId) return '';
      const embedUrl = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}`;
      return `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:0.75rem;margin:1rem 0;">
  <iframe src="${embedUrl}" title="YouTube video" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;border-radius:0.75rem;" loading="lazy"></iframe>
</div>\n`;
    }

    case 'linkPreview': {
      const url         = escapeAttr((node.attrs?.url as string) ?? '#');
      const title       = escapeHtml((node.attrs?.title as string) ?? url);
      const description = escapeHtml((node.attrs?.description as string) ?? '');
      const image       = node.attrs?.image ? escapeAttr(node.attrs.image as string) : null;
      const siteName    = escapeHtml((node.attrs?.siteName as string) ?? '');
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="display:block;text-decoration:none;border:1px solid rgba(255,255,255,0.1);border-radius:0.75rem;overflow:hidden;margin:1rem 0;background:rgba(255,255,255,0.04);">
  ${image ? `<img src="${image}" alt="${title}" loading="lazy" style="width:100%;height:12rem;object-fit:cover;">` : ''}
  <div style="padding:0.875rem 1rem;">
    ${siteName ? `<p style="font-size:0.7rem;text-transform:uppercase;letter-spacing:0.05em;color:#94a3b8;margin:0 0 0.25rem;">${siteName}</p>` : ''}
    <p style="font-size:0.95rem;font-weight:600;color:#f1f5f9;margin:0 0 0.25rem;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${title}</p>
    ${description ? `<p style="font-size:0.8rem;color:#94a3b8;margin:0 0 0.5rem;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${description}</p>` : ''}
    <p style="font-size:0.7rem;color:#64748b;margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${url}</p>
  </div>
</a>\n`;
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
