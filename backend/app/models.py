from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class GeocodeRequest(BaseModel):
    location: str

class GeocodeResponse(BaseModel):
    location: str
    lat: float
    lng: float
    display_name: str

class FarmerInput(BaseModel):
    location: str
    lat: Optional[float] = None
    lng: Optional[float] = None
    crop: str
    intended_sowing_date: str
    irrigation_available: bool
    soil_type: str = "medium"  # light, medium, heavy
    field_prepared: bool = True
    land_size_acres: Optional[float] = None
    language: Optional[str] = "en"  # en, mr, hi

class HarvestInput(BaseModel):
    crop: str
    actual_sowing_date: str
    location: str
    lat: Optional[float] = None
    lng: Optional[float] = None
    storage_available: bool = False
    language: Optional[str] = "en"

class WeatherDay(BaseModel):
    date: str
    precipitation_mm: float
    precipitation_probability: Optional[int] = 0
    temp_max_c: float
    temp_min_c: float
    temp_mean_c: float

class ComparisonOption(BaseModel):
    label: str
    risk: str  # High, Medium, Low
    reason: str
    recommended: bool = False
    available: bool = True
    suggested_crop: Optional[str] = None

class DecisionSummary(BaseModel):
    rainfall_next_7_days_mm: float
    avg_temperature_c: float
    crop_min_rainfall_mm: float
    risk_level: str  # Low, Medium, High
    soil_match: bool
    in_sowing_window: bool
    has_dry_gap: bool
    irrigation_available: bool
    field_prepared: bool

class RecommendedWindow(BaseModel):
    start: str
    end: str

class DecisionResponse(BaseModel):
    assessment_id: Optional[int] = None
    verdict: str  # SOW NOW, WAIT, CONSIDER ANOTHER CROP
    verdict_badge: str  # Green, Amber, Red
    confidence_pct: int
    recommended_window: RecommendedWindow
    summary: DecisionSummary
    explanation: str
    options: List[ComparisonOption]
    daily_forecast: List[WeatherDay]
    score_breakdown: Dict[str, Any]
    crop_info: Dict[str, Any]
    ml_prediction: Optional[Dict[str, Any]] = None

class SavedFieldCreate(BaseModel):
    name: str
    location: str
    lat: float
    lng: float
    crop: str
    soil_type: str
    irrigation_available: bool
    field_prepared: bool
    land_size_acres: Optional[float] = None

class SavedField(SavedFieldCreate):
    id: int
    created_at: str

class FeedbackSubmit(BaseModel):
    assessment_id: int
    rating: int  # 1 to 5 stars
    feedback_tag: str  # e.g. "Accurate Advisory", "Delayed Rain", "Followed Advice"
    sowing_action_taken: str  # e.g. "Waited As Advised", "Sowed Immediately", "Irrigated & Sowed", "Changed Crop"
    germination_outcome: str  # e.g. "Excellent (>85%)", "Moderate (60-85%)", "Poor (<60%)", "Pending"
    comment: Optional[str] = ""

class HistoryRecord(BaseModel):
    id: int
    location: str
    crop: str
    sowing_date: str
    verdict: str
    confidence_pct: int
    risk_level: str
    rainfall_7d: float
    soil_type: str
    irrigation: bool
    rating: Optional[int] = None
    feedback_tag: Optional[str] = None
    action_taken: Optional[str] = None
    germination_outcome: Optional[str] = None
    comment: Optional[str] = None
    created_at: str
