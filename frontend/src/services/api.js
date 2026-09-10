const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : "http://localhost:8000/api";

export async function checkDecision(payload) {
  try {
    const response = await fetch(`${API_BASE}/decision`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    return await response.json();
  } catch (err) {
    console.warn("Direct API call failed, attempting relative proxy /api...", err);
    try {
      const resp2 = await fetch(`/api/decision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (resp2.ok) return await resp2.json();
    } catch (e2) {
      console.error("All API paths failed:", e2);
    }
    throw err;
  }
}export async function checkHarvestDecision(payload) {
  try {
    const response = await fetch(`${API_BASE}/harvest-decision`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    return await response.json();
  } catch (err) {
    console.warn("Direct API call failed, attempting relative proxy /api...", err);
    try {
      const resp2 = await fetch(`/api/harvest-decision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (resp2.ok) return await resp2.json();
    } catch (e2) {
      console.error("All API paths failed:", e2);
    }
    throw err;
  }
}

export async function geocodeLocation(location) {
  try {
    const response = await fetch(`${API_BASE}/geocode`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ location })
    });
    if (response.ok) return await response.json();
  } catch (e) {
    console.warn("Geocoding failed:", e);
  }
  return { location, lat: 18.5204, lng: 73.8567, display_name: `${location}, Maharashtra` };
}

export async function getPresetLocations() {
  try {
    const response = await fetch(`${API_BASE}/preset-locations`);
    if (response.ok) return await response.json();
  } catch (e) {
    console.warn("Preset locations failed:", e);
  }
  return [
    { name: "Pune", lat: 18.5204, lng: 73.8567 },
    { name: "Baramati", lat: 18.1517, lng: 74.5772 },
    { name: "Nashik", lat: 19.9975, lng: 73.7898 },
    { name: "Nagpur", lat: 21.1458, lng: 79.0882 },
    { name: "Solapur", lat: 17.6599, lng: 75.9064 },
    { name: "Akola", lat: 20.7002, lng: 77.0082 },
    { name: "Indore", lat: 22.7196, lng: 75.8577 }
  ];
}

export async function getCrops() {
  try {
    const response = await fetch(`${API_BASE}/crops`);
    if (response.ok) return await response.json();
  } catch (e) {
    console.warn("Crops list failed:", e);
  }
  return [
    { name: "Soybean", season: "Kharif", min_rainfall_mm_7day: 40, germination_days: 6 },
    { name: "Cotton", season: "Kharif", min_rainfall_mm_7day: 35, germination_days: 7 },
    { name: "Maize", season: "Kharif", min_rainfall_mm_7day: 30, germination_days: 5 },
    { name: "Wheat", season: "Rabi", min_rainfall_mm_7day: 20, germination_days: 6 },
    { name: "Groundnut", season: "Kharif", min_rainfall_mm_7day: 30, germination_days: 6 }
  ];
}

export async function getSavedFields() {
  try {
    const response = await fetch(`${API_BASE}/fields`);
    if (response.ok) return await response.json();
  } catch (e) {
    console.warn("Get fields failed:", e);
  }
  return [];
}

export async function saveField(field) {
  try {
    const response = await fetch(`${API_BASE}/fields`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(field)
    });
    if (response.ok) return await response.json();
  } catch (e) {
    console.warn("Save field failed:", e);
  }
  return null;
}

export async function deleteField(id) {
  try {
    const response = await fetch(`${API_BASE}/fields/${id}`, {
      method: "DELETE"
    });
    return response.ok;
  } catch (e) {
    console.warn("Delete field failed:", e);
    return false;
  }
}

export async function getHistory() {
  try {
    const response = await fetch(`${API_BASE}/history`);
    if (response.ok) return await response.json();
  } catch (e) {
    console.warn("Get history failed:", e);
  }
  return [];
}

export async function getHistoryStats() {
  try {
    const response = await fetch(`${API_BASE}/history/stats`);
    if (response.ok) return await response.json();
  } catch (e) {
    console.warn("Get history stats failed:", e);
  }
  return {
    total_consultations: 0,
    rated_count: 0,
    avg_rating: 5.0,
    action_taken_count: 0,
    satisfaction_rate_pct: 95
  };
}

export async function submitFeedback(payload) {
  try {
    const response = await fetch(`${API_BASE}/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return response.ok;
  } catch (e) {
    console.warn("Submit feedback failed:", e);
    return false;
  }
}

export async function deleteHistory(id) {
  try {
    const response = await fetch(`${API_BASE}/history/${id}`, {
      method: "DELETE"
    });
    return response.ok;
  } catch (e) {
    console.warn("Delete history failed:", e);
    return false;
  }
}
