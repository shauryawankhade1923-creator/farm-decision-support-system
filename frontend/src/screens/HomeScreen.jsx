import React, { useState, useEffect } from "react";
import { 
  Search, Mic, ChevronDown, Clock, TrendingUp, ShieldCheck, 
  Shield, Sun, Moon, CloudRain, Droplets, Wind, Compass, 
  Sprout, Wheat, ArrowRight, Star, Heart, Bookmark, Eye, MapPin,
  CheckCircle2, Sparkles, Bell, Globe2
} from "lucide-react";
import { translations } from "../locales/translations";

import LanguageSelector from "../components/LanguageSelector";
import ClimateResilienceModal from "../components/ClimateResilienceModal";

export default function HomeScreen({
  onStartDecision,
  onStartHarvest,
  onQuickPreset,
  onQuickHarvestPreset,
  onGoToHistory,
  onGoToSaved,
  onGoToProfile,
  onOpenAuth,
  onOpenOnboarding,
  currentUser = null,
  setFormData,
  language = "en",
  setLanguage,
  onOpenNotifications,
  unreadNotificationCount = 0
}) {
  const t = translations[language] || translations.en;
  // Real-time live date and ticking clock
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentDateTime.getHours();
    if (hour < 12) return t.greetingMorning || "Hello, Good Morning";
    if (hour < 17) return t.greetingAfternoon || "Hello, Good Afternoon";
    return t.greetingEvening || "Hello, Good Evening";
  };

  const localeMap = { en: "en-IN", mr: "mr-IN", hi: "hi-IN" };
  const activeLocale = localeMap[language] || "en-IN";

  const formattedDate = currentDateTime.toLocaleDateString(activeLocale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const formattedTime = currentDateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });


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
          id: "Gram",
          name: "Gram (Digvijay)",
          category: "Rabi Legume",
          window: "15 Oct - 10 Nov",
          status: "High Yielding",
          moisture: "35-50 mm",
          image: "/crops/gram_chickpea.jpg"
        },
        {
          id: "Groundnut",
          name: "Groundnut (JL 24)",
          category: "Kharif Legume",
          window: "20 June - 05 July",
          status: "Well-Drained Loam",
          moisture: "30-40 mm",
          image: "/crops/groundnut_harvest.jpg"
        },
        {
          id: "Jowar",
          name: "Rabi Jowar (Maldandi M 35-1)",
          category: "Rabi Grain",
          window: "15 Sept - 15 Oct",
          status: "Drought Resilient",
          moisture: "25-35 mm",
          image: "/crops/jowar_sorghum.jpg"
        }
      ]
    },
    "Nagpur": {
      state: "Eastern Vidarbha",
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
        },
        {
          id: "Pigeonpea",
          name: "Pigeonpea / Tur (BSMR 736)",
          category: "Intercrop Pulse",
          window: "15 June - 05 July",
          status: "High Protein",
          moisture: "50-70 mm",
          image: "/crops/pigeonpea_tur.jpg"
        },
        {
          id: "Gram",
          name: "Gram (Vijay / Digvijay)",
          category: "Rabi Legume",
          window: "15 Oct - 10 Nov",
          status: "Residual Moisture",
          moisture: "35-50 mm",
          image: "/crops/gram_chickpea.jpg"
        },
        {
          id: "Wheat",
          name: "Lokwan Wheat",
          category: "Winter Grain",
          window: "05 - 25 Nov",
          status: "Cool Nights",
          moisture: "Pre-sown Irrigation",
          image: "/crops/wheat_golden.jpg"
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
        },
        {
          id: "Gram",
          name: "Gram (Digvijay)",
          category: "Rabi Legume",
          window: "15 Oct - 10 Nov",
          status: "High Yielding",
          moisture: "35-50 mm",
          image: "/crops/gram_chickpea.jpg"
        },
        {
          id: "Bajra",
          name: "Bajra (Shraddha / Saburi)",
          category: "Kharif Millet",
          window: "20 June - 15 July",
          status: "Light Soil Specialist",
          moisture: "25-35 mm",
          image: "/crops/bajra_millet.jpg"
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
        },
        {
          id: "Pigeonpea",
          name: "Pigeonpea / Tur (Asha / BDN 711)",
          category: "Intercrop Pulse",
          window: "20 June - 05 July",
          status: "High Protein",
          moisture: "50-70 mm",
          image: "/crops/pigeonpea_tur.jpg"
        },
        {
          id: "Gram",
          name: "Gram (Jaki 9218)",
          category: "Rabi Legume",
          window: "15 Oct - 15 Nov",
          status: "Wilt Resistant",
          moisture: "35-45 mm",
          image: "/crops/gram_chickpea.jpg"
        },
        {
          id: "Jowar",
          name: "Rabi Jowar (Maldandi)",
          category: "Rabi Grain",
          window: "15 Sept - 10 Oct",
          status: "Drought Resilient",
          moisture: "25-35 mm",
          image: "/crops/jowar_sorghum.jpg"
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
          id: "Jowar",
          name: "Rabi Jowar (Maldandi M 35-1)",
          category: "Rabi Grain",
          window: "15 Sept - 15 Oct",
          status: "Drought Resilient",
          moisture: "25-35 mm",
          image: "/crops/jowar_sorghum.jpg"
        },
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
          id: "Gram",
          name: "Gram (Vijay)",
          category: "Rabi Legume",
          window: "10 Oct - 05 Nov",
          status: "Low Water Need",
          moisture: "30-40 mm",
          image: "/crops/gram_chickpea.jpg"
        },
        {
          id: "Maize",
          name: "Maize (African Tall / Pioneer)",
          category: "Fodder & Grain",
          window: "01 - 20 July",
          status: "Drought Resilient",
          moisture: "25-35 mm",
          image: "/crops/maize_corn_cobs.jpg"
        },
        {
          id: "Pigeonpea",
          name: "Pigeonpea / Tur (BSMR 853)",
          category: "Intercrop Pulse",
          window: "20 June - 10 July",
          status: "Dryland Pulse",
          moisture: "45-60 mm",
          image: "/crops/pigeonpea_tur.jpg"
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
          name: "Bt Cotton (Ajeet 155 / Rasi)",
          category: "Black Soil Cash Crop",
          window: "20 June - 05 July",
          status: "Black Soil Tracts",
          moisture: "70-90 mm",
          image: "/crops/cotton_bolls.jpg"
        },
        {
          id: "Soybean",
          name: "Soybean (JS 335)",
          category: "Kharif Staple",
          window: "15 - 30 June",
          status: "Monsoon Dependent",
          moisture: "50-70 mm",
          image: "/crops/soybean_field.jpg"
        },
        {
          id: "Bajra",
          name: "Bajra (Shraddha)",
          category: "Kharif Millet",
          window: "15 June - 10 July",
          status: "Light Soil Specialist",
          moisture: "25-35 mm",
          image: "/crops/bajra_millet.jpg"
        },
        {
          id: "Gram",
          name: "Gram (Digvijay)",
          category: "Rabi Legume",
          window: "15 Oct - 10 Nov",
          status: "High Yielding",
          moisture: "35-50 mm",
          image: "/crops/gram_chickpea.jpg"
        },
        {
          id: "Jowar",
          name: "Rabi Jowar (Maldandi)",
          category: "Rabi Grain",
          window: "15 Sept - 15 Oct",
          status: "Drought Resilient",
          moisture: "25-35 mm",
          image: "/crops/jowar_sorghum.jpg"
        }
      ]
    },
    "Amravati": {
      state: "Vidarbha Region",
      lat: 20.9374,
      lng: 77.7796,
      soil: "heavy",
      temp: "30°C",
      weather: "Warm & Dry",
      rain7d: "1.2mm",
      humidity: "52%",
      crops: [
        {
          id: "Soybean",
          name: "Soybean (JS 335)",
          category: "Kharif Oilseed",
          window: "15 - 28 June",
          status: "Regional Dominance",
          moisture: "50-70 mm",
          image: "/crops/soybean_field.jpg"
        },
        {
          id: "Cotton",
          name: "Bt Cotton (Bollgard II)",
          category: "Black Soil Cash Crop",
          window: "20 June - 05 July",
          status: "Deep Black Regur",
          moisture: "75-95 mm",
          image: "/crops/cotton_bolls.jpg"
        },
        {
          id: "Pigeonpea",
          name: "Pigeonpea / Tur (BSMR 736)",
          category: "Intercrop Pulse",
          window: "15 June - 05 July",
          status: "High Protein",
          moisture: "50-70 mm",
          image: "/crops/pigeonpea_tur.jpg"
        },
        {
          id: "Gram",
          name: "Gram (Jaki 9218)",
          category: "Rabi Legume",
          window: "15 Oct - 10 Nov",
          status: "Wilt Resistant",
          moisture: "35-45 mm",
          image: "/crops/gram_chickpea.jpg"
        }
      ]
    },
    "Yavatmal": {
      state: "Vidarbha Region",
      lat: 20.3888,
      lng: 78.1204,
      soil: "heavy",
      temp: "31°C",
      weather: "Sunny & Warm",
      rain7d: "0.9mm",
      humidity: "50%",
      crops: [
        {
          id: "Cotton",
          name: "Bt Cotton (Bollgard II)",
          category: "Black Soil Cash Crop",
          window: "20 June - 08 July",
          status: "Regional Dominance",
          moisture: "80-100 mm",
          image: "/crops/cotton_bolls.jpg"
        },
        {
          id: "Soybean",
          name: "Soybean (JS 95-60)",
          category: "Early Kharif",
          window: "18 June - 02 July",
          status: "Fast Ripening",
          moisture: "40-55 mm",
          image: "/crops/soybean_field.jpg"
        },
        {
          id: "Pigeonpea",
          name: "Pigeonpea / Tur (Asha)",
          category: "Intercrop Pulse",
          window: "15 June - 05 July",
          status: "High Protein",
          moisture: "50-70 mm",
          image: "/crops/pigeonpea_tur.jpg"
        },
        {
          id: "Gram",
          name: "Gram (Vijay)",
          category: "Rabi Legume",
          window: "15 Oct - 10 Nov",
          status: "Residual Moisture",
          moisture: "35-50 mm",
          image: "/crops/gram_chickpea.jpg"
        }
      ]
    },
    "Wardha": {
      state: "Vidarbha Region",
      lat: 20.7453,
      lng: 78.6022,
      soil: "heavy",
      temp: "29°C",
      weather: "Partly Sunny",
      rain7d: "1.8mm",
      humidity: "55%",
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
          name: "Soybean (JS 335)",
          category: "Kharif Oilseed",
          window: "15 - 28 June",
          status: "High Sowing Area",
          moisture: "50-70 mm",
          image: "/crops/soybean_field.jpg"
        },
        {
          id: "Pigeonpea",
          name: "Pigeonpea / Tur (BSMR 736)",
          category: "Intercrop Pulse",
          window: "15 June - 05 July",
          status: "High Protein",
          moisture: "50-70 mm",
          image: "/crops/pigeonpea_tur.jpg"
        },
        {
          id: "Wheat",
          name: "Lokwan Wheat",
          category: "Winter Grain",
          window: "05 - 25 Nov",
          status: "Cool Nights",
          moisture: "Pre-sown Irrigation",
          image: "/crops/wheat_golden.jpg"
        }
      ]
    },
    "Buldhana": {
      state: "Vidarbha Region",
      lat: 20.5293,
      lng: 76.1843,
      soil: "heavy",
      temp: "28°C",
      weather: "Partly Cloudy",
      rain7d: "2.3mm",
      humidity: "58%",
      crops: [
        {
          id: "Soybean",
          name: "Soybean (JS 95-60)",
          category: "Kharif Oilseed",
          window: "18 June - 02 July",
          status: "Fast Ripening",
          moisture: "45-60 mm",
          image: "/crops/soybean_field.jpg"
        },
        {
          id: "Cotton",
          name: "Bt Cotton (Bollgard II)",
          category: "Black Soil Cash Crop",
          window: "20 June - 05 July",
          status: "Black Soil Tracts",
          moisture: "75-95 mm",
          image: "/crops/cotton_bolls.jpg"
        },
        {
          id: "Maize",
          name: "Hybrid Sweet Corn / Maize",
          category: "Grain & Fodder",
          window: "15 June - 10 July",
          status: "High Vigor",
          moisture: "30-50 mm",
          image: "/crops/maize_corn_cobs.jpg"
        },
        {
          id: "Gram",
          name: "Gram (Jaki 9218)",
          category: "Rabi Legume",
          window: "15 Oct - 10 Nov",
          status: "Wilt Resistant",
          moisture: "35-45 mm",
          image: "/crops/gram_chickpea.jpg"
        }
      ]
    },
    "Kolhapur": {
      state: "Western Maharashtra",
      lat: 16.7050,
      lng: 74.2433,
      soil: "heavy",
      temp: "26°C",
      weather: "Pleasant",
      rain7d: "8.5mm",
      humidity: "76%",
      crops: [
        {
          id: "Soybean",
          name: "Soybean (Phule Sangam KDS 726)",
          category: "High Protein",
          window: "10 - 25 June",
          status: "High Sowing Area",
          moisture: "60-80 mm",
          image: "/crops/soybean_field.jpg"
        },
        {
          id: "Groundnut",
          name: "Groundnut (JL 24)",
          category: "Kharif Legume",
          window: "15 June - 05 July",
          status: "Well-Drained Loam",
          moisture: "35-45 mm",
          image: "/crops/groundnut_harvest.jpg"
        },
        {
          id: "Wheat",
          name: "Lokwan Wheat",
          category: "Winter Grain",
          window: "01 - 20 Nov",
          status: "Irrigated Plots",
          moisture: "Pre-sown Irrigation",
          image: "/crops/wheat_golden.jpg"
        },
        {
          id: "Gram",
          name: "Gram (Digvijay)",
          category: "Rabi Legume",
          window: "15 Oct - 10 Nov",
          status: "High Yielding",
          moisture: "35-50 mm",
          image: "/crops/gram_chickpea.jpg"
        }
      ]
    },
    "Satara": {
      state: "Western Maharashtra",
      lat: 17.6805,
      lng: 73.9997,
      soil: "medium",
      temp: "24°C",
      weather: "Partly Sunny",
      rain7d: "5.1mm",
      humidity: "70%",
      crops: [
        {
          id: "Soybean",
          name: "Soybean (Phule Sangam)",
          category: "Kharif Oilseed",
          window: "15 - 30 June",
          status: "High Sowing Area",
          moisture: "50-70 mm",
          image: "/crops/soybean_field.jpg"
        },
        {
          id: "Groundnut",
          name: "Groundnut (TAG 24)",
          category: "Semi-Arid Legume",
          window: "15 June - 05 July",
          status: "Light Soil Specialist",
          moisture: "30-40 mm",
          image: "/crops/groundnut_harvest.jpg"
        },
        {
          id: "Jowar",
          name: "Rabi Jowar (Maldandi)",
          category: "Rabi Grain",
          window: "15 Sept - 15 Oct",
          status: "Drought Resilient",
          moisture: "25-35 mm",
          image: "/crops/jowar_sorghum.jpg"
        },
        {
          id: "Gram",
          name: "Gram (Digvijay)",
          category: "Rabi Legume",
          window: "15 Oct - 10 Nov",
          status: "High Yielding",
          moisture: "35-50 mm",
          image: "/crops/gram_chickpea.jpg"
        },
        {
          id: "Wheat",
          name: "Lokwan Wheat",
          category: "Winter Grain",
          window: "05 - 20 Nov",
          status: "Cool Nights",
          moisture: "Pre-sown Irrigation",
          image: "/crops/wheat_golden.jpg"
        }
      ]
    },
    "Sangli": {
      state: "Southern Maharashtra",
      lat: 16.8524,
      lng: 74.5815,
      soil: "medium",
      temp: "27°C",
      weather: "Clear Skies",
      rain7d: "3.0mm",
      humidity: "64%",
      crops: [
        {
          id: "Soybean",
          name: "Soybean (JS 335)",
          category: "Kharif Oilseed",
          window: "15 - 28 June",
          status: "High Sowing Area",
          moisture: "50-70 mm",
          image: "/crops/soybean_field.jpg"
        },
        {
          id: "Groundnut",
          name: "Groundnut (JL 24)",
          category: "Kharif Legume",
          window: "15 June - 05 July",
          status: "Well-Drained Loam",
          moisture: "30-40 mm",
          image: "/crops/groundnut_harvest.jpg"
        },
        {
          id: "Jowar",
          name: "Rabi Jowar (Maldandi M 35-1)",
          category: "Rabi Grain",
          window: "15 Sept - 15 Oct",
          status: "Drought Resilient",
          moisture: "25-35 mm",
          image: "/crops/jowar_sorghum.jpg"
        },
        {
          id: "Maize",
          name: "Maize (African Tall / Pioneer)",
          category: "Fodder & Grain",
          window: "20 June - 15 July",
          status: "High Vigor",
          moisture: "30-45 mm",
          image: "/crops/maize_corn_cobs.jpg"
        },
        {
          id: "Gram",
          name: "Gram (Vijay)",
          category: "Rabi Legume",
          window: "10 Oct - 05 Nov",
          status: "Low Water Need",
          moisture: "30-40 mm",
          image: "/crops/gram_chickpea.jpg"
        }
      ]
    },
    "Ahmednagar": {
      state: "Western Maharashtra",
      lat: 19.0948,
      lng: 74.7480,
      soil: "medium",
      temp: "26°C",
      weather: "Partly Sunny",
      rain7d: "2.8mm",
      humidity: "60%",
      crops: [
        {
          id: "Bajra",
          name: "Bajra (Shraddha / Saburi)",
          category: "Kharif Millet",
          window: "15 June - 10 July",
          status: "Light Soil Specialist",
          moisture: "25-35 mm",
          image: "/crops/bajra_millet.jpg"
        },
        {
          id: "Soybean",
          name: "Soybean (JS 335)",
          category: "Kharif Oilseed",
          window: "15 - 30 June",
          status: "High Sowing Area",
          moisture: "50-70 mm",
          image: "/crops/soybean_field.jpg"
        },
        {
          id: "Jowar",
          name: "Rabi Jowar (Maldandi M 35-1)",
          category: "Rabi Grain",
          window: "15 Sept - 15 Oct",
          status: "Drought Resilient",
          moisture: "25-35 mm",
          image: "/crops/jowar_sorghum.jpg"
        },
        {
          id: "Gram",
          name: "Gram (Digvijay)",
          category: "Rabi Legume",
          window: "15 Oct - 10 Nov",
          status: "High Yielding",
          moisture: "35-50 mm",
          image: "/crops/gram_chickpea.jpg"
        },
        {
          id: "Wheat",
          name: "Lokwan Wheat",
          category: "Winter Grain",
          window: "05 - 25 Nov",
          status: "Cool Nights",
          moisture: "Pre-sown Irrigation",
          image: "/crops/wheat_golden.jpg"
        }
      ]
    },
    "Jalgaon": {
      state: "Khandesh (North Maharashtra)",
      lat: 21.0077,
      lng: 75.5626,
      soil: "heavy",
      temp: "30°C",
      weather: "Sunny & Warm",
      rain7d: "2.5mm",
      humidity: "56%",
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
          id: "Maize",
          name: "Hybrid Sweet Corn / Maize",
          category: "Grain & Fodder",
          window: "10 June - 10 July",
          status: "High Vigor",
          moisture: "30-50 mm",
          image: "/crops/maize_corn_cobs.jpg"
        },
        {
          id: "Bajra",
          name: "Bajra (Shraddha)",
          category: "Kharif Millet",
          window: "15 June - 10 July",
          status: "Light Soil Specialist",
          moisture: "25-35 mm",
          image: "/crops/bajra_millet.jpg"
        },
        {
          id: "Soybean",
          name: "Soybean (JS 335)",
          category: "Kharif Oilseed",
          window: "18 June - 02 July",
          status: "High Sowing Area",
          moisture: "50-70 mm",
          image: "/crops/soybean_field.jpg"
        },
        {
          id: "Wheat",
          name: "Lokwan Wheat",
          category: "Winter Grain",
          window: "05 - 25 Nov",
          status: "Cool Nights",
          moisture: "Pre-sown Irrigation",
          image: "/crops/wheat_golden.jpg"
        }
      ]
    },
    "Dhule": {
      state: "Khandesh (North Maharashtra)",
      lat: 20.9042,
      lng: 74.7749,
      soil: "medium",
      temp: "29°C",
      weather: "Warm & Dry",
      rain7d: "1.9mm",
      humidity: "53%",
      crops: [
        {
          id: "Cotton",
          name: "Bt Cotton (Bollgard II)",
          category: "Black Soil Cash Crop",
          window: "20 June - 05 July",
          status: "Black Soil Tracts",
          moisture: "75-95 mm",
          image: "/crops/cotton_bolls.jpg"
        },
        {
          id: "Bajra",
          name: "Bajra (Saburi)",
          category: "Kharif Millet",
          window: "15 June - 10 July",
          status: "Light Soil Specialist",
          moisture: "25-35 mm",
          image: "/crops/bajra_millet.jpg"
        },
        {
          id: "Maize",
          name: "Hybrid Sweet Corn / Maize",
          category: "Grain & Fodder",
          window: "15 June - 10 July",
          status: "High Vigor",
          moisture: "30-50 mm",
          image: "/crops/maize_corn_cobs.jpg"
        },
        {
          id: "Groundnut",
          name: "Groundnut (JL 24)",
          category: "Kharif Legume",
          window: "20 June - 05 July",
          status: "Well-Drained Loam",
          moisture: "30-40 mm",
          image: "/crops/groundnut_harvest.jpg"
        },
        {
          id: "Gram",
          name: "Gram (Vijay)",
          category: "Rabi Legume",
          window: "15 Oct - 10 Nov",
          status: "Low Water Need",
          moisture: "35-45 mm",
          image: "/crops/gram_chickpea.jpg"
        }
      ]
    },
    "Jalna": {
      state: "Marathwada",
      lat: 19.8410,
      lng: 75.8864,
      soil: "medium",
      temp: "28°C",
      weather: "Partly Sunny",
      rain7d: "2.6mm",
      humidity: "59%",
      crops: [
        {
          id: "Cotton",
          name: "Bt Cotton (Bollgard II)",
          category: "Black Soil Cash Crop",
          window: "20 June - 05 July",
          status: "Regional Dominance",
          moisture: "75-95 mm",
          image: "/crops/cotton_bolls.jpg"
        },
        {
          id: "Soybean",
          name: "Soybean (JS 335)",
          category: "Kharif Oilseed",
          window: "15 - 30 June",
          status: "High Sowing Area",
          moisture: "50-70 mm",
          image: "/crops/soybean_field.jpg"
        },
        {
          id: "Pigeonpea",
          name: "Pigeonpea / Tur (BSMR 736)",
          category: "Intercrop Pulse",
          window: "15 June - 05 July",
          status: "High Protein",
          moisture: "50-70 mm",
          image: "/crops/pigeonpea_tur.jpg"
        },
        {
          id: "Bajra",
          name: "Bajra (Shraddha)",
          category: "Kharif Millet",
          window: "15 June - 10 July",
          status: "Light Soil Specialist",
          moisture: "25-35 mm",
          image: "/crops/bajra_millet.jpg"
        },
        {
          id: "Gram",
          name: "Gram (Digvijay)",
          category: "Rabi Legume",
          window: "15 Oct - 10 Nov",
          status: "High Yielding",
          moisture: "35-50 mm",
          image: "/crops/gram_chickpea.jpg"
        }
      ]
    },
    "Beed": {
      state: "Marathwada",
      lat: 18.9891,
      lng: 75.7601,
      soil: "medium",
      temp: "29°C",
      weather: "Warm & Dry",
      rain7d: "1.7mm",
      humidity: "54%",
      crops: [
        {
          id: "Cotton",
          name: "Bt Cotton (Bollgard II)",
          category: "Black Soil Cash Crop",
          window: "20 June - 08 July",
          status: "Black Soil Tracts",
          moisture: "75-95 mm",
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
        },
        {
          id: "Pigeonpea",
          name: "Pigeonpea / Tur (Asha)",
          category: "Intercrop Pulse",
          window: "15 June - 05 July",
          status: "High Protein",
          moisture: "50-70 mm",
          image: "/crops/pigeonpea_tur.jpg"
        },
        {
          id: "Jowar",
          name: "Rabi Jowar (Maldandi)",
          category: "Rabi Grain",
          window: "15 Sept - 15 Oct",
          status: "Drought Resilient",
          moisture: "25-35 mm",
          image: "/crops/jowar_sorghum.jpg"
        },
        {
          id: "Bajra",
          name: "Bajra (Shraddha)",
          category: "Kharif Millet",
          window: "15 June - 10 July",
          status: "Light Soil Specialist",
          moisture: "25-35 mm",
          image: "/crops/bajra_millet.jpg"
        }
      ]
    },
    "Latur": {
      state: "Marathwada",
      lat: 18.4088,
      lng: 76.5604,
      soil: "medium",
      temp: "28°C",
      weather: "Clear Skies",
      rain7d: "2.9mm",
      humidity: "61%",
      crops: [
        {
          id: "Soybean",
          name: "Soybean (JS 335)",
          category: "Kharif Oilseed",
          window: "15 - 30 June",
          status: "Regional Dominance",
          moisture: "50-70 mm",
          image: "/crops/soybean_field.jpg"
        },
        {
          id: "Pigeonpea",
          name: "Pigeonpea / Tur (BSMR 736)",
          category: "Intercrop Pulse",
          window: "15 June - 05 July",
          status: "High Protein",
          moisture: "50-70 mm",
          image: "/crops/pigeonpea_tur.jpg"
        },
        {
          id: "Gram",
          name: "Gram (Vijay / Digvijay)",
          category: "Rabi Legume",
          window: "15 Oct - 10 Nov",
          status: "High Yielding",
          moisture: "35-50 mm",
          image: "/crops/gram_chickpea.jpg"
        },
        {
          id: "Jowar",
          name: "Rabi Jowar (Maldandi)",
          category: "Rabi Grain",
          window: "15 Sept - 15 Oct",
          status: "Drought Resilient",
          moisture: "25-35 mm",
          image: "/crops/jowar_sorghum.jpg"
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
    "Nanded": {
      state: "Marathwada",
      lat: 19.1383,
      lng: 77.3210,
      soil: "heavy",
      temp: "29°C",
      weather: "Partly Sunny",
      rain7d: "3.1mm",
      humidity: "63%",
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
          name: "Soybean (JS 335)",
          category: "Kharif Oilseed",
          window: "15 - 30 June",
          status: "High Sowing Area",
          moisture: "50-70 mm",
          image: "/crops/soybean_field.jpg"
        },
        {
          id: "Pigeonpea",
          name: "Pigeonpea / Tur (BSMR 736)",
          category: "Intercrop Pulse",
          window: "15 June - 05 July",
          status: "High Protein",
          moisture: "50-70 mm",
          image: "/crops/pigeonpea_tur.jpg"
        },
        {
          id: "Gram",
          name: "Gram (Digvijay)",
          category: "Rabi Legume",
          window: "15 Oct - 10 Nov",
          status: "High Yielding",
          moisture: "35-50 mm",
          image: "/crops/gram_chickpea.jpg"
        },
        {
          id: "Jowar",
          name: "Rabi Jowar (Maldandi)",
          category: "Rabi Grain",
          window: "15 Sept - 15 Oct",
          status: "Drought Resilient",
          moisture: "25-35 mm",
          image: "/crops/jowar_sorghum.jpg"
        }
      ]
    },
    "Chandrapur": {
      state: "Eastern Vidarbha",
      lat: 19.9615,
      lng: 79.2961,
      soil: "heavy",
      temp: "30°C",
      weather: "Warm & Dry",
      rain7d: "2.0mm",
      humidity: "55%",
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
          name: "Soybean (JS 335)",
          category: "Kharif Oilseed",
          window: "15 - 28 June",
          status: "High Sowing Area",
          moisture: "50-70 mm",
          image: "/crops/soybean_field.jpg"
        },
        {
          id: "Pigeonpea",
          name: "Pigeonpea / Tur (BSMR 736)",
          category: "Intercrop Pulse",
          window: "15 June - 05 July",
          status: "High Protein",
          moisture: "50-70 mm",
          image: "/crops/pigeonpea_tur.jpg"
        },
        {
          id: "Gram",
          name: "Gram (Jaki 9218)",
          category: "Rabi Legume",
          window: "15 Oct - 10 Nov",
          status: "Wilt Resistant",
          moisture: "35-45 mm",
          image: "/crops/gram_chickpea.jpg"
        },
        {
          id: "Wheat",
          name: "Lokwan Wheat",
          category: "Winter Grain",
          window: "05 - 25 Nov",
          status: "Cool Nights",
          moisture: "Pre-sown Irrigation",
          image: "/crops/wheat_golden.jpg"
        }
      ]
    }
  };

  const [selectedDistrict, setSelectedDistrict] = useState("Pune");
  const currentDistrictData = DISTRICT_CROPS[selectedDistrict] || DISTRICT_CROPS["Pune"];
  const [liveWeather, setLiveWeather] = useState(null);
  const [isClimateModalOpen, setIsClimateModalOpen] = useState(false);

  // Sync real-time satellite meteorology for the selected district from Open-Meteo
  useEffect(() => {
    let isMounted = true;
    const data = DISTRICT_CROPS[selectedDistrict] || DISTRICT_CROPS["Pune"];
    if (!data?.lat || !data?.lng) return;

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${data.lat}&longitude=${data.lng}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&daily=sunrise,sunset,precipitation_sum&timezone=auto&forecast_days=1`;

    fetch(url)
      .then(r => r.json())
      .then(res => {
        if (!isMounted || !res.current) return;
        const cur = res.current;
        const code = cur.weather_code;
        let weatherText = "Pleasant";
        if (code === 0) weatherText = "Clear Skies";
        else if (code === 1 || code === 2) weatherText = "Partly Sunny";
        else if (code === 3) weatherText = "Partly Cloudy";
        else if (code >= 51 && code <= 82) weatherText = "Rain / Showers";
        else if (code >= 95) weatherText = "Thunderstorm";
        else if (cur.temperature_2m >= 32) weatherText = "Sunny & Warm";

        const sunriseStr = res.daily?.sunrise?.[0]
          ? new Date(res.daily.sunrise[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : "06:08 am";
        const sunsetStr = res.daily?.sunset?.[0]
          ? new Date(res.daily.sunset[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : "06:36 pm";

        setLiveWeather({
          temp: `${Math.round(cur.temperature_2m)}°C`,
          humidity: `${Math.round(cur.relative_humidity_2m)}%`,
          wind: `${Math.round(cur.wind_speed_10m)} km/h`,
          rain: `${cur.precipitation || res.daily?.precipitation_sum?.[0] || 0}mm`,
          weatherText,
          weatherCode: code,
          sunrise: sunriseStr,
          sunset: sunsetStr
        });
      })
      .catch(err => {
        console.warn("Live weather fetch failed, using fallback:", err);
      });

    return () => { isMounted = false; };
  }, [selectedDistrict]);

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
      title: t.catDuration || "Duration", 
      badge: t.badgeSowing || "Sowing", 
      icon: Clock, 
      color: "text-blue-600", 
      bg: "bg-blue-50",
      action: onStartDecision
    },
    { 
      id: "return", 
      title: t.catReturn || "Return", 
      badge: t.badgeYield || "Yield", 
      icon: TrendingUp, 
      color: "text-emerald-600", 
      bg: "bg-emerald-50",
      action: () => onQuickPreset({ location: selectedDistrict, crop: currentDistrictData.crops[0]?.id || "Soybean", irrigation: true, soil: currentDistrictData.soil })
    },
    { 
      id: "risk", 
      title: t.catRisk || "Low Risk", 
      badge: t.badgeICAR || "ICAR Rule", 
      icon: ShieldCheck, 
      color: "text-amber-600", 
      bg: "bg-amber-50",
      action: onStartHarvest
    },
    { 
      id: "safety", 
      title: t.catSafety || "Safety", 
      badge: t.badgeShield || "Shield", 
      icon: Shield, 
      color: "text-teal-600", 
      bg: "bg-teal-50",
      action: () => onQuickHarvestPreset({ location: selectedDistrict, crop: currentDistrictData.crops[0]?.id || "Soybean", storage_available: true, days_ago: 105 })
    }
  ];

  const getLocalizedDistrict = (d) => {
    if (!d) return "";
    const map = {
      mr: {
        "Pune": "पुणे",
        "Nagpur": "नागपूर",
        "Nashik": "नाशिक",
        "Akola": "अकोला",
        "Solapur": "सोलापूर",
        "Chhatrapati Sambhajinagar": "छत्रपती संभाजीनगर",
        "Baramati": "बारामती",
        "Amravati": "अमरावती",
        "Yavatmal": "यवतमाळ",
        "Wardha": "वर्धा",
        "Buldhana": "बुलढाणा",
        "Kolhapur": "कोल्हापूर",
        "Satara": "सातारा",
        "Sangli": "सांगली",
        "Ahmednagar": "अहमदनगर",
        "Jalgaon": "जळगाव",
        "Dhule": "धुळे",
        "Jalna": "जालना",
        "Beed": "बीड",
        "Latur": "लातूर",
        "Nanded": "नांदेड",
        "Chandrapur": "चंद्रपूर"
      },
      hi: {
        "Pune": "पुणे",
        "Nagpur": "नागपुर",
        "Nashik": "नाशिक",
        "Akola": "अकोला",
        "Solapur": "सोलापुर",
        "Chhatrapati Sambhajinagar": "छत्रपति संभाजीनगर",
        "Baramati": "बारामती",
        "Amravati": "अमरावती",
        "Yavatmal": "यवतमाल",
        "Wardha": "वर्धा",
        "Buldhana": "बुलढाणा",
        "Kolhapur": "कोल्हापुर",
        "Satara": "सतारा",
        "Sangli": "सांगली",
        "Ahmednagar": "अहमदनगर",
        "Jalgaon": "जलगांव",
        "Dhule": "धुले",
        "Jalna": "जालना",
        "Beed": "बीड",
        "Latur": "लातूर",
        "Nanded": "नांदेड़",
        "Chandrapur": "चंद्रपुर"
      }
    };
    return map[language]?.[d] || d;
  };

  const getLocalizedRegion = (r) => {
    if (!r) return "";
    if (r.includes("Western")) return t.regWesternMaha || (language === "mr" ? "पश्चिम महाराष्ट्र" : language === "hi" ? "पश्चिम महाराष्ट्र" : r);
    if (r.includes("Central Vidarbha")) return t.regCentralVidarbha || (language === "mr" ? "मध्य विदर्भ" : language === "hi" ? "मध्य विदर्भ" : r);
    if (r.includes("Eastern Vidarbha")) return t.regEasternVidarbha || (language === "mr" ? "पूर्व विदर्भ" : language === "hi" ? "पूर्वी विदर्भ" : r);
    if (r.includes("Vidarbha")) return t.regVidarbha || (language === "mr" ? "विदर्भ विभाग" : language === "hi" ? "विदर्भ क्षेत्र" : r);
    if (r.includes("Khandesh")) return t.regKhandesh || (language === "mr" ? "खान्देश (उत्तर महाराष्ट्र)" : language === "hi" ? "खानदेश (उत्तर महाराष्ट्र)" : r);
    if (r.includes("North")) return t.regNorthMaha || (language === "mr" ? "उत्तर महाराष्ट्र" : language === "hi" ? "उत्तर महाराष्ट्र" : r);
    if (r.includes("Southern")) return t.regSouthMaha || (language === "mr" ? "दक्षिण महाराष्ट्र" : language === "hi" ? "दक्षिण महाराष्ट्र" : r);
    if (r.includes("Marathwada")) return t.regMarathwada || (language === "mr" ? "मराठवाडा" : language === "hi" ? "मराठवाड़ा" : r);
    return r;
  };

  const getLocalizedWeather = (w) => {
    if (!w) return "";
    if (w.includes("Partly Sunny")) return t.weatherPartlySunny || (language === "mr" ? "अंशतः सूर्यप्रकाश" : language === "hi" ? "आंशिक धूप" : w);
    if (w.includes("Sunny & Warm")) return t.weatherSunnyWarm || (language === "mr" ? "उष्ण व निरभ्र" : language === "hi" ? "उष्ण व साफ" : w);
    if (w.includes("Pleasant")) return t.weatherPleasant || (language === "mr" ? "आल्हाददायक हवामान" : language === "hi" ? "सुहावना मौसम" : w);
    if (w.includes("Warm & Dry")) return t.weatherWarmDry || (language === "mr" ? "उष्ण व कोरडे" : language === "hi" ? "गर्म व सूखा" : w);
    if (w.includes("Clear")) return t.weatherClearSkies || (language === "mr" ? "स्वच्छ आकाश" : language === "hi" ? "साफ आसमान" : w);
    if (w.includes("Partly Cloudy")) return t.weatherPartlyCloudy || (language === "mr" ? "अंशतः ढगाळ" : language === "hi" ? "आंशिक बादल" : w);
    return w;
  };

  const getLocalizedSoil = (s) => {
    if (!s) return "";
    const lower = s.toLowerCase();
    if (lower === "light") return language === "mr" ? "हलकी जमीन" : language === "hi" ? "हल्की मिट्टी" : "Light Soil";
    if (lower === "medium") return language === "mr" ? "मध्यम काळी" : language === "hi" ? "मध्यम काली" : "Medium Black";
    if (lower === "heavy") return language === "mr" ? "भारी काळी" : language === "hi" ? "भारी काली" : "Heavy Clay";
    return s;
  };

  const getLocalizedCropName = (crop) => {
    if (!crop) return "";
    const name = crop.name || crop.id;
    if (language === "mr") {
      if (name.includes("Soybean (JS 335)")) return "सोयाबीन (JS 335)";
      if (name.includes("Soybean (JS 9305)")) return "सोयाबीन (JS 9305)";
      if (name.includes("Soybean (JS 95-60)")) return "सोयाबीन (JS 95-60)";
      if (name.includes("Soybean (MACS 1407)")) return "सोयाबीन (MACS 1407)";
      if (name.includes("Soybean (Phule Sangam KDS 726)")) return "सोयाबीन (फुले संगम KDS 726)";
      if (name.includes("Soybean (Phule Sangam)")) return "सोयाबीन (फुले संगम)";
      if (name.includes("Durum Wheat (Sharbati)")) return "डुरम गहू (शरबती)";
      if (name.includes("Lokwan Wheat")) return "लोकवन गहू";
      if (name.includes("Groundnut (JL 24)")) return "भुईमूग (JL 24)";
      if (name.includes("Groundnut (TAG 24)")) return "भुईमूग (TAG 24)";
      if (name.includes("Bt Cotton (Bollgard II)")) return "बीटी कापूस (बोलगार्ड II)";
      if (name.includes("Bt Cotton (Ajeet 155 / Rasi)")) return "बीटी कापूस (अजित १५५ / राशी)";
      if (name.includes("Hybrid Cotton (Dr. PDKV)")) return "संकरित कापूस (डॉ. पंजाबराव देशमुख)";
      if (name.includes("Hybrid Sweet Corn / Maize")) return "मका (गोड / संकरित)";
      if (name.includes("Maize (African Tall / Pioneer)")) return "मका (आफ्रिकन टॉल / पायोनियर)";
      if (name.includes("Gram (Digvijay)")) return "हरभरा (दिग्विजय)";
      if (name.includes("Gram (Vijay / Digvijay)")) return "हरभरा (विजय / दिग्विजय)";
      if (name.includes("Gram (Vijay)")) return "हरभरा (विजय)";
      if (name.includes("Gram (Jaki 9218)")) return "हरभरा (जाकी ९२१८)";
      if (name.includes("Pigeonpea / Tur (BSMR 736)")) return "तूर (BSMR ७३६)";
      if (name.includes("Pigeonpea / Tur (Asha)")) return "तूर (आशा)";
      if (name.includes("Pigeonpea / Tur (Asha / BDN 711)")) return "तूर (आशा / BDN ७११)";
      if (name.includes("Pigeonpea / Tur (BSMR 853)")) return "तूर (BSMR ८५३)";
      if (name.includes("Rabi Jowar (Maldandi M 35-1)")) return "रब्बी ज्वारी (मालदांडी M ३५-१)";
      if (name.includes("Rabi Jowar (Maldandi)")) return "रब्बी ज्वारी (मालदांडी)";
      if (name.includes("Bajra (Shraddha / Saburi)")) return "बाजरी (श्रद्धा / सबुरी)";
      if (name.includes("Bajra (Shraddha)")) return "बाजरी (श्रद्धा)";
      if (name.includes("Bajra (Saburi)")) return "बाजरी (सबुरी)";
      if (crop.id === "Soybean") return "सोयाबीन";
      if (crop.id === "Cotton") return "कापूस";
      if (crop.id === "Maize") return "मका";
      if (crop.id === "Wheat") return "गहू";
      if (crop.id === "Groundnut") return "भुईमूग";
      if (crop.id === "Gram") return "हरभरा";
      if (crop.id === "Pigeonpea") return "तूर";
      if (crop.id === "Jowar") return "ज्वारी";
      if (crop.id === "Bajra") return "बाजरी";
    }
    if (language === "hi") {
      if (name.includes("Soybean (JS 335)")) return "सोयाबीन (JS 335)";
      if (name.includes("Soybean (JS 9305)")) return "सोयाबीन (JS 9305)";
      if (name.includes("Soybean (JS 95-60)")) return "सोयाबीन (JS 95-60)";
      if (name.includes("Soybean (MACS 1407)")) return "सोयाबीन (MACS 1407)";
      if (name.includes("Soybean (Phule Sangam KDS 726)")) return "सोयाबीन (फुले संगम KDS 726)";
      if (name.includes("Soybean (Phule Sangam)")) return "सोयाबीन (फुले संगम)";
      if (name.includes("Durum Wheat (Sharbati)")) return "डूरम गेहूं (शरबती)";
      if (name.includes("Lokwan Wheat")) return "लोकवन गेहूं";
      if (name.includes("Groundnut (JL 24)")) return "मूंगफली (JL 24)";
      if (name.includes("Groundnut (TAG 24)")) return "मूंगफली (TAG 24)";
      if (name.includes("Bt Cotton (Bollgard II)")) return "बीटी कपास (बोलगार्ड II)";
      if (name.includes("Bt Cotton (Ajeet 155 / Rasi)")) return "बीटी कपास (अजीत 155 / रासी)";
      if (name.includes("Hybrid Cotton (Dr. PDKV)")) return "संकरित कपास (डॉ. PDKV)";
      if (name.includes("Hybrid Sweet Corn / Maize")) return "मक्का (हाइब्रिड / स्वीट कॉर्न)";
      if (name.includes("Maize (African Tall / Pioneer)")) return "मक्का (अफ्रीकन टॉल / पायोनियर)";
      if (name.includes("Gram (Digvijay)")) return "चना (दिग्विजय)";
      if (name.includes("Gram (Vijay / Digvijay)")) return "चना (विजय / दिग्विजय)";
      if (name.includes("Gram (Vijay)")) return "चना (विजय)";
      if (name.includes("Gram (Jaki 9218)")) return "चना (जाकी 9218)";
      if (name.includes("Pigeonpea / Tur (BSMR 736)")) return "अरहर / तूर (BSMR 736)";
      if (name.includes("Pigeonpea / Tur (Asha)")) return "अरहर / तूर (आशा)";
      if (name.includes("Pigeonpea / Tur (Asha / BDN 711)")) return "अरहर / तूर (आशा / BDN 711)";
      if (name.includes("Pigeonpea / Tur (BSMR 853)")) return "अरहर / तूर (BSMR 853)";
      if (name.includes("Rabi Jowar (Maldandi M 35-1)")) return "रबी ज्वार (मालदांडी M 35-1)";
      if (name.includes("Rabi Jowar (Maldandi)")) return "रबी ज्वार (मालदांडी)";
      if (name.includes("Bajra (Shraddha / Saburi)")) return "बाजरा (श्रद्धा / सबुरी)";
      if (name.includes("Bajra (Shraddha)")) return "बाजरा (श्रद्धा)";
      if (name.includes("Bajra (Saburi)")) return "बाजरा (सबुरी)";
      if (crop.id === "Soybean") return "सोयाबीन";
      if (crop.id === "Cotton") return "कपास";
      if (crop.id === "Maize") return "मक्का";
      if (crop.id === "Wheat") return "गेहूं";
      if (crop.id === "Groundnut") return "मूंगफली";
      if (crop.id === "Gram") return "चना";
      if (crop.id === "Pigeonpea") return "अरहर / तूर";
      if (crop.id === "Jowar") return "ज्वार";
      if (crop.id === "Bajra") return "बाजरा";
    }
    return name;
  };

  const getLocalizedWindow = (w) => {
    if (!w) return "";
    if (language === "mr") {
      return w
        .replace(/June/gi, "जून")
        .replace(/July/gi, "जुलै")
        .replace(/Sept|September/gi, "सप्टेंबर")
        .replace(/Nov/gi, "नोव्हेंबर")
        .replace(/Oct/gi, "ऑक्टोबर");
    }
    if (language === "hi") {
      return w
        .replace(/June/gi, "जून")
        .replace(/July/gi, "जुलाई")
        .replace(/Sept|September/gi, "सितंबर")
        .replace(/Nov/gi, "नवंबर")
        .replace(/Oct/gi, "अक्टूबर");
    }
    return w;
  };

  const getLocalizedMoisture = (m) => {
    if (!m) return "";
    if (language === "mr") {
      return m
        .replace("Residual / Canal", "कालवा / ओलावा")
        .replace("Pre-sown Irrigation", "पेरणीपूर्व सिंचन")
        .replace(/mm/gi, "मिमी");
    }
    if (language === "hi") {
      return m
        .replace("Residual / Canal", "नहर / संरक्षित नमी")
        .replace("Pre-sown Irrigation", "बुवाई पूर्व सिंचाई")
        .replace(/mm/gi, "मिमी");
    }
    return m;
  };

  const getLocalizedStatus = (status) => {
    if (!status) return "";
    const map = {
      mr: {
        "High Sowing Area": "प्रमुख पेरणी क्षेत्र",
        "Irrigated Plots": "बागायत क्षेत्र",
        "High Yielding": "अधिक उत्पादन देणारे",
        "Well-Drained Loam": "निचरा होणारी जमीन",
        "Drought Resilient": "दुष्काळ सहनशील",
        "Regional Dominance": "प्रादेशिक मुख्य पीक",
        "Short Duration": "कमी कालावधी वाण",
        "Residual Moisture": "ओलाव्यावर येणारे",
        "Cool Nights": "थंड हवामान",
        "High Vigor": "जोमदार वाढ",
        "Optimal Rain": "योग्य पाऊस",
        "Light Soil Specialist": "हलक्या जमिनीत उत्तम",
        "Deep Black Regur": "काळी कसदार जमीन",
        "Fast Ripening": "जलद पक्व होणारे",
        "Wilt Resistant": "मर रोग प्रतिकारक",
        "Low Water Need": "कमी पाण्याची गरज",
        "Dryland Pulse": "कोरडवाहू कडधान्य",
        "Black Soil Tracts": "काळी जमीन पट्टा",
        "Monsoon Dependent": "पावसावर अवलंबून"
      },
      hi: {
        "High Sowing Area": "प्रमुख बुवाई क्षेत्र",
        "Irrigated Plots": "सिंचित क्षेत्र",
        "High Yielding": "उच्च उपज देने वाली",
        "Well-Drained Loam": "उचित जल निकासी",
        "Drought Resilient": "सूखा सहनशील",
        "Regional Dominance": "क्षेत्रीय मुख्य फसल",
        "Short Duration": "कम अवधि की किस्म",
        "Residual Moisture": "संरक्षित नमी पर",
        "Cool Nights": "ठंडा मौसम",
        "High Vigor": "तीव्र विकास",
        "Optimal Rain": "अनुकूल बारिश",
        "Light Soil Specialist": "हल्की मिट्टी में उत्तम",
        "Deep Black Regur": "काली उपजाऊ मिट्टी",
        "Fast Ripening": "जल्दी पकने वाली",
        "Wilt Resistant": "उकठा रोग प्रतिरोधी",
        "Low Water Need": "कम पानी की आवश्यकता",
        "Dryland Pulse": "शुष्क क्षेत्र दलहन",
        "Black Soil Tracts": "काली मिट्टी क्षेत्र",
        "Monsoon Dependent": "वर्षा आधारित"
      }
    };
    return map[language]?.[status] || status;
  };

  const getLocalizedCategory = (cat) => {
    if (!cat) return "";
    const map = {
      mr: {
        "Kharif Oilseed": "खरीप गळीत धान्य",
        "Rabi Cereal": "रब्बी धान्य",
        "Rabi Legume": "रब्बी कडधान्य",
        "Kharif Legume": "खरीप कडधान्य",
        "Rabi Grain": "रब्बी तृणधान्य",
        "Black Soil Cash Crop": "काळी जमीन नगदी पीक",
        "Early Kharif": "हंगाम पूर्व खरीप",
        "Intercrop Pulse": "आंतरपीक कडधान्य",
        "Grain & Fodder": "धान्य व चारा",
        "Winter Grain": "हिवाळी धान्य",
        "High Protein": "उच्च प्रथिने",
        "Kharif Millet": "खरीप भरडधान्य (मिलेट्स)",
        "Rainfed Cotton": "जिरायती कापूस",
        "Drought Tolerant": "कमी पाण्यावर येणारे",
        "Semi-Arid Legume": "निम-कोरडवाहू कडधान्य",
        "Fodder & Grain": "चारा व धान्य",
        "Cash Crop": "नगदी पीक",
        "Kharif Staple": "खरीप मुख्य पीक"
      },
      hi: {
        "Kharif Oilseed": "खरीफ तिलहन",
        "Rabi Cereal": "रबी खाद्यान्न",
        "Rabi Legume": "रबी दलहन",
        "Kharif Legume": "खरीफ दलहन",
        "Rabi Grain": "रबी अनाज",
        "Black Soil Cash Crop": "काली मिट्टी नकदी फसल",
        "Early Kharif": "अगेती खरीफ",
        "Intercrop Pulse": "इंटरक्रॉप दलहन",
        "Grain & Fodder": "अनाज व चारा",
        "Winter Grain": "शीतकालीन अनाज",
        "High Protein": "उच्च प्रोटीन",
        "Kharif Millet": "खरीफ मिलेट्स / बाजरा",
        "Rainfed Cotton": "वर्षा आधारित कपास",
        "Drought Tolerant": "सूखा सहनशील",
        "Semi-Arid Legume": "अर्ध-शुष्क दलहन",
        "Fodder & Grain": "चारा व अनाज",
        "Cash Crop": "नकदी फसल",
        "Kharif Staple": "खरीफ मुख्य फसल"
      }
    };
    return map[language]?.[cat] || cat;
  };

  return (
    <div className="w-full max-w-xl mx-auto pb-24 font-sans text-slate-800 antialiased">
      
      {/* 1. TOP CURVED EMERALD HEADER */}
      <div className="bg-[#0B4628] text-white pt-6 pb-20 px-6 rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Greeting, Clickable Profile Avatar & Language Switcher */}
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-2xl font-black tracking-tight text-white">
              {getGreeting()}{currentUser?.name ? `, ${currentUser.name.split(" ")[0]}` : ""}
            </h2>
            <div className="flex items-center gap-2 text-emerald-200/90 text-[11px] font-semibold mt-1">
              <span>{formattedDate}</span>
              <span className="text-emerald-400/80">•</span>
              <span className="font-mono bg-emerald-950/50 px-1.5 py-0.5 rounded-md border border-emerald-500/20 text-emerald-200 text-[10px] font-bold">
                {formattedTime}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {!currentUser && onOpenAuth && (
              <button
                type="button"
                onClick={() => onOpenAuth("login")}
                className="px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/25 border border-emerald-400/30 text-white text-[11px] font-bold backdrop-blur-md transition cursor-pointer"
              >
                Sign In
              </button>
            )}
            {setLanguage && (
              <LanguageSelector
                language={language}
                setLanguage={setLanguage}
                variant="pill"
              />
            )}
            <button
              type="button"
              onClick={onOpenNotifications}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-white/20 border border-emerald-400/40 backdrop-blur-md shadow-md flex items-center justify-center text-white relative hover:scale-105 active:scale-95 transition cursor-pointer shrink-0"
              title={t.notificationsTitle || "Farm Notifications & Alerts"}
            >
              <Bell className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-emerald-200" />
              {unreadNotificationCount > 0 && (
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute top-1.5 right-1.5 ring-2 ring-[#0B4628] animate-pulse" />
              )}
            </button>
            <button 
              onClick={onGoToProfile || onGoToHistory}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-emerald-400/60 overflow-hidden shadow-md bg-emerald-900 flex items-center justify-center cursor-pointer hover:scale-105 transition shrink-0 relative"
              title="View Profile & Farmer Account"
            >
              <img 
                src="/farmer_avatar.svg" 
                alt="Farmer Profile" 
                className="w-full h-full object-cover"
              />
              {currentUser?.isVerified && (
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-[#0B4628] absolute bottom-0.5 right-0.5" />
              )}
            </button>
          </div>
        </div>

        {/* District Selector Dropdown & Search Bar */}
        <div className="mt-5 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-emerald-200 font-bold px-1">
            <span>{t.selectDistrict || "Select Maharashtra Agricultural District:"}</span>
            <span className="text-[10px] bg-emerald-700/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
              {getLocalizedRegion(currentDistrictData.state)}
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
                  {getLocalizedDistrict(dist)} ({getLocalizedRegion(DISTRICT_CROPS[dist].state)})
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
                <span>{getLocalizedDistrict(selectedDistrict)}, {getLocalizedRegion(currentDistrictData.state)}</span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                  {liveWeather?.temp || currentDistrictData.temp}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  {liveWeather?.weatherText ? getLocalizedWeather(liveWeather.weatherText) : getLocalizedWeather(currentDistrictData.weather)}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>{t.liveSatelliteRadar || "Live Satellite Radar"}</span>
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
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">{t.humidity || "Humidity"}</span>
              <span className="text-xs sm:text-sm font-black text-slate-800 mt-0.5 block">{liveWeather?.humidity || currentDistrictData.humidity}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">{t.rain7d || "Precip"}</span>
              <span className="text-xs sm:text-sm font-black text-slate-800 mt-0.5 block">{liveWeather?.rain || currentDistrictData.rain7d}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">{t.soilType || "Soil Type"}</span>
              <span className="text-xs sm:text-sm font-black text-emerald-700 uppercase mt-0.5 block">{getLocalizedSoil(currentDistrictData.soil)}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">{t.wind || "Wind"}</span>
              <span className="text-xs sm:text-sm font-black text-slate-800 mt-0.5 block">{liveWeather?.wind || "12 km/h"}</span>
            </div>
          </div>

          {/* Sunrise / Sunset Arc Indicator */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <div className="text-left">
              <span className="text-slate-800 font-black text-xs block">{liveWeather?.sunrise || "06:08 am"}</span>
              <span className="text-[10px] text-slate-400 font-bold">{t.sunrise || "Sunrise"}</span>
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
              <span className="text-slate-800 font-black text-xs block">{liveWeather?.sunset || "06:36 pm"}</span>
              <span className="text-[10px] text-slate-400 font-bold">{t.sunset || "Sunset"}</span>
            </div>
          </div>

          {/* Climate Change & Resilience Button */}
          <button
            type="button"
            onClick={() => setIsClimateModalOpen(true)}
            className="w-full pt-3 mt-1 border-t border-slate-100 flex items-center justify-between group cursor-pointer text-left"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-100 transition shrink-0">
                <Globe2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <span className="text-xs font-black text-slate-800 block group-hover:text-emerald-700 transition">
                  {t.climateResiliencePill || "Climate Change & Resilience Insights"}
                </span>
                <span className="text-[10px] text-slate-400 font-bold block">
                  ICAR-CRIDA Microclimate & Delayed Monsoon Guide
                </span>
              </div>
            </div>
            <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 group-hover:bg-emerald-100 transition shrink-0">
              ICAR →
            </span>
          </button>

        </div>
      </div>

      {/* 3. INVEST BY CATEGORY */}
      <div className="px-6 mt-8 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-slate-900 tracking-tight">{t.decisionModesTitle || "Decision Advisory Modes"}</h3>
          <span className="text-xs font-bold text-emerald-700 cursor-pointer hover:underline">{t.instantGuide || "Instant Guide"}</span>
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
              {t.cropsGrownIn || "Crops Grown in"} {getLocalizedDistrict(selectedDistrict)}
            </h3>
            <span className="text-[11px] text-slate-500 font-medium">
              {language === "mr" 
                ? `${getLocalizedDistrict(selectedDistrict)}च्या जमिनीनुसार व पावसाच्या अंदाजानुसार` 
                : language === "hi" 
                ? `${getLocalizedDistrict(selectedDistrict)} की मिट्टी और बारिश के अनुकूलित` 
                : (t.calibratedTo || "Calibrated to soil & rainfall")}
            </span>
          </div>
          <button 
            onClick={onStartDecision} 
            className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-0.5"
          >
            {t.allCrops || "All Crops"} <ArrowRight className="w-3 h-3" />
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
                  {getLocalizedStatus(crop.status)}
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">{getLocalizedCategory(crop.category)}</span>
                  <h4 className="text-sm font-black text-slate-900 mt-0.5">{getLocalizedCropName(crop)}</h4>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                  <div>
                    <span className="text-[10px] block text-slate-400">{t.sowingWindow || "Sowing Window"}</span>
                    <span className="font-bold text-slate-800">{getLocalizedWindow(crop.window)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] block text-slate-400">{t.rainThreshold || "Rain Threshold"}</span>
                    <span className="font-bold text-emerald-700">{getLocalizedMoisture(crop.moisture)}</span>
                  </div>
                </div>

                <button className="w-full py-2.5 rounded-xl bg-[#0B4628] hover:bg-[#0F5E37] text-white text-xs font-bold transition shadow-sm flex items-center justify-center gap-1">
                  <span>{t.btnCheckSowing || "Assess Sowing ->"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. CLIMATE RESILIENCE & ADAPTATION MODAL */}
      <ClimateResilienceModal
        isOpen={isClimateModalOpen}
        onClose={() => setIsClimateModalOpen(false)}
        districtName={getLocalizedDistrict(selectedDistrict)}
        liveTemp={liveWeather?.temp || currentDistrictData.temp}
        liveHumidity={liveWeather?.humidity || currentDistrictData.humidity}
        liveRain={liveWeather?.rain || currentDistrictData.rain7d}
        liveWind={liveWeather?.wind || "12 km/h"}
        language={language}
        onAssessSowing={onStartDecision}
      />

    </div>
  );
}
