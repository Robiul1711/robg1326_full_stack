import React from "react";
import { Link } from "react-router-dom";

const Logo = ({ className = "", showTagline = true, to = "/" }) => {
  return (
    <Link to={to} className={`inline-flex items-center gap-3 group select-none ${className}`}>
      {/* Modern High-Tech Emblem */}
      <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#18181c] via-[#121214] to-[#0a0a0c] border border-[#80CF16]/30 group-hover:border-[#80CF16] flex items-center justify-center shadow-[0_0_18px_rgba(128,207,22,0.2)] group-hover:shadow-[0_0_25px_rgba(128,207,22,0.4)] transition-all duration-300">
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 sm:w-6 sm:h-6 relative z-10 transition-transform duration-300 group-hover:scale-105"
        >
          <defs>
            <linearGradient id="adminSadiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A3FF20" />
              <stop offset="100%" stopColor="#80CF16" />
            </linearGradient>
            <filter id="adminNeonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#80CF16" floodOpacity="0.6" />
            </filter>
          </defs>
          <path
            d="M24 7.5H12C9.51472 7.5 7.5 9.51472 7.5 12C7.5 14.4853 9.51472 16.5 12 16.5H20C22.4853 16.5 24.5 18.5147 24.5 21C24.5 23.4853 22.4853 25.5 20 25.5H8"
            stroke="url(#adminSadiGrad)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#adminNeonGlow)"
          />
          <circle cx="24.5" cy="7.5" r="1.5" fill="#FFFFFF" />
          <circle cx="7.5" cy="25.5" r="1.5" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className="flex items-baseline gap-1 leading-none">
          <span className="font-black text-base sm:text-lg text-white tracking-tight">
            SADI
          </span>
          <span className="font-black text-base sm:text-lg text-[#80CF16] tracking-tight group-hover:drop-shadow-[0_0_10px_rgba(128,207,22,0.6)]">
            STORE
          </span>
        </div>
        {showTagline && (
          <span className="text-[8px] sm:text-[9px] font-bold tracking-[0.18em] text-zinc-400 uppercase mt-0.5">
            Control Center
          </span>
        )}
      </div>
    </Link>
  );
};

export default Logo;
