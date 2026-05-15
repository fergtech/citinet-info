import { e as createComponent, g as addAttribute, r as renderTemplate, l as renderHead, n as renderSlot, h as createAstro } from './astro/server_DIFig9Wl.mjs';
import 'piccolore';
import 'clsx';
/* empty css                        */
import { jsx, jsxs } from 'react/jsx-runtime';
import { useScroll, useTransform, motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Github, X, Menu } from 'lucide-react';

const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const {
    title = "Citinet - Community-Owned Cloud",
    description,
    ogType = "website",
    ogUrl,
    ogImage,
    canonical,
    articlePublishedTime,
    articleAuthor
  } = Astro2.props;
  const SITE_URL = "https://info.citinet.cloud";
  const LOGO = `${SITE_URL}/imgs/logo/logo.png`;
  const DEFAULT_DESC = "Store files. Connect with neighbors. No Amazon. No Google. No middleman. Start your own hub or find one already running in your community.";
  const metaDesc = description || DEFAULT_DESC;
  const metaImage = ogImage || LOGO;
  const metaUrl = ogUrl || SITE_URL;
  const canonicalUrl = canonical || metaUrl;
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title}</title><meta name="description"${addAttribute(metaDesc, "content")}><link rel="canonical"${addAttribute(canonicalUrl, "href")}><!-- Favicon --><link rel="icon" type="image/png" href="/imgs/logo/logo.png"><link rel="apple-touch-icon" href="/imgs/logo/logo.png"><!-- Open Graph --><meta property="og:type"${addAttribute(ogType, "content")}><meta property="og:site_name" content="Citinet"><meta property="og:title"${addAttribute(title, "content")}><meta property="og:description"${addAttribute(metaDesc, "content")}><meta property="og:image"${addAttribute(metaImage, "content")}><meta property="og:image:alt"${addAttribute(title, "content")}><meta property="og:url"${addAttribute(metaUrl, "content")}><meta property="og:locale" content="en_US">${articlePublishedTime && renderTemplate`<meta property="article:published_time"${addAttribute(articlePublishedTime, "content")}>`}${articleAuthor && renderTemplate`<meta property="article:author"${addAttribute(articleAuthor, "content")}>`}<!-- Twitter / X Card --><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"${addAttribute(title, "content")}><meta name="twitter:description"${addAttribute(metaDesc, "content")}><meta name="twitter:image"${addAttribute(metaImage, "content")}><meta name="twitter:image:alt"${addAttribute(title, "content")}>${renderHead()}</head> <body> ${renderSlot($$result, $$slots["default"])} </body></html>`;
}, "H:/Apps/citinet-info/src/layouts/Layout.astro", void 0);

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const { scrollY } = useScroll();
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ["rgba(2, 6, 23, 0)", "rgba(2, 6, 23, 0.8)"]
  );
  const navItems = [
    { id: "hero", label: "Home" },
    { id: "phases", label: "How It Works" },
    { id: "how-it-works", label: "Get Started" },
    { id: "cta", label: "Start a Hub" }
  ];
  const isIndexPage = typeof window !== "undefined" && window.location.pathname === "/";
  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map((item) => ({
        id: item.id,
        element: document.getElementById(item.id)
      }));
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.element && section.element.offsetTop <= scrollPosition) {
          setActiveSection(section.id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const scrollToSection = (id) => {
    if (!isIndexPage) {
      window.location.href = `/#${id}`;
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      setIsOpen(false);
      setTimeout(() => {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 10);
    }
  };
  return /* @__PURE__ */ jsx(
    motion.nav,
    {
      style: { backgroundColor },
      className: "fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-white/10",
      children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between h-20", children: [
          /* @__PURE__ */ jsxs(
            motion.button,
            {
              onClick: () => scrollToSection("hero"),
              className: "flex items-center gap-2.5 group",
              whileHover: { scale: 1.05 },
              whileTap: { scale: 0.95 },
              children: [
                /* @__PURE__ */ jsx("img", { src: "/imgs/logo/logo.png", alt: "Citinet", className: "h-8 w-auto" }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col leading-none items-start", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-xl font-bold text-white tracking-tight", children: "Citinet" }),
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-400 font-medium tracking-wide", children: "Citizens' Internet Project" })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "hidden lg:flex items-center gap-1", children: navItems.map((item) => /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => scrollToSection(item.id),
              className: `relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${activeSection === item.id ? "text-violet-400" : "text-slate-300 hover:text-white"}`,
              children: [
                item.label,
                activeSection === item.id && /* @__PURE__ */ jsx(
                  motion.div,
                  {
                    layoutId: "activeSection",
                    className: "absolute inset-0 bg-violet-500/10 border border-violet-500/30 rounded-lg -z-10",
                    transition: { type: "spring", stiffness: 380, damping: 30 }
                  }
                )
              ]
            },
            item.id
          )) }),
          /* @__PURE__ */ jsxs("div", { className: "hidden lg:flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(
              "a",
              {
                href: "/blog",
                className: "px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors",
                children: "Blog"
              }
            ),
            /* @__PURE__ */ jsx(
              "a",
              {
                href: "https://github.com/fergtech/citinet",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200",
                "aria-label": "View on GitHub",
                children: /* @__PURE__ */ jsx(Github, { className: "w-5 h-5" })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => scrollToSection("cta"),
                className: "px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-600/30 transition-all duration-300 hover:scale-105",
                children: "Start a Hub"
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setIsOpen(!isOpen),
              className: "lg:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 transition-colors",
              children: isOpen ? /* @__PURE__ */ jsx(X, { className: "w-6 h-6 text-white" }) : /* @__PURE__ */ jsx(Menu, { className: "w-6 h-6 text-white" })
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          motion.div,
          {
            initial: false,
            animate: {
              height: isOpen ? "auto" : 0,
              opacity: isOpen ? 1 : 0
            },
            transition: { duration: 0.3, ease: "easeInOut" },
            style: { pointerEvents: isOpen ? "auto" : "none" },
            className: "lg:hidden overflow-hidden",
            children: /* @__PURE__ */ jsxs("div", { className: "py-4 space-y-1", children: [
              navItems.map((item) => /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => scrollToSection(item.id),
                  className: `block w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${activeSection === item.id ? "text-violet-400 bg-violet-500/10 border border-violet-500/30" : "text-slate-300 hover:text-white hover:bg-white/5"}`,
                  children: item.label
                },
                item.id
              )),
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: "/blog",
                  className: "block w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-300",
                  children: "Blog"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => scrollToSection("cta"),
                  className: "w-full mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-600/30 transition-all duration-300",
                  children: "Start a Hub"
                }
              )
            ] })
          }
        )
      ] })
    }
  );
}

export { $$Layout as $, Navigation as N };
