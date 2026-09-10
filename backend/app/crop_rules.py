"""
Crop Rules Table for Farm Decision Support System.
Values are calibrated based on general ICAR (Indian Council of Agricultural Research)
and Krishi Vigyan Kendra (KVK) regional crop calendars for Maharashtra and central India.

NOTE: These values are illustrative rule thresholds designed for decision support
and prototype validation; they should be verified against local agro-climatic advisories.
"""

from typing import Dict, Any, List

CROP_RULES: Dict[str, Dict[str, Any]] = {
    "Soybean": {
        "crop_name": "Soybean",
        "local_names": {
            "mr": "सोयाबीन (Soybean)",
            "hi": "सोयाबीन (Soybean)"
        },
        "season": "Kharif",
        "ideal_sowing_window_start": "06-10",  # June 10
        "ideal_sowing_window_end": "07-15",    # July 15
        "min_rainfall_mm_7day": 40.0,            # Needs 40-50mm steady moisture for germination
        "germination_days": 6,                   # 5-7 days to germinate
        "drought_sensitivity": "high",         # Seeds shrivel if surface soil dries out within 5 days
        "suitable_soils": ["medium", "heavy"],   # Medium black to deep black soils
        "optimal_temp_min_c": 20.0,
        "optimal_temp_max_c": 35.0,
        "description": "Major oilseed crop in central India. Highly vulnerable to dry spells immediately post-germination.",
        "alternatives_if_dry": ["Maize", "Groundnut"],
        "alternatives_if_wet": ["Cotton"],
        # Harvest Parameters (Calibrated with ICAR/KVK regional calendars; illustrative for decision support)
        "maturity_days": 100,                  # Typically 95-110 days for JS-335 / JS-9305 varieties
        "harvest_window_days": 10,             # Standing pods shatter and drop seeds if left past 10-12 days
        "harvest_rain_risk_mm": 5.0,           # >5mm on mature pods causes pod-shattering and grain moulding
        "post_harvest_dry_days_needed": 3      # Days of clear sun required for safe moisture reduction to <12%
    },
    "Cotton": {
        "crop_name": "Cotton",
        "local_names": {
            "mr": "कापूस (Cotton)",
            "hi": "कपास (Cotton)"
        },
        "season": "Kharif",
        "ideal_sowing_window_start": "05-25",  # May 25 (irrigated) to June 30
        "ideal_sowing_window_end": "07-10",    # July 10
        "min_rainfall_mm_7day": 35.0,            # 35mm minimum
        "germination_days": 7,                   # 6-9 days
        "drought_sensitivity": "medium",       # Deep taproot develops early, but seedling needs moisture
        "suitable_soils": ["medium", "heavy"],   # Deep black cotton soils (regur)
        "optimal_temp_min_c": 22.0,
        "optimal_temp_max_c": 38.0,
        "description": "Cash crop grown extensively in Vidarbha, Marathwada & Khandesh. Requires good soil depth.",
        "alternatives_if_dry": ["Soybean", "Maize"],
        "alternatives_if_wet": ["Soybean"],
        # Harvest Parameters (Calibrated with ICAR/KVK regional calendars; illustrative for decision support)
        "maturity_days": 160,                  # First picking typically around 150-165 days
        "harvest_window_days": 20,             # Open bolls can stand 15-20 days before lint discoloration
        "harvest_rain_risk_mm": 10.0,          # Rain discolors lint and dampens fiber quality
        "post_harvest_dry_days_needed": 4      # Days needed to sun-dry picked seed cotton
    },
    "Maize": {
        "crop_name": "Maize",
        "local_names": {
            "mr": "मका (Maize)",
            "hi": "मक्का (Maize)"
        },
        "season": "Kharif / Rabi",
        "ideal_sowing_window_start": "06-05",  # June 5
        "ideal_sowing_window_end": "07-20",    # July 20
        "min_rainfall_mm_7day": 30.0,            # Moderate water need
        "germination_days": 5,                   # 4-6 days
        "drought_sensitivity": "medium",       # Faster germination, can tolerate moderate dry spells
        "suitable_soils": ["light", "medium", "heavy"], # Adaptable to well-drained soils
        "optimal_temp_min_c": 18.0,
        "optimal_temp_max_c": 36.0,
        "description": "Fast-growing cereal with strong seedling vigor and adaptable soil tolerance.",
        "alternatives_if_dry": ["Groundnut"],
        "alternatives_if_wet": ["Soybean"],
        # Harvest Parameters (Calibrated with ICAR/KVK regional calendars; illustrative for decision support)
        "maturity_days": 95,                   # 90-105 days for grain maturity
        "harvest_window_days": 12,             # Husks protect cobs, but lodging risk increases
        "harvest_rain_risk_mm": 10.0,          # Rain causes ear rots and Aspergillus aflatoxin risk
        "post_harvest_dry_days_needed": 3      # Cobs need rapid dehulling and sun-drying
    },
    "Wheat": {
        "crop_name": "Wheat",
        "local_names": {
            "mr": "गहू (Wheat)",
            "hi": "गेहूं (Wheat)"
        },
        "season": "Rabi",
        "ideal_sowing_window_start": "10-25",  # Oct 25
        "ideal_sowing_window_end": "12-10",    # Dec 10
        "min_rainfall_mm_7day": 20.0,            # Usually dependent on pre-sowing irrigation & residual moisture
        "germination_days": 6,                   # 5-7 days
        "drought_sensitivity": "high",         # Requires crown root initiation moisture
        "suitable_soils": ["medium", "heavy"],   # Fertile clay loam to heavy clay
        "optimal_temp_min_c": 15.0,
        "optimal_temp_max_c": 26.0,
        "description": "Primary winter cereal. Sown when nighttime temperatures drop below 20°C.",
        "alternatives_if_dry": ["Gram / Chickpea"],
        "alternatives_if_wet": ["Mustard"],
        # Harvest Parameters (Calibrated with ICAR/KVK regional calendars; illustrative for decision support)
        "maturity_days": 115,                  # 110-125 days in central zone
        "harvest_window_days": 10,             # Golden dry heads lodge or shatter in hail/unseasonal rain
        "harvest_rain_risk_mm": 5.0,           # >5mm causes pre-harvest grain sprouting and black point
        "post_harvest_dry_days_needed": 3      # Critical to achieve <10% storage moisture
    },
    "Groundnut": {
        "crop_name": "Groundnut",
        "local_names": {
            "mr": "भुईमूग (Groundnut)",
            "hi": "मूंगफली (Groundnut)"
        },
        "season": "Kharif",
        "ideal_sowing_window_start": "06-10",  # June 10
        "ideal_sowing_window_end": "07-15",    # July 15
        "min_rainfall_mm_7day": 30.0,            # 30mm well-distributed
        "germination_days": 6,                   # 5-8 days
        "drought_sensitivity": "low",          # Legume with moderate initial drought resilience
        "suitable_soils": ["light", "medium"],   # Light sandy loam for easy pegging
        "optimal_temp_min_c": 20.0,
        "optimal_temp_max_c": 34.0,
        "description": "Oilseed legume that thrives best in friable, well-drained sandy or light loamy soils.",
        "alternatives_if_dry": ["Maize"],
        "alternatives_if_wet": ["Soybean"],
        # Harvest Parameters (Calibrated with ICAR/KVK regional calendars; illustrative for decision support)
        "maturity_days": 105,                  # 100-115 days for bunch types
        "harvest_window_days": 8,              # Over-mature pods detach and stay in soil when pulled
        "harvest_rain_risk_mm": 8.0,           # Damp soil rots harvested pods and triggers aflatoxin
        "post_harvest_dry_days_needed": 4      # Pods need thorough sun-drying for 4-5 days before bag storage
    }
}

def get_crop_rule(crop_name: str) -> Dict[str, Any]:
    for name, rule in CROP_RULES.items():
        if name.lower() == crop_name.lower():
            return rule
    # Default fallback
    return CROP_RULES["Soybean"]

def list_supported_crops() -> List[Dict[str, Any]]:
    return [
        {
            "name": name,
            "season": rule["season"],
            "description": rule["description"],
            "suitable_soils": rule["suitable_soils"],
            "min_rainfall_mm_7day": rule["min_rainfall_mm_7day"],
            "germination_days": rule["germination_days"]
        }
        for name, rule in CROP_RULES.items()
    ]
