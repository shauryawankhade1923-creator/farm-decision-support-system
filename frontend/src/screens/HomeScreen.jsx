import React, { useState } from "react";
import { 
  Search, Mic, ChevronDown, Clock, TrendingUp, ShieldCheck, 
  Shield, Sun, Moon, CloudRain, Droplets, Wind, Compass, 
  Sprout, Wheat, ArrowRight, Star, Heart, Bookmark, Eye, MapPin,
  CheckCircle2, Sparkles
} from "lucide-react";
import { translations } from "../locales/translations";

export default function HomeScreen({
  onStartDecision,
  onStartHarvest,
  onQuickPreset,
  onQuickHarvestPreset,
  onGoToHistory,
  onGoToSaved,
  setFormData,
  language = "en"
}) {
  const t = translations[language] || translations.en;

  // Curated prominent districts with real agro-climatic profile and primary crops
  const DISTRICT_CROPS = {
    "Pune": {
      state: "Western Maharashtra",
      lat: 18.5204,
      lng: 73.8567,
      soil: "medium",
      temp: "25°C",
      weather: "Partly Sunny",
      rain7d: "4.2mm",
      humidity: "68%",
      crops: [
        {
          id: "Soybean",
          name: "Soybean (JS 335)",
          category: "Kharif Oilseed",
          window: "15 - 25 June",
          status: "High Sowing Area",
          moisture: "50-75 mm",
          image: "/crops/soybean_field.jpg"
        },
        {
          id: "Wheat",
          name: "Durum Wheat (Sharbati)",
          category: "Rabi Cereal",
          window: "01 - 15 Nov",
          status: "Irrigated Plots",
          moisture: "Residual / Canal",
          image: "/crops/wheat_golden.jpg"
        },
        {
          id: "Groundnut",
          name: "Groundnut (JL 24)",
          category: "Kharif Legume",
          window: "20 June - 05 July",
          status: "Well-Drained Loam",
          moisture: "30-40 mm",
          image: "/crops/groundnut_harvest.jpg"
        }
      ]
    },
    "Nagpur": {
      state: "Vidarbha Region",
      lat: 21.1458,
      lng: 79.0882,
      soil: "heavy",
      temp: "29°C",
      weather: "Sunny & Warm",
      rain7d: "1.5mm",
      humidity: "54%",
      crops: [
        {
          id: "Cotton",
          name: "Bt Cotton (Bollgard II)",
          category: "Black Soil Cash Crop",
          window: "20 June - 05 July",
          status: "Regional Dominance",
          moisture: "75-100 mm",
          image: "/crops/cotton_bolls.jpg"
        },
        {
          id: "Soybean",
          name: "Soybean (JS 9305)",
          category: "Early Kharif",
          window: "15 - 28 June",
          status: "Short Duration",
          moisture: "45-60 mm",
          image: "/crops/soybean_field.jpg"
        }
      ]
    },
    "Nashik": {
      state: "North Maharashtra",
      lat: 19.9975,
      lng: 73.7898,
      soil: "medium",
      temp: "23°C",
      weather: "Pleasant",
      rain7d: "6.8mm",
      humidity: "74%",
      crops: [
        {
          id: "Maize",
          name: "Hybrid Sweet Corn / Maize",
          category: "Grain & Fodder",
          window: "10 June - 15 July",
          status: "High Vigor",
          moisture: "30-50 mm",
          image: "/crops/maize_corn_cobs.jpg"
        },
        {
          id: "Wheat",
          name: "Lokwan Wheat",
          category: "Winter Grain",
          window: "05 - 25 Nov",
          status: "Cool Nights",
          moisture: "Pre-sown Irrigation",
          image: "/crops/wheat_golden.jpg"
        },
        {
          id: "Soybean",
          name: "Soybean (MACS 1407)",
          category: "High Protein",
          window: "15 June - 05 July",
          status: "Optimal Rain",
          moisture: "50-70 mm",
          image: "/crops/soybean_field.jpg"
        }
      ]
    },
    "Akola": {
      state: "Central Vidarbha",
      lat: 20.7002,
      lng: 77.0082,
      soil: "heavy",
      temp: "31°C",
      weather: "Warm & Dry",
      rain7d: "0.8mm",
      humidity: "48%",
      crops: [
        {
          id: "Cotton",
          name: "Hybrid Cotton (Dr. PDKV)",
          category: "Rainfed Cotton",
          window: "25 June - 10 July",
          status: "Deep Black Regur",
          moisture: "80-100 mm",
          image: "/crops/cotton_bolls.jpg"
        },
        {
          id: "Soybean",
          name: "Soybean (JS 95-60)",
          category: "Drought Tolerant",
          window: "18 June - 02 July",
          status: "Fast Ripening",
          moisture: "40-55 mm",
          image: "/crops/soybean_field.jpg"
        }
      ]
    },
    "Solapur": {
      state: "Southern Maharashtra",
      lat: 17.6599,
      lng: 75.9064,
      soil: "light",
      temp: "28°C",
      weather: "Clear Skies",
      rain7d: "2.1mm",
      humidity: "58%",
      crops: [
        {
          id: "Groundnut",
          name: "Groundnut (TAG 24)",
          category: "Semi-Arid Legume",
          window: "15 June - 10 July",
          status: "Light Soil Specialist",
          moisture: "30-40 mm",
          image: "/crops/groundnut_harvest.jpg"
        },
        {
          id: "Maize",
          name: "Maize (African Tall / Pioneer)",
          category: "Fodder & Grain",
          window: "01 - 20 July",
          status: "Drought Resilient",
          moisture: "25-35 mm",
          image: "/crops/maize_corn_cobs.jpg"
        }
      ]
    },
    "Chhatrapati Sambhajinagar": {
      state: "Marathwada",
      lat: 19.8762,
      lng: 75.3433,
      soil: "medium",
      temp: "27°C",
      weather: "Partly Cloudy",
      rain7d: "3.4mm",
      humidity: "62%",
      crops: [
        {
          id: "Cotton",
          name: "Bt Cotton",
          category: "Cash Crop",
          window: "20 June - 05 July",
          status: "Black Soil Tracts",
          moisture: "70-90 mm",
          image: "/crops/cotton_bolls.jpg"
        },
        {
          id: "Soybean",
          name: "Soybean",
          category: "Kharif Staple",
          window: "15 - 30 June",
          status: "Monsoon Dependent",
          moisture: "50-70 mm",
          image: "/crops/soybean_field.jpg"
        }
      ]
    }
  };

  const [selectedDistrict, setSelectedDistrict] = useState("Pune");
  const currentDistrictData = DISTRICT_CROPS[selectedDistrict] || DISTRICT_CROPS["Pune"];

  const handleDistrictChange = (districtName) => {
    setSelectedDistrict(districtName);
    const data = DISTRICT_CROPS[districtName];
    if (data && setFormData) {
      setFormData(prev => ({
        ...prev,
        location: districtName,
        lat: data.lat,
        lng: data.lng,
        soil_type: data.soil
      }));
    }
  };

  const handleSelectCropAndEvaluate = (crop) => {
    if (setFormData) {
      setFormData(prev => ({
        ...prev,
        location: selectedDistrict,
        lat: currentDistrictData.lat,
        lng: currentDistrictData.lng,
        crop: crop.id,
        soil_type: currentDistrictData.soil
      }));
    }
    onStartDecision();
  };

  const categories = [
    { 
      id: "duration", 
      title: "Duration", 
      badge: "Sowing", 
      icon: Clock, 
      color: "text-blue-600", 
      bg: "bg-blue-50",
      action: onStartDecision
    },
    { 
      id: "return", 
      title: "Return", 
      badge: "Yield", 
      icon: TrendingUp, 
      color: "text-emerald-600", 
      bg: "bg-emerald-50",
      action: () => onQuickPreset({ location: selectedDistrict, crop: currentDistrictData.crops[0]?.id || "Soybean", irrigation: true, soil: currentDistrictData.soil })
    },
    { 
      id: "risk", 
      title: "Low Risk", 
      badge: "ICAR Rule", 
      icon: ShieldCheck, 
      color: "text-amber-600", 
      bg: "bg-amber-50",
      action: onStartHarvest
    },
    { 
      id: "safety", 
      title: "Safety", 
      badge: "Shield", 
      icon: Shield, 
      color: "text-teal-600", 
      bg: "bg-teal-50",
      action: () => onQuickHarvestPreset({ location: selectedDistrict, crop: currentDistrictData.crops[0]?.id || "Soybean", storage_available: true, days_ago: 105 })
    }
  ];

  return (
    <div className="w-full max-w-xl mx-auto pb-24 font-sans text-slate-800 antialiased">
      
      {/* 1. TOP CURVED EMERALD HEADER */}
      <div className="bg-[#0B4628] text-white pt-6 pb-20 px-6 rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Greeting & Clickable Profile Avatar */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">Hello, Good Morning</h2>
            <div className="flex items-center gap-1.5 text-emerald-200/90 text-xs font-semibold mt-1">
              <span>Sunday, 16 March 2026</span>
              <ChevronDown className="w-3.5 h-3.5 text-emerald-300" />
            </div>
          </div>
          
          <button 
            onClick={onGoToHistory}
            className="w-12 h-12 rounded-full border-2 border-emerald-400/60 overflow-hidden shadow-md bg-emerald-900 flex items-center justify-center cursor-pointer hover:scale-105 transition"
            title="View Profile & Farmer Feedback History"
          >
            <img 
              src="/user_avatar.jpg" 
              alt="Farmer Profile" 
              className="w-full h-full object-cover"
            />
          </button>
        </div>

        {/* District Selector Dropdown & Search Bar */}
        <div className="mt-5 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-emerald-200 font-bold px-1">
            <span>Select Maharashtra Agricultural District:</span>
            <span className="text-[10px] bg-emerald-700/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
              {currentDistrictData.state}
            </span>
          </div>

          <div className="relative flex items-center bg-white/10 border border-emerald-500/40 rounded-full p-1.5 backdrop-blur-md">
            <MapPin className="w-4 h-4 text-emerald-300 ml-3 shrink-0" />
            <select
              value={selectedDistrict}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="w-full bg-transparent text-white font-black text-xs px-2.5 py-1.5 focus:outline-none cursor-pointer"
            >
              {Object.keys(DISTRICT_CROPS).map((dist) => (
                <option key={dist} value={dist} className="text-slate-900 font-bold">
                  {dist} District ({DISTRICT_CROPS[dist].state})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. OVERLAPPING FLOATING WEATHER CARD */}
      <div className="-mt-14 px-4 sm:px-6 relative z-10">
        <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-slate-100 space-y-6">
          
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>{selectedDistrict}, {currentDistrictData.state}</span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                  {currentDistrictData.temp}
                </span>
                <span className="text-xs font-bold text-slate-400">
                  {currentDistrictData.weather}
                </span>
              </div>
            </div>

            <div className="relative w-16 h-16 flex items-center justify-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-500 shadow-sm">
                <Sun className="w-7 h-7" />
              </div>
              <div className="absolute -bottom-1 -left-1 p-1 bg-sky-50 rounded-xl text-sky-500 border border-white shadow-xs">
                <CloudRain className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* 4 Micro-telemetry Metrics for selected district */}
          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-center">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Humidity</span>
              <span className="text-xs sm:text-sm font-black text-slate-800 mt-0.5 block">{currentDistrictData.humidity}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Precip</span>
              <span className="text-xs sm:text-sm font-black text-slate-800 mt-0.5 block">{currentDistrictData.rain7d}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Soil Type</span>
              <span className="text-xs sm:text-sm font-black text-emerald-700 uppercase mt-0.5 block">{currentDistrictData.soil}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Wind</span>
              <span className="text-xs sm:text-sm font-black text-slate-800 mt-0.5 block">3 m/s</span>
            </div>
          </div>

          {/* Sunrise / Sunset Arc Indicator */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <div className="text-left">
              <span className="text-slate-800 font-black text-xs block">5:45 am</span>
              <span className="text-[10px] text-slate-400 font-bold">Sunrise</span>
            </div>

            <div className="flex-1 mx-4 relative flex flex-col items-center">
              <svg className="w-full h-8" viewBox="0 0 160 35">
                <path
                  d="M 10 30 Q 80 -10 150 30"
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                />
                <circle cx="95" cy="10" r="5" fill="#EAB308" className="shadow-sm animate-pulse" />
              </svg>
            </div>

            <div className="text-right">
              <span className="text-slate-800 font-black text-xs block">6:42 pm</span>
              <span className="text-[10px] text-slate-400 font-bold">Sunset</span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. INVEST BY CATEGORY */}
      <div className="px-6 mt-8 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-slate-900 tracking-tight">Decision Advisory Modes</h3>
          <span className="text-xs font-bold text-emerald-700 cursor-pointer hover:underline">Instant Guide</span>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={cat.action}
                className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center gap-2 hover:border-emerald-300 hover:shadow-md transition-all group cursor-pointer"
              >
                <div className={`w-11 h-11 rounded-2xl ${cat.bg} ${cat.color} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block leading-tight">{cat.title}</span>
                  <span className="text-[9px] font-black text-emerald-600 uppercase mt-0.5 block">{cat.badge}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. DISTRICT-SPECIFIC PROMINENT CROPS CAROUSEL */}
      <div className="px-6 mt-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Crops Grown in {selectedDistrict}
            </h3>
            <span className="text-[11px] text-slate-500 font-medium">
              Calibrated to {selectedDistrict}'s {currentDistrictData.soil} soil & rainfall
            </span>
          </div>
          <button 
            onClick={onStartDecision} 
            className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-0.5"
          >
            All Crops <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {currentDistrictData.crops.map((crop) => (
            <div
              key={crop.id}
              onClick={() => handleSelectCropAndEvaluate(crop)}
              className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="h-32 w-full relative overflow-hidden">
                <img 
                  src={crop.image} 
                  alt={crop.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-slate-900/70 backdrop-blur-md text-white text-[10px] font-bold">
                  {crop.status}
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">{crop.category}</span>
                  <h4 className="text-sm font-black text-slate-900 mt-0.5">{crop.name}</h4>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                  <div>
                    <span className="text-[10px] block text-slate-400">Sowing Window</span>
                    <span className="font-bold text-slate-800">{crop.window}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] block text-slate-400">Rain Threshold</span>
                    <span className="font-bold text-emerald-700">{crop.moisture}</span>
                  </div>
                </div>

                <button className="w-full py-2.5 rounded-xl bg-[#0B4628] hover:bg-[#0F5E37] text-white text-xs font-bold transition shadow-sm flex items-center justify-center gap-1">
                  <span>Evaluate for {selectedDistrict}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
