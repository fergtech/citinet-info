import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { ManifestoModal } from './ManifestoModal';

const QUOTES = [
  'Your data should live on your hardware, not in a centrally-owned data center.',
  'Common people, not corporations, control the data, rules, memberships, and governance of their digital spaces.',
  'Communities deserve digital spaces designed around human-life enrichment & connection rather than platform growth or capital gain.',
];

export function ManifestoQuotes() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && <ManifestoModal onClose={() => setOpen(false)} />}

      <section id="declaration" ref={ref} className="relative py-20 bg-background border-t border-border">
        <div className="max-w-3xl mx-auto px-6">
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4 }}
            className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-8"
          >
            Our Declaration
          </motion.p>

          <div className="space-y-8">
            {QUOTES.map((quote, i) => (
              <motion.blockquote
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                className="border-l-2 border-border pl-6 text-xl md:text-2xl font-medium tracking-tight text-foreground leading-snug"
              >
                {quote}
              </motion.blockquote>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-10"
          >
            <button
              onClick={() => setOpen(true)}
              className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Read the full declaration
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
