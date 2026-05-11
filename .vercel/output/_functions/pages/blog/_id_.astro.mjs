import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro, m as maybeRenderHead } from '../../chunks/astro/server_DIFig9Wl.mjs';
import 'piccolore';
import { N as Navigation, $ as $$Layout } from '../../chunks/Navigation_CvnahHsH.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  let note = null;
  const pageTitle = "Citinet Blog";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": pageTitle }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-slate-950 text-white"> ${renderComponent($$result2, "Navigation", Navigation, { "client:load": true, "client:component-hydration": "load", "client:component-path": "H:/Apps/citinet-info/src/app/components/Navigation", "client:component-export": "Navigation" })} <div class="max-w-2xl mx-auto px-6 pt-32 pb-24"> <a href="/blog" class="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-violet-400 transition-colors mb-12">
← All posts
</a> ${renderTemplate`<p class="text-slate-500 text-center py-20">Post not found or unavailable.</p>`} ${note} </div> <div class="border-t border-white/5 py-8 text-center text-slate-600 text-sm"> <a href="/blog" class="hover:text-violet-400 transition-colors">← Back to blog</a> </div> </div> ` })}`;
}, "H:/Apps/citinet-info/src/pages/blog/[id].astro", void 0);
const $$file = "H:/Apps/citinet-info/src/pages/blog/[id].astro";
const $$url = "/blog/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
