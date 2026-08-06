import { motion, AnimatePresence, useInView } from 'motion/react';
import { useRef, useState, useEffect } from 'react';
import {
  HardDrive, Radio, MessageCircle, ShoppingBag, Map, Users, Cpu, Layers,
  Wifi, Search, Fingerprint, Puzzle,
  WifiOff, Antenna, Sparkles, ArrowRight, X, ChevronLeft, ChevronRight,
  Network, BookOpen, Home, Flower2, GraduationCap, Building2,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Feature detail data
// ---------------------------------------------------------------------------

type FeatureStatus = 'live' | 'building' | 'vision';

interface SpaceExample {
  icon: React.ElementType;
  name: string;
  description: string;
  image: string;
  color: string;
}

interface FeatureDetail {
  Icon: React.ElementType;
  status: FeatureStatus;
  gradient: string;
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
    image: 'https://images.unsplash.com/photo-1768467040905-aa7081a2a8a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWJyYXJ5JTIwYm9va3MlMjBjb21tdW5pdHklMjBzcGFjZXxlbnwxfHx8fDE3NzE2MTk1NjV8MA&ixlib=rb-4.1.0&q=80&w=400',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Home,
    name: 'Commons',
    description: 'Town square for announcements and community decisions',
    image: 'https://images.unsplash.com/photo-1730342582682-1447653f62b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBnYXRoZXJpbmclMjBuZWlnaGJvcmhvb2QlMjBwZW9wbGUlMjBjb2xsYWJvcmF0aW5nfGVufDF8fHx8MTc3MTYxOTU2NXww&ixlib=rb-4.1.0&q=80&w=400',
    color: 'from-emerald-500 to-green-500',
  },
  {
    icon: Flower2,
    name: 'Garden Club',
    description: 'Coordinate plantings, share seeds, organize work parties',
    image: 'https://images.unsplash.com/photo-1763633923615-a2cdebba3bfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBnYXJkZW4lMjB1cmJhbiUyMGZhcm1pbmd8ZW58MXx8fHwxNzcxNTczNjc0fDA&ixlib=rb-4.1.0&q=80&w=400',
    color: 'from-green-500 to-lime-500',
  },
  {
    icon: GraduationCap,
    name: 'School District',
    description: 'Classrooms, assignments, parent communication',
    image: 'https://images.unsplash.com/photo-1574740637579-9ca0a610e491?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZW9wbGUlMjBoYW5kcyUyMHRvZ2V0aGVyJTIwY29sbGFib3JhdGlvbnxlbnwxfHx8fDE3NzE2MTk1Njd8MA&ixlib=rb-4.1.0&q=80&w=400',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Building2,
    name: 'Neighborhood Assoc.',
    description: 'HOA documents, event planning, neighbor networking',
    image: 'https://images.unsplash.com/photo-1770938474403-a16353e18bf3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZWlnaGJvcmhvb2QlMjBzdHJlZXQlMjBhZXJpYWwlMjB2aWV3fGVufDF8fHx8MTc3MTYxOTU2Nnww&ixlib=rb-4.1.0&q=80&w=400',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: Users,
    name: 'Your Space',
    description: 'Create any space your community needs',
    image: 'https://images.unsplash.com/photo-1644088379091-d574269d422f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwbmV0d29yayUyMGNvbm5lY3Rpb24lMjBhYnN0cmFjdHxlbnwxfHx8fDE3NzE2MTk1Njd8MA&ixlib=rb-4.1.0&q=80&w=400',
    color: 'from-violet-500 to-blue-500',
  },
];

const FEATURE_DETAILS: Record<string, FeatureDetail> = {
  // Phase 1: Live
  'File Storage': {
    Icon: HardDrive,
    status: 'live',
    gradient: 'from-blue-600 to-violet-700',
    description: 'Upload files to your hub and set each one as public or private. Your community can access, download, and share them. Stored on your hardware, never in a cloud service.',
    images: ['/imgs/files/Screenshot 2026-05-08 194515.png'],
    cta: { label: 'Try it on your hub', href: 'https://citinet.cloud' },
  },
  'Community Feed': {
    Icon: Radio,
    status: 'live',
    gradient: 'from-violet-600 to-purple-700',
    description: 'A shared space for announcements, discussions, projects, and requests. No algorithm decides what gets seen. No ads. Just what your neighbors post.',
    images: [
      '/imgs/discussion-feed/Screenshot 2026-05-08 194537.png',
      '/imgs/discussion-feed/Screenshot 2026-05-08 194554.png',
      '/imgs/discussion-feed/Screenshot 2026-05-08 194610.png',
      '/imgs/discussion-feed/Screenshot 2026-05-08 194641.png',
    ],
    cta: { label: 'See it in action', href: 'https://citinet.cloud' },
  },
  'Messaging': {
    Icon: MessageCircle,
    status: 'live',
    gradient: 'from-purple-600 to-pink-700',
    description: 'Direct messages and group conversations, all stored on your hub. Private, community-owned, and on hardware you control. No platform reading your messages.',
    images: [
      '/imgs/messages/Screenshot 2026-05-08 194710.png',
      '/imgs/messages/Screenshot 2026-05-08 194731.png',
      '/imgs/messages/Screenshot 2026-05-08 194753.png',
    ],
    cta: { label: 'Try it on your hub', href: 'https://citinet.cloud' },
  },
  'Local Marketplace': {
    Icon: ShoppingBag,
    status: 'live',
    gradient: 'from-emerald-600 to-teal-700',
    description: 'List goods and services, browse what neighbors offer, trade or sell. No platform fees. No algorithmic promotion. Your community exchanging value directly.',
    images: [
      '/imgs/marketplace/Screenshot 2026-05-08 194834.png',
      '/imgs/marketplace/Screenshot 2026-05-08 194850.png',
    ],
    cta: { label: 'Try it on your hub', href: 'https://citinet.cloud' },
  },
  'Community Atlas': {
    Icon: Map,
    status: 'live',
    gradient: 'from-indigo-600 to-blue-700',
    description: 'A shared map built on OpenStreetMap. Pin meetup spots, safety alerts, and points of interest. Everyone contributes, nobody controls it. No Google required.',
    images: [
      '/imgs/Atlas/Screenshot 2026-05-08 194919.png',
      '/imgs/Atlas/Screenshot 2026-05-08 194929.png',
      '/imgs/Atlas/Screenshot 2026-05-08 194958.png',
      '/imgs/Atlas/Screenshot 2026-05-08 195028.png',
      '/imgs/Atlas/Screenshot 2026-05-08 195036.png',
    ],
    cta: { label: 'Try it on your hub', href: 'https://citinet.cloud' },
  },
  'Member Profiles': {
    Icon: Users,
    status: 'live',
    gradient: 'from-blue-600 to-indigo-700',
    description: 'See who is on your hub. Browse profiles, find neighbors, and connect. No algorithmic feed deciding who you see or how often.',
    images: [
      '/imgs/user-profiles/Screenshot 2026-05-08 195239.png',
      '/imgs/user-profiles/Screenshot 2026-05-08 195252.png',
      '/imgs/user-profiles/Screenshot 2026-05-08 195306.png',
    ],
    cta: { label: 'Try it on your hub', href: 'https://citinet.cloud' },
  },
  'AI Assistant': {
    Icon: Cpu,
    status: 'live',
    gradient: 'from-violet-600 to-blue-700',
    description: "An AI assistant built into your hub, not a third-party cloud. Helps you draft posts, summarize discussions, and answer questions about your community. Unlike your messages and notes, it isn't end-to-end encrypted. It has to read what you type to respond.",
    images: [
      '/imgs/AI-assistant/Screenshot 2026-05-08 195416.png',
      '/imgs/AI-assistant/Screenshot 2026-05-08 195426.png',
      '/imgs/AI-assistant/Screenshot 2026-05-08 195524.png',
    ],
    cta: { label: 'Try it on your hub', href: 'https://citinet.cloud' },
  },
  'Spaces': {
    Icon: Layers,
    status: 'live',
    gradient: 'from-purple-600 to-violet-700',
    description: 'Sub-communities within your hub. A city hub could have a Space for your block, your gardening group, or your local association. Each Space has its own feed and members.',
    images: ['/imgs/spaces/Screenshot 2026-05-08 195550.png'],
    examples: SPACES_EXAMPLES,
    cta: { label: 'Try it on your hub', href: 'https://citinet.cloud' },
  },
  // Phase 2: Building
  'Hub-to-Hub Federation': {
    Icon: Network,
    status: 'building',
    gradient: 'from-blue-700 to-violet-800',
    description: 'In development. Multiple hubs will be able to share selected content with each other. A marketplace listing on one hub could appear on another. Announcements could cross hub boundaries when communities choose to connect.',
  },
  'Hub Discovery': {
    Icon: Search,
    status: 'building',
    gradient: 'from-violet-700 to-purple-800',
    description: 'Partially live. Hubs can already register themselves in a public directory. A full browse and discovery interface is in development, making it easier to find hubs near you.',
    images: ['/imgs/hub-discovery/Screenshot 2026-05-08 203048.png'],
  },
  'Portable Identity': {
    Icon: Fingerprint,
    status: 'building',
    gradient: 'from-purple-700 to-pink-800',
    description: 'In development. Your identity on one hub will travel with you to others. No need to create a new account each time you join a different hub in the network.',
  },
  'Open App Ecosystem': {
    Icon: Puzzle,
    status: 'building',
    gradient: 'from-indigo-700 to-blue-800',
    description: 'In development. Third-party developers will be able to build integrations for Citinet hubs using an open contract. No platform permission needed. No revenue share.',
  },
  // Phase 3: Vision
  'No ISP Needed': {
    Icon: WifiOff,
    status: 'vision',
    gradient: 'from-purple-800 to-slate-800',
    description: 'The goal. When you are within range of a hub\'s local network, you connect directly. No internet service provider in the middle. The hub and everything on it is accessible over its own signal.',
  },
  'Rooftop Antennas': {
    Icon: Antenna,
    status: 'vision',
    gradient: 'from-violet-800 to-purple-900',
    description: 'The goal. Community wireless co-ops use rooftop point-to-point antennas to create neighborhood-scale backhaul. Citinet hubs are designed to run on top of exactly this kind of infrastructure.',
  },
  'Community Access Points': {
    Icon: Wifi,
    status: 'vision',
    gradient: 'from-blue-800 to-violet-900',
    description: 'The goal. Sector antennas serve dozens of nearby homes, just like public Wi-Fi but community-run and community-funded. No ISP contract. No terms of service designed for extraction.',
  },
  'Graceful Degradation': {
    Icon: Sparkles,
    status: 'vision',
    gradient: 'from-indigo-800 to-purple-900',
    description: 'Designed in from the start. As connectivity improves, Citinet scales up. During a storm or outage, it steps down gracefully through whatever modes are still available. The community keeps functioning.',
  },
};

const STATUS_LABELS: Record<FeatureStatus, string> = {
  live: 'Live Now',
  building: 'In Development',
  vision: 'The Vision',
};

const STATUS_CLASSES: Record<FeatureStatus, string> = {
  live: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  building: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  vision: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
};

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
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/92 backdrop-blur-sm p-4 cursor-zoom-out"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onClose}
    >
      <motion.img
        src={src}
        alt="Screenshot enlarged"
        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl cursor-default"
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.88, opacity: 0 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
        draggable={false}
      />
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
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

  return (
    <>
      <div className="relative bg-slate-900">
        {/* Scrollable strip */}
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
                className="w-full h-56 object-contain bg-slate-900"
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* Desktop prev / next arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => scrollTo(Math.max(0, active - 1))}
              aria-label="Previous"
              className={`hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-white transition-all ${active === 0 ? 'opacity-25 pointer-events-none' : ''}`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollTo(Math.min(images.length - 1, active + 1))}
              aria-label="Next"
              className={`hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-white transition-all ${active === images.length - 1 ? 'opacity-25 pointer-events-none' : ''}`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Dot indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-2.5 left-0 right-0 flex justify-center gap-1.5 pointer-events-none">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                aria-label={`Screenshot ${i + 1}`}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 pointer-events-auto ${
                  i === active ? 'bg-white scale-125' : 'bg-white/35 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        )}

        {/* Subtle hint on desktop */}
        {images.length > 0 && (
          <span className="absolute bottom-1.5 right-2.5 text-white/25 text-[9px] pointer-events-none hidden md:block select-none">
            click to enlarge
          </span>
        )}
      </div>

      {/* Lightbox */}
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

  return (
    <>
      {/* Header: real screenshots or gradient fallback */}
      {hasImages ? (
        <div className="relative shrink-0">
          <ImageGallery images={detail.images!} featureName={featureKey} />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-lg bg-black/50 hover:bg-black/70 text-white/80 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className={`relative h-44 bg-gradient-to-br ${detail.gradient} flex items-center justify-center shrink-0`}>
          <Icon className="w-14 h-14 text-white/70" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-black/30 hover:bg-black/50 text-white/70 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent pointer-events-none" />
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-6">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border mb-4 ${STATUS_CLASSES[detail.status]}`}>
          {STATUS_LABELS[detail.status]}
        </span>
        <h3 className="text-xl font-bold text-white mb-3">{featureKey}</h3>
        <p className="text-slate-300 text-sm leading-relaxed mb-6">{detail.description}</p>

        {/* Spaces examples grid */}
        {detail.examples && detail.examples.length > 0 && (
          <div className="mb-6">
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest mb-3">Example Spaces</p>
            <div
              className="flex gap-2 overflow-x-auto pb-1"
              style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
            >
              {detail.examples.map((ex) => {
                const ExIcon = ex.icon;
                return (
                  <div
                    key={ex.name}
                    className="relative rounded-xl overflow-hidden border border-white/10 group shrink-0 w-36"
                  >
                    <div className="relative h-24">
                      <img
                        src={ex.image}
                        alt={ex.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-br ${ex.color} opacity-60`} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <ExIcon className="absolute top-2 right-2 w-3.5 h-3.5 text-white/80" />
                    </div>
                    <div className="p-2.5 bg-slate-800/80">
                      <p className="text-white text-xs font-semibold leading-tight">{ex.name}</p>
                      <p className="text-slate-400 text-[10px] leading-snug mt-0.5 line-clamp-2">{ex.description}</p>
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
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:scale-105 transition-transform duration-200 shadow-lg shadow-blue-600/20"
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
        className="fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {isMobile ? (
        /* Mobile: bottom drawer with drag-to-dismiss */
        <motion.div
          className="fixed bottom-0 left-0 right-0 z-[60] flex flex-col bg-slate-900 border-t border-white/10 rounded-t-2xl max-h-[85vh] shadow-2xl shadow-black/60"
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
          {/* Drag handle: tap or drag down to close */}
          <div
            className="flex justify-center pt-3 pb-2 shrink-0 cursor-grab active:cursor-grabbing"
            onClick={onClose}
            title="Tap or drag down to close"
          >
            <div className="w-10 h-1.5 bg-white/30 rounded-full" />
          </div>
          <PanelContent featureKey={featureKey} detail={detail} onClose={onClose} />
        </motion.div>
      ) : (
        /* Desktop: centered modal */
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6" onClick={onClose}>
          <motion.div
            className="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden flex flex-col max-h-[85vh]"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
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
  accentClass: string;
  features: Feature[];
  callout?: string;
  note?: React.ReactNode;
  cta?: React.ReactNode;
  onPillClick?: (label: string) => void;
}

function PhaseSection({
  number, label, statusLabel, statusClass,
  headline, body, accentClass, features, callout, note, cta, onPillClick,
}: PhaseSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className="relative"
    >
      <div className={`absolute left-0 top-0 bottom-0 w-[3px] rounded-full bg-gradient-to-b ${accentClass} hidden lg:block`} />

      <div className="lg:pl-10">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center shrink-0">
            <span className="text-white font-bold">{number}</span>
          </div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${statusClass}`}>
            {statusLabel}
          </span>
          <span className="text-slate-500 text-sm font-medium">{label}</span>
        </div>

        <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">{headline}</h3>
        <p className="text-lg text-slate-300 max-w-2xl mb-8 leading-relaxed">{body}</p>

        <div className="flex flex-wrap gap-2.5 mb-8">
          {features.map(({ Icon, label: fl }, i) => (
            <motion.button
              key={fl}
              type="button"
              onClick={() => onPillClick?.(fl)}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.35, delay: 0.25 + i * 0.06 }}
              className={`flex items-center gap-2 px-4 py-2 bg-slate-800/70 border border-white/10 rounded-xl text-sm text-slate-300 transition-all duration-200 ${onPillClick ? 'cursor-pointer hover:border-violet-500/50 hover:bg-slate-700/70 hover:text-white' : 'cursor-default'}`}
            >
              <Icon className="w-4 h-4 text-violet-400 shrink-0" />
              {fl}
              {onPillClick && <span className="text-slate-600 text-xs ml-0.5">›</span>}
            </motion.button>
          ))}
        </div>

        {callout && (
          <div className="bg-violet-500/5 border-l-2 border-violet-500/40 pl-5 pr-4 py-4 text-slate-300 text-sm italic mb-8 rounded-r-xl">
            {callout}
          </div>
        )}

        {note && <div className="mb-6">{note}</div>}
        {cta}
      </div>
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

  return (
    <section id="phases" className="relative py-32 bg-slate-950 overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
            Three phases.
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
              One vision.
            </span>
          </h2>
          <p className="text-xl text-slate-400">
            From a single hub to a fully citizens-owned digital network infrastructure.
          </p>
        </motion.div>

        <div className="space-y-28">

          <PhaseSection
            number="1"
            label="The Hub"
            statusLabel="Live Now"
            statusClass="bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
            accentClass="from-blue-500 to-violet-500"
            headline="Store it. Share it. Own it."
            body="Run a hub on any computer. Neighbors open a browser and sign up in seconds, no app to download. Everything is stored on your hardware, not in a data center."
            features={[
              { Icon: HardDrive,     label: 'File Storage' },
              { Icon: Radio,         label: 'Community Feed' },
              { Icon: MessageCircle, label: 'Messaging' },
              { Icon: ShoppingBag,   label: 'Local Marketplace' },
              { Icon: Map,           label: 'Community Atlas' },
              { Icon: Users,         label: 'Member Profiles' },
              { Icon: Cpu,           label: 'AI Assistant' },
              { Icon: Layers,        label: 'Spaces' },
            ]}
            callout="Nothing from the outside world enters the feed unless a neighbor brings it in. No algorithm. No sponsored content. The world reaches your community through the people in it."
            onPillClick={setSelectedFeature}
            cta={
              <a
                href="https://citinet.cloud"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:scale-105 transition-transform duration-200 text-sm shadow-lg shadow-blue-600/20"
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
            statusClass="bg-blue-500/15 text-blue-400 border-blue-500/30"
            accentClass="from-violet-500 to-purple-500"
            headline="Hubs connect. Communities grow."
            body="Multiple hubs share content with each other. Identity becomes portable across the network. The ecosystem opens up to third-party builders."
            features={[
              { Icon: Network,     label: 'Hub-to-Hub Federation' },
              { Icon: Search,      label: 'Hub Discovery' },
              { Icon: Fingerprint, label: 'Portable Identity' },
              { Icon: Puzzle,      label: 'Open App Ecosystem' },
            ]}
            onPillClick={setSelectedFeature}
          />

          <PhaseSection
            number="3"
            label="The Infrastructure"
            statusLabel="The Vision"
            statusClass="bg-purple-500/15 text-purple-400 border-purple-500/30"
            accentClass="from-purple-500 to-pink-500"
            headline="Own the signal. No ISP required."
            body="Connect directly to a hub via its local network. No World Wide Web needed. Then go further: rooftop antennas, community access points, internet that belongs to your block."
            features={[
              { Icon: WifiOff,  label: 'No ISP Needed' },
              { Icon: Antenna,  label: 'Rooftop Antennas' },
              { Icon: Wifi,     label: 'Community Access Points' },
              { Icon: Sparkles, label: 'Graceful Degradation' },
            ]}
            onPillClick={setSelectedFeature}
            note={
              <div className="bg-slate-800/50 border border-white/10 rounded-xl p-6">
                <p className="text-white font-semibold mb-2 text-sm">The precedent already exists.</p>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  Rural electric co-ops brought power to communities that private utilities ignored. They organized, pooled resources, and built it themselves. Community wireless networks are doing the same for internet access today.
                </p>
                <div className="flex flex-wrap gap-x-5 gap-y-1.5">
                  <a href="https://www.electric.coop/our-organization/history" target="_blank" rel="noopener noreferrer"
                    className="text-xs text-violet-400 hover:text-violet-300 underline underline-offset-2 transition-colors">
                    NRECA: Rural Co-op History ↗
                  </a>
                  <a href="https://www.nycmesh.net" target="_blank" rel="noopener noreferrer"
                    className="text-xs text-violet-400 hover:text-violet-300 underline underline-offset-2 transition-colors">
                    NYC Mesh ↗
                  </a>
                  <a href="https://detroitcommunitytech.org" target="_blank" rel="noopener noreferrer"
                    className="text-xs text-violet-400 hover:text-violet-300 underline underline-offset-2 transition-colors">
                    Detroit Community Technology Project ↗
                  </a>
                </div>
              </div>
            }
          />
        </div>
      </div>

      {/* Slide-out feature panel */}
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
