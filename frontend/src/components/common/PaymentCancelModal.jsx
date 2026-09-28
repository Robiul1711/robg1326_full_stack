import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertCircle, RefreshCw, Mail, X } from "lucide-react";

const PaymentCancelModal = ({ isOpen, onClose, onRetry }) => {
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
          className="relative w-full max-w-md rounded-3xl bg-[#0e131a] border border-amber-500/30 p-6 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.15)] text-center overflow-hidden z-10"
        >
          {/* Ambient Glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/10 rounded-full blur-[90px] pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>

          {/* Animated Warning Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/10 border-2 border-amber-500/60 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
          >
            <AlertCircle className="w-8 h-8 stroke-[2.5]" />
          </motion.div>

          {/* Title */}
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2">
            Payment Cancelled
          </h2>

          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-6">
            Your checkout session was cancelled or timed out. No money has been deducted from your card.
          </p>

          {/* Info Box */}
          <div className="rounded-2xl bg-[#141b24] border border-white/5 p-4 mb-6 text-left text-xs text-gray-400 space-y-2">
            <p>
              • You can restart the 7-day free trial or select another plan whenever you're ready.
            </p>
            <p>
              • If you experienced a payment error or card issue, try using another card or contact support.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => {
                onClose();
                if (onRetry) onRetry();
              }}
              className="w-full py-3.5 px-5 rounded-full font-extrabold text-xs sm:text-sm uppercase tracking-wider btn-primary-gradient flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,230,118,0.25)] hover:scale-[1.02] transition-transform cursor-pointer"
            >
              <RefreshCw size={15} />
              <span>CHOOSE A PLAN & TRY AGAIN</span>
            </button>

            <button
              onClick={onClose}
              className="w-full py-3 px-5 rounded-full font-bold text-xs sm:text-sm text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>

          {/* Support Link */}
          <div className="mt-5 text-[11px] text-gray-400 flex items-center justify-center gap-1.5">
            <Mail size={13} className="text-[#00E676]" />
            <span>Need help? Contact <a href="mailto:support@betsnipe.com" className="text-[#00E676] hover:underline">support@betsnipe.com</a></span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PaymentCancelModal;
