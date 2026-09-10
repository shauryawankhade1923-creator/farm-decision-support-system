import React from "react";
import { 
  LayoutGrid, Activity, Bell, MessageSquare, Sprout, 
  TrendingUp, Droplets, Sun, Users, Bookmark, Settings,
  Wheat, Home
} from "lucide-react";

export default function Sidebar({ currentScreen, onNavigate, setCurrentScreen, flowMode, setFlowMode }) {
  // Support both onNavigate and setCurrentScreen props seamlessly
  const navigate = onNavigate || setCurrentScreen || (() => {});

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutGrid, action: () => navigate("dashboard") },
    { id: "home", label: "Portal Home", icon: Home, action: () => navigate("home") },
    { id: "sowing", label: "Sowing Advisory", icon: Sprout, action: () => { if (setFlowMode) setFlowMode("sowing"); navigate("farm_details"); } },
    { id: "harvest", label: "Harvest Shield", icon: Wheat, action: () => { if (setFlowMode) setFlowMode("harvest"); navigate("harvest_details"); } },
    { id: "analytics", label: "Compare Scenarios", icon: Activity, action: () => navigate("compare") },
    { id: "alerts", label: "Decision Engine", icon: Bell, action: () => navigate("decision") },
    { id: "reviews", label: "Farmer History & Reviews", icon: Users, action: () => navigate("history") },
    { id: "saved", label: "Saved Plots", icon: Bookmark, action: () => navigate("saved_fields") },
  ];

  return (
    <aside className="w-18 sm:w-20 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex flex-col items-center py-6 justify-between shrink-0 select-none z-30 min-h-screen">
      
      {/* Top Logo (Emerald Rounded Square with Sprout Swirl) */}
      <div className="flex flex-col items-center gap-6 w-full">
        <button
          onClick={() => navigate("dashboard")}
          className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 hover:scale-105 transition cursor-pointer"
          title="Smart Farm Command Center"
        >
          <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
          </svg>
        </button>

        {/* Navigation Icon List */}
        <nav className="flex flex-col items-center gap-2.5 w-full px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = 
              (item.id === "dashboard" && currentScreen === "dashboard") ||
              (item.id === "home" && currentScreen === "home") ||
              (item.id === "sowing" && currentScreen === "farm_details") ||
              (item.id === "harvest" && currentScreen === "harvest_details") ||
              (item.id === "analytics" && currentScreen === "compare") ||
              (item.id === "alerts" && currentScreen === "decision") ||
              (item.id === "reviews" && currentScreen === "history") ||
              (item.id === "saved" && currentScreen === "saved_fields");

            return (
              <button
                key={item.id}
                onClick={item.action}
                title={item.label}
                className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer relative group ${
                  isActive
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold shadow-xs border border-slate-200 dark:border-slate-700"
                    : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
              >
                <Icon className="w-5 h-5 stroke-[2]" />
                
                {/* Active Indicator Bar on left */}
                {isActive && (
                  <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-emerald-600 rounded-r-full" />
                )}

                {/* Tooltip on hover */}
                <span className="absolute left-16 bg-slate-900 text-white text-xs font-semibold px-2.5 py-1 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition whitespace-nowrap shadow-md z-50">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Settings Button */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 w-full flex justify-center">
        <button
          onClick={() => navigate("dashboard")}
          className="w-11 h-11 rounded-2xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center justify-center transition cursor-pointer"
          title="Command Center Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

    </aside>
  );
}
