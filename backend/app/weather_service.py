import httpx
from datetime import datetime, timedelta
from typing import List, Dict, Any, Tuple
from .models import WeatherDay

OPEN_METEO_BASE_URL = "https://api.open-meteo.com/v1/forecast"

async def fetch_weather_forecast(lat: float, lng: float, days: int = 10) -> Tuple[List[WeatherDay], Dict[str, Any]]:
    """
    Fetches real-time multi-day weather forecast from Open-Meteo API.
    Returns (days_list, metadata).
    Clearly distinguishes live data from cached or simulated scenarios.
    """
    # 1. Coordinate range validation
    if not (-90.0 <= lat <= 90.0) or not (-180.0 <= lng <= 180.0):
        raise ValueError(f"Invalid geographical coordinates: lat={lat}, lng={lng}. Latitude must be between -90 and 90, longitude between -180 and 180.")

    params = {
        "latitude": lat,
        "longitude": lng,
        "daily": [
            "precipitation_sum",
            "precipitation_probability_max",
            "temperature_2m_max",
            "temperature_2m_min",
            "temperature_2m_mean"
        ],
        "timezone": "auto",
        "forecast_days": max(days, 10)
    }

    metadata = {
        "is_live": True,
        "source": "Open-Meteo Weather API (ECMWF/GFS Grid)",
        "forecast_period": f"{days}-Day Daily Forecast",
        "fetched_at": datetime.now().isoformat(),
        "warning": None
    }
    
    try:
        async with httpx.AsyncClient(timeout=6.0) as client:
            response = await client.get(OPEN_METEO_BASE_URL, params=params)
            if response.status_code == 200:
                data = response.json()
                daily = data.get("daily", {})
                
                time_list = daily.get("time", [])
                precip_list = daily.get("precipitation_sum", [])
                prob_list = daily.get("precipitation_probability_max", [])
                t_max_list = daily.get("temperature_2m_max", [])
                t_min_list = daily.get("temperature_2m_min", [])
                t_mean_list = daily.get("temperature_2m_mean", [])
                
                results: List[WeatherDay] = []
                for i in range(len(time_list)):
                    p_val = float(precip_list[i]) if i < len(precip_list) and precip_list[i] is not None else 0.0
                    prob_val = int(prob_list[i]) if i < len(prob_list) and prob_list[i] is not None else 0
                    t_max = float(t_max_list[i]) if i < len(t_max_list) and t_max_list[i] is not None else 30.0
                    t_min = float(t_min_list[i]) if i < len(t_min_list) and t_min_list[i] is not None else 22.0
                    t_mean = float(t_mean_list[i]) if i < len(t_mean_list) and t_mean_list[i] is not None else (t_max + t_min) / 2.0
                    
                    results.append(WeatherDay(
                        date=time_list[i],
                        precipitation_mm=round(p_val, 1),
                        precipitation_probability=prob_val,
                        temp_max_c=round(t_max, 1),
                        temp_min_c=round(t_min, 1),
                        temp_mean_c=round(t_mean, 1)
                    ))
                return results, metadata
    except Exception as e:
        print(f"[WeatherService] Open-Meteo request failed: {e}. Returning flagged offline fallback.")

    # Explicitly flagged fallback scenario — never masquerade as live weather
    metadata["is_live"] = False
    metadata["source"] = "Offline Demonstration Scenario (Live Weather Unreachable)"
    metadata["warning"] = "Live Open-Meteo weather service could not be reached. Displaying an offline demonstration forecast for interface preview only. Do not make actual sowing investments based on this simulated weather."
    
    return _generate_fallback_forecast(), metadata

def _generate_fallback_forecast() -> List[WeatherDay]:
    today = datetime.now()
    sample_rain = [18.0, 1.2, 0.0, 0.0, 0.5, 4.0, 12.0, 16.5, 22.0, 14.0]
    sample_prob = [75, 30, 10, 10, 20, 50, 65, 80, 85, 70]
    
    results = []
    for i in range(10):
        d_str = (today + timedelta(days=i)).strftime("%Y-%m-%d")
        results.append(WeatherDay(
            date=d_str,
            precipitation_mm=sample_rain[i % len(sample_rain)],
            precipitation_probability=sample_prob[i % len(sample_prob)],
            temp_max_c=31.5,
            temp_min_c=22.8,
            temp_mean_c=27.2
        ))
    return results
