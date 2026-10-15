import React from "react";
import { 
  X, 
  Globe2, 
  Thermometer, 
  CloudRain, 
  Sun, 
  Wind, 
  ShieldCheck, 
  Droplets, 
  Leaf, 
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Layers
} from "lucide-react";

export default function ClimateResilienceModal({
  isOpen,
  onClose,
  districtName = "Pune",
  liveTemp = "28°C",
  liveHumidity = "62%",
  liveRain = "0.0mm",
  liveWind = "12 km/h",
  language = "en",
  onAssessSowing
}) {
  if (!isOpen) return null;

  const content = {
    en: {
      badge: "ICAR Climate-Smart Agriculture Framework",
      title: "Climate Change & Microclimate Resilience",
      sub: `District Agro-Climatic Shift, Volatility Index & Adaptation for ${districtName}`,
      liveHeader: "Live Telemetry vs 30-Year Climate Norms",
      liveTag: "Live Satellite Sync",
      tempLabel: "Current Temperature",
      tempBaseline: "+1.3°C warming above 30-yr decadal mean",
      monsoonLabel: "Monsoon Shift Index",
      monsoonValue: "10 - 14 Days Delay",
      monsoonDesc: "Monsoon arrival is trending later with erratic distribution",
      drySpellLabel: "Dry Gap Vulnerability",
      drySpellValue: "Moderate to High",
      drySpellDesc: "Tendency for sudden 50mm+ bursts followed by 12+ day dry spells",
      strategiesHeader: "ICAR & CRIDA Recommended Adaptation Practices",
      strat1Title: "Broad Bed Furrow (BBF) Technology",
      strat1Desc: "Creates 100cm raised beds and 30cm furrows. Safely drains excess flash rain to prevent waterlogging, while recharging in-situ root zone moisture during 2-week dry gaps.",
      strat2Title: "Climate-Resilient Seed Cultivars",
      strat2Desc: "Adopt non-shattering, drought-hardy seeds such as Soybean (KDS 726, MACS 1407), Tur/Arhar (BSMR 736), and drought-resilient Rabi Jowar (Maldandi).",
      strat3Title: "Foliar Stress-Relief Spray",
      strat3Desc: "During prolonged mid-season dry spells (10+ days without rain), spray 1% Potassium Nitrate (KNO3) or 2% Urea in morning/evening to prevent flower and pod drop.",
      strat4Title: "Intercropping Risk Cushion",
      strat4Desc: "Practice Soybean + Pigeonpea (4:2 or 3:1) or Cotton + Greengram. If one crop encounters rain failure at flowering, the deep-rooted companion crop guarantees farm income.",
      actionBtn: "Check Sowing Window ->",
      closeBtn: "Close"
    },
    mr: {
      badge: "ICAR हवामान-अनुकूल कृषी आराखडा",
      title: "हवामान बदल व शेती अनुकूलन",
      sub: `${districtName} जिल्ह्यासाठी हवामान बदल, पावसातील खंड व उपाययोजना`,
      liveHeader: "थेट उपग्रह निरीक्षण विरुद्ध ३० वर्षांची सरासरी",
      liveTag: "थेट उपग्रह जोडणी",
      tempLabel: "सध्याचे तापमान",
      tempBaseline: "३० वर्षांच्या सरासरीपेक्षा +१.३°से तापमान वाढ",
      monsoonLabel: "पावसाचे आगमन बदल",
      monsoonValue: "१० ते १४ दिवस लांबणीवर",
      monsoonDesc: "मान्सून उशिरा सुरू होणे आणि अनियमित बरसण्याचा कल",
      drySpellLabel: "पावसाचा खंड धोका",
      drySpellValue: "मध्यम ते तीव्र",
      drySpellDesc: "एकाच वेळी मुसळधार पाऊस आणि त्यानंतर १२+ दिवसांचा प्रदीर्घ कोरडा खंड",
      strategiesHeader: "ICAR व कृषी विद्यापीठांनी शिफारस केलेले कृषी तंत्रज्ञान",
      strat1Title: "रुंद वरंबा-सरी (BBF) पद्धत",
      strat1Desc: "१०० सेमी रुंद गादीवाफा आणि ३० सेमी सरी. अतिवृष्टी झाल्यास जादा पाण्याचा सुरक्षित निचरा होतो आणि पावसाचा खंड पडल्यास जमिनीत ओलावा टिकून राहतो.",
      strat2Title: "हवामान-सहनशील बियाणे वाण",
      strat2Desc: "पाण्याचा ताण सहन करणारे वाण वापरा: सोयाबीन (फुले संगम KDS 726, MACS 1407), तूर (BSMR 736) आणि रब्बी ज्वारी (मालदांडी).",
      strat3Title: "पावसाच्या खंडात संजीवकाची फवारणी",
      strat3Desc: "पिकाच्या वाढीच्या अवस्थेत १० दिवसांपेक्षा जास्त खंड पडल्यास सकाळी किंवा संध्याकाळी १% पोटॅशियम नायट्रेट (१३:००:४५) किंवा २% युरियाची फवारणी करा.",
      strat4Title: "आंतरपीक पद्धतीचा सुरक्षा कवच",
      strat4Desc: "सोयाबीन + तूर (४:२ किंवा ३:१) किंवा कापूस + मूग आंतरपीक घ्या. अवकाळी पाऊस किंवा दुष्काळात एका पिकाचे नुकसान झाले तरी दुसरे पीक आधार देते.",
      actionBtn: "पेरणी अनुकूलता तपासा ->",
      closeBtn: "बंद करा"
    },
    hi: {
      badge: "ICAR जलवायु-अनुकूल कृषि फ्रेमवर्क",
      title: "जलवायु परिवर्तन और कृषि अनुकूलन",
      sub: `${districtName} जिले के लिए जलवायु बदलाव, वर्षा की अनिश्चितता और समाधान`,
      liveHeader: "लाइव सैटेलाइट डेटा बनाम ३० वर्षीय औसत",
      liveTag: "लाइव सैटेलाइट डेटा",
      tempLabel: "वर्तमान तापमान",
      tempBaseline: "३० वर्षों के औसत से +१.३°C अधिक तापमान",
      monsoonLabel: "मानसून चक्र में बदलाव",
      monsoonValue: "१० से १४ दिन की देरी",
      monsoonDesc: "मानसून के देर से आने और असमान वितरण की प्रवृत्ति",
      drySpellLabel: "सूखे दौर (Dry Spell) का जोखिम",
      drySpellValue: "मध्यम से उच्च",
      drySpellDesc: "अचानक भारी बारिश और उसके बाद १२+ दिनों का लंबा शुष्क दौर",
      strategiesHeader: "ICAR और कृषि विश्वविद्यालयों द्वारा अनुशंसित तकनीक",
      strat1Title: "चौड़ी क्यारी-कूड़ (BBF) तकनीक",
      strat1Desc: "१०० सेमी चौड़ी क्यारी और ३० सेमी नाली। भारी बारिश में जलभराव रोकता है और शुष्क दौर में पौधों की जड़ों में पर्याप्त नमी संचित रखता है।",
      strat2Title: "जलवायु-सहनशील बीज किस्में",
      strat2Desc: "गर्मी और सूखे को सहन करने वाली किस्में चुनें: सोयाबीन (फुले संगम KDS 726, MACS 1407), अरहर (BSMR 736), और रबी ज्वार (मालदांडी)।",
      strat3Title: "तनाव निवारक पर्णीय छिड़काव",
      strat3Desc: "फूल आने और फलियों के समय यदि १०+ दिन बारिश न हो, तो सुबह या शाम १% पोटेशियम नाइट्रेट (१३:००:४५) या २% यूरिया का छिड़काव करें।",
      strat4Title: "अंतरफसल (Intercropping) सुरक्षा कवच",
      strat4Desc: "सोयाबीन + अरहर (४:२) या कपास + मूंग अंतरफसल लगाएं। मौसम के उतार-चढ़ाव में एक फसल प्रभावित होने पर भी दूसरी फसल आय की गारंटी देती है।",
      actionBtn: "बुवाई अनुकूलता जांचें ->",
      closeBtn: "बंद करें"
    }
  };

  const t = content[language] || content.en;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-xl max-h-[92vh] sm:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-100"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header */}
        <div className="bg-linear-to-br from-[#0B4628] via-[#0E5C34] to-[#147A46] text-white p-5 sm:p-6 relative">
          <div className="flex items-start justify-between">
            <div className="space-y-1 pr-6">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-wider uppercase bg-emerald-400/20 text-emerald-200 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                <Globe2 className="w-3 h-3 text-emerald-300" />
                <span>{t.badge}</span>
              </span>
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-white mt-1">
                {t.title}
              </h2>
              <p className="text-xs text-emerald-100/90 font-medium leading-relaxed">
                {t.sub}
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition shrink-0 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* Live Telemetry vs Decadal Baseline */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t.liveHeader}</span>
              </h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>{t.liveTag}</span>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* Temperature */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-1">
                <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold">
                  <span>{t.tempLabel}</span>
                  <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <div className="text-xl font-black text-slate-900">{liveTemp}</div>
                <p className="text-[10px] text-amber-700 font-medium leading-tight">
                  {t.tempBaseline}
                </p>
              </div>

              {/* Monsoon Shift */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-1">
                <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold">
                  <span>{t.monsoonLabel}</span>
                  <CloudRain className="w-3.5 h-3.5 text-sky-500" />
                </div>
                <div className="text-xl font-black text-sky-900">{t.monsoonValue}</div>
                <p className="text-[10px] text-slate-500 font-medium leading-tight">
                  {t.monsoonDesc}
                </p>
              </div>

              {/* Dry Spell Risk */}
              <div className="col-span-2 sm:col-span-1 bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200 space-y-1">
                <div className="flex items-center justify-between text-amber-800 text-[11px] font-bold">
                  <span>{t.drySpellLabel}</span>
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <div className="text-xl font-black text-amber-900">{t.drySpellValue}</div>
                <p className="text-[10px] text-amber-800/90 font-medium leading-tight">
                  {t.drySpellDesc}
                </p>
              </div>
            </div>

            {/* Microclimate live stats banner */}
            <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-3 flex items-center justify-around text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Humidity</span>
                <span className="font-black text-emerald-900">{liveHumidity}</span>
              </div>
              <div className="h-6 w-px bg-emerald-200" />
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Wind Velocity</span>
                <span className="font-black text-emerald-900">{liveWind}</span>
              </div>
              <div className="h-6 w-px bg-emerald-200" />
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Precipitation</span>
                <span className="font-black text-emerald-900">{liveRain}</span>
              </div>
            </div>
          </div>

          {/* Adaptation Strategies */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.strategiesHeader}</span>
            </h3>

            <div className="space-y-3">
              {/* BBF */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-1.5 hover:border-emerald-300 transition">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <Layers className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-black text-slate-900">{t.strat1Title}</h4>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed pl-9">
                  {t.strat1Desc}
                </p>
              </div>

              {/* Resilient Cultivars */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-1.5 hover:border-emerald-300 transition">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <Leaf className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-black text-slate-900">{t.strat2Title}</h4>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed pl-9">
                  {t.strat2Desc}
                </p>
              </div>

              {/* Foliar Spray */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-1.5 hover:border-emerald-300 transition">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center shrink-0">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-black text-slate-900">{t.strat3Title}</h4>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed pl-9">
                  {t.strat3Desc}
                </p>
              </div>

              {/* Intercropping */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-1.5 hover:border-emerald-300 transition">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-black text-slate-900">{t.strat4Title}</h4>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed pl-9">
                  {t.strat4Desc}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 transition cursor-pointer"
          >
            {t.closeBtn}
          </button>

          {onAssessSowing && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onAssessSowing();
              }}
              className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-700/20 flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <span>{t.actionBtn}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
