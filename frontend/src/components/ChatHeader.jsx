import React, { useState, useEffect } from 'react';
import { Activity, BarChart2, Trash2, ShieldCheck, Terminal, Radio } from 'lucide-react';
import BullBearHero from './BullBearHero';

export const SESSIONS_LIST = [
  { 
    id: 'ASIA', 
    flag: '🇯🇵', 
    name: 'Asia', 
    pairs: 'Nikkei / Hang Seng', 
    hoursDesc: '06:00 - 10:00 WIB',
    startHour: 6,
    endHour: 10
  },
  { 
    id: 'EUROPE', 
    flag: '🇩🇪', 
    name: 'Eropa', 
    pairs: 'GER40 / UK100', 
    hoursDesc: '14:00 - 16:00 WIB',
    startHour: 14,
    endHour: 16
  },
  { 
    id: 'US', 
    flag: '🇺🇸', 
    name: 'New York', 
    pairs: 'NAS100 / US30', 
    hoursDesc: '19:00 - 20:59 WIB',
    startHour: 19,
    endHour: 21
  },
  { 
    id: 'COMMODITY', 
    flag: '🪙', 
    name: 'Komoditas', 
    pairs: 'XAUUSD Gold', 
    hoursDesc: 'Asia, Eropa & NY',
    startHour: 6,
    endHour: 23
  },
];

export default function ChatHeader({ 
  activeSession, 
  onSelectSession, 
  onOpenStats, 
  onClearChat, 
  messageCount 
}) {
  const [currentWIBTime, setCurrentWIBTime] = useState('');
  const [currentHourWIB, setCurrentHourWIB] = useState(8);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const wibDate = new Date(utc + (3600000 * 7));
      
      const hours = wibDate.getHours();
      const minutes = wibDate.getMinutes();
      const seconds = wibDate.getSeconds();
      
      setCurrentHourWIB(hours);
      setCurrentWIBTime(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} WIB`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Helper to determine real-time session status
  const getSessionStatus = (sess) => {
    if (sess.id === 'COMMODITY') {
      const isLive = (currentHourWIB >= 6 && currentHourWIB <= 11) || 
                     (currentHourWIB >= 14 && currentHourWIB <= 17) || 
                     (currentHourWIB >= 19 && currentHourWIB <= 23);
      return isLive ? { text: 'OPEN', class: 'status-open' } : { text: 'CLOSED', class: 'status-closed' };
    }
    
    if (currentHourWIB >= sess.startHour && currentHourWIB < sess.endHour) {
      return { text: 'OPEN', class: 'status-open' };
    } else if (currentHourWIB === sess.startHour - 1) {
      return { text: 'PRE-MKT', class: 'status-premkt' };
    } else {
      return { text: 'CLOSED', class: 'status-closed' };
    }
  };

  return (
    <header className="chat-header-pro">
      {/* 1. TOP TERMINAL NAVIGATION BAR */}
      <div className="terminal-top-bar">
        <div className="terminal-branding">
          <div className="terminal-icon-box">
            <Terminal size={15} className="text-gold" />
          </div>
          <div className="terminal-titles">
            <div className="terminal-name-row">
              <span className="terminal-main-text">Zona Killzone ML Assistant</span>
              <span className="terminal-pill-bloomberg font-mono">BLOOMBERG/TV PRO</span>
            </div>
            <div className="terminal-clock-row">
              <span className="live-clock font-mono">
                <Radio size={11} className="clock-pulse-icon" />
                {currentWIBTime || 'Syncing WIB...'}
              </span>
              <span className="divider-dot">•</span>
              <span className="active-strategy font-mono">RR 1:1.5 STRATEGI FINAL</span>
            </div>
          </div>
        </div>

        <div className="terminal-actions">
          <button 
            className="pro-action-btn highlight-gold" 
            title="Matriks Backtest Institusi"
            onClick={onOpenStats}
          >
            <BarChart2 size={15} />
            <span className="btn-text-desktop">Analytics</span>
          </button>
          {messageCount > 1 && (
            <button 
              className="pro-action-btn danger-btn" 
              title="Reset Percakapan"
              onClick={onClearChat}
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>

      {/* 2. HERO SECTION: VISUAL BULL VS BEAR (SPLIT-SCREEN KIRI & KANAN) */}
      <BullBearHero activeSession={activeSession} />

      {/* 3. QUICK MARKET & SESSION SELECTOR (HORIZONTAL PILL SELECTOR) */}
      <div className="market-session-nav-strip">
        <div className="session-pill-scroll">
          {SESSIONS_LIST.map((sess) => {
            const isSelected = activeSession === sess.id;
            const status = getSessionStatus(sess);

            return (
              <button
                key={sess.id}
                className={`session-nav-card ${isSelected ? 'active-card' : ''}`}
                onClick={() => onSelectSession(sess.id)}
              >
                <div className="card-top-info">
                  <span className="card-flag">{sess.flag}</span>
                  <span className="card-sess-name">{sess.name}</span>
                  <span className={`status-badge-live font-mono ${status.class}`}>
                    ● {status.text}
                  </span>
                </div>
                <div className="card-sub-pairs font-mono">
                  {sess.pairs}
                </div>
                <div className="card-hours-sub">
                  {sess.hoursDesc}
                </div>
                {isSelected && <div className="card-active-glow-bar"></div>}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
