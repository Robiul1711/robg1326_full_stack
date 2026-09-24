import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

const Logo = ({ className = "", showTagline = true, isCollapsed = false, to = "/" }) => {
  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-3 group select-none transition-all ${className} ${
        isCollapsed ? "justify-center w-full" : ""
      }`}
    >
      {/* High-Tech Glow Emblem */}
      <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#18181c] via-[#121214] to-[#0a0a0c] border border-[#80CF16]/30 group-hover:border-[#80CF16] flex items-center justify-center shadow-[0_0_18px_rgba(128,207,22,0.2)] group-hover:shadow-[0_0_25px_rgba(128,207,22,0.4)] transition-all duration-300 shrink-0">
        <ShieldCheck className="w-5 h-5 text-[#80CF16] group-hover:scale-110 transition-transform duration-300" />
      </div>

      {/* Brand Typography */}
      {!isCollapsed && (
        <div className="flex flex-col overflow-hidden transition-all duration-300">
          <div className="flex items-baseline gap-1.5 leading-none">
            <span className="font-black text-base text-white tracking-tight">
              ADMIN
            </span>
            <span className="font-black text-base text-[#80CF16] tracking-tight group-hover:drop-shadow-[0_0_10px_rgba(128,207,22,0.6)]">
              PANEL
            </span>
          </div>
          {showTagline && (
            <span className="text-[8px] font-bold tracking-[0.18em] text-zinc-400 uppercase mt-0.5">
              Control Center
            </span>
          )}
        </div>
      )}
    </Link>
  );
};

export default Logo;
