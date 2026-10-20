import React from "react";
import { ArrowLeft, FileText, AlertTriangle, Scale, Sprout } from "lucide-react";

export default function TermsScreen({ onBack, language = "en" }) {
  return (
    <div className="w-full max-w-xl mx-auto pb-24 font-sans text-slate-800 antialiased">
      {/* Header */}
      <div className="bg-[#0B4628] text-white pt-6 pb-8 px-6 rounded-b-[2rem] shadow-xl relative">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white">Terms of Service</h1>
            <p className="text-[11px] text-emerald-200/90 font-medium">
              Agricultural Advisory & Platform Agreement
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Advisory Nature Disclaimer Card */}
        <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200/80 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <h3 className="font-black text-amber-950">Agricultural Advisory Disclaimer</h3>
            <p className="text-amber-800/90 font-medium leading-relaxed">
              This system provides mathematical and agro-climatic decision support based on ICAR guidelines and satellite forecasts. Sowing, fertilizer, and harvest decisions should also consider on-the-ground field inspections.
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-4 text-xs font-medium text-slate-600 leading-relaxed">
          <section className="space-y-1.5">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Sprout className="w-4 h-4 text-emerald-600" />
              <span>1. Purpose of the System</span>
            </h3>
            <p>
              The Farm Decision Support System is an autonomous agricultural decision platform designed to help Indian rainfed and irrigated farmers reduce financial risk when sowing Kharif and Rabi crops.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-600" />
              <span>2. Limitation of Liability</span>
            </h3>
            <p>
              While weather models are fetched directly from global high-resolution numerical satellite models (Open-Meteo), unpredicted extreme weather events (e.g. sudden localized cloudbursts or tropical cyclones) may diverge from forecast models. The platform developers and affiliates cannot be held liable for crop yield variations resulting from unforecasted natural phenomena.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>3. User Responsibilities</span>
            </h3>
            <p>
              Farmers are responsible for verifying seed germination percentage (typically &gt;85% test standard) and conducting on-field soil ball checks before mechanical sowing.
            </p>
          </section>

          <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-400">
            Effective Date: October 2026 • Farm Decision Support System
          </div>
        </div>
      </div>
    </div>
  );
}
