import React, { useState } from "react";
import {
  Users as UsersIcon,
  Search,
  Shield,
  Ban,
  CheckCircle,
  Trash2,
  RefreshCw,
} from "lucide-react";
import {
  useGetUsersQuery,
  useUpdateUserStatusMutation,
  useDeleteUserMutation,
} from "../redux/api/adminApiSlice";
import toast from "react-hot-toast";

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: usersRes, isLoading, refetch } = useGetUsersQuery({ search: searchTerm });
  const [updateUserStatus] = useUpdateUserStatusMutation();
  const [deleteUser] = useDeleteUserMutation();

  const users = usersRes?.data || [];

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === "active" ? "banned" : "active";
    try {
      await updateUserStatus({ id: user._id, status: newStatus }).unwrap();
      toast.success(`User marked as ${newStatus}`);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update status");
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await deleteUser(id).unwrap();
      toast.success("User deleted successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete user");
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            User Management
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            View registered sports bettors, manage subscriptions and access rights.
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
            placeholder="Search users by name or email..."
            className="bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none w-full"
          />
        </div>

        {isLoading ? (
          <div className="text-center py-16 text-zinc-500 text-xs">
            <RefreshCw size={24} className="mx-auto mb-2 animate-spin text-[#00E676]" />
            <p>Loading user database...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-16 text-zinc-500 text-xs">
            <UsersIcon size={32} className="mx-auto mb-2 text-zinc-600" />
            <p>No user records found matching your query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-white/5 uppercase text-[10px] tracking-wider text-zinc-400 border-b border-white/5">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Plan</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-white/[0.02]">
                    <td className="py-3.5 px-4 font-semibold text-white flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs text-[#00E676] font-bold uppercase">
                        {user.name?.charAt(0) || "U"}
                      </div>
                      <span>{user.name}</span>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400">{user.email}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-white/5 text-zinc-300 border border-white/10">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#00E676]/10 text-[#00E676]">
                        {user.subscriptionPlan || "free"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
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
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {user.role !== "admin" && (
                          <>
                            <button
                              onClick={() => handleToggleStatus(user)}
                              title={user.status === "active" ? "Ban user" : "Unban user"}
                              className={`p-1.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                                user.status === "active"
                                  ? "bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
                                  : "bg-[#00E676]/10 border-[#00E676]/20 text-[#00E676] hover:bg-[#00E676]/20"
                              }`}
                            >
                              {user.status === "active" ? <Ban size={14} /> : <CheckCircle size={14} />}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user._id, user.name)}
                              title="Delete user"
                              className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-red-400 hover:bg-white/10 cursor-pointer transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
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

export default Users;
