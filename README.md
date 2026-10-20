# Farm Decision Support System (FDSS) 🌱

> **Converting Real-Time Weather, Regional Crop Heuristics & Soil Data into Actionable, Low-Risk Sowing & Harvest Decisions**  
> *Production-Ready Web Application & Agro-Climatic Intelligence Platform*

[![Vercel Deployment](https://img.shields.io/badge/Production-Live%20on%20Vercel-success?style=flat&logo=vercel)](https://farm-decision-support-system.vercel.app)
[![React](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite%20%2B%20Tailwind-blue)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20%2B%20Python%203.14-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Tests](https://img.shields.io/badge/Pytest-14%2F14%20Passing-brightgreen)](https://github.com/shauryawankhade1923-creator/farm-decision-support-system)
[![Multilingual](https://img.shields.io/badge/Languages-English%20%7C%20%E0%A4%AE%E0%A4%B0%E0%A4%BE%E0%A4%A0%E0%A5%80%20%7C%20%E0%A4%B9%E0%A4%BF%E0%A4%82%E0%A4%A6%E0%A5%80-orange)](#-multilingual-support)

---

## 🌐 Live Production Application

🔗 **Official Deployment:** [https://farm-decision-support-system.vercel.app](https://farm-decision-support-system.vercel.app)  
📦 **GitHub Repository:** [shauryawankhade1923-creator/farm-decision-support-system](https://github.com/shauryawankhade1923-creator/farm-decision-support-system)

---

## 🎯 The Core Problem & Agronomic Approach

Farmers do not suffer from a lack of raw weather apps. Apps like *Meghdoot* and *Mausam* display district-level rainfall graphs and temperatures.

**The Real Gap:** The smallholder farmer must still transform uncertain forecast percentages into a high-stakes financial gamble:
> *"Should I risk ₹15,000–₹40,000 in seed, fertilizer, and tractor rental by sowing tomorrow, or should I wait?"*

### Differentiation Matrix

| Capability | Standard Weather Apps (Meghdoot / AccuWeather) | Farm Decision Support System (FDSS) |
| :--- | :--- | :--- |
| **Forecast Role** | Raw output (displays rain charts) | **Input only** (processed by the decision engine) |
| **Hyperlocal Personalization** | Generic district weather summary | **Calibrated to soil depth, black/red/medium soil type, and irrigation access** |
| **Decision Recommendations** | Monolithic text advisory | **4 Ranked Options with Risk Levels** (*Sow Now / Wait / Irrigate & Sow / Change Crop*) |
| **Explainability** | Meteorology statistics | **Plain-Language Agronomic Logic & Multi-Language** (*"Why this recommendation"*) |
| **Crop Specificity** | Broad regional lists | **Regional Agronomic Profiles** (*Soybean, Cotton, Groundnut JL 24, Tur, Gram, Jowar, Bajra, Maize, Wheat*) |
| **Offline & Reliability** | Fails silently on network drop | **Transparent Weather Status (Live Open-Meteo vs Offline Demo) + Dual-Engine (Cloud API / Browser Fallback)** |

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
│   │   │   ├── WeatherStrip.jsx            # 7-day microclimate timeline with missing value guards
│   │   │   └── OnboardingModal.jsx         # 3-step walkthrough for first-time farmers
│   │   ├── screens/                        # Application Screens
│   │   │   ├── HomeScreen.jsx              # Dashboard, district selector, live weather & crops
│   │   │   ├── FarmDetailsScreen.jsx       # Field plot calibration (soil, irrigation, date)
│   │   │   ├── DecisionScreen.jsx          # Live weather source pills, horizon notices & verdict
│   │   │   ├── ExplanationScreen.jsx       # Transparent rule engine scoring breakdown & radar charts
│   │   │   ├── CompareOptionsScreen.jsx    # 4-option comparative matrix & yield analytics
│   │   │   ├── SavedFieldsScreen.jsx       # Tenant-isolated farm plots & 1-click re-evaluation
│   │   │   ├── ProfileScreen.jsx           # Farmer profile, credentials, DPDP rights & actions
│   │   │   ├── PrivacyPolicyScreen.jsx     # DPDP Act 2023 compliant privacy policy
│   │   │   ├── TermsScreen.jsx             # Advisory disclaimers & Terms of Service
│   │   │   └── NotFoundScreen.jsx          # Agricultural-themed 404 error page
│   │   ├── services/                       # Client Business Logic & Security
│   │   │   ├── api.js                      # Central API client with automatic Bearer token injection
│   │   │   ├── authService.js              # Real auth, token sessions, brute-force limiter & demo user
│   │   │   ├── clientDecisionEngine.js     # Standalone offline-capable decision algorithm
│   │   │   ├── backupService.js            # User-scoped JSON export, import & tenant mapping
│   │   │   ├── analyticsService.js         # Privacy-friendly event tracking with opt-out
│   │   │   ├── errorTracker.js             # Global unhandled error & rejection capture
│   │   │   └── rateLimiter.js              # Action throttling & debounce utility
│   │   └── locales/                        # Multilingual Dictionary (EN, MR, HI)
│   └── public/crops/                       # Botanical crop photography
│
└── backend/                                # FastAPI Cloud API (Python 3.14)
    ├── app/
    │   ├── main.py                         # REST API, strict CORS, rate-limiting & auth guards
    │   ├── decision_engine.py              # Rule-based agronomic evaluation & horizon validation
    │   ├── weather_service.py              # Open-Meteo forecast with explicit offline simulation flags
    │   ├── database.py                     # SQLite / ORM with automatic user_id tenant migrations
    │   ├── models.py                       # Pydantic schemas with coordinate & date format validators
    │   └── crop_rules.py                   # Regional crop requirements, germination days & thresholds
    └── tests/                              # Automated Pytest suite (14/14 passing)
        ├── test_decision_engine.py         # Deterministic sowing/harvest verdicts & dry-gap tests
        └── test_reliability_and_security.py# Weather metadata, horizon validation, tenant isolation & auth
```

---

## 🌦️ Weather Integration & Data Transparency

The platform integrates directly with the **Open-Meteo Numerical Weather Prediction (NWP) API** (using ECMWF / GFS ensemble models):

1. **Explicit Data Provenance:** Every response returns `weather_metadata` specifying:
   - `is_live`: Boolean flag indicating whether data was fetched live from the provider.
   - `source`: `"Open-Meteo (ECMWF/GFS Seamless Ensemble)"` or `"Offline Demonstration Scenario"`.
   - `forecast_period`: Sowing analysis window (e.g., `2026-06-20 to 2026-06-29`).
   - `warning`: Prominent alert banner if live weather service is unreachable.
2. **Never Silently Fabricating Weather:** If the external weather API times out or is unreachable, the system explicitly marks data as an offline demonstration and displays a warning advising farmers not to make financial decisions on simulated forecasts.
3. **Safe Missing Value Handling:** The frontend cleanly distinguishes between `0.0 mm` (a valid dry sunny day) versus `null` / `undefined` (missing telemetry), rendering `-- mm` instead of masking missing values.
4. **Coordinate Validation:** Validates `-90 <= lat <= 90` and `-180 <= lng <= 180` before executing weather queries.

---

## 🌾 Agricultural Decision Engine & Honest Scoring

### Honest Score Labeling
The system uses the honest label **"Rule-Based Agronomic Suitability Score"** (or **"Harvest Safety Index"**). It evaluates agronomic risk factors against regional crop calendars and moisture rules. It is **not** described as an uncalibrated "statistical probability of crop success".

### Forecast Horizon & Future Date Validation
- **10-Day Meteorological Limit:** Sowing dates are validated against the 10-day forecast horizon. Requests exceeding 10 days trigger an explicit `sowing_date_horizon_warning` informing the user that weather forecasts beyond 10 days carry high uncertainty.
- **Strict Wait Window Verification:** The engine only recommends a future date if the forecast across that future germination window actually meets $\ge 70\%$ of the crop's rainfall requirement and contains **zero dry gap** during seedling emergence.

### Scoring Formula
For any selected crop and intended sowing date over a 7-day forward window:
$$\text{Score} = \text{RainScore}_{(0-40)} + \text{DryGapScore}_{(0-25)} + \text{WindowScore}_{(0-20)} + \text{SoilScore}_{(0-10)} + \text{IrrigationScore}_{(0-5)}$$

- **Rainfall Requirement (0–40 pts):** Cumulative 7-day rainfall evaluated against crop minimum thresholds (e.g. 40mm for Soybean, 35mm for Cotton).
- **Dry Spell Avoidance (0–25 pts):** Scans for 3+ consecutive dry days ($<1.5\text{ mm}$) during the crop's germination phase (e.g. 6 days for Soybean).
- **Agro-Climatic Window (0–20 pts):** Evaluated against regional Kharif (June–July) or Rabi (October–November) planting periods.
- **Soil Match (0–10 pts):** Evaluated against soil moisture retention (heavy black soil vs light sandy loam).
- **Irrigation Availability (0–5 pts):** Buffers potential rainfall deficits.

**Verdicts:**
- $\text{Score} \ge 75$ $\rightarrow$ **SOW NOW** 🟢
- $45 \le \text{Score} < 75$ $\rightarrow$ **WAIT** 🟡 *(dynamically identifies verified safe future window)*
- $\text{Score} < 45$ $\rightarrow$ **CONSIDER ANOTHER CROP** 🔴 *(recommends drought-tolerant alternative crops)*

---

## 🔒 Security, Authorization & Farmer Data Privacy

1. **Multi-Tenant Row Level Isolation:**
   - Every saved farm plot, field measurement, and consultation history is strictly bound to `user_id`.
   - The backend validates authentication tokens via the `get_auth_user_id` FastAPI dependency. Farmers cannot read, modify, or delete another user's fields or history.
2. **Automated Database Migrations:**
   - Database initialization automatically inspects existing SQLite tables and executes non-destructive `ALTER TABLE` migrations to ensure `user_id` columns exist.
3. **CORS Hardening:**
   - Strict origin allowlist (`https://farm-decision-support-system.vercel.app`, local dev servers, and verified Vercel preview deployments via regex). Wildcard `*` with credentials is strictly disallowed.
4. **Input Validation:**
   - Pydantic models validate latitude/longitude bounds, ISO-8601 date strings (`YYYY-MM-DD`), non-empty crop names, and sanitized comment fields.
5. **No Secrets on Frontend:**
   - No private database credentials or third-party secret tokens are exposed in client builds.
6. **Account Deletion & Data Rights:**
   - Compliant with the Digital Personal Data Protection (DPDP) Act 2023. Account deletion strictly verifies the authenticated caller's identity before removing records.

---

## 🗄️ Database Architecture & Cloud Persistence Notes

- **Current Implementation:** SQLite (`fdss.db`) with automatic table migrations and an administrative backup routine (`/api/admin/backup`).
- **Production Serverless Consideration:** When deploying the FastAPI backend to serverless platforms (e.g., Vercel Serverless Functions, AWS Lambda), container instances have ephemeral filesystems. File writes to SQLite are discarded when containers cycle.
- **Recommended Production Path:**
  - For long-term production persistence of user data, migrate `backend/app/database.py` connection string to managed PostgreSQL (e.g. Supabase, Neon, or Google Cloud SQL) using SQLAlchemy or `asyncpg`.
  - The frontend client already includes an isolated browser-scoped local backup store (`backupService.js`), ensuring complete functionality even when backend storage is offline.

---

## 🌐 Multilingual Support

The entire application can be toggled in real time into three languages:
- **English** (Default)
- **मराठी (Marathi)** — Native language for Vidarbha & Marathwada farmers
- **हिंदी (Hindi)** — Widely understood across central and northern India

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

## 🚀 Running Locally

### Prerequisites
- Node.js 18+ & npm
- Python 3.11+ (Python 3.14 compatible)

### Environment Variables

Create `.env` in `frontend/`:
```env
VITE_API_URL=http://localhost:8000
```

Create `.env` in `backend/`:
```env
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
SECRET_KEY=your-secure-backend-jwt-secret-key-change-in-production
ALGORITHM=HS256
```

### 1. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173).

### 2. Backend Setup
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
python -m pytest tests -v
```
**Test Results: 14/14 tests passing:**
- Deterministic sowing verdict evaluation inside the optimal calendar window.
- Dry spell detection during the seedling germination phase.
- Wait verdict triggering on prolonged dry gap with dynamic window calculation.
- Alternative crop recommendations for low-moisture scenarios.
- Harvest timing decision engine (pre-rain emergency, immature wait, dry-spell window).
- Forecast horizon validation (warning when requested date exceeds 10-day NWP limit).
- Geographic coordinate boundary validation (`-90 <= lat <= 90`, `-180 <= lng <= 180`).
- Weather service metadata and explicit offline demonstration identification.
- Multi-tenant data isolation for saved fields (`list_fields`, `add_field`, `delete_field`).
- Multi-tenant data isolation for consultation history (`list_history`, `delete_history_item`).

---

## 📄 License & Advisory Disclaimer

This project is licensed under the MIT License. Agricultural recommendations are generated based on regional agro-climatic heuristics, rainfall thresholds, and public numerical weather prediction APIs. Actual farm sowing decisions should always consider local ground observations and extension personnel recommendations.
