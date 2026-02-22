import { motion } from 'motion/react';
import { BookOpen, X, Download } from 'lucide-react';
import manifestoText from '../../manifesto.md?raw';

function inlineParse(str: string): React.ReactNode {
  const parts = str.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**'))
      return <strong key={i} className="text-white font-semibold">{p.slice(2, -2)}</strong>;
    if (p.startsWith('*') && p.endsWith('*'))
      return <em key={i} className="italic text-slate-200">{p.slice(1, -1)}</em>;
    if (p.startsWith('`') && p.endsWith('`'))
      return <code key={i} className="font-mono text-cyan-300 bg-slate-800 px-1 rounded text-xs">{p.slice(1, -1)}</code>;
    return p;
  });
}

function renderMarkdown(raw: string): React.ReactNode[] {
  const text = raw.trim().replace(/^---[\s\S]*?---\n/, '').trim();
  const lines = text.split('\n');
  const out: React.ReactNode[] = [];
  let listBuf: string[] = [];
  let key = 0;

  const flushList = () => {
    if (!listBuf.length) return;
    out.push(
      <ul key={key++} className="my-3 space-y-1.5 pl-1">
        {listBuf.map((li, i) => (
          <li key={i} className="flex items-start gap-2 text-slate-300 text-sm leading-relaxed">
            <span className="text-cyan-400 mt-0.5 shrink-0">•</span>
            <span>{inlineParse(li)}</span>
          </li>
        ))}
      </ul>
    );
    listBuf = [];
  };

  for (const line of lines) {
    if (line.startsWith('# ')) {
      flushList();
      out.push(<h1 key={key++} className="text-2xl font-bold text-white mb-3 mt-1">{inlineParse(line.slice(2))}</h1>);
    } else if (line.startsWith('## ')) {
      flushList();
      out.push(<h2 key={key++} className="text-base font-bold text-slate-400 uppercase tracking-widest mb-1 mt-1">{inlineParse(line.slice(3))}</h2>);
    } else if (line.startsWith('### ')) {
      flushList();
      out.push(<h3 key={key++} className="text-lg font-bold text-cyan-400 mb-2 mt-6">{inlineParse(line.slice(4))}</h3>);
    } else if (line.startsWith('#### ')) {
      flushList();
      out.push(<h4 key={key++} className="text-sm font-semibold text-emerald-400 mb-1.5 mt-4">{inlineParse(line.slice(5))}</h4>);
    } else if (line.startsWith('- ')) {
      listBuf.push(line.slice(2));
    } else if (line.trim() === '---') {
      flushList();
      out.push(<hr key={key++} className="border-slate-700/60 my-5" />);
    } else if (line.trim() === '') {
      flushList();
    } else {
      flushList();
      out.push(<p key={key++} className="text-slate-300 text-sm leading-relaxed mb-3">{inlineParse(line)}</p>);
    }
  }
  flushList();
  return out;
}

export function ManifestoModal({ onClose }: { onClose: () => void }) {
  const handleDownload = () => {
    const blob = new Blob([manifestoText], { type: 'text/markdown; charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'citinet-manifesto.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Citinet Manifesto"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-2xl max-h-[85vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-black/60 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 shrink-0">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-cyan-400 shrink-0" />
            <h2 className="text-base font-bold text-white">The Citinet Manifesto</h2>
            <span className="text-xs text-slate-500 font-medium">2026 Draft</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close manifesto"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 py-5">
          {renderMarkdown(manifestoText)}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-700 shrink-0 flex items-center justify-end">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-semibold rounded-lg shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-200 hover:scale-105"
          >
            <Download className="w-4 h-4" />
            Download .md
          </button>
        </div>
      </motion.div>
    </div>
  );
}
