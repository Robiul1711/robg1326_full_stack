import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import logoImg from "@/assets/images/logo.png";
import { Menu, X, ChevronRight, Sparkles, LogIn } from "lucide-react";

const navLinks = [
  { name: "Today's Pick", href: "#todays-pick" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "Pricing", href: "#pricing" },
  { name: "Results", href: "#results" },
  { name: "FAQ", href: "#faq" },
];

const Navbar = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeSection, setActiveSection] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = navLinks.map((link) => link.href.substring(1));
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(`#${sections[i]}`);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent background body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const scrollToSection = (e, href) => {
    if (e) e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      const topOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-[#080a0d]/65 backdrop-blur-xl py-1"
            : "bg-transparent py-1"
        }`}
      >
        <div className="section-padding-x max-w-[1600px] mx-auto flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-3 group"
          >
            <div className="relative overflow-hidden py-1">
              <img
                src={logoImg}
                alt="Bet Snipe Logo"
                className="h-12 sm:h-14 md:h-16 lg:h-18 xl:h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-[0_0_15px_rgba(0,230,118,0.2)]"
              />
            </div>
          </a>

          {/* Desktop Navigation Links with Animated Floating Pill */}
          <nav
            className="hidden md:flex items-center gap-1 bg-[#12161c]/80 border border-white/10 px-2.5 py-1 rounded-full backdrop-blur-md"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {navLinks.map((link, index) => {
              const isHovered = hoveredIndex === index;
              const isActive = activeSection === link.href;

              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  className={`relative px-3.5 py-1.5 text-xs lg:text-sm font-medium transition-colors duration-200 rounded-full z-10 ${
                    isActive || isHovered
                      ? "text-[#00E676]"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  {/* Floating pill background animation */}
                  {isHovered && (
                    <motion.div
                      layoutId="navbar-hover-pill"
                      className="absolute inset-0 bg-[#00E676]/15 border border-[#00E676]/30 rounded-full -z-10 shadow-[0_0_12px_rgba(0,230,118,0.2)]"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* Right CTA Button (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="#login"
              onClick={(e) => scrollToSection(e, "#login")}
              className="px-4 py-1.5 lg:px-5 lg:py-2 text-xs lg:text-sm font-semibold tracking-wide btn-primary-gradient rounded-full cursor-pointer uppercase font-poppins"
            >
              LOG IN
            </a>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2.5 md:hidden">
            <a
              href="#login"
              onClick={(e) => scrollToSection(e, "#login")}
              className="px-3 py-1.5 text-xs font-bold btn-primary-gradient rounded-full uppercase"
            >
              LOG IN
            </a>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-gray-200 hover:text-white bg-[#141a22] border border-white/10 rounded-lg focus:outline-none cursor-pointer"
              aria-label="Open Menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Sidebar with Outside Backdrop Blur */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex justify-end">
            {/* Backdrop with Blur - Click Outside Closes */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm cursor-pointer"
            />

            {/* Sliding Sidebar Drawer */}
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="relative w-[82%] max-w-sm h-full bg-[#0c1016] border-l border-white/10 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto z-10"
            >
              <div>
                {/* Sidebar Header with Logo and Close Button */}
                <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-6">
                  <div className="flex items-center gap-2">
                    <img
                      src={logoImg}
                      alt="Bet Snipe Logo"
                      className="h-12 w-auto object-contain"
                    />
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
                    aria-label="Close Menu"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={(e) => scrollToSection(e, link.href)}
                      className="flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-200 hover:text-[#00E676] hover:bg-[#141a22] rounded-xl transition-all border border-transparent hover:border-white/5"
                    >
                      <span>{link.name}</span>
                      <ChevronRight size={16} className="text-gray-500" />
                    </a>
                  ))}
                </nav>
              </div>

              {/* Sidebar Bottom CTA */}
              <div className="pt-6 border-t border-white/10 mt-6 space-y-3">
                <button
                  onClick={(e) => scrollToSection(e, "#pricing")}
                  className="w-full py-3 px-4 text-xs font-bold uppercase tracking-wider text-black bg-[#00E676] rounded-xl shadow-[0_0_15px_rgba(0,230,118,0.35)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles size={16} />
                  <span>START 7-DAY TRIAL</span>
                </button>
                <button
                  onClick={(e) => scrollToSection(e, "#login")}
                  className="w-full py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-[#00E676] bg-[#141a22] border border-[#00E676]/30 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogIn size={15} />
                  <span>LOG IN</span>
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
