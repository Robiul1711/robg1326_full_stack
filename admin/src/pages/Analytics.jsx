import React from "react";
import { BarChart3, TrendingUp, DollarSign, Users } from "lucide-react";

const Analytics = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          System Analytics
        </h2>
        <p className="text-xs text-zinc-400 mt-1">
          Detailed metrics, conversion rates, and revenue performance.
        </p>
      </div>

      <div className="rounded-3xl p-6 bg-[#0e0e11] border border-white/5">
        <div className="text-center py-16 text-zinc-500 text-xs">
          <BarChart3 size={32} className="mx-auto mb-2 text-zinc-600" />
          <p>Analytics reports will appear here as your application collects data.</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
