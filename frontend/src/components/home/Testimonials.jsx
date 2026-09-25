import React from "react";
import { motion } from "motion/react";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "Bet Snipe stopped me from chasing every single game. I lock in a few edges, ride with a plan, and live with the results. Way less chaos.",
    author: "User Alias",
    role: "Verified Member",
  },
  {
    quote:
      "The 20-minute alerts before tip have saved me from bad numbers more times than I can count. I treat it like my second set of eyes.",
    author: "User Alias",
    role: "Verified Member",
  },
];

const Testimonials = () => {
  return (
    <section
      id="results"
      className="py-8 sm:py-10 md:py-12 relative overflow-hidden"
    >
      <div className="section-padding-x max-w-[1600px] mx-auto">
        {/* Section Header */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          <span className="text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-widest text-[#00E676] block mb-1.5">
            REAL IMPACT
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
            Built for people who actually bet.
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-gray-300 max-w-2xl leading-relaxed">
            Bet Snipe is designed for bettors who already take this seriously
            and want a sharper, more disciplined process instead of pure
            guessing.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-8 mb-6">
          {testimonials.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative rounded-2xl bg-[#0f141b]/90 border border-white/10 p-5 sm:p-6 lg:p-7 flex flex-col justify-between hover:border-[#00E676]/40 transition-all duration-300 shadow-xl"
            >
              <div className="mb-4 sm:mb-5">
                <Quote className="w-7 h-7 sm:w-8 sm:h-8 text-[#00E676]/30 mb-3" />
                <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-normal italic">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-2.5 pt-4 border-t border-white/10">
                <div className="w-8 h-8 rounded-full bg-[#17202b] border border-[#00E676]/30 flex items-center justify-center font-bold text-xs text-[#00E676]">
                  BS
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white">
                    — {item.author}
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-400 font-medium">
                    {item.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Disclaimer */}
        <p className="text-[11px] sm:text-xs text-gray-400 max-w-2xl leading-relaxed">
          Testimonials are illustrative only and do not guarantee similar
          outcomes. Betting results vary and always involve risk.
        </p>
      </div>
    </section>
  );
};

export default Testimonials;
