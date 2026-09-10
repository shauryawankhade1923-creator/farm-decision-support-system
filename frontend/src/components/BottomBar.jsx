import React from "react";
import { Home, Sprout, BarChart2, User, Wheat, Bookmark } from "lucide-react";

export default function BottomBar({ currentScreen, onNavigate, flowMode }) {
  const tabs = [
    { id: "home", label: "Home", icon: Home, screen: "home" },
    { id: "farms", label: "All Farms", icon: Sprout, screen: "saved_fields" },
    { id: "statistic", label: "Statistic", icon: BarChart2, screen: "compare" },
    { id: "profile", label: "My Profile", icon: User, screen: "history" }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-xl mx-auto bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-6 py-2.5 flex items-center justify-around z-40 shadow-lg rounded-t-3xl">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentScreen === tab.screen;
        return (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.screen)}
            className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${
              isActive ? "text-[#0B4628]" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${isActive ? "bg-emerald-50 scale-110" : ""}`}>
              <Icon className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className={`text-[10px] font-bold ${isActive ? "font-black" : ""}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
