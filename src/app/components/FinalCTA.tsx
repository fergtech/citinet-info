import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef, useState, useEffect } from 'react';
import { ArrowRight, Heart, BookOpen } from 'lucide-react';
import { ManifestoModal } from './ManifestoModal';

// ---------------------------------------------------------------------------
// FinalCTA
// ---------------------------------------------------------------------------
export function FinalCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [manifestoOpen, setManifestoOpen] = useState(false);

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = manifestoOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [manifestoOpen]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setManifestoOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      {manifestoOpen && <ManifestoModal onClose={() => setManifestoOpen(false)} />}

      <section id="cta" ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-emerald-950">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1770938474403-a16353e18bf3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZWlnaGJvcmhvb2QlMjBzdHJlZXQlMjBhZXJpYWwlMjB2aWV3fGVufDF8fHx8MTc3MTYxOTU2Nnww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Neighborhood aerial view"
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-blue-950/95 to-slate-950/90" />
        </div>

        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: 0
              }}
              animate={{
                y: [null, Math.random() * window.innerHeight],
                opacity: [0, 0.5, 0]
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-32 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 mb-8 shadow-lg shadow-cyan-500/50">
              <Heart className="w-10 h-10 text-white fill-white" />
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight"
          >
            Build Your Hub.
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Own Your Reality.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            The internet shouldn't belong to governments or corporations. It should belong to communities.
            To neighborhoods. To you. Join the movement to take it back.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <a
              href="https://citinet.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="group px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-lg rounded-xl font-bold shadow-2xl shadow-cyan-500/40 hover:shadow-cyan-500/60 transition-all duration-300 hover:scale-105 flex items-center gap-3"
            >
              Start a Hub
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </a>
            <button className="px-10 py-5 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-lg rounded-xl font-bold shadow-2xl shadow-emerald-500/40 hover:shadow-emerald-500/60 transition-all duration-300 hover:scale-105 flex items-center gap-3">
              Join the Community
              <Heart className="w-6 h-6" />
            </button>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
            onClick={() => setManifestoOpen(true)}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer group"
          >
            <BookOpen className="w-5 h-5" />
            <span className="border-b border-slate-400/50 group-hover:border-cyan-400 transition-colors">
              Read the Manifesto
            </span>
          </motion.button>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto"
          >
            {[
              { value: "100%", label: "Community Owned" },
              { value: "∞", label: "Sovereignty" },
              { value: "0", label: "Platform Lock-in" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-400 font-semibold">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="absolute bottom-8 left-0 right-0 text-center text-slate-500 text-sm"
        >
          <p>Citinet © 2026 — A movement for digital sovereignty</p>
        </motion.div>
      </section>
    </>
  );
}
