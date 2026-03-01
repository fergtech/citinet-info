import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { Server, Smartphone, User, ArrowRight } from 'lucide-react';

export function NetworkExplainer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const nodes = [
    {
      icon: Server,
      title: "Hub Node",
      subtitle: "Community‑Run Server",
      description: "A spare PC, Raspberry Pi, home server, or VPS — any machine can be a hub. The heart of your community's digital sovereignty.",
      color: "from-cyan-500 to-blue-500",
      glowColor: "cyan"
    },
    {
      icon: Smartphone,
      title: "Web Client",
      subtitle: "Browser‑Based Participant",
      description: "Access your community hub from any device, any browser. No installation required — just open citinet.cloud and connect.",
      color: "from-blue-500 to-purple-500",
      glowColor: "blue"
    },
    {
      icon: User,
      title: "Personal Node",
      subtitle: "Sovereign Personal Copy",
      description: "Your own data, portable and owned entirely by you. Sync across devices, back it up, keep it independent of any single hub.",
      color: "from-purple-500 to-emerald-500",
      glowColor: "emerald"
    }
  ];

  return (
    <section id="network" ref={ref} className="relative py-32 bg-slate-950">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            A Network of
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Citizen‑Owned Networks
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Three types of nodes working together to create a resilient, 
            community-controlled digital infrastructure.
          </p>
        </motion.div>

        {/* Network Diagram */}
        <div className="relative">
          {/* Connection Lines */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="h-full bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"
              style={{ transformOrigin: 'left' }}
            />
          </div>

          {/* Nodes */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 relative z-10">
            {nodes.map((node, index) => {
              const Icon = node.icon;
              return (
                <motion.div
                  key={node.title}
                  initial={{ opacity: 0, scale: 0.8, y: 30 }}
                  animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.2 }}
                  className="relative group"
                >
                  {/* Card */}
                  <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-white/10 rounded-3xl p-8 h-full hover:border-white/30 transition-all duration-500">
                    {/* Glow effect */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-xl bg-gradient-to-br ${node.color}`} 
                         style={{ zIndex: -1 }} 
                    />
                    
                    {/* Icon */}
                    <div className={`relative w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${node.color} p-[2px] group-hover:scale-110 transition-transform duration-300`}>
                      <div className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center">
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-white mb-2">{node.title}</h3>
                      <p className="text-sm font-semibold text-transparent bg-gradient-to-r bg-clip-text mb-4" 
                         style={{ 
                           backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
                           '--tw-gradient-from': node.glowColor === 'cyan' ? '#06b6d4' : node.glowColor === 'blue' ? '#3b82f6' : '#10b981',
                           '--tw-gradient-to': node.glowColor === 'cyan' ? '#3b82f6' : node.glowColor === 'blue' ? '#a855f7' : '#06b6d4',
                           '--tw-gradient-stops': 'var(--tw-gradient-from), var(--tw-gradient-to)'
                         } as React.CSSProperties}>
                        {node.subtitle}
                      </p>
                      <p className="text-slate-400 leading-relaxed">{node.description}</p>
                    </div>
                  </div>

                  {/* Arrow connector for large screens */}
                  {index < nodes.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
                      className="hidden lg:flex absolute top-1/2 right-0 -mr-10 -mt-6 text-cyan-400"
                    >
                      <ArrowRight className="w-8 h-8" />
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-20 text-center"
        >
          <p className="text-lg text-slate-400 mb-4">Each node type plays a critical role</p>
          <p className="text-2xl text-white font-semibold">
            Together, they create an <span className="text-emerald-400">unstoppable network</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}