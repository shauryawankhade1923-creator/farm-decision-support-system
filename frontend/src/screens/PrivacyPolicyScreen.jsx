import React from "react";
import { ArrowLeft, ShieldCheck, Lock, Eye, Database, Globe } from "lucide-react";

export default function PrivacyPolicyScreen({ onBack, language = "en" }) {
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
            <h1 className="text-lg font-black tracking-tight text-white">Privacy Policy</h1>
            <p className="text-[11px] text-emerald-200/90 font-medium">
              Digital Personal Data Protection (DPDP) & Transparency
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Summary Card */}
        <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-200/80 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <h3 className="font-black text-emerald-950">Farmer-First Data Guarantee</h3>
            <p className="text-emerald-800/90 font-medium leading-relaxed">
              We never sell your farm location, soil data, or crop yields to commercial pesticide or commodity trading corporations.
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-4 text-xs font-medium text-slate-600 leading-relaxed">
          <section className="space-y-1.5">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600" />
              <span>1. Information We Collect</span>
            </h3>
            <p>
              When using the Farm Decision Support System, we collect:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li><strong>Geographic Coordinates (Latitude/Longitude):</strong> Used strictly to fetch localized satellite weather and precipitation forecasts from Open-Meteo.</li>
              <li><strong>Farm Plot Details:</strong> Soil texture (light, medium, heavy), crop variety, sowing dates, and irrigation availability.</li>
              <li><strong>Account Credentials:</strong> Full name, verified email, and phone number for authentication and tenant isolation.</li>
            </ul>
          </section>

          <section className="space-y-1.5">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>2. Row Level Security & Isolation</span>
            </h3>
            <p>
              Your saved fields and consultation assessments are protected with Row Level Security (RLS). Only your authenticated farmer identity can query, update, or export your plots.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-600" />
              <span>3. API Security & Zero Third-Party Tracking</span>
            </h3>
            <p>
              No secret master keys are embedded on the client. Weather queries use secure, open protocols. We do not use third-party behavioral advertising trackers.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-600" />
              <span>4. Your Data Rights & Deletion</span>
            </h3>
            <p>
              You retain 100% ownership of your farming data. At any time, you can:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Export a complete JSON database backup of all your plots.</li>
              <li>Permanently purge your account and delete all associated records using the <strong>Delete Account</strong> feature in your profile.</li>
            </ul>
          </section>

          <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-400">
            Last Updated: October 2026 • Compliant with Indian DPDP Act guidelines
          </div>
        </div>
      </div>
    </div>
  );
}
