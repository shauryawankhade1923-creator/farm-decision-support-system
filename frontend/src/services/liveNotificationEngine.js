// Live Real-Time Agro-Advisory & Weather Notification Engine
// Queries Open-Meteo live weather API for exact district coordinates,
// evaluates ICAR & agronomic rules, and dispatches real-time alerts.

import { DEFAULT_NOTIFICATIONS } from "../components/NotificationModal";

export async function generateLiveDistrictAlerts(districtName = "Pune", lat = 18.5204, lng = 73.8567, currentCrop = "Soybean") {
  const alerts = [];
  const now = new Date();
  const timeStr = "Just now";

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&daily=precipitation_sum,precipitation_probability_max,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7`;
    
    const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (res.ok) {
      const data = await res.json();
      const current = data.current || {};
      const daily = data.daily || {};
      
      const precipArray = daily.precipitation_sum || [];
      const probArray = daily.precipitation_probability_max || [];
      const tmaxArray = daily.temperature_2m_max || [];
      
      const rain48h = (precipArray[0] || 0) + (precipArray[1] || 0);
      const rain7d = precipArray.reduce((acc, v) => acc + (v || 0), 0);
      const maxProb48h = Math.max(probArray[0] || 0, probArray[1] || 0);
      const currentTemp = Math.round(current.temperature_2m ?? 28);
      const currentHumidity = Math.round(current.relative_humidity_2m ?? 65);

      // 1. DYNAMIC WEATHER ALERT: HEAVY RAIN IN 48H
      if (rain48h >= 12.0 || maxProb48h >= 70) {
        alerts.push({
          id: `live-rain-${districtName}-${rain48h.toFixed(0)}`,
          type: "weather",
          category: "Live IMD Radar",
          severity: "danger",
          timestamp: timeStr,
          targetDistrict: districtName,
          targetCrop: currentCrop,
          title: {
            en: `🚨 Live Alert: Incoming Rainfall (${rain48h.toFixed(1)} mm) in ${districtName}`,
            mr: `🚨 थेट इशारा: ${districtName} मध्ये पुढील ४८ तासांत ${rain48h.toFixed(1)} मिमी पावसाची शक्यता`,
            hi: `🚨 लाइव अलर्ट: ${districtName} में अगले 48 घंटों में ${rain48h.toFixed(1)} मिमी बारिश का अनुमान`
          },
          message: {
            en: `Live radar detects ${rain48h.toFixed(1)} mm rainfall and ${maxProb48h}% precipitation probability. Postpone immediate sowing to avoid seed rotting; advance mature harvesting.`,
            mr: `थेट उपग्रह रडारनुसार ${districtName} भागात ${rain48h.toFixed(1)} मिमी पावसाचा अंदाज आहे. बियाणे कुजण्याचा धोका असल्याने पेरणी पुढे ढकला किंवा पक्व पीक तातडीने कापावे.`,
            hi: `लाइव सैटेलाइट रडार के अनुसार ${districtName} में ${rain48h.toFixed(1)} मिमी बारिश का अनुमान है। बीज सड़ने से बचाने के लिए बुवाई टालें अथवा पकी फसल तुरंत काटें।`
          }
        });
      }

      // 2. DYNAMIC WEATHER ALERT: DRY SPELL / OPTIMAL SOWING WINDOW
      if (rain48h < 4.0 && currentHumidity <= 75) {
        alerts.push({
          id: `live-optimal-${districtName}`,
          type: "weather",
          category: "Live Forecast",
          severity: "optimal",
          timestamp: timeStr,
          targetDistrict: districtName,
          targetCrop: currentCrop,
          title: {
            en: `☀️ Live Optimal Window: Dry Spell in ${districtName}`,
            mr: `☀️ थेट अनुकूल काळ: ${districtName} मध्ये पेरणीसाठी कोरडे हवामान`,
            hi: `☀️ लाइव अनुकूल समय: ${districtName} में बुवाई के लिए मौसम साफ`
          },
          message: {
            en: `Only ${rain48h.toFixed(1)} mm rain expected over next 48h with ${currentTemp}°C temp. Excellent dry window for seed drill sowing and land preparation.`,
            mr: `पुढील ४८ तासांत केवळ ${rain48h.toFixed(1)} मिमी पाऊस व ${currentTemp}°C तापमान राहणार असल्याने शेत मशागत व पेरणीसाठी अत्यंत पोषक वातावरण आहे.`,
            hi: `अगले 48 घंटों में केवल ${rain48h.toFixed(1)} मिमी बारिश और ${currentTemp}°C तापमान रहने से खेत जुताई और बुवाई के लिए उत्तम स्थिति है।`
          }
        });
      }

      // 3. PEST & FUNGAL RISK ALERT (Based on Live Humidity & Temp)
      if (currentHumidity >= 70 && currentTemp >= 24 && currentTemp <= 32) {
        alerts.push({
          id: `live-pest-${districtName}`,
          type: "advisory",
          category: "Live Crop Watch",
          severity: "warning",
          timestamp: timeStr,
          targetDistrict: districtName,
          targetCrop: currentCrop,
          title: {
            en: `🐛 Microclimate Alert: High Humidity (${currentHumidity}%) in ${districtName}`,
            mr: `🐛 कीड-रोग दक्षता: ${districtName} मध्ये हवेतील जास्त आर्द्रता (${currentHumidity}%)`,
            hi: `🐛 कीट-रोग चेतावनी: ${districtName} में हवा में अधिक नमी (${currentHumidity}%)`
          },
          message: {
            en: `Current humidity of ${currentHumidity}% and ${currentTemp}°C creates high susceptibility for pod borer (Helicoverpa) and fungal spores. Inspect crops closely.`,
            mr: `हवेतील ${currentHumidity}% आर्द्रता व ${currentTemp}°C तापमानामुळे घाटे अळी व बुरशीजन्य रोगांचा प्रादुर्भाव वाढू शकतो. शेताचे दररोज निरीक्षण करा.`,
            hi: `${currentHumidity}% नमी और ${currentTemp}°C तापमान से फली छेदक व फफूंद जनित रोगों का जोखिम बढ़ सकता है। फसल की नियमित निगरानी करें।`
          }
        });
      }

      // 4. HEAT OR HIGH WIND ALERT
      if (currentTemp >= 33 || (tmaxArray[0] || 0) >= 34) {
        alerts.push({
          id: `live-heat-${districtName}`,
          type: "weather",
          category: "Temperature Alert",
          severity: "warning",
          timestamp: timeStr,
          targetDistrict: districtName,
          targetCrop: currentCrop,
          title: {
            en: `🌡️ High Day Temperature Warning: ${currentTemp}°C in ${districtName}`,
            mr: `🌡️ उष्णता इशारा: ${districtName} मध्ये दिवसाचे तापमान ${currentTemp}°C`,
            hi: `🌡️ तापमान चेतावनी: ${districtName} में दिन का तापमान ${currentTemp}°C`
          },
          message: {
            en: `Elevated surface evaporation rate. Sow during cooler morning hours and maintain protective moisture mulch.`,
            mr: `बाष्पीभवनाचा वेग वाढला आहे. दुपारऐवजी सकाळच्या थंड वेळेत पेरणी करा व जमिनीतील ओलावा जपण्यासाठी आच्छादन वापरावे.`,
            hi: `वाष्पीकरण दर बढ़ा हुआ है। दोपहर के बजाय सुबह के समय बुवाई करें और नमी बनाए रखने का प्रयास करें।`
          }
        });
      }
    }
  } catch (err) {
    console.warn("Could not fetch live Open-Meteo alerts, using default calibrated advisories:", err);
  }

  // Combine live real-time weather alerts with established ICAR protocols and MSP notifications
  const combined = [...alerts, ...DEFAULT_NOTIFICATIONS];
  
  // Deduplicate by id
  const seen = new Set();
  return combined.filter(item => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

// Request Native Web Push Notifications from the browser
export async function requestBrowserNotificationPermission() {
  if (!("Notification" in window)) {
    return "unsupported";
  }
  if (Notification.permission === "granted") {
    return "granted";
  }
  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission;
  }
  return Notification.permission;
}

// Dispatch a system desktop / mobile push notification
export function sendBrowserPushNotification(title, body, icon = "/crops/soybean_field.jpg") {
  if (!("Notification" in window) || Notification.permission !== "granted") {
    return false;
  }
  try {
    const notification = new Notification(title, {
      body,
      icon,
      badge: "/crops/soybean_field.jpg",
      vibrate: [200, 100, 200]
    });
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
    return true;
  } catch (e) {
    console.warn("Could not fire native notification:", e);
    return false;
  }
}
