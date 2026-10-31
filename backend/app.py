"""
Zona Killzone ML Assistant - Multi-Market & Multi-Session FastAPI Backend
Supports Sesi Asia, Sesi Eropa, Sesi New York, dan Komoditas Global.
Includes strict Killzone Operational Hours validation filter.
"""

# pyrefly: ignore[missing-import]
from fastapi import FastAPI
# pyrefly: ignore[missing-import]
from fastapi.middleware.cors import CORSMiddleware
# pyrefly: ignore[missing-import]
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
# pyrefly: ignore[missing-import]
import uvicorn

from parser import parse_trading_prompt, PAIRS_CONFIG
from model import predictor

app = FastAPI(
    title="Zona Killzone ML Assistant API - Multi-Market",
    description="Backend API and Random Forest ML Engine with Session Hours Filter",
    version="2.1.0"
)

# Enable CORS for Mobile App / PWA / Web Frontends
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str = Field(..., example="JP225 jam 7:30 BUY")
    pair: Optional[str] = None
    session: Optional[str] = None
    hour: Optional[int] = None
    minute: Optional[int] = None
    direction: Optional[str] = None

class PredictionResponse(BaseModel):
    status: str
    parsed_input: Dict[str, Any]
    zone: str
    zone_title: str
    pair: str
    pair_name: str
    flag: str
    region: str
    session: str
    hour: int
    minute: int
    time_display: str
    direction: str
    win_rate: str
    win_rate_val: float
    ml_confidence: str
    risk_note: str
    formatted_message: str
    is_in_killzone: bool
    total_backtest_samples: int
    rr_ratio: str
    sl_swing: str
    is_invalid_session: bool = False
    status_desc: Optional[str] = None

def validate_operational_hours(pair: str, hour: int, minute: int) -> tuple[bool, str, str]:
    """
    Validates if the trade entry time falls within authorized Killzone operational hours.
    Returns: (is_valid, session_name, allowed_hours_desc)
    """
    pair_upper = pair.upper()

    # 1. SESI ASIA (Jam 06:00 - 10:00 WIB)
    # Pair: JP225, HK50, AUD / AUDUSD
    if pair_upper in ["JP225", "HK50", "AUD", "AUDUSD"]:
        session_name = "Sesi Asia"
        allowed_desc = "06:00 - 10:00 WIB"
        is_valid = (6 <= hour < 10) or (hour == 10 and minute == 0)
        return is_valid, session_name, allowed_desc

    # 2. SESI EROPA / LONDON (Jam 14:00 - 16:00 WIB)
    # Pair: GER40, UK100
    elif pair_upper in ["GER40", "UK100"]:
        session_name = "Sesi Eropa / London"
        allowed_desc = "14:00 - 16:00 WIB"
        is_valid = (14 <= hour < 16) or (hour == 16 and minute == 0)
        return is_valid, session_name, allowed_desc

    # 3. SESI NEW YORK (Jam 19:00 - 20:59 WIB)
    # Pair: NAS100, US30
    elif pair_upper in ["NAS100", "US30"]:
        session_name = "Sesi New York"
        allowed_desc = "19:00 - 20:59 WIB"
        is_valid = (19 <= hour <= 20)
        return is_valid, session_name, allowed_desc

    # 4. KOMODITAS GLOBAL (XAUUSD / Gold)
    # Bebas / Aktif di Sesi Asia, Eropa & NY
    elif pair_upper in ["XAUUSD", "GOLD", "EMAS"]:
        session_name = "Komoditas Global (Asia, Eropa & NY)"
        allowed_desc = "06:00 - 11:59, 14:00 - 17:59, dan 19:00 - 23:59 WIB"
        is_valid = (6 <= hour <= 11) or (14 <= hour <= 17) or (19 <= hour <= 23)
        return is_valid, session_name, allowed_desc

    # Default fallback
    return True, "Pasar Global", "24 Jam"

@app.get("/")
def root():
    return {
        "app": "Zona Killzone ML Assistant - Multi-Market API",
        "version": "2.1.0",
        "sessions": ["Sesi Asia (06:00-10:00)", "Sesi Eropa (14:00-16:00)", "Sesi New York (19:00-20:59)", "Komoditas Global"],
        "total_pairs": len(PAIRS_CONFIG),
        "backtest_dataset": "STRATEGI FINAL - KOMBINASI GABUNGAN.csv",
        "docs_url": "/docs"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "model_trained": predictor.is_trained,
        "backtest_records": len(predictor.df)
    }

@app.get("/sessions")
def get_sessions():
    """Returns available sessions, pairs, and country flags."""
    return predictor.get_market_overview()

@app.get("/stats")
def get_stats():
    """Returns overview statistics across all sessions."""
    return predictor.get_market_overview()

@app.post("/predict", response_model=PredictionResponse)
def predict_endpoint(req: ChatRequest):
    raw_message = req.message or ""
    
    # 1. Parse prompt with multi-market NLP regex
    parsed = parse_trading_prompt(raw_message)
    
    # Allow manual override if specified in request body
    pair = req.pair or parsed["pair"]
    direction = req.direction or parsed["direction"]
    hour = req.hour if req.hour is not None else parsed["hour"]
    minute = req.minute if req.minute is not None else parsed["minute"]
    
    time_display = f"{hour:02d}:{minute:02d} WIB"
    conf = PAIRS_CONFIG.get(pair.upper(), PAIRS_CONFIG["NAS100"])

    # 2. VALIDASI JAM OPERASIONAL SESI (KILLZONE TIME FILTER)
    is_valid_session, session_name, allowed_hours = validate_operational_hours(pair, hour, minute)

    # JIKA DI LUAR JAM OPERASIONAL: JANGAN JALANKAN ML, LANGSUNG RETURN INVALID SESSION
    if not is_valid_session:
        status_desc = f"Jam ini berada di luar Killzone operasional pasar {session_name}."
        recommendation = "SKIP SETUP! Jangan trading di luar jam operasional utama bursa."
        
        formatted_invalid_card = (
            "🔴 ZONA MERAH (INVALID SESSION / DILUAR KILLZONE)\n"
            "-----------------------------------------\n"
            f"• Pair: {pair.upper()}\n"
            f"• Jam Entry: {time_display}\n"
            f"• Status: {status_desc}\n"
            f"• Rekomendasi: {recommendation}"
        )

        return PredictionResponse(
            status="invalid_session",
            parsed_input=parsed,
            zone="MERAH",
            zone_title="🔴 ZONA MERAH (INVALID SESSION / DILUAR KILLZONE)",
            pair=pair.upper(),
            pair_name=conf["name"],
            flag=conf["flag"],
            region=conf["region"],
            session=conf["session"],
            hour=hour,
            minute=minute,
            time_display=time_display,
            direction=direction,
            win_rate="0.0%",
            win_rate_val=0.0,
            ml_confidence="0.0%",
            risk_note=recommendation,
            formatted_message=formatted_invalid_card,
            is_in_killzone=False,
            total_backtest_samples=0,
            rr_ratio="1:1.5",
            sl_swing="N/A (Skip Setup)",
            is_invalid_session=True,
            status_desc=status_desc
        )

    # 3. JIKA DALAM JAM OPERASIONAL: JALANKAN MODEL MACHINE LEARNING (RANDOM FOREST)
    result = predictor.predict(
        pair=pair,
        hour=hour,
        minute=minute,
        direction=direction
    )
    
    return PredictionResponse(
        status="success",
        parsed_input=parsed,
        zone=result["zone"],
        zone_title=result["zone_title"],
        pair=result["pair"],
        pair_name=result["pair_name"],
        flag=result["flag"],
        region=result["region"],
        session=result["session"],
        hour=result["hour"],
        minute=result["minute"],
        time_display=result["time_display"],
        direction=result["direction"],
        win_rate=result["win_rate"],
        win_rate_val=result["win_rate_val"],
        ml_confidence=result["ml_confidence"],
        risk_note=result["risk_note"],
        formatted_message=result["formatted_message"],
        is_in_killzone=result["is_in_killzone"],
        total_backtest_samples=result["total_backtest_samples"],
        rr_ratio=result["rr_ratio"],
        sl_swing=result["sl_swing"],
        is_invalid_session=False,
        status_desc=None
    )

if __name__ == "__main__":
    print("Starting Multi-Market Zona Killzone Assistant API on http://0.0.0.0:8000 ...")
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
