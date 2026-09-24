import React, { useState } from "react";
import {
  MessageSquare,
  Mail,
  Phone,
  Trash2,
  CheckCircle2,
  Clock,
  Search,
} from "lucide-react";
import {
  useGetContactsQuery,
  useUpdateContactStatusMutation,
  useDeleteContactMutation,
} from "../redux/api/adminApiSlice";
import toast from "react-hot-toast";

const Leads = () => {
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: response, isLoading } = useGetContactsQuery({
    status: statusFilter || undefined,
    search: searchTerm || undefined,
  });

  const [updateStatus] = useUpdateContactStatusMutation();
  const [deleteContact] = useDeleteContactMutation();

  const leads = response?.data || [];

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
      toast.success(`Status updated to ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      try {
        await deleteContact(id).unwrap();
        toast.success("Lead deleted");
      } catch (err) {
        toast.error("Failed to delete lead");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Customer Leads & Repair Inquiries
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Live submissions from the contact form on the frontend website.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search leads..."
                className="bg-[#18181b] border border-white/10 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#80CF16]"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#18181b] border border-white/10 rounded-xl py-2 px-3 text-xs font-semibold text-white focus:outline-none focus:border-[#80CF16]"
            >
              <option value="">All Statuses</option>
              <option value="unread">Unread</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Leads Table */}
        {isLoading ? (
          <div className="py-8 text-center text-xs text-zinc-500">Loading leads...</div>
        ) : leads.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-500">
            No customer inquiries found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-zinc-400 border-b border-white/5 uppercase tracking-wider">
                <tr>
                  <th className="pb-3 px-4">Customer</th>
                  <th className="pb-3 px-4">Contact Info</th>
                  <th className="pb-3 px-4">Message</th>
                  <th className="pb-3 px-4">Date</th>
                  <th className="pb-3 px-4">Status</th>
                  <th className="pb-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">
                      {lead.fullName}
                    </td>
                    <td className="py-3.5 px-4 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-zinc-300">
                        <Phone size={12} className="text-[#80CF16]" />
                        <span>{lead.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-zinc-400">
                        <Mail size={12} />
                        <span>{lead.email}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-300 max-w-sm">
                      <p className="line-clamp-2">{lead.message}</p>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-500 whitespace-nowrap">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                        className={`text-[11px] font-bold uppercase rounded-lg px-2.5 py-1 border focus:outline-none cursor-pointer ${
                          lead.status === "unread"
                            ? "bg-red-500/10 text-red-400 border-red-500/20"
                            : lead.status === "in_progress"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            : "bg-[#80CF16]/10 text-[#80CF16] border-[#80CF16]/20"
                        }`}
                      >
                        <option value="unread" className="bg-[#18181b] text-red-400">Unread</option>
                        <option value="in_progress" className="bg-[#18181b] text-amber-400">In Progress</option>
                        <option value="resolved" className="bg-[#18181b] text-[#80CF16]">Resolved</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDelete(lead._id)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
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

export default Leads;
