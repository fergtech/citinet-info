import { motion } from 'motion/react';
import { ArrowRight, ChevronDown, Smartphone, Laptop, Monitor, Tablet, Tv } from 'lucide-react';

export function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-950 via-slate-900 to-purple-950">

      {/* Dot grid matching portal background pattern */}
      <div className="absolute inset-0 opacity-[0.12]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-dots" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="12" cy="12" r="1" fill="rgba(168,85,247,1)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-dots)" />
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
              Your neighborhood.
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                Your internet.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
              className="text-lg md:text-xl text-slate-300 mb-3 leading-relaxed"
            >
              Store files. Connect with neighbors. No Big Tech platforms. No middleman.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
              className="text-base text-slate-500 mb-10"
            >
              Start your own hub or connect to one already running in your community.
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

function HubDiagram() {
  return (
    <div className="relative w-72 h-72 mx-auto">
      <svg viewBox="0 0 280 280" className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
        {SPOKES.map(({ deg }, i) => {
          const rad = (deg - 90) * (Math.PI / 180);
          const x2 = CX + R * Math.cos(rad);
          const y2 = CY + R * Math.sin(rad);
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
        const px = ((CX + R * Math.cos(rad)) / 280) * 100;
        const py = ((CY + R * Math.sin(rad)) / 280) * 100;
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
