import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react";
import { useLoginAdminMutation } from "../redux/api/adminApiSlice";
import { setCredentials } from "../redux/slices/authSlice";
import toast from "react-hot-toast";
import Logo from "../components/common/Logo";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginAdmin, { isLoading }] = useLoginAdminMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      const res = await loginAdmin({ email, password }).unwrap();
      dispatch(setCredentials(res));
      toast.success("Welcome back, Admin!");
      navigate("/");
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "Login failed. Check credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background Neon Ambient Glows */}
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#80CF16]/10 rounded-full blur-[140px]" />

      <div className="relative w-full max-w-md">
        {/* Top Brand Logo */}
        <div className="text-center mb-8 flex flex-col items-center">
          <Logo showTagline={false} className="scale-125 mb-4" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Admin Control Center
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Real-time management dashboard
          </p>
        </div>

        {/* Glassmorphic Login Card */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@subzero.com"
                  className="w-full bg-[#18181b] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#80CF16] transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#18181b] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#80CF16] transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-[#80CF16] hover:bg-[#99EC21] text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(128,207,22,0.3)] transition-all cursor-pointer disabled:opacity-50"
            >
              <span>{isLoading ? "Authenticating..." : "Sign In to Dashboard"}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-center gap-2 text-zinc-500 text-xs">
            <ShieldCheck size={14} className="text-[#80CF16]" />
            <span>Secure 256-bit Encrypted Session</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
