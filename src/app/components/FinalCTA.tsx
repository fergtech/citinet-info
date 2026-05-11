import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';

export function FinalCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section id="cta" ref={ref} className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950">

      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1770938474403-a16353e18bf3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZWlnaGJvcmhvb2QlMjBzdHJlZXQlMjBhZXJpYWwlMjB2aWV3fGVufDF8fHx8MTc3MTYxOTU2Nnww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Neighborhood aerial view"
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-blue-950/90 to-purple-950/90" />
      </div>

      {/* Dot grid */}
      <div className="absolute inset-0 opacity-[0.07]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="cta-dots" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="12" cy="12" r="1" fill="rgba(168,85,247,1)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cta-dots)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-28 text-center">

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
        >
          Own your slice
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
            of a new digital world.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl text-slate-300 max-w-xl mx-auto mb-12 leading-relaxed"
        >
          Start a hub or find one near you. Either way, the network is yours.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="https://citinet.cloud"
            target="_blank"
            rel="noopener noreferrer"
            className="group px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg rounded-xl font-bold shadow-2xl shadow-blue-600/30 hover:shadow-blue-600/50 transition-all duration-300 hover:scale-105 flex items-center gap-3 justify-center"
          >
            Start a Hub
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="https://github.com/fergtech/citinet"
            target="_blank"
            rel="noopener noreferrer"
            className="px-10 py-5 bg-white/5 border border-white/15 text-slate-300 hover:text-white hover:border-white/30 hover:bg-white/10 rounded-xl font-bold text-lg transition-all duration-300 text-center"
          >
            View on GitHub
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="mt-20 grid grid-cols-3 gap-8 max-w-sm mx-auto"
        >
          {[
            { value: '0',    label: 'Data Centers' },
            { value: '100%', label: 'Community Owned' },
            { value: '∞',    label: 'Your Control' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent mb-1">
                {value}
              </div>
              <div className="text-slate-500 text-xs font-semibold uppercase tracking-wide">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 text-center text-slate-600 text-sm">
        Citinet © 2026 · info.citinet.cloud · citinet.cloud
      </div>
    </section>
  );
}
