import React from "react";
import { Globe, Check } from "lucide-react";

export const LANGUAGES = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "mr", name: "Marathi", nativeName: "मराठी" },
  { code: "hi", name: "Hindi", nativeName: "हिंदी" },
];

export default function LanguageSelector({
  language,
  setLanguage,
  variant = "pill",
  isOpen = false,
  onClose,
}) {
  if (variant === "pill") {
    return (
      <div className="flex items-center bg-emerald-950/70 backdrop-blur-md p-1 rounded-full border border-emerald-400/30 shadow-inner">
        <Globe className="w-3.5 h-3.5 text-emerald-300 ml-2 mr-1.5 shrink-0" />
        <div className="flex items-center gap-1">
          {LANGUAGES.map((lang) => {
            const isActive = language === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => setLanguage(lang.code)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-black transition-all cursor-pointer ${
                  isActive
                    ? "bg-white text-emerald-950 shadow-md scale-102"
                    : "text-emerald-100 hover:text-white hover:bg-emerald-800/60"
                }`}
                title={`Switch to ${lang.name}`}
              >
                {lang.nativeName}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (variant === "modal" && isOpen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
        <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-800">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Select Language</h3>
                <p className="text-[11px] font-bold text-slate-400">भाषा निवडा / भाषा चुनें</p>
              </div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 font-black text-sm p-1 rounded-full cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          <div className="space-y-2">
            {LANGUAGES.map((lang) => {
              const isActive = language === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setLanguage(lang.code);
                    if (onClose) onClose();
                  }}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all cursor-pointer text-left ${
                    isActive
                      ? "border-emerald-600 bg-emerald-50/70 text-emerald-950 shadow-sm"
                      : "border-slate-100 bg-slate-50/50 hover:bg-slate-100 text-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-black">{lang.nativeName}</span>
                    <span className="text-xs font-bold text-slate-400">({lang.name})</span>
                  </div>
                  {isActive && (
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return null;
}
