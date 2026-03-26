import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { Rocket, Network, Globe, Sparkles, Github } from 'lucide-react';

export function Roadmap() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const phases = [
    {
      icon: Rocket,
      phase: "Mission 1",
      title: "The Foundation",
      status: "Live",
      features: [
        "Hub creation wizard & setup script",
        "Discussions, feed & threaded replies",
        "Marketplace, files & community atlas",
        "Member profiles & civic identity pages",
        "Tailscale Funnel for public HTTPS access"
      ],
      color: "from-cyan-500 to-blue-500",
      statusColor: "bg-cyan-500"
    },
    {
      icon: Network,
      phase: "Mission 2",
      title: "Depth & Identity",
      status: "Building",
      features: [
        "Spaces — sub-communities within a hub",
        "Profile pages as personal civic landing pages",
        "Hub-app ecosystem (open integration contract)",
        "Early hub-to-hub content sharing",
        "Hub registry & public discovery"
      ],
      color: "from-blue-500 to-purple-500",
      statusColor: "bg-blue-500"
    },
    {
      icon: Globe,
      phase: "Mission 3",
      title: "Federation & Resilience",
      status: "Coming",
      features: [
        "Full federation protocol — hubs as peers",
        "Portable identity across hubs",
        "Local-first & offline-capable operation",
        "Community search (no third-party index)",
        "Optional local AI — private, on your hardware"
      ],
      color: "from-purple-500 to-emerald-500",
      statusColor: "bg-purple-500"
    },
    {
      icon: Sparkles,
      phase: "The Endgame",
      title: "The Citizens' Web",
      status: "Vision",
      features: [
        "Community wireless co-ops (PtP/PtMP radio)",
        "Multiple transport modes — internet to mesh",
        "Graceful degradation down to LoRa/Meshtastic",
        "True application-layer mesh between hub peers",
        "Full stack — from software to antenna — community-owned"
      ],
      color: "from-emerald-500 to-cyan-500",
      statusColor: "bg-emerald-500"
    }
  ];

  return (
    <section id="roadmap" ref={ref} className="relative py-32 bg-slate-950 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-cyan-500 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-emerald-500 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Where the Movement
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Is Going
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Our roadmap is ambitious, transparent, and community-driven. 
            Together, we're building the future of digital sovereignty.
          </p>
        </motion.div>

        {/* Roadmap - Horizontal on desktop, vertical on mobile */}
        <div className="relative">
          {/* Connection line - horizontal on large screens */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-1">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 2, delay: 0.5 }}
              className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-emerald-500 rounded-full"
              style={{ transformOrigin: 'left' }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-6">
            {phases.map((phase, index) => {
              const Icon = phase.icon;
              return (
                <motion.div
                  key={phase.phase}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="relative"
                >
                  {/* Phase indicator dot */}
                  <div className="hidden lg:flex absolute top-20 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-slate-900 border-4 border-white/20 z-20">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={isInView ? { scale: 1 } : {}}
                      transition={{ duration: 0.4, delay: 0.5 + index * 0.2 }}
                      className={`w-full h-full rounded-full ${phase.statusColor}`}
                    />
                  </div>

                  {/* Card */}
                  <div className="relative lg:pt-20 mt-8 lg:mt-0">
                    <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-white/30 transition-all duration-300 group h-full">
                      {/* Glow effect */}
                      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl bg-gradient-to-br ${phase.color} -z-10`} />

                      {/* Icon */}
                      <div className={`w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br ${phase.color} p-[2px] group-hover:scale-110 transition-transform duration-300`}>
                        <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center">
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="text-center mb-4">
                        <div className={`inline-block px-3 py-1 rounded-full ${phase.statusColor} bg-opacity-20 border border-current mb-3`}>
                          <span className="text-xs font-semibold uppercase tracking-wide">{phase.status}</span>
                        </div>
                        <p className="text-sm text-slate-400 mb-1">{phase.phase}</p>
                        <h3 className="text-xl font-bold text-white">{phase.title}</h3>
                      </div>

                      {/* Features list */}
                      <ul className="space-y-2">
                        {phase.features.map((feature, fIndex) => (
                          <motion.li
                            key={fIndex}
                            initial={{ opacity: 0, x: -10 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.4, delay: 0.8 + index * 0.2 + fIndex * 0.05 }}
                            className="flex items-start gap-2 text-sm text-slate-400"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-cyan-400 to-emerald-400 mt-1.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="mt-20 text-center"
        >
          <p className="text-lg text-slate-300 mb-6">
            Want to influence the roadmap?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-105">
              Join the Community
            </button>
            <a
              href="https://github.com/fergtech/citinet-web"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2.5 px-8 py-4 bg-white/5 border border-white/15 text-slate-300 hover:text-white hover:border-white/30 hover:bg-white/10 rounded-xl font-semibold transition-all duration-300"
            >
              <Github className="w-5 h-5" />
              View on GitHub
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}