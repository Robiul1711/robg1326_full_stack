import React from "react";
import { ArrowUp } from "lucide-react";

const Footer = () => {
  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-white/10 bg-[#080a0d] py-12">
      <div className="section-padding-x max-w-[1600px] mx-auto">
        {/* Disclaimer Text */}
        <div className="mb-8">
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-5xl">
            <span className="font-semibold text-gray-300">Disclaimer:</span> Bet
            Snipe provides sports analysis and betting information for
            entertainment purposes only. No results or profits are guaranteed.
            Past performance is not indicative of future outcomes. You must be
            18+ or of legal gambling age in your jurisdiction. If you or someone
            you know has a gambling problem, call 1-800-GAMBLER.
          </p>
        </div>

        {/* Bottom Row Links */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/5">
          <div className="flex flex-wrap items-center gap-6 sm:gap-8 text-xs sm:text-sm text-gray-400">
            <a
              href="#"
              onClick={scrollToTop}
              className="hover:text-[#00E676] transition-colors flex items-center gap-1.5 font-medium"
            >
              <span>Back to top</span>
              <ArrowUp size={14} />
            </a>
            <a href="#terms" className="hover:text-[#00E676] transition-colors">
              Terms of Use
            </a>
            <a
              href="#privacy"
              className="hover:text-[#00E676] transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#responsible-gambling"
              className="hover:text-[#00E676] transition-colors"
            >
              Responsible Gambling
            </a>
          </div>

          <div className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Bet Snipe. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
