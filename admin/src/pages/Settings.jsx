import React from "react";
import { Settings as SettingsIcon, Save } from "lucide-react";

const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          Platform Settings
        </h2>
        <p className="text-xs text-zinc-400 mt-1">
          Configure application preferences, security, and global variables.
        </p>
      </div>

      <div className="rounded-3xl p-6 bg-[#0e0e11] border border-white/5 max-w-2xl space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
              Project Name
            </label>
            <input
              type="text"
              defaultValue="RobG1326 Full Stack"
              className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2.5 px-4 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#80CF16] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
              Support Email
            </label>
            <input
              type="email"
              defaultValue="admin@example.com"
              className="w-full bg-[#18181b] border border-white/10 rounded-xl py-2.5 px-4 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#80CF16] transition-all"
            />
          </div>
        </div>

        <button className="px-5 py-2.5 rounded-xl bg-[#80CF16] hover:bg-[#94eb1b] text-black text-xs font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(128,207,22,0.2)] transition-all cursor-pointer">
          <Save size={15} />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );
};

export default Settings;
