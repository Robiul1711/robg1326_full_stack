import React from "react";
import { motion } from "motion/react";
import { ChevronDown, ArrowRight, Activity } from "lucide-react";

const Hero = () => {
  const scrollTo = (id) => {
    const el = document.querySelector(id);
    if (el) {
      const topOffset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <section className="relative pt-24 pb-8 sm:pt-28 sm:pb-10 md:pt-32 md:pb-12 lg:pt-36 lg:pb-14 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[450px] md:w-[600px] h-[300px] sm:h-[450px] md:h-[600px] bg-[#00E676]/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[250px] sm:w-[350px] md:w-[500px] h-[250px] sm:h-[350px] md:h-[500px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

      <div className="section-padding-x max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-center">
          {/* Left Content Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 flex flex-col items-start"
          >
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#111820] border border-[#00E676]/30 text-[11px] sm:text-xs md:text-sm font-semibold tracking-wider text-[#00E676] mb-4 sm:mb-5 shadow-[0_0_12px_rgba(0,230,118,0.12)]">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#00E676] animate-pulse shadow-[0_0_8px_#00E676]" />
              STOP GUESSING. START SNIPING.
            </div>

            {/* Main Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[46px] font-extrabold tracking-tight text-white leading-[1.18] mb-4 sm:mb-5">
              <span className="text-[#00E676] block filter drop-shadow-[0_0_18px_rgba(0,230,118,0.22)]">
                BET SNIPE
              </span>
              AGGRESSIVE, DATA-
              <br />
              BACKED SPORTS INTEL.
            </h1>

            {/* Description */}
            <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed max-w-xl mb-6 sm:mb-7 font-normal">
              Bet Snipe blends advanced data models, market movement tracking,
              and sharp-style logic to surface edges before the public reacts.
              You're still in control of the trigger — we just load the intel.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mb-6 sm:mb-7">
              <button
                onClick={() => scrollTo("#pricing")}
                className="group relative inline-flex items-center justify-center gap-2.5 px-6 py-3 sm:px-7 sm:py-3.5 text-xs sm:text-sm md:text-base font-bold btn-primary-gradient rounded-full cursor-pointer uppercase tracking-wider"
              >
                <span>START 7-DAY FREE TRIAL</span>
                <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5" />
              </button>

              <button
                onClick={() => scrollTo("#todays-pick")}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 sm:px-6 sm:py-3.5 text-xs sm:text-sm md:text-base font-semibold text-[#cdaa40] hover:text-white bg-[#13171f]/80 hover:bg-[#1c222e] border border-[#cdaa40]/40 hover:border-[#cdaa40] rounded-full cursor-pointer transition-all duration-300"
              >
                <span>VIEW TODAY'S FREE PICK</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Legal / Promo Notice */}
            <div className="text-[11px] sm:text-xs md:text-sm text-gray-400 max-w-xl leading-relaxed border-t border-white/10 pt-3.5 sm:pt-4">
              <p className="text-[#cdaa40] font-medium mb-0.5">
                Holiday Special: 50% off all tiers when you start in the app
                before January 1.
              </p>
              <p className="text-gray-400">
                No guaranteed results. For entertainment purposes only. You must
                be 18+ or of legal gambling age in your jurisdiction. Gamble
                responsibly.
              </p>
            </div>
          </motion.div>

          {/* Right Live Feed Intelligence Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-5"
          >
            <div className="relative rounded-2xl bg-[#0e1319]/90 border border-white/10 p-5 sm:p-6 shadow-2xl backdrop-blur-xl overflow-hidden group hover:border-[#00E676]/40 transition-all duration-300">
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4 sm:mb-5">
                <div>
                  <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-0.5">
                    Live Feed
                  </span>
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-white flex items-center gap-1.5">
                    Tonight's Board -{" "}
                    <span className="text-[#00E676]">AI Angles</span>
                  </h3>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00E676]/10 border border-[#00E676]/40 text-[10px] sm:text-xs font-bold text-[#00E676] uppercase tracking-wider shadow-[0_0_10px_rgba(0,230,118,0.2)]">
                  <Activity className="w-3 h-3 animate-spin" />
                  SNIPER FEED
                </span>
              </div>

              {/* Feed Item 1 */}
              <div className="space-y-2.5 pb-4 sm:pb-5 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00E676]" />
                    NBA • FEATURED EDGE
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold text-[#00E676] bg-[#00E676]/10 px-2 py-0.5 rounded border border-[#00E676]/20">
                    Confidence: 87%
                  </span>
                </div>

                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white">
                    Lakers vs Celtics
                  </h4>
                  <div className="text-xs sm:text-sm font-bold text-[#00E676] mt-0.5">
                    Lakers -3.5 • -110
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  Line opened -2.5 and steamed to -3.5 with sharp action. Models
                  and matchup logic still show value with projected pace and
                  half-court scoring edge.
                </p>
              </div>

              {/* Feed Item 2 */}
              <div className="space-y-2.5 pt-4 sm:pt-5 pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#cdaa40]" />
                    20-MINUTE UPDATE
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold text-[#00E676] bg-[#00E676]/10 px-2 py-0.5 rounded border border-[#00E676]/20">
                    Confidence: 82%
                  </span>
                </div>

                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white">
                    Heat vs Bucks
                  </h4>
                  <div className="text-xs sm:text-sm font-bold text-[#00E676] mt-0.5">
                    Total Over 222.5 • -108
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  Late injury news bumped pace projections and offensive usage.
                  Total climbed from 219.5 → 222.5, but the edge remains on the
                  over with the updated rotation mix.
                </p>
              </div>

              {/* Card Footer Tagline */}
              <div className="pt-3 border-t border-white/5 text-center">
                <p className="text-[11px] sm:text-xs font-medium text-gray-400 italic">
                  You control the trigger. We feed the intel.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
