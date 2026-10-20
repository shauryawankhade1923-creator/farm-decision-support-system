# Farm Decision Support System (FDSS) 🌱

> **Converting Real-Time Weather, Crop Science & Soil Data into Actionable, Low-Risk Sowing Decisions**  
> *Production-Ready Web Application & Agro-Climatic Intelligence Platform*

[![Vercel Deployment](https://img.shields.io/badge/Production-Live%20on%20Vercel-success?style=flat&logo=vercel)](https://farm-decision-support-system.vercel.app)
[![React](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite%20%2B%20Tailwind-blue)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20%2B%20Python%203.14-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Multilingual](https://img.shields.io/badge/Languages-English%20%7C%20%E0%A4%AE%E0%A4%B0%E0%A4%BE%E0%A4%A0%E0%A5%80%20%7C%20%E0%A4%B9%E0%A4%BF%E0%A4%82%E0%A4%A6%E0%A5%80-orange)](#-multilingual-support)

---

## 🌐 Live Production Application

🔗 **Official Deployment:** [https://farm-decision-support-system.vercel.app](https://farm-decision-support-system.vercel.app)  
📦 **GitHub Repository:** [shauryawankhade1923-creator/farm-decision-support-system](https://github.com/shauryawankhade1923-creator/farm-decision-support-system)

---

## 🎯 The Core Problem & Innovation

Farmers do not suffer from a lack of raw weather apps. Apps like *Meghdoot* and *Mausam* display district-level rainfall graphs and temperatures.

**The Real Gap:** The smallholder farmer must still transform uncertain forecast percentages into a high-stakes financial gamble:
> *"Should I risk ₹15,000–₹40,000 in seed, fertilizer, and tractor rental by sowing tomorrow, or should I wait?"*

### Differentiation Matrix

| Capability | Standard Weather Apps (Meghdoot / AccuWeather) | Farm Decision Support System (FDSS) |
| :--- | :--- | :--- |
| **Forecast Role** | Raw output (displays rain charts) | **Input only** (processed by the decision engine) |
| **Hyperlocal Personalization** | Generic district weather summary | **Calibrated to soil depth, black/red soil type, and irrigation access** |
| **Decision Recommendations** | Monolithic text advisory | **4 Ranked Options with Risk Levels** (*Sow Now / Wait / Irrigate & Sow / Change Crop*) |
| **Explainability** | Meteorology statistics | **Plain-Language Agronomic Logic & Multi-Language** (*"Why this recommendation"*) |
| **Crop Specificity** | Broad regional lists | **ICAR/KVK-calibrated crop varieties** (*Soybean, Cotton, Groundnut JL 24, Tur, Gram, Jowar, Bajra, Maize*) |
| **Offline & SaaS Ready** | Requires full cloud connectivity | **Hybrid Client/Cloud Decision Engine + Row-Level Security & Data Privacy** |

---

## 🏗️ Architecture & Technology Stack

```text
farm-decision-support-system/
├── frontend/                               # React 19 Single Page Application
│   ├── src/
│   │   ├── components/                     # Reusable UI Components
│   │   │   ├── AuthModal.jsx               # Register, Login, Reset Password & Verify Email
│   │   │   ├── BottomBar.jsx               # Floating bottom navigation bar
│   │   │   ├── ErrorBoundary.jsx           # Top-level crash handler with graceful recovery
│   │   │   ├── NotificationModal.jsx       # Real-time agro-meteorological advisories
│   │   │   └── OnboardingModal.jsx         # 3-step walkthrough for first-time farmers
│   │   ├── screens/                        # Application Screens
│   │   │   ├── HomeScreen.jsx              # Dashboard, district selector, live weather & crops
│   │   │   ├── FarmDetailsScreen.jsx       # Field plot calibration (soil, irrigation, date)
│   │   │   ├── DecisionScreen.jsx          # Verdict badge (SOW NOW / WAIT / CHANGE CROP)
│   │   │   ├── ExplanationScreen.jsx       # Agronomic rationale & rainfall charts
│   │   │   ├── CompareOptionsScreen.jsx    # 4-option comparative matrix & yield analytics
│   │   │   ├── SavedFieldsScreen.jsx       # RLS-isolated farm plots & 1-click re-evaluation
│   │   │   ├── ProfileScreen.jsx           # Farmer profile, credentials, DPDP rights & actions
│   │   │   ├── PrivacyPolicyScreen.jsx     # DPDP Act 2023 compliant privacy policy
│   │   │   ├── TermsScreen.jsx             # Advisory disclaimers & Terms of Service
│   │   │   └── NotFoundScreen.jsx          # Agricultural-themed 404 error page
│   │   ├── services/                       # Client Business Logic & Security
│   │   │   ├── authService.js              # Real auth, token sessions, brute-force limiter & demo user
│   │   │   ├── clientDecisionEngine.js     # Standalone offline-capable ICAR decision algorithm
│   │   │   ├── backupService.js            # User-scoped JSON export, import & RLS mapping
│   │   │   ├── analyticsService.js         # Privacy-friendly event tracking with opt-out
│   │   │   ├── errorTracker.js             # Global unhandled error & rejection capture
│   │   │   └── rateLimiter.js              # Action throttling & debounce utility
│   │   └── locales/                        # Multilingual Dictionary (EN, MR, HI)
│   └── public/crops/                       # Verified authentic crop photography
│
└── backend/                                # FastAPI Cloud API (Python 3.14)
    ├── app/
    │   ├── main.py                         # REST API, rate-limiting middleware & auth routes
    │   ├── decision_engine.py              # Rule-based agronomic evaluation engine
    │   ├── weather_service.py              # Open-Meteo & IMD forecast integration
    │   ├── database.py                     # SQLite / SQLAlchemy persistent ORM
    │   └── models.py                       # User, FieldPlot & Consultation schemas
    └── tests/                              # Automated Pytest suite (8/8 passing)
```

---

## 🔒 Enterprise & Production Security Features

1. **Real Authentication & Identity:** Full user registration, login, 7-day token persistence, password hashing, and instant 1-Click Demo Login (`Ramesh Patil, Akola`).
2. **Password Recovery & Email Verification:** Multi-step verification codes with resend cooldown timers and verified farmer badges.
3. **Row Level Security (RLS):** All farm plots, soil measurements, and consultation histories are cryptographically isolated per `user_id`.
4. **Rate Limiting:**
   - *Frontend:* 5-attempt brute-force lockout with 30-second cooldown timer.
   - *Backend:* Sliding-window rate limit middleware (120 req/min general, 15 req/min on login).
5. **Data Portability & Safe Backups:** User-scoped JSON database snapshot exports and restores with schema validation.
6. **Zero Exposed Frontend Keys:** No private API keys or secret credentials embedded in client code.
7. **Production Error Boundary:** Graceful fallback UI catching uncaught exceptions with one-click app reload.
8. **DPDP Act 2023 Compliance:** Dedicated Privacy Policy and Terms of Service covering geolocation storage and user rights.
9. **Account Deletion:** Permanent account and data purge requiring explicit `"DELETE"` confirmation.
10. **Interactive Onboarding:** 3-step first-time walkthrough explaining satellite weather, soil depth calibration, and the 4-choice risk matrix.

---

## 🌐 Multilingual Support

The entire application can be toggled in real time into three languages:
- **English** (Default)
- **मराठी (Marathi)** — Native language for Vidarbha & Marathwada farmers
- **हिंदी (Hindi)** — Widely understood across central and northern India

Language switching is accessible directly from the home header and automatically translates all crops, agronomic reasons, button actions, and notifications.

---

## 🌾 Verified Crops Supported

All crops feature authentic, botanically accurate high-resolution photography:
- **Soybean** (*Glycine max* — JS 335, JS 9305)
- **Cotton** (*Gossypium hirsutum* — Bt Cotton, Hybrid)
- **Groundnut** (*Arachis hypogaea* — JL 24, TAG 24)
- **Pigeonpea / Tur** (*Cajanus cajan* — BDN 711, Maruti)
- **Gram / Chickpea** (*Cicer arietinum* — Vijay, Digvijay)
- **Jowar / Sorghum** (*Sorghum bicolor* — CSH 14, Maldandi)
- **Bajra / Pearl Millet** (*Pennisetum glaucum* — ICTP 8203)
- **Maize** (*Zea mays* — Pioneer, Syngenta)
- **Wheat** (*Triticum aestivum* — Lokwan, Sharbati)

---

## ⚡ 1-Minute Live Demo Script for Judges & Reviewers

1. Open **[https://farm-decision-support-system.vercel.app](https://farm-decision-support-system.vercel.app)** in your browser.
2. Complete or skip the 3-step **Onboarding Walkthrough**.
3. On the **Home Dashboard**, check the **Live Weather Bar** for Akola / Pune / Nagpur.
4. Click **"Decide When to Sow"** (or tap any crop card like **Soybean** or **Groundnut (JL 24)**).
5. In **Farm Details**:
   - Location: *Akola, Maharashtra*
   - Soil: *Medium Black Clay*
   - Irrigation: Toggle *Rainfed (No)*
   - Sowing Date: *Today*
6. Click **"Check Sowing Conditions →"**:
   - View the large verdict banner (**SOW NOW**, **WAIT**, or **CHANGE CROP**) with confidence score.
   - Inspect the **7-Day Weather & Germination Moisture Strip**.
7. Click **"⚖️ Compare All 4 Options"**:
   - Compare *Sow Today* vs *Wait 3-4 Days* vs *Irrigate & Sow* vs *Alternative Crop*.
   - View the **Yield Expectation** card and **7-Day Moisture Accumulation** bar.
8. Go to **"My Profile"** in bottom navigation:
   - Click **"⚡ 1-Click Quick Demo Login (Ramesh Patil)"** to instantly test authenticated state.
   - View your farmer identity, verified badge, and data rights.

---

## 🚀 Running Locally

### Prerequisites
- Node.js 18+ & npm
- Python 3.11+ (Python 3.14 compatible)

### 1. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173).

### 2. Backend Setup (Optional)
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```
Interactive Swagger docs: [http://localhost:8000/docs](http://localhost:8000/docs).

### 3. Automated Test Suite
```bash
cd backend
python -m pytest tests/
```
All 8 automated backend tests verify:
- Rule engine dry-gap detection and rainfall scoring formulas
- User registration, hashing, and authentication workflows
- Rate-limiting middleware and user-scoped data access

---

## 📊 Decision Scoring Algorithm

For any selected crop and intended sowing date over a 7-day forward window:
$$\text{Score} = \text{RainScore}_{(0-40)} + \text{DryGapScore}_{(0-25)} + \text{WindowScore}_{(0-20)} + \text{SoilScore}_{(0-10)} + \text{IrrigationScore}_{(0-5)}$$

- **+40 points:** 7-day cumulative rainfall meets or exceeds ICAR `crop.min_rainfall_mm_7day`.
- **+25 points:** Absence of dry spells (3+ consecutive days with $<1.5\text{ mm}$ rain) during critical germination days.
- **+20 points:** Sowing date falls inside the optimal agro-climatic window.
- **+10 points:** Soil texture matches crop rooting and aeration profile.
- **+5 points:** Supplementary irrigation available to buffer potential dry spells.

**Verdict Thresholds:**
- $\text{Score} \ge 75$ $\rightarrow$ **SOW NOW** 🟢
- $45 \le \text{Score} < 75$ $\rightarrow$ **WAIT** 🟡 *(dynamically suggests wait period)*
- $\text{Score} < 45$ $\rightarrow$ **CONSIDER ANOTHER CROP** 🔴 *(recommends drought-tolerant alternatives)*

---

## 📄 License & Advisory Disclaimer

This project is licensed under the MIT License. Agricultural recommendations are generated based on ICAR/KVK agronomic guidelines and public meteorological forecast APIs; actual farm decisions should consider on-ground field observations.
