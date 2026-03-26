import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { Wifi, Radio, Globe, Zap } from 'lucide-react';

const TRANSPORT_MODES = [
  {
    icon: Globe,
    label: 'Public Internet',
    description: 'Tailscale Funnel or a direct domain. Works over any internet connection anywhere in the world.',
    status: 'Default today',
    color: 'from-cyan-500 to-blue-500',
    textColor: 'text-cyan-400',
    borderColor: 'border-cyan-500/30',
  },
  {
    icon: Wifi,
    label: 'Community Wireless',
    description: 'A co-op gateway node, rooftop relay sites, and sector antennas — neighborhood-owned backhaul, independent of any ISP.',
    status: 'Near-term path',
    color: 'from-blue-500 to-purple-500',
    textColor: 'text-blue-400',
    borderColor: 'border-blue-500/30',
  },
  {
    icon: Zap,
    label: 'Local Island',
    description: 'LAN only. No internet required. The hub serves the neighborhood even when the wider internet is unreachable.',
    status: 'Built into the design',
    color: 'from-purple-500 to-emerald-500',
    textColor: 'text-purple-400',
    borderColor: 'border-purple-500/30',
  },
  {
    icon: Radio,
    label: 'Mesh & Emergency',
    description: 'LoRa / Meshtastic side-channel for short messages, presence beacons, and emergency alerts when everything else fails.',
    status: 'Long-term layer',
    color: 'from-emerald-500 to-cyan-500',
    textColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
  },
];

export function CitizensWeb() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section
      ref={ref}
      id="citizens-web"
      className="relative py-32 bg-slate-950 overflow-hidden"
    >
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold tracking-wide uppercase mb-6">
            <Radio className="w-4 h-4" />
            The Bigger Picture
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Software Is the
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Beginning, Not the End
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            The endgame isn't just community-owned software running on corporate internet.
            It's community-owned infrastructure — all the way down to the antenna.
          </p>
        </motion.div>

        {/* Co-op analogy pull quote */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-20"
        >
          <div className="relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-10">
            <div className="absolute top-0 left-8 -translate-y-1/2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-semibold tracking-widest uppercase">
              The Precedent
            </div>
            <p className="text-lg md:text-xl text-slate-200 leading-relaxed">
              Rural electric cooperatives brought power to communities that private utilities ignored —
              not by waiting for corporations to act, but by organizing, pooling resources, and building
              it themselves. <strong className="text-white">Community wireless ISPs are doing the same thing
              with internet access right now</strong> in cities like Detroit, New York, and Baltimore.
            </p>
            <p className="text-slate-400 mt-4 text-base leading-relaxed">
              Ubiquiti and MikroTik hardware makes a neighborhood-scale wireless network buildable for a few hundred
              to a few thousand dollars per site. Citinet is designed to run on top of exactly this kind of infrastructure.
            </p>
          </div>
        </motion.div>

        {/* Transport modes grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-16"
        >
          <h3 className="text-center text-sm font-semibold uppercase tracking-widest text-slate-500 mb-8">
            How a Hub Connects to the World
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TRANSPORT_MODES.map((mode, i) => {
              const Icon = mode.icon;
              return (
                <motion.div
                  key={mode.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                  className={`relative bg-slate-900/60 backdrop-blur-sm border ${mode.borderColor} rounded-2xl p-5 group hover:border-white/20 transition-all duration-300`}
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${mode.color} p-[1.5px] mb-4`}>
                    <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center">
                      <Icon className={`w-5 h-5 ${mode.textColor}`} />
                    </div>
                  </div>
                  <div className={`text-[11px] font-semibold uppercase tracking-widest ${mode.textColor} mb-1`}>
                    {mode.status}
                  </div>
                  <h4 className="text-white font-bold text-base mb-2">{mode.label}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">{mode.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Degradation principle */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="flex items-center justify-center gap-4 mb-6 text-slate-600">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-700" />
            <span className="text-xs uppercase tracking-widest font-semibold">Graceful Degradation</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-700" />
          </div>
          <p className="text-slate-300 text-lg leading-relaxed">
            As connectivity improves, Citinet scales up. As it degrades — storm, outage,
            infrastructure failure — it steps down gracefully through available modes.{' '}
            <span className="text-white font-semibold">The community keeps functioning.</span>
          </p>
          <p className="text-slate-500 mt-4 text-sm">
            This is what it means to own your infrastructure. Not dependent on any single provider.
            Not a single point of failure. Resilient by design.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
