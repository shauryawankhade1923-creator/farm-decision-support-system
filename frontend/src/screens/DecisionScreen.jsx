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

  const getLocalizedCropName = (cropName) => {
    if (!cropName) return "";
    if (cropName.includes("Soybean")) return language === "mr" ? "सोयाबीन" : language === "hi" ? "सोयाबीन" : cropName;
    if (cropName.includes("Cotton")) return language === "mr" ? "कापूस" : language === "hi" ? "कपास" : cropName;
    if (cropName.includes("Maize")) return language === "mr" ? "मका" : language === "hi" ? "मक्का" : cropName;
    if (cropName.includes("Wheat")) return language === "mr" ? "गहू" : language === "hi" ? "गेहूं" : cropName;
    if (cropName.includes("Groundnut")) return language === "mr" ? "भुईमूग" : language === "hi" ? "मूंगफली" : cropName;
    return cropName;
  };

  const getVerdictStyle = () => {
    switch (verdict) {
      case "HARVEST BEFORE INCOMING RAIN":
        return {
          bannerBg: "bg-rose-800",
          headline: t.harvestBeforeRainHeadline || "HARVEST BEFORE INCOMING RAIN",
          sub: t.harvestBeforeRainSub || "Heavy rainfall threatens within 48h! Advance harvest immediately.",
          icon: AlertTriangle,
          statusColor: "text-rose-400"
        };
      case "HARVEST NOW":
        return {
          bannerBg: "bg-[#0B4628]",
          headline: t.harvestNowHeadline || "HARVEST NOW - EXCELLENT WINDOW",
          sub: t.harvestNowSub || "Crop is physiologically mature and weather offers a safe dry window.",
          icon: CheckCircle2,
          statusColor: "text-emerald-300"
        };
      case "SOW NOW":
        return {
          bannerBg: "bg-[#0B4628]",
          headline: t.sowNowHeadline || "Today is a good day to sow.",
          sub: t.sowNowSub || "Soil moisture and weather conditions are aligned for rapid emergence.",
          icon: CheckCircle2,
          statusColor: "text-emerald-300"
        };
      case "WAIT":
        return {
          bannerBg: "bg-amber-800",
          headline: t.waitHeadline || "WAIT - DRY SPELL OR RAIN RISK",
          sub: flowMode === "harvest" 
            ? (t.waitSubHarvest || "Crop not yet fully mature or post-harvest drying days inadequate.")
            : (t.waitSubSowing || "Moisture deficit or dry gap detected in 7-day forecast. Postpone sowing."),
          icon: Clock,
          statusColor: "text-amber-300"
        };
      default:
        return {
          bannerBg: "bg-rose-800",
          headline: t.changeCropHeadline || "CHANGE CROP OR POSTPONE",
          sub: t.changeCropSub || "High seasonal mortality risk for this specific crop under current moisture.",
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
      date: t.noteLiveTelemetry || "Today • Live Telemetry",
      image: "/crops/soybean_pod.jpg",
      title: `${getLocalizedCropName(farmerInput.crop)}: ${vStyle.headline}`,
      text: summary?.reason || vStyle.sub
    },
    {
      id: 2,
      date: t.noteAgronomyRule || "10-Day Horizon • Agronomy Rule",
      image: "/crops/wheat_golden.jpg",
      title: `${t.recWindowLabel || "Recommended Window"}: ${recommended_window?.start_date || (t.immediate || "Immediate")} - ${recommended_window?.end_date || (t.nextWeek || "Next Week")}`,
      text: summary?.risk_explanation || t.ruleAdvisoryDesc || "Advisory based on ICAR agro-climatic rules and regional rainfall accumulation thresholds."
    },
    {
      id: 3,
      date: t.noteMlConfidence || "Machine Learning Confidence",
      image: "/crops/cotton_bolls.jpg",
      title: `${t.confidenceLabel || "Confidence"}: ${confidence_pct}%`,
      text: ml_prediction 
        ? (language === "mr" 
            ? `प्रशिक्षित रँडम फॉरेस्ट मॉडेल अंदाज: ${ml_prediction.predicted_class} (${ml_prediction.success_probability_pct}% उगवण संभाव्यता).` 
            : language === "hi" 
            ? `प्रशिक्षित रैंडम फॉरेस्ट मॉडल अनुमान: ${ml_prediction.predicted_class} (${ml_prediction.success_probability_pct}% अंकुरण संभावना)।` 
            : `Trained Random Forest Classifier predicts: ${ml_prediction.predicted_class} with ${ml_prediction.success_probability_pct}% emergence probability.`)
        : (language === "mr" 
            ? `ICAR कृषी नियमांनुसार ${confidence_pct}% विश्वासार्हता निर्देशांक.` 
            : `Rule evaluation confirmed with ${confidence_pct}% agronomic confidence index.`)
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

        <h2 className="text-base font-black tracking-tight text-slate-900">{t.decisionScreenTitle || "Today's Weather & Decision"}</h2>

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
                {farmerInput.location}, {t.todayAdvisorySub || "Today's Advisory"}
              </span>
              <div className="mt-2">
                <span className="text-5xl font-black tracking-tight">28°C</span>
              </div>
              <p className="text-xs font-bold text-emerald-100/90 mt-1">
                {t.humidityLabel || "Humidity"}: 76% &nbsp;•&nbsp; {getLocalizedCropName(farmerInput.crop)}
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
                  <h4 className="text-xs font-black text-slate-900">{t.mlCardTitle || "Random Forest Classifier"}</h4>
                  <span className="text-[10px] text-slate-400 font-bold">{t.mlCardSub || "Trained Emergence Model"}</span>
                </div>
              </div>
              <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                {ml_prediction.success_probability_pct}% {t.mlEmergenceProb || "Emergence Prob"}
              </span>
            </div>

            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              <strong>{ml_prediction.predicted_class}</strong>: {t.mlVerificationText || "The ML model verifies that soil moisture retention supports uniform germination."}
            </p>
          </div>
        )}

        {/* 4. NOTES SECTION (Screen 3 Chronological Feed) */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 tracking-tight">{t.advisoryNotesTitle || "Advisory Notes"}</h3>
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
            <span>{t.addFarmerNoteBtn || "+ Add Farmer Note & Review"}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onGoToCompare}
              className="flex-1 py-3 rounded-2xl bg-white border border-slate-200/90 hover:bg-slate-50 text-slate-800 text-xs font-bold transition shadow-xs text-center"
            >
              {t.compareAlternativeBtn || t.btnCompare || "Compare Alternative Options"}
            </button>
            <button
              onClick={onSaveField}
              className="px-4 py-3 rounded-2xl bg-white border border-slate-200/90 hover:bg-slate-50 text-slate-800 text-xs font-bold transition shadow-xs flex items-center gap-1.5"
            >
              <Bookmark className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.savePlotBtn || t.btnSaveField || "Save Plot"}</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
