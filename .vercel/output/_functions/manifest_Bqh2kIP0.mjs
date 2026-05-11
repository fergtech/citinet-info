import 'piccolore';
import { o as decodeKey } from './chunks/astro/server_DIFig9Wl.mjs';
import 'clsx';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_CW0G-4tA.mjs';
import 'es-module-lexer';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///H:/Apps/citinet-info/","cacheDir":"file:///H:/Apps/citinet-info/node_modules/.astro/","outDir":"file:///H:/Apps/citinet-info/dist/","srcDir":"file:///H:/Apps/citinet-info/src/","publicDir":"file:///H:/Apps/citinet-info/public/","buildClientDir":"file:///H:/Apps/citinet-info/dist/client/","buildServerDir":"file:///H:/Apps/citinet-info/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_id_.BhPcHdnA.css"}],"routeData":{"route":"/blog/[id]","isIndex":false,"type":"page","pattern":"^\\/blog\\/([^/]+?)\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/blog/[id].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_id_.BhPcHdnA.css"}],"routeData":{"route":"/blog","isIndex":true,"type":"page","pattern":"^\\/blog\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/blog/index.astro","pathname":"/blog","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["H:/Apps/citinet-info/src/pages/blog/[id].astro",{"propagation":"none","containsHead":true}],["H:/Apps/citinet-info/src/pages/blog/index.astro",{"propagation":"none","containsHead":true}],["H:/Apps/citinet-info/src/pages/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-page:src/pages/blog/[id]@_@astro":"pages/blog/_id_.astro.mjs","\u0000@astro-page:src/pages/blog/index@_@astro":"pages/blog.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_Bqh2kIP0.mjs","H:/Apps/citinet-info/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_ONakMPZI.mjs","H:/Apps/citinet-info/src/app/components/Navigation":"_astro/Navigation.CWP_XX0L.js","H:/Apps/citinet-info/src/app/components/GiscusComments":"_astro/GiscusComments.C1CjS_u0.js","H:/Apps/citinet-info/src/app/components/HeroSection":"_astro/HeroSection.C7sAChrF.js","H:/Apps/citinet-info/src/app/components/MovementStatement":"_astro/MovementStatement.CBCEbI3X.js","H:/Apps/citinet-info/src/app/components/NetworkExplainer":"_astro/NetworkExplainer.D4anyAn7.js","H:/Apps/citinet-info/src/app/components/SpacesShowcase":"_astro/SpacesShowcase.BPuYFMDR.js","H:/Apps/citinet-info/src/app/components/HowItWorks":"_astro/HowItWorks.B46pakVb.js","H:/Apps/citinet-info/src/app/components/ManifestoQuotes":"_astro/ManifestoQuotes.CSJz7fdo.js","H:/Apps/citinet-info/src/app/components/FinalCTA":"_astro/FinalCTA.CFxdIkB2.js","@astrojs/react/client.js":"_astro/client.nc8uITnr.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/_id_.BhPcHdnA.css","/_astro/arrow-right.CCZbWiTZ.js","/_astro/book-open.BTYz8NnM.js","/_astro/client.nc8uITnr.js","/_astro/cpu.DoHQ2JWe.js","/_astro/createLucideIcon.CPAL2x-b.js","/_astro/download.BiW3sbGP.js","/_astro/FinalCTA.CFxdIkB2.js","/_astro/GiscusComments.C1CjS_u0.js","/_astro/HeroSection.C7sAChrF.js","/_astro/HowItWorks.B46pakVb.js","/_astro/index.DK-fsZOb.js","/_astro/jsx-runtime.ClP7wGfN.js","/_astro/ManifestoQuotes.CSJz7fdo.js","/_astro/monitor.Bspt0Jut.js","/_astro/MovementStatement.CBCEbI3X.js","/_astro/Navigation.CWP_XX0L.js","/_astro/NetworkExplainer.D4anyAn7.js","/_astro/SpacesShowcase.BPuYFMDR.js","/_astro/use-in-view.snxAvX3z.js","/_astro/users.C6h3RD3c.js","/_astro/x.yj4Gk38m.js","/imgs/discussion-feed/Screenshot 2026-05-08 194537.png","/imgs/discussion-feed/Screenshot 2026-05-08 194554.png","/imgs/discussion-feed/Screenshot 2026-05-08 194610.png","/imgs/discussion-feed/Screenshot 2026-05-08 194641.png","/imgs/AI-assistant/Screenshot 2026-05-08 195416.png","/imgs/AI-assistant/Screenshot 2026-05-08 195426.png","/imgs/AI-assistant/Screenshot 2026-05-08 195524.png","/imgs/Atlas/Screenshot 2026-05-08 194919.png","/imgs/Atlas/Screenshot 2026-05-08 194929.png","/imgs/Atlas/Screenshot 2026-05-08 194958.png","/imgs/Atlas/Screenshot 2026-05-08 195028.png","/imgs/Atlas/Screenshot 2026-05-08 195036.png","/imgs/hub-discovery/Screenshot 2026-05-08 203048.png","/imgs/logo/logo.png","/imgs/marketplace/Screenshot 2026-05-08 194834.png","/imgs/marketplace/Screenshot 2026-05-08 194850.png","/imgs/files/Screenshot 2026-05-08 194515.png","/imgs/messages/Screenshot 2026-05-08 194710.png","/imgs/messages/Screenshot 2026-05-08 194731.png","/imgs/messages/Screenshot 2026-05-08 194753.png","/imgs/raspberrypi/vishnu-mohanan-rZKdS0wI8Ks-unsplash.jpg","/imgs/mini-pc/onur-binay-Sa-0GdWMRRQ-unsplash.jpg","/imgs/spare-computer/hugo-clement-IvUCu_u5hjI-unsplash.jpg","/imgs/user-profiles/Screenshot 2026-05-08 195239.png","/imgs/user-profiles/Screenshot 2026-05-08 195252.png","/imgs/user-profiles/Screenshot 2026-05-08 195306.png","/imgs/spaces/Screenshot 2026-05-08 195550.png","/index.html"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"serverIslandNameMap":[],"key":"0ZkiHZDoa6tBH4Y3dCwtEN0HI/k7qSku+O3+mDDy/HY="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
