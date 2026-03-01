import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { CheckCircle2, Cloud } from 'lucide-react';

export function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const steps = [
    { title: "Name Your Hub", description: "Choose a unique identity for your community — your hub's address on the network" },
    { title: "Pick Your Hardware", description: "Any machine works: a spare PC, Raspberry Pi, home server, NAS, or cloud VM" },
    { title: "Run the Hub Stack", description: "Docker Compose brings up all hub services in minutes — storage, users, API, discussions" },
    { title: "Choose Your Gateway", description: "Make your hub reachable your way: Tailscale, Cloudflare, a reverse proxy, or local-only — your call" },
    { title: "Create Admin Account", description: "Secure your hub with sovereign credentials and configure roles and access" },
    { title: "Invite Your Community", description: "Share your hub URL and let your neighbors join. Go live and take control." }
  ];

  return (
    <section id="how-it-works" ref={ref} className="relative py-32 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            How Citinet
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Choose your hardware. Pick your connectivity. Own your community.
          </p>
        </motion.div>

        {/* Steps Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500 via-blue-500 to-emerald-500" />

          {/* Steps */}
          <div className="space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative flex items-start gap-6 group"
              >
                {/* Step number indicator */}
                <div className="relative z-10 flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-cyan-500/50 group-hover:border-cyan-400 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                    <span className="text-xl font-bold text-cyan-400">{index + 1}</span>
                  </div>
                </div>

                {/* Step content */}
                <div className="flex-1 pt-2">
                  <div className="bg-slate-800/30 border border-white/10 rounded-xl p-6 group-hover:border-cyan-500/50 group-hover:bg-slate-800/50 transition-all duration-300">
                    <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                      {step.title}
                      {index === 5 && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                    </h3>
                    <p className="text-slate-400">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Callout boxes */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20 max-w-3xl mx-auto space-y-6"
        >
          {/* Infrastructure agnostic callout */}
          <div className="relative bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-8 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
            <div className="relative z-10 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                <Cloud className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Globally Accessible, Locally Owned
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  Your hub gets a stable identity at{' '}
                  <code className="px-2 py-1 bg-slate-800/50 rounded text-cyan-400 font-mono">{"{name}"}.citinet.cloud</code>{' '}
                  — reachable worldwide via whatever gateway your community chooses. Tailscale, Cloudflare, a reverse proxy, or anything else. No single provider required. No lock-in. Ever.
                </p>
              </div>
            </div>
          </div>

          {/* Coming soon: launcher teaser */}
          <div className="relative bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 rounded-2xl p-6 overflow-hidden">
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm mb-0.5">
                  Not a sysadmin? No problem. <span className="text-emerald-400">Coming soon:</span> a one-click hub launcher.
                </p>
                <p className="text-slate-400 text-sm leading-relaxed">
                  A simple desktop tool that installs Docker, pulls the Citinet hub stack, and configures your network automatically — no terminal required.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}