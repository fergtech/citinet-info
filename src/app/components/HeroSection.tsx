import { Fragment } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Smartphone, Laptop, Monitor, Tablet, Tv, User } from 'lucide-react';

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
              Announcements, files, messaging, polls, and a shared map in one place, for HOAs, tenant unions, co-ops, clubs, and neighborhood groups.
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
            className="hidden lg:block"
          >
            <HubDiagram />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const SPOKES = [
  { Icon: Smartphone, deg: 0 },
  { Icon: Laptop,     deg: 72 },
  { Icon: Tablet,     deg: 144 },
  { Icon: Monitor,    deg: 216 },
  { Icon: Tv,         deg: 288 },
];
const R = 120;
const CX = 140;
const CY = 140;

// One spoke (set via CLUSTER_INDEX) renders as a small self-contained network
// instead of a single device: three equal nodes, fully interconnected with
// each other, with only one of them bridging back to the center. Same
// sub-network-within-the-network concept as the little cluster in the
// Citinet logo -- a "connection" to your hub can itself be a whole
// community, not just one device.
const CLUSTER_INDEX = 4;
const CLUSTER_NODE_R = 13;

function HubDiagram() {
  return (
    <div className="relative w-72 h-72 mx-auto">
      <svg viewBox="0 0 280 280" className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
        {SPOKES.map(({ deg }, i) => {
          const rad = (deg - 90) * (Math.PI / 180);
          const x2 = CX + R * Math.cos(rad);
          const y2 = CY + R * Math.sin(rad);

          if (i === CLUSTER_INDEX) {
            // A/B form the top edge of the triangle, C is the rightmost node --
            // C is the one that bridges back to the hub (nearest it geometrically
            // for this spoke's position), not A. All three stay fully meshed
            // with each other regardless of which one carries the outside line.
            const ax = x2, ay = y2;
            const bx = x2 - 20, by = y2 + 26;
            const cx = x2 + 20, cy = y2 + 26;
            return (
              <g key={i}>
                <motion.line x1={CX} y1={CY} x2={cx} y2={cy}
                  stroke="var(--border)" strokeWidth="1.5" strokeDasharray="5 4"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }} />
                <motion.line x1={ax} y1={ay} x2={bx} y2={by}
                  stroke="var(--border)" strokeWidth="1.4"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }} />
                <motion.line x1={ax} y1={ay} x2={cx} y2={cy}
                  stroke="var(--border)" strokeWidth="1.4"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }} />
                <motion.line x1={bx} y1={by} x2={cx} y2={cy}
                  stroke="var(--border)" strokeWidth="1.4"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.65 + i * 0.1 }} />
                {[[ax, ay], [bx, by], [cx, cy]].map(([nx, ny], j) => (
                  <motion.circle key={j} cx={nx} cy={ny} r={CLUSTER_NODE_R}
                    fill="var(--background)" stroke="var(--border)" strokeWidth="1.5"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.55 + i * 0.12 + j * 0.06 }} />
                ))}
              </g>
            );
          }

          return (
            <g key={i}>
              <motion.line
                x1={CX} y1={CY} x2={x2} y2={y2}
                stroke="var(--border)"
                strokeWidth="1.5"
                strokeDasharray="5 4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
              />
              <motion.circle
                cx={x2} cy={y2} r={24}
                fill="var(--background)"
                stroke="var(--border)"
                strokeWidth="1.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.55 + i * 0.12 }}
              />
            </g>
          );
        })}
        <motion.circle cx={CX} cy={CY} r={52} fill="none" stroke="var(--border)" strokeWidth="1" strokeDasharray="2 4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} />
        <motion.circle cx={CX} cy={CY} r={40} fill="var(--muted)" stroke="var(--foreground)" strokeWidth="1.5"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }} />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <div className="text-muted-foreground font-mono text-[9px] tracking-[0.2em] uppercase">Your</div>
          <div className="text-foreground text-xl font-semibold tracking-tight">Hub</div>
        </motion.div>
      </div>

      {SPOKES.map(({ Icon, deg }, i) => {
        const rad = (deg - 90) * (Math.PI / 180);
        const x2 = CX + R * Math.cos(rad);
        const y2 = CY + R * Math.sin(rad);

        if (i === CLUSTER_INDEX) {
          const nodes: Array<[number, number]> = [
            [x2, y2],
            [x2 - 20, y2 + 26],
            [x2 + 20, y2 + 26],
          ];
          return (
            <Fragment key={i}>
              {nodes.map(([nx, ny], j) => {
                const npx = (nx / 280) * 100;
                const npy = (ny / 280) * 100;
                return (
                  <motion.div
                    key={j}
                    className="absolute flex items-center justify-center pointer-events-none"
                    style={{ left: `${npx}%`, top: `${npy}%`, transform: 'translate(-50%, -50%)', width: 26, height: 26 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.8 + i * 0.12 + j * 0.06 }}
                  >
                    <User className="w-3.5 h-3.5 text-muted-foreground" />
                  </motion.div>
                );
              })}
            </Fragment>
          );
        }

        const px = (x2 / 280) * 100;
        const py = (y2 / 280) * 100;
        return (
          <motion.div
            key={i}
            className="absolute flex items-center justify-center pointer-events-none"
            style={{ left: `${px}%`, top: `${py}%`, transform: 'translate(-50%, -50%)', width: 48, height: 48 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.75 + i * 0.12 }}
          >
            <Icon className="w-5 h-5 text-muted-foreground" />
          </motion.div>
        );
      })}

      <motion.div
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-3 py-1 bg-background border border-border rounded-md font-mono text-xs text-muted-foreground whitespace-nowrap"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.5 }}
      >
        No data center required
      </motion.div>
    </div>
  );
}
