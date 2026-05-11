import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, g as addAttribute } from '../chunks/astro/server_DIFig9Wl.mjs';
import 'piccolore';
import { $ as $$Layout, N as Navigation } from '../chunks/Navigation_CvnahHsH.mjs';
export { renderers } from '../renderers.mjs';

function getExcerpt(plain, max = 160) {
  if (!plain) return "";
  const s = plain.replace(/\s+/g, " ").trim();
  if (s.length <= max) return s;
  return s.slice(0, max).replace(/\s+\S*$/, "") + "…";
}
function readingTime(plain) {
  const words = (plain ?? "").split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}
function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const HUB_URL = "";
  let notes = [];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Blog — Citinet" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-slate-950 text-white"> ${renderComponent($$result2, "Navigation", Navigation, { "client:load": true, "client:component-hydration": "load", "client:component-path": "H:/Apps/citinet-info/src/app/components/Navigation", "client:component-export": "Navigation" })} <div class="max-w-5xl mx-auto px-6 pt-32 pb-20"> <!-- Header --> <div class="mb-16"> <p class="text-xs text-slate-500 font-semibold uppercase tracking-widest mb-3">The CITINET Blog</p> <h1 class="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
From the <span class="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">community</span> </h1> <p class="text-xl text-slate-400 mb-3">Updates, ideas, and stories from the people building CITINET.</p> <p class="text-xs text-slate-600">
Powered by a${" "} <a href="https://citinet.cloud" class="text-violet-500 hover:text-violet-400 transition-colors">CITINET hub</a> </p> </div> <!-- States --> ${renderTemplate`<p class="text-slate-600 text-center py-20">HUB_URL environment variable not set.</p>`} ${HUB_URL} ${HUB_URL} <!-- Post grid --> ${notes.length > 0 && renderTemplate`<div class="grid grid-cols-1 md:grid-cols-2 gap-5"> ${notes.map((note) => renderTemplate`<a${addAttribute(`/blog/${note.id}`, "href")} class="group block bg-slate-900 border border-white/10 rounded-2xl overflow-hidden hover:border-violet-500/40 transition-all duration-300 hover:bg-slate-800/60"> <div class="h-1"${addAttribute(note.color ? `background:${note.color}` : "background: linear-gradient(to right, #2563eb, #7c3aed)", "style")}></div> <div class="p-6"> <h2 class="text-lg font-bold text-white group-hover:text-violet-300 transition-colors mb-3 leading-snug line-clamp-2"> ${note.title || "Untitled"} </h2> <p class="text-slate-400 text-sm leading-relaxed mb-5 line-clamp-3"> ${getExcerpt(note.web_body_plain, 160)} </p> <div class="flex items-center justify-between text-xs text-slate-600"> <span class="text-slate-500 font-medium">${note.author}</span> <div class="flex items-center gap-3"> <span>${readingTime(note.web_body_plain)}</span> <span>${formatDate(note.updated_at)}</span> </div> </div> </div> </a>`)} </div>`} </div> <div class="border-t border-white/5 py-8 text-center text-slate-600 text-sm"> <a href="https://info.citinet.cloud" class="hover:text-violet-400 transition-colors">info.citinet.cloud</a> ${" · "} <a href="https://citinet.cloud" class="hover:text-violet-400 transition-colors">citinet.cloud</a> </div> </div> ` })}`;
}, "H:/Apps/citinet-info/src/pages/blog/index.astro", void 0);
const $$file = "H:/Apps/citinet-info/src/pages/blog/index.astro";
const $$url = "/blog";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
