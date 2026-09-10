import React from "react";
import { Sparkles, Activity, CheckCircle2, AlertTriangle, ShieldCheck, BarChart2 } from "lucide-react";

export default function MLPredictionCard({ mlPrediction }) {
  if (!mlPrediction) return null;

  const {
    model_name,
    success_probability_pct,
    predicted_class,
    model_accuracy_pct,
    model_roc_auc,
    top_drivers
  } = mlPrediction;

  const isFavorable = success_probability_pct >= 70;
  const isModerate = success_probability_pct >= 50 && success_probability_pct < 70;

  const getStatusConfig = () => {
    if (isFavorable) {
      return {
        badgeBg: "bg-emerald-100 text-emerald-800 border-emerald-300",
        barBg: "bg-emerald-500",
        ringColor: "text-emerald-600",
        icon: CheckCircle2,
        desc: "Historical agro-climatic pattern matches successful germination cohorts."
      };
    } else if (isModerate) {
      return {
        badgeBg: "bg-amber-100 text-amber-800 border-amber-300",
        barBg: "bg-amber-500",
        ringColor: "text-amber-600",
        icon: AlertTriangle,
        desc: "Marginal emergence risk detected based on multi-season moisture volatility."
      };
    } else {
      return {
        badgeBg: "bg-rose-100 text-rose-800 border-rose-300",
        barBg: "bg-rose-500",
        ringColor: "text-rose-600",
        icon: AlertTriangle,
        desc: "High emergence failure rate in historical training data under these conditions."
      };
    }
  };

  const status = getStatusConfig();
  const StatusIcon = status.icon;

  return (
    <div className="bg-gradient-to-br from-indigo-950/95 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-indigo-500/30 relative overflow-hidden space-y-5">
      {/* Glow decorative element */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 relative z-10 border-b border-indigo-800/40 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shadow-inner">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
                Machine Learning Emergence Intelligence
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                Trained AI
              </span>
            </div>
            <p className="text-xs text-indigo-200/70 font-medium">
              Calibrated on 3,000 multi-season Maharashtra agro-climatic records
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-indigo-900/40 px-3 py-1.5 rounded-xl border border-indigo-700/40 text-indigo-200">
          <Activity className="w-3.5 h-3.5 text-indigo-400" />
          <span>Acc: {model_accuracy_pct}% • ROC-AUC: {model_roc_auc}</span>
        </div>
      </div>

      {/* Probability Gauge & Class Verdict */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center relative z-10">
        <div className="sm:col-span-5 bg-white/5 p-4 rounded-2xl border border-white/10 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
            <span>Predicted Emergence Success</span>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${status.badgeBg}`}>
              {predicted_class}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-black tracking-tight text-white">
              {success_probability_pct}%
            </span>
            <span className="text-xs font-semibold text-slate-400">
              probability
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${status.barBg}`}
              style={{ width: `${Math.min(100, Math.max(0, success_probability_pct))}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-400 leading-tight">
            {status.desc}
          </p>
        </div>

        {/* Feature Weights / Model Explanations */}
        <div className="sm:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-indigo-200">
            <span className="flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5 text-indigo-400" />
              Trained Model Feature Drivers
            </span>
            <span className="text-[11px] font-normal text-slate-400 lowercase">
              RandomForest weights
            </span>
          </div>

          <div className="grid grid-cols-1 gap-1.5 text-xs">
            {top_drivers && Object.entries(top_drivers).map(([feature, weight]) => (
              <div
                key={feature}
                className="flex items-center justify-between p-2 rounded-xl bg-white/[0.04] border border-white/5 hover:border-indigo-500/20 transition text-slate-200"
              >
                <span className="font-medium text-slate-300">{feature}</span>
                <span className="font-mono font-bold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-md text-[11px]">
                  {weight}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Synergistic Note */}
      <div className="relative z-10 flex items-start gap-2.5 bg-indigo-950/60 p-3 rounded-xl border border-indigo-800/40 text-[11px] text-indigo-200/90 leading-relaxed">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-indigo-100">Hybrid Decision Synergy:</span> The Machine Learning model evaluates multi-season historical emergence likelihood, while the ICAR Agronomic Rule Engine acts as an uncompromising deterministic safety net against lethal dry-spells.
        </div>
      </div>
    </div>
  );
}
