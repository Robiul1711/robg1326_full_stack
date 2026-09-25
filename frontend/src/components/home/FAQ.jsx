import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, HelpCircle } from "lucide-react";

const leftColumnFaqs = [
  {
    id: 0,
    q: "Is Bet Snipe a sportsbook?",
    a: "No. Bet Snipe does not accept or place bets. We provide analysis, predictions, and informational content. You place your own wagers through your preferred legal sportsbook.",
  },
  {
    id: 1,
    q: "How does the 50% off holiday special work?",
    a: "Standard pricing is shown crossed out on the site. When you start your 7-day free trial through the Bet Snipe app before January 1, you lock in the 50% off monthly rate shown in gold for as long as you keep your membership active.",
  },
  {
    id: 2,
    q: "What happens after my 7-day trial?",
    a: "If you like what you see and don't cancel, your membership will roll into a paid subscription at the tier you selected, using your locked-in rate if you activated during the holiday promo. If you cancel before your trial ends, you will not be billed.",
  },
];

const rightColumnFaqs = [
  {
    id: 3,
    q: "Do I have to pay to sign up?",
    a: "No. Creating an account is free. When you activate a membership tier, your 7-day free trial begins. You can cancel before the trial ends if you don't want to continue.",
  },
  {
    id: 4,
    q: "Do you guarantee profits or a certain win rate?",
    a: "No. Sports betting always carries risk. No system, model, or person can guarantee outcomes. Bet Snipe is for informational and entertainment purposes only, and past performance never guarantees future results.",
  },
  {
    id: 5,
    q: "Which sports do you focus on?",
    a: "We focus on major markets: NBA, NFL, MLB, NHL, UFC, and select top-tier soccer. Coverage may expand over time as the platform grows.",
  },
];

const FAQ = () => {
  // Allow multiple or single open state without blank gaps
  const [openIds, setOpenIds] = useState([0, 3]);

  const toggleFAQ = (id) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const renderFAQCard = (item) => {
    const isOpen = openIds.includes(item.id);
    return (
      <div
        key={item.id}
        className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
          isOpen
            ? "bg-[#0e141c] border-[#00E676]/35 shadow-[0_0_20px_rgba(0,230,118,0.08)]"
            : "bg-[#0b0f15]/90 border-white/10 hover:border-white/20 hover:bg-[#0e131a]"
        }`}
      >
        <button
          onClick={() => toggleFAQ(item.id)}
          className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left cursor-pointer focus:outline-none group"
        >
          <span className="text-sm sm:text-base font-bold text-white group-hover:text-[#00E676] transition-colors leading-snug">
            {item.q}
          </span>
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
              isOpen
                ? "rotate-180 text-black bg-[#00E676] shadow-[0_0_10px_rgba(0,230,118,0.5)]"
                : "text-gray-400 bg-white/5 border border-white/10 group-hover:text-white group-hover:border-white/25"
            }`}
          >
            <ChevronDown className="w-4 h-4 stroke-[2.5]" />
          </div>
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-1 border-t border-white/5">
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-normal">
                  {item.a}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <section
      id="faq"
      className="py-10 sm:py-14 md:py-18 relative overflow-hidden"
    >
      <div className="section-padding-x max-w-[1600px] mx-auto">
        {/* Section Header */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          <span className="text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-widest text-[#00E676] block mb-1.5">
            FAQ
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Questions, answered.
          </h2>
        </div>

        {/* 2 Independent Columns Grid - Prevents Any Blank Space on Expand */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 items-start">
          {/* Left Column */}
          <div className="flex flex-col gap-4 sm:gap-5">
            {leftColumnFaqs.map(renderFAQCard)}
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-4 sm:gap-5">
            {rightColumnFaqs.map(renderFAQCard)}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
