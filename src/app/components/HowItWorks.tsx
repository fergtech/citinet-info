import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { Download, Share2, ShieldCheck } from 'lucide-react';

const STEPS = [
  {
    Icon: Download,
    title: 'One organizer sets up the hub',
    body: 'Pick a hub type in the setup wizard (HOA, group, neighborhood watch, and more), download the script for your OS, and run it. It installs Docker, writes the config, and starts the hub with automatic HTTPS.',
  },
  {
    Icon: Share2,
    title: 'Members just open a browser',
    body: 'Share the hub’s web address. Members request an account from any phone or laptop and the admin approves them. Nothing to install and nothing to pay.',
  },
  {
    Icon: ShieldCheck,
    title: 'It stays healthy and yours',
    body: 'Nightly backups, automatic restarts, and admin alerts keep it running. Messages, notes, and files are end-to-end encrypted, and anyone can export their data or move to another hub.',
  },
];

export function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="how-it-works" ref={ref} className="relative py-20 bg-background border-t border-border">
      <div className="max-w-[1248px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12 max-w-2xl"
        >
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-4">Getting started</p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-3">
            One person sets it up. Everyone else just opens a browser.
          </h2>
          <p className="text-lg text-muted-foreground">No cloud account to create. No domain to buy.</p>
        </motion.div>

        <ol className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STEPS.map(({ Icon, title, body }, i) => (
            <motion.li
              key={title}
              initial={{ opacity: 0, y: 8 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-card border border-border rounded-lg p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="w-9 h-9 rounded-md border border-border bg-background flex items-center justify-center">
                  <Icon className="w-4 h-4 text-foreground" strokeWidth={1.5} />
                </div>
                <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
            </motion.li>
          ))}
        </ol>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="font-mono text-xs text-muted-foreground mt-8"
        >
          Hub runs on Windows, macOS, Linux, or Raspberry Pi. If it runs Docker, it runs a hub.
        </motion.p>
      </div>
    </section>
  );
}
