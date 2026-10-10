import { motion, AnimatePresence, useInView } from 'motion/react';
import { FeaturesJourney } from './FeaturesJourney';
import { useRef, useState, useEffect } from 'react';
import {
  HardDrive, Radio, MessageCircle, ShoppingBag, Map, Users, Cpu, Layers,
  Wifi, Search, Fingerprint, Puzzle,
  WifiOff, Antenna, Sparkles, ArrowRight, X, ChevronLeft, ChevronRight,
  Network, BookOpen, Home, Flower2, Building2,
  Target, PackageOpen, Smartphone, NotebookPen, ArrowUpRight,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Feature detail data
// ---------------------------------------------------------------------------

type FeatureStatus = 'live' | 'building' | 'vision';

interface SpaceExample {
  icon: React.ElementType;
  name: string;
  description: string;
}

interface FeatureDetail {
  Icon: React.ElementType;
  status: FeatureStatus;
  description: string;
  images?: string[];
  examples?: SpaceExample[];
  cta?: { label: string; href: string };
}

const SPACES_EXAMPLES: SpaceExample[] = [
  {
    icon: BookOpen,
    name: 'Library',
    description: 'Shared resources, digital archives, community knowledge',
  },
  {
    icon: Home,
    name: 'Commons',
    description: 'Town square for announcements and community decisions',
  },
  {
    icon: Flower2,
    name: 'Garden Club',
    description: 'Coordinate plantings, share seeds, organize work parties',
  },
  {
    icon: Building2,
    name: 'Neighborhood Assoc.',
    description: 'HOA documents, event planning, neighbor networking',
  },
  {
    icon: Users,
    name: 'Your Space',
    description: 'Create any space your community needs',
  },
];

const FEATURE_DETAILS: Record<string, FeatureDetail> = {
  // Phase 1: Live
  'File Storage': {
    Icon: HardDrive,
    status: 'live',
    description: 'Upload files to your hub and set each one as public or private. Your community can access, download, and share them, and you can save items to your account to find them on any device. Private file contents are encrypted in your browser and stored on your hardware, never in a cloud service.',
    images: ['/imgs/files/Screenshot 2026-05-08 194515.png'],
    cta: { label: 'Try it on your hub', href: 'https://citinet.cloud/create' },
  },
  'Community Engagement': {
    Icon: Radio,
    status: 'live',
    description: 'Everything a community does together. The feed carries announcements, discussions, proposals and requests: posts you haven\'t read come first, then newest, or switch to plain newest-first, with no engagement-maximising algorithm and no ads. Events have dates, places and RSVPs. Decisions are polls with a record everyone can see, plus roles and a moderation log so a decision can\'t quietly get buried. Resources is a shared directory of open-source, privacy-respecting tools that residents add. Local news appears only if your admin adds it and you switch it on.',
    images: [
      '/imgs/discussion-feed/Screenshot 2026-05-08 194537.png',
      '/imgs/discussion-feed/Screenshot 2026-05-08 194554.png',
      '/imgs/discussion-feed/Screenshot 2026-05-08 194610.png',
      '/imgs/discussion-feed/Screenshot 2026-05-08 194641.png',
    ],
    cta: { label: 'See it in action', href: 'https://citinet.cloud/create' },
  },
  'Communications': {
    Icon: MessageCircle,
    status: 'live',
    description: 'Direct and group messages with full-history search and file attachments, end-to-end encrypted in your browser so the hub stores only ciphertext. Add one-to-one voice and video calls and live broadcasts to the whole hub. Calls and broadcasts run on LiveKit, an open-source media server on your own hardware, and are an opt-in when a hub is created because they open extra media ports. Group calls are not built yet.',
    images: [
      '/imgs/messages/Screenshot 2026-05-08 194710.png',
      '/imgs/messages/Screenshot 2026-05-08 194731.png',
      '/imgs/messages/Screenshot 2026-05-08 194753.png',
    ],
    cta: { label: 'Try it on your hub', href: 'https://citinet.cloud/create' },
  },
  'Notes': {
    Icon: NotebookPen,
    status: 'live',
    description: 'A rich-text notebook for each member. Keep a note private (end-to-end encrypted in your browser), share it with your hub, or publish it to the web and the community blog. Edits to a published note update the public copy automatically.',
    cta: { label: 'Try it on your hub', href: 'https://citinet.cloud/create' },
  },
  'Local Marketplace': {
    Icon: ShoppingBag,
    status: 'live',
    description: 'List goods and services, browse what neighbors offer, trade or sell. No platform fees. No algorithmic promotion. Your community exchanging value directly.',
    images: [
      '/imgs/marketplace/Screenshot 2026-05-08 194834.png',
      '/imgs/marketplace/Screenshot 2026-05-08 194850.png',
    ],
    cta: { label: 'Try it on your hub', href: 'https://citinet.cloud/create' },
  },
  'Community Atlas': {
    Icon: Map,
    status: 'live',
    description: 'A shared map built on OpenStreetMap. Pin meetup spots, safety alerts, and points of interest. Everyone contributes, nobody controls it. No Google required.',
    images: [
      '/imgs/Atlas/Screenshot 2026-05-08 194919.png',
      '/imgs/Atlas/Screenshot 2026-05-08 194929.png',
      '/imgs/Atlas/Screenshot 2026-05-08 194958.png',
      '/imgs/Atlas/Screenshot 2026-05-08 195028.png',
      '/imgs/Atlas/Screenshot 2026-05-08 195036.png',
    ],
    cta: { label: 'Try it on your hub', href: 'https://citinet.cloud/create' },
  },
  'Member Profiles': {
    Icon: Users,
    status: 'live',
    description: 'See who is on your hub. Browse profiles, find neighbors, and connect. No algorithmic feed deciding who you see or how often.',
    images: [
      '/imgs/user-profiles/Screenshot 2026-05-08 195239.png',
      '/imgs/user-profiles/Screenshot 2026-05-08 195252.png',
      '/imgs/user-profiles/Screenshot 2026-05-08 195306.png',
    ],
    cta: { label: 'Try it on your hub', href: 'https://citinet.cloud/create' },
  },
  'AI Assistant': {
    Icon: Cpu,
    status: 'live',
    description: "An AI assistant built into your hub, not a third-party cloud. Helps you draft posts, summarize discussions, and answer questions about your community. Unlike your messages and notes, it isn't end-to-end encrypted. It has to read what you type to respond.",
    images: [
      '/imgs/AI-assistant/Screenshot 2026-05-08 195416.png',
      '/imgs/AI-assistant/Screenshot 2026-05-08 195426.png',
      '/imgs/AI-assistant/Screenshot 2026-05-08 195524.png',
    ],
    cta: { label: 'Try it on your hub', href: 'https://citinet.cloud/create' },
  },
  'Spaces': {
    Icon: Layers,
    status: 'live',
    description: 'Sub-communities within your hub. A city hub could have a Space for your block, your gardening group, or your local association. Each Space has its own feed and members.',
    images: ['/imgs/spaces/Screenshot 2026-05-08 195550.png'],
    examples: SPACES_EXAMPLES,
    cta: { label: 'Try it on your hub', href: 'https://citinet.cloud/create' },
  },
  'Projects': {
    Icon: Target,
    status: 'live',
    description: 'Organize shared work as projects with tasks, assignees, due dates, and progress updates that members can comment on. Useful for committees, work parties, and anything a group needs to get done together.',
    cta: { label: 'Try it on your hub', href: 'https://citinet.cloud/create' },
  },
  'Export & Portability': {
    Icon: PackageOpen,
    status: 'live',
    description: 'Download your own data as a zip, all of it or just parts like files, messages, notes, or map pins, decrypted on your device. To switch hubs, export one encrypted account package with your data and encryption keys and import it on the new hub. You choose what comes along.',
    cta: { label: 'Try it on your hub', href: 'https://citinet.cloud/create' },
  },
  // Phase 2: Building
  'Hub-to-Hub Federation': {
    Icon: Network,
    status: 'building',
    description: 'In development. Multiple hubs will be able to share selected content with each other. A marketplace listing on one hub could appear on another. Announcements could cross hub boundaries when communities choose to connect.',
  },
  'Hub Discovery': {
    Icon: Search,
    status: 'building',
    description: 'Partially live. Hubs register themselves in a public directory, and you can browse it or enter a hub\'s address directly when joining. Phones can also detect hubs on the same network automatically. A richer discovery experience is still in development.',
    images: ['/imgs/hub-discovery/Screenshot 2026-05-08 203048.png'],
  },
  'Portable Identity': {
    Icon: Fingerprint,
    status: 'building',
    description: 'Partially live. You can already move your account between hubs with an encrypted account package. Still in development: an identity that follows you automatically, with no export and import step.',
  },
  'Open App Ecosystem': {
    Icon: Puzzle,
    status: 'live',
    description: 'Third-party apps plug into a hub through an open contract. No platform permission needed. No revenue share. The ecosystem is young, and more integrations are on the way.',
  },
  'Mobile App': {
    Icon: Smartphone,
    status: 'building',
    description: 'A native iOS and Android companion app for hubs, covering the feed, messages, calls, Atlas, files, marketplace, and Projects.',
  },
  // Phase 3: Vision
  'No ISP Needed': {
    Icon: WifiOff,
    status: 'vision',
    description: 'The goal, with a first step already built. Anyone on a hub\'s local network can reach it over trusted HTTPS, and a dedicated access point can serve guests who have no internet of their own. The vision is a full signal path with no internet service provider in the middle.',
  },
  'Rooftop Antennas': {
    Icon: Antenna,
    status: 'vision',
    description: 'The goal. Community wireless co-ops use rooftop point-to-point antennas to create neighborhood-scale backhaul. Citinet hubs are designed to run on top of exactly this kind of infrastructure.',
  },
  'Community Access Points': {
    Icon: Wifi,
    status: 'vision',
    description: 'The goal. Sector antennas serve dozens of nearby homes, just like public Wi-Fi but community-run and community-funded. No ISP contract. No terms of service designed for extraction.',
  },
  'Graceful Degradation': {
    Icon: Sparkles,
    status: 'vision',
    description: 'Designed in from the start. As connectivity improves, Citinet scales up. During a storm or outage, it steps down gracefully through whatever modes are still available. The community keeps functioning.',
  },
};


const STATUS_LABELS: Record<FeatureStatus, string> = {
  live: 'Live Now',
  building: 'In Development',
  vision: 'The Vision',
};

const STATUS_CLASSES: Record<FeatureStatus, string> = {
  live: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
  building: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
  vision: 'bg-muted text-muted-foreground border-border',
};

const BADGE = 'inline-flex items-center px-2 py-0.5 rounded-md border font-mono text-[11px] uppercase tracking-wide';

// ---------------------------------------------------------------------------
// Lightbox: full-screen image view, Escape closes only this layer
// ---------------------------------------------------------------------------

function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopImmediatePropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-4 cursor-zoom-out"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      onClick={onClose}
    >
      <motion.img
        src={src}
        alt="Screenshot enlarged"
        className="max-w-full max-h-full object-contain rounded-lg cursor-default"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        onClick={(e) => e.stopPropagation()}
        draggable={false}
      />
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors"
        aria-label="Close"
      >
        <X className="w-5 h-5" />
      </button>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Image gallery: swipeable, dot-indexed, click-to-enlarge
// ---------------------------------------------------------------------------

function ImageGallery({ images, featureName }: { images: string[]; featureName: string }) {
  const [active, setActive] = useState(0);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollTo = (i: number) => {
    scrollRef.current?.scrollTo({ left: i * scrollRef.current.offsetWidth, behavior: 'smooth' });
    setActive(i);
  };

  const onScroll = () => {
    if (!scrollRef.current) return;
    setActive(Math.round(scrollRef.current.scrollLeft / scrollRef.current.offsetWidth));
  };

  const arrow = 'hidden md:flex absolute top-1/2 -translate-y-1/2 z-10 w-7 h-7 items-center justify-center rounded-md bg-background/90 border border-border text-foreground hover:bg-muted transition-colors';

  return (
    <>
      <div className="relative bg-muted border-b border-border">
        <div
          ref={scrollRef}
          onScroll={onScroll}
          className="flex overflow-x-auto snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
        >
          {images.map((src, i) => (
            <div
              key={i}
              className="shrink-0 w-full snap-center cursor-zoom-in"
              onClick={() => setLightboxSrc(src)}
              title="Click to enlarge"
            >
              <img
                src={src}
                alt={`${featureName} screenshot ${i + 1}`}
                className="w-full h-64 md:h-96 object-contain"
                draggable={false}
              />
            </div>
          ))}
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={() => scrollTo(Math.max(0, active - 1))}
              aria-label="Previous"
              className={`${arrow} left-2 ${active === 0 ? 'opacity-30 pointer-events-none' : ''}`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollTo(Math.min(images.length - 1, active + 1))}
              aria-label="Next"
              className={`${arrow} right-2 ${active === images.length - 1 ? 'opacity-30 pointer-events-none' : ''}`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {images.length > 1 && (
          <div className="absolute bottom-2.5 left-0 right-0 flex justify-center gap-1.5 pointer-events-none">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                aria-label={`Screenshot ${i + 1}`}
                className={`w-1.5 h-1.5 rounded-full transition-colors pointer-events-auto ${
                  i === active ? 'bg-foreground' : 'bg-foreground/25 hover:bg-foreground/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {lightboxSrc && (
          <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

// ---------------------------------------------------------------------------
// Feature panel: modal on desktop, bottom drawer on mobile
// ---------------------------------------------------------------------------

function PanelContent({ featureKey, detail, onClose }: {
  featureKey: string;
  detail: FeatureDetail;
  onClose: () => void;
}) {
  const { Icon } = detail;
  const hasImages = detail.images && detail.images.length > 0;
  const closeBtn = 'absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-md bg-background/90 border border-border text-muted-foreground hover:text-foreground transition-colors';

  return (
    <>
      {hasImages ? (
        <div className="relative shrink-0">
          <ImageGallery images={detail.images!} featureName={featureKey} />
          <button onClick={onClose} className={closeBtn} aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="relative h-36 bg-muted border-b border-border flex items-center justify-center shrink-0">
          <Icon className="w-10 h-10 text-muted-foreground" strokeWidth={1.25} />
          <button onClick={onClose} className={closeBtn} aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-6">
        <span className={`${BADGE} mb-4 ${STATUS_CLASSES[detail.status]}`}>
          {STATUS_LABELS[detail.status]}
        </span>
        <h3 className="text-lg font-semibold tracking-tight text-foreground mb-2">{featureKey}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-6">{detail.description}</p>

        {detail.examples && detail.examples.length > 0 && (
          <div className="mb-6">
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-3">Example Spaces</p>
            <div
              className="flex gap-2 overflow-x-auto pb-1"
              style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
            >
              {detail.examples.map((ex) => {
                const ExIcon = ex.icon;
                return (
                  <div
                    key={ex.name}
                    className="rounded-md overflow-hidden border border-border bg-card shrink-0 w-36"
                  >
                    <div className="h-14 border-b border-border bg-muted flex items-center justify-center">
                      <ExIcon className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
                    </div>
                    <div className="p-2.5">
                      <p className="text-foreground text-xs font-medium leading-tight">{ex.name}</p>
                      <p className="text-muted-foreground text-[11px] leading-snug mt-0.5 line-clamp-2">{ex.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {detail.cta && (
          <a
            href={detail.cta.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 h-9 px-4 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
          >
            {detail.cta.label}
            <ArrowRight className="w-4 h-4" />
          </a>
        )}
      </div>
    </>
  );
}

function FeaturePanel({ featureKey, onClose }: { featureKey: string; onClose: () => void }) {
  const detail = FEATURE_DETAILS[featureKey];
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  if (!detail) return null;

  return (
    <>
      <motion.div
        className="fixed inset-0 z-[55] bg-black/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {isMobile ? (
        <motion.div
          className="fixed bottom-0 left-0 right-0 z-[60] flex flex-col bg-background border-t border-border rounded-t-lg max-h-[85vh] shadow-xl"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          drag="y"
          dragConstraints={{ top: 0 }}
          dragElastic={{ top: 0, bottom: 0.4 }}
          onDragEnd={(_, info) => {
            if (info.offset.y > 80 || info.velocity.y > 400) onClose();
          }}
        >
          <div
            className="flex justify-center pt-3 pb-2 shrink-0 cursor-grab active:cursor-grabbing"
            onClick={onClose}
            title="Tap or drag down to close"
          >
            <div className="w-10 h-1 bg-border rounded-full" />
          </div>
          <PanelContent featureKey={featureKey} detail={detail} onClose={onClose} />
        </motion.div>
      ) : (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6" onClick={onClose}>
          <motion.div
            role="dialog" aria-modal="true"
            className="w-full max-w-xl bg-background border border-border rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
          >
            <PanelContent featureKey={featureKey} detail={detail} onClose={onClose} />
          </motion.div>
        </div>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Phase section
// ---------------------------------------------------------------------------

type Feature = { Icon: React.ElementType; label: string };

interface PhaseSectionProps {
  number: string;
  label: string;
  statusLabel: string;
  statusClass: string;
  headline: string;
  body: string;
  features: Feature[];
  callout?: string;
  note?: React.ReactNode;
  cta?: React.ReactNode;
  onPillClick?: (label: string) => void;
}

function PhaseSection({
  number, label, statusLabel, statusClass,
  headline, body, features, callout, note, cta, onPillClick,
}: PhaseSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="py-12 first:pt-0 last:pb-0"
    >
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span className="font-mono text-xs text-muted-foreground">PHASE 0{number}</span>
        <span className="text-muted-foreground">/</span>
        <span className="font-mono text-xs text-muted-foreground">{label}</span>
        <span className={`${BADGE} ${statusClass}`}>{statusLabel}</span>
      </div>

      <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-3 leading-tight">{headline}</h3>
      <p className="text-base text-muted-foreground max-w-2xl mb-6 leading-relaxed">{body}</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {features.map(({ Icon, label: fl }) => (
          <button
            key={fl}
            type="button"
            onClick={() => onPillClick?.(fl)}
            className={`inline-flex items-center gap-2 h-9 px-3 bg-card border border-border rounded-md text-sm text-foreground transition-colors ${onPillClick ? 'cursor-pointer hover:bg-muted' : 'cursor-default'}`}
          >
            <Icon className="w-4 h-4 text-muted-foreground shrink-0" strokeWidth={1.5} />
            {fl}
          </button>
        ))}
      </div>

      {callout && (
        <div className="border-l-2 border-border pl-4 py-1 text-muted-foreground text-sm leading-relaxed mb-6 max-w-2xl">
          {callout}
        </div>
      )}

      {note && <div className="mb-6">{note}</div>}
      {cta}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function SpacesShowcase() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, amount: 0.3 });
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  // Every screen gets the scroll-driven journey once it loads: wide screens get the two-column version, phones
  // get a pinned visual with one caption per scroll step (see FeaturesJourney). The plain list below is what
  // renders on the server and before scripts run.
  const [journey, setJourney] = useState(false);
  useEffect(() => setJourney(true), []);

  const precedentNote = (
    <div className="grid items-start gap-10 border-t border-border pt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-20">
      <div>
        <p className="mb-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">The precedent</p>
        <h3 className="text-[length:clamp(1.75rem,2.4vw,2.25rem)] font-light leading-[1.1] tracking-[-0.03em] text-foreground">
          This has been done before.
        </h3>
        <p className="mt-5 max-w-xl text-[17px] leading-[1.45] tracking-[-0.012em] text-muted-foreground">
          Rural electric co-ops brought power to communities that private utilities ignored. They organized, pooled resources, and built it themselves. Community wireless networks are doing the same for internet access today.
        </p>
      </div>
      <div>
        <p className="mb-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">Further reading</p>
        <ul className="divide-y divide-border border-y border-border">
          {[
            ['https://www.electric.coop/our-organization/history', 'NRECA: Rural Co-op History', 'electric.coop'],
            ['https://www.nycmesh.net', 'NYC Mesh', 'nycmesh.net'],
            ['https://detroitcommunitytech.org', 'Detroit Community Technology Project', 'detroitcommunitytech.org'],
          ].map(([href, title, host]) => (
            <li key={href}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-4 py-4 transition-colors"
              >
                <span className="min-w-0">
                  <span className="block text-[15px] text-foreground">{title}</span>
                  <span className="block font-mono text-xs text-muted-foreground">{host}</span>
                </span>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <section id="phases" className="relative py-20 bg-background border-t border-border">
      <div className="max-w-[1248px] mx-auto px-6">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 8 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-14 max-w-2xl"
        >
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-4">Features &amp; roadmap</p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-3 leading-tight">
            What's built. <span className="text-muted-foreground">What's next.</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            From a single hub to a fully citizens-owned digital network infrastructure.
          </p>
        </motion.div>

        {!journey && (
        <div className="divide-y divide-border">

          <PhaseSection
            number="1"
            label="The Hub"
            statusLabel="Live Now"
            statusClass={STATUS_CLASSES.live}
            headline="Announcements, decisions and files in one place."
            body="One organizer runs the hub on any computer. Members open a browser and sign up, no app required. Everything is stored on your group's hardware, not in a data center."
            features={[
              { Icon: HardDrive,     label: 'File Storage' },
              { Icon: Radio,         label: 'Community Engagement' },
              { Icon: Target,        label: 'Projects' },
              { Icon: MessageCircle, label: 'Communications' },
              { Icon: ShoppingBag,   label: 'Local Marketplace' },
              { Icon: Map,           label: 'Community Atlas' },
              { Icon: Users,         label: 'Member Profiles' },
              { Icon: Cpu,           label: 'AI Assistant' },
              { Icon: Layers,        label: 'Spaces' },
              { Icon: NotebookPen,   label: 'Notes' },
              { Icon: PackageOpen,   label: 'Export & Portability' },
            ]}
            callout="Outside content is optional: local news and public posts your admin chooses, shown only if you switch it on. No sponsored content, no ads, and anything highlighted says why."
            onPillClick={setSelectedFeature}
            cta={
              <a
                href="https://citinet.cloud"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 h-9 px-4 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
              >
                Start a Hub
                <ArrowRight className="w-4 h-4" />
              </a>
            }
          />

          <PhaseSection
            number="2"
            label="The Network"
            statusLabel="In Development"
            statusClass={STATUS_CLASSES.building}
            headline="Next: hubs that work together."
            body="Parts of this have shipped: a hub directory, nearby discovery, an open app contract, and moving your account between hubs. Sharing content between hubs is what is still being built."
            features={[
              { Icon: Network,     label: 'Hub-to-Hub Federation' },
              { Icon: Search,      label: 'Hub Discovery' },
              { Icon: Fingerprint, label: 'Portable Identity' },
              { Icon: Puzzle,      label: 'Open App Ecosystem' },
              { Icon: Smartphone,  label: 'Mobile App' },
            ]}
            onPillClick={setSelectedFeature}
          />

          <PhaseSection
            number="3"
            label="The Infrastructure"
            statusLabel="The Vision"
            statusClass={STATUS_CLASSES.vision}
            headline="The long game: no ISP in the middle."
            body="Connect directly to a hub via its local network. No World Wide Web needed. Then go further: rooftop antennas, community access points, internet that belongs to your block."
            features={[
              { Icon: WifiOff,  label: 'No ISP Needed' },
              { Icon: Antenna,  label: 'Rooftop Antennas' },
              { Icon: Wifi,     label: 'Community Access Points' },
              { Icon: Sparkles, label: 'Graceful Degradation' },
            ]}
            onPillClick={setSelectedFeature}
            note={precedentNote}
          />
        </div>
        )}
      </div>

      {journey && (
        <>
          <FeaturesJourney onOpenFeature={setSelectedFeature} />
          <div className="relative z-10 mx-auto -mt-[16vh] max-w-[1248px] px-6">{precedentNote}</div>
        </>
      )}

      <AnimatePresence>
        {selectedFeature && (
          <FeaturePanel
            key={selectedFeature}
            featureKey={selectedFeature}
            onClose={() => setSelectedFeature(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
