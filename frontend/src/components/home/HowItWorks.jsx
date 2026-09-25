import React from "react";
import { motion } from "motion/react";
import { UserCheck, Target, Crosshair } from "lucide-react";

const steps = [
  {
    step: "STEP 1",
    title: "Start Your 7-Day Free Trial",
    description:
      "Create your account in seconds. No up-front charge. Test-drive Bet Snipe across NBA, NFL, MLB, NHL, UFC, and more while your trial is live.",
    icon: UserCheck,
  },
  {
    step: "STEP 2",
    title: "We Attack the Board",
    description:
      "Our engine blends data models, line movement, injuries, and situational angles. You get focused slates instead of noise and hype.",
    icon: Target,
  },
  {
    step: "STEP 3",
    title: "You Fire With Intent",
    description:
      "You still place your own bets at your sportsbook. Bet Snipe just makes sure you're not walking in blind. You choose what to fire on and how heavy to go within your own bankroll rules.",
    icon: Crosshair,
  },
];

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="py-8 sm:py-10 md:py-12 relative overflow-hidden"
    >
      <div className="section-padding-x max-w-[1600px] mx-auto">
        {/* Section Header */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          <span className="text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-widest text-[#00E676] block mb-1.5">
            HOW BET SNIPE WORKS
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
            Built for bettors who are tired of guessing.
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-gray-300 max-w-2xl leading-relaxed">
            Bet Snipe doesn't scream &quot;locks.&quot; It hunts for edges.
            AI-enhanced models, live odds feeds, and sharp-style logic combine
            into one aggressive, focused feed.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group relative rounded-2xl bg-[#0f141b]/90 border border-white/10 p-5 sm:p-6 lg:p-7 flex flex-col justify-between hover:border-[#00E676]/40 transition-all duration-300 shadow-xl"
              >
                <div>
                  {/* Step Badge */}
                  <div className="flex items-center justify-between mb-4 sm:mb-5">
                    <span className="text-[10px] sm:text-xs font-extrabold tracking-widest text-gray-400 bg-white/5 px-2.5 py-1 rounded border border-white/10 uppercase">
                      {item.step}
                    </span>
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#00E676]/10 border border-[#00E676]/20 flex items-center justify-center text-[#00E676] group-hover:scale-105 group-hover:bg-[#00E676]/20 transition-all">
                      <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    </div>
                  </div>

                  {/* Step Title */}
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2 group-hover:text-[#00E676] transition-colors">
                    {item.title}
                  </h3>

                  {/* Step Description */}
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
