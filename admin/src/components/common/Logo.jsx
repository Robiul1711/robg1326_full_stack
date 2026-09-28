import React from "react";
import { Link } from "react-router-dom";
import logoImg from "../../assets/images/logo.png";

const Logo = ({ className = "", showTagline = true, isCollapsed = false, to = "/" }) => {
  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-3 group select-none transition-all ${className} ${
        isCollapsed ? "justify-center w-full" : ""
      }`}
    >
      <div className="relative flex items-center justify-center shrink-0">
        <img
          src={logoImg}
          alt="BetSnipe Logo"
          className={`${isCollapsed ? "h-9" : "h-11"} w-auto object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-[0_0_12px_rgba(0,230,118,0.25)]`}
        />
      </div>

      {!isCollapsed && (
        <div className="flex flex-col overflow-hidden transition-all duration-300">
    
          {showTagline && (
            <span className="text-[9px] font-semibold tracking-[0.18em] text-zinc-400 uppercase mt-0.5">
              Control Center
            </span>
          )}
        </div>
      )}
    </Link>
  );
};

export default Logo;

