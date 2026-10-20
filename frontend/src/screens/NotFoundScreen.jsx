import React from "react";
import { Compass, Home, ArrowLeft, Sprout } from "lucide-react";

export default function NotFoundScreen({ onGoHome, language = "en" }) {
  const content = {
    en: {
      tag: "404 • Missing Field",
      title: "This Farm Plot Doesn't Exist",
      desc: "The farm advisory route or link you followed could not be found. Don't worry, your field data and crop calendars are completely safe.",
      homeBtn: "Return to Farm Home",
      backBtn: "Go Back"
    },
    mr: {
      tag: "४०४ • पान सापडले नाही",
      title: "हे शेत किंवा पान उपलब्ध नाही",
      desc: "तुम्ही उघडलेला मार्ग किंवा लिंक उपलब्ध नाही. काळजी करू नका, तुमचा शेताचा डेटा व पिकांचे कॅलेंडर सुरक्षित आहे.",
      homeBtn: "मुख्य पृष्ठावर परत जा",
      backBtn: "मागे जा"
    },
    hi: {
      tag: "४०४ • पृष्ठ नहीं मिला",
      title: "यह खेत या पृष्ठ उपलब्ध नहीं है",
      desc: "आपके द्वारा खोला गया लिंक या मार्ग नहीं मिला। चिंता न करें, आपका खेत डेटा और फसल कैलेंडर पूरी तरह सुरक्षित है।",
      homeBtn: "मुख्य पृष्ठ पर जाएं",
      backBtn: "वापस जाएं"
    }
  };

  const t = content[language] || content.en;

  return (
    <div className="w-full max-w-xl mx-auto min-h-[80vh] flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="w-24 h-24 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-inner mb-6 relative">
        <Compass className="w-12 h-12 stroke-[1.8] animate-spin" style={{ animationDuration: '12s' }} />
        <div className="absolute -bottom-1 -right-1 p-1.5 bg-emerald-700 text-white rounded-xl shadow-xs">
          <Sprout className="w-4 h-4" />
        </div>
      </div>

      <span className="text-[11px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 mb-2">
        {t.tag}
      </span>

      <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1 mb-2">
        {t.title}
      </h2>

      <p className="text-xs text-slate-500 font-medium max-w-sm leading-relaxed mb-8">
        {t.desc}
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs">
        <button
          type="button"
          onClick={onGoHome}
          className="w-full py-3 px-5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black shadow-lg shadow-emerald-700/20 flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>{t.homeBtn}</span>
        </button>

        <button
          type="button"
          onClick={() => window.history.back()}
          className="w-full py-3 px-4 rounded-2xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t.backBtn}</span>
        </button>
      </div>
    </div>
  );
}
