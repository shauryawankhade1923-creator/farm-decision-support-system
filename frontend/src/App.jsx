import React, { useState } from "react";
import HomeScreen from "./screens/HomeScreen";
import FarmDetailsScreen from "./screens/FarmDetailsScreen";
import HarvestDetailsScreen from "./screens/HarvestDetailsScreen";
import DecisionScreen from "./screens/DecisionScreen";
import ExplanationScreen from "./screens/ExplanationScreen";
import CompareOptionsScreen from "./screens/CompareOptionsScreen";
import SavedFieldsScreen from "./screens/SavedFieldsScreen";
import HistoryScreen from "./screens/HistoryScreen";
import BottomBar from "./components/BottomBar";
import LanguageSelector from "./components/LanguageSelector";
import { Globe } from "lucide-react";
import FeedbackModal from "./components/FeedbackModal";
import { checkDecision, checkHarvestDecision, saveField } from "./services/api";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("home"); // "home" | "farm_details" | "harvest_details" | "decision" | "compare" | "saved_fields" | "history"
  const [flowMode, setFlowMode] = useState("sowing"); // "sowing" | "harvest"
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [language, setLanguageState] = useState(() => {
    try {
      return localStorage.getItem("app_language") || "en";
    } catch {
      return "en";
    }
  });

  const setLanguage = (newLang) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem("app_language", newLang);
    } catch (e) {
      console.error(e);
    }
  };
  const [isLoading, setIsLoading] = useState(false);
  const [decision, setDecision] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const todayStr = new Date().toISOString().split("T")[0];
  const defaultHarvestDate = new Date();
  defaultHarvestDate.setDate(defaultHarvestDate.getDate() - 100);
  const defaultHarvestDateStr = defaultHarvestDate.toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    location: "Pune",
    lat: 18.5204,
    lng: 73.8567,
    crop: "Soybean",
    intended_sowing_date: todayStr,
    irrigation_available: false,
    soil_type: "medium",
    field_prepared: true,
    land_size_acres: 3.0
  });

  const [harvestFormData, setHarvestFormData] = useState({
    location: "Pune",
    lat: 18.5204,
    lng: 73.8567,
    crop: "Soybean",
    actual_sowing_date: defaultHarvestDateStr,
    storage_available: false
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const runDecisionApi = async (dataToSubmit) => {
    setIsLoading(true);
    setFlowMode("sowing");
    try {
      const payload = {
        ...dataToSubmit,
        language
      };
      const result = await checkDecision(payload);
      setDecision(result);
      setCurrentScreen("decision");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      alert("Could not connect to decision engine. Make sure the FastAPI backend is running on http://localhost:8000.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const runHarvestDecisionApi = async (dataToSubmit) => {
    setIsLoading(true);
    setFlowMode("harvest");
    try {
      const payload = {
        ...dataToSubmit,
        language
      };
      const result = await checkHarvestDecision(payload);
      setDecision(result);
      setCurrentScreen("decision");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      alert("Could not connect to harvest decision engine. Make sure the FastAPI backend is running on http://localhost:8000.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitDecision = () => {
    runDecisionApi(formData);
  };

  const handleQuickPreset = (preset) => {
    const updated = {
      ...formData,
      location: preset.location,
      crop: preset.crop,
      irrigation_available: preset.irrigation,
      soil_type: preset.soil,
      intended_sowing_date: todayStr,
      field_prepared: true
    };
    setFormData(updated);
    runDecisionApi(updated);
  };

  const handleSelectSavedField = (f) => {
    const updated = {
      ...formData,
      location: f.location,
      lat: f.lat,
      lng: f.lng,
      crop: f.crop,
      soil_type: f.soil_type,
      irrigation_available: f.irrigation_available,
      field_prepared: f.field_prepared,
      land_size_acres: f.land_size_acres,
      intended_sowing_date: todayStr
    };
    setFormData(updated);
    runDecisionApi(updated);
  };

  const handleSaveFieldProfile = async () => {
    if (!formData.location || !formData.crop) return;
    const name = `${formData.location} - ${formData.crop} (${formData.soil_type})`;
    const res = await saveField({
      name,
      location: formData.location,
      lat: formData.lat || 18.5204,
      lng: formData.lng || 73.8567,
      crop: formData.crop,
      soil_type: formData.soil_type,
      irrigation_available: formData.irrigation_available,
      field_prepared: formData.field_prepared,
      land_size_acres: formData.land_size_acres
    });
    if (res) {
      showToast("Field profile successfully saved to database!");
    } else {
      showToast("Could not save profile to backend.");
    }
  };

  const handleQuickHarvestPreset = (preset) => {
    const d = new Date();
    d.setDate(d.getDate() - (preset.days_ago || 100));
    const updated = {
      ...harvestFormData,
      location: preset.location,
      crop: preset.crop,
      storage_available: preset.storage_available,
      actual_sowing_date: d.toISOString().split("T")[0]
    };
    setHarvestFormData(updated);
    runHarvestDecisionApi(updated);
  };

  const navigateTo = (screenId) => {
    if (screenId === "harvest_details") {
      setFlowMode("harvest");
      setHarvestFormData((prev) => ({
        ...prev,
        crop: formData.crop || prev.crop,
        location: formData.location || prev.location
      }));
    } else if (screenId === "farm_details") {
      setFlowMode("sowing");
    }
    setCurrentScreen(screenId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#F4F6F5] text-slate-900 flex justify-center font-sans antialiased">
      {/* Centered mobile-app frame container */}
      <div className="w-full max-w-xl min-h-screen bg-[#F4F6F5] shadow-2xl relative flex flex-col justify-between">
        
        <main className="flex-1 pb-16">
          {currentScreen === "home" && (
            <HomeScreen
              onStartDecision={() => navigateTo("farm_details")}
              onStartHarvest={() => navigateTo("harvest_details")}
              onQuickPreset={handleQuickPreset}
              onQuickHarvestPreset={handleQuickHarvestPreset}
              onGoToHistory={() => navigateTo("history")}
              onGoToSaved={() => navigateTo("saved_fields")}
              setFormData={setFormData}
              language={language}
              setLanguage={setLanguage}
            />
          )}

          {currentScreen === "farm_details" && (
            <FarmDetailsScreen
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmitDecision}
              isLoading={isLoading}
              language={language}
              onBack={() => navigateTo("home")}
            />
          )}

          {currentScreen === "harvest_details" && (
            <HarvestDetailsScreen
              harvestFormData={harvestFormData}
              setHarvestFormData={setHarvestFormData}
              onSubmit={() => runHarvestDecisionApi(harvestFormData)}
              isLoading={isLoading}
              language={language}
              onBack={() => navigateTo("home")}
            />
          )}

          {currentScreen === "decision" && (
            <DecisionScreen
              decision={decision}
              farmerInput={flowMode === "harvest" ? harvestFormData : formData}
              flowMode={flowMode}
              onGoToWhy={() => navigateTo("explanation")}
              onGoToCompare={() => navigateTo("compare")}
              onSaveField={handleSaveFieldProfile}
              onNewCheck={() => navigateTo(flowMode === "harvest" ? "harvest_details" : "farm_details")}
              onOpenFeedback={() => setIsFeedbackModalOpen(true)}
              language={language}
              onBack={() => navigateTo("home")}
            />
          )}

          {currentScreen === "explanation" && (
            <ExplanationScreen
              decision={decision}
              farmerInput={flowMode === "harvest" ? harvestFormData : formData}
              flowMode={flowMode}
              onBack={() => navigateTo("decision")}
              onGoToCompare={() => navigateTo("compare")}
              language={language}
            />
          )}

          {currentScreen === "compare" && (
            <CompareOptionsScreen
              decision={decision}
              farmerInput={flowMode === "harvest" ? harvestFormData : formData}
              flowMode={flowMode}
              onBack={() => navigateTo("decision")}
              onNewCheck={() => navigateTo(flowMode === "harvest" ? "harvest_details" : "farm_details")}
              onGoToWhy={() => navigateTo("explanation")}
              language={language}
            />
          )}

          {currentScreen === "saved_fields" && (
            <SavedFieldsScreen
              onSelectField={handleSelectSavedField}
              onNewCheck={() => navigateTo("farm_details")}
              language={language}
              onBack={() => navigateTo("home")}
            />
          )}

          {currentScreen === "history" && (
            <HistoryScreen
              onNewCheck={() => navigateTo(flowMode === "harvest" ? "harvest_details" : "farm_details")}
              language={language}
              onBack={() => navigateTo("home")}
            />
          )}
        </main>

        {/* 4-Tab Bottom Navigation Bar matching Screen 1 */}
        <BottomBar
          currentScreen={currentScreen}
          onNavigate={navigateTo}
          flowMode={flowMode}
          language={language}
        />

        {/* Global Farmer Feedback Modal */}
        {isFeedbackModalOpen && decision && (
          <FeedbackModal
            assessmentId={decision.assessment_id || 1}
            cropName={formData.crop}
            location={formData.location}
            verdict={decision.verdict}
            isOpen={isFeedbackModalOpen}
            onClose={() => setIsFeedbackModalOpen(false)}
            onSubmitted={() => showToast("Feedback and germination outcome recorded!")}
            language={language}
          />
        )}

        {/* Floating Quick Language Switcher for secondary screens */}
        {currentScreen !== "home" && (
          <button
            type="button"
            onClick={() => setIsLanguageModalOpen(true)}
            className="fixed top-4 right-4 z-40 bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-md px-3 py-1.5 rounded-full text-xs font-black text-slate-800 flex items-center gap-1.5 hover:bg-white hover:scale-105 transition cursor-pointer"
            title="Change Language / भाषा बदला / भाषा बदलें"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span>{language === "mr" ? "मराठी" : language === "hi" ? "हिंदी" : "English"}</span>
          </button>
        )}

        {/* Global Language Modal */}
        <LanguageSelector
          language={language}
          setLanguage={setLanguage}
          variant="modal"
          isOpen={isLanguageModalOpen}
          onClose={() => setIsLanguageModalOpen(false)}
        />

        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 text-xs font-bold flex items-center gap-2">
            <span>{toastMessage}</span>
          </div>
        )}

      </div>
    </div>
  );
}
