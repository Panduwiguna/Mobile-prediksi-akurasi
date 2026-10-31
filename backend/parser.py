"""
Multi-Market & Multi-Session Prompt Parser for Killzone Trading Assistant.
Supports:
- Asia Session: JP225 (🇯🇵 Japan), HK50 (🇭🇰 Hong Kong), AUD (🇦🇺 Australia)
- Europe Session: GER40 (🇩🇪 Germany), UK100 (🇬🇧 United Kingdom)
- New York Session: NAS100 (🇺🇸 USA), US30 (🇺🇸 USA)
- Global Commodity: XAUUSD (🪙 Gold)
"""

import re
from typing import Dict, Any, Optional

# Master configuration of supported markets
PAIRS_CONFIG = {
    "JP225": {
        "code": "JP225",
        "name": "Japan Nikkei 225",
        "flag": "🇯🇵",
        "region": "Japan",
        "session": "Sesi Asia",
        "killzone_hours": [7, 8, 9],
        "default_sl_pips": 35.0,
        "aliases": ["jp225", "nikkei", "nikkei225", "japan", "jpn225", "japan nikkei"]
    },
    "HK50": {
        "code": "HK50",
        "name": "Hong Kong Hang Seng",
        "flag": "🇭🇰",
        "region": "Hong Kong",
        "session": "Sesi Asia",
        "killzone_hours": [8, 9, 10],
        "default_sl_pips": 45.0,
        "aliases": ["hk50", "hangseng", "hsi", "hongkong", "hk"]
    },
    "AUD": {
        "code": "AUD",
        "name": "Sydney / AUD Pairs",
        "flag": "🇦🇺",
        "region": "Australia",
        "session": "Sesi Asia",
        "killzone_hours": [6, 7, 8],
        "default_sl_pips": 15.0,
        "aliases": ["aud", "audusd", "sydney", "australia"]
    },
    "GER40": {
        "code": "GER40",
        "name": "Germany DAX 40",
        "flag": "🇩🇪",
        "region": "Germany / Europe",
        "session": "Sesi Eropa",
        "killzone_hours": [14, 15, 16],
        "default_sl_pips": 25.0,
        "aliases": ["ger40", "dax", "dax40", "jerman", "germany", "de40", "jerman ger40"]
    },
    "UK100": {
        "code": "UK100",
        "name": "UK FTSE 100",
        "flag": "🇬🇧",
        "region": "United Kingdom",
        "session": "Sesi Eropa",
        "killzone_hours": [14, 15, 16],
        "default_sl_pips": 20.0,
        "aliases": ["uk100", "ftse", "ftse100", "inggris", "britain", "uk100 inggris"]
    },
    "NAS100": {
        "code": "NAS100",
        "name": "USA Nasdaq 100",
        "flag": "🇺🇸",
        "region": "USA",
        "session": "Sesi New York",
        "killzone_hours": [19, 20, 21, 22],
        "default_sl_pips": 25.0,
        "aliases": ["nas100", "nasdaq", "nas", "us100", "ndx", "nq", "amerika nas100"]
    },
    "US30": {
        "code": "US30",
        "name": "USA Dow Jones 30",
        "flag": "🇺🇸",
        "region": "USA",
        "session": "Sesi New York",
        "killzone_hours": [19, 20, 21, 22],
        "default_sl_pips": 40.0,
        "aliases": ["us30", "djia", "dow", "dowjones", "ym", "amerika us30"]
    },
    "XAUUSD": {
        "code": "XAUUSD",
        "name": "Gold / Emas",
        "flag": "🪙",
        "region": "Global Commodity",
        "session": "Komoditas Global",
        "killzone_hours": [14, 15, 16, 18, 19, 20, 21],
        "default_sl_pips": 30.0,
        "aliases": ["xauusd", "gold", "emas", "xau", "gold xauusd"]
    }
}

def parse_trading_prompt(text: str) -> Dict[str, Any]:
    text_clean = text.strip()
    text_lower = text_clean.lower()
    
    # 1. Detect Pair
    detected_pair = None
    # Check aliases from most specific to general
    for pair_key, conf in PAIRS_CONFIG.items():
        for alias in conf["aliases"]:
            pattern = r'\b' + re.escape(alias) + r'\b'
            if re.search(pattern, text_lower):
                detected_pair = pair_key
                break
        if detected_pair:
            break
            
    # Default pair if none found is NAS100
    if not detected_pair:
        detected_pair = "NAS100"
        pair_assumed = True
    else:
        pair_assumed = False
        
    pair_meta = PAIRS_CONFIG[detected_pair]

    # 2. Detect Direction (BUY / SELL)
    direction: Optional[str] = None
    if re.search(r'\b(buy|long|beli|naik|call)\b', text_lower):
        direction = "BUY"
    elif re.search(r'\b(sell|short|jual|turun|put)\b', text_lower):
        direction = "SELL"
    else:
        direction = "BUY"
        direction_assumed = True
    direction_assumed = direction is None

    # 3. Detect Entry Time (Hour & Minute)
    hour: Optional[int] = None
    minute: int = 0
    raw_time_str = ""

    # Pattern A: "jam 08:30", "jam 15.06", "jam 7:30"
    m_jam_min = re.search(r'(?:jam|pukul|at)\s*(\d{1,2})[:.](\d{2})', text_lower)
    if m_jam_min:
        hour = int(m_jam_min.group(1))
        minute = int(m_jam_min.group(2))
        raw_time_str = f"{hour:02d}:{minute:02d}"
    else:
        # Pattern B: "15:06", "20:30", "07.30"
        m_time_colon = re.search(r'\b(\d{1,2})[:.](\d{2})\b', text_lower)
        if m_time_colon:
            hour = int(m_time_colon.group(1))
            minute = int(m_time_colon.group(2))
            raw_time_str = f"{hour:02d}:{minute:02d}"
        else:
            # Pattern C: "jam 7", "jam 15", "pukul 20"
            m_jam_simple = re.search(r'(?:jam|pukul|at)\s*(\d{1,2})\b', text_lower)
            if m_jam_simple:
                hour = int(m_jam_simple.group(1))
                minute = 0
                raw_time_str = f"{hour:02d}:00"
            else:
                # Pattern D: Standalone single/double digits (excluding digits in pair names like 100, 225, 40, 30, 50)
                clean_numbers = re.sub(r'nas100|us100|jp225|ger40|uk100|us30|hk50|100|225|40|30|50', '', text_lower)
                m_num = re.search(r'\b(0?[0-9]|1[0-9]|2[0-3])\b', clean_numbers)
                if m_num:
                    hour = int(m_num.group(1))
                    minute = 0
                    raw_time_str = f"{hour:02d}:00"

    # Default hour based on the pair's prime session killzone if not provided
    is_time_detected = hour is not None
    if hour is None:
        hour = pair_meta["killzone_hours"][0]
        minute = 0
        raw_time_str = f"{hour:02d}:00 (Auto)"

    # Format time display
    time_display = f"{hour:02d}:{minute:02d} WIB"

    # Determine if in that market's Killzone
    is_in_killzone = hour in pair_meta["killzone_hours"]
    
    # Session determination
    session = pair_meta["session"]

    return {
        "raw_text": text_clean,
        "pair": pair_meta["code"],
        "pair_name": pair_meta["name"],
        "flag": pair_meta["flag"],
        "region": pair_meta["region"],
        "session": session,
        "direction": direction,
        "direction_assumed": direction_assumed,
        "hour": hour,
        "minute": minute,
        "time_display": time_display,
        "raw_time_str": raw_time_str,
        "is_time_detected": is_time_detected,
        "is_in_killzone": is_in_killzone,
        "pair_assumed": pair_assumed
    }

if __name__ == "__main__":
    test_cases = [
        "JP225 jam 7:30 BUY",
        "GER40 15:00 BUY",
        "XAUUSD 19:30 SELL",
        "NAS100 jam 20:30 BUY",
        "UK100 14:30 BUY",
        "HK50 09:30 BUY",
        "US30 20:00 BUY",
        "gold 18:00 sell"
    ]
    for tc in test_cases:
        p = parse_trading_prompt(tc)
        print(f"{p['flag']} {p['pair']} ({p['region']}) | {p['time_display']} | {p['direction']} | {p['session']}")
