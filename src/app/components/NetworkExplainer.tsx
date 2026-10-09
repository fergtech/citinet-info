import { motion, AnimatePresence, useInView } from 'motion/react';
import { useRef, useState, useEffect } from 'react';
import { Cpu, Monitor, Server, X } from 'lucide-react';

// ---------------------------------------------------------------------------
// Hardware data: drop a photo URL into `image` to activate it
// ---------------------------------------------------------------------------

const HARDWARE = [
  {
    name: 'Raspberry Pi',
    descriptor: '~$35 · 5 watts · Pocket-sized',
    note: 'Ideal for small community hubs running 24/7',
    Icon: Cpu,
    image: '/imgs/raspberrypi/vishnu-mohanan-rZKdS0wI8Ks-unsplash.jpg' as string | null,
  },
  {
    name: 'Mini PC',
    descriptor: '~$100–200 · Silent · Desk-sized',
    note: 'Plenty of power for a neighborhood hub',
    Icon: Monitor,
    image: '/imgs/mini-pc/onur-binay-Sa-0GdWMRRQ-unsplash.jpg' as string | null,
  },
  {
    name: 'Spare PC or Laptop',
    descriptor: 'What you already own',
    note: 'If it runs Docker, it runs a hub',
    Icon: Server,
    image: '/imgs/spare-computer/hugo-clement-IvUCu_u5hjI-unsplash.jpg' as string | null,
  },
];

const BADGES = [
  'Members need only a browser',
  'Nightly backups',
  'Export your data anytime',
];

// ---------------------------------------------------------------------------
// Lightbox
// ---------------------------------------------------------------------------

function HardwareLightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.stopImmediatePropagation(); onClose(); }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-6 cursor-zoom-out"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onClose}
    >
      <motion.img
        src={src}
        alt={alt}
        className="max-w-full max-h-full object-contain rounded-lg cursor-default"
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.88, opacity: 0 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
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
// Hardware card
// ---------------------------------------------------------------------------

function HardwareCard({
  name, descriptor, note, Icon, image, delay,
}: typeof HARDWARE[0] & { delay: number }) {
  const [lightbox, setLightbox] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, delay }}
        className={`relative rounded-lg overflow-hidden border border-border bg-card shrink-0 w-56 md:w-auto text-left ${image ? 'cursor-zoom-in' : ''} group`}
        onClick={() => image && setLightbox(true)}
        title={image ? 'Click to enlarge' : undefined}
      >
        {/* Image or gradient placeholder */}
        <div className="relative h-44 border-b border-border">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-contain bg-muted"
              draggable={false}
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <Icon className="w-10 h-10 text-muted-foreground" strokeWidth={1.25} />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-foreground font-medium text-sm mb-1">{name}</p>
          <p className="font-mono text-muted-foreground text-xs mb-2">{descriptor}</p>
          <p className="text-muted-foreground text-xs leading-snug">{note}</p>
        </div>
      </motion.div>

      <AnimatePresence>
        {lightbox && image && (
          <HardwareLightbox src={image} alt={name} onClose={() => setLightbox(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

// ---------------------------------------------------------------------------
// Section
// ---------------------------------------------------------------------------

export function NetworkExplainer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="network" ref={ref} className="relative py-20 bg-background border-t border-border">
      <div className="max-w-[1248px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-4">The hub</p>

          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-5 leading-tight">
            One organizer runs the hub.
            <br />
            <span className="text-muted-foreground">Everyone else opens a browser.</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mb-8 leading-relaxed">
            A hub is a small server that lives in someone&apos;s closet, office, or community center: a spare PC, a mini PC, or a Raspberry Pi. The person who sets it up is the admin. Members visit a web address on their phone or laptop and request an account, and the admin approves them. Your group&apos;s data lives on hardware you control.
          </p>

          <div className="flex flex-wrap gap-2 mb-14">
            {BADGES.map((badge, i) => (
              <motion.div
                key={badge}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                className="px-3 py-1 bg-muted border border-border rounded-md font-mono text-xs text-foreground"
              >
                {badge}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Hardware gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-5">
            What a hub can run on
          </p>

          {/* Horizontal scroll on mobile, 3-col grid on desktop */}
          <div className="flex md:grid md:grid-cols-3 gap-4 overflow-x-auto md:overflow-visible pb-2 md:pb-0"
            style={{ scrollbarWidth: 'none' } as React.CSSProperties}
          >
            {HARDWARE.map((hw, i) => (
              <HardwareCard key={hw.name} {...hw} delay={0.7 + i * 0.12} />
            ))}
          </div>

          <p className="font-mono text-muted-foreground text-xs mt-5">
            If it runs Docker, it runs a hub.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
