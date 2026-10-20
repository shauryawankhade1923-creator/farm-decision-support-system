import pytest
import asyncio
from datetime import datetime, timedelta
from app.models import FarmerInput, HarvestInput, WeatherDay, SavedFieldCreate
from app.decision_engine import evaluate_decision, detect_dry_gap
from app.weather_service import fetch_weather_forecast
import app.database as db

def generate_forecast(precip_list, start_date_str="2026-06-20"):
    start = datetime.strptime(start_date_str, "%Y-%m-%d")
    days = []
    for i, p in enumerate(precip_list):
        d_str = (start + timedelta(days=i)).strftime("%Y-%m-%d")
        days.append(WeatherDay(
            date=d_str,
            precipitation_mm=p,
            precipitation_probability=85 if p > 5 else 10,
            temp_max_c=31.0,
            temp_min_c=22.0,
            temp_mean_c=26.5
        ))
    return days

def test_sow_now_deterministic_window():
    """Verify strictly that when within the ideal calendar window and with adequate moisture, verdict is SOW NOW."""
    forecast = generate_forecast([15.0, 10.0, 8.0, 12.0, 10.0, 5.0, 8.0], start_date_str="2026-06-20")
    farmer_input = FarmerInput(
        location="Akola",
        lat=20.7002,
        lng=77.0082,
        crop="Soybean",
        intended_sowing_date="2026-06-20",
        irrigation_available=True,
        soil_type="black",
        field_prepared=True
    )
    result = evaluate_decision(farmer_input, forecast)
    assert result.verdict == "SOW NOW"
    assert result.confidence_pct >= 75
    assert result.suitability_score_label == "Rule-Based Agronomic Suitability Score"
    assert result.summary.has_dry_gap is False

def test_forecast_horizon_validation():
    """Verify that intending to sow beyond the 10-day forecast horizon generates a horizon warning."""
    forecast = generate_forecast([10.0] * 10, start_date_str="2026-06-20")
    # Date 18 days out
    farmer_input = FarmerInput(
        location="Nagpur",
        lat=21.1458,
        lng=79.0882,
        crop="Soybean",
        intended_sowing_date="2026-07-08",
        irrigation_available=False,
        soil_type="medium",
        field_prepared=True
    )
    result = evaluate_decision(farmer_input, forecast)
    assert result.sowing_date_horizon_warning is not None
    assert "exceeds the 10-day meteorological forecast horizon" in result.sowing_date_horizon_warning

def test_invalid_coordinates_validation():
    """Verify that coordinates outside [-90, 90] and [-180, 180] are rejected."""
    with pytest.raises(ValueError):
        FarmerInput(
            location="Invalid Location",
            lat=999.0, # Out of range
            lng=77.0,
            crop="Soybean",
            intended_sowing_date="2026-06-20",
            irrigation_available=False,
            soil_type="medium",
            field_prepared=True
        )

    with pytest.raises(ValueError):
        asyncio.run(fetch_weather_forecast(lat=100.0, lng=50.0))

def test_weather_service_metadata_and_offline_identification():
    """Verify that weather retrieval returns structured metadata distinguishing live vs offline."""
    days, metadata = asyncio.run(fetch_weather_forecast(lat=18.5204, lng=73.8567))
    assert len(days) >= 7
    assert "is_live" in metadata
    assert "source" in metadata
    assert "forecast_period" in metadata
    if not metadata["is_live"]:
        assert metadata["warning"] is not None
        assert "Offline Demonstration" in metadata["source"]

def test_tenant_isolation_in_database():
    """Verify multi-tenant isolation: Farmer A's saved fields and history cannot be seen or deleted by Farmer B."""
    db.init_db()
    user_a = "farmer_alpha_101"
    user_b = "farmer_beta_202"

    field_a = SavedFieldCreate(
        name="Alpha North Plot",
        crop="Cotton",
        location="Amravati",
        lat=20.9320,
        lng=77.7523,
        soil_type="black",
        irrigation_available=True,
        field_prepared=True,
        land_size_acres=5.5
    )

    # User A creates field
    saved = db.add_field(field_a, user_id=user_a)
    assert saved["id"] is not None

    # User A can see their field
    fields_a = db.list_fields(user_id=user_a)
    assert any(f["id"] == saved["id"] for f in fields_a)

    # User B CANNOT see User A's field
    fields_b = db.list_fields(user_id=user_b)
    assert not any(f["id"] == saved["id"] for f in fields_b)

    # User B attempts to delete User A's field -> Should fail
    deleted_by_b = db.delete_field(saved["id"], user_id=user_b)
    assert deleted_by_b is False

    # Verify field still exists for User A
    fields_a_after = db.list_fields(user_id=user_a)
    assert any(f["id"] == saved["id"] for f in fields_a_after)

    # User A deletes their own field -> Should succeed
    deleted_by_a = db.delete_field(saved["id"], user_id=user_a)
    assert deleted_by_a is True

def test_history_tenant_isolation():
    """Verify multi-tenant isolation for consultation history."""
    db.init_db()
    user_a = "farmer_alpha_101"
    user_b = "farmer_beta_202"

    item_id = db.record_consultation(
        location="Baramati",
        crop="Wheat",
        sowing_date="2026-11-15",
        verdict="SOW NOW",
        confidence_pct=88,
        risk_level="Low",
        rainfall_7d=25.0,
        soil_type="medium",
        irrigation=True,
        rating=5,
        user_id=user_a
    )
    assert item_id is not None

    # User A sees consultation
    history_a = db.list_history(user_id=user_a)
    assert any(h["id"] == item_id for h in history_a)

    # User B CANNOT see consultation
    history_b = db.list_history(user_id=user_b)
    assert not any(h["id"] == item_id for h in history_b)

    # User B cannot delete User A's consultation
    del_res = db.delete_history_item(item_id, user_id=user_b)
    assert del_res is False
