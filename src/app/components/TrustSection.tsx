import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { DatabaseBackup, HeartPulse, PackageOpen, Lock } from 'lucide-react';

// Every claim here is backed by the hub stack (citinet-backup, the admin
// sidecar's watchdog/backup-health checks, account export/import, and the
// client-side E2E layer). Keep it that way: don't add a bullet unless it ships.
const PILLARS = [
  {
    Icon: DatabaseBackup,
    title: 'Backups you can restore',
    points: [
      'Nightly database and file backups, rotated automatically.',
      'Optional encrypted off-site copies to Backblaze B2, S3, SFTP and more, so losing the machine isn’t losing the community.',
      'A weekly restore drill loads the newest backup into a throwaway database to prove it actually works.',
    ],
  },
  {
    Icon: HeartPulse,
    title: 'Keeps itself running',
    points: [
      'A watchdog restarts services that failed to come up, for example after a power cut or reboot.',
      'Restart loops, stale backups, and other problems show up in Hub Management → System and are emailed to the admin.',
    ],
  },
  {
    Icon: PackageOpen,
    title: 'Take your data and leave',
    points: [
      'Download your own data as a zip: everything, or just your files, messages, notes, or map pins. It’s decrypted on your device.',
      'Move to another hub with one encrypted account package containing your data and keys. You choose what comes along.',
    ],
  },
  {
    Icon: Lock,
    title: 'Encryption, precisely',
    points: [
      'Direct messages, notes, and file contents are encrypted in your browser before they reach the hub. The server stores only ciphertext, so even the hub admin can’t read them.',
      'Not end-to-end encrypted: feed posts, anything marked public, the AI assistant (it has to read your text to answer), and metadata such as who messaged whom and when.',
      'Keep your recovery phrase. Without it, encrypted content can’t be recovered by anyone.',
    ],
  },
];

export function TrustSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section id="trust" ref={ref} className="relative py-20 bg-muted/40 border-t border-border">
      <div className="max-w-[1248px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12 max-w-2xl"
        >
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-4">Reliability &amp; portability</p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-3 leading-tight">
            What if the hub machine dies?
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            A community can't depend on something fragile. Hubs are built to be backed up, to recover, and to be left. Nobody is locked in, including the admin.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PILLARS.map(({ Icon, title, points }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 8 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="bg-card border border-border rounded-lg p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-md border border-border bg-background flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-foreground" strokeWidth={1.5} />
                </div>
                <h3 className="text-base font-semibold text-foreground">{title}</h3>
              </div>
              <ul className="space-y-2.5">
                {points.map((p) => (
                  <li key={p} className="flex gap-2.5 text-sm text-muted-foreground leading-relaxed">
                    <span className="text-border mt-px select-none">&ndash;</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
