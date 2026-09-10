import React, { useState } from "react";
import { 
  ArrowLeft, Bell, Star, Plus, Minus, Check, MapPin, 
  Calendar, Droplets, Layers, Tractor, Sparkles, AlertCircle,
  HelpCircle, Info, ShieldCheck
} from "lucide-react";
import { translations } from "../locales/translations";

export default function FarmDetailsScreen({ 
  formData, 
  setFormData, 
  onSubmit, 
  isLoading, 
  language = "en",
  onBack 
}) {
  const t = translations[language] || translations.en;
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [validationError, setValidationError] = useState("");

  // Verified authentic photographs of the actual crops and their growth stages
  const cropImages = {
    Soybean: [
      "/crops/soybean_plant.jpg",
      "/crops/soybean_pod.jpg",
      "/crops/soybean_field.jpg"
    ],
    Cotton: [
      "/crops/cotton_bolls.jpg",
      "/crops/cotton_field.jpg",
      "/crops/cotton_boll.jpg"
    ],
    Maize: [
      "/crops/maize_corn_cobs.jpg",
      "/crops/maize_field.jpg"
    ],
    Wheat: [
      "/crops/wheat_golden.jpg",
      "/crops/wheat_ears.jpg"
    ],
    Groundnut: [
      "/crops/groundnut_harvest.jpg"
    ]
  };

  const currentCropsList = [
    { id: "Soybean", label: "Soybean (सोयाबीन)", price: "₹2,400/acre", rating: "4.9 (192)" },
    { id: "Cotton", label: "Bt Cotton (कापूस)", price: "₹3,100/acre", rating: "4.8 (145)" },
    { id: "Maize", label: "Maize / Corn (मका)", price: "₹1,850/acre", rating: "4.7 (98)" },
    { id: "Wheat", label: "Wheat (गहू)", price: "₹2,100/acre", rating: "4.9 (210)" },
    { id: "Groundnut", label: "Groundnut (भुईमूग)", price: "₹2,800/acre", rating: "4.6 (85)" }
  ];

  const currentCropMeta = currentCropsList.find(c => c.id === formData.crop) || currentCropsList[0];
  const images = cropImages[formData.crop] || cropImages.Soybean;

  const handleAcresChange = (delta) => {
    const next = Math.max(1, (Number(formData.land_size_acres) || 3) + delta);
    setFormData(prev => ({ ...prev, land_size_acres: next }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.location || !formData.crop) {
      setValidationError("Please fill all required field parameters.");
      return;
    }
    setValidationError("");
    onSubmit();
  };

  return (
    <div className="w-full max-w-xl mx-auto pb-24 font-sans text-slate-900 antialiased">
      
      {/* 1. TOP HEADER */}
      <div className="px-6 py-5 flex items-center justify-between sticky top-0 bg-[#F4F6F5]/90 backdrop-blur-md z-20">
        <button 
          type="button"
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white border border-slate-200/80 shadow-xs flex items-center justify-center text-slate-700 hover:bg-slate-50 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <h2 className="text-base font-black tracking-tight text-slate-900">{t.formTitle || "Farm Details"}</h2>

        <div className="w-10 h-10 rounded-full bg-white border border-slate-200/80 shadow-xs flex items-center justify-center text-slate-700 relative">
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-emerald-500 absolute top-2 right-2" />
        </div>
      </div>

      {validationError && (
        <div className="mx-6 mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* 2. PEDESTAL PLANT SHOWCASE */}
      <div className="px-6 space-y-4">
        <div className="relative w-full h-64 sm:h-72 bg-gradient-to-b from-emerald-50/50 via-white to-slate-100/50 rounded-[2.5rem] border border-slate-200/60 flex flex-col items-center justify-center overflow-hidden shadow-sm">
          
          {/* Main Plant on Pedestal with actual crop image */}
          <div className="relative z-10 w-full h-full p-4 flex items-center justify-center">
            <img
              src={images[selectedImageIdx] || images[0]}
              alt={formData.crop}
              className="max-h-56 max-w-full object-contain rounded-2xl drop-shadow-xl transition duration-500 transform hover:scale-105"
            />
          </div>

          <div className="w-52 h-6 bg-slate-300/40 rounded-full blur-sm -mt-3" />
        </div>

        {/* Thumbnail Selector Carousel */}
        <div className="flex items-center justify-center gap-3 pt-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedImageIdx(idx)}
              className={`w-14 h-14 rounded-2xl overflow-hidden border-2 transition-all p-0.5 cursor-pointer bg-white ${
                selectedImageIdx === idx 
                  ? "border-[#0B4628] scale-110 shadow-md" 
                  : "border-slate-200 opacity-70 hover:opacity-100"
              }`}
            >
              <img src={img} alt="crop stage thumbnail" className="w-full h-full object-cover rounded-xl" />
            </button>
          ))}
        </div>
      </div>

      {/* 3. CROP SPECIFICATION CARD & ACRES COUNTER */}
      <div className="px-6 mt-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {currentCropMeta.label}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold text-emerald-700">ICAR Certified Protocol</span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {currentCropMeta.rating}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-black text-slate-900 block">{currentCropMeta.price}</span>
            <div className="flex items-center gap-2 mt-1 bg-white border border-slate-200 rounded-full px-2 py-1 shadow-xs">
              <button
                type="button"
                onClick={() => handleAcresChange(-1)}
                className="w-5 h-5 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 text-xs font-bold transition"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-xs font-black text-slate-900 px-1">
                {formData.land_size_acres || 3} ac
              </span>
              <button
                type="button"
                onClick={() => handleAcresChange(1)}
                className="w-5 h-5 rounded-full bg-[#0B4628] hover:bg-[#0F5E37] text-white flex items-center justify-center text-xs font-bold transition"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* 4. DESCRIPTION */}
        <div className="space-y-2">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Crop Description & Water Needs</h4>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            {formData.crop} requires optimal cumulative rainfall of at least 50-75mm for successful seed germination. Our ICAR agro-climatic rules and Random Forest machine learning models continuously cross-verify soil saturation and 10-day rainfall dry spells.
          </p>
        </div>

        {/* 5. CROP SELECTOR CHIPS */}
        <div className="space-y-2">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Select Target Crop</h4>
          <div className="flex flex-wrap gap-2">
            {currentCropsList.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setFormData(prev => ({ ...prev, crop: c.id }));
                  setSelectedImageIdx(0);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                  formData.crop === c.id
                    ? "bg-[#0B4628] text-white border-[#0B4628] shadow-sm"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                }`}
              >
                {c.id}
              </button>
            ))}
          </div>
        </div>

        {/* 6. LOCATION & SOIL PARAMETERS */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-600" />
              Target Location
            </span>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="e.g. Pune, Akola"
              className="w-full text-xs font-bold text-slate-900 bg-transparent focus:outline-none"
            />
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block flex items-center gap-1">
              <Layers className="w-3 h-3 text-emerald-600" />
              Soil Type
            </span>
            <select
              value={formData.soil_type}
              onChange={(e) => setFormData(prev => ({ ...prev, soil_type: e.target.value }))}
              className="w-full text-xs font-bold text-slate-900 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="light">{t.soilLight || "Light Sandy Loam"}</option>
              <option value="medium">{t.soilMedium || "Medium Black Soil"}</option>
              <option value="heavy">{t.soilHeavy || "Deep Heavy Clay (Regur)"}</option>
            </select>
          </div>
        </div>

        {/* 7. IRRIGATION & FIELD PREP TOGGLES */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, irrigation_available: !prev.irrigation_available }))}
            className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-between transition cursor-pointer ${
              formData.irrigation_available
                ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                : "bg-white border-slate-200 text-slate-700"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-blue-500" />
              Irrigation
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-slate-200 font-black">
              {formData.irrigation_available ? "YES" : "NO"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, field_prepared: !prev.field_prepared }))}
            className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-between transition cursor-pointer ${
              formData.field_prepared
                ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                : "bg-white border-slate-200 text-slate-700"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Tractor className="w-3.5 h-3.5 text-amber-500" />
              Plowed
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-slate-200 font-black">
              {formData.field_prepared ? "READY" : "WAIT"}
            </span>
          </button>
        </div>

        {/* 8. PRIMARY CTA PILL BUTTON */}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full py-4 rounded-full bg-[#0B4628] hover:bg-[#0F5E37] text-white font-black text-sm shadow-lg shadow-[#0B4628]/25 transition flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
        >
          {isLoading ? (
            <span>{t.btnChecking || "Evaluating Agro-Climatic Model..."}</span>
          ) : (
            <>
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>{t.btnSubmit || "Run Sowing Assessment"}</span>
            </>
          )}
        </button>

      </div>

    </div>
  );
}
