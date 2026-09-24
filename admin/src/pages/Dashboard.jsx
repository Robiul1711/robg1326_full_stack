import React from "react";
import { Link } from "react-router-dom";
import {
  Smartphone,
  Wrench,
  ShoppingBag,
  MessageSquare,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Sparkles,
} from "lucide-react";
import StatsCard from "../components/common/StatsCard";
import { useGetStatsQuery } from "../redux/api/adminApiSlice";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    return (
      <div className="bg-[#18181b] border border-white/20 rounded-xl p-3 shadow-2xl backdrop-blur-md">
        <p className="text-xs font-bold text-white mb-1 tracking-wide">{label}</p>
        <div className="flex items-center gap-2 text-xs font-bold">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: item.payload?.color || "#80CF16" }}
          />
          <span className="text-zinc-300">Total Count:</span>
          <span className="text-[#80CF16] font-black text-sm">{item.value}</span>
        </div>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const { data: response, isLoading } = useGetStatsQuery();
  const stats = response?.data || {};

  const chartData = [
    { name: "Categories", count: stats.totalCategories || 0, color: "#80CF16" },
    { name: "Device Models", count: stats.totalModels || 0, color: "#38bdf8" },
    { name: "Services", count: stats.totalServices || 0, color: "#a855f7" },
    { name: "Marketplace", count: stats.totalProducts || 0, color: "#f59e0b" },
    { name: "Customer Leads", count: stats.totalLeads || 0, color: "#ec4899" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#80CF16]/10 border border-[#80CF16]/20 text-[#80CF16] text-xs font-bold mb-3">
            <Sparkles size={12} />
            <span>Real-time Active Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome to Sub Zero Control Center
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2 leading-relaxed">
            All updates you make here are instantly pushed to the frontend via Socket.io without needing any page reload.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <Link
            to="/services"
            className="px-5 py-2.5 rounded-xl bg-[#80CF16] text-black text-xs font-bold tracking-wide shadow-md hover:bg-[#91e81b] transition-all cursor-pointer"
          >
            Manage Services
          </Link>
          <Link
            to="/marketplace"
            className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-semibold hover:bg-white/10 transition-all cursor-pointer"
          >
            Add New Product
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Device Categories"
          value={isLoading ? "..." : stats.totalCategories || 0}
          change={`${stats.totalModels || 0} Models linked`}
          icon={Smartphone}
          color="#80CF16"
        />
        <StatsCard
          title="Repair Services"
          value={isLoading ? "..." : stats.totalServices || 0}
          change="Real-time pricing enabled"
          icon={Wrench}
          color="#38bdf8"
        />
        <StatsCard
          title="Marketplace Stock"
          value={isLoading ? "..." : stats.totalProducts || 0}
          change={`${stats.availableProducts || 0} Available in stock`}
          icon={ShoppingBag}
          color="#f59e0b"
        />
        <StatsCard
          title="Customer Leads"
          value={isLoading ? "..." : stats.totalLeads || 0}
          change={`${stats.unreadLeads || 0} Unread inquiries`}
          icon={MessageSquare}
          color="#ec4899"
        />
      </div>

      {/* Chart & Quick Leads Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* System Distribution Chart */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                System Data Overview
              </h3>
              <p className="text-xs text-zinc-400">Total items across all collections</p>
            </div>
            <TrendingUp size={18} className="text-[#80CF16]" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} cursor="pointer" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Inquiries Panel */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Recent Leads
              </h3>
              <p className="text-xs text-zinc-400">Latest customer inquiries</p>
            </div>
            <Link
              to="/leads"
              className="text-xs font-semibold text-[#80CF16] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="space-y-3 mt-4">
            {!stats.recentLeads || stats.recentLeads.length === 0 ? (
              <div className="text-center py-8 text-xs text-zinc-500">
                No customer inquiries yet.
              </div>
            ) : (
              stats.recentLeads.map((lead) => (
                <div
                  key={lead._id}
                  className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between hover:bg-white/[0.04] transition-colors"
                >
                  <div className="truncate max-w-[70%]">
                    <p className="text-xs font-bold text-white truncate">{lead.fullName}</p>
                    <p className="text-[11px] text-zinc-400 truncate">{lead.phone} • {lead.email}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      lead.status === "unread"
                        ? "bg-red-500/10 text-red-400 border border-red-500/20"
                        : "bg-[#80CF16]/10 text-[#80CF16] border border-[#80CF16]/20"
                    }`}
                  >
                    {lead.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
