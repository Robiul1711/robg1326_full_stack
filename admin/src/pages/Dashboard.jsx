import React from "react";
import { Sparkles, Users, CreditCard, DollarSign, UserCheck, ShieldAlert, ArrowUpRight } from "lucide-react";
import { useGetStatsQuery } from "../redux/api/adminApiSlice";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { data: statsRes, isLoading } = useGetStatsQuery();
  const stats = statsRes?.data || {
    totalUsers: 0,
    activeSubscribers: 0,
    trialUsers: 0,
    bannedUsers: 0,
    revenue: 0,
    recentUsers: [],
  };

  const statCards = [
    {
      title: "Total Registered Users",
      value: stats.totalUsers,
      icon: Users,
      color: "#00E676",
      bgGlow: "rgba(0, 230, 118, 0.15)",
    },
    {
      title: "Active Subscribers",
      value: stats.activeSubscribers,
      icon: CreditCard,
      color: "#38bdf8",
      bgGlow: "rgba(56, 189, 248, 0.15)",
    },
    {
      title: "7-Day Trial Users",
      value: stats.trialUsers,
      icon: UserCheck,
      color: "#a855f7",
      bgGlow: "rgba(168, 85, 247, 0.15)",
    },
    {
      title: "Estimated Monthly Revenue",
      value: `$${stats.revenue || 0}`,
      icon: DollarSign,
      color: "#f59e0b",
      bgGlow: "rgba(245, 158, 11, 0.15)",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-[#0e0e11] border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00E676]/10 border border-[#00E676]/20 text-[#00E676] text-xs font-bold mb-3">
            <Sparkles size={12} />
            <span>BetSnipe Intelligence Center</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Admin Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Real-time platform overview, user growth, and subscription metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/users"
            className="px-4 py-2 rounded-xl bg-[#00E676] hover:bg-[#00c864] text-black text-xs font-bold transition-all shadow-[0_0_15px_rgba(0,230,118,0.25)] flex items-center gap-2"
          >
            <Users size={14} />
            <span>Manage Users</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="p-5 rounded-2xl bg-[#0e0e11] border border-white/5 relative overflow-hidden transition-all hover:border-white/10"
            >
              <div
                className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl pointer-events-none"
                style={{ backgroundColor: card.bgGlow }}
              />
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium text-zinc-400">{card.title}</span>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: card.bgGlow, color: card.color }}
                >
                  <Icon size={16} />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">
                {isLoading ? "..." : card.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Users List */}
      <div className="rounded-3xl p-6 bg-[#0e0e11] border border-white/5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Recently Registered Users</h3>
            <p className="text-xs text-zinc-400">Latest sports bettors joined the platform</p>
          </div>
          <Link
            to="/users"
            className="text-xs font-semibold text-[#00E676] hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>

        {stats.recentUsers && stats.recentUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-white/5 uppercase text-[10px] tracking-wider text-zinc-400 border-b border-white/5">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Plan</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stats.recentUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-4 font-semibold text-white">{user.name}</td>
                    <td className="py-3 px-4 text-zinc-400">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-white/10 text-[#00E676]">
                        {user.subscriptionPlan || "free"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          user.status === "active"
                            ? "bg-[#00E676]/10 text-[#00E676]"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-zinc-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-zinc-500">
            No registered users found yet. Users will appear here when they register.
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
