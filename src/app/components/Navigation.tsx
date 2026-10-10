import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useState, useEffect } from 'react';
import { ArrowUp, Menu, X, Github, Sun, Moon } from 'lucide-react';

// Two separate floating pieces, like the site this was modelled on: the brand sits in the top-left
// corner on its own, and the links live in a pill in the top-right corner. Nothing spans the page.
// Every section of the home page, in order, so the compact header can say where you are.
const PAGE_SECTIONS = [
  { id: 'hero', label: 'Home' },
  { id: 'movement', label: "What it's for" },
  { id: 'network', label: 'The hub' },
  { id: 'phases', label: 'Features' },
  { id: 'trust', label: 'Reliability' },
  { id: 'how-it-works', label: 'Get started' },
  { id: 'declaration', label: 'Declaration' },
  { id: 'cta', label: 'Start a Hub' },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isDark, setIsDark] = useState(false);
  // Scrolling down tucks the header into a compact form; scrolling up (or being near the top) restores it.
  const [compact, setCompact] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [sectionLabel, setSectionLabel] = useState('Home');
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setShowTop(y > window.innerHeight * 1.1);
      let label = PAGE_SECTIONS[0].label;
      for (const sec of PAGE_SECTIONS) {
        const el = document.getElementById(sec.id);
        if (el && el.getBoundingClientRect().top + y <= y + window.innerHeight / 3) label = sec.label;
      }
      // At the very bottom the last section can never reach the one-third line, so it wins by position.
      if (window.innerHeight + y >= document.documentElement.scrollHeight - 8) label = PAGE_SECTIONS[PAGE_SECTIONS.length - 1].label;
      setSectionLabel(label);
      if (y < 60) {
        setCompact(false);
        lastY = y;
        return;
      }
      const dy = y - lastY;
      if (Math.abs(dy) < 8) return; // ignore jitter; dy accumulates until it is a real move
      setCompact(dy > 0);
      setIsOpen(false);
      lastY = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toTop = () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    document.documentElement.classList.toggle('dark', next);
    try { localStorage.setItem('theme', next ? 'dark' : 'light'); } catch {}
    setIsDark(next);
  };

  const navItems = [
    { id: 'hero',         label: 'Home' },
    { id: 'phases',       label: 'Features' },
    { id: 'trust',        label: 'Reliability' },
    { id: 'how-it-works', label: 'Get Started' },
  ];

  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const isIndexPage = pathname === '/';
  const isBlogPage = pathname.startsWith('/blog');
  const isStatementPage = pathname.startsWith('/statement');

  useEffect(() => {
    // On blog pages there are no scroll-tracked sections. Highlight Blog instead.
    if (isBlogPage) {
      setActiveSection('blog');
      return;
    }
    if (isStatementPage) {
      setActiveSection('statement');
      return;
    }

    const handleScroll = () => {
      const sections = navItems.map(item => ({
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

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isBlogPage, isStatementPage]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    if (!isIndexPage) {
      window.location.href = `/#${id}`;
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 10);
    }
  };

  // Shared look for both pills: translucent, blurred, hairline border, soft shadow.
  const pillBase =
    'pointer-events-auto flex items-center rounded-full border border-foreground/10 bg-background/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_8px_32px_-12px_rgba(0,0,0,0.4)] backdrop-blur-xl backdrop-saturate-150 transition-[height,padding,width] duration-300 ease-out';
  const h = compact ? 'h-10' : 'h-12';
  const linkClass = (active: boolean) =>
    `rounded-full px-4 py-2 text-[15px] tracking-[0.04em] transition-colors ${
      active ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'
    }`;
  const mobileLinkClass = (active: boolean) =>
    `block w-full rounded-xl px-4 py-3 text-left text-base transition-colors ${
      active ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
    }`;
  const iconBtn = `flex ${compact ? 'h-8 w-8' : 'h-9 w-9'} items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground`;
  const currentLabel = isBlogPage ? 'Blog' : isStatementPage ? 'Statement' : sectionLabel;
  const collapse = { initial: { opacity: 0, width: 0 }, animate: { opacity: 1, width: 'auto' }, exit: { opacity: 0, width: 0 } };

  return (
    <>
      <header
        className={`pointer-events-none fixed inset-x-0 top-0 z-50 flex items-start justify-between px-4 sm:px-8 xl:px-[52px] transition-[padding] duration-300 ${
          compact ? 'pt-3 xl:pt-4' : 'pt-4 xl:pt-6'
        }`}
      >
        {/* Brand: logo and name; just the logo once compact (and on small screens) */}
        <button
          onClick={() => scrollToSection('hero')}
          aria-label="Citinet, back to the top"
          className={`${pillBase} ${h} justify-center ${compact ? 'w-10' : 'min-w-12 gap-2.5 sm:justify-start sm:pl-3.5 sm:pr-5'}`}
        >
          <img src="/imgs/logo/logo.png" alt="" className={`w-auto invert transition-[height] duration-300 dark:invert-0 ${compact ? 'h-5' : 'h-6'}`} />
          <AnimatePresence initial={false}>
            {!compact && (
              <motion.span key="brand-text" {...collapse} transition={{ duration: 0.25 }} className="hidden items-center gap-2.5 overflow-hidden whitespace-nowrap sm:flex">
                <span className="text-[15px] font-semibold tracking-tight text-foreground">Citinet</span>
                <span className="hidden border-l border-border pl-2.5 font-mono text-[11px] text-muted-foreground xl:inline">
                  Citizens' Internet Project
                </span>
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Links and actions */}
        <nav aria-label="Primary" className="relative">
          {/* Desktop: full links, or the compact form with the current section and a menu button */}
          <div className={`${pillBase} ${h} hidden gap-0.5 pl-2 pr-1.5 lg:flex`}>
            <AnimatePresence initial={false} mode="popLayout">
              {!compact ? (
                <motion.div key="links" {...collapse} transition={{ duration: 0.25 }} className="flex items-center gap-0.5 overflow-hidden whitespace-nowrap">
                  {navItems.map((item) => (
                    <button key={item.id} onClick={() => scrollToSection(item.id)} className={linkClass(activeSection === item.id)}>
                      {item.label}
                    </button>
                  ))}
                  <a href="/blog" className={linkClass(activeSection === 'blog')}>Blog</a>
                  <a href="/statement" className={linkClass(activeSection === 'statement')}>Statement</a>
                  <a href="https://docs.citinet.cloud" target="_blank" rel="noopener noreferrer" className={linkClass(false)}>Docs</a>
                  <span className="mx-1.5 h-5 w-px bg-border" aria-hidden />
                  <a href="https://github.com/fergtech/citinet" target="_blank" rel="noopener noreferrer" className={iconBtn} aria-label="View on GitHub">
                    <Github className="h-4 w-4" />
                  </a>
                </motion.div>
              ) : (
                <motion.div key="compact" {...collapse} transition={{ duration: 0.25 }} className="flex items-center gap-0.5 overflow-hidden whitespace-nowrap">
                  <span className="px-3 text-sm text-foreground">{currentLabel}</span>
                  <button onClick={() => setIsOpen(!isOpen)} className={iconBtn} aria-label="Menu" aria-expanded={isOpen}>
                    {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            <button onClick={toggleTheme} className={iconBtn} aria-label="Toggle theme">
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              onClick={() => scrollToSection('cta')}
              className={`ml-1 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition-[height,colors] duration-300 hover:bg-primary/90 ${compact ? 'h-8' : 'h-9'}`}
            >
              Start a Hub
            </button>
          </div>

          {/* Mobile */}
          <div className={`${pillBase} ${h} gap-0.5 px-1.5 lg:hidden`}>
            <button onClick={toggleTheme} className={iconBtn} aria-label="Toggle theme">
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className={iconBtn} aria-label="Menu" aria-expanded={isOpen}>
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className={`pointer-events-auto absolute right-0 w-[min(20rem,calc(100vw-2rem))] rounded-3xl border border-foreground/10 bg-background/70 p-2 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_16px_48px_-16px_rgba(0,0,0,0.5)] backdrop-blur-xl backdrop-saturate-150 ${
                  compact ? 'top-12' : 'top-14'
                }`}
              >
                {navItems.map((item) => (
                  <button key={item.id} onClick={() => scrollToSection(item.id)} className={mobileLinkClass(activeSection === item.id)}>
                    {item.label}
                  </button>
                ))}
                <a href="/blog" className={mobileLinkClass(activeSection === 'blog')}>Blog</a>
                <a href="/statement" className={mobileLinkClass(activeSection === 'statement')}>Statement</a>
                <a href="https://docs.citinet.cloud" target="_blank" rel="noopener noreferrer" className={mobileLinkClass(false)}>Docs</a>
                <a href="https://github.com/fergtech/citinet" target="_blank" rel="noopener noreferrer" className={mobileLinkClass(false)}>GitHub</a>
                <button
                  onClick={() => scrollToSection('cta')}
                  className="mt-2 h-11 w-full rounded-full bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Start a Hub
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>

      {/* Back to top: appears once you are well past the hero */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            key="back-to-top"
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.9 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={toTop}
            aria-label="Back to top"
            className="pointer-events-auto fixed bottom-5 right-4 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-foreground/10 bg-background/40 text-foreground shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_8px_32px_-12px_rgba(0,0,0,0.4)] backdrop-blur-xl backdrop-saturate-150 transition-colors hover:bg-background/70 sm:right-8 xl:bottom-8 xl:right-[52px]"
          >
            <ArrowUp className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
