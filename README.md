# Farm Decision Support System 🌱

> **Converting Weather, Crop & Farm Data into Personalised, Low-Risk Sowing Decisions**  
> Built as an Agri-Tech Hackathon Prototype.

---

## 🎯 The Core Problem & Innovation

Farmers do not suffer from a lack of weather apps. Platforms like **Meghdoot** already provide district-level rain forecasts.

**The Real Gap:** The farmer still has to turn scattered, uncertain weather charts into a high-stakes financial decision:
> *"Should I risk ₹15,000–₹40,000 in seed, fertilizer, and diesel costs by sowing tomorrow, or should I wait?"*

### Our Differentiation Matrix
| Capability | Meghdoot / Typical Advisory | Farm Decision Support System |
| :--- | :--- | :--- |
| **Weather Forecast** | Output (just shows graphs) | **Input only** (consumed by decision engine) |
| **Farm Personalization** | Generic district advisory | **Specific to soil, irrigation, and field prep** |
| **Decision Options** | Single advisory text | **4 Ranked Options with Risk Levels** (Sow / Wait / Irrigate / Change Crop) |
| **Explainability** | Technical numbers | **Plain-Language & Marathi/Hindi** ("Why this advice") |
| **Financial Framing** | Rare | **Explicit risk minimisation** |

---

## 🏗️ Architecture & Tech Stack

```text
Farm Decision Support System
├── Backend: Python 3.14 + FastAPI
│   ├── Open-Meteo API (Live 7-10 day precipitation & temperature forecast)
│   ├── OpenStreetMap Nominatim API (Free geocoding for Indian villages/towns)
│   ├── Transparent Rule Engine (ICAR / KVK calibrated thresholds)
│   ├── SQLite Database (Saved field profiles & consultation logs)
│   └── Multilingual Localization Layer (English, Marathi मराठी, Hindi हिंदी)
│
└── Frontend: React 19 + Vite + Tailwind CSS + Lucide Icons
    ├── Screen 1: Home ("What do you want to do today?" + Roadmap cards)
    ├── Screen 2: Farm Details Form (Location search, crops, soil, irrigation toggle)
    ├── Screen 3: Decision Screen (SOW NOW / WAIT / CHANGE CROP badge + 7-day strip)
    ├── Screen 4: Explanation ("Why this recommendation?" plain language + technical drawer)
    ├── Screen 5: Compare Options (Core Differentiator: 4 ranked choices with risk badges)
    └── Screen 6: My Fields (Saved farm profiles with 1-click live re-evaluation)
```

---

## ⚡ 1-Minute Live Demo Script for Judges

1. Open **http://localhost:5173** in your browser.
2. Click **"Decide When to Sow"** (or click the 1-Click Judge Demo chip for **Pune • Soybean**).
3. On the **Farm Details Form**, select:
   - **Location:** Pune (or Baramati, Nashik, Nagpur)
   - **Crop:** Soybean (or Cotton, Maize, Wheat, Groundnut)
   - **Irrigation:** Toggle `No` (Rainfed)
   - **Soil:** Medium / Black Loam
4. Click **"Check Sowing Conditions →"**:
   - Notice the large colour-coded verdict (e.g. **WAIT** or **SOW NOW**), confidence percentage, and recommended sowing date range.
   - Look at the **7-Day Weather Strip** highlighting the critical germination period and dry-gap detection.
5. Click **"⚖️ Compare all 4 options"** (The Core Differentiator):
   - Review the 4 options: **Sow Today vs Wait 3-4 Days vs Irrigate & Sow Tomorrow vs Change Crop**.
   - Notice that *"Irrigate & Sow"* is automatically marked **Not Available / High Risk** because the farmer indicated no irrigation.
6. Click the top-right language switcher and change to **मराठी (Marathi)** or **हिंदी (Hindi)** to demo rural accessibility.

---

## 🚀 Setup & Running Locally

### 1. Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```
Backend API interactive docs: `http://localhost:8000/docs`

### 2. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Frontend Web UI: `http://localhost:5173`

### 3. Run Automated Tests
```bash
cd backend
python -m pytest tests/
```
All unit tests verify the rule engine's dry-gap detection, scoring formula, and option generator.

---

## 📊 Transparent Decision Engine Scoring Logic

For the selected crop over the 7-day forecast starting from intended sowing date:
1. **+40 points:** Total 7-day rainfall meets/exceeds `crop.min_rainfall_mm_7day`
2. **+25 points:** No dry gap (3+ consecutive days < 1.5mm rain) during `germination_days`
3. **+20 points:** Sowing date is within ICAR `ideal_sowing_window`
4. **+10 points:** Soil type is in `crop.suitable_soils`
5. **+5 points:** Irrigation is available (reduces rain vulnerability)

**Verdict Mapping:**
- `Score >= 75` ➔ **SOW NOW** 🟢
- `45 <= Score < 75` ➔ **WAIT** 🟡 (automatically computes dynamic wait days)
- `Score < 45` ➔ **CONSIDER ANOTHER CROP** 🔴 (suggests lower-moisture alternatives)