import React from "react";
import { Menu, Bell, Sparkles } from "lucide-react";
import { useSelector } from "react-redux";

const Header = ({ setIsMobileOpen, title, subtitle }) => {
  const { adminUser } = useSelector((state) => state.auth);

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#09090b]/80 backdrop-blur-md border-b border-white/5 px-4 sm:px-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-300 hover:text-white lg:hidden cursor-pointer"
        >
          <Menu size={18} />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
            {title || "Dashboard"}
          </h1>
          {subtitle && (
            <p className="text-xs text-zinc-400 hidden sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#80CF16]/10 border border-[#80CF16]/20 text-[#80CF16] text-[11px] font-bold">
          <Sparkles size={12} />
          <span>Real-time Active</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
