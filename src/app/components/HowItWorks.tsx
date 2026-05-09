import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { Download, Share2, Shield } from 'lucide-react';

const STEPS = [
  {
    Icon: Download,
    title: 'Install a Hub',
    body: 'Download a script. Run it on any PC. Your hub is live in minutes.',
    accent: 'from-blue-500 to-violet-500',
  },
  {
    Icon: Share2,
    title: 'Invite Neighbors',
    body: 'Share your hub URL. Neighbors open a browser and sign up in seconds. No app download. No payment. No waiting.',
    accent: 'from-violet-500 to-purple-500',
  },
  {
    Icon: Shield,
    title: 'Stay Independent',
    body: 'Your data never leaves your machine. No company has access. Your community, your rules.',
    accent: 'from-purple-500 to-pink-500',
  },
];

export function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="how-it-works" ref={ref} className="relative py-28 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="max-w-5xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Up and running
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              in three steps.
            </span>
          </h2>
          <p className="text-xl text-slate-400">No sysadmin. No cloud account. No permission to ask for.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4">
          {STEPS.map(({ Icon, title, body, accent }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative z-10 flex flex-col items-center text-center"
            >
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${accent} p-[2px] mb-6 shrink-0`}>
                <div className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center">
                  <Icon className="w-9 h-9 text-white" />
                </div>
              </div>

              <span className="text-xs text-slate-500 font-semibold uppercase tracking-widest mb-2">
                Step {i + 1}
              </span>
              <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm max-w-xs">{body}</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center text-slate-600 text-sm mt-14"
        >
          Windows, macOS, Linux, Raspberry Pi. If it runs Docker, it runs a hub.
        </motion.p>
      </div>
    </section>
  );
}
