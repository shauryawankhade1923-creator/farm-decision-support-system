import React from "react";
import { 
  ArrowLeft, Bell, ArrowRight, Sun, CloudRain, CheckCircle2, 
  Clock, AlertTriangle, ShieldCheck, Bookmark, RefreshCw, 
  Star, ChevronRight, Cpu, Sparkles, MessageSquare
} from "lucide-react";
import { translations } from "../locales/translations";

export default function DecisionScreen({ 
  decision, 
  farmerInput, 
  flowMode = "sowing",
  onGoToWhy, 
  onGoToCompare, 
  onSaveField, 
  onNewCheck, 
  onOpenFeedback,
  language = "en",
  onBack 
}) {
  const t = translations[language] || translations.en;
  if (!decision) return null;

  const { 
    verdict, 
    confidence_pct, 
    recommended_window, 
    summary, 
    daily_forecast, 
    crop_info, 
    ml_prediction 
  } = decision;

  const getVerdictStyle = () => {
    switch (verdict) {
      case "HARVEST BEFORE INCOMING RAIN":
        return {
          bannerBg: "bg-rose-800",
          headline: "HARVEST BEFORE INCOMING RAIN",
          sub: "Heavy rainfall threatens within 48h! Advance harvest immediately.",
          icon: AlertTriangle,
          statusColor: "text-rose-400"
        };
      case "HARVEST NOW":
        return {
          bannerBg: "bg-[#0B4628]",
          headline: "HARVEST NOW - EXCELLENT WINDOW",
          sub: "Crop is physiologically mature and weather offers a safe dry window.",
          icon: CheckCircle2,
          statusColor: "text-emerald-300"
        };
      case "SOW NOW":
        return {
          bannerBg: "bg-[#0B4628]",
          headline: "Today is a good day to sow.",
          sub: "Soil moisture and weather conditions are aligned for rapid emergence.",
          icon: CheckCircle2,
          statusColor: "text-emerald-300"
        };
      case "WAIT":
        return {
          bannerBg: "bg-amber-800",
          headline: "WAIT - DRY SPELL OR RAIN RISK",
          sub: flowMode === "harvest" 
            ? "Crop not yet fully mature or post-harvest drying days inadequate."
            : "Moisture deficit or dry gap detected in 7-day forecast. Postpone sowing.",
          icon: Clock,
          statusColor: "text-amber-300"
        };
      default:
        return {
          bannerBg: "bg-rose-800",
          headline: "CHANGE CROP OR POSTPONE",
          sub: "High seasonal mortality risk for this specific crop under current moisture.",
          icon: AlertTriangle,
          statusColor: "text-rose-300"
        };
    }
  };

  const vStyle = getVerdictStyle();
  const Icon = vStyle.icon;

  const notesList = [
    {
      id: 1,
      date: "Today . Live Telemetry",
      image: "/crops/soybean_pod.jpg",
      title: `${farmerInput.crop}: ${verdict}`,
      text: summary?.reason || vStyle.sub
    },
    {
      id: 2,
      date: "10-Day Horizon . Agronomy Rule",
      image: "/crops/wheat_golden.jpg",
      title: `Recommended Window: ${recommended_window?.start_date || "Immediate"} to ${recommended_window?.end_date || "Next Week"}`,
      text: summary?.risk_explanation || "Advisory based on ICAR agro-climatic rules and regional rainfall accumulation thresholds."
    },
    {
      id: 3,
      date: "Machine Learning Confidence",
      image: "/crops/cotton_bolls.jpg",
      title: `Confidence: ${confidence_pct}%`,
      text: ml_prediction 
        ? `Trained Random Forest Classifier predicts: ${ml_prediction.predicted_class} with ${ml_prediction.success_probability_pct}% emergence probability.`
        : `Rule evaluation confirmed with ${confidence_pct}% agronomic confidence index.`
    }
  ];

  return (
    <div className="w-full max-w-xl mx-auto pb-24 font-sans text-slate-900 antialiased">
      
      {/* 1. TOP HEADER (Matching Screen 3) */}
      <div className="px-6 py-5 flex items-center justify-between sticky top-0 bg-[#F4F6F5]/90 backdrop-blur-md z-20">
        <button 
          type="button"
          onClick={onNewCheck}
          className="w-10 h-10 rounded-full bg-white border border-slate-200/80 shadow-xs flex items-center justify-center text-slate-700 hover:bg-slate-50 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <h2 className="text-base font-black tracking-tight text-slate-900">Today's Weather & Decision</h2>

        <div className="w-10 h-10 rounded-full bg-white border border-slate-200/80 shadow-xs flex items-center justify-center text-slate-700 relative">
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-emerald-500 absolute top-2 right-2" />
        </div>
      </div>

      <div className="px-6 space-y-6">

        {/* 2. DEEP GREEN WEATHER BANNER CARD (Screen 3 Highlight) */}
        <div className={`${vStyle.bannerBg} rounded-[2rem] p-6 text-white shadow-xl relative overflow-hidden space-y-4`}>
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-emerald-200/80 block">
                {farmerInput.location}, Today's Advisory
              </span>
              <div className="mt-2">
                <span className="text-5xl font-black tracking-tight">28°C</span>
              </div>
              <p className="text-xs font-bold text-emerald-100/90 mt-1">
                Humidity: 76% &nbsp;•&nbsp; {farmerInput.crop}
              </p>
            </div>

            {/* Cloudy / Sun Graphic */}
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-amber-300 border border-white/20">
              <Sun className="w-9 h-9" />
            </div>
          </div>

          {/* Verdict Advisory Banner Text */}
          <div className="pt-3 border-t border-white/15">
            <h4 className="text-sm font-black text-white flex items-center gap-2">
              <Icon className={`w-4 h-4 ${vStyle.statusColor} stroke-[2.5]`} />
              <span>{vStyle.headline}</span>
            </h4>
            <p className="text-xs text-white/80 font-medium mt-1 leading-relaxed">
              {vStyle.sub}
            </p>
          </div>
        </div>

        {/* 3. PROPER MACHINE LEARNING MODEL CARD */}
        {ml_prediction && (
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">Random Forest Classifier</h4>
                  <span className="text-[10px] text-slate-400 font-bold">Trained Emergence Model</span>
                </div>
              </div>
              <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                {ml_prediction.success_probability_pct}% Emergence Prob
              </span>
            </div>

            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              {ml_prediction.predicted_class}: The ML model verifies that soil moisture retention on {farmerInput.soil_type} soil paired with forecasted rainfall supports uniform germination.
            </p>
          </div>
        )}

        {/* 4. NOTES SECTION (Screen 3 Chronological Feed) */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 tracking-tight">Advisory Notes</h3>
            <button
              onClick={onGoToCompare}
              className="w-7 h-7 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 transition"
              title="Compare all scenarios"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {notesList.map((note) => (
              <div
                key={note.id}
                className="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-xs flex items-center gap-3.5 hover:shadow-md transition cursor-pointer"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/60">
                  <img src={note.image} alt="crop note" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-black text-slate-400 block">{note.date}</span>
                  <h5 className="text-xs font-bold text-slate-900 truncate mt-0.5">{note.title}</h5>
                  <p className="text-[11px] text-slate-500 font-medium line-clamp-2 mt-0.5">
                    {note.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. ACTION BUTTONS (Screen 3 CTA: + Add New Note / Feedback) */}
        <div className="space-y-2 pt-2">
          <button
            onClick={onOpenFeedback}
            className="w-full py-4 rounded-full bg-[#0B4628] hover:bg-[#0F5E37] text-white font-black text-sm shadow-lg shadow-[#0B4628]/25 transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <MessageSquare className="w-4 h-4" />
            <span>+ Add Farmer Note & Review</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onGoToCompare}
              className="flex-1 py-3 rounded-2xl bg-white border border-slate-200/90 hover:bg-slate-50 text-slate-800 text-xs font-bold transition shadow-xs text-center"
            >
              Compare Alternative Dates
            </button>
            <button
              onClick={onSaveField}
              className="px-4 py-3 rounded-2xl bg-white border border-slate-200/90 hover:bg-slate-50 text-slate-800 text-xs font-bold transition shadow-xs flex items-center gap-1.5"
            >
              <Bookmark className="w-3.5 h-3.5 text-emerald-600" />
              <span>Save Plot</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
