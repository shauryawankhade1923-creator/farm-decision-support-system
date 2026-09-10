import React from "react";
import { ChevronDown, Globe, Plus, Sparkles, Sprout, Wheat } from "lucide-react";

export default function TopBar({
  farmerName = "Farmer",
  flowMode = "sowing",
  setFlowMode,
  language = "en",
  setLanguage,
  currentScreen,
  onNavigate
}) {
  return (
    <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-6 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20">
      
      {/* Left Greeting */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <span>Hi, {farmerName}!</span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
          Farm Command Center • Active Operations
        </p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
        
        {/* Flow Mode Switcher Pill */}
        <div className="hidden sm:flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
          <button
            onClick={() => {
              if (setFlowMode) setFlowMode("sowing");
              if (onNavigate) onNavigate("farm_details");
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              flowMode === "sowing"
                ? "bg-emerald-500 text-slate-950 font-black shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400"
            }`}
          >
            <Sprout className="w-3.5 h-3.5" />
            <span>Sowing</span>
          </button>
          <button
            onClick={() => {
              if (setFlowMode) setFlowMode("harvest");
              if (onNavigate) onNavigate("harvest_details");
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              flowMode === "harvest"
                ? "bg-amber-500 text-slate-950 font-black shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400"
            }`}
          >
            <Wheat className="w-3.5 h-3.5" />
            <span>Harvest</span>
          </button>
        </div>

        {/* Language switcher */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-full border border-slate-200 dark:border-slate-700 text-xs">
          <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
          <select
            value={language}
            onChange={(e) => setLanguage && setLanguage(e.target.value)}
            className="bg-transparent text-slate-800 dark:text-slate-200 text-xs font-bold rounded-full px-2 py-1 focus:outline-none cursor-pointer"
          >
            <option value="en" className="dark:bg-slate-900">English</option>
            <option value="mr" className="dark:bg-slate-900">मराठी</option>
            <option value="hi" className="dark:bg-slate-900">हिंदी</option>
          </select>
        </div>

        {/* User Profile Pill */}
        <div className="flex items-center gap-3 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-1.5 pr-3 shadow-xs hover:border-slate-300 transition cursor-pointer">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow-inner">
            <span className="text-sm font-black">FD</span>
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-black text-slate-900 dark:text-white leading-tight flex items-center gap-1">
              <span>Farm Operations</span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium leading-none">
              active@farm.local
            </div>
          </div>
        </div>

        {/* Quick New Assessment Button */}
        {onNavigate && (
          <button
            onClick={() => onNavigate(flowMode === "harvest" ? "harvest_details" : "farm_details")}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden md:inline">New Assessment</span>
          </button>
        )}

      </div>
    </header>
  );
}
