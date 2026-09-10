import React, { useState } from "react";
import { Star, X, CheckCircle2, ThumbsUp, AlertCircle, Sparkles } from "lucide-react";
import { translations } from "../locales/translations";
import { submitFeedback } from "../services/api";

export default function FeedbackModal({ 
  assessmentId, 
  cropName, 
  location, 
  verdict, 
  initialData = null, 
  isOpen, 
  onClose, 
  onSubmitted, 
  language 
}) {
  const t = translations[language] || translations.en;
  
  const [rating, setRating] = useState(initialData?.rating || 5);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackTag, setFeedbackTag] = useState(initialData?.feedback_tag || "Accurate Advisory");
  const [actionTaken, setActionTaken] = useState(initialData?.action_taken || "Waited As Advised");
  const [outcome, setOutcome] = useState(initialData?.germination_outcome || "Excellent (>85%)");
  const [comment, setComment] = useState(initialData?.comment || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const feedbackTags = [
    "Accurate Advisory",
    "Delayed Rain",
    "Rain Was Higher",
    "Followed Advice",
    "Other Observation"
  ];

  const actions = [
    "Waited As Advised",
    "Sowed Immediately",
    "Irrigated & Sowed",
    "Changed Crop"
  ];

  const outcomes = [
    "Excellent (>85%)",
    "Moderate (60-85%)",
    "Poor (<60%)",
    "Pending / Observing"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        assessment_id: assessmentId,
        rating,
        feedback_tag: feedbackTag,
        sowing_action_taken: actionTaken,
        germination_outcome: outcome,
        comment
      };
      const res = await submitFeedback(payload);
      if (res && onSubmitted) {
        onSubmitted(payload);
      }
      onClose();
    } catch (err) {
      console.error(err);
      alert("Could not submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-[2.5rem] max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200/80 space-y-6 max-h-[90vh] overflow-y-auto relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1.5 pr-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-[11px] font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>Close the Loop • Feedback</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Rate Sowing Advice Accuracy
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Your field observation trains our Machine Learning model for future seasons.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Star Rating */}
          <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200/90 text-center space-y-2.5">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
              How accurate was this recommendation?
            </label>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const active = (hoverRating || rating) >= star;
                return (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-2xl transition hover:scale-110 focus:outline-none cursor-pointer"
                  >
                    <Star
                      className={`w-8 h-8 transition ${
                        active
                          ? "text-amber-400 fill-amber-400 drop-shadow-xs"
                          : "text-slate-300"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <div className="text-xs font-bold text-amber-800">
              {rating === 5 && "⭐ Excellent — Advice matched field moisture exactly"}
              {rating === 4 && "⭐ Good — Helpful decision support"}
              {rating === 3 && "⭐ Moderate — Weather differed slightly"}
              {rating <= 2 && "⭐ Differed — Rainfall arrived earlier/later"}
            </div>
          </div>

          {/* Action Taken */}
          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
              What action did you take?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {actions.map((act) => (
                <button
                  type="button"
                  key={act}
                  onClick={() => setActionTaken(act)}
                  className={`p-3 rounded-2xl border text-xs font-bold text-left transition cursor-pointer ${
                    actionTaken === act
                      ? "bg-orange-50 border-orange-500 text-orange-950 ring-2 ring-orange-400/40 shadow-xs"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {act}
                </button>
              ))}
            </div>
          </div>

          {/* Germination Outcome */}
          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
              Actual Germination / Crop Outcome
            </label>
            <div className="grid grid-cols-2 gap-2">
              {outcomes.map((out) => (
                <button
                  type="button"
                  key={out}
                  onClick={() => setOutcome(out)}
                  className={`p-3 rounded-2xl border text-xs font-bold text-left transition cursor-pointer ${
                    outcome === out
                      ? "bg-blue-50 border-blue-500 text-blue-950 ring-2 ring-blue-400/40 shadow-xs"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {out}
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
              Farmer Observation / Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="e.g. Rainfall arrived 2 days later; germination was very uniform..."
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-400"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-150">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black px-6 py-2.5 rounded-full shadow-md shadow-orange-500/25 transition cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Save Feedback & Train Model"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
