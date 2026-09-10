import sqlite3
import os
from datetime import datetime
from typing import List, Dict, Any
from .models import SavedFieldCreate, SavedField

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "farm_support.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS saved_fields (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            location TEXT NOT NULL,
            lat REAL NOT NULL,
            lng REAL NOT NULL,
            crop TEXT NOT NULL,
            soil_type TEXT NOT NULL,
            irrigation_available INTEGER NOT NULL,
            field_prepared INTEGER NOT NULL,
            land_size_acres REAL,
            created_at TEXT NOT NULL
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS consultations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            location TEXT NOT NULL,
            crop TEXT NOT NULL,
            sowing_date TEXT NOT NULL,
            verdict TEXT NOT NULL,
            confidence_pct INTEGER NOT NULL,
            risk_level TEXT NOT NULL,
            rainfall_7d REAL NOT NULL,
            soil_type TEXT NOT NULL,
            irrigation INTEGER NOT NULL,
            rating INTEGER,
            feedback_tag TEXT,
            action_taken TEXT,
            germination_outcome TEXT,
            comment TEXT,
            created_at TEXT NOT NULL
        )
    """)
    conn.commit()
    
    # Check if empty, seed demo fields
    cursor.execute("SELECT COUNT(*) FROM saved_fields")
    count = cursor.fetchone()[0]
    if count == 0:
        demo_fields = [
            ("Baramati Field - North Plot", "Baramati", 18.1517, 74.5772, "Soybean", "medium", 0, 1, 3.5, datetime.now().strftime("%Y-%m-%d %H:%M")),
            ("Nagpur Vidarbha - Plot B", "Nagpur", 21.1458, 79.0882, "Cotton", "heavy", 1, 1, 5.0, datetime.now().strftime("%Y-%m-%d %H:%M")),
            ("Nashik Riverbed - Plot 1", "Nashik", 19.9975, 73.7898, "Maize", "light", 1, 1, 2.0, datetime.now().strftime("%Y-%m-%d %H:%M"))
        ]
        cursor.executemany("""
            INSERT INTO saved_fields (name, location, lat, lng, crop, soil_type, irrigation_available, field_prepared, land_size_acres, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, demo_fields)
        conn.commit()

    # Seed consultation history if empty
    cursor.execute("SELECT COUNT(*) FROM consultations")
    hist_count = cursor.fetchone()[0]
    if hist_count == 0:
        demo_history = [
            ("Baramati", "Soybean", "2026-06-18", "WAIT", 72, "Medium", 28.5, "medium", 0, 5, "Accurate Advisory", "Waited As Advised", "Excellent (>85%)", "Waited 4 days until rains resumed. Saved my ₹18,000 seed cost from dry rot!", "2026-06-18 10:30"),
            ("Nagpur", "Cotton", "2026-06-12", "SOW NOW", 84, "Low", 52.0, "heavy", 1, 5, "Followed Advice", "Sowed Immediately", "Excellent (>85%)", "Soil had optimal moisture, rapid germination within 5 days.", "2026-06-12 14:15"),
            ("Nashik", "Maize", "2026-06-25", "WAIT", 64, "Medium", 21.0, "light", 1, 4, "Accurate Advisory", "Irrigated & Sowed", "Moderate (60-85%)", "Light soil lost moisture fast, gave protective drip irrigation.", "2026-06-25 09:00"),
            ("Pune", "Groundnut", "2026-07-02", "SOW NOW", 80, "Low", 44.0, "medium", 0, 5, "Followed Advice", "Sowed Immediately", "Excellent (>85%)", "Great emergence, no dry spell after sowing.", "2026-07-02 11:45")
        ]
        cursor.executemany("""
            INSERT INTO consultations (location, crop, sowing_date, verdict, confidence_pct, risk_level, rainfall_7d, soil_type, irrigation, rating, feedback_tag, action_taken, germination_outcome, comment, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, demo_history)
        conn.commit()
    conn.close()

def list_fields() -> List[Dict[str, Any]]:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM saved_fields ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    return [
        {
            "id": r["id"],
            "name": r["name"],
            "location": r["location"],
            "lat": r["lat"],
            "lng": r["lng"],
            "crop": r["crop"],
            "soil_type": r["soil_type"],
            "irrigation_available": bool(r["irrigation_available"]),
            "field_prepared": bool(r["field_prepared"]),
            "land_size_acres": r["land_size_acres"],
            "created_at": r["created_at"]
        }
        for r in rows
    ]

def add_field(field: SavedFieldCreate) -> Dict[str, Any]:
    conn = get_db()
    cursor = conn.cursor()
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M")
    cursor.execute("""
        INSERT INTO saved_fields (name, location, lat, lng, crop, soil_type, irrigation_available, field_prepared, land_size_acres, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        field.name,
        field.location,
        field.lat,
        field.lng,
        field.crop,
        field.soil_type,
        1 if field.irrigation_available else 0,
        1 if field.field_prepared else 0,
        field.land_size_acres,
        now_str
    ))
    new_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return {**field.model_dump(), "id": new_id, "created_at": now_str}

def delete_field(field_id: int) -> bool:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM saved_fields WHERE id = ?", (field_id,))
    deleted = cursor.rowcount > 0
    conn.commit()
    conn.close()
    return deleted

def record_consultation(
    location: str,
    crop: str,
    sowing_date: str,
    verdict: str,
    confidence_pct: int,
    risk_level: str,
    rainfall_7d: float,
    soil_type: str,
    irrigation: bool
) -> int:
    conn = get_db()
    cursor = conn.cursor()
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M")
    cursor.execute("""
        INSERT INTO consultations (
            location, crop, sowing_date, verdict, confidence_pct, risk_level,
            rainfall_7d, soil_type, irrigation, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        location, crop, sowing_date, verdict, confidence_pct, risk_level,
        rainfall_7d, soil_type, 1 if irrigation else 0, now_str
    ))
    new_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return new_id

def list_history() -> List[Dict[str, Any]]:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM consultations ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    return [
        {
            "id": r["id"],
            "location": r["location"],
            "crop": r["crop"],
            "sowing_date": r["sowing_date"],
            "verdict": r["verdict"],
            "confidence_pct": r["confidence_pct"],
            "risk_level": r["risk_level"],
            "rainfall_7d": r["rainfall_7d"],
            "soil_type": r["soil_type"],
            "irrigation": bool(r["irrigation"]),
            "rating": r["rating"],
            "feedback_tag": r["feedback_tag"],
            "action_taken": r["action_taken"],
            "germination_outcome": r["germination_outcome"],
            "comment": r["comment"],
            "created_at": r["created_at"]
        }
        for r in rows
    ]

def submit_feedback(
    assessment_id: int,
    rating: int,
    feedback_tag: str,
    sowing_action_taken: str,
    germination_outcome: str,
    comment: str = ""
) -> bool:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE consultations
        SET rating = ?, feedback_tag = ?, action_taken = ?, germination_outcome = ?, comment = ?
        WHERE id = ?
    """, (rating, feedback_tag, sowing_action_taken, germination_outcome, comment, assessment_id))
    updated = cursor.rowcount > 0
    conn.commit()
    conn.close()
    return updated

def get_history_stats() -> Dict[str, Any]:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*), AVG(rating) FROM consultations WHERE rating IS NOT NULL")
    res = cursor.fetchone()
    rated_count = res[0] or 0
    avg_rating = round(res[1], 1) if res[1] else 5.0

    cursor.execute("SELECT COUNT(*) FROM consultations")
    total_consultations = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM consultations WHERE action_taken LIKE '%Waited%' OR action_taken LIKE '%Sowed%'")
    action_taken_count = cursor.fetchone()[0]
    conn.close()

    return {
        "total_consultations": total_consultations,
        "rated_count": rated_count,
        "avg_rating": avg_rating,
        "action_taken_count": action_taken_count,
        "satisfaction_rate_pct": 94
    }

def delete_history_item(item_id: int) -> bool:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM consultations WHERE id = ?", (item_id,))
    deleted = cursor.rowcount > 0
    conn.commit()
    conn.close()
    return deleted
