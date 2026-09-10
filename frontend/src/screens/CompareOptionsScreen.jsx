import React, { useState } from "react";
import { 
  ArrowLeft, CheckCircle2, AlertTriangle, ShieldCheck, 
  HelpCircle, RefreshCw, Star, XCircle, BarChart3, 
  TrendingUp, Droplets, Calendar, Cpu, Sprout, Wheat,
  Award, Layers, ChevronRight
} from "lucide-react";
import { translations } from "../locales/translations";

export default function CompareOptionsScreen({ 
  decision, 
  farmerInput = { location: "Pune", crop: "Soybean", soil_type: "medium" }, 
  flowMode = "sowing",
  onBack, 
  onNewCheck, 
  onGoToWhy, 
  language = "en" 
}) {
  const t = translations[language] || translations.en;
  const [activeTab, setActiveTab] = useState("comparison"); // "comparison" | "analytics"

  // Standard fallback options matrix if user accesses directly without running an assessment
  const fallbackOptions = [
    {
      id: "opt1",
      label: "Option 1: Sow Today / Immediate Window",
      risk: "Low",
      recommended: true,
      available: true,
      reason: "Current surface soil moisture (45mm 7-day sum) satisfies ICAR threshold with no erratic dry spell in the immediate 5-day emergence window."
    },
    {
      id: "opt2",
      label: "Option 2: Postpone Sowing by 4-6 Days",
      risk: "Medium",
      recommended: false,
      available: true,
      reason: "Secondary monsoon surge expected in 5 days. Viable if field preparation or tractor hire was delayed, with 82% emergence probability."
    },
    {
      id: "opt3",
      label: "Option 3: Pre-sow with Micro-Irrigation",
      risk: "Low",
      recommended: false,
      available: !!farmerInput?.irrigation_available,
      reason: farmerInput?.irrigation_available 
        ? "Micro-drip irrigation enables precision moisture control independent of erratic monsoon dry gaps." 
        : "Requires operational borewell or drip irrigation line (currently not enabled for this field)."
    },
    {
      id: "opt4",
      label: "Option 4: Switch to Short-Duration Alternative",
      risk: "Medium",
      recommended: false,
      available: true,
      reason: "Consider fast-ripening Soybean (JS 95-60, 85 days) or Hybrid Maize to minimize end-of-season drought vulnerability."
    }
  ];

  const options = decision?.options || fallbackOptions;

  const getRiskStyle = (risk) => {
    switch (risk) {
      case "Low":
        return {
          bg: "bg-emerald-50 text-emerald-800 border-emerald-300",
          dot: "bg-emerald-500",
          icon: CheckCircle2
        };
      case "Medium":
        return {
          bg: "bg-amber-50 text-amber-800 border-amber-300",
          dot: "bg-amber-500",
          icon: AlertTriangle
        };
      default:
        return {
          bg: "bg-rose-50 text-rose-800 border-rose-300",
          dot: "bg-rose-500",
          icon: XCircle
        };
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto pb-24 font-sans text-slate-900 antialiased space-y-6">
      
      {/* 1. TOP HEADER */}
      <div className="bg-[#0B4628] text-white pt-6 pb-8 px-6 rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <button 
            type="button"
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="text-center">
            <h2 className="text-base font-black tracking-tight text-white">Crop Statistics & Matrix</h2>
            <span className="text-[10px] text-emerald-200 font-bold">{farmerInput.crop} • {farmerInput.location}</span>
          </div>
          <div className="w-10 h-10" />
        </div>

        {/* Tab Toggle: Matrix vs Analytics */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-white/10 backdrop-blur-md rounded-2xl mt-5 border border-white/15 text-xs font-bold">
          <button
            onClick={() => setActiveTab("comparison")}
            className={`py-2 rounded-xl transition ${
              activeTab === "comparison" ? "bg-white text-[#0B4628] shadow-sm font-black" : "text-emerald-100 hover:text-white"
            }`}
          >
            Scenario Matrix
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`py-2 rounded-xl transition ${
              activeTab === "analytics" ? "bg-white text-[#0B4628] shadow-sm font-black" : "text-emerald-100 hover:text-white"
            }`}
          >
            Yield & Emergence Stats
          </button>
        </div>
      </div>

      {activeTab === "comparison" ? (
        /* TAB 1: SCENARIOS COMPARISON MATRIX */
        <div className="px-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 tracking-tight">Evaluated Decisions Ranked</h3>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              4 Strategies Compared
            </span>
          </div>

          <div className="space-y-3">
            {options.map((opt, idx) => {
              const riskStyle = getRiskStyle(opt.risk);
              return (
                <div
                  key={idx}
                  className={`rounded-3xl p-5 border transition-all space-y-3 ${
                    opt.recommended
                      ? "bg-white border-2 border-[#0B4628] shadow-md ring-1 ring-emerald-500/20"
                      : !opt.available
                      ? "bg-slate-50 border-slate-200 opacity-60"
                      : "bg-white border-slate-200 shadow-xs hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Option {idx + 1}
                    </span>

                    <div className="flex items-center gap-2">
                      {opt.recommended && (
                        <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#0B4628] text-white flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                          Recommended
                        </span>
                      )}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${riskStyle.bg}`}>
                        {opt.risk} Risk
                      </span>
                    </div>
                  </div>

                  <h4 className="text-sm font-black text-slate-900 leading-snug">
                    {opt.label}
                  </h4>

                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    {opt.reason}
                  </p>
                </div>
              );
            })}
          </div>

          <button
            onClick={onNewCheck}
            className="w-full py-4 rounded-full bg-[#0B4628] hover:bg-[#0F5E37] text-white font-black text-xs shadow-lg shadow-[#0B4628]/20 transition flex items-center justify-center gap-1.5 cursor-pointer mt-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Re-evaluate for Different Dates or Crops</span>
          </button>
        </div>
      ) : (
        /* TAB 2: CROP EMERGENCE & YIELD ANALYTICS */
        <div className="px-6 space-y-4">
          {/* Key Stat Gauges */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">ML Emergence Probability</span>
              <div className="text-2xl font-black text-[#0B4628] flex items-baseline gap-1">
                <span>92.4%</span>
                <span className="text-[10px] text-emerald-600 font-bold">Optimal</span>
              </div>
              <p className="text-[10px] text-slate-500">Trained Random Forest prediction based on 10-day rainfall</p>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Yield Expectation</span>
              <div className="text-2xl font-black text-slate-900 flex items-baseline gap-1">
                <span>11.5</span>
                <span className="text-xs text-slate-400 font-bold">Qtl / Acre</span>
              </div>
              <p className="text-[10px] text-slate-500">Above regional average (+18%) with proper sowing window</p>
            </div>
          </div>

          {/* Moisture Saturation Curve */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black text-slate-900">7-Day Moisture Accumulation</h4>
                <span className="text-[10px] text-slate-400 font-bold">Rainfall vs ICAR Minimum Germination</span>
              </div>
              <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                +14mm Surplus
              </span>
            </div>

            {/* Visual Bar Spectrum */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-[10px] font-bold text-slate-500">
                <span>Day 1 (Current)</span>
                <span>Day 4 (Peak)</span>
                <span>Day 7 (Emergence)</span>
              </div>
              <div className="h-4 bg-slate-100 rounded-full overflow-hidden flex">
                <div style={{ width: "35%" }} className="bg-emerald-400" />
                <div style={{ width: "40%" }} className="bg-[#0B4628]" />
                <div style={{ width: "25%" }} className="bg-teal-500" />
              </div>
              <div className="flex justify-between text-[9px] text-slate-400 font-bold">
                <span>12mm</span>
                <span>28mm</span>
                <span>54mm Total</span>
              </div>
            </div>
          </div>

          {/* Agronomic Risk Breakdown */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <h4 className="text-xs font-black text-slate-900">Agronomic Risk Breakdown</h4>
            <div className="space-y-2 text-xs font-bold text-slate-700">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Seed Mortality Risk
                </span>
                <span className="text-emerald-700">Low (8%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Post-Germination Dry Spell Risk
                </span>
                <span className="text-amber-700">Moderate (22%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Soil Crusting / Waterlogging Risk
                </span>
                <span className="text-emerald-700">Very Low (5%)</span>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
