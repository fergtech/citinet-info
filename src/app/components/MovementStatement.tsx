import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { Shield, Users, Sprout, Lock } from 'lucide-react';

export function MovementStatement() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const values = [
    {
      icon: Shield,
      title: "Digital Sovereignty",
      description: "Restore control over your data and digital presence. No more platform lock-in."
    },
    {
      icon: Users,
      title: "Community Ownership",
      description: "Communities host their own cloud, social feeds, and digital infrastructure."
    },
    {
      icon: Sprout,
      title: "Local Resilience",
      description: "Build networks that survive when centralized platforms fail or change course."
    },
    {
      icon: Lock,
      title: "Privacy by Default",
      description: "Your data stays in your community. No surveillance, no algorithmic manipulation."
    }
  ];

  return (
    <section id="movement" ref={ref} className="relative py-32 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            More Than a Product.
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              A Movement for Your Future.
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Citinet restores digital sovereignty, privacy, local resilience, and community ownership.
            The internet was meant to be ours — let's take it back.
          </p>
        </motion.div>

        {/* Timeline/Values Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 h-full hover:border-cyan-500/50 transition-all duration-300">
                  {/* Glowing effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-emerald-500/0 group-hover:from-cyan-500/5 group-hover:to-emerald-500/5 rounded-2xl transition-all duration-300" />
                  
                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-7 h-7 text-cyan-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{value.description}</p>
                  </div>
                </div>

                {/* Vertical timeline connector for larger screens */}
                {index < values.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 right-0 w-8 h-px bg-gradient-to-r from-cyan-500/50 to-transparent transform translate-x-full" />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Manifesto Quote */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 text-center"
        >
          <blockquote className="text-2xl md:text-3xl font-bold text-white italic max-w-4xl mx-auto leading-relaxed">
            "When communities control their infrastructure,
            <br />
            <span className="text-emerald-400">they control their future."</span>
          </blockquote>
        </motion.div>
      </div>
    </section>
  );
}