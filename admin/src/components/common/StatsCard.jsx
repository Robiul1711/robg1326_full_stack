import React from "react";

const StatsCard = ({ title, value, change, icon: Icon, color = "#80CF16" }) => {
  return (
    <div className="glass-card rounded-2xl p-5 relative overflow-hidden transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5 tracking-tight">
            {value}
          </h3>
          {change && (
            <p className="text-xs text-[#80CF16] mt-2 font-medium flex items-center gap-1">
              <span>{change}</span>
            </p>
          )}
        </div>

        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center border border-white/10"
          style={{
            backgroundColor: `${color}15`,
            color: color,
          }}
        >
          {Icon && <Icon size={24} />}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
