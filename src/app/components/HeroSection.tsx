import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { HubPlayground } from './HubPlayground';

export function HeroSection() {
  return (
    <section id="hero" className="relative overflow-hidden bg-background">
      {/* Faint blueprint grid, faded at the edges */}
      <div
        className="absolute inset-0 pointer-events-none text-border"
        style={{
          backgroundImage:
            'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, #000 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, #000 30%, transparent 100%)',
          opacity: 0.6,
        }}
      />

      <div className="relative z-10 max-w-[1248px] mx-auto px-6 pt-36 pb-24 lg:pt-44 lg:pb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground border border-border rounded-md px-2.5 py-1 mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Open source · Locally-hosted
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.08] mb-6"
            >
              Your community&apos;s
              <br />
              <span className="text-muted-foreground">new digital home.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
              className="text-lg text-muted-foreground max-w-xl mb-3 leading-relaxed"
            >
              Announcements, files, messaging and calls, polls, and a shared map in one place, for HOAs, tenant unions, co-ops, clubs, and neighborhood groups.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
              className="text-sm text-muted-foreground/80 mb-8"
            >
              One organizer sets up the hub. Everyone else just opens a browser (or app). No ads, no hidden ranking, and your data stays on hardware you or your community controls.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
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
                href="https://citinet.cloud/join"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-10 px-5 bg-background text-foreground border border-border text-sm font-medium rounded-md hover:bg-muted transition-colors"
              >
                Find a Hub
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 lg:mt-0"
          >
            <HubPlayground />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
