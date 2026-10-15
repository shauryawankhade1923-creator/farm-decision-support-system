import React, { useState, useEffect } from "react";
import { 
  Bell, X, CheckCheck, CloudRain, ShieldAlert, Sparkles, 
  TrendingUp, ArrowRight, Trash2, Sprout, Info, AlertTriangle,
  RefreshCw, CheckCircle2
} from "lucide-react";
import { translations } from "../locales/translations";
import { 
  generateLiveDistrictAlerts, 
  requestBrowserNotificationPermission, 
  sendBrowserPushNotification 
} from "../services/liveNotificationEngine";

export const DEFAULT_NOTIFICATIONS = [
  {
    id: "notif-seed-treatment",
    type: "advisory",
    category: "ICAR Seed Protocol",
    severity: "warning",
    timestamp: "Seasonal Advisory",
    targetDistrict: "Akola",
    targetCrop: "Gram",
    title: {
      en: "ICAR Protocol: Mandatory Trichoderma Seed Treatment for Gram (Harbhara)",
      mr: "ICAR कृषी सल्ला: हरभरा पिकासाठी ट्रायकोडर्मा व रायझोबियम बीजप्रक्रिया अनिवार्य",
      hi: "ICAR कृषि सलाह: चना (हरभरा) के लिए ट्राइकोडर्मा बीज उपचार जरूरी"
    },
    message: {
      en: "To prevent collar rot and vascular wilt in heavy regur soils, treat certified Digvijay/Jaki 9218 gram seed with Trichoderma viride (5g/kg) and Rhizobium culture before drilling.",
      mr: "काळी कसदार जमिनीत मर रोग व मूळकूज टाळण्यासाठी पेरणीपूर्वी प्रमाणित दिग्विजय/जाकी ९२१८ हरभरा बियाण्यास ट्रायकोडर्मा (५ ग्रॅ/किलो) व रायझोबियम जीवाणू संवर्धकाची प्रक्रिया करावी.",
      hi: "काली मिट्टी में उकठा रोग व जड़ सड़न से बचाव के लिए प्रमाणित दिग्विजय/जाकी 9218 चने के बीज को ट्राइकोडर्मा (5 ग्रा/किग्रा) से उपचारित करें।"
    }
  },
  {
    id: "notif-cotton-pest",
    type: "advisory",
    category: "Pest & Crop Watch",
    severity: "warning",
    timestamp: "Seasonal Advisory",
    targetDistrict: "Yavatmal",
    targetCrop: "Cotton",
    title: {
      en: "Crop Advisory: Morning Dew & Bollworm Watch in Cotton",
      mr: "पीक संरक्षण: कापूस पिकावर बोंडअळी सर्वेक्षण व कामगंध सापळे",
      hi: "फसल सुरक्षा: कपास में गुलाबी सुंडी निगरानी व फेरोमोन ट्रैप"
    },
    message: {
      en: "High humidity across Vidarbha cotton tracts requires monitoring. Install 5 pheromone traps per acre to keep bollworm ETL below 5%.",
      mr: "विदर्भातील कापूस पट्ट्यात हवेतील आर्द्रतेमुळे बोंडअळीचा धोका वाढू नये म्हणून एकरी ५ कामगंध सापळे लावावेत व कामगंध सापळ्यात पतंग आढळल्यास निंबोळी अर्काची फवारणी करावी.",
      hi: "विदर्भ के कपास क्षेत्रों में नमी के कारण सुंडी से बचाव हेतु प्रति एकड़ 5 फेरोमोन ट्रैप लगाएं और नीम अर्क का छिड़काव करें।"
    }
  },
  {
    id: "notif-msp-rates",
    type: "market",
    category: "Govt MSP Update",
    severity: "info",
    timestamp: "Government Gazette",
    targetDistrict: "Latur",
    targetCrop: "Gram",
    title: {
      en: "MSP Support Announcement: Gram at ₹5,440/Qtl, Wheat at ₹2,275/Qtl",
      mr: "शासकीय हमीभाव: हरभरा ₹५,४४०/क्विंटल व गहू ₹२,२७५/क्विंटल हमीभाव जाहीर",
      hi: "सरकारी समर्थन मूल्य: चना ₹5,440/क्विंटल व गेहूं ₹2,275/क्विंटल घोषित"
    },
    message: {
      en: "Central government announced revised procurement minimum support rates. Plan timely sowing of certified varieties to benefit from official purchase centers.",
      mr: "केंद्र शासनाने रब्बी हमीभाव जाहीर केले असून हमीभाव केंद्रांचा लाभ घेण्यासाठी वेळीच प्रमाणित वाणांच्या पेरणीचे नियोजन करा.",
      hi: "केंद्र सरकार द्वारा रबी एमएसपी की घोषणा। सरकारी खरीद केंद्रों का लाभ लेने के लिए समय पर प्रमाणित किस्मों की बुवाई करें।"
    }
  }
];

export default function NotificationModal({
  isOpen,
  onClose,
  language = "en",
  onAction,
  readIds = [],
  onMarkRead,
  onMarkAllRead,
  liveDistrict = "Pune",
  liveLat = 18.5204,
  liveLng = 73.8567,
  liveCrop = "Soybean"
}) {
  const t = translations[language] || translations.en;
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS);
  const [isScanningLive, setIsScanningLive] = useState(false);
  const [pushPermission, setPushPermission] = useState(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      return Notification.permission;
    }
    return "unsupported";
  });

  // Fetch live weather-based notifications on open or district change
  useEffect(() => {
    let isMounted = true;
    async function loadLiveAlerts() {
      setIsScanningLive(true);
      try {
        const liveList = await generateLiveDistrictAlerts(liveDistrict, liveLat, liveLng, liveCrop);
        if (isMounted && liveList && liveList.length > 0) {
          setNotifications(liveList);

          // If push notification is granted, send push for new danger alerts
          if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
            const dangerAlert = liveList.find(a => a.severity === "danger" && !readIds.includes(a.id));
            if (dangerAlert) {
              const pushTitle = dangerAlert.title[language] || dangerAlert.title.en;
              const pushBody = dangerAlert.message[language] || dangerAlert.message.en;
              sendBrowserPushNotification(pushTitle, pushBody);
            }
          }
        }
      } catch (e) {
        console.warn("Live notification fetch error:", e);
      } finally {
        if (isMounted) setIsScanningLive(false);
      }
    }

    if (isOpen) {
      loadLiveAlerts();
    }
    return () => {
      isMounted = false;
    };
  }, [isOpen, liveDistrict, liveLat, liveLng, liveCrop]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleEnablePush = async () => {
    const res = await requestBrowserNotificationPermission();
    setPushPermission(res);
    if (res === "granted") {
      const welcomeTitle = language === "mr" 
        ? "✅ थेट कृषी सूचना सक्रिय झाल्या आहेत!" 
        : language === "hi" 
        ? "✅ लाइव कृषि अलर्ट सक्रिय हो गए हैं!" 
        : "✅ Live Farm Alerts Activated!";
      const welcomeBody = language === "mr"
        ? `${liveDistrict} साठी थेट पाऊस व पेरणी इशारे तत्काळ मिळतील.`
        : language === "hi"
        ? `${liveDistrict} के लिए लाइव बारिश व बुवाई अलर्ट तुरंत मिलेंगे।`
        : `You will receive instant alerts for live rainfall and sowing windows in ${liveDistrict}.`;
      sendBrowserPushNotification(welcomeTitle, welcomeBody);
    }
  };

  const handleRefresh = async () => {
    setIsScanningLive(true);
    const liveList = await generateLiveDistrictAlerts(liveDistrict, liveLat, liveLng, liveCrop);
    setNotifications(liveList);
    setIsScanningLive(false);
  };

  const handleClearItem = (e, id) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filtered = notifications.filter((item) => {
    if (activeTab === "all") return true;
    return item.type === activeTab;
  });

  const unreadCount = notifications.filter((n) => !readIds.includes(n.id)).length;

  const getSeverityStyle = (sev) => {
    switch (sev) {
      case "optimal":
        return {
          badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-200",
          iconBg: "bg-emerald-100 text-emerald-700",
          icon: Sprout
        };
      case "warning":
        return {
          badgeBg: "bg-amber-50 text-amber-800 border-amber-200",
          iconBg: "bg-amber-100 text-amber-700",
          icon: AlertTriangle
        };
      case "danger":
        return {
          badgeBg: "bg-rose-50 text-rose-800 border-rose-200",
          iconBg: "bg-rose-100 text-rose-700",
          icon: ShieldAlert
        };
      default:
        return {
          badgeBg: "bg-blue-50 text-blue-800 border-blue-200",
          iconBg: "bg-blue-100 text-blue-700",
          icon: Info
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div 
        className="relative z-10 w-full max-w-lg bg-white rounded-t-[2.5rem] sm:rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[88vh] animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Handle on Mobile */}
        <div className="sm:hidden w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-3 mb-1" />

        {/* Modal Header */}
        <div className="px-6 pt-4 pb-3 border-b border-slate-100 bg-[#F4F6F5]/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center relative shadow-xs">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 ring-2 ring-white absolute -top-0.5 -right-0.5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  {t.notificationsTitle || "Farm Notifications & Alerts"}
                </h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black">
                    {unreadCount} {t.unreadCountLabel || "Unread"}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                <span>{liveDistrict}</span>
                <span>•</span>
                <span className="text-emerald-700 font-bold">
                  {isScanningLive ? (language === "mr" ? "उपग्रह रडार स्कॅन होत आहे..." : language === "hi" ? "मौसम रडार स्कैन हो रहा है..." : "Scanning radar...") : (language === "mr" ? "थेट हवामान सक्रिय" : language === "hi" ? "लाइव मौसम सक्रिय" : "Live Satellite Active")}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isScanningLive}
              className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 flex items-center justify-center transition disabled:opacity-50"
              title="Refresh Live Weather Alerts"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScanningLive ? "animate-spin text-emerald-600" : ""}`} />
            </button>
            {unreadCount > 0 && onMarkAllRead && (
              <button
                type="button"
                onClick={onMarkAllRead}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 px-2 py-1 rounded-lg hover:bg-emerald-50 transition flex items-center gap-1"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.markAllRead || "Mark all read"}</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Push Notification Banner */}
        {pushPermission !== "granted" && pushPermission !== "unsupported" && (
          <div className="mx-4 sm:mx-6 mt-3 p-3 rounded-2xl bg-gradient-to-r from-emerald-800 to-[#0B4628] text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Bell className="w-4 h-4 text-emerald-200 animate-bounce" />
              </div>
              <div>
                <p className="text-xs font-black leading-tight">
                  {language === "mr" ? "थेट पावसाचे अलर्ट मोबाईलवर मिळवा" : language === "hi" ? "बारिश व बुवाई के रियल-टाइम अलर्ट पाएं" : "Enable Live Device Push Alerts"}
                </p>
                <p className="text-[10px] text-emerald-200">
                  {language === "mr" ? "मुसळधार पाऊस व पेरणी कालावधीच्या तत्काळ सूचना" : language === "hi" ? "भारी बारिश और बुवाई समय की तत्काल सूचना" : "Get instant alerts when rain or sowing windows open"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleEnablePush}
              className="px-3 py-1.5 rounded-xl bg-white text-emerald-950 text-xs font-black hover:bg-emerald-50 transition shrink-0 cursor-pointer shadow-xs ml-2"
            >
              {language === "mr" ? "चालू करा" : language === "hi" ? "चालू करें" : "Enable"}
            </button>
          </div>
        )}

        {pushPermission === "granted" && (
          <div className="mx-4 sm:mx-6 mt-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between text-[11px] font-bold">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === "mr" ? "थेट मोबाईल/ब्राउझर सूचना सक्रिय आहेत" : language === "hi" ? "लाइव मोबाइल/ब्राउज़र अलर्ट सक्रिय हैं" : "Live Device Push Alerts Active"}</span>
            </span>
            <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded-md font-mono">LIVE</span>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="px-6 py-2.5 bg-white border-b border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: "all", label: t.allAlerts || "All" },
            { id: "weather", label: t.weatherAlerts || "Weather" },
            { id: "advisory", label: t.agriAdvisories || "Advisories" },
            { id: "market", label: t.marketAlerts || "Market & MSP" }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#0B4628] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Alert Cards List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5 divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                <CheckCheck className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">
                {t.noNotifications || "No alerts at this moment. Field conditions are normal."}
              </h4>
            </div>
          ) : (
            filtered.map((item) => {
              const isRead = readIds.includes(item.id);
              const style = getSeverityStyle(item.severity);
              const Icon = style.icon;

              return (
                <div
                  key={item.id}
                  onClick={() => onMarkRead && onMarkRead(item.id)}
                  className={`pt-3.5 first:pt-0 p-3 rounded-2xl transition cursor-pointer ${
                    isRead ? "bg-white hover:bg-slate-50/80" : "bg-emerald-50/30 hover:bg-emerald-50/60 border border-emerald-500/20 shadow-xs"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-xl ${style.iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase border ${style.badgeBg}`}>
                            {item.category}
                          </span>
                          {!isRead && (
                            <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0 animate-ping" />
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold shrink-0">
                          {item.timestamp}
                        </span>
                      </div>

                      <h4 className={`text-xs sm:text-sm mt-1 leading-snug ${isRead ? "font-bold text-slate-800" : "font-black text-slate-900"}`}>
                        {item.title[language] || item.title.en}
                      </h4>

                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {item.message[language] || item.message.en}
                      </p>

                      {/* Action trigger button */}
                      {onAction && item.targetDistrict && (
                        <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400">
                            {item.targetDistrict} • {item.targetCrop}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onAction({
                                location: item.targetDistrict,
                                crop: item.targetCrop
                              });
                              onClose();
                            }}
                            className="px-2.5 py-1 rounded-lg bg-[#0B4628] hover:bg-[#0F5E37] text-white text-[11px] font-bold flex items-center gap-1 transition shadow-xs"
                          >
                            <span>{t.takeAction || "Check Sowing ->"}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleClearItem(e, item.id)}
                      className="text-slate-300 hover:text-rose-500 p-1 rounded-lg transition"
                      title="Dismiss"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-semibold">
            {notifications.length} {t.allAlerts || "Alerts"}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition shadow-xs"
          >
            {t.close || "Close"}
          </button>
        </div>

      </div>
    </div>
  );
}
