import React from "react";
import { Sparkles, LayoutDashboard } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-[#0e0e11] border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#80CF16]/10 border border-[#80CF16]/20 text-[#80CF16] text-xs font-bold mb-3">
            <Sparkles size={12} />
            <span>Control Center</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Admin Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Welcome to your fresh administrative panel.
          </p>
        </div>
      </div>

      {/* Clean Empty State Canvas */}
      <div className="rounded-3xl p-12 bg-[#0e0e11] border border-white/5 flex flex-col items-center justify-center text-center min-h-[350px]">
        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 mb-3">
          <LayoutDashboard size={24} />
        </div>
        <h3 className="text-sm font-bold text-white mb-1">Clean Dashboard Workspace</h3>
        <p className="text-xs text-zinc-500 max-w-sm">
          This dashboard is completely fresh and ready for your new project's widgets and analytics.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
