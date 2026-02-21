import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { HardDrive, MessageCircle, Radio, Calendar, ShoppingBag, Shield, Network, Zap } from 'lucide-react';

export function FeaturesGrid() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const features = [
    {
      icon: HardDrive,
      title: "Local File Storage",
      description: "Upload, organize, and share files within your community; or just for yourself. Your data stays on your hub.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: MessageCircle,
      title: "Discussions & Messaging",
      description: "Threaded conversations, direct messages, and group chats — all private and community-owned.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Radio,
      title: "Social Microfeeds",
      description: "Community timelines and activity feeds — no algorithms, no ads, just your neighbors.",
      gradient: "from-emerald-500 to-green-500"
    },
    {
      icon: Calendar,
      title: "Events & Calendars",
      description: "Schedule community events, send reminders, and track RSVPs — all in one place.",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: ShoppingBag,
      title: "Marketplace & Resources",
      description: "Share tools, exchange services, and support local commerce within your community.",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      icon: Shield,
      title: "Spaces & Roles",
      description: "Granular permissions and access control. Create public spaces, private groups, and everything between.",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: Network,
      title: "Federated Networking",
      description: "Connect with other Citinet hubs. Share resources across communities while maintaining sovereignty.",
      gradient: "from-cyan-500 to-blue-500"
    },
    {
      icon: Zap,
      title: "Real-time Sync",
      description: "Lightning-fast synchronization across all your devices. Online or offline, your data is always there.",
      gradient: "from-pink-500 to-rose-500"
    }
  ];

  return (
    <section id="features" ref={ref} className="relative py-32 bg-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Community Cloud
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Essentials
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Everything your community needs to thrive digitally — 
            without surrendering to Big Tech.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group relative"
              >
                <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 h-full hover:border-white/30 transition-all duration-300 overflow-hidden">
                  {/* Animated gradient background on hover */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${feature.gradient}`} />
                  
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} p-[2px] mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text transition-all duration-300"
                        style={{
                          backgroundImage: `linear-gradient(to right, ${feature.gradient.includes('blue-500') ? '#3b82f6, #06b6d4' : 
                                                                      feature.gradient.includes('purple-500') ? '#a855f7, #ec4899' :
                                                                      feature.gradient.includes('emerald-500') ? '#10b981, #22c55e' :
                                                                      feature.gradient.includes('orange-500') ? '#f97316, #ef4444' :
                                                                      feature.gradient.includes('yellow-500') ? '#eab308, #f97316' :
                                                                      feature.gradient.includes('indigo-500') ? '#6366f1, #a855f7' :
                                                                      feature.gradient.includes('cyan-500') ? '#06b6d4, #3b82f6' : '#ec4899, #f43f5e'})`
                        }}>
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="text-slate-400 text-lg">
            And that's just the beginning. <span className="text-emerald-400 font-semibold">The roadmap is community-driven.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}