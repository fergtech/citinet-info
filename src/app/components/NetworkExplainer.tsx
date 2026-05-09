import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { Server } from 'lucide-react';

const BADGES = [
  '0 Data Centers Required',
  '100% Community Owned',
  'Runs on Any Hardware',
];

export function NetworkExplainer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

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
            A community-run hub.
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              On your hardware. In your neighborhood.
            </span>
          </h2>

          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed">
            Anyone can run a hub. Spare PC, laptop, Raspberry Pi.
            Neighbors connect through a browser and everything stays local.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
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
      </div>
    </section>
  );
}
