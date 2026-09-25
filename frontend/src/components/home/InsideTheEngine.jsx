import React from "react";
import { motion } from "motion/react";
import {
  Brain,
  TrendingUp,
  Layers,
  Timer,
  Gauge,
  Smartphone,
} from "lucide-react";

const engineFeatures = [
  {
    title: "Daily Model-Backed Picks",
    description:
      "Not just hype. Each play is backed by data models, matchup logic, and market-read discipline so every pick has a reason to be on the board.",
    icon: Brain,
  },
  {
    title: "Line Movement & Market Intelligence",
    description:
      "Our system watches the board like a sharp: steam moves, injury impact, pace projections, and betting momentum before most bettors react.",
    icon: TrendingUp,
  },
  {
    title: "Props, Totals & Situational Angles",
    description:
      "Beyond basic sides. Bet Snipe digs into props, alt lines, pace, and team-style matchups when the numbers show a real edge.",
    icon: Layers,
  },
  {
    title: "20-Minute Pre-Game Rescan",
    description:
      "Right before tip, kick-off, or first pitch, the engine re-checks key games for late news, rotation changes, and sharp action that can flip the edge.",
    icon: Timer,
  },
  {
    title: "Confidence Tiers & Edge Indicators",
    description:
      "Not every play deserves the same unit size. Confidence tiers help you level your decisions instead of betting based on emotion.",
    icon: Gauge,
  },
  {
    title: "One Account. App + Web Synced.",
    description:
      "Access your dashboard from phone or desktop with the same membership, same picks, and same alerts tied to one Bet Snipe account.",
    icon: Smartphone,
  },
];

const InsideTheEngine = () => {
  return (
    <section className="py-8 sm:py-10 md:py-12 relative overflow-hidden">
      <div className="section-padding-x max-w-[1600px] mx-auto">
        {/* Section Header */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          <span className="text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-widest text-[#00E676] block mb-1.5">
            INSIDE THE ENGINE
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
            AI-enhanced, not AI-only.
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-gray-300 max-w-2xl leading-relaxed">
            Bet Snipe uses models, data feeds, and betting discipline to surface
            edges. It's built to help you think and act sharper, not to replace
            you.
          </p>
        </div>

        {/* 6 Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {engineFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className="group rounded-2xl bg-[#0f141b]/80 border border-white/10 p-5 sm:p-6 hover:border-[#00E676]/40 hover:bg-[#131922] transition-all duration-300 shadow-md"
              >
                <div className="w-10 h-10 rounded-xl bg-[#00E676]/10 border border-[#00E676]/20 flex items-center justify-center text-[#00E676] mb-4 group-hover:scale-105 group-hover:bg-[#00E676]/20 transition-all">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-2 group-hover:text-[#00E676] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default InsideTheEngine;
