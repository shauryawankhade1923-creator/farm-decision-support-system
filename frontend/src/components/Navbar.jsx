import React from "react";
import { Sprout, Globe, Compass, Bookmark, History as HistoryIcon, Wheat, Zap, Sparkles } from "lucide-react";
import { translations } from "../locales/translations";

export default function Navbar({ currentScreen, setCurrentScreen, flowMode, setFlowMode, language, setLanguage }) {
  const t = translations[language] || translations.en;

  const handleStartAdvice = () => {
    if (flowMode === "harvest") {
      setCurrentScreen("harvest_details");
    } else {
      if (setFlowMode) setFlowMode("sowing");
      setCurrentScreen("farm_details");
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setCurrentScreen("home")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* Geometric Modern Icon reminiscent of reference */}
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-600 via-blue-600 to-indigo-700 shadow-md shadow-blue-500/20 text-white group-hover:scale-105 transition">
              <Sprout className="w-6 h-6 text-white" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-orange-500 border-2 border-white flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl tracking-tight text-slate-900 flex items-center gap-1">
                  AGRI<span className="text-orange-500">DECIDE</span>
                </span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 border border-orange-200 hidden sm:inline-block">
                  AI + ICAR
                </span>
              </div>
              <span className="text-xs text-slate-500 font-medium hidden md:block">
                Smart Agro-Climatic Decision Engine
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setCurrentScreen("home")}
              className={`px-3.5 py-2 rounded-full text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer ${
                currentScreen === "home"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
              }`}
            >
              <Compass className="w-4 h-4" />
              <span className="hidden md:inline">{t.navHome}</span>
            </button>

            <button
              onClick={() => {
                if (setFlowMode) setFlowMode("sowing");
                setCurrentScreen("farm_details");
              }}
              className={`px-3.5 py-2 rounded-full text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer ${
                (currentScreen === "farm_details" || (["decision", "explanation", "compare"].includes(currentScreen) && flowMode === "sowing"))
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
              }`}
            >
              <Sprout className="w-4 h-4 text-emerald-500" />
              <span>Sowing</span>
            </button>

            <button
              onClick={() => {
                if (setFlowMode) setFlowMode("harvest");
                setCurrentScreen("harvest_details");
              }}
              className={`px-3.5 py-2 rounded-full text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer ${
                (currentScreen === "harvest_details" || (["decision", "explanation", "compare"].includes(currentScreen) && flowMode === "harvest"))
                  ? "bg-amber-500 text-slate-950 shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
              }`}
            >
              <Wheat className="w-4 h-4 text-amber-500" />
              <span>Harvest</span>
            </button>

            <button
              onClick={() => setCurrentScreen("saved_fields")}
              className={`px-3.5 py-2 rounded-full text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer ${
                currentScreen === "saved_fields"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span className="hidden lg:inline">{t.navSaved}</span>
            </button>

            <button
              onClick={() => setCurrentScreen("history")}
              className={`px-3.5 py-2 rounded-full text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer ${
                currentScreen === "history"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
              }`}
            >
              <HistoryIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Reviews</span>
            </button>

            {/* Language Selector */}
            <div className="ml-1 sm:ml-2 pl-2 border-l border-slate-200 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-slate-400 hidden sm:block" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-slate-100 hover:bg-slate-200/70 border border-slate-200 text-slate-800 text-xs font-bold rounded-full px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-400 cursor-pointer transition"
                title="Change language"
              >
                <option value="en">EN</option>
                <option value="mr">मराठी</option>
                <option value="hi">हिंदी</option>
              </select>
            </div>

            {/* Primary Action Button (Matches "Instant Quote" in reference image) */}
            <button
              onClick={handleStartAdvice}
              className="ml-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-full shadow-md shadow-orange-500/25 hover:shadow-orange-500/35 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Instant Advice</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}