import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CheckCircle,
  Sparkles,
  Send,
  ArrowRight,
  ShieldCheck,
  X,
} from "lucide-react";

const PaymentSuccessModal = ({
  isOpen,
  onClose,
  planName = "VIP Membership",
  isTrial = false,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg rounded-3xl bg-[#0e131a] border border-[#00E676]/40 p-6 sm:p-8 shadow-[0_0_50px_rgba(0,230,118,0.2)] text-center overflow-hidden z-10"
        >
          {/* Ambient Glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#00E676]/20 rounded-full blur-[90px] pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>

          {/* Animated Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            className="w-20 h-20 mx-auto mb-5 rounded-full bg-[#00E676]/10 border-2 border-[#00E676] flex items-center justify-center text-[#00E676] shadow-[0_0_25px_rgba(0,230,118,0.5)]"
          >
            <CheckCircle className="w-10 h-10 stroke-[2.5]" />
          </motion.div>

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#00E676]/15 border border-[#00E676]/40 text-[#00E676] text-xs font-extrabold uppercase tracking-wider mb-3">
            <Sparkles size={13} />
            <span>
              {isTrial ? "7-DAY TRIAL ACTIVATED" : "PAYMENT SUCCESSFUL"}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
            Welcome to BetSnipe {planName}!
          </h2>

          <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto leading-relaxed mb-6">
            {isTrial
              ? "Your 7-day risk-free free trial is now active. You have full access to real-time high EV betting signals."
              : "Your payment has been verified. Your VIP membership perks and automated bot picks are now active."}
          </p>

          {/* Status Details Card */}
          <div className="rounded-2xl bg-[#141b24] border border-white/10 p-4 mb-6 text-left space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Membership Tier:</span>
              <span className="font-bold text-white uppercase">{planName}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Status:</span>
              <span className="font-bold text-[#00E676] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse" />
                Active
              </span>
            </div>
            <div className="flex items-center justify-between text-xs border-t border-white/5 pt-2">
              <span className="text-gray-400">Multi-Device Access:</span>
              <span className="font-semibold text-gray-200">
                iOS • Android • Web
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <a
              href="https://discord.gg/betsnipe"
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 px-5 rounded-full font-extrabold text-xs sm:text-sm uppercase tracking-wider btn-primary-gradient flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,230,118,0.35)] hover:scale-[1.02] transition-transform cursor-pointer"
            >
              <Send size={15} />
              <span>JOIN VIP DISCORD & TELEGRAM BOT</span>
            </a>

            <button
              onClick={onClose}
              className="w-full py-3 px-5 rounded-full font-bold text-xs sm:text-sm text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
            >
              Back to Platform
            </button>
          </div>

          {/* Footer Guarantee */}
          <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-gray-400">
            <ShieldCheck size={14} className="text-[#00E676]" />
            <span>256-Bit SSL Secured • Instant Access</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PaymentSuccessModal;
