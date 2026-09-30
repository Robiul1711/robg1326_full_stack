import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCurrentUser,
  selectIsAuthenticated,
  clearAuth,
} from "@/redux/slices/authSlice";
import logoImg from "@/assets/images/logo.png";
import {
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  Sparkles,
  LogIn,
  LogOut,
  User as UserIcon,
  ShieldCheck,
} from "lucide-react";

const navLinks = [
  { name: "Today's Pick", href: "#todays-pick" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "Pricing", href: "#pricing" },
  { name: "Results", href: "#results" },
  { name: "FAQ", href: "#faq" },
];

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeSection, setActiveSection] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const userDropdownRef = useRef(null);

  // Extract user display details
  const userName =
    user?.name ||
    user?.user?.name ||
    (user?.email ? user.email.split("@")[0] : "Member");
  const userEmail = user?.email || user?.user?.email || "";
  const userInitial = (userName.charAt(0) || "U").toUpperCase();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    setUserDropdownOpen(false);
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

  const handleLogout = () => {
    dispatch(clearAuth());
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
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

          {/* Right Action / User Profile (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#141a22]/90 hover:bg-[#1a222c] border border-white/15 hover:border-[#00E676]/40 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,230,118,0.1)] group"
                >
                  {/* Glowing User Avatar Circle */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00E676] to-[#00b0ff] flex items-center justify-center text-black font-extrabold text-sm shadow-[0_0_10px_rgba(0,230,118,0.4)]">
                    {userInitial}
                  </div>
                  <span className="text-xs lg:text-sm font-semibold text-gray-200 group-hover:text-white max-w-[120px] truncate">
                    {userName}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-gray-400 transition-transform duration-200 ${
                      userDropdownOpen ? "rotate-180 text-[#00E676]" : ""
                    }`}
                  />
                </button>

                {/* Animated Dropdown Menu */}
                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-60 rounded-2xl bg-[#0e131a] border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.8)] p-2 z-50 overflow-hidden"
                    >
                      {/* User Info Header */}
                      <div className="px-3 py-2.5 border-b border-white/10 mb-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-xs font-bold text-white truncate">
                            {userName}
                          </p>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#00E676]/20 text-[#00E676] border border-[#00E676]/30">
                            PRO
                          </span>
                        </div>
                        {userEmail && (
                          <p className="text-[11px] text-gray-400 truncate">
                            {userEmail}
                          </p>
                        )}
                      </div>

                      {/* Menu Options */}
                      <div className="space-y-0.5">
                        <button
                          onClick={(e) => scrollToSection(e, "#pricing")}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-left cursor-pointer"
                        >
                          <Sparkles size={14} className="text-[#00E676]" />
                          <span>View Membership Plans</span>
                        </button>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors text-left cursor-pointer"
                        >
                          <LogOut size={14} />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <a
                href="#login"
                onClick={(e) => scrollToSection(e, "#login")}
                className="px-4 py-1.5 lg:px-5 lg:py-2 text-xs lg:text-sm font-semibold tracking-wide btn-primary-gradient rounded-full cursor-pointer uppercase font-poppins"
              >
                LOG IN
              </a>
            )}
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2 md:hidden">
            {isAuthenticated ? (
              <div
                onClick={() => setMobileMenuOpen(true)}
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00E676] to-[#00b0ff] flex items-center justify-center text-black font-extrabold text-xs cursor-pointer shadow-[0_0_10px_rgba(0,230,118,0.4)]"
              >
                {userInitial}
              </div>
            ) : (
              <a
                href="#login"
                onClick={(e) => scrollToSection(e, "#login")}
                className="px-3 py-1.5 text-xs font-bold btn-primary-gradient rounded-full uppercase"
              >
                LOG IN
              </a>
            )}
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
                <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-5">
                  <div className="flex items-center gap-2">
                    <img
                      src={logoImg}
                      alt="Bet Snipe Logo"
                      className="h-10 w-auto object-contain"
                    />
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
                    aria-label="Close Menu"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Logged in User Card in Mobile Drawer */}
                {isAuthenticated && (
                  <div className="p-3 mb-4 rounded-2xl bg-[#141a22] border border-white/10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#00E676] to-[#00b0ff] flex items-center justify-center text-black font-extrabold text-sm flex-shrink-0 shadow-[0_0_12px_rgba(0,230,118,0.3)]">
                      {userInitial}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-white truncate">
                        {userName}
                      </p>
                      {userEmail && (
                        <p className="text-[10px] text-gray-400 truncate">
                          {userEmail}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Navigation Links */}
                <nav className="flex flex-col gap-1.5">
                  {navLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={(e) => scrollToSection(e, link.href)}
                      className="flex items-center justify-between px-4 py-2.5 text-sm font-medium text-gray-200 hover:text-[#00E676] hover:bg-[#141a22] rounded-xl transition-all border border-transparent hover:border-white/5"
                    >
                      <span>{link.name}</span>
                      <ChevronRight size={16} className="text-gray-500" />
                    </a>
                  ))}
                </nav>
              </div>

              {/* Sidebar Bottom Actions */}
              <div className="pt-5 border-t border-white/10 mt-5 space-y-2.5">
                <button
                  onClick={(e) => scrollToSection(e, "#pricing")}
                  className="w-full py-3 px-4 text-xs font-bold uppercase tracking-wider text-black bg-[#00E676] rounded-xl shadow-[0_0_15px_rgba(0,230,118,0.35)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles size={15} />
                  <span>START 7-DAY TRIAL</span>
                </button>

                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="w-full py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center justify-center gap-2 cursor-pointer hover:bg-rose-500/20 transition-colors"
                  >
                    <LogOut size={15} />
                    <span>LOG OUT</span>
                  </button>
                ) : (
                  <button
                    onClick={(e) => scrollToSection(e, "#login")}
                    className="w-full py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-[#00E676] bg-[#141a22] border border-[#00E676]/30 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogIn size={15} />
                    <span>LOG IN</span>
                  </button>
                )}
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
