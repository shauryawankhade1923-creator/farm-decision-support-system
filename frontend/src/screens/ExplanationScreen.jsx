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

  const getLocalizedCropName = (cropName) => {
    if (!cropName) return "";
    const lower = cropName.toLowerCase();
    if (lower.includes("soybean")) return t.cropSoybean || "सोयाबीन";
    if (lower.includes("cotton")) return t.cropCotton || "कापूस";
    if (lower.includes("maize") || lower.includes("corn")) return t.cropMaize || "मका";
    if (lower.includes("wheat")) return t.cropWheat || "गहू";
    if (lower.includes("groundnut")) return t.cropGroundnut || "भुईमूग";
    return cropName;
  };

  const getLocalizedRegion = (loc) => {
    if (!loc) return "";
    const lower = loc.toLowerCase();
    if (lower.includes("nagpur")) return t.regionNagpur || "नागपूर";
    if (lower.includes("amravati")) return t.regionAmravati || "अमरावती";
    if (lower.includes("yavatmal")) return t.regionYavatmal || "यवतमाळ";
    if (lower.includes("akola")) return t.regionAkola || "अकोला";
    if (lower.includes("aurangabad") || lower.includes("chhatrapati")) return t.regionSambhajinagar || "छत्रपती संभाजीनगर";
    if (lower.includes("nanded")) return t.regionNanded || "नांदेड";
    if (lower.includes("latur")) return t.regionLatur || "लातूर";
    if (lower.includes("jalna")) return t.regionJalna || "जालना";
    if (lower.includes("pune")) return t.regionPune || "पुणे";
    if (lower.includes("nashik")) return t.regionNashik || "नाशिक";
    if (lower.includes("solapur")) return t.regionSolapur || "सोलापूर";
    if (lower.includes("kolhapur")) return t.regionKolhapur || "कोल्हापूर";
    return loc;
  };

  const getActionTip = () => {
    const isMr = language === "mr";
    const isHi = language === "hi";

    if (flowMode === "harvest") {
      if (verdict === "HARVEST BEFORE INCOMING RAIN") {
        if (isMr) return "तातडीचा सल्ला: आजच हार्वेस्टर किंवा शेतमजुरांची व्यवस्था करून तातडीने कापणी सुरू करा. पाऊस सुरू होण्यापूर्वी कापलेले पीक सुरक्षित छताखाली किंवा ताडपत्रीने झाकून ठेवा.";
        if (isHi) return "आपातकालीन सलाह: आज ही हार्वेस्टर या मजदूरों की व्यवस्था कर तुरंत कटाई शुरू करें। बारिश शुरू होने से पहले कटी फसल को सुरक्षित शेड या तिरपाल से ढक दें।";
        return "EMERGENCY: Mobilize combine harvester or manual labor teams immediately today. Move harvested bags or bundles under shelter or cover heaps with tarpaulin before rain begins.";
      }
      if (verdict === "HARVEST NOW") {
        if (isMr) return "सध्याच्या कोरड्या हवामानाचा पूर्ण फायदा घ्या. दुपारच्या वेळेत दव सुकल्यावर कापणी करा आणि धान्य सुरक्षित ओलाव्यासाठी (<१२%) २-३ दिवस उन्हात वाळवा.";
        if (isHi) return "वर्तमान साफ मौसम का लाभ उठाएं। दोपहर में ओस सूखने पर कटाई करें और अनाज को सुरक्षित भंडारण नमी (<12%) के लिए 2-3 दिन धूप में सुखाएं।";
        return "Take advantage of current clear skies. Harvest during mid-day when dew is gone, and spread grains thinly for 2-3 days of sun drying to reach safe storage moisture (<12%).";
      }
      if (isMr) return "पीक पूर्ण पक्व होईपर्यंत किंवा चालू ओलसर हवामान निवळेपर्यंत थांबा. अपक्व कापणीमुळे दाणे बारीक राहतात आणि बाजारभावात नुकसान होते.";
      if (isHi) return "फसल के पूरी तरह पकने या वर्तमान गीले मौसम के साफ होने तक प्रतीक्षा करें। कच्ची कटाई से दाना सिकुड़ जाता है और मंडी में भाव कम मिलता है।";
      return "Wait for crop to reach physiological maturity (dry pods/yellow-brown foliage) or for current wet weather to clear. Premature cutting causes shrivelled grains and APMC penalties.";
    }

    if (verdict === "WAIT") {
      if (isMr) return "बियाण्यांची पाकिटे फोडण्याची घाई करू नका. जमिनीतील ओलावा तपासा; पावसाचा खंड संपून सातत्यपूर्ण पाऊस सुरू झाल्यावरच पेरणी करावी.";
      if (isHi) return "बीज के पैकेट खोलने की जल्दबाजी न करें। जमीन की नमी पर नजर रखें; बारिश का सूखा दौर खत्म होकर लगातार बारिश होने पर ही बुवाई करें।";
      return "Do not rush to open seed bags. Monitor topsoil moisture; if rainfall resumes consistently after the break spell, sowing can proceed safely.";
    }
    if (verdict === "SOW NOW") {
      if (isMr) return "बियाणे योग्य खोलीवर (३-४ सें.मी.) पेरा, जेणेकरून बियाण्याचा थेट जमिनीतील पुरेशा ओलाव्याशी संपर्क येईल आणि उगवण जलद होईल.";
      if (isHi) return "बीज को सही गहराई (3-4 सेमी) पर बोएं, ताकि बीज नम मिट्टी के संपर्क में आए और अंकुरण एकसमान व त्वरित हो सके।";
      return "Prepare seeding depth carefully (3-4 cm) to ensure seeds make firm contact with the moist soil layer.";
    }
    if (isMr) return "मोठा खर्च करण्यापूर्वी स्थानिक कृषी विज्ञान केंद्र (KVK) चा सल्ला घ्या किंवा कमी पाण्यावर येणाऱ्या मका, भुईमूग यांसारख्या पिकांचा विचार करा.";
    if (isHi) return "बड़ा खर्च करने से पहले स्थानीय कृषि विज्ञान केंद्र से सलाह लें या कम पानी वाली मक्का, मूंगफली जैसी फसलों पर विचार करें।";
    return "Consult local Krishi Vigyan Kendra or explore lower moisture alternatives like Maize or Groundnut before investing heavy capital.";
  };

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
          {flowMode === "harvest" 
            ? (language === "mr" ? "🌾 कापणी तपासणी" : language === "hi" ? "🌾 कटाई मूल्यांकन" : "🌾 Harvest Assessment") 
            : (language === "mr" ? "🌱 पेरणी तपासणी" : language === "hi" ? "🌱 बुवाई मूल्यांकन" : "🌱 Sowing Assessment")}: <strong className="text-slate-900">{getLocalizedRegion(farmerInput.location)}</strong> • <strong className="text-orange-600">{getLocalizedCropName(farmerInput.crop)}</strong>
        </span>
      </div>

      {/* Main Narrative Card */}
      <div className="bg-white rounded-[2.5rem] p-7 sm:p-10 border border-slate-200/90 shadow-xl shadow-slate-200/40 space-y-7">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-800 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>{language === "mr" ? "सोप्या भाषेतील शेतकरी सल्ला" : language === "hi" ? "सरल भाषा में किसान परामर्श" : "Plain-Language Farmer Advisory"}</span>
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
              {language === "mr" ? "पुढील ७२ तासांसाठी शेतकऱ्यांसाठी कृती सल्ला:" : language === "hi" ? "अगले 72 घंटों के लिए किसान कार्य सलाह:" : "Farmer Action Tip for Next 72 Hours:"}
            </h4>
            <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed">
              {getActionTip()}
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
                {flowMode === "harvest" 
                  ? (language === "mr" ? "कापणी स्कोअरिंग विश्लेषण" : language === "hi" ? "कटाई स्कोरिंग विश्लेषण" : "Transparent Harvest Scoring Breakdown") 
                  : (language === "mr" ? "नियम इंजिन स्कोअरिंग विश्लेषण" : language === "hi" ? "नियम इंजन स्कोरिंग विश्लेषण" : "Transparent Rule Engine Scoring Breakdown")}
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
                      <span className="font-bold text-slate-800">
                        {language === "mr" ? "कापणीनंतर धान्य वाळवण्याचा कालावधी" : language === "hi" ? "कटाई उपरांत धूप सुखाने की अवधि" : "Post-Harvest Sun Drying Window"}
                      </span>
                      <span className="text-slate-500 block">
                        {score_breakdown.drying_window_score.dry_days} {language === "mr" ? "सलग कोरडे दिवस वि." : language === "hi" ? "लगातार सूखे दिन बनाम" : "consecutive dry days vs"} {score_breakdown.drying_window_score.required} {language === "mr" ? "दिवस आवश्यक" : language === "hi" ? "दिन आवश्यक" : "days needed"}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900">
                        {score_breakdown.drying_window_score.score} / {score_breakdown.drying_window_score.max} pts
                      </span>
                      {score_breakdown.drying_window_score.passed ? (
                        <span className="text-emerald-600 font-semibold block">{language === "mr" ? "उत्तम ऊन" : language === "hi" ? "उत्तम धूप" : "Optimal Sun"}</span>
                      ) : (
                        <span className="text-amber-600 font-semibold block">{language === "mr" ? "ओलसर हवामान" : language === "hi" ? "नम मौसम" : "Damp Outlook"}</span>
                      )}
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800">
                        {language === "mr" ? "सुरक्षित शेड किंवा ताडपत्री साठवणूक" : language === "hi" ? "सुरक्षित शेड अथवा तिरपाल भंडारण" : "Covered Storage & Quality Buffer"}
                      </span>
                      <span className="text-slate-500 block">
                        {language === "mr" ? "शेतावर सुरक्षित साठवण किंवा ताडपत्री उपलब्ध" : language === "hi" ? "खेत पर ढका हुआ भंडारण या तिरपाल उपलब्ध" : "On-farm covered storage or tarpaulin shelter available"}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900">
                        {score_breakdown.storage_bonus.score} / {score_breakdown.storage_bonus.max} pts
                      </span>
                      <span className={score_breakdown.storage_bonus.passed ? "text-emerald-600 font-semibold block" : "text-slate-400 font-semibold block"}>
                        {score_breakdown.storage_bonus.passed 
                          ? (language === "mr" ? "सुरक्षित साठवण" : language === "hi" ? "सुरक्षित भंडारण" : "Shielded") 
                          : (language === "mr" ? "उघडे अंगण" : language === "hi" ? "खुला मैदान" : "Open Yard")}
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
                        {summary.rainfall_next_7_days_mm} mm {language === "mr" ? "अंदाज वि." : language === "hi" ? "अनुमान बनाम" : "forecast vs"} {summary.crop_min_rainfall_mm} mm {language === "mr" ? "किमान ICAR गरज" : language === "hi" ? "न्यूनतम ICAR आवश्यकता" : "ICAR min requirement"}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900">
                        {score_breakdown.rainfall_score.score} / {score_breakdown.rainfall_score.max} pts
                      </span>
                      {score_breakdown.rainfall_score.passed ? (
                        <span className="text-emerald-600 font-semibold block">{language === "mr" ? "निकाल अनुकूल" : language === "hi" ? "अनुकूल" : "Passed"}</span>
                      ) : (
                        <span className="text-rose-600 font-semibold block">{language === "mr" ? "पाऊस तुटवडा" : language === "hi" ? "बारिश कमी" : "Deficit"}</span>
                      )}
                    </div>
                  </div>

                  {/* Rule 2 */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800">{t.ruleDryGapScore}</span>
                      <span className="text-slate-500 block">
                        {language === "mr" ? `३+ सलग कोरड्या दिवसांची तपासणी (${crop_info.germination_days} दिवस उगवण)` : language === "hi" ? `3+ लगातार सूखे दिनों की जांच (${crop_info.germination_days} दिन अंकुरण)` : `3+ consecutive days dry gap check during ${crop_info.germination_days}-day germination`}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900">
                        {score_breakdown.dry_gap_score.score} / {score_breakdown.dry_gap_score.max} pts
                      </span>
                      {score_breakdown.dry_gap_score.passed ? (
                        <span className="text-emerald-600 font-semibold block">{language === "mr" ? "सुरक्षित" : language === "hi" ? "सुरक्षित" : "Safe"}</span>
                      ) : (
                        <span className="text-amber-600 font-semibold block">{language === "mr" ? "पावसात खंड आढळला" : language === "hi" ? "बारिश में सूखा दौर" : "Dry Gap Detected"}</span>
                      )}
                    </div>
                  </div>

                  {/* Rule 3 */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800">{t.ruleWindowScore}</span>
                      <span className="text-slate-500 block">
                        {getLocalizedCropName(farmerInput.crop)} ({crop_info.ideal_sowing_window_start} - {crop_info.ideal_sowing_window_end})
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900">
                        {score_breakdown.window_score.score} / {score_breakdown.window_score.max} pts
                      </span>
                      {score_breakdown.window_score.passed ? (
                        <span className="text-emerald-600 font-semibold block">{language === "mr" ? "हंगामात" : language === "hi" ? "सीजन में" : "In Window"}</span>
                      ) : (
                        <span className="text-amber-600 font-semibold block">{language === "mr" ? "हंगामाबाहेर" : language === "hi" ? "सीजन बाहर" : "Out of Season"}</span>
                      )}
                    </div>
                  </div>

                  {/* Rule 4 */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800">{t.ruleSoilScore}</span>
                      <span className="text-slate-500 block">
                        {language === "mr" ? "निवडलेली जमीन वि. अनुकूल जमिनी" : language === "hi" ? "चयनित मिट्टी बनाम उपयुक्त मिट्टी" : "Selected soil vs suitable soils"}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900">
                        {score_breakdown.soil_score.score} / {score_breakdown.soil_score.max} pts
                      </span>
                      {score_breakdown.soil_score.passed ? (
                        <span className="text-emerald-600 font-semibold block">{language === "mr" ? "योग्य जमीन" : language === "hi" ? "उपयुक्त" : "Suitable"}</span>
                      ) : (
                        <span className="text-amber-600 font-semibold block">{language === "mr" ? "कमी अनुकूल" : language === "hi" ? "कम अनुकूल" : "Sub-optimal"}</span>
                      )}
                    </div>
                  </div>

                  {/* Rule 5 */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800">{t.ruleIrrigationBonus}</span>
                      <span className="text-slate-500 block">
                        {language === "mr" ? "पावसाचा तुटवडा भरून काढण्यासाठी सिंचन सुविधा" : language === "hi" ? "बारिश की कमी की भरपाई के लिए सिंचाई सुविधा" : "Irrigation infrastructure available to buffer rain deficit"}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900">
                        {score_breakdown.irrigation_score.score} / {score_breakdown.irrigation_score.max} pts
                      </span>
                      <span className="text-slate-600 font-semibold block">
                        {farmerInput.irrigation_available 
                          ? (language === "mr" ? "उपलब्ध" : language === "hi" ? "उपलब्ध" : "Active") 
                          : (language === "mr" ? "नाही" : language === "hi" ? "नहीं" : "None")}
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
                      {language === "mr" ? "मशीन लर्निंग जोखीम मॉडेल" : language === "hi" ? "मशीन लर्निंग जोखिम मॉडल" : "Machine Learning Risk Model"}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      {decision.ml_prediction.model_name}
                    </span>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-indigo-100 text-xs text-slate-700 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-800">
                        {language === "mr" ? "ऐतिहासिक उगवण संभाव्यता:" : language === "hi" ? "ऐतिहासिक अंकुरण संभावना:" : "Historical Emergence Probability:"}
                      </span>
                      <span className="font-bold text-indigo-600 text-sm">{decision.ml_prediction.success_probability_pct}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">
                        {language === "mr" ? "क्रॉस-व्हॅलिडेशन अचूकता:" : language === "hi" ? "क्रॉस-सत्यापन सटीकता:" : "Cross-Validation Accuracy:"}
                      </span>
                      <span className="font-semibold text-slate-900">{decision.ml_prediction.model_accuracy_pct}% (ROC-AUC: {decision.ml_prediction.model_roc_auc})</span>
                    </div>
                    <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                      {language === "mr" 
                        ? "हे ML मॉडेल ३,००० ऐतिहासिक कृषी हंगामांच्या आधारावर संभाव्यता काढते, तर ICAR कृषी नियम पिकाचे पावसाच्या खंडापासून संरक्षण करतात." 
                        : language === "hi" 
                        ? "यह ML मॉडल 3,000 ऐतिहासिक कृषि मौसमों के आधार पर अंकुरण संभावना निकालता है, जबकि ICAR कृषि नियम फसल को सूखे से बचाते हैं।" 
                        : "The ML model computes statistical emergence survival odds from 3,000 historical seasons, while ICAR agronomy rules enforce dry-spell protection."}
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
