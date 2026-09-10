from datetime import datetime, timedelta
from typing import List, Dict, Any, Tuple, Optional
import os
import joblib
import pandas as pd
from .models import (
    FarmerInput, HarvestInput, WeatherDay, ComparisonOption, DecisionSummary,
    RecommendedWindow, DecisionResponse
)
from .crop_rules import get_crop_rule, CROP_RULES

# Load Trained Machine Learning Model Artifacts
_ML_MODEL = None
_ML_METADATA = None

try:
    _ml_dir = os.path.join(os.path.dirname(__file__), "ml")
    _model_path = os.path.join(_ml_dir, "sowing_risk_model.joblib")
    _meta_path = os.path.join(_ml_dir, "model_metadata.joblib")
    if os.path.exists(_model_path) and os.path.exists(_meta_path):
        _ML_MODEL = joblib.load(_model_path)
        _ML_METADATA = joblib.load(_meta_path)
        print("[ML Engine] Random Forest Sowing Emergence Predictor successfully loaded.")
except Exception as e:
    print(f"[ML Engine] Could not load ML model: {e}")

def predict_sowing_success_ml(
    crop: str,
    soil_type: str,
    irrigation: bool,
    sowing_date_str: str,
    rainfall_7d: float,
    has_dry_gap: bool,
    avg_temp: float
) -> Optional[Dict[str, Any]]:
    """
    Infers germination & emergence success probability using the trained RandomForest model.
    """
    if _ML_MODEL is None or _ML_METADATA is None:
        return None
        
    crop_map = _ML_METADATA.get("crop_map", {})
    soil_map = _ML_METADATA.get("soil_map", {})
    
    crop_idx = crop_map.get(crop, 0)
    soil_idx = soil_map.get(soil_type.lower(), 1)
    irrig_int = 1 if irrigation else 0
    dry_gap_int = 1 if has_dry_gap else 0
    
    try:
        dt = datetime.strptime(sowing_date_str, "%Y-%m-%d")
        day_of_year = dt.timetuple().tm_yday
    except Exception:
        day_of_year = 180
        
    features = [
        crop_idx,
        soil_idx,
        irrig_int,
        day_of_year,
        float(rainfall_7d),
        dry_gap_int,
        float(avg_temp)
    ]
    
    try:
        feature_cols = ["crop_idx", "soil_idx", "irrigation", "day_of_year", "rain_7d", "has_dry_gap", "temp_mean"]
        X_df = pd.DataFrame([features], columns=feature_cols)
        prob = float(_ML_MODEL.predict_proba(X_df)[0][1])
        prediction = int(_ML_MODEL.predict(X_df)[0])
        
        return {
            "model_name": _ML_METADATA.get("model_name", "Random Forest Classifier v1.0"),
            "success_probability_pct": round(prob * 100, 1),
            "predicted_class": "Favorable Emergence" if prediction == 1 else "Emergence Stress / Failure Risk",
            "model_accuracy_pct": round(_ML_METADATA.get("accuracy", 0.76) * 100, 1),
            "model_roc_auc": _ML_METADATA.get("roc_auc", 0.83),
            "top_drivers": {
                "Rainfall Trajectory (7-day)": "49.0%",
                "Temperature Profile": "11.4%",
                "Seasonal Calendar Timing": "11.3%",
                "Dry-Spell Persistence": "11.0%",
                "Irrigation Buffer": "10.6%"
            }
        }
    except Exception as e:
        print(f"[ML Engine] Inference failed: {e}")
        return None

def check_date_in_window(date_str: str, start_md: str, end_md: str) -> bool:
    """
    Checks if a date (YYYY-MM-DD) falls between MM-DD start and end dates.
    Handles wraparound (e.g., Nov to Feb).
    """
    try:
        dt = datetime.strptime(date_str, "%Y-%m-%d")
        cur_md = dt.strftime("%m-%d")
        
        if start_md <= end_md:
            return start_md <= cur_md <= end_md
        else:
            # Wraps across year-end (e.g. Rabi season 10-25 to 02-15)
            return cur_md >= start_md or cur_md <= end_md
    except Exception:
        return True

def detect_dry_gap(forecast_slice: List[WeatherDay], germination_days: int, threshold_mm: float = 1.5) -> bool:
    """
    Detects if there are 3 or more consecutive days with near-zero rainfall (< 1.5mm)
    within the crop's germination window starting from sowing date.
    """
    window = forecast_slice[:germination_days]
    consecutive_dry = 0
    for day in window:
        if day.precipitation_mm < threshold_mm:
            consecutive_dry += 1
            if consecutive_dry >= 3:
                return True
        else:
            consecutive_dry = 0
    return False

def calculate_wait_period(all_forecast: List[WeatherDay], crop_rule: Dict[str, Any]) -> int:
    """
    Scans days forward (1 to 5 days ahead) to find the first sowing offset
    where rainfall stabilizes and the dry-gap clears or improved rainfall arrives.
    Defaults to 3-4 days if no perfect window is found within 7 days.
    """
    germ_days = crop_rule["germination_days"]
    for offset in range(1, 6):
        if offset + germ_days <= len(all_forecast):
            slice_ahead = all_forecast[offset:offset + germ_days]
            if not detect_dry_gap(slice_ahead, germ_days):
                # Found clean germination window!
                return offset
    return 3  # Realistic default recommendation for break monsoon spells

def evaluate_decision(
    farmer_input: FarmerInput,
    forecast: List[WeatherDay]
) -> DecisionResponse:
    crop_rule = get_crop_rule(farmer_input.crop)
    
    # 1. Align forecast with intended sowing date if available, or use first 7 days
    start_idx = 0
    for idx, day in enumerate(forecast):
        if day.date == farmer_input.intended_sowing_date:
            start_idx = idx
            break
            
    seven_day_forecast = forecast[start_idx:start_idx + 7]
    if len(seven_day_forecast) < 7:
        seven_day_forecast = forecast[:7]
        
    rainfall_7d = sum(d.precipitation_mm for d in seven_day_forecast)
    avg_temp = sum(d.temp_mean_c for d in seven_day_forecast) / max(len(seven_day_forecast), 1)
    
    # 2. Rule evaluations
    # Rule 1: Minimum rainfall (40 pts)
    min_req_rain = crop_rule["min_rainfall_mm_7day"]
    rainfall_passed = rainfall_7d >= min_req_rain
    rainfall_score = 40 if rainfall_passed else int(max(0, (rainfall_7d / min_req_rain) * 40 * 0.7))
    
    # Rule 2: Germination dry gap (25 pts)
    has_dry_gap = detect_dry_gap(seven_day_forecast, crop_rule["germination_days"])
    dry_gap_passed = not has_dry_gap
    dry_gap_score = 25 if dry_gap_passed else 0
    
    # Rule 3: Ideal sowing calendar window (20 pts)
    in_sowing_window = check_date_in_window(
        farmer_input.intended_sowing_date,
        crop_rule["ideal_sowing_window_start"],
        crop_rule["ideal_sowing_window_end"]
    )
    window_score = 20 if in_sowing_window else 5
    
    # Rule 4: Soil suitability (10 pts)
    soil_match = farmer_input.soil_type.lower() in [s.lower() for s in crop_rule["suitable_soils"]]
    soil_score = 10 if soil_match else 2
    
    # Rule 5: Irrigation bonus (5 pts)
    irrigation_score = 5 if farmer_input.irrigation_available else 0
    
    total_score = rainfall_score + dry_gap_score + window_score + soil_score + irrigation_score
    confidence_pct = min(95, max(30, total_score))
    
    # 3. Verdict Determination
    if total_score >= 75:
        verdict = "SOW NOW"
        verdict_badge = "Green"
        overall_risk = "Low"
    elif 45 <= total_score < 75:
        verdict = "WAIT"
        verdict_badge = "Amber"
        overall_risk = "Medium"
    else:
        verdict = "CONSIDER ANOTHER CROP"
        verdict_badge = "Red"
        overall_risk = "High"

    # 4. Wait days calculation & recommended window
    wait_days = calculate_wait_period(forecast, crop_rule)
    try:
        intended_dt = datetime.strptime(farmer_input.intended_sowing_date, "%Y-%m-%d")
    except Exception:
        intended_dt = datetime.now()

    if verdict == "SOW NOW":
        rec_start = intended_dt.strftime("%Y-%m-%d")
        rec_end = (intended_dt + timedelta(days=3)).strftime("%Y-%m-%d")
    elif verdict == "WAIT":
        rec_start = (intended_dt + timedelta(days=wait_days)).strftime("%Y-%m-%d")
        rec_end = (intended_dt + timedelta(days=wait_days + 4)).strftime("%Y-%m-%d")
    else:
        # For alternate crop, suggest next seasonal window
        rec_start = (intended_dt + timedelta(days=7)).strftime("%Y-%m-%d")
        rec_end = (intended_dt + timedelta(days=14)).strftime("%Y-%m-%d")
        
    recommended_window = RecommendedWindow(start=rec_start, end=rec_end)
    
    # 5. Build Summary Object
    summary = DecisionSummary(
        rainfall_next_7_days_mm=round(rainfall_7d, 1),
        avg_temperature_c=round(avg_temp, 1),
        crop_min_rainfall_mm=min_req_rain,
        risk_level=overall_risk,
        soil_match=soil_match,
        in_sowing_window=in_sowing_window,
        has_dry_gap=has_dry_gap,
        irrigation_available=farmer_input.irrigation_available,
        field_prepared=farmer_input.field_prepared
    )
    
    # 6. Score breakdown for transparency
    score_breakdown = {
        "rainfall_score": {"score": rainfall_score, "max": 40, "passed": rainfall_passed, "val": round(rainfall_7d, 1), "required": min_req_rain},
        "dry_gap_score": {"score": dry_gap_score, "max": 25, "passed": dry_gap_passed, "has_gap": has_dry_gap},
        "window_score": {"score": window_score, "max": 20, "passed": in_sowing_window, "date": farmer_input.intended_sowing_date},
        "soil_score": {"score": soil_score, "max": 10, "passed": soil_match, "soil_type": farmer_input.soil_type},
        "irrigation_score": {"score": irrigation_score, "max": 5, "passed": farmer_input.irrigation_available},
        "total_score": total_score
    }
    
    # 7. Generate Plain Language Narrative Explanation
    explanation = _generate_plain_explanation(
        verdict=verdict,
        crop_name=farmer_input.crop,
        rainfall_7d=rainfall_7d,
        min_req_rain=min_req_rain,
        has_dry_gap=has_dry_gap,
        germ_days=crop_rule["germination_days"],
        wait_days=wait_days,
        irrigation_available=farmer_input.irrigation_available,
        field_prepared=farmer_input.field_prepared,
        soil_match=soil_match,
        soil_type=farmer_input.soil_type,
        in_sowing_window=in_sowing_window
    )
    
    # 8. Core Differentiator: Compare Options Generation (All 4 Options)
    options = _generate_comparison_options(
        verdict=verdict,
        crop_name=farmer_input.crop,
        crop_rule=crop_rule,
        rainfall_7d=rainfall_7d,
        min_req_rain=min_req_rain,
        has_dry_gap=has_dry_gap,
        wait_days=wait_days,
        irrigation_available=farmer_input.irrigation_available,
        field_prepared=farmer_input.field_prepared,
        in_sowing_window=in_sowing_window,
        soil_match=soil_match
    )
    
    # 9. ML Predictive Intelligence (Multi-season Random Forest Inference)
    ml_prediction = predict_sowing_success_ml(
        crop=farmer_input.crop,
        soil_type=farmer_input.soil_type,
        irrigation=farmer_input.irrigation_available,
        sowing_date_str=farmer_input.intended_sowing_date,
        rainfall_7d=rainfall_7d,
        has_dry_gap=has_dry_gap,
        avg_temp=avg_temp
    )
    
    return DecisionResponse(
        verdict=verdict,
        verdict_badge=verdict_badge,
        confidence_pct=confidence_pct,
        recommended_window=recommended_window,
        summary=summary,
        explanation=explanation,
        options=options,
        daily_forecast=seven_day_forecast,
        score_breakdown=score_breakdown,
        crop_info=crop_rule,
        ml_prediction=ml_prediction
    )

def _generate_plain_explanation(
    verdict: str,
    crop_name: str,
    rainfall_7d: float,
    min_req_rain: float,
    has_dry_gap: bool,
    germ_days: int,
    wait_days: int,
    irrigation_available: bool,
    field_prepared: bool,
    soil_match: bool,
    soil_type: str,
    in_sowing_window: bool
) -> str:
    parts = []
    
    if verdict == "SOW NOW":
        parts.append(f"Conditions for sowing {crop_name} are currently favorable.")
        if rainfall_7d >= min_req_rain:
            parts.append(f"The 7-day rainfall outlook shows sufficient moisture ({rainfall_7d:.0f} mm vs {min_req_rain:.0f} mm needed) without prolonged dry spells during the {germ_days}-day germination phase.")
        elif irrigation_available:
            parts.append(f"While natural rainfall is moderate ({rainfall_7d:.0f} mm), your available irrigation will comfortably sustain the seedlings through germination.")
            
        if not field_prepared:
            parts.append("Note: Ensure land preparation and harrowing are completed promptly before seed placement to avoid moisture loss.")
            
    elif verdict == "WAIT":
        parts.append(f"We recommend waiting {wait_days} to {wait_days + 2} days before sowing {crop_name}.")
        if has_dry_gap:
            parts.append(f"Although some rainfall is recorded, a 3+ day dry gap is expected right after sowing. {crop_name} seeds require continuous soil moisture for {germ_days} days to sprout; dry soil now could lead to seed failure and expensive re-sowing.")
        elif rainfall_7d < min_req_rain:
            parts.append(f"Expected rainfall over the next week ({rainfall_7d:.0f} mm) is below the minimum {min_req_rain:.0f} mm required for optimal root establishment. Waiting for the next active monsoon pulse reduces seed mortality.")
            
        if not irrigation_available:
            parts.append("Because your field relies entirely on rainfed moisture, holding off until rain distribution stabilizes is the safest path to protect your seed investment.")
            
    else:  # CONSIDER ANOTHER CROP
        parts.append(f"Current weather and agro-climatic conditions are high-risk for {crop_name}.")
        if not in_sowing_window:
            parts.append(f"The planned sowing date falls outside the optimal ICAR sowing calendar for {crop_name}, significantly increasing temperature stress.")
        if rainfall_7d < (min_req_rain * 0.5):
            parts.append(f"Predicted rainfall ({rainfall_7d:.0f} mm) is critically low for a moisture-demanding crop like {crop_name}.")
        if not soil_match:
            parts.append(f"{soil_type.capitalize()} soil is less suitable for {crop_name}, which prefers {', '.join(get_crop_rule(crop_name)['suitable_soils'])} soil.")
        parts.append("Consider switching to a less moisture-intensive or shorter-duration crop.")
        
    return " ".join(parts)

def _generate_comparison_options(
    verdict: str,
    crop_name: str,
    crop_rule: Dict[str, Any],
    rainfall_7d: float,
    min_req_rain: float,
    has_dry_gap: bool,
    wait_days: int,
    irrigation_available: bool,
    field_prepared: bool,
    in_sowing_window: bool,
    soil_match: bool
) -> List[ComparisonOption]:
    options = []
    
    # --- Option 1: Sow Today ---
    if verdict == "SOW NOW":
        opt1_risk = "Low"
        opt1_reason = f"Optimal moisture and no critical dry gap during {crop_rule['germination_days']}-day germination."
        opt1_rec = True
    elif verdict == "WAIT":
        opt1_risk = "High"
        if has_dry_gap:
            opt1_reason = f"Rain expected today, but a subsequent dry spell risks seed desiccation before germination completes."
        else:
            opt1_reason = f"Rainfall ({rainfall_7d:.0f} mm) is insufficient to sustain seedlings without irrigation."
        opt1_rec = False
    else:
        opt1_risk = "High"
        opt1_reason = f"Severe moisture deficit or out-of-season weather presents maximum risk of complete seed loss."
        opt1_rec = False
        
    options.append(ComparisonOption(
        label="Sow Today",
        risk=opt1_risk,
        reason=opt1_reason,
        recommended=opt1_rec,
        available=field_prepared
    ))
    
    # --- Option 2: Wait N Days ---
    opt2_label = f"Wait {wait_days}-{wait_days + 2} Days"
    if verdict == "WAIT":
        opt2_risk = "Low"
        opt2_reason = f"Better rainfall probability and more uniform moisture distribution during the germination window."
        opt2_rec = True
    elif verdict == "SOW NOW":
        opt2_risk = "Medium"
        opt2_reason = f"Waiting is possible, but risks missing the current moist seedbed window and delay harvest."
        opt2_rec = False
    else:
        opt2_risk = "Medium"
        opt2_reason = f"Waiting may help catch late rain, but seasonal calendar window is closing."
        opt2_rec = False

    options.append(ComparisonOption(
        label=opt2_label,
        risk=opt2_risk,
        reason=opt2_reason,
        recommended=opt2_rec,
        available=True
    ))

    # --- Option 3: Irrigate & Sow Tomorrow ---
    if irrigation_available:
        opt3_risk = "Low"
        opt3_reason = "Controlled pre-sowing irrigation guarantees germination moisture, removing dependence on uncertain rain."
        opt3_rec = (verdict == "WAIT" and not opt1_rec and not opt2_rec)
        opt3_available = True
    else:
        opt3_risk = "High"
        opt3_reason = "Not feasible without confirmed water source; field is rainfed only."
        opt3_rec = False
        opt3_available = False

    options.append(ComparisonOption(
        label="Irrigate & Sow Tomorrow",
        risk=opt3_risk,
        reason=opt3_reason,
        recommended=opt3_rec,
        available=opt3_available
    ))

    # --- Option 4: Change Crop ---
    alts = crop_rule.get("alternatives_if_dry", ["Maize", "Groundnut"])
    alt_crop = alts[0] if alts else "Maize"
    
    if verdict == "CONSIDER ANOTHER CROP":
        opt4_risk = "Low"
        opt4_reason = f"Switching to {alt_crop} significantly reduces water demand and matches current soil/weather profile."
        opt4_rec = True
    elif verdict == "WAIT":
        opt4_risk = "Medium"
        opt4_reason = f"Consider {alt_crop} as backup if rainfall remains inadequate over the next week."
        opt4_rec = False
    else:
        opt4_risk = "Low"
        opt4_reason = f"{alt_crop} is a viable alternative, though {crop_name} is already well-suited today."
        opt4_rec = False

    options.append(ComparisonOption(
        label=f"Change Crop (e.g. {alt_crop})",
        risk=opt4_risk,
        reason=opt4_reason,
        recommended=opt4_rec,
        available=True,
        suggested_crop=alt_crop
    ))

    # Ensure exactly one option is marked recommended (if none yet, choose safest)
    has_rec = any(o.recommended for o in options)
    if not has_rec:
        if verdict == "SOW NOW":
            options[0].recommended = True
        elif verdict == "WAIT":
            options[1].recommended = True
        else:
            options[3].recommended = True

    return options

def score_harvest_decision(
    harvest_input: HarvestInput,
    forecast: List[WeatherDay],
    current_date_str: str = None
) -> DecisionResponse:
    """
    Evaluates harvest readiness, incoming rainfall damage risk, and post-harvest drying window.
    
    Days since sowing = today - actual_sowing_date
    is_mature = days_since_sowing >= crop.maturity_days
    
    Scoring:
      if is_mature: score += 35
      if rainfall_next_5_days <= crop.harvest_rain_risk_mm: score += 30
      if dry_days_after_today >= crop.post_harvest_dry_days_needed: score += 20
      if days_since_sowing <= crop.maturity_days + crop.harvest_window_days: score += 15
    
    Verdict priority:
      1. if not is_mature -> "WAIT" (amber) — show days remaining until maturity
      2. elif rainfall_next_2_days > crop.harvest_rain_risk_mm -> "HARVEST BEFORE INCOMING RAIN" (red, urgent)
      3. elif score >= 70 -> "HARVEST NOW" (green)
      4. else -> "WAIT" (amber) — suggest the best harvest day within the upcoming dry window
    """
    crop_rule = get_crop_rule(harvest_input.crop)
    
    # 1. Parse dates and compute days since sowing
    try:
        sowing_dt = datetime.strptime(harvest_input.actual_sowing_date, "%Y-%m-%d")
    except Exception:
        sowing_dt = datetime.now() - timedelta(days=crop_rule.get("maturity_days", 100))
        
    if current_date_str:
        try:
            today_dt = datetime.strptime(current_date_str, "%Y-%m-%d")
        except Exception:
            today_dt = datetime.now()
    else:
        # Use first date in forecast or today
        if forecast and len(forecast) > 0:
            try:
                today_dt = datetime.strptime(forecast[0].date, "%Y-%m-%d")
            except Exception:
                today_dt = datetime.now()
        else:
            today_dt = datetime.now()
            
    days_since_sowing = max(0, (today_dt - sowing_dt).days)
    
    maturity_days = crop_rule.get("maturity_days", 100)
    harvest_window_days = crop_rule.get("harvest_window_days", 10)
    harvest_rain_risk_mm = crop_rule.get("harvest_rain_risk_mm", 5.0)
    post_harvest_dry_days_needed = crop_rule.get("post_harvest_dry_days_needed", 3)
    
    is_mature = days_since_sowing >= maturity_days
    days_remaining_to_maturity = max(0, maturity_days - days_since_sowing)
    within_harvest_window = days_since_sowing <= (maturity_days + harvest_window_days)
    
    # 2. Weather trajectory calculations
    next_2_days_forecast = forecast[:2] if len(forecast) >= 2 else forecast
    next_5_days_forecast = forecast[:5] if len(forecast) >= 5 else forecast
    seven_day_forecast = forecast[:7] if len(forecast) >= 7 else forecast
    
    rainfall_next_2_days = sum(d.precipitation_mm for d in next_2_days_forecast)
    rainfall_next_5_days = sum(d.precipitation_mm for d in next_5_days_forecast)
    rainfall_7d = sum(d.precipitation_mm for d in seven_day_forecast)
    avg_temp = sum(d.temp_mean_c for d in seven_day_forecast) / max(len(seven_day_forecast), 1)
    
    # Calculate consecutive dry days after today (days with precip < 1.5mm)
    dry_days_after_today = 0
    for d in forecast[1:6]:
        if d.precipitation_mm < 1.5:
            dry_days_after_today += 1
        else:
            break
            
    # Also find the best upcoming dry day index in next 7 days for waiting advice
    best_dry_day_offset = 2
    for offset in range(1, min(len(forecast) - 2, 5)):
        window = forecast[offset:offset + post_harvest_dry_days_needed]
        if all(day.precipitation_mm < 1.5 for day in window):
            best_dry_day_offset = offset
            break

    # 3. Transparent Scoring Calculation
    score = 0
    maturity_score = 35 if is_mature else 0
    score += maturity_score
    
    rain_5d_score = 30 if rainfall_next_5_days <= harvest_rain_risk_mm else int(max(0, 30 * (1 - (rainfall_next_5_days / (harvest_rain_risk_mm * 3)))))
    score += rain_5d_score
    
    dry_window_score = 20 if dry_days_after_today >= post_harvest_dry_days_needed else int(20 * (dry_days_after_today / max(post_harvest_dry_days_needed, 1)))
    score += dry_window_score
    
    window_limit_score = 15 if within_harvest_window else 0
    score += window_limit_score
    
    # Bonus for storage availability (mitigates post-harvest drying risk)
    storage_bonus = 5 if harvest_input.storage_available else 0
    total_score = min(score + storage_bonus, 95)
    confidence_pct = total_score
    
    # 4. Verdict Priority Logic
    # Priority 1: Not mature
    if not is_mature:
        verdict = "WAIT"
        verdict_badge = "Amber"
        risk_level = "Medium"
        rec_start = (today_dt + timedelta(days=days_remaining_to_maturity)).strftime("%Y-%m-%d")
        rec_end = (today_dt + timedelta(days=days_remaining_to_maturity + harvest_window_days)).strftime("%Y-%m-%d")
    # Priority 2: Mature & high rain in next 2 days (> harvest_rain_risk_mm)
    elif rainfall_next_2_days > harvest_rain_risk_mm:
        verdict = "HARVEST BEFORE INCOMING RAIN"
        verdict_badge = "Red"
        risk_level = "High"
        confidence_pct = max(confidence_pct, 88)  # Urgent actionable clarity
        rec_start = today_dt.strftime("%Y-%m-%d")
        rec_end = (today_dt + timedelta(days=1)).strftime("%Y-%m-%d")
    # Priority 3: Score >= 70
    elif total_score >= 70:
        verdict = "HARVEST NOW"
        verdict_badge = "Green"
        risk_level = "Low"
        rec_start = today_dt.strftime("%Y-%m-%d")
        rec_end = (today_dt + timedelta(days=min(dry_days_after_today + 1, 4))).strftime("%Y-%m-%d")
    # Priority 4: Else wait for clear dry spell
    else:
        verdict = "WAIT"
        verdict_badge = "Amber"
        risk_level = "Medium"
        rec_start = (today_dt + timedelta(days=best_dry_day_offset)).strftime("%Y-%m-%d")
        rec_end = (today_dt + timedelta(days=best_dry_day_offset + post_harvest_dry_days_needed)).strftime("%Y-%m-%d")
        
    recommended_window = RecommendedWindow(start=rec_start, end=rec_end)
    
    # 5. Summary Object
    has_dry_gap = dry_days_after_today < post_harvest_dry_days_needed
    summary = DecisionSummary(
        rainfall_next_7_days_mm=round(rainfall_7d, 1),
        avg_temperature_c=round(avg_temp, 1),
        crop_min_rainfall_mm=round(harvest_rain_risk_mm, 1),
        risk_level=risk_level,
        soil_match=within_harvest_window,
        in_sowing_window=is_mature,
        has_dry_gap=has_dry_gap,
        irrigation_available=harvest_input.storage_available,
        field_prepared=True
    )
    
    # 6. Score Breakdown Object
    score_breakdown = {
        "maturity_score": {
            "score": maturity_score,
            "max": 35,
            "passed": is_mature,
            "days_since_sowing": days_since_sowing,
            "maturity_days": maturity_days,
            "days_remaining": days_remaining_to_maturity
        },
        "rainfall_5d_score": {
            "score": rain_5d_score,
            "max": 30,
            "passed": rainfall_next_5_days <= harvest_rain_risk_mm,
            "val": round(rainfall_next_5_days, 1),
            "threshold": harvest_rain_risk_mm,
            "rainfall_2d": round(rainfall_next_2_days, 1)
        },
        "drying_window_score": {
            "score": dry_window_score,
            "max": 20,
            "passed": dry_days_after_today >= post_harvest_dry_days_needed,
            "dry_days": dry_days_after_today,
            "required": post_harvest_dry_days_needed
        },
        "harvest_window_limit_score": {
            "score": window_limit_score,
            "max": 15,
            "passed": within_harvest_window,
            "overdue": days_since_sowing > (maturity_days + harvest_window_days)
        },
        "storage_bonus": {
            "score": storage_bonus,
            "max": 5,
            "passed": harvest_input.storage_available
        },
        "total_score": total_score
    }
    
    # 7. Generate Plain Language Narrative Explanation
    explanation = _generate_harvest_explanation(
        verdict=verdict,
        crop_name=harvest_input.crop,
        days_since_sowing=days_since_sowing,
        maturity_days=maturity_days,
        days_remaining_to_maturity=days_remaining_to_maturity,
        rainfall_next_2_days=rainfall_next_2_days,
        rainfall_next_5_days=rainfall_next_5_days,
        harvest_rain_risk_mm=harvest_rain_risk_mm,
        dry_days_after_today=dry_days_after_today,
        post_harvest_dry_days_needed=post_harvest_dry_days_needed,
        storage_available=harvest_input.storage_available,
        best_dry_day_offset=best_dry_day_offset
    )
    
    # 8. Generate 3 Comparison Options
    options = _generate_harvest_comparison_options(
        verdict=verdict,
        crop_name=harvest_input.crop,
        is_mature=is_mature,
        days_remaining_to_maturity=days_remaining_to_maturity,
        rainfall_next_2_days=rainfall_next_2_days,
        rainfall_next_5_days=rainfall_next_5_days,
        harvest_rain_risk_mm=harvest_rain_risk_mm,
        dry_days_after_today=dry_days_after_today,
        post_harvest_dry_days_needed=post_harvest_dry_days_needed,
        storage_available=harvest_input.storage_available,
        best_dry_day_offset=best_dry_day_offset
    )
    
    return DecisionResponse(
        verdict=verdict,
        verdict_badge=verdict_badge,
        confidence_pct=confidence_pct,
        recommended_window=recommended_window,
        summary=summary,
        explanation=explanation,
        options=options,
        daily_forecast=seven_day_forecast,
        score_breakdown=score_breakdown,
        crop_info=crop_rule
    )

def _generate_harvest_explanation(
    verdict: str,
    crop_name: str,
    days_since_sowing: int,
    maturity_days: int,
    days_remaining_to_maturity: int,
    rainfall_next_2_days: float,
    rainfall_next_5_days: float,
    harvest_rain_risk_mm: float,
    dry_days_after_today: int,
    post_harvest_dry_days_needed: int,
    storage_available: bool,
    best_dry_day_offset: int
) -> str:
    parts = []
    
    if verdict == "HARVEST BEFORE INCOMING RAIN":
        parts.append(f"URGENT HARVEST ADVISORY: Your {crop_name} crop is mature ({days_since_sowing} days since sowing), but {rainfall_next_2_days:.1f} mm of rainfall is forecast within the next 48 hours.")
        parts.append(f"Standing mature {crop_name} suffers severe pod-shattering, grain discoloration, seed sprouting, and fungal/mould damage when exposed to rain exceeding {harvest_rain_risk_mm:.0f} mm.")
        if storage_available:
            parts.append("Because you have covered on-farm storage available, mobilize harvest labor or combine harvesters immediately today and transfer the harvested crop under protective cover before rainfall commences.")
        else:
            parts.append("Harvest immediately today and arrange tarpaulins or temporary plastic sheeting to cover heaps in the threshing yard to prevent moisture spoilage.")
            
    elif verdict == "HARVEST NOW":
        parts.append(f"Ideal harvest window: Your {crop_name} crop is fully mature ({days_since_sowing} days vs {maturity_days} days requirement) and the meteorological outlook is optimal.")
        parts.append(f"Rainfall over the next 5 days is minimal ({rainfall_next_5_days:.1f} mm, well below the {harvest_rain_risk_mm:.0f} mm hazard threshold), providing {dry_days_after_today} consecutive sunny days for rapid field drying.")
        parts.append(f"Harvesting now preserves peak grain quality, minimizes pod shatter losses, and allows safe sun-drying down to recommended storage moisture levels.")
        
    else:  # WAIT
        if days_since_sowing < maturity_days:
            parts.append(f"Crop is not yet physiologically mature. Your {crop_name} has completed {days_since_sowing} of {maturity_days} maturity days ({days_remaining_to_maturity} days remaining).")
            parts.append("Premature harvesting results in shriveled seeds, high moisture content (>20%), poor test weight, and heavy market price discounts at the APMC mandi. Allow the crop to attain full maturity.")
        else:
            parts.append(f"Your {crop_name} is mature, but the immediate weather window offers only {dry_days_after_today} dry day(s), which is insufficient for the {post_harvest_dry_days_needed} days of sun-drying required.")
            parts.append(f"We recommend waiting approximately {best_dry_day_offset} day(s) until rain clouds pass so that you can harvest into a clear, continuous drying window without risking threshing yard spoilage.")
            
    return " ".join(parts)

def _generate_harvest_comparison_options(
    verdict: str,
    crop_name: str,
    is_mature: bool,
    days_remaining_to_maturity: int,
    rainfall_next_2_days: float,
    rainfall_next_5_days: float,
    harvest_rain_risk_mm: float,
    dry_days_after_today: int,
    post_harvest_dry_days_needed: int,
    storage_available: bool,
    best_dry_day_offset: int
) -> List[ComparisonOption]:
    options = []
    
    # Option 1: Harvest Today
    if verdict == "HARVEST NOW":
        opt1_risk = "Low"
        opt1_reason = f"Crop is mature with {dry_days_after_today} clear dry days ahead for safe field drying and quality preservation."
        opt1_rec = True
    elif verdict == "HARVEST BEFORE INCOMING RAIN":
        opt1_risk = "Medium" if storage_available else "Medium"
        opt1_reason = f"Recommended to avoid {rainfall_next_2_days:.1f} mm rain damage (pod-shattering and grain moulding) despite tight schedule."
        opt1_rec = True
    else:  # WAIT
        opt1_risk = "High"
        if not is_mature:
            opt1_reason = f"High risk: Crop lacks {days_remaining_to_maturity} days to mature. Premature harvest causes shriveled grains and drastic price cuts."
        else:
            opt1_reason = f"High risk: Post-harvest drying requires {post_harvest_dry_days_needed} dry days, but damp/rainy weather will cause heap moulding."
        opt1_rec = False
        
    options.append(ComparisonOption(
        label="Harvest Today",
        risk=opt1_risk,
        reason=opt1_reason,
        recommended=opt1_rec,
        available=is_mature
    ))
    
    # Option 2: Wait 2-3 Days
    wait_days_label = f"Wait {best_dry_day_offset}-{best_dry_day_offset + 2} Days"
    if verdict == "WAIT":
        opt2_risk = "Low"
        if not is_mature:
            opt2_reason = f"Safe approach: Allows pods/heads to develop full grain filling and reach physiological maturity."
        else:
            opt2_reason = f"Safe approach: Awaits the clear {post_harvest_dry_days_needed}-day sun drying window starting in ~{best_dry_day_offset} days."
        opt2_rec = True
    elif verdict == "HARVEST BEFORE INCOMING RAIN":
        opt2_risk = "High"
        opt2_reason = f"Extremely high risk: Rain arrives in <48 hrs. Leaving mature {crop_name} standing will cause lodging, pod shatter, and mould."
        opt2_rec = False
    else:  # HARVEST NOW
        opt2_risk = "Medium"
        opt2_reason = "Waiting is possible, but unnecessarily extends field standing time and risks encountering unpredictable late showers."
        opt2_rec = False
        
    options.append(ComparisonOption(
        label=wait_days_label,
        risk=opt2_risk,
        reason=opt2_reason,
        recommended=opt2_rec,
        available=True
    ))
    
    # Option 3: Harvest Before Incoming Rain (Emergency Advance Harvest)
    if rainfall_next_2_days > harvest_rain_risk_mm and is_mature:
        opt3_risk = "Low" if storage_available else "Medium"
        opt3_reason = f"Best emergency action: Secure crop before {rainfall_next_2_days:.1f} mm rain damages standing pods."
        opt3_rec = (verdict == "HARVEST BEFORE INCOMING RAIN")
        opt3_avail = True
    else:
        opt3_risk = "Low" if not is_mature else "Medium"
        opt3_reason = f"No imminent heavy rain (> {harvest_rain_risk_mm:.0f} mm) detected in the 48-hour forecast window."
        opt3_rec = False
        opt3_avail = is_mature
        
    options.append(ComparisonOption(
        label="Harvest Before Incoming Rain",
        risk=opt3_risk,
        reason=opt3_reason,
        recommended=(verdict == "HARVEST BEFORE INCOMING RAIN"),
        available=opt3_avail
    ))
    
    # Option 4 (Bonus 4th option for consistency with 4-card grid): Wait for Sunny Window
    opt4_risk = "Low" if verdict == "WAIT" else "Medium"
    options.append(ComparisonOption(
        label="Wait for Sunny Window & Storage",
        risk=opt4_risk,
        reason="Ensure on-farm storage or tarpaulins are prepared before taking down mature fields." if not storage_available else "On-farm storage provides a protective buffer against unexpected wet spells.",
        recommended=False,
        available=True
    ))
    
    return options

