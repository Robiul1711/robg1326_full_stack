import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Smartphone,
  Wrench,
  ShoppingBag,
  FileCode2,
  ShieldAlert,
  MessageSquare,
  LogOut,
  ExternalLink,
  Radio,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { useSocket } from "../../context/SocketContext";
import Logo from "../common/Logo";

const navItems = [
  { name: "Overview", href: "/", icon: LayoutDashboard },
  { name: "Devices & Models", href: "/devices", icon: Smartphone },
  { name: "Repair Services", href: "/services", icon: Wrench },
  { name: "Marketplace Stock", href: "/marketplace", icon: ShoppingBag },
  { name: "CMS & Homepage", href: "/cms", icon: FileCode2 },
  { name: "Legal Policies", href: "/policies", icon: ShieldAlert },
  { name: "Customer Leads", href: "/leads", icon: MessageSquare },
];

const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const dispatch = useDispatch();
  const { isConnected } = useSocket();
  const { adminUser } = useSelector((state) => state.auth);

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#0e0e11] border-r border-white/5 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="h-16 px-5 flex items-center justify-between border-b border-white/5">
            <Logo showTagline={true} />
          </div>

          {/* Real-time Socket Live Badge */}
          <div className="px-4 py-3 mx-4 my-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isConnected ? "bg-[#80CF16]" : "bg-red-500"
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    isConnected ? "bg-[#80CF16]" : "bg-red-500"
                  }`}
                />
              </span>
              <span className="text-xs font-semibold text-white/90">
                Live Socket Sync
              </span>
            </div>
            <Radio size={14} className={isConnected ? "text-[#80CF16]" : "text-zinc-500"} />
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-[#80CF16] text-black font-extrabold shadow-[0_0_20px_rgba(128,207,22,0.25)]"
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    }`
                  }
                >
                  <Icon size={16} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer info & Logout */}
        <div className="p-4 border-t border-white/5 space-y-3">
          <a
            href="https://phone-repair-fullstack.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <span>Live Website</span>
            <ExternalLink size={14} />
          </a>

          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-[#80CF16]/20 border border-[#80CF16]/40 flex items-center justify-center text-xs font-bold text-[#80CF16]">
                {adminUser?.name?.charAt(0) || "A"}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">
                  {adminUser?.name || "Admin"}
                </p>
                <p className="text-[10px] text-zinc-500 truncate">
                  {adminUser?.email || "admin@subzero.com"}
                </p>
              </div>
            </div>

            <button
              onClick={() => dispatch(logout())}
              className="p-2 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
