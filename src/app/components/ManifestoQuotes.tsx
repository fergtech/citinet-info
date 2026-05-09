import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef, useState } from 'react';
import { ManifestoModal } from './ManifestoModal';

const QUOTES = [
  'The internet should belong to communities, not corporations.',
  'Your data should live on your hardware, not in a data center.',
  'Neighborhoods can own their digital infrastructure. The technology exists.',
];

export function ManifestoQuotes() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && <ManifestoModal onClose={() => setOpen(false)} />}

      <section id="declaration" ref={ref} className="relative py-28 bg-slate-950">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent to-white/10" />

        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-xs text-slate-600 font-semibold uppercase tracking-widest mb-10"
          >
            Our Declaration
          </motion.p>

          <div className="space-y-12">
            {QUOTES.map((quote, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.1 + i * 0.2 }}
                className="text-2xl md:text-3xl font-semibold text-slate-200 leading-snug"
              >
                "{quote}"
              </motion.p>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-12"
          >
            <button
              onClick={() => setOpen(true)}
              className="text-slate-500 hover:text-violet-400 transition-colors text-sm border-b border-slate-700 hover:border-violet-400 pb-0.5"
            >
              Read the full declaration
            </button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
