import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ChevronDown, Home, Layers, HeartHandshake, MapPin, Store, Users } from 'lucide-react';

// Mirrors the hub-type presets in the setup wizard (HOA, Group,
// Neighborhood Watch, Local Marketplace / Interest Club). Every feature chip
// below is something a hub does today.
type UseCase = {
  title: string;
  /** Short mono label that sticks to the title while it is hovered. */
  tag: string;
  text: string;
  chips: string[];
  Icon: React.ElementType;
  image: string;
  imageAlt: string;
};

const USE_CASES: UseCase[] = [
  {
    title: 'HOAs & boards',
    tag: 'votes on the record',
    text: 'Announcements, shared documents, and polls for associations and boards, with a public record of what was decided and who did what.',
    chips: ['Decisions', 'Files', 'Feed'],
    Icon: Home,
    image: '/imgs/files/Screenshot 2026-05-08 194515.png',
    imageAlt: 'Shared files on a hub',
  },
  {
    title: 'Tenant unions',
    tag: 'tasks with owners',
    text: 'Tenant unions and co-ops organize around shared projects with tasks, assignees, and due dates, and give each committee or working group its own Space.',
    chips: ['Projects', 'Spaces', 'Communications'],
    Icon: Users,
    image: '/imgs/spaces/Screenshot 2026-05-08 195550.png',
    imageAlt: 'A Space inside a hub',
  },
  {
    title: 'Clubs & groups',
    tag: 'a space per group',
    text: 'Every club, team, or congregation gets a Space with its own feed and members, plus events and RSVPs.',
    chips: ['Spaces', 'Events', 'Feed'],
    Icon: Layers,
    image: '/imgs/discussion-feed/Screenshot 2026-05-08 194537.png',
    imageAlt: 'A community feed',
  },
  {
    title: 'Neighborhoods',
    tag: 'alerts on a shared map',
    text: 'Neighborhood watch and block groups pin alerts and meetup spots on a shared map, with messaging and a feed your neighbors actually see.',
    chips: ['Atlas', 'Communications', 'Feed'],
    Icon: MapPin,
    image: '/imgs/Atlas/Screenshot 2026-05-08 194919.png',
    imageAlt: 'The community Atlas map',
  },
  {
    title: 'Mutual aid',
    tag: 'offers and needs, mapped',
    text: 'Post what you can offer and what you need, find each other on the map, and arrange it by direct message, with no platform in between.',
    chips: ['Atlas', 'Marketplace', 'Communications'],
    Icon: HeartHandshake,
    image: '/imgs/Atlas/Screenshot 2026-05-08 194958.png',
    imageAlt: 'Resources pinned on the Atlas',
  },
  {
    title: 'Marketplaces',
    tag: 'no platform fees',
    text: 'Let neighbors trade goods and services without platform fees, and message each other directly.',
    chips: ['Marketplace', 'Communications'],
    Icon: Store,
    image: '/imgs/marketplace/Screenshot 2026-05-08 194834.png',
    imageAlt: 'The local marketplace',
  },
];

export function MovementStatement() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="movement" ref={ref} className="relative py-20 bg-background border-t border-border">
      <div className="max-w-[1248px] mx-auto px-6">
        <div className="max-w-2xl mb-12">
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-4">What it's for</p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-3 leading-tight">
            Run your group's business in one place.
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Most groups juggle a group chat, a shared drive, a Facebook page, and a spreadsheet. A hub replaces the pile with one home your members already know how to open: a web address.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <HoverList />
          <Accordion />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="text-sm text-muted-foreground max-w-2xl mt-14"
        >
          Because the hub runs on hardware your group controls, there are no ads, no hidden ranking (anything highlighted says why), and no platform that can change the rules or shut it down.
        </motion.p>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Desktop: hover (or focus) a title, a label sticks to it and a line is drawn
// to a preview card that swaps its content.
// ---------------------------------------------------------------------------

type Curve = { sx: number; sy: number; ex: number; ey: number };

function HoverList() {
  const [active, setActive] = useState(0);
  const [curve, setCurve] = useState<Curve | null>(null);
  const reduceMotion = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const chipRef = useRef<HTMLSpanElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const measure = useCallback(() => {
    const wrap = wrapRef.current;
    const chip = chipRef.current;
    const card = cardRef.current;
    if (!wrap || !chip || !card) return;
    const w = wrap.getBoundingClientRect();
    const c = chip.getBoundingClientRect();
    const k = card.getBoundingClientRect();
    setCurve({
      sx: c.right - w.left + 6,
      sy: c.top - w.top + c.height / 2,
      ex: k.left - w.left - 6,
      ey: k.top - w.top + k.height / 2,
    });
  }, []);

  useLayoutEffect(() => { measure(); }, [active, measure]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    window.addEventListener('resize', measure);
    return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
  }, [measure]);

  const d = curve
    ? (() => {
        const dx = Math.max(0, (curve.ex - curve.sx) * 0.5);
        return `M ${curve.sx} ${curve.sy} C ${curve.sx + dx} ${curve.sy}, ${curve.ex - dx} ${curve.ey}, ${curve.ex} ${curve.ey}`;
      })()
    : '';

  return (
    <div
      ref={wrapRef}
      className="relative hidden lg:grid grid-cols-[minmax(0,1fr)_clamp(26rem,36vw,43rem)] gap-x-12 items-center min-h-[28rem]"
    >
      <ul className="flex flex-col">
        {USE_CASES.map((c, i) => {
          const on = i === active;
          return (
            <li key={c.title}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                aria-current={on}
                className="group flex items-baseline text-left py-0.5 outline-none cursor-default"
              >
                <span
                  className={`whitespace-nowrap text-[length:clamp(2.5rem,3.02vw,3.625rem)] leading-[1.04] tracking-[-0.035em] transition-[color,font-weight,font-style] duration-200 ${
                    on
                      ? 'italic font-semibold text-foreground'
                      : 'font-light text-muted-foreground/60 group-focus-visible:text-foreground'
                  }`}
                >
                  {c.title}
                </span>
                {on && (
                  <motion.span
                    ref={chipRef}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: reduceMotion ? 0 : 0.2 }}
                    className="-ml-24 translate-y-4 self-end whitespace-nowrap rounded-full bg-blue-600 px-3.5 py-1.5 font-mono text-xs text-white shadow-lg shadow-blue-600/30"
                  >
                    {c.tag}
                  </motion.span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      <div ref={cardRef} className="h-[clamp(19rem,20.5vw,24.625rem)]">
        <AnimatePresence mode="wait" initial={false}>
          <PreviewCard key={active} c={USE_CASES[active]} fixedHeight />
        </AnimatePresence>
      </div>

      {curve && (
        <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible text-foreground" aria-hidden>
          <motion.path
            key={active}
            d={d}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.25}
            initial={reduceMotion ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          />
          <circle cx={curve.sx} cy={curve.sy} r={3} fill="currentColor" />
          <circle cx={curve.ex} cy={curve.ey} r={3} fill="currentColor" />
        </svg>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Touch / narrow screens: no hover, so tap a title to open its card.
// ---------------------------------------------------------------------------

function Accordion() {
  const [open, setOpen] = useState(0);

  return (
    <div className="lg:hidden border-y border-border divide-y divide-border">
      {USE_CASES.map((c, i) => {
        const on = i === open;
        return (
          <div key={c.title}>
            <button
              type="button"
              aria-expanded={on}
              onClick={() => setOpen(on ? -1 : i)}
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
            >
              <span className={`text-3xl tracking-[-0.03em] ${on ? 'italic font-semibold text-foreground' : 'font-light text-muted-foreground'}`}>
                {c.title}
              </span>
              <ChevronDown className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${on ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence initial={false}>
              {on && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="pb-5">
                    <span className="mb-3 inline-block rounded-full bg-blue-600 px-3 py-1 font-mono text-[11px] text-white">{c.tag}</span>
                    <PreviewCard c={c} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// The card both layouts share
// ---------------------------------------------------------------------------

function PreviewCard({ c, fixedHeight = false }: { c: UseCase; fixedHeight?: boolean }) {
  const { Icon } = c;
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.18 }}
      className={`flex flex-col gap-2 rounded-[30px] border border-border bg-card p-[9px] shadow-sm sm:flex-row ${fixedHeight ? 'h-full' : ''}`}
    >
      <div className="flex h-56 items-center justify-center overflow-hidden rounded-[21px] bg-muted sm:h-auto sm:w-[45%] sm:shrink-0">
        <img
          src={c.image}
          alt={c.imageAlt}
          loading="lazy"
          draggable={false}
          className="h-full w-full object-contain p-3"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col px-6 pb-6 pt-[30px]">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-muted">
          <Icon className="h-6 w-6 text-foreground" strokeWidth={1.25} />
        </div>
        <p className="text-[17px] leading-[1.38] tracking-[-0.012em] text-foreground">{c.text}</p>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
          {c.chips.map((chip) => (
            <span key={chip} className="rounded-full border border-border px-2.5 py-1.5 text-xs leading-none tracking-[0.01em] text-muted-foreground">
              {chip}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
