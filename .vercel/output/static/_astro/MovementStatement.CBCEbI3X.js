import{j as e}from"./jsx-runtime.ClP7wGfN.js";import{r as c}from"./index.DK-fsZOb.js";import{u as d}from"./use-in-view.snxAvX3z.js";import{k as r,l as a}from"./createLucideIcon.CPAL2x-b.js";import{U as l}from"./users.C6h3RD3c.js";/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m=[["path",{d:"M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z",key:"p7xjir"}]],x=r("cloud",m);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u=[["path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",key:"1lielz"}]],p=r("message-square",u),h=[{Icon:x,text:"Your photos live on Amazon's servers."},{Icon:p,text:"Your messages are stored by Meta."},{Icon:l,text:"Your community is a tenant on someone else's platform."}];function v(){const t=c.useRef(null),s=d(t,{once:!0,amount:.3});return e.jsx("section",{id:"movement",ref:t,className:"relative py-24 bg-gradient-to-b from-slate-900 to-slate-950",children:e.jsxs("div",{className:"max-w-5xl mx-auto px-6",children:[e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-6 mb-16",children:h.map(({Icon:n,text:i},o)=>e.jsxs(a.div,{initial:{opacity:0,y:24},animate:s?{opacity:1,y:0}:{},transition:{duration:.6,delay:o*.15},className:"bg-slate-800/40 border border-red-500/10 rounded-2xl p-8 text-center",children:[e.jsx("div",{className:"w-14 h-14 mx-auto mb-5 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center",children:e.jsx(n,{className:"w-7 h-7 text-red-400/80"})}),e.jsx("p",{className:"text-white font-medium text-lg leading-snug",children:i})]},o))}),e.jsx(a.div,{initial:{opacity:0,y:20},animate:s?{opacity:1,y:0}:{},transition:{duration:.8,delay:.5},className:"text-center",children:e.jsx("p",{className:"text-3xl md:text-4xl font-bold text-white",children:"It doesn't have to be this way."})})]})})}export{v as MovementStatement};
