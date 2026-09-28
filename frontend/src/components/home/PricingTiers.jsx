import React, { useState } from "react";
import { motion } from "motion/react";
import { Check, Sparkles, Loader2 } from "lucide-react";
import { useCreateCheckoutMutation, useGetCmsContentQuery } from "../../redux/api/apiSlice";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../../redux/slices/authSlice";

const DEFAULT_PRICING_PLANS = [
  {
    id: "sharps",
    name: "SHARPS",
    popular: false,
    originalPrice: "$29.99",
    discountPrice: "$14.99",
    price: 14.99,
    period: "/ month",
    subtitle:
      "For the disciplined everyday bettor who wants sharper straight plays.",
    features: [
      "Daily straight bets on major sports",
      "Core spreads, totals, and moneylines",
      "Model-backed confidence scores",
      "Standard alerts during your trial",
      "Access to app + web dashboard",
    ],
    cta: "START 7-DAY TRIAL — SHARPS",
    accessNote:
      "Sharps Access: After purchase, log in using the same email you paid with. Your Sharps picks unlock automatically.",
  },
  {
    id: "sniper-elite",
    name: "SNIPER ELITE",
    popular: true,
    originalPrice: "$79.99",
    discountPrice: "$39.99",
    price: 39.99,
    period: "/ month",
    subtitle:
      "For bettors who want full-board reads, props, and deeper angles.",
    features: [
      "Everything in Sharps",
      "Player props and alt lines",
      "Parlay edges & aggressive angles",
      "Enhanced notes and line-move context",
      "Priority game alerts during your trial",
    ],
    cta: "START 7-DAY TRIAL — ELITE",
    accessNote: null,
  },
  {
    id: "whale-access",
    name: "WHALE ACCESS",
    popular: false,
    originalPrice: "$199.99",
    discountPrice: "$99.99",
    price: 99.99,
    period: "/ month",
    subtitle: "For high-stakes players who take edges and process seriously.",
    features: [
      "Everything in Sniper Elite",
      "High-conviction premium plays",
      "Advanced positions & alt markets",
      "Priority support and future private tools",
      "Built for aggressive bankrolls",
    ],
    cta: "START 7-DAY TRIAL — WHALE",
    accessNote: null,
  },
];

const PricingTiers = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { data: cmsRes } = useGetCmsContentQuery();
  const [createCheckout, { isLoading: isCheckingOut }] = useCreateCheckoutMutation();
  const [selectedPlanName, setSelectedPlanName] = useState(null);

  const packages =
    cmsRes?.data?.packages && cmsRes.data.packages.length > 0
      ? cmsRes.data.packages
      : DEFAULT_PRICING_PLANS;

  const handlePlanSelect = async (plan) => {
    if (!isAuthenticated) {
      // Store intent for post-login auto-redirect to Stripe
      sessionStorage.setItem("pending_checkout_package", JSON.stringify(plan));
      window.dispatchEvent(new Event("pending_checkout_updated"));

      const el = document.querySelector("#login");
      if (el) {
        const topOffset = 80;
        const pos = el.getBoundingClientRect().top + window.pageYOffset - topOffset;
        window.scrollTo({ top: pos, behavior: "smooth" });
      }
      return;
    }

    try {
      setSelectedPlanName(plan.name);
      const res = await createCheckout({
        plan: plan.id || plan.name,
        packageId: plan.id || plan.name,
        amount: plan.price,
      }).unwrap();

      const checkoutUrl = res?.data?.url || res?.url;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (err) {
      alert(err?.data?.message || "Failed to start checkout. Please try again.");
    } finally {
      setSelectedPlanName(null);
    }
  };

  return (
    <section
      id="pricing"
      className="py-8 sm:py-10 md:py-14 relative overflow-hidden"
    >
      <div className="section-padding-x max-w-[1600px] mx-auto">
        {/* Section Header */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          <span className="text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-widest text-[#00E676] block mb-1.5">
            MEMBERSHIP
          </span>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Choose your sniper tier.
            </h2>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full badge-gradient text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-[0_0_12px_rgba(3,247,105,0.3)]">
              7-DAY FREE TRIAL
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#cdaa40]/15 border border-[#cdaa40]/40 text-[10px] sm:text-xs font-bold text-[#cdaa40] uppercase tracking-wider">
              HOLIDAY 50% OFF
            </span>
          </div>
          <p className="text-xs sm:text-sm md:text-base text-gray-300 max-w-2xl leading-relaxed">
            Standard pricing is shown crossed out. The current prices are a 50%
            off holiday special when you start your trial through the Bet Snipe
            app before January 1.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-7 items-stretch mb-8">
          {packages.map((plan, index) => (
            <motion.div
              key={plan.id || plan.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`relative rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-7 flex flex-col justify-between transition-all duration-300 ${
                plan.popular
                  ? "bg-[#0f171e] border-2 border-[#03f769] shadow-[0_0_30px_rgba(3,247,105,0.22)] lg:-translate-y-1.5"
                  : "bg-[#0f141b]/90 border border-white/10 hover:border-white/20 shadow-xl"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 right-5">
                  <span className="inline-flex items-center gap-1 px-3.5 py-1 rounded-full btn-primary-gradient text-[10px] sm:text-xs font-extrabold uppercase tracking-wider shadow-[0_0_15px_rgba(3,247,105,0.6)]">
                    <Sparkles className="w-3 h-3" />
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div>
                {/* Plan Name */}
                <h3 className="text-lg sm:text-xl font-black text-white tracking-wide mb-1.5 uppercase">
                  {plan.name}
                </h3>

                {/* Price Display */}
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-sm sm:text-base line-through text-gray-500 font-semibold">
                    {plan.originalPrice}
                  </span>
                  <span className="text-3xl sm:text-4xl font-extrabold text-white">
                    {plan.discountPrice}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-400 font-medium">
                    {plan.period}
                  </span>
                </div>

                {/* Subtitle */}
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-6">
                  {plan.subtitle}
                </p>

                {/* Features List */}
                <ul className="space-y-2.5 mb-6 border-t border-white/10 pt-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-[#03f769]/10 border border-[#03f769]/30 flex items-center justify-center shrink-0 mt-0.5 text-[#03f769]">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span className="text-xs sm:text-sm text-gray-200 leading-snug">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                {/* CTA Button */}
                <button
                  onClick={() => handlePlanSelect(plan)}
                  disabled={isCheckingOut && selectedPlanName === plan.name}
                  className={`w-full py-3.5 px-4 rounded-full font-bold text-xs sm:text-sm uppercase tracking-wider cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 ${
                    plan.popular
                      ? "btn-primary-gradient"
                      : "bg-[#141a22] hover:bg-[#1a232e] text-[#03f769] border border-[#03f769]/40 hover:border-[#03f769] shadow-sm hover:-translate-y-0.5"
                  }`}
                >
                  {isCheckingOut && selectedPlanName === plan.name ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Connecting to Stripe...</span>
                    </>
                  ) : (
                    <span>{plan.cta}</span>
                  )}
                </button>

                {/* Optional Access Note */}
                {plan.accessNote && (
                  <div className="mt-3 p-2.5 rounded-lg bg-[#121820] border border-white/5">
                    <p className="text-[11px] sm:text-xs text-gray-300 leading-relaxed">
                      <span className="text-[#00E676] font-bold block mb-0.5">
                        Sharps Access:
                      </span>
                      After purchase, log in using the same email you paid with.
                      Your Sharps picks unlock automatically.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pricing Footnote */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#0e1319]/80 border border-white/10 text-[11px] sm:text-xs text-gray-400 leading-relaxed max-w-4xl">
          Your 7-day trial starts when you create your account and activate a
          tier in the app or on the web. Holiday pricing applies when you start
          your trial through the Bet Snipe app before January 1. No guaranteed
          results. For entertainment purposes only. You can cancel before your
          trial ends to avoid being charged.
        </div>
      </div>
    </section>
  );
};

export default PricingTiers;
