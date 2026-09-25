import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  ShieldCheck,
  Zap,
  Smartphone,
  Lock,
} from "lucide-react";

const benefits = [
  {
    icon: Zap,
    title: "Real-Time Market Intel",
    desc: "Pre-game 20-minute rescans and sharp-line movement tracking delivered instantly.",
  },
  {
    icon: Smartphone,
    title: "Multi-Device Sync",
    desc: "Single account access across iOS, Android, and web dashboard without extra steps.",
  },
  {
    icon: ShieldCheck,
    title: "Risk-Free 7-Day Trial",
    desc: "Test-drive any sniper tier with zero commitments and instant cancellation anytime.",
  },
];

const AccessLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login attempt:", formData);
  };

  return (
    <section
      id="login"
      className="py-12 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[400px] bg-[#00E676]/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="section-padding-x max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Information & Trust Badges */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 flex flex-col justify-center"
          >
            {/* Section Badge */}
            <span className="text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-widest text-[#00E676] block mb-2">
              ACCESS
            </span>

            {/* Main Title */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-extrabold text-white tracking-tight leading-[1.2] mb-4">
              Log in or start your <br className="hidden sm:inline" />
              <span className="text-[#00E676]">7-day free trial.</span>
            </h2>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm md:text-base text-gray-300 max-w-xl leading-relaxed mb-8">
              Use the same email or sign-in method on web and in the app. One
              account, one membership, synced across devices.
            </p>

            {/* Benefits List */}
            <div className="space-y-4 sm:space-y-5 mb-8">
              {benefits.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[#00E676]/10 border border-[#00E676]/20 flex items-center justify-center shrink-0 text-[#00E676]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-white mb-0.5">
                        {item.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Trust / Security Note */}
            <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-[#0c1016] border border-white/10 max-w-md">
              <Lock className="w-4 h-4 text-[#00E676] shrink-0" />
              <span className="text-[11px] sm:text-xs text-gray-300 font-medium">
                256-Bit SSL Encrypted & Stripe Secured Billing
              </span>
            </div>
          </motion.div>

          {/* Right Column: Modern Login / Signup Form Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 flex justify-center lg:justify-end"
          >
            <div className="w-full max-w-lg rounded-2xl sm:rounded-3xl bg-[#0e1319]/95 border border-white/10 p-6 sm:p-8 shadow-2xl backdrop-blur-xl hover:border-[#00E676]/35 transition-all duration-300">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                {/* Email Field */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="you@example.com"
                      required
                      className="w-full px-3.5 py-3 rounded-xl bg-[#141a22] border border-white/10 text-white placeholder-gray-500 text-xs sm:text-sm md:text-base focus:outline-none focus:border-[#00E676] focus:ring-1 focus:ring-[#00E676] transition-all"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      placeholder="••••••••"
                      required
                      className="w-full px-3.5 py-3 pr-11 rounded-xl bg-[#141a22] border border-white/10 text-white placeholder-gray-500 text-xs sm:text-sm md:text-base focus:outline-none focus:border-[#00E676] focus:ring-1 focus:ring-[#00E676] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Log In Button */}
                <button
                  type="submit"
                  className="w-full py-3 sm:py-3.5 px-4 rounded-full font-bold text-xs sm:text-sm md:text-base btn-primary-gradient cursor-pointer uppercase tracking-wider text-center"
                >
                  LOG IN
                </button>

                {/* Forgot Password Link */}
                <div className="text-center pt-0.5">
                  <a
                    href="#login"
                    className="text-xs font-medium text-[#03f769] hover:text-[#77ffb0] hover:underline transition-colors"
                  >
                    Forgot your password?
                  </a>
                </div>

                {/* Divider */}
                <div className="relative flex items-center justify-center my-3.5 sm:my-4">
                  <div className="border-t border-white/10 w-full" />
                  <span className="bg-[#0e1319] px-3 text-[10px] sm:text-xs uppercase tracking-wider text-gray-400 whitespace-nowrap">
                    New to Bet Snipe?
                  </span>
                  <div className="border-t border-white/10 w-full" />
                </div>

                {/* Create Free Account Button */}
                <button
                  type="button"
                  onClick={() => {
                    const el = document.querySelector("#pricing");
                    if (el) {
                      const topOffset = 80;
                      const pos =
                        el.getBoundingClientRect().top +
                        window.pageYOffset -
                        topOffset;
                      window.scrollTo({ top: pos, behavior: "smooth" });
                    }
                  }}
                  className="w-full py-3 sm:py-3.5 px-3 sm:px-4 rounded-full font-bold text-[11px] xs:text-xs sm:text-sm btn-primary-gradient cursor-pointer uppercase tracking-normal sm:tracking-wider text-center leading-snug sm:leading-normal"
                >
                  CREATE FREE ACCOUNT — START 7-DAY TRIAL
                </button>

                {/* Footnote inside card */}
                <div className="pt-2 text-center">
                  <p className="text-[11px] sm:text-xs text-gray-400 leading-relaxed">
                    Future: Sign in with Apple / Google will appear here.
                    <br />
                    You can also create your account directly in the app and use
                    the same email to log in on the web.
                  </p>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AccessLogin;
