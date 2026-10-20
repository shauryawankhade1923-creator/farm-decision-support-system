from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field, field_validator

class GeocodeRequest(BaseModel):
    location: str

class GeocodeResponse(BaseModel):
    location: str
    lat: float
    lng: float
    display_name: str

class FarmerInput(BaseModel):
    location: str
    lat: Optional[float] = Field(None, ge=-90.0, le=90.0)
    lng: Optional[float] = Field(None, ge=-180.0, le=180.0)
    crop: str
    intended_sowing_date: str
    irrigation_available: bool
    soil_type: str = "medium"  # light, medium, heavy, black, red, alluvial
    field_prepared: bool = True
    land_size_acres: Optional[float] = None
    language: Optional[str] = "en"  # en, mr, hi

    @field_validator("intended_sowing_date")
    @classmethod
    def validate_date(cls, v: str) -> str:
        try:
            datetime.strptime(v.strip(), "%Y-%m-%d")
        except ValueError:
            raise ValueError(f"Invalid date format '{v}'. Expected format YYYY-MM-DD.")
        return v.strip()

    @field_validator("crop")
    @classmethod
    def validate_crop(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Crop name cannot be empty.")
        return v.strip()

class HarvestInput(BaseModel):
    crop: str
    actual_sowing_date: str
    location: str
    lat: Optional[float] = Field(None, ge=-90.0, le=90.0)
    lng: Optional[float] = Field(None, ge=-180.0, le=180.0)
    storage_available: bool = False
    language: Optional[str] = "en"

    @field_validator("actual_sowing_date")
    @classmethod
    def validate_date(cls, v: str) -> str:
        try:
            datetime.strptime(v.strip(), "%Y-%m-%d")
        except ValueError:
            raise ValueError(f"Invalid date format '{v}'. Expected format YYYY-MM-DD.")
        return v.strip()

class WeatherDay(BaseModel):
    date: str
    precipitation_mm: float
    precipitation_probability: Optional[int] = 0
    temp_max_c: float
    temp_min_c: float
    temp_mean_c: float

class WeatherForecastResponse(BaseModel):
    daily: List[WeatherDay]
    is_live: bool = True
    source: str = "Open-Meteo Weather API"
    forecast_period: str = "10-day"
    fetched_at: str = ""
    warning: Optional[str] = None

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
    window_validated: bool = True
    evaluation_note: Optional[str] = None

class DecisionResponse(BaseModel):
    assessment_id: Optional[int] = None
    verdict: str  # SOW NOW, WAIT, CONSIDER ANOTHER CROP
    verdict_badge: str  # Green, Amber, Red
    confidence_pct: int
    suitability_score_label: str = "Rule-Based Agronomic Suitability Score"
    recommended_window: RecommendedWindow
    summary: DecisionSummary
    explanation: str
    options: List[ComparisonOption]
    daily_forecast: List[WeatherDay]
    score_breakdown: Dict[str, Any]
    crop_info: Dict[str, Any]
    weather_metadata: Optional[Dict[str, Any]] = None
    sowing_date_horizon_warning: Optional[str] = None
    ml_prediction: Optional[Dict[str, Any]] = None

class SavedFieldCreate(BaseModel):
    name: str
    location: str
    lat: float = Field(..., ge=-90.0, le=90.0)
    lng: float = Field(..., ge=-180.0, le=180.0)
    crop: str
    soil_type: str
    irrigation_available: bool
    field_prepared: bool
    land_size_acres: Optional[float] = None

class SavedField(SavedFieldCreate):
    id: int
    user_id: str = "guest"
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
    user_id: str = "guest"
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

class UserRegister(BaseModel):
    name: str
    email: str
    phone: str
    password: str
    district: Optional[str] = "Pune"

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: str
    is_verified: bool
    district: str
    created_at: str

class VerifyEmailRequest(BaseModel):
    email: str
    code: str

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    email: str
    code: str
    new_password: str
