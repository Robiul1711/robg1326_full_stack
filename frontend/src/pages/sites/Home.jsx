import React from "react";
import Hero from "@/components/home/Hero";
import TodaysFreePick from "@/components/home/TodaysFreePick";
import HowItWorks from "@/components/home/HowItWorks";
import InsideTheEngine from "@/components/home/InsideTheEngine";
import PricingTiers from "@/components/home/PricingTiers";
import Testimonials from "@/components/home/Testimonials";
import FAQ from "@/components/home/FAQ";
import AccessLogin from "@/components/home/AccessLogin";

const Home = () => {
  return (
    <main className="min-h-screen bg-[#080a0d] text-white">
      <Hero />
      <TodaysFreePick />
      <HowItWorks />
      <InsideTheEngine />
      <PricingTiers />
      <Testimonials />
      <FAQ />
      <AccessLogin />
    </main>
  );
};

export default Home;
