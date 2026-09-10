import React from "react";

export default function MetricCard({ title, value, subtext, icon: Icon, badge, variant = "default" }) {
  const getBadgeStyle = () => {
    switch (variant) {
      case "success":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "warning":
        return "bg-amber-100 text-amber-900 border-amber-200";
      case "danger":
        return "bg-rose-100 text-rose-800 border-rose-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getIconContainerStyle = () => {
    switch (variant) {
      case "success":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "warning":
        return "bg-amber-50 text-amber-600 border-amber-100";
      case "danger":
        return "bg-rose-50 text-rose-600 border-rose-100";
      default:
        return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className={`p-2.5 rounded-2xl border ${getIconContainerStyle()}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="my-1">
        <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{value}</div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-150 text-xs">
        <span className="text-slate-500 font-medium">{subtext}</span>
        {badge && (
          <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${getBadgeStyle()}`}>
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}

