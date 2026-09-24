import React from "react";
import { Users as UsersIcon, Plus, Search, MoreVertical } from "lucide-react";

const Users = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            User Management
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Manage registered users, roles, and permissions.
          </p>
        </div>
        <button className="px-4 py-2.5 rounded-xl bg-[#80CF16] hover:bg-[#94eb1b] text-black text-xs font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(128,207,22,0.2)] transition-all cursor-pointer w-fit">
          <Plus size={15} />
          <span>Add User</span>
        </button>
      </div>

      <div className="rounded-3xl p-6 bg-[#0e0e11] border border-white/5 space-y-4">
        <div className="flex items-center gap-3 bg-[#18181b] border border-white/10 rounded-xl px-3.5 py-2.5 max-w-md">
          <Search size={16} className="text-zinc-500" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            className="bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none w-full"
          />
        </div>

        <div className="text-center py-16 text-zinc-500 text-xs">
          <UsersIcon size={32} className="mx-auto mb-2 text-zinc-600" />
          <p>No user records yet. Ready for your new project's user collection.</p>
        </div>
      </div>
    </div>
  );
};

export default Users;
