import React from "react";
import { motion } from "motion/react";
import { Unlock, Zap } from "lucide-react";

const TodaysFreePick = () => {
  const scrollToPricing = () => {
    const el = document.querySelector("#pricing");
    if (el) {
      const topOffset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <section
      id="todays-pick"
      className="py-8 sm:py-10 md:py-12 relative overflow-hidden"
    >
      <div className="section-padding-x max-w-[1600px] mx-auto">
        {/* Section Header */}
        <div className="mb-6 sm:mb-8 md:mb-10">
          <span className="text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-widest text-[#00E676] block mb-1.5">
            FREE ACCESS
          </span>
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 mb-3">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Today's Free Pick
            </h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full badge-gradient text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-[0_0_12px_rgba(3,247,105,0.3)]">
              NO LOGIN REQUIRED
            </span>
          </div>
          <p className="text-xs sm:text-sm md:text-base text-gray-300 max-w-2xl leading-relaxed">
            One sharp read on the house so you can see how Bet Snipe attacks the
            board. Full slates, props, and pre-game alerts unlock with your
            7-day free trial.
          </p>
        </div>

        {/* Free Pick Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="relative rounded-2xl bg-[#0f141b]/95 border border-white/10 p-5 sm:p-7 md:p-8 shadow-2xl backdrop-blur-xl mb-6 sm:mb-8 hover:border-[#03f769]/40 transition-all duration-300"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 sm:pb-5 border-b border-white/10 mb-4 sm:mb-5">
            <div>
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-0.5">
                Featured Play
              </span>
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-white">
                Example: Warriors vs Kings
              </h3>
            </div>
            <div className="self-start sm:self-auto">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#03f769]/10 border border-[#03f769]/30 text-xs font-bold text-[#03f769] shadow-[0_0_12px_rgba(3,247,105,0.15)]">
                <Zap className="w-3.5 h-3.5 fill-current" />
                Confidence: 79%
              </span>
            </div>
          </div>

          <div>
            <div className="text-base sm:text-xl md:text-2xl font-extrabold text-[#03f769] tracking-wide mb-2">
              Kings +4.5 • -110
            </div>
            <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed max-w-3xl">
              Data models flag value with pace, matchup, and public vs sharp
              splits pointing to an inflated line. This is the type of edge Bet
              Snipe hunts daily.
            </p>
          </div>
        </motion.div>

        {/* Unlock Button */}
        <div className="flex justify-center">
          <button
            onClick={scrollToPricing}
            className="group inline-flex items-center justify-center gap-2.5 px-8 py-3.5 sm:px-10 sm:py-4 text-xs sm:text-sm md:text-base font-bold btn-primary-gradient rounded-full cursor-pointer uppercase tracking-wider"
          >
            <Unlock className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
            <span>UNLOCK 7-DAY FULL ACCESS</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default TodaysFreePick;
