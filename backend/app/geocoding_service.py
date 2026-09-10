import httpx
from typing import List, Dict, Any, Tuple

# Pre-cached popular Indian agricultural districts for zero-latency & offline resilience
CURATED_LOCATIONS = {
    "pune": {"lat": 18.5204, "lng": 73.8567, "display_name": "Pune, Maharashtra, India"},
    "baramati": {"lat": 18.1517, "lng": 74.5772, "display_name": "Baramati, Pune District, Maharashtra, India"},
    "nashik": {"lat": 19.9975, "lng": 73.7898, "display_name": "Nashik, Maharashtra, India"},
    "nagpur": {"lat": 21.1458, "lng": 79.0882, "display_name": "Nagpur, Vidarbha, Maharashtra, India"},
    "aurangabad": {"lat": 19.8762, "lng": 75.3433, "display_name": "Chhatrapati Sambhajinagar (Aurangabad), Maharashtra, India"},
    "chhatrapati sambhajinagar": {"lat": 19.8762, "lng": 75.3433, "display_name": "Chhatrapati Sambhajinagar, Maharashtra, India"},
    "solapur": {"lat": 17.6599, "lng": 75.9064, "display_name": "Solapur, Maharashtra, India"},
    "akola": {"lat": 20.7002, "lng": 77.0082, "display_name": "Akola, Maharashtra, India"},
    "amravati": {"lat": 20.9320, "lng": 77.7523, "display_name": "Amravati, Maharashtra, India"},
    "kolhapur": {"lat": 16.7050, "lng": 74.2433, "display_name": "Kolhapur, Maharashtra, India"},
    "indore": {"lat": 22.7196, "lng": 75.8577, "display_name": "Indore, Madhya Pradesh, India"},
    "bhopal": {"lat": 23.2599, "lng": 77.4126, "display_name": "Bhopal, Madhya Pradesh, India"},
    "rajkot": {"lat": 22.3039, "lng": 70.8022, "display_name": "Rajkot, Gujarat, India"},
    "delhi": {"lat": 28.6139, "lng": 77.2090, "display_name": "New Delhi, India"}
}

async def geocode_location(query: str) -> Tuple[float, float, str]:
    cleaned = query.strip().lower()
    
    # 1. Check curated agricultural hubs first
    if cleaned in CURATED_LOCATIONS:
        loc = CURATED_LOCATIONS[cleaned]
        return loc["lat"], loc["lng"], loc["display_name"]
    
    for key, loc in CURATED_LOCATIONS.items():
        if key in cleaned or cleaned in key:
            return loc["lat"], loc["lng"], loc["display_name"]
            
    # 2. Query OpenStreetMap Nominatim API
    url = "https://nominatim.openstreetmap.org/search"
    headers = {
        "User-Agent": "FarmDecisionSupportSystem/1.0 (agri-decision-assistant@local.hackathon)"
    }
    params = {
        "q": query,
        "format": "json",
        "limit": 1,
        "countrycodes": "in"
    }
    
    try:
        async with httpx.AsyncClient(timeout=4.0) as client:
            resp = await client.get(url, params=params, headers=headers)
            if resp.status_code == 200:
                data = resp.json()
                if data and len(data) > 0:
                    first = data[0]
                    return float(first["lat"]), float(first["lon"]), first.get("display_name", query)
    except Exception as e:
        # Log and fall back to default Pune location gracefully
        print(f"[Geocoding] Nominatim query failed: {e}. Falling back to default region.")
        
    # Default fallback: Pune
    pune = CURATED_LOCATIONS["pune"]
    return pune["lat"], pune["lng"], f"{query} (Region matched: Pune, MH)"

def get_preset_locations() -> List[Dict[str, Any]]:
    return [
        {"name": "Pune", "lat": 18.5204, "lng": 73.8567, "state": "Maharashtra"},
        {"name": "Baramati", "lat": 18.1517, "lng": 74.5772, "state": "Maharashtra"},
        {"name": "Nashik", "lat": 19.9975, "lng": 73.7898, "state": "Maharashtra"},
        {"name": "Nagpur", "lat": 21.1458, "lng": 79.0882, "state": "Maharashtra"},
        {"name": "Solapur", "lat": 17.6599, "lng": 75.9064, "state": "Maharashtra"},
        {"name": "Akola", "lat": 20.7002, "lng": 77.0082, "state": "Maharashtra"},
        {"name": "Indore", "lat": 22.7196, "lng": 75.8577, "state": "Madhya Pradesh"}
    ]
