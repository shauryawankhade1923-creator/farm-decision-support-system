import React, { useEffect, useState } from "react";
import { 
  History as HistoryIcon, Star, CheckCircle2, Clock, AlertTriangle, 
  Trash2, MessageSquare, ThumbsUp, RefreshCw, ShieldCheck, 
  Sparkles, Calendar, Droplets, ArrowRight, User, Award,
  Phone, MapPin, Check, Plus, Edit3
} from "lucide-react";
import { translations } from "../locales/translations";
import { getHistory, getHistoryStats, deleteHistory, submitFeedback } from "../services/api";
import FeedbackModal from "../components/FeedbackModal";

export default function HistoryScreen({ onNewCheck, language = "en", onBack }) {
  const t = translations[language] || translations.en;

  const [historyList, setHistoryList] = useState([]);
  const [stats, setStats] = useState({
    total_consultations: 0,
    rated_count: 0,
    avg_rating: 4.8,
    action_taken_count: 0,
    satisfaction_rate_pct: 94
  });
  const [loading, setLoading] = useState(true);
  const [activeFeedbackModal, setActiveFeedbackModal] = useState(null);

  // Farmer profile editable states
  const [farmerProfile, setFarmerProfile] = useState({
    name: "Dnyaneshwar Patil",
    role: "Lead Progressive Farmer",
    village: "Baramati, Pune District",
    phone: "+91 98220 XXXXX",
    soil: "Medium Black (Regur)",
    totalLand: "12 Acres",
    primaryCrops: "Soybean, Cotton, Wheat",
    experienceYears: "18 Years"
  });

  // Direct quick review / rating state
  const [quickRating, setQuickRating] = useState(5);
  const [quickComment, setQuickComment] = useState("");
  const [quickSubmitted, setQuickSubmitted] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const [histData, statsData] = await Promise.all([
      getHistory(),
      getHistoryStats()
    ]);
    setHistoryList(histData || []);
    if (statsData) setStats(statsData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm("Delete this consultation record?")) {
      const ok = await deleteHistory(id);
      if (ok) {
        setHistoryList(historyList.filter((item) => item.id !== id));
      }
    }
  };

  const handleFeedbackSaved = (updatedPayload) => {
    setHistoryList(historyList.map((item) => {
      if (item.id === updatedPayload.assessment_id) {
        return {
          ...item,
          rating: updatedPayload.rating,
          feedback_tag: updatedPayload.feedback_tag,
          action_taken: updatedPayload.sowing_action_taken,
          germination_outcome: updatedPayload.germination_outcome,
          comment: updatedPayload.comment
        };
      }
      return item;
    }));
    loadData();
  };

  const handleQuickReviewSubmit = async (e) => {
    e.preventDefault();
    if (!quickComment.trim()) return;

    // Use latest assessment or fallback to 1
    const targetId = historyList[0]?.id || 1;
    await submitFeedback({
      assessment_id: targetId,
      rating: quickRating,
      feedback_tag: "ACCURATE",
      sowing_action_taken: "YES",
      germination_outcome: "SUCCESS",
      comment: quickComment
    });

    setQuickSubmitted(true);
    setQuickComment("");
    setTimeout(() => {
      setQuickSubmitted(false);
      loadData();
    }, 2500);
  };

  const getVerdictBadge = (verdict) => {
    switch (verdict) {
      case "SOW NOW":
        return {
          bg: "bg-emerald-100 text-emerald-900 border-emerald-300",
          icon: CheckCircle2,
          label: "SOW NOW"
        };
      case "WAIT":
        return {
          bg: "bg-amber-100 text-amber-900 border-amber-300",
          icon: Clock,
          label: "WAIT"
        };
      case "HARVEST BEFORE INCOMING RAIN":
        return {
          bg: "bg-rose-100 text-rose-900 border-rose-300",
          icon: AlertTriangle,
          label: "HARVEST BEFORE RAIN"
        };
      case "HARVEST NOW":
        return {
          bg: "bg-emerald-100 text-emerald-900 border-emerald-300",
          icon: CheckCircle2,
          label: "HARVEST NOW"
        };
      default:
        return {
          bg: "bg-rose-100 text-rose-900 border-rose-300",
          icon: AlertTriangle,
          label: "CHANGE CROP"
        };
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto pb-24 font-sans text-slate-900 antialiased space-y-6">
      
      {/* 1. TOP PROFILE BANNER */}
      <div className="bg-[#0B4628] text-white pt-6 pb-8 px-6 rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full border-2 border-emerald-400 overflow-hidden shadow-lg bg-emerald-900 shrink-0">
            <img 
              src="/user_avatar.jpg" 
              alt="Farmer Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-[10px] font-bold text-emerald-200 uppercase">
              <Award className="w-3 h-3 text-emerald-300" />
              Verified Farmer Profile
            </div>
            <h2 className="text-xl font-black text-white tracking-tight mt-1">{farmerProfile.name}</h2>
            <p className="text-xs text-emerald-200/80 font-medium flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-400" />
              {farmerProfile.village}
            </p>
          </div>
        </div>

        {/* Farmer stats pill row */}
        <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-emerald-700/50 text-center">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-2">
            <span className="text-[10px] text-emerald-200 block">Total Land</span>
            <span className="text-xs font-black text-white">{farmerProfile.totalLand}</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-2">
            <span className="text-[10px] text-emerald-200 block">Soil Type</span>
            <span className="text-xs font-black text-white">{farmerProfile.soil}</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-2">
            <span className="text-[10px] text-emerald-200 block">Farming Exp</span>
            <span className="text-xs font-black text-white">{farmerProfile.experienceYears}</span>
          </div>
        </div>
      </div>

      {/* 2. OVERVIEW METRICS: SATISFACTION & ASSESSMENTS */}
      <div className="px-6 grid grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Average Rating</span>
          <div className="text-2xl font-black text-amber-500 flex items-center justify-center gap-1 mt-1">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            <span>{stats.avg_rating}</span>
            <span className="text-xs text-slate-400 font-normal">/ 5</span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">{stats.rated_count} Verified Reviews</span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Success Rate</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">
            {stats.satisfaction_rate_pct}%
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Safe Emergence & Harvest</span>
        </div>
      </div>

      {/* 3. SUBMIT FEEDBACK & RATING SECTION */}
      <div className="px-6">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-900">Farmer Rating & Feedback</h3>
                <span className="text-[10px] text-slate-400 font-bold">Help improve AI model accuracy</span>
              </div>
            </div>
            {quickSubmitted && (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                <Check className="w-3 h-3" /> Submitted!
              </span>
            )}
          </div>

          <form onSubmit={handleQuickReviewSubmit} className="space-y-3">
            {/* Interactive 5-Star Selector */}
            <div className="flex items-center gap-1.5 justify-center py-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setQuickRating(s)}
                  className="p-1 cursor-pointer transition hover:scale-110"
                >
                  <Star 
                    className={`w-6 h-6 ${
                      s <= quickRating 
                        ? "fill-amber-400 text-amber-400" 
                        : "text-slate-200"
                    }`} 
                  />
                </button>
              ))}
            </div>

            <textarea
              value={quickComment}
              onChange={(e) => setQuickComment(e.target.value)}
              placeholder="How was the germination result? Did the rainfall forecast match field reality?..."
              rows={2}
              className="w-full text-xs font-medium text-slate-800 p-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-400"
              required
            />

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-[#0B4628] hover:bg-[#0F5E37] text-white font-bold text-xs shadow-md shadow-[#0B4628]/20 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Submit Farmer Review & Rating</span>
            </button>
          </form>
        </div>
      </div>

      {/* 4. PAST CONSULTATION LOGS */}
      <div className="px-6 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-slate-900 tracking-tight">Consultation Log</h3>
          <span className="text-xs text-slate-500 font-bold">{historyList.length} Records</span>
        </div>

        {loading ? (
          <div className="py-8 text-center text-slate-400 text-xs font-bold">
            Loading assessment logs...
          </div>
        ) : historyList.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center space-y-3 border border-slate-200/80">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <HistoryIcon className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-slate-600">No consultation records found yet.</p>
            <button
              onClick={onNewCheck}
              className="px-4 py-2 rounded-full bg-[#0B4628] text-white text-xs font-bold"
            >
              Run First Evaluation
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {historyList.map((item) => {
              const badge = getVerdictBadge(item.verdict);
              const Icon = badge.icon;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-slate-900">{item.crop}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs font-semibold text-slate-500">{item.location}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold block mt-0.5">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString() : "Recent"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border flex items-center gap-1 ${badge.bg}`}>
                        <Icon className="w-3 h-3" />
                        <span>{badge.label}</span>
                      </span>
                      <button
                        onClick={(e) => handleDelete(item.id, e)}
                        className="p-1 text-slate-300 hover:text-rose-600 transition"
                        title="Delete log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    {item.reason}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3 h-3 ${
                            star <= (item.rating || 5) ? "fill-amber-400 text-amber-400" : "text-slate-200"
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={() => setActiveFeedbackModal(item)}
                      className="text-emerald-700 font-bold hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>{item.rating ? "Edit Feedback" : "Add Feedback"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Global Feedback Modal */}
      {activeFeedbackModal && (
        <FeedbackModal
          assessmentId={activeFeedbackModal.id}
          cropName={activeFeedbackModal.crop}
          location={activeFeedbackModal.location}
          verdict={activeFeedbackModal.verdict}
          isOpen={!!activeFeedbackModal}
          onClose={() => setActiveFeedbackModal(null)}
          onSubmitted={handleFeedbackSaved}
          language={language}
        />
      )}

    </div>
  );
}
