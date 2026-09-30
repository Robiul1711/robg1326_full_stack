import React, { useState, useEffect } from "react";
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
  CheckCircle2,
  User,
  Mail,
  Loader2,
  Sparkles,
  X,
} from "lucide-react";
import {
  useLoginMutation,
  useRegisterMutation,
  useCreateCheckoutMutation,
} from "../../redux/api/apiSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  setCredentials,
  selectCurrentUser,
  selectIsAuthenticated,
} from "../../redux/slices/authSlice";

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
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [pendingPackage, setPendingPackage] = useState(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [register, { isLoading: isRegistering }] = useRegisterMutation();
  const [createCheckout] = useCreateCheckoutMutation();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrentUser);

  const checkPendingPackage = () => {
    try {
      const stored = sessionStorage.getItem("pending_checkout_package");
      if (stored) {
        setPendingPackage(JSON.parse(stored));
      } else {
        setPendingPackage(null);
      }
    } catch (e) {
      setPendingPackage(null);
    }
  };

  useEffect(() => {
    checkPendingPackage();
    const handleStorageUpdate = () => checkPendingPackage();
    window.addEventListener("pending_checkout_updated", handleStorageUpdate);
    return () =>
      window.removeEventListener(
        "pending_checkout_updated",
        handleStorageUpdate,
      );
  }, []);

  const clearPendingPackage = () => {
    sessionStorage.removeItem("pending_checkout_package");
    setPendingPackage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    try {
      let userData = null;
      if (isRegisterMode) {
        if (!formData.name.trim()) {
          setMessage({ text: "Please enter your full name", type: "error" });
          return;
        }
        const res = await register(formData).unwrap();
        userData = res?.data || res;
        dispatch(setCredentials(userData));
      } else {
        const res = await login({
          email: formData.email,
          password: formData.password,
        }).unwrap();
        userData = res?.data || res;
        dispatch(setCredentials(userData));
      }

      // Check if user had selected a plan before logging in
      const storedPackage = sessionStorage.getItem("pending_checkout_package");
      if (storedPackage) {
        const pkg = JSON.parse(storedPackage);
        setIsRedirecting(true);
        setMessage({
          text: `Success! Redirecting you to Stripe checkout for ${pkg.name}...`,
          type: "success",
        });

        try {
          const checkoutRes = await createCheckout({
            plan: pkg.id || pkg.name,
            packageId: pkg.id || pkg.name,
            amount: pkg.price,
          }).unwrap();

          sessionStorage.removeItem("pending_checkout_package");
          const checkoutUrl = checkoutRes?.data?.url || checkoutRes?.url;
          if (checkoutUrl) {
            window.location.href = checkoutUrl;
            return;
          }
        } catch (checkoutErr) {
          console.error("Auto checkout error:", checkoutErr);
          setIsRedirecting(false);
        }
      }

      setMessage({
        text: isRegisterMode
          ? "Account created successfully! You are now logged in."
          : "Signed in successfully! Welcome back.",
        type: "success",
      });
    } catch (err) {
      const errMsg =
        err?.data?.message ||
        err?.error ||
        "Authentication failed. Please check your credentials.";
      setMessage({ text: errMsg, type: "error" });
      setIsRedirecting(false);
    }
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
              ACCESS & MEMBERSHIP
            </span>

            {/* Main Title */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-extrabold text-white tracking-tight leading-[1.2] mb-4">
              {isRegisterMode
                ? "Create your account &"
                : "Log in or start your"}{" "}
              <br className="hidden sm:inline" />
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
              {/* Switch Mode Tabs (Log In vs Register) */}
              <div className="flex items-center p-1 bg-[#141a22] border border-white/10 rounded-xl mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(false);
                    setMessage({ text: "", type: "" });
                  }}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    !isRegisterMode
                      ? "bg-[#00E676] text-black shadow-[0_0_12px_rgba(0,230,118,0.3)]"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <LogIn size={14} />
                  <span>LOG IN</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(true);
                    setMessage({ text: "", type: "" });
                  }}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    isRegisterMode
                      ? "bg-[#00E676] text-black shadow-[0_0_12px_rgba(0,230,118,0.3)]"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <UserPlus size={14} />
                  <span>CREATE ACCOUNT</span>
                </button>
              </div>

              {/* Pending Package Notification */}
              {pendingPackage && (
                <div className="mb-5 p-3.5 rounded-2xl bg-gradient-to-r from-[#00E676]/15 via-[#00E676]/5 to-transparent border border-[#00E676]/40 flex items-center justify-between gap-3 animate-pulse">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-[#00E676]/20 flex items-center justify-center text-[#00E676] shrink-0">
                      <Sparkles size={15} />
                    </div>
                    <div className="text-xs truncate">
                      <p className="text-white font-bold truncate">
                        Selected:{" "}
                        <span className="text-[#00E676]">
                          {pendingPackage.name}
                        </span>{" "}
                        (
                        {pendingPackage.discountPrice ||
                          `$${pendingPackage.price}`}
                        {pendingPackage.period || "/mo"})
                      </p>
                      <p className="text-[11px] text-gray-400">
                        Complete login to proceed to Stripe checkout
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={clearPendingPackage}
                    className="text-gray-400 hover:text-white p-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer shrink-0"
                    title="Clear selected plan"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                {message.text && (
                  <div
                    className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                      message.type === "success"
                        ? "bg-[#00E676]/15 border border-[#00E676]/30 text-[#00E676]"
                        : "bg-red-500/15 border border-red-500/30 text-red-400"
                    }`}
                  >
                    {message.type === "success" && <CheckCircle2 size={16} />}
                    <span>{message.text}</span>
                  </div>
                )}

                {/* Name Field (Only in Register Mode) */}
                {isRegisterMode && (
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="John Doe"
                        required
                        className="w-full px-3.5 py-3 rounded-xl bg-[#141a22] border border-white/10 text-white placeholder-gray-500 text-xs sm:text-sm md:text-base focus:outline-none focus:border-[#00E676] focus:ring-1 focus:ring-[#00E676] transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Email Field */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-1.5">
                    Email Address
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

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoggingIn || isRegistering}
                  className="w-full py-3.5 px-4 rounded-full font-bold text-xs sm:text-sm md:text-base btn-primary-gradient cursor-pointer uppercase tracking-wider text-center flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoggingIn || isRegistering ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>
                        {isRegisterMode
                          ? "Creating Account..."
                          : "Signing In..."}
                      </span>
                    </>
                  ) : (
                    <span>
                      {isRegisterMode ? "CREATE FREE ACCOUNT" : "LOG IN"}
                    </span>
                  )}
                </button>

                {/* Switch helper link */}
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegisterMode(!isRegisterMode);
                      setMessage({ text: "", type: "" });
                    }}
                    className="text-xs text-gray-400 hover:text-[#00E676] transition-colors cursor-pointer"
                  >
                    {isRegisterMode ? (
                      <span>
                        Already have an account?{" "}
                        <strong className="text-[#00E676] underline">
                          Log In
                        </strong>
                      </span>
                    ) : (
                      <span>
                        New to Bet Snipe?{" "}
                        <strong className="text-[#00E676] underline">
                          Create Free Account
                        </strong>
                      </span>
                    )}
                  </button>
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
