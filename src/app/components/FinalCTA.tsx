import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { ArrowRight, DatabaseBackup, LockKeyhole, PackageOpen } from 'lucide-react';

// Three assurances as floating bubbles. Different sizes and positions keep it from reading as a grid; the float
// is transform-only (compositor-friendly) and slow, so it stays smooth on any device. It is a soft 10-12px drift
// that never leaves the circle's own space, so it stays within what reduced-motion visitors can comfortably see.
const BUBBLES = [
  { Icon: DatabaseBackup, title: 'Nightly backups', text: 'Database and files, rotated automatically', size: 'h-[224px] w-[224px] lg:h-[236px] lg:w-[236px]', pos: 'lg:left-0 lg:top-0', float: 'cta-float-a' },
  { Icon: LockKeyhole, title: 'End-to-end encrypted', text: 'DMs, notes and files', size: 'h-[200px] w-[200px] lg:h-[204px] lg:w-[204px]', pos: 'lg:right-0 lg:top-[88px]', float: 'cta-float-b' },
  { Icon: PackageOpen, title: 'Leave anytime', text: 'Export your account and take it with you', size: 'h-[212px] w-[212px] lg:h-[220px] lg:w-[220px]', pos: 'lg:bottom-0 lg:left-[20%]', float: 'cta-float-c' },
];

export function FinalCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section id="cta" ref={ref} className="relative bg-muted/40 border-t border-border">
      <div className="max-w-[1248px] mx-auto px-6 pt-24 pb-20 lg:pt-32 lg:pb-24">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-20">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl lg:text-[3.5rem] font-semibold tracking-tight text-foreground mb-6 leading-[1.08]"
            >
              Give your community
              <br />
              <span className="text-muted-foreground">its very own digital ecosystem.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-muted-foreground max-w-xl mb-9 leading-relaxed"
            >
              Set up a hub for yourself or a group, or find a hub that&apos;s already running near you. (hubs are still coming online, so check back soon if you don&apos;t see one yet or create the first in your area!)
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
                className="group inline-flex items-center justify-center gap-2 h-11 px-6 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
              >
                Start a Hub
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
              <a
                href="https://github.com/fergtech/citinet"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-11 px-6 bg-background text-foreground border border-border text-sm font-medium rounded-md hover:bg-muted transition-colors"
              >
                View on GitHub
              </a>
            </motion.div>
          </div>

          <div className="hidden lg:relative lg:block lg:h-[480px]">
            {BUBBLES.map(({ Icon, title, text, size, pos, float }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.25 + i * 0.12 }}
                className={`lg:absolute ${pos}`}
              >
                <div
                  className={`${float} flex flex-col items-center justify-center rounded-full border border-foreground/25 bg-card px-7 text-center ${size}`}
                >
                  <Icon className="mb-3 h-6 w-6 text-foreground" strokeWidth={1.5} />
                  <p className="text-[15px] font-semibold leading-tight tracking-tight text-foreground">{title}</p>
                  <p className="mt-1.5 text-[12.5px] leading-snug text-muted-foreground">{text}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <style>{`
            @keyframes cta-float {
              0%, 100% { transform: translate3d(0, 0, 0); }
              50% { transform: translate3d(var(--fx, 2px), var(--fy, -12px), 0); }
            }
            .cta-float-a, .cta-float-b, .cta-float-c {
              animation: cta-float var(--fd, 8s) ease-in-out var(--fl, 0s) infinite;
              will-change: transform;
            }
            .cta-float-a { --fd: 6.5s; --fl: 0s; --fx: 4px; --fy: -12px; }
            .cta-float-b { --fd: 7.5s; --fl: -2.5s; --fx: -4px; --fy: -10px; }
            .cta-float-c { --fd: 7s; --fl: -4.5s; --fx: 3px; --fy: -11px; }
          `}</style>
        </div>
      </div>

      <div className="max-w-[1248px] mx-auto px-6">
        <div className="py-6 border-t border-border font-mono text-xs text-muted-foreground">
          Citinet, the Citizens&apos; Internet Project © 2026 · info.citinet.cloud · citinet.cloud
        </div>
      </div>
    </section>
  );
}
