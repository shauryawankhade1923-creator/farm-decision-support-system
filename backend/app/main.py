from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any, Optional

from .models import (
    GeocodeRequest, GeocodeResponse, FarmerInput, HarvestInput, DecisionResponse,
    WeatherDay, SavedFieldCreate, FeedbackSubmit, HistoryRecord
)
from .geocoding_service import geocode_location, get_preset_locations
from .weather_service import fetch_weather_forecast
from .crop_rules import list_supported_crops, get_crop_rule
from .decision_engine import evaluate_decision, score_harvest_decision
from .ai_explainer import localize_explanation
from .database import (
    init_db, list_fields, add_field, delete_field,
    record_consultation, list_history, submit_feedback,
    get_history_stats, delete_history_item
)

app = FastAPI(
    title="Farm Decision Support System API",
    description="Personalized, explainable sowing decision engine converting live weather & crop rules into ranked options.",
    version="1.0.0"
)

# Enable CORS for local Vite development and remote demos
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

@app.get("/api/health")
def health_check():
    return {"status": "ok", "app": "Farm Decision Support System"}

@app.post("/api/geocode", response_model=GeocodeResponse)
async def geocode_endpoint(req: GeocodeRequest):
    """
    Proxies Nominatim OpenStreetMap API to convert village/city name to lat/lng.
    Falls back gracefully to curated Maharashtra agricultural hubs.
    """
    if not req.location or not req.location.strip():
        raise HTTPException(status_code=400, detail="Location cannot be empty")
    lat, lng, display_name = await geocode_location(req.location)
    return GeocodeResponse(
        location=req.location,
        lat=lat,
        lng=lng,
        display_name=display_name
    )

@app.get("/api/preset-locations")
def preset_locations_endpoint():
    return get_preset_locations()

@app.get("/api/crops")
def crops_endpoint():
    return list_supported_crops()

@app.get("/api/weather", response_model=List[WeatherDay])
async def weather_endpoint(
    lat: float = Query(..., description="Latitude"),
    lng: float = Query(..., description="Longitude")
):
    """
    Fetches real-time multi-day weather forecast from Open-Meteo.
    """
    return await fetch_weather_forecast(lat=lat, lng=lng)

@app.post("/api/decision", response_model=DecisionResponse)
async def decision_endpoint(input_data: FarmerInput):
    """
    Core Decision Engine:
    1. Geocodes location if lat/lng is missing.
    2. Fetches 7-10 day live forecast from Open-Meteo.
    3. Runs ICAR crop rule evaluation and dry-gap detection.
    4. Computes scores, verdict, recommended window, and all 4 comparison options.
    5. Localizes explanations if requested.
    """
    # 1. Geocode if coordinates not provided
    if input_data.lat is None or input_data.lng is None:
        lat, lng, display_name = await geocode_location(input_data.location)
        input_data.lat = lat
        input_data.lng = lng

    # 2. Fetch live weather
    forecast = await fetch_weather_forecast(input_data.lat, input_data.lng, days=10)
    
    # 3. Evaluate decision
    decision = evaluate_decision(input_data, forecast)
    
    # 4. Multilingual localization if mr or hi selected
    if input_data.language in ["mr", "hi"]:
        decision.explanation = localize_explanation(
            decision.explanation,
            decision.verdict,
            input_data.language
        )

    # 5. Automatically log consultation in history
    try:
        new_id = record_consultation(
            location=input_data.location,
            crop=input_data.crop,
            sowing_date=input_data.intended_sowing_date,
            verdict=decision.verdict,
            confidence_pct=decision.confidence_pct,
            risk_level=decision.summary.risk_level,
            rainfall_7d=decision.summary.rainfall_next_7_days_mm,
            soil_type=input_data.soil_type,
            irrigation=input_data.irrigation_available
        )
        decision.assessment_id = new_id
    except Exception as e:
        print(f"[Database] Could not record consultation: {e}")

    return decision

@app.post("/api/harvest-decision", response_model=DecisionResponse)
async def harvest_decision_endpoint(input_data: HarvestInput):
    """
    Harvest Decision Engine:
    1. Geocodes location if lat/lng missing.
    2. Fetches 10-day live forecast from Open-Meteo.
    3. Evaluates crop maturity (days_since_sowing >= crop.maturity_days).
    4. Evaluates rainfall hazard (pod-shattering/sprouting/mould).
    5. Returns identical DecisionResponse schema for seamless UI reuse.
    """
    # 1. Geocode if coordinates not provided
    if input_data.lat is None or input_data.lng is None:
        lat, lng, display_name = await geocode_location(input_data.location)
        input_data.lat = lat
        input_data.lng = lng

    # 2. Fetch live weather
    forecast = await fetch_weather_forecast(input_data.lat, input_data.lng, days=10)
    
    # 3. Evaluate harvest decision
    decision = score_harvest_decision(input_data, forecast)

    # 4. Multilingual localization if mr or hi selected
    if input_data.language in ["mr", "hi"]:
        decision.explanation = localize_explanation(
            decision.explanation,
            decision.verdict,
            input_data.language
        )

    # 5. Record consultation in history
    try:
        new_id = record_consultation(
            location=input_data.location,
            crop=f"{input_data.crop} (Harvest)",
            sowing_date=input_data.actual_sowing_date,
            verdict=decision.verdict,
            confidence_pct=decision.confidence_pct,
            risk_level=decision.summary.risk_level,
            rainfall_7d=decision.summary.rainfall_next_7_days_mm,
            soil_type="Storage: " + ("Yes" if input_data.storage_available else "No"),
            irrigation=input_data.storage_available
        )
        decision.assessment_id = new_id
    except Exception as e:
        print(f"[Database] Could not record harvest consultation: {e}")

    return decision

@app.get("/api/history", response_model=List[HistoryRecord])
def history_endpoint():
    """
    Returns full farmer consultation history with ratings, actions taken, and actual germination outcomes.
    """
    return list_history()

@app.get("/api/history/stats")
def history_stats_endpoint():
    """
    Returns aggregate feedback metrics: average rating, total consultations, and satisfaction rate.
    """
    return get_history_stats()

@app.post("/api/feedback")
def feedback_endpoint(feedback: FeedbackSubmit):
    """
    Submits farmer rating, sowing action taken, and actual germination outcome.
    Closes the real-world feedback loop.
    """
    success = submit_feedback(
        assessment_id=feedback.assessment_id,
        rating=feedback.rating,
        feedback_tag=feedback.feedback_tag,
        sowing_action_taken=feedback.sowing_action_taken,
        germination_outcome=feedback.germination_outcome,
        comment=feedback.comment or ""
    )
    if not success:
        raise HTTPException(status_code=404, detail="Assessment record not found")
    return {"status": "success", "message": "Feedback successfully recorded"}

@app.delete("/api/history/{item_id}")
def delete_history_endpoint(item_id: int):
    success = delete_history_item(item_id)
    if not success:
        raise HTTPException(status_code=404, detail="Record not found")
    return {"deleted": True, "id": item_id}

@app.get("/api/fields")
def get_fields():
    return list_fields()

@app.post("/api/fields")
def save_field(field: SavedFieldCreate):
    return add_field(field)

@app.delete("/api/fields/{field_id}")
def remove_field(field_id: int):
    success = delete_field(field_id)
    if not success:
        raise HTTPException(status_code=404, detail="Field profile not found")
    return {"deleted": True, "id": field_id}
