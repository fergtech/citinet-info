import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { CheckCircle2, Globe } from 'lucide-react';

export function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const steps = [
    { title: "Open the Web Portal", description: "Visit the Citinet web portal and launch the Hub Creation Wizard — no account required to get started." },
    { title: "Name Your Hub", description: "Choose a name, a URL slug, and describe your community. This becomes your hub's identity." },
    { title: "Download the Setup Script", description: "The wizard generates a one-click script for your OS — Windows, macOS, or Linux." },
    { title: "Run the Script", description: "Open a terminal and run it. Docker and Tailscale install automatically. No technical knowledge required." },
    { title: "Your Hub Spins Up", description: "Four containers start on your machine: API, PostgreSQL database, MinIO file storage, and Redis cache." },
    { title: "Enable Public Access", description: "Activate Tailscale Funnel to get a secure public HTTPS URL — no router config, no port forwarding, no hassle." },
    { title: "Create the Admin Account", description: "The first person to register on the hub automatically becomes the admin. That's you." },
    { title: "Invite Your Community", description: "Share your hub URL and start building. All data stays on your machine — always." }
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
            From Zero to Hub
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              in Minutes
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            The web portal walks you through everything. One script does the rest.
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
                      {index === steps.length - 1 && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
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
          {/* Gateway callout */}
          <div className="relative bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-8 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
            <div className="relative z-10 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                <Globe className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Globally Accessible, Locally Owned
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  Tailscale Funnel gives your hub a permanent public HTTPS URL — no port forwarding, no firewall rules, no cloud middleman. Prefer Cloudflare or a reverse proxy? Those work too. No single provider required. No lock-in. Ever.
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
