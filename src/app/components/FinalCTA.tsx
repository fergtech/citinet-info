import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';

export function FinalCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section id="cta" ref={ref} className="relative bg-muted/40 border-t border-border">
      <div className="max-w-[1248px] mx-auto px-6 pt-24 pb-10">
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground mb-4 leading-[1.1]"
        >
          Give your community
          <br />
          <span className="text-muted-foreground">a home of its own.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed"
        >
          Set up a hub for your group, or find one that&apos;s already running near you.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <a
            href="https://citinet.cloud/create"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-2 h-10 px-5 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
          >
            Start a Hub
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
          <a
            href="https://github.com/fergtech/citinet"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center h-10 px-5 bg-background text-foreground border border-border text-sm font-medium rounded-md hover:bg-muted transition-colors"
          >
            View on GitHub
          </a>
        </motion.div>

        <motion.dl
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-16 grid grid-cols-3 max-w-xl border border-border rounded-lg divide-x divide-border bg-card"
        >
          {[
            { value: 'Nightly', label: 'Backups' },
            { value: 'E2E',     label: 'Encrypted DMs, notes, files' },
            { value: 'Export',  label: 'Leave anytime' },
          ].map(({ value, label }) => (
            <div key={label} className="p-4">
              <dd className="text-xl font-semibold tracking-tight text-foreground mb-0.5">{value}</dd>
              <dt className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">{label}</dt>
            </div>
          ))}
        </motion.dl>
      </div>

      <div className="max-w-[1248px] mx-auto px-6 py-6 border-t border-border font-mono text-xs text-muted-foreground">
        Citinet, the Citizens&apos; Internet Project © 2026 · info.citinet.cloud · citinet.cloud
      </div>
    </section>
  );
}
