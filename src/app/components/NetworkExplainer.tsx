import { motion, AnimatePresence, useInView } from 'motion/react';
import { useRef, useState, useEffect } from 'react';
import { Server, Cpu, Monitor, X } from 'lucide-react';

// ---------------------------------------------------------------------------
// Hardware data: drop a photo URL into `image` to activate it
// ---------------------------------------------------------------------------

const HARDWARE = [
  {
    name: 'Raspberry Pi',
    descriptor: '~$35 · 5 watts · Pocket-sized',
    note: 'Ideal for small community hubs running 24/7',
    Icon: Cpu,
    gradient: 'from-green-600 to-emerald-700',
    image: '/imgs/raspberrypi/vishnu-mohanan-rZKdS0wI8Ks-unsplash.jpg' as string | null,
  },
  {
    name: 'Mini PC',
    descriptor: '~$100–200 · Silent · Desk-sized',
    note: 'Plenty of power for a neighborhood hub',
    Icon: Monitor,
    gradient: 'from-blue-600 to-violet-700',
    image: '/imgs/mini-pc/onur-binay-Sa-0GdWMRRQ-unsplash.jpg' as string | null,
  },
  {
    name: 'Spare PC or Laptop',
    descriptor: 'What you already own',
    note: 'If it runs Docker, it runs a hub',
    Icon: Server,
    gradient: 'from-violet-600 to-purple-700',
    image: '/imgs/spare-computer/hugo-clement-IvUCu_u5hjI-unsplash.jpg' as string | null,
  },
];

const BADGES = [
  '0 Data Centers Required',
  '100% Community Owned',
  'Runs on Any Hardware',
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
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/92 backdrop-blur-sm p-6 cursor-zoom-out"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onClose}
    >
      <motion.img
        src={src}
        alt={alt}
        className="max-w-full max-h-full object-contain rounded-xl shadow-2xl cursor-default"
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
// Hardware card
// ---------------------------------------------------------------------------

function HardwareCard({
  name, descriptor, note, Icon, gradient, image, delay,
}: typeof HARDWARE[0] & { delay: number }) {
  const [lightbox, setLightbox] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, delay }}
        className={`relative rounded-2xl overflow-hidden border border-white/10 bg-slate-900 shrink-0 w-56 md:w-auto ${image ? 'cursor-zoom-in' : ''} group`}
        onClick={() => image && setLightbox(true)}
        title={image ? 'Click to enlarge' : undefined}
      >
        {/* Image or gradient placeholder */}
        <div className="relative h-44">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-contain bg-slate-800 group-hover:scale-105 transition-transform duration-300"
              draggable={false}
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
              <Icon className="w-14 h-14 text-white/40" />
            </div>
          )}
          {image && (
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-white font-semibold text-sm mb-1">{name}</p>
          <p className="text-violet-400 text-xs font-medium mb-2">{descriptor}</p>
          <p className="text-slate-500 text-xs leading-snug">{note}</p>
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
    <section id="network" ref={ref} className="relative py-24 bg-slate-950">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/30 mb-8">
            <Server className="w-8 h-8 text-violet-400" />
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            The web = global & irrelevant.
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              Citinet = local & relevant again.
            </span>
          </h2>

          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed">
            Anyone can run a hub. Spare PC, laptop, Raspberry Pi.
            Neighbors connect through a browser, and your community's data lives on hardware you control. (or just keep it all to yourself ¯\_(ツ)_/¯ )
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {BADGES.map((badge, i) => (
              <motion.div
                key={badge}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                className="px-5 py-2.5 bg-slate-800/60 border border-white/10 rounded-full text-slate-300 text-sm font-medium"
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
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest mb-6">
            This is what the new neighborhood data center looks like
          </p>

          {/* Horizontal scroll on mobile, 3-col grid on desktop */}
          <div className="flex md:grid md:grid-cols-3 gap-4 overflow-x-auto md:overflow-visible pb-2 md:pb-0"
            style={{ scrollbarWidth: 'none' } as React.CSSProperties}
          >
            {HARDWARE.map((hw, i) => (
              <HardwareCard key={hw.name} {...hw} delay={0.7 + i * 0.12} />
            ))}
          </div>

          <p className="text-slate-600 text-xs mt-5">
            If it runs Docker, it runs a hub.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
