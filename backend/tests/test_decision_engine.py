import pytest
from datetime import datetime, timedelta
from app.models import FarmerInput, WeatherDay
from app.decision_engine import evaluate_decision, detect_dry_gap, check_date_in_window
from app.crop_rules import get_crop_rule

def generate_mock_forecast(precip_list):
    today = datetime.now()
    days = []
    for i, p in enumerate(precip_list):
        d_str = (today + timedelta(days=i)).strftime("%Y-%m-%d")
        days.append(WeatherDay(
            date=d_str,
            precipitation_mm=p,
            precipitation_probability=80 if p > 5 else 20,
            temp_max_c=30.0,
            temp_min_c=22.0,
            temp_mean_c=26.0
        ))
    return days

def test_dry_gap_detection():
    # 3 consecutive days with 0mm precipitation
    forecast = generate_mock_forecast([15.0, 0.0, 0.2, 0.0, 10.0, 8.0, 12.0])
    assert detect_dry_gap(forecast, germination_days=6, threshold_mm=1.5) == True
    
    # Well-distributed rain
    forecast_wet = generate_mock_forecast([10.0, 8.0, 12.0, 9.0, 15.0, 10.0, 5.0])
    assert detect_dry_gap(forecast_wet, germination_days=6, threshold_mm=1.5) == False

def test_sow_now_verdict():
    # 7-day well-distributed rainfall exceeding 40mm
    forecast = generate_mock_forecast([12.0, 8.0, 10.0, 9.0, 8.0, 10.0, 6.0]) # total = 63mm
    
    farmer_input = FarmerInput(
        location="Pune",
        lat=18.5204,
        lng=73.8567,
        crop="Soybean",
        intended_sowing_date=forecast[0].date,
        irrigation_available=True,
        soil_type="medium",
        field_prepared=True
    )
    
    result = evaluate_decision(farmer_input, forecast)
    assert result.verdict in ["SOW NOW", "WAIT"]  # depending on date inside June-July window
    assert result.summary.rainfall_next_7_days_mm >= 40.0
    assert result.summary.has_dry_gap == False
    assert len(result.options) == 4

def test_wait_verdict_on_dry_gap():
    # Day 1 has 18mm, but days 2, 3, 4, 5 are dry (0mm)
    forecast = generate_mock_forecast([18.0, 0.0, 0.0, 0.0, 0.0, 12.0, 15.0])
    
    farmer_input = FarmerInput(
        location="Pune",
        lat=18.5204,
        lng=73.8567,
        crop="Soybean",
        intended_sowing_date=forecast[0].date,
        irrigation_available=False,
        soil_type="medium",
        field_prepared=True
    )
    
    result = evaluate_decision(farmer_input, forecast)
    assert result.summary.has_dry_gap == True
    assert result.verdict == "WAIT"
    
    # Check that option 2 (Wait) is recommended
    wait_opt = next(o for o in result.options if "Wait" in o.label)
    assert wait_opt.recommended == True
    
    # Check that Irrigate option is NOT available because farmer has no irrigation
    irrigate_opt = next(o for o in result.options if "Irrigate" in o.label)
    assert irrigate_opt.available == False

def test_change_crop_verdict():
    # 7 days with zero rain and no irrigation
    forecast = generate_mock_forecast([0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0])
    
    farmer_input = FarmerInput(
        location="Pune",
        lat=18.5204,
        lng=73.8567,
        crop="Soybean",
        intended_sowing_date=forecast[0].date,
        irrigation_available=False,
        soil_type="light", # less suitable for soybean
        field_prepared=False
    )
    
    result = evaluate_decision(farmer_input, forecast)
    assert result.verdict == "CONSIDER ANOTHER CROP"
    assert result.confidence_pct < 45
    
    # Change crop option should be recommended
    change_opt = next(o for o in result.options if "Change Crop" in o.label)
    assert change_opt.recommended == True

def test_harvest_before_incoming_rain():
    """
    Realistic example: Soybean sown 100 days ago (maturity_days=100),
    rain forecast within 2 days (e.g. 12mm > 5mm threshold).
    Expected verdict: HARVEST BEFORE INCOMING RAIN (red, urgent).
    Explanation should mention pod-shattering / quality loss risk.
    """
    from app.models import HarvestInput
    from app.decision_engine import score_harvest_decision

    today_str = "2026-10-01"
    sowing_date = (datetime.strptime(today_str, "%Y-%m-%d") - timedelta(days=100)).strftime("%Y-%m-%d")
    
    # 12mm rain on day 1 (tomorrow)
    forecast = []
    precip_list = [0.0, 12.0, 8.0, 2.0, 0.0, 0.0, 0.0]
    for i, p in enumerate(precip_list):
        d_str = (datetime.strptime(today_str, "%Y-%m-%d") + timedelta(days=i)).strftime("%Y-%m-%d")
        forecast.append(WeatherDay(
            date=d_str,
            precipitation_mm=p,
            precipitation_probability=80 if p > 0 else 5,
            temp_max_c=31.0,
            temp_min_c=22.0,
            temp_mean_c=26.5
        ))
        
    harvest_input = HarvestInput(
        crop="Soybean",
        actual_sowing_date=sowing_date,
        location="Pune",
        storage_available=True
    )
    
    res = score_harvest_decision(harvest_input, forecast, current_date_str=today_str)
    assert res.verdict == "HARVEST BEFORE INCOMING RAIN"
    assert res.verdict_badge == "Red"
    assert "pod-shattering" in res.explanation.lower() or "shatter" in res.explanation.lower()
    assert res.confidence_pct >= 85
    opt_labels = [o.label for o in res.options]
    assert "Harvest Before Incoming Rain" in opt_labels

def test_harvest_immature_crop_wait():
    """
    Immature crop: Soybean sown only 40 days ago (needs 100 days).
    Expected verdict: WAIT.
    Explanation should display days remaining until maturity (60 days).
    """
    from app.models import HarvestInput
    from app.decision_engine import score_harvest_decision

    today_str = "2026-10-01"
    sowing_date = (datetime.strptime(today_str, "%Y-%m-%d") - timedelta(days=40)).strftime("%Y-%m-%d")
    
    forecast = []
    for i in range(7):
        d_str = (datetime.strptime(today_str, "%Y-%m-%d") + timedelta(days=i)).strftime("%Y-%m-%d")
        forecast.append(WeatherDay(
            date=d_str,
            precipitation_mm=0.0,
            precipitation_probability=5,
            temp_max_c=31.0,
            temp_min_c=22.0,
            temp_mean_c=26.5
        ))
        
    harvest_input = HarvestInput(
        crop="Soybean",
        actual_sowing_date=sowing_date,
        location="Pune",
        storage_available=False
    )
    
    res = score_harvest_decision(harvest_input, forecast, current_date_str=today_str)
    assert res.verdict == "WAIT"
    assert res.verdict_badge == "Amber"
    assert "60" in res.explanation or "maturity" in res.explanation.lower()
    assert res.score_breakdown["maturity_score"]["passed"] is False
    assert res.score_breakdown["maturity_score"]["days_remaining"] == 60

def test_harvest_now_mature_dry_spell():
    """
    Mature crop: Soybean sown 102 days ago, perfectly dry sunny 5-day window ahead.
    Expected verdict: HARVEST NOW.
    Score should be >= 70 and verdict_badge Green.
    """
    from app.models import HarvestInput
    from app.decision_engine import score_harvest_decision

    today_str = "2026-10-01"
    sowing_date = (datetime.strptime(today_str, "%Y-%m-%d") - timedelta(days=102)).strftime("%Y-%m-%d")
    
    forecast = []
    for i in range(7):
        d_str = (datetime.strptime(today_str, "%Y-%m-%d") + timedelta(days=i)).strftime("%Y-%m-%d")
        forecast.append(WeatherDay(
            date=d_str,
            precipitation_mm=0.0,
            precipitation_probability=5,
            temp_max_c=31.0,
            temp_min_c=22.0,
            temp_mean_c=26.5
        ))
        
    harvest_input = HarvestInput(
        crop="Soybean",
        actual_sowing_date=sowing_date,
        location="Pune",
        storage_available=True
    )
    
    res = score_harvest_decision(harvest_input, forecast, current_date_str=today_str)
    assert res.verdict == "HARVEST NOW"
    assert res.verdict_badge == "Green"
    assert res.confidence_pct >= 70
    assert any(opt.label == "Harvest Today" and opt.recommended for opt in res.options)

def test_ml_prediction_sowing():
    """
    Test that ML Random Forest prediction is attached to DecisionResponse in sowing flow.
    """
    forecast = []
    today = datetime.now()
    for i in range(7):
        d_str = (today + timedelta(days=i)).strftime("%Y-%m-%d")
        forecast.append(WeatherDay(
            date=d_str,
            precipitation_mm=10.0,
            precipitation_probability=60,
            temp_max_c=30.0,
            temp_min_c=22.0,
            temp_mean_c=26.0
        ))
    
    farmer_input = FarmerInput(
        crop="Soybean",
        soil_type="black",
        irrigation_available=True,
        field_prepared=True,
        intended_sowing_date=today.strftime("%Y-%m-%d"),
        location="Pune"
    )
    
    res = evaluate_decision(farmer_input, forecast)
    assert res.ml_prediction is not None
    assert "success_probability_pct" in res.ml_prediction
    assert "predicted_class" in res.ml_prediction
    assert "model_name" in res.ml_prediction
    assert res.ml_prediction["success_probability_pct"] >= 0.0
    assert res.ml_prediction["success_probability_pct"] <= 100.0
    assert "top_drivers" in res.ml_prediction

