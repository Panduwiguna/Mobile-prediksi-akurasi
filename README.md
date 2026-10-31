# 📱 Zona Killzone ML Assistant (Multi-Market & Multi-Session Edition)

> **Assistant Trading Pribadi Berbasis Machine Learning (Random Forest)**  
> Didukung oleh Dataset Backtest Riil: **`STRATEGI FINAL - KOMBINASI GABUNGAN.csv`**  
> Target: **Risk-to-Reward (RR) 1:1.5** | UI: **Dark Modern Fullscreen Mobile & Desktop PWA**

---

## 🌟 Fitur Multi-Market & Multi-Session

### 1. Cakupan 3 Sesi Utama & Komoditas Global
- **🇯🇵 Sesi Asia (06:00 - 13:00 WIB)**:
  - `JP225` / Nikkei 225 (🇯🇵 Japan)
  - `HK50` / Hang Seng (🇭🇰 Hong Kong)
  - `AUD` / Sydney AUD pairs (🇦🇺 Australia)
- **🇩🇪🇬🇧 Sesi Eropa (14:00 - 18:00 WIB)**:
  - `GER40` / DAX 40 (🇩🇪 Germany / Europe)
  - `UK100` / FTSE 100 (🇬🇧 United Kingdom)
- **🇺🇸 Sesi New York (19:00 - 23:00 WIB)**:
  - `NAS100` / Nasdaq 100 (🇺🇸 USA)
  - `US30` / Dow Jones 30 (🇺🇸 USA)
- **🪙 Komoditas Global (14:00 - 23:00 WIB)**:
  - `XAUUSD` / Gold (🪙 Gold / Global Commodity)

---

## 💬 Format Balasan Chatbot (Card Estetik dengan Bendera Negara)

### 🟢 Contoh ZONA EMAS (High Probability Setup)
```text
🇯🇵 JP225 (Japan Nikkei 225) - Sesi Asia
🟢 ZONA EMAS (High Probability Setup)
-----------------------------------------
• Jam Entry: 07:30 WIB
• Arah: BUY
• Win Rate Historis (RR 1:1.5): 60.0%
• Risk Note: Disiplin SL di bawah M5 Swing Low. Target RR 1:1.5.
```

### 🔴 Contoh ZONA MERAH (Rawan Loss / Hindari!)
```text
🇩🇪 GER40 (Germany DAX 40) - Sesi Eropa
🔴 ZONA MERAH (Rawan Loss / Hindari!)
-----------------------------------------
• Jam Entry: 16:30 WIB
• Arah: SELL
• Risk Note: Historis di jam/arah ini rawan fakeout. Sebaiknya SKIP setup ini.
```

---

## 🚀 Cara Menjalankan

### Jalankan Backend (FastAPI + Random Forest)
- Double-click: `backend/run_backend.bat`
- URL: `http://127.0.0.1:8000` (Docs: `http://127.0.0.1:8000/docs`)

### Jalankan Frontend (Mobile PWA Fullscreen)
- Double-click: `frontend/run_frontend.bat`
- Komputer: `http://localhost:5173`
- HP Android (Wi-Fi sama): `http://192.168.100.11:5173`
