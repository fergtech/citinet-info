import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { MessageCircle, Map, ShoppingBag, HardDrive, Compass, Users } from 'lucide-react';

export function SpacesShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const features = [
    {
      icon: MessageCircle,
      name: "Discussions & Messaging",
      description: "Threaded posts in four categories — announcements, discussions, projects, and requests. Plus DMs and group conversations, all private and community-owned.",
      image: "https://images.unsplash.com/photo-1730342582682-1447653f62b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBnYXRoZXJpbmclMjBuZWlnaGJvcmhvb2QlMjBwZW9wbGUlMjBjb2xsYWJvcmF0aW5nfGVufDF8fHx8MTc3MTYxOTU2NXww&ixlib=rb-4.1.0&q=80&w=1080",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Map,
      name: "Community Atlas",
      description: "A shared map your whole community contributes to. Pin meetup spots, safety alerts, points of interest, and more — built on OpenStreetMap, no Google required.",
      image: "https://images.unsplash.com/photo-1770938474403-a16353e18bf3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZWlnaGJvcmhvb2QlMjBzdHJlZXQlMjBhZXJpYWwlMjB2aWV3fGVufDF8fHx8MTc3MTYxOTU2Nnww&ixlib=rb-4.1.0&q=80&w=1080",
      color: "from-emerald-500 to-green-500"
    },
    {
      icon: ShoppingBag,
      name: "Exchange",
      description: "A local marketplace for goods and services. List what you have, browse what your neighbors offer. Trade, sell, or share — no platform taking a cut.",
      image: "https://images.unsplash.com/photo-1574740637579-9ca0a610e491?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZW9wbGUlMjBoYW5kcyUyMHRvZ2V0aGVyJTIwY29sbGFib3JhdGlvbnxlbnwxfHx8fDE3NzE2MTk1Njd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: HardDrive,
      name: "File Storage",
      description: "Upload, organize, and share files within your community. Toggle visibility per file. Everything is stored on the hub — on your hardware, in your control.",
      image: "https://images.unsplash.com/photo-1768467040905-aa7081a2a8a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWJyYXJ5JTIwYm9va3MlMjBjb21tdW5pdHklMjBzcGFjZXxlbnwxfHx8fDE3NzE2MTk1NjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Compass,
      name: "Discover Toolkit",
      description: "A curated directory of 24+ open-source tools across 8 categories — recommended by the community, moderated by your admin. Extend your hub however you need.",
      image: "https://images.unsplash.com/photo-1763633923615-a2cdebba3bfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBnYXJkZW4lMjB1cmJhbiUyMGZhcm1pbmd8ZW58MXx8fHwxNzcxNTczNjc0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      color: "from-green-500 to-lime-500"
    },
    {
      icon: Users,
      name: "Neighbors",
      description: "See who's on your hub. Browse member profiles, find your neighbors, and connect. Your hub, your people — no algorithmic feed deciding who you see.",
      image: "https://images.unsplash.com/photo-1644088379091-d574269d422f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwbmV0d29yayUyMGNvbm5lY3Rpb24lMjBhYnN0cmFjdHxlbnwxfHx8fDE3NzE2MTk1Njd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      color: "from-cyan-500 to-blue-500"
    }
  ];

  return (
    <section id="spaces" ref={ref} className="relative py-32 bg-gradient-to-b from-slate-950 via-blue-950/20 to-slate-950">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Everything Built
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Into Your Hub
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            Every hub ships with these features out of the box. No plugins, no subscriptions, no permissions to beg for.
          </p>

          {/* Example URL Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="inline-flex items-center gap-3 px-6 py-3 bg-slate-800/50 border border-white/20 rounded-full backdrop-blur-sm"
          >
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
            </div>
            <span className="text-slate-400 font-mono text-sm">
              <span className="text-emerald-400">your-machine</span><span className="text-slate-500">.tail</span><span className="text-cyan-400">a1b2c</span><span className="text-slate-500">.ts.net</span>
            </span>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl bg-slate-900 border border-white/10 hover:border-white/30 transition-all duration-300"
              >
                {/* Image Background */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-60 group-hover:opacity-70 transition-opacity`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />

                  {/* Icon */}
                  <div className="absolute top-4 right-4 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{feature.name}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
                </div>

                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-5 blur-xl`} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
