import React, { useState } from "react";
import { ShoppingBag, Search, CreditCard, RefreshCw, CheckCircle2, Clock } from "lucide-react";
import { useGetOrdersQuery } from "../redux/api/adminApiSlice";

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: ordersRes, isLoading, refetch } = useGetOrdersQuery();

  const orders = (ordersRes?.data || []).filter((order) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      order.userName?.toLowerCase().includes(term) ||
      order.userEmail?.toLowerCase().includes(term) ||
      order.plan?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Subscriptions & Transactions
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Track user purchases, Stripe checkouts, and 7-day trials.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer w-fit"
        >
          <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="rounded-3xl p-6 bg-[#0e0e11] border border-white/5 space-y-4">
        <div className="flex items-center gap-3 bg-[#18181b] border border-white/10 rounded-xl px-3.5 py-2.5 max-w-md">
          <Search size={16} className="text-zinc-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by customer name, email or plan..."
            className="bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none w-full"
          />
        </div>

        {isLoading ? (
          <div className="text-center py-16 text-zinc-500 text-xs">
            <RefreshCw size={24} className="mx-auto mb-2 animate-spin text-[#00E676]" />
            <p>Loading transactions...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 text-zinc-500 text-xs">
            <ShoppingBag size={32} className="mx-auto mb-2 text-zinc-600" />
            <p>No subscription transactions recorded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-white/5 uppercase text-[10px] tracking-wider text-zinc-400 border-b border-white/5">
                <tr>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Plan</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Expires</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-white/[0.02]">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{order.userName}</div>
                      <div className="text-[11px] text-zinc-500">{order.userEmail}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-white/5 text-[#00E676] border border-white/10">
                        {order.plan}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white">
                      ${order.amount} {order.currency?.toUpperCase()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          order.status === "active" || order.status === "completed"
                            ? "bg-[#00E676]/10 text-[#00E676]"
                            : "bg-amber-500/10 text-amber-400"
                        }`}
                      >
                        {order.status === "active" ? (
                          <CheckCircle2 size={12} />
                        ) : (
                          <Clock size={12} />
                        )}
                        <span>{order.status}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-500">
                      {order.currentPeriodEnd
                        ? new Date(order.currentPeriodEnd).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
