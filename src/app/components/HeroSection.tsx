import { Fragment } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ChevronDown, Smartphone, Laptop, Monitor, Tablet, Tv, User } from 'lucide-react';

export function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-950 via-slate-900 to-purple-950">

      {/* Background video underlay (muted, looping, autoplay) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          className="w-full h-full object-cover"
          src="/video-background.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        {/* Plain alpha tint to keep contrast on the footage */}
        <div className="absolute inset-0 opacity-60" style={{ background: 'var(--cn-wallpaper)' }} />
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-video-dots" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="12" cy="12" r="1" fill="rgba(168,85,247,1)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-video-dots)" opacity="0.18" />
        </svg>
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Gradient + dot overlay above the video, below content */}
      <div className="absolute inset-0 z-[5] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-900 to-purple-950 opacity-80" />
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-dots-overlay" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="12" cy="12" r="1" fill="rgba(168,85,247,1)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-dots-overlay)" opacity="0.18" />
        </svg>
      </div>

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          <div>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] mb-6"
            >
              The World-Wide-Web
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                made local.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
              className="text-lg md:text-xl text-slate-300 mb-3 leading-relaxed"
            >
              Store files. Chat. Connect with others on your locally-owned and operated network. No Big Tech platforms. No middleman.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
              className="text-base text-slate-500 mb-10"
            >
              Start your own hub or connect to one already running.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45, ease: 'easeOut' }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a
                href="https://citinet.cloud"
                target="_blank"
                rel="noopener noreferrer"
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all duration-300 hover:scale-105 flex items-center gap-2 justify-center"
              >
                Start a Hub
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="https://citinet.cloud"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white/5 backdrop-blur-sm text-white border border-white/20 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 text-center"
              >
                Find a Hub
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
            className="hidden lg:block"
          >
            <HubDiagram />
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-6 h-6 text-white/25" />
        </motion.div>
      </motion.div>
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
                  stroke="rgba(139,92,246,0.3)" strokeWidth="1.5" strokeDasharray="5 4"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }} />
                <motion.line x1={ax} y1={ay} x2={bx} y2={by}
                  stroke="rgba(139,92,246,0.28)" strokeWidth="1.4"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }} />
                <motion.line x1={ax} y1={ay} x2={cx} y2={cy}
                  stroke="rgba(139,92,246,0.28)" strokeWidth="1.4"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }} />
                <motion.line x1={bx} y1={by} x2={cx} y2={cy}
                  stroke="rgba(139,92,246,0.28)" strokeWidth="1.4"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.65 + i * 0.1 }} />
                {[[ax, ay], [bx, by], [cx, cy]].map(([nx, ny], j) => (
                  <motion.circle key={j} cx={nx} cy={ny} r={CLUSTER_NODE_R}
                    fill="rgba(15,23,42,0.97)" stroke="rgba(139,92,246,0.35)" strokeWidth="1.5"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.55 + i * 0.12 + j * 0.06 }} />
                ))}
              </g>
            );
          }

          return (
            <g key={i}>
              <motion.line
                x1={CX} y1={CY} x2={x2} y2={y2}
                stroke="rgba(139,92,246,0.3)"
                strokeWidth="1.5"
                strokeDasharray="5 4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
              />
              <motion.circle
                cx={x2} cy={y2} r={24}
                fill="rgba(15,23,42,0.97)"
                stroke="rgba(139,92,246,0.35)"
                strokeWidth="1.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.55 + i * 0.12 }}
              />
            </g>
          );
        })}
        <motion.circle cx={CX} cy={CY} r={52} fill="none" stroke="rgba(99,102,241,0.12)" strokeWidth="1"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} />
        <motion.circle cx={CX} cy={CY} r={40} fill="rgba(99,102,241,0.07)" stroke="rgba(99,102,241,0.55)" strokeWidth="2"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }} />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <div className="text-violet-400 text-[9px] font-bold tracking-[0.2em] uppercase">Your</div>
          <div className="text-white text-xl font-extrabold tracking-tight">Hub</div>
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
                    <User className="w-3.5 h-3.5 text-violet-400/75" />
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
            <Icon className="w-5 h-5 text-violet-400/70" />
          </motion.div>
        );
      })}

      <motion.div
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-slate-900 border border-violet-500/30 rounded-full text-xs text-violet-400 font-semibold whitespace-nowrap"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.5 }}
      >
        No data center required
      </motion.div>
    </div>
  );
}
