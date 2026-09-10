import React from "react";
import { CloudRain, Sun, Droplets } from "lucide-react";

export default function WeatherStrip({ forecast = [], germinationDays = 6, hasDryGap = false }) {
  if (!forecast || forecast.length === 0) return null;

  const formatDate = (dateStr) => {
    try {
      const dt = new Date(dateStr);
      return {
        dayName: dt.toLocaleDateString(undefined, { weekday: "short" }),
        dateNum: dt.getDate()
      };
    } catch {
      return { dayName: "Day", dateNum: "" };
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
            <CloudRain className="w-4 h-4 text-blue-500" />
            <span>7-Day Precipitation & Microclimate Forecast</span>
          </h4>
          <p className="text-xs text-slate-500 font-medium">
            Critical {germinationDays}-day seedling germination window monitored
          </p>
        </div>
        {hasDryGap && (
          <span className="inline-flex items-center gap-1.5 text-xs font-black px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
            <span>⚠️ 3+ Day Dry Gap Detected</span>
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
        {forecast.slice(0, 7).map((day, idx) => {
          const { dayName, dateNum } = formatDate(day.date);
          const isGerminationWindow = idx < germinationDays;
          const isDry = day.precipitation_mm < 1.5;

          return (
            <div
              key={day.date || idx}
              className={`p-3.5 rounded-2xl border flex flex-col items-center text-center transition-all ${
                isGerminationWindow
                  ? isDry
                    ? "bg-amber-50/70 border-amber-200"
                    : "bg-sky-50/70 border-sky-200"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="text-xs font-bold text-slate-700 uppercase">
                {dayName} {dateNum}
              </div>

              <div className="my-2">
                {day.precipitation_mm >= 5 ? (
                  <CloudRain className="w-6 h-6 text-sky-600 animate-pulse" />
                ) : day.precipitation_mm > 0 ? (
                  <Droplets className="w-6 h-6 text-sky-400" />
                ) : (
                  <Sun className="w-6 h-6 text-amber-500" />
                )}
              </div>

              <div className="text-sm font-bold text-slate-900">
                {day.precipitation_mm} <span className="text-xs font-normal text-slate-500">mm</span>
              </div>

              {day.precipitation_probability > 0 && (
                <div className="text-[10px] font-medium text-sky-700 bg-sky-100 px-1.5 py-0.5 rounded-md mt-1">
                  {day.precipitation_probability}% prob
                </div>
              )}

              <div className="text-[11px] text-slate-600 mt-2 font-medium">
                {Math.round(day.temp_max_c)}° / {Math.round(day.temp_min_c)}°C
              </div>

              {isGerminationWindow && (
                <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase mt-1">
                  Day {idx + 1}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
