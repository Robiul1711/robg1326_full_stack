import React, { useEffect, useState } from "react";
import Hero from "@/components/home/Hero";
import TodaysFreePick from "@/components/home/TodaysFreePick";
import HowItWorks from "@/components/home/HowItWorks";
import InsideTheEngine from "@/components/home/InsideTheEngine";
import PricingTiers from "@/components/home/PricingTiers";
import Testimonials from "@/components/home/Testimonials";
import FAQ from "@/components/home/FAQ";
import AccessLogin from "@/components/home/AccessLogin";
import PaymentSuccessModal from "@/components/common/PaymentSuccessModal";
import PaymentCancelModal from "@/components/common/PaymentCancelModal";
import { useVerifySessionMutation } from "@/redux/api/apiSlice";
import { useDispatch } from "react-redux";

const Home = () => {
  const [verifySession] = useVerifySessionMutation();
  const dispatch = useDispatch();

  const [successModal, setSuccessModal] = useState({
    isOpen: false,
    planName: "VIP Tier",
    isTrial: false,
  });

  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    const paymentSuccess = params.get("payment_success");
    const paymentCancelled = params.get("payment_cancelled");
    const trialSuccess = params.get("trial_success");

    // Clean URL params without page reload
    if (sessionId || paymentSuccess || paymentCancelled || trialSuccess) {
      window.history.replaceState({}, "", window.location.pathname);
    }

    if (trialSuccess === "true") {
      setSuccessModal({
        isOpen: true,
        planName: "7-Day Free Trial",
        isTrial: true,
      });
    }

    if (paymentSuccess === "true") {
      if (sessionId) {
        verifySession({ sessionId })
          .unwrap()
          .then((res) => {
            setSuccessModal({
              isOpen: true,
              planName: res?.data?.plan || "VIP Membership",
              isTrial: false,
            });
          })
          .catch(() => {
            setSuccessModal({
              isOpen: true,
              planName: "VIP Membership",
              isTrial: false,
            });
          });
      } else {
        setSuccessModal({
          isOpen: true,
          planName: "VIP Membership",
          isTrial: false,
        });
      }
    }

    if (paymentCancelled === "true") {
      setCancelModalOpen(true);
    }
  }, [verifySession]);

  const handleRetryPricing = () => {
    const el = document.querySelector("#pricing");
    if (el) {
      const topOffset = 80;
      const pos =
        el.getBoundingClientRect().top + window.pageYOffset - topOffset;
      window.scrollTo({ top: pos, behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen bg-[#080a0d] text-white relative">
      <Hero />
      <TodaysFreePick />
      <HowItWorks />
      <InsideTheEngine />
      <PricingTiers />
      <Testimonials />
      <FAQ />
      <AccessLogin />

      {/* Payment Success Celebratory Modal */}
      <PaymentSuccessModal
        isOpen={successModal.isOpen}
        onClose={() => setSuccessModal({ ...successModal, isOpen: false })}
        planName={successModal.planName}
        isTrial={successModal.isTrial}
      />

      {/* Payment Cancelled Modal */}
      <PaymentCancelModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onRetry={handleRetryPricing}
      />
    </main>
  );
};

export default Home;
