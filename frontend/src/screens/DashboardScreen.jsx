import React, { useState } from 'react';
import {
  CloudSun,
  Wind,
  Droplets,
  Sprout,
  Activity,
  Layers,
  Sparkles,
  ChevronRight,
  Send,
  Calendar,
  Compass,
  AlertCircle,
  Plus,
  Minus,
  CheckCircle2,
  RefreshCw,
  TrendingUp,
  MapPin,
  Bot
} from 'lucide-react';

export default function DashboardScreen({ onNavigate, language = 'en' }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [autoWatering, setAutoWatering] = useState(true);
  const [phBalancer, setPhBalancer] = useState(true);
  const [aiChatInput, setAiChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'bot',
      text: "Field 1 soil moisture is currently at 42%. ICAR guidelines recommend delaying sowing by 2-3 days until the forecasted 18mm rain event passes."
    }
  ]);
  const [mapZoom, setMapZoom] = useState(1);
  const [selectedPlot, setSelectedPlot] = useState('Area 1');

  const handleSendChat = (e) => {
    e?.preventDefault();
    if (!aiChatInput.trim()) return;
    const userText = aiChatInput.trim();
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setAiChatInput('');
    setTimeout(() => {
      let botResponse = "Based on our trained Random Forest model and live IMD weather forecast, your soil NPK balance is optimal. Nitrogen application for Soybean can be scheduled post-germination.";
      if (userText.toLowerCase().includes('harvest')) {
        botResponse = "Harvest readiness for your mature parcels indicates high pod shattering risk if delayed beyond 5 days. Ensure dry storage!";
      } else if (userText.toLowerCase().includes('water') || userText.toLowerCase().includes('irrigation')) {
        botResponse = "Irrigation schedule: Auto-watering is active. Scheduled next micro-drip cycle tomorrow at 06:00 AM.";
      }
      setChatMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
    }, 700);
  };

  const promptChips = [
    "What is the best sowing date?",
    "Check harvest readiness",
    "Fertilizer dosage for Cotton",
    "Pest alert check"
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Quick Action CTA */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-emerald-700/50">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            AI Precision Command Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Smart Farm Command Center</h1>
          <p className="text-emerald-200/80 text-sm mt-1 max-w-xl">
            Live telemetry, predictive satellite parcel analytics, soil nutrient balance, and automated irrigation controls.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigate('farm_details')}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Sprout className="w-4 h-4 text-slate-950" />
            <span>Sowing Advisory</span>
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('harvest_details')}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Activity className="w-4 h-4 text-slate-950" />
            <span>Harvest Advisory</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid: 3 Columns Layout on large screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* 1. WEATHER & MICROCLIMATE CARD */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100/40 dark:bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Live Telemetry</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Sync
              </span>
            </div>

            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>16 March 2026</span>
                </div>
                <h3 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">24°C</h3>
                <p className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm mt-1">Partly Cloudy</p>
              </div>
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 text-amber-500 rounded-2xl border border-amber-200/60 dark:border-amber-800/40">
                <CloudSun className="w-10 h-10" />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-500">
                <Wind className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500">Wind</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">3 m/s</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/30 text-teal-500">
                <Droplets className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500">Humidity</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">80%</p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. PLANT HEALTH & ACTIVE CROP ZONES */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Field Diagnostics</span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                Healthy
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/30">
                <p className="text-xs text-emerald-800 dark:text-emerald-400 font-semibold mb-1">Plant Health</p>
                <p className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-400">95%</p>
                <span className="inline-block mt-2 text-[11px] font-semibold text-emerald-600 dark:text-emerald-500 bg-emerald-100/80 dark:bg-emerald-900/50 px-2 py-0.5 rounded-md">
                  Excellent condition
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/60">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1">Active Crop Zones</p>
                <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">9</p>
                <span className="inline-block mt-2 text-[11px] font-semibold text-slate-600 dark:text-slate-400 bg-slate-200/70 dark:bg-slate-700/50 px-2 py-0.5 rounded-md">
                  All parcels online
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Sensor mesh 100% active
            </span>
            <button
              onClick={() => onNavigate('saved_fields')}
              className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              View zones <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 3. SOIL NUTRIENT STATUS (WAVE GRADIENT) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Soil Nutrient Status</h3>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold shadow-sm">
                Optimal
              </span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">Nitrogen, Phosphorus & Potassium equilibrium</p>

            {/* Graphic SVG Wave representation */}
            <div className="h-24 w-full relative rounded-2xl overflow-hidden bg-gradient-to-b from-emerald-50/50 to-emerald-100/30 dark:from-emerald-950/20 dark:to-emerald-900/10 border border-emerald-200/50 dark:border-emerald-800/30">
              <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="h-full w-full">
                <defs>
                  <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#059669" stopOpacity="0.05" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,80 C150,140 350,10 500,70 L500,150 L0,150 Z"
                  fill="url(#waveGradient)"
                />
                <path
                  d="M0,80 C150,140 350,10 500,70"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeDasharray="4 2"
                />
                <circle cx="280" cy="50" r="5" fill="#10b981" className="animate-ping" />
                <circle cx="280" cy="50" r="4" fill="#047857" />
              </svg>
              <div className="absolute top-2 left-3 text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                NPK index: 88.4 / 100
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-3 text-center text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] font-semibold">N (Nitrogen)</span>
              <span className="font-bold text-slate-700 dark:text-slate-200">High</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-semibold">P (Phosphorus)</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">Optimal</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-semibold">K (Potassium)</span>
              <span className="font-bold text-slate-700 dark:text-slate-200">Optimal</span>
            </div>
          </div>
        </div>

      </div>

      {/* Second Row: Middle controls & Fertilizer Barcode */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* 4. AUTO WATERING & pH BALANCER */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Automation Subsystems</h3>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
              </span>
            </div>

            <div className="space-y-4">
              {/* Auto Watering */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Auto Watering</p>
                    <p className="text-xs text-slate-400">Micro-drip sensor loop</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoWatering(!autoWatering)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 focus:outline-none ${
                    autoWatering ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                      autoWatering ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* pH Balancer */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-teal-500/10 text-teal-500">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">pH Balancer</p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">6.4 Stable (Ideal)</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPhBalancer(!phBalancer)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 focus:outline-none ${
                    phBalancer ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                      phBalancer ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-4 text-center">
            Automations synchronize every 15 minutes with local telemetry.
          </p>
        </div>

        {/* 5. FERTILIZER APPLICATION LEVEL (BARCODE SPECTRUM) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Fertilizer Application Level</h3>
              <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 text-xs font-bold">
                Moderate - High
              </span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-5">Spectrum band indicator across 12 monitoring grids</p>

            {/* Spectrum Barcode display */}
            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800">
              <div className="flex items-end justify-between h-16 gap-1.5 px-2">
                {[60, 75, 45, 85, 95, 70, 80, 65, 90, 85, 55, 78].map((h, i) => {
                  let colorClass = 'bg-emerald-400';
                  if (h > 80) colorClass = 'bg-teal-500';
                  if (h > 90) colorClass = 'bg-emerald-600';
                  if (h < 60) colorClass = 'bg-amber-400';
                  return (
                    <div
                      key={i}
                      style={{ height: `${h}%` }}
                      className={`w-full rounded-sm ${colorClass} transition-all duration-300 hover:opacity-80`}
                      title={`Grid ${i+1}: ${h}%`}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-2 px-1">
                <span>Grid 1 (North)</span>
                <span>Target: 75%</span>
                <span>Grid 12 (South)</span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <span>Next schedule: 22 March</span>
            <button
              onClick={() => onNavigate('farm_details')}
              className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
            >
              Re-calculate dose
            </button>
          </div>
        </div>

        {/* 6. GROWTH & EMERGENCE RADIAL GAUGE */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Growth & Emergence Index</h3>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">On Target</span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">Canopy coverage & vegetative stage tracking</p>

            {/* Radial gauge representation */}
            <div className="flex flex-col items-center justify-center py-2 relative">
              <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  stroke="currentColor"
                  strokeWidth="10"
                  className="text-slate-100 dark:text-slate-800"
                  fill="transparent"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  stroke="currentColor"
                  strokeWidth="10"
                  className="text-emerald-500"
                  fill="transparent"
                  strokeDasharray="301.59"
                  strokeDashoffset={301.59 * (1 - 0.87)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">87%</span>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">Optimal</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-around text-center text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">Min Emergence</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">79%</span>
            </div>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />
            <div>
              <span className="text-slate-400 block text-[10px]">Avg Emergence</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">87%</span>
            </div>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />
            <div>
              <span className="text-slate-400 block text-[10px]">Peak Emergence</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">94%</span>
            </div>
          </div>
        </div>

      </div>

      {/* Third Row: Large Satellite Farmland Map with Glassmorphic Floating HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 7. SATELLITE FIELD MAP (Spans 2 columns on lg) */}
        <div className="lg:col-span-2 bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-xl relative min-h-[460px] flex flex-col justify-between">
          
          {/* Map Canvas Background (Simulated Satellite imagery) */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] bg-slate-950">
            {/* Farmland Grid Graphic */}
            <svg className="w-full h-full opacity-60 pointer-events-none" viewBox="0 0 800 500">
              <defs>
                <pattern id="farmlandPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="800" height="500" fill="url(#farmlandPattern)" />
              
              {/* Parcel Boundaries */}
              <polygon points="60,80 340,50 360,280 90,320" fill="#065f46" fillOpacity="0.4" stroke="#10b981" strokeWidth="2" />
              <polygon points="360,50 680,80 720,310 380,280" fill="#047857" fillOpacity="0.3" stroke="#34d399" strokeWidth="2" />
              <polygon points="100,340 380,300 400,470 120,480" fill="#0f766e" fillOpacity="0.35" stroke="#14b8a6" strokeWidth="1.5" />
              <polygon points="400,300 730,330 750,470 420,470" fill="#115e59" fillOpacity="0.4" stroke="#2dd4bf" strokeWidth="1.5" />

              {/* Animated Sensor Nodes */}
              <circle cx="210" cy="180" r="6" fill="#34d399" className="animate-ping" opacity="0.75" />
              <circle cx="210" cy="180" r="4" fill="#10b981" />
              <circle cx="530" cy="190" r="5" fill="#34d399" />
              <circle cx="250" cy="400" r="5" fill="#34d399" />
              <circle cx="570" cy="400" r="5" fill="#34d399" />
            </svg>
          </div>

          {/* Top Bar inside Map */}
          <div className="relative z-10 p-5 flex items-center justify-between">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-white text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Nagpur Central Farm • Parcel Map</span>
            </div>

            {/* Map Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMapZoom(prev => Math.min(prev + 0.2, 1.8))}
                className="p-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700 text-white hover:bg-slate-800 transition-colors"
                title="Zoom in"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={() => setMapZoom(prev => Math.max(prev - 0.2, 0.8))}
                className="p-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700 text-white hover:bg-slate-800 transition-colors"
                title="Zoom out"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={() => setMapZoom(1)}
                className="p-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700 text-white hover:bg-slate-800 transition-colors"
                title="Recenter"
              >
                <Compass className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Floating Dark-Green Glassmorphic Telemetry HUD */}
          <div className="relative z-10 m-5 p-5 rounded-2xl bg-emerald-950/80 backdrop-blur-xl border border-emerald-500/30 text-white shadow-2xl max-w-md">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-300">Selected Plot</span>
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Area 1: Soybean & Cotton</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </h4>
              </div>
              <div className="text-right">
                <span className="text-xs text-emerald-300 font-medium">Crop Health</span>
                <p className="text-xl font-extrabold text-emerald-400">87%</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 my-4 text-xs">
              <div className="bg-emerald-900/40 p-2.5 rounded-xl border border-emerald-700/40">
                <span className="text-emerald-300 text-[11px] block">Planting Date</span>
                <span className="font-semibold text-white">05 June 2026</span>
              </div>
              <div className="bg-emerald-900/40 p-2.5 rounded-xl border border-emerald-700/40">
                <span className="text-emerald-300 text-[11px] block">Est. Harvest Window</span>
                <span className="font-semibold text-white">20-25 Sept 2026</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => onNavigate('farm_details')}
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs text-center transition-colors shadow-md"
              >
                Run Sowing Decision
              </button>
              <button
                onClick={() => onNavigate('harvest_details')}
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-800/80 hover:bg-emerald-800 text-emerald-100 font-bold text-xs text-center border border-emerald-600/50 transition-colors"
              >
                Check Harvest
              </button>
            </div>
          </div>
        </div>

        {/* 8. AI AGRONOMIST ASSISTANT CHAT */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between h-full min-h-[460px]">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500 text-white shadow-md shadow-emerald-500/20">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">AI Agronomist</h3>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Trained on ICAR & Agronomic Datasets</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                Online
              </span>
            </div>

            {/* Prompt Chips */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {promptChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => setAiChatInput(chip)}
                  className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 text-[11px] font-medium border border-slate-200/80 dark:border-slate-700/60 transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Chat message stream */}
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-2xl text-xs ${
                    msg.sender === 'bot'
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 text-slate-800 dark:text-emerald-100'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white ml-6 text-right'
                  }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Chat Input */}
          <form onSubmit={handleSendChat} className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="relative flex items-center">
              <input
                type="text"
                value={aiChatInput}
                onChange={(e) => setAiChatInput(e.target.value)}
                placeholder="+ Ask anything about your farm..."
                className="w-full pl-4 pr-11 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
              <button
                type="submit"
                className="absolute right-1.5 p-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors shadow-sm"
                title="Send inquiry"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
