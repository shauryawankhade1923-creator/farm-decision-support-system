import React, { useEffect, useState } from "react";
import { 
  Bookmark, ArrowRight, Trash2, Sprout, MapPin, 
  Droplets, Layers 
} from "lucide-react";
import { translations } from "../locales/translations";
import { getSavedFields, deleteField } from "../services/api";

export default function SavedFieldsScreen({ onSelectField, onNewCheck, language }) {
  const t = translations[language] || translations.en;
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFields = async () => {
    setLoading(true);
    const data = await getSavedFields();
    setFields(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadFields();
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm("Remove this field profile?")) {
      const ok = await deleteField(id);
      if (ok) {
        setFields(fields.filter((f) => f.id !== id));
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-orange-500" />
            <span>{t.savedTitle}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {t.savedSub}
          </p>
        </div>

        <button
          onClick={onNewCheck}
          className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black px-5 py-2.5 rounded-full shadow-md shadow-orange-500/20 transition flex items-center gap-2 cursor-pointer"
        >
          <Sprout className="w-4 h-4" />
          <span>New Field Assessment</span>
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-500 text-sm">
          <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          Loading saved field profiles...
        </div>
      ) : fields.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-12 text-center border border-slate-200/90 shadow-sm space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto border border-orange-100">
            <Bookmark className="w-7 h-7" />
          </div>
          <h3 className="font-black text-slate-900 text-lg">No Saved Fields Yet</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto font-medium">
            {t.emptySaved}
          </p>
          <button
            onClick={onNewCheck}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black px-6 py-3 rounded-full text-xs transition inline-flex items-center gap-2 cursor-pointer shadow-md shadow-orange-500/20"
          >
            <span>Assess a Field Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((f) => (
            <div
              key={f.id}
              onClick={() => onSelectField(f)}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 hover:border-orange-400 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="font-black text-slate-900 text-lg group-hover:text-orange-600 transition">
                    {f.name}
                  </h3>
                  <button
                    onClick={(e) => handleDelete(f.id, e)}
                    className="text-slate-400 hover:text-rose-600 p-1.5 rounded-full hover:bg-rose-50 transition cursor-pointer"
                    title="Delete profile"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-orange-500" />
                  <span>{f.location}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-orange-600 font-extrabold">{f.crop}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-sky-600" />
                    <span>{f.irrigation_available ? "Irrigated" : "Rainfed"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-amber-600" />
                    <span className="capitalize">{f.soil_type} Soil</span>
                  </div>
                  {f.land_size_acres && (
                    <div className="col-span-2 text-[11px] text-slate-400 pt-1">
                      Plot size: {f.land_size_acres} Acres
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-150 flex items-center justify-between text-xs font-black text-orange-600">
                <span>{t.btnReCheck}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}