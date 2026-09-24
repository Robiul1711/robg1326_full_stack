import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import Logo from "../common/Logo";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Users", href: "/users", icon: Users },
  { name: "Orders", href: "/orders", icon: ShoppingBag },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

const Sidebar = ({ isMobileOpen, setIsMobileOpen, isCollapsed, setIsCollapsed }) => {
  const dispatch = useDispatch();
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
        className={`fixed top-0 left-0 bottom-0 z-50 bg-[#0e0e11] border-r border-white/5 flex flex-col justify-between transition-all duration-300 ease-in-out ${
          isCollapsed ? "lg:w-20" : "lg:w-64"
        } w-64 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="h-16 px-4 flex items-center justify-between border-b border-white/5 relative">
            <Logo showTagline={true} isCollapsed={isCollapsed} />
            
            {/* Desktop Collapse Toggle Button */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#18181b] border border-white/10 text-zinc-400 hover:text-white hover:border-[#80CF16] hover:bg-[#80CF16]/10 items-center justify-center transition-all cursor-pointer shadow-lg z-10"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  title={isCollapsed ? item.name : undefined}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isCollapsed ? "justify-center px-0" : ""
                    } ${
                      isActive
                        ? "bg-[#80CF16] text-black font-extrabold shadow-[0_0_20px_rgba(128,207,22,0.25)]"
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon size={18} className="shrink-0 transition-transform duration-200 group-hover:scale-110" />
                      {!isCollapsed && <span className="truncate">{item.name}</span>}

                      {/* Tooltip for collapsed mode on hover */}
                      {isCollapsed && (
                        <div className="hidden lg:group-hover:block absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-[#18181b] border border-white/10 text-white text-xs whitespace-nowrap shadow-xl z-50 pointer-events-none">
                          {item.name}
                        </div>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Profile & Logout */}
        <div className="p-3 border-t border-white/5">
          <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"} gap-2`}>
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-[#80CF16]/20 border border-[#80CF16]/40 flex items-center justify-center text-xs font-bold text-[#80CF16] shrink-0">
                {adminUser?.name?.charAt(0) || "A"}
              </div>
              {!isCollapsed && (
                <div className="truncate">
                  <p className="text-xs font-bold text-white truncate">
                    {adminUser?.name || "Admin"}
                  </p>
                  <p className="text-[10px] text-zinc-500 truncate">
                    {adminUser?.email || "admin@example.com"}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => dispatch(logout())}
              className={`p-2 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer shrink-0 ${
                isCollapsed ? "hidden" : ""
              }`}
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
