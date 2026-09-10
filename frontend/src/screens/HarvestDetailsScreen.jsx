import React, { useState } from "react";
import { 
  ArrowLeft, Bell, Star, Plus, Minus, Check, MapPin, 
  Calendar, ShieldAlert, Wheat, Sparkles, AlertCircle,
  Warehouse, HelpCircle, Info
} from "lucide-react";
import { translations } from "../locales/translations";

export default function HarvestDetailsScreen({ 
  harvestFormData, 
  setHarvestFormData, 
  onSubmit, 
  isLoading, 
  language = "en",
  onBack 
}) {
  const t = translations[language] || translations.en;
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [validationError, setValidationError] = useState("");

  const cropImages = {
    Soybean: [
      "/crops/soybean_pod.jpg",
      "/crops/soybean_field.jpg",
      "/crops/soybean_plant.jpg"
    ],
    Cotton: [
      "/crops/cotton_bolls.jpg",
      "/crops/cotton_boll.jpg",
      "/crops/cotton_field.jpg"
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
    { id: "Soybean", label: "Mature Soybean Pods", maturity: "95-105 Days", rating: "4.9 (170)" },
    { id: "Cotton", label: "Open Cotton Bolls", maturity: "150-165 Days", rating: "4.8 (130)" },
    { id: "Maize", label: "Harvest-Ready Maize", maturity: "90-100 Days", rating: "4.7 (95)" },
    { id: "Wheat", label: "Golden Wheat Heads", maturity: "110-125 Days", rating: "4.9 (240)" },
    { id: "Groundnut", label: "Groundnut Mature Pods", maturity: "105-120 Days", rating: "4.6 (78)" }
  ];

  const currentCropMeta = currentCropsList.find(c => c.id === harvestFormData.crop) || currentCropsList[0];
  const images = cropImages[harvestFormData.crop] || cropImages.Soybean;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!harvestFormData.location || !harvestFormData.crop || !harvestFormData.actual_sowing_date) {
      setValidationError("Please fill in location and actual sowing date.");
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

        <h2 className="text-base font-black tracking-tight text-slate-900">Harvest Details</h2>

        <div className="w-10 h-10 rounded-full bg-white border border-slate-200/80 shadow-xs flex items-center justify-center text-slate-700 relative">
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-amber-500 absolute top-2 right-2" />
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
        <div className="relative w-full h-64 sm:h-72 bg-gradient-to-b from-amber-50/50 via-white to-slate-100/50 rounded-[2.5rem] border border-slate-200/60 flex flex-col items-center justify-center overflow-hidden shadow-sm">
          
          <div className="relative z-10 w-full h-full p-4 flex items-center justify-center">
            <img
              src={images[selectedImageIdx] || images[0]}
              alt={harvestFormData.crop}
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
                  ? "border-amber-600 scale-110 shadow-md" 
                  : "border-slate-200 opacity-70 hover:opacity-100"
              }`}
            >
              <img src={img} alt="harvest stage thumbnail" className="w-full h-full object-cover rounded-xl" />
            </button>
          ))}
        </div>
      </div>

      {/* 3. CROP SPECIFICATION CARD */}
      <div className="px-6 mt-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {currentCropMeta.label}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold text-amber-700">Maturity Window</span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {currentCropMeta.rating}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-black text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full block">
              {currentCropMeta.maturity}
            </span>
          </div>
        </div>

        {/* 4. DESCRIPTION */}
        <div className="space-y-2">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Harvest Protocol</h4>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            Pre-harvest and harvest stages are acutely vulnerable to unseasonal rainfall. Sudden rain on mature pods triggers pod shattering, fungal staining, and grain discolouration. Our Harvest Shield verifies dry harvesting windows.
          </p>
        </div>

        {/* 5. CROP SELECTOR CHIPS */}
        <div className="space-y-2">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Select Standing Crop</h4>
          <div className="flex flex-wrap gap-2">
            {currentCropsList.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setHarvestFormData(prev => ({ ...prev, crop: c.id }));
                  setSelectedImageIdx(0);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                  harvestFormData.crop === c.id
                    ? "bg-[#0B4628] text-white border-[#0B4628] shadow-sm"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                }`}
              >
                {c.id}
              </button>
            ))}
          </div>
        </div>

        {/* 6. LOCATION & ACTUAL SOWING DATE */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block flex items-center gap-1">
              <MapPin className="w-3 h-3 text-amber-600" />
              Target Location
            </span>
            <input
              type="text"
              value={harvestFormData.location}
              onChange={(e) => setHarvestFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="e.g. Pune, Akola"
              className="w-full text-xs font-bold text-slate-900 bg-transparent focus:outline-none"
            />
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block flex items-center gap-1">
              <Calendar className="w-3 h-3 text-amber-600" />
              Actual Sowing Date
            </span>
            <input
              type="date"
              value={harvestFormData.actual_sowing_date}
              onChange={(e) => setHarvestFormData(prev => ({ ...prev, actual_sowing_date: e.target.value }))}
              className="w-full text-xs font-bold text-slate-900 bg-transparent focus:outline-none cursor-pointer"
            />
          </div>
        </div>

        {/* 7. COVERED STORAGE TOGGLE */}
        <button
          type="button"
          onClick={() => setHarvestFormData(prev => ({ ...prev, storage_available: !prev.storage_available }))}
          className={`w-full p-4 rounded-2xl border text-xs font-bold flex items-center justify-between transition cursor-pointer ${
            harvestFormData.storage_available
              ? "bg-amber-50 border-amber-300 text-amber-900"
              : "bg-white border-slate-200 text-slate-700"
          }`}
        >
          <span className="flex items-center gap-2">
            <Warehouse className="w-4 h-4 text-amber-600" />
            <span>Covered Dry Storage / Tarpaulins Available</span>
          </span>
          <span className="text-xs px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-black">
            {harvestFormData.storage_available ? "YES (Protected)" : "NO (Open Field)"}
          </span>
        </button>

        {/* 8. PRIMARY CTA PILL BUTTON */}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full py-4 rounded-full bg-[#0B4628] hover:bg-[#0F5E37] text-white font-black text-sm shadow-lg shadow-[#0B4628]/25 transition flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
        >
          {isLoading ? (
            <span>Analyzing Harvest Forecast...</span>
          ) : (
            <>
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Evaluate Harvest Shield</span>
            </>
          )}
        </button>

      </div>

    </div>
  );
}
