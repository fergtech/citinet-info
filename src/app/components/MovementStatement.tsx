import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { Cloud, PersonStanding, House } from 'lucide-react';

const PROBLEMS = [
  { Icon: Cloud,         text: "Your photos live on a mega-corporation's servers." },
  { Icon: PersonStanding, text: "Billions are connected online. Few are connected locally." },
  { Icon: House,         text: "The internet has grown & improved. Many communities have not." },
];

export function MovementStatement() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section id="movement" ref={ref} className="relative py-24 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="max-w-5xl mx-auto px-6">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {PROBLEMS.map(({ Icon, text }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="bg-slate-800/40 border border-red-500/10 rounded-2xl p-8 text-center"
            >
              <div className="w-14 h-14 mx-auto mb-5 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <Icon className="w-7 h-7 text-red-400/80" />
              </div>
              <p className="text-white font-medium text-lg leading-snug">{text}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center"
        >
          <p className="text-3xl md:text-4xl font-bold text-white">
            It doesn't have to be this way.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
