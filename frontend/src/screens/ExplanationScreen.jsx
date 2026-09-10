import React, { useState } from "react";
import { 
  ArrowLeft, ArrowRight, Info, ChevronDown, ChevronUp, 
  Droplets, ShieldAlert, Sparkles, CheckCircle2, XCircle, AlertCircle 
} from "lucide-react";
import { translations } from "../locales/translations";

export default function ExplanationScreen({ 
  decision, 
  farmerInput, 
  flowMode = "sowing",
  onBack, 
  onGoToCompare, 
  language 
}) {
  const t = translations[language] || translations.en;
  const [showTechnical, setShowTechnical] = useState(false);

  if (!decision) return null;
  const { verdict, explanation, score_breakdown, summary, crop_info } = decision;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-xs font-black text-slate-700 hover:text-slate-900 flex items-center gap-1.5 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-xs transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.btnBackDecision}</span>
        </button>

        <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-white text-slate-700 border border-slate-200 shadow-xs">
          {flowMode === "harvest" ? "🌾 Harvest Assessment" : "🌱 Sowing Assessment"}: <strong className="text-slate-900">{farmerInput.location}</strong> • <strong className="text-orange-600">{farmerInput.crop}</strong>
        </span>
      </div>

      {/* Main Narrative Card */}
      <div className="bg-white rounded-[2.5rem] p-7 sm:p-10 border border-slate-200/90 shadow-xl shadow-slate-200/40 space-y-7">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-800 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>Plain-Language Farmer Advisory</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {t.whyTitle}
          </h2>
          <p className="text-xs sm:text-base text-slate-500 font-normal">
            {t.whySub}
          </p>
        </div>

        {/* Narrative Box */}
        <div className="bg-gradient-to-br from-slate-50 via-white to-orange-50/30 p-6 sm:p-7 rounded-3xl border border-slate-200 leading-relaxed text-slate-800 text-base sm:text-lg font-medium space-y-4">
          <p>
            {explanation}
          </p>
        </div>

        {/* Actionable Practical Guidance Box */}
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3 text-sm text-amber-950">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-amber-900 text-xs uppercase tracking-wider">
              Farmer Action Tip for Next 72 Hours:
            </h4>
            <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed">
              {flowMode === "harvest"
                ? verdict === "HARVEST BEFORE INCOMING RAIN"
                  ? "EMERGENCY: Mobilize combine harvester or manual labor teams immediately today. Move harvested bags or bundles under shelter or cover heaps with tarpaulin before rain begins."
                  : verdict === "HARVEST NOW"
                  ? "Take advantage of current clear skies. Harvest during mid-day when dew is gone, and spread grains thinly for 2-3 days of sun drying to reach safe storage moisture (<12%)."
                  : "Wait for crop to reach physiological maturity (dry pods/yellow-brown foliage) or for current wet weather to clear. Premature cutting causes shrivelled grains and APMC penalties."
                : verdict === "WAIT"
                ? "Do not rush to open seed bags. Monitor topsoil moisture; if rainfall resumes consistently after the break spell, sowing can proceed safely."
                : verdict === "SOW NOW"
                ? "Prepare seeding depth carefully (3-4 cm) to ensure seeds make firm contact with the moist soil layer."
                : "Consult local Krishi Vigyan Kendra or explore lower moisture alternatives like Maize or Groundnut before investing heavy capital."}
            </p>
          </div>
        </div>

        {/* Expandable Technical Details Section */}
        <div className="pt-2 border-t border-slate-200">
          <button
            type="button"
            onClick={() => setShowTechnical(!showTechnical)}
            className="w-full py-3 text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center justify-between transition cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Info className="w-4 h-4 text-sky-600" />
              {showTechnical ? t.techDetailsHide : t.techDetailsToggle}
            </span>
            {showTechnical ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showTechnical && (
            <div className="mt-3 bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-4">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {flowMode === "harvest" ? "Transparent Harvest Scoring Breakdown" : "Transparent Rule Engine Scoring Breakdown"}
              </div>

              {flowMode === "harvest" && score_breakdown.maturity_score ? (
                <div className="space-y-2.5">
                  <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800">Crop Physiological Maturity</span>
                      <span className="text-slate-500 block">
                        {score_breakdown.maturity_score.days_since_sowing} days elapsed vs {score_breakdown.maturity_score.maturity_days} days maturity requirement
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900">
                        {score_breakdown.maturity_score.score} / {score_breakdown.maturity_score.max} pts
                      </span>
                      {score_breakdown.maturity_score.passed ? (
                        <span className="text-emerald-600 font-semibold block">Mature</span>
                      ) : (
                        <span className="text-amber-600 font-semibold block">{score_breakdown.maturity_score.days_remaining} Days Left</span>
                      )}
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800">5-Day Rain Hazard Assessment</span>
                      <span className="text-slate-500 block">
                        {score_breakdown.rainfall_5d_score.val} mm expected vs &gt;{score_breakdown.rainfall_5d_score.threshold} mm crop damage threshold
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900">
                        {score_breakdown.rainfall_5d_score.score} / {score_breakdown.rainfall_5d_score.max} pts
                      </span>
                      {score_breakdown.rainfall_5d_score.passed ? (
                        <span className="text-emerald-600 font-semibold block">Safe</span>
                      ) : (
                        <span className="text-rose-600 font-semibold block">Rain Threat ({score_breakdown.rainfall_5d_score.rainfall_2d}mm in 48h)</span>
                      )}
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800">Post-Harvest Sun Drying Window</span>
                      <span className="text-slate-500 block">
                        {score_breakdown.drying_window_score.dry_days} consecutive dry days vs {score_breakdown.drying_window_score.required} days needed
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900">
                        {score_breakdown.drying_window_score.score} / {score_breakdown.drying_window_score.max} pts
                      </span>
                      {score_breakdown.drying_window_score.passed ? (
                        <span className="text-emerald-600 font-semibold block">Optimal Sun</span>
                      ) : (
                        <span className="text-amber-600 font-semibold block">Damp Outlook</span>
                      )}
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800">Covered Storage & Quality Buffer</span>
                      <span className="text-slate-500 block">
                        On-farm covered storage or tarpaulin shelter available
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900">
                        {score_breakdown.storage_bonus.score} / {score_breakdown.storage_bonus.max} pts
                      </span>
                      <span className={score_breakdown.storage_bonus.passed ? "text-emerald-600 font-semibold block" : "text-slate-400 font-semibold block"}>
                        {score_breakdown.storage_bonus.passed ? "Shielded" : "Open Yard"}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {/* Rule 1 */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800">{t.ruleRainfallScore}</span>
                      <span className="text-slate-500 block">
                        {summary.rainfall_next_7_days_mm} mm forecast vs {summary.crop_min_rainfall_mm} mm ICAR min requirement
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900">
                        {score_breakdown.rainfall_score.score} / {score_breakdown.rainfall_score.max} pts
                      </span>
                      {score_breakdown.rainfall_score.passed ? (
                        <span className="text-emerald-600 font-semibold block">Passed</span>
                      ) : (
                        <span className="text-rose-600 font-semibold block">Deficit</span>
                      )}
                    </div>
                  </div>

                  {/* Rule 2 */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800">{t.ruleDryGapScore}</span>
                      <span className="text-slate-500 block">
                        3+ consecutive days dry gap check during {crop_info.germination_days}-day germination
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900">
                        {score_breakdown.dry_gap_score.score} / {score_breakdown.dry_gap_score.max} pts
                      </span>
                      {score_breakdown.dry_gap_score.passed ? (
                        <span className="text-emerald-600 font-semibold block">Safe</span>
                      ) : (
                        <span className="text-amber-600 font-semibold block">Dry Gap Detected</span>
                      )}
                    </div>
                  </div>

                  {/* Rule 3 */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800">{t.ruleWindowScore}</span>
                      <span className="text-slate-500 block">
                        ICAR agro-climatic window for {farmerInput.crop} ({crop_info.ideal_sowing_window_start} to {crop_info.ideal_sowing_window_end})
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900">
                        {score_breakdown.window_score.score} / {score_breakdown.window_score.max} pts
                      </span>
                      {score_breakdown.window_score.passed ? (
                        <span className="text-emerald-600 font-semibold block">In Window</span>
                      ) : (
                        <span className="text-amber-600 font-semibold block">Out of Season</span>
                      )}
                    </div>
                  </div>

                  {/* Rule 4 */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800">{t.ruleSoilScore}</span>
                      <span className="text-slate-500 block">
                        Selected {farmerInput.soil_type} soil vs suitable soils ({crop_info.suitable_soils ? crop_info.suitable_soils.join(", ") : "All"})
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900">
                        {score_breakdown.soil_score.score} / {score_breakdown.soil_score.max} pts
                      </span>
                      {score_breakdown.soil_score.passed ? (
                        <span className="text-emerald-600 font-semibold block">Suitable</span>
                      ) : (
                        <span className="text-amber-600 font-semibold block">Sub-optimal</span>
                      )}
                    </div>
                  </div>

                  {/* Rule 5 */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800">{t.ruleIrrigationBonus}</span>
                      <span className="text-slate-500 block">
                        Irrigation infrastructure available to buffer rain deficit
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900">
                        {score_breakdown.irrigation_score.score} / {score_breakdown.irrigation_score.max} pts
                      </span>
                      <span className="text-slate-600 font-semibold block">
                        {farmerInput.irrigation_available ? "Active" : "None"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* ML Hybrid Model Transparency Section */}
              {decision.ml_prediction && (
                <div className="pt-4 border-t border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      Machine Learning Risk Model
                    </span>
                    <span className="text-[11px] font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      {decision.ml_prediction.model_name}
                    </span>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-indigo-100 text-xs text-slate-700 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-800">Historical Emergence Probability:</span>
                      <span className="font-bold text-indigo-600 text-sm">{decision.ml_prediction.success_probability_pct}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Cross-Validation Accuracy:</span>
                      <span className="font-semibold text-slate-900">{decision.ml_prediction.model_accuracy_pct}% (ROC-AUC: {decision.ml_prediction.model_roc_auc})</span>
                    </div>
                    <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                      The ML model computes statistical emergence survival odds from 3,000 historical seasons, while ICAR agronomy rules enforce dry-spell protection.
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation to Compare Options */}
        <div className="pt-2">
          <button
            onClick={onGoToCompare}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black py-4 px-8 rounded-full shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-3 cursor-pointer text-base sm:text-lg active:scale-98"
          >
            <span>{t.btnGoCompare}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
