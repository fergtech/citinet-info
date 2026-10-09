import { AnimatePresence, motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Menu, X, Github, Sun, Moon } from 'lucide-react';

// Two separate floating pieces, like the site this was modelled on: the brand sits in the top-left
// corner on its own, and the links live in a pill in the top-right corner. Nothing spans the page.
export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isDark, setIsDark] = useState(false);

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

  useEffect(() => {
    // On blog pages there are no scroll-tracked sections. Highlight Blog instead.
    if (isBlogPage) {
      setActiveSection('blog');
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
  }, [isBlogPage]);

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
  const pill = 'pointer-events-auto flex h-12 items-center rounded-full border border-foreground/10 bg-background/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_8px_32px_-12px_rgba(0,0,0,0.4)] backdrop-blur-xl backdrop-saturate-150';
  const linkClass = (active: boolean) =>
    `rounded-full px-4 py-2 text-[15px] tracking-[0.04em] transition-colors ${
      active ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'
    }`;
  const mobileLinkClass = (active: boolean) =>
    `block w-full rounded-xl px-4 py-3 text-left text-base transition-colors ${
      active ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
    }`;
  const iconBtn = 'flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground';

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-start justify-between px-4 pt-4 sm:px-8 xl:px-[52px] xl:pt-6">
      {/* Brand: logo and name (just the logo on small screens) */}
      <button
        onClick={() => scrollToSection('hero')}
        aria-label="Citinet, back to the top"
        className={`${pill} min-w-12 justify-center gap-2.5 sm:justify-start sm:pl-3.5 sm:pr-5`}
      >
        <img src="/imgs/logo/logo.png" alt="" className="h-6 w-auto invert dark:invert-0" />
        <span className="hidden text-[15px] font-semibold tracking-tight text-foreground sm:inline">Citinet</span>
        <span className="hidden border-l border-border pl-2.5 font-mono text-[11px] text-muted-foreground xl:inline">
          Citizens' Internet Project
        </span>
      </button>

      {/* Links and actions */}
      <nav aria-label="Primary" className="relative">
        {/* Desktop */}
        <div className={`${pill} hidden gap-0.5 pl-2 pr-1.5 lg:flex`}>
          {navItems.map((item) => (
            <button key={item.id} onClick={() => scrollToSection(item.id)} className={linkClass(activeSection === item.id)}>
              {item.label}
            </button>
          ))}
          <a href="/blog" className={linkClass(activeSection === 'blog')}>Blog</a>
          <a href="https://docs.citinet.cloud" target="_blank" rel="noopener noreferrer" className={linkClass(false)}>Docs</a>
          <span className="mx-1.5 h-5 w-px bg-border" aria-hidden />
          <a href="https://github.com/fergtech/citinet" target="_blank" rel="noopener noreferrer" className={iconBtn} aria-label="View on GitHub">
            <Github className="h-4 w-4" />
          </a>
          <button onClick={toggleTheme} className={iconBtn} aria-label="Toggle theme">
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            onClick={() => scrollToSection('cta')}
            className="ml-1 h-9 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Start a Hub
          </button>
        </div>

        {/* Mobile */}
        <div className={`${pill} gap-0.5 px-1.5 lg:hidden`}>
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
              className="pointer-events-auto absolute right-0 top-14 w-[min(20rem,calc(100vw-2rem))] rounded-3xl border border-foreground/10 bg-background/70 p-2 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_16px_48px_-16px_rgba(0,0,0,0.5)] backdrop-blur-xl backdrop-saturate-150 lg:hidden"
            >
              {navItems.map((item) => (
                <button key={item.id} onClick={() => scrollToSection(item.id)} className={mobileLinkClass(activeSection === item.id)}>
                  {item.label}
                </button>
              ))}
              <a href="/blog" className={mobileLinkClass(activeSection === 'blog')}>Blog</a>
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
  );
}
