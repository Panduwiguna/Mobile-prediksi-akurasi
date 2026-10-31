import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Zap, ShieldAlert, Activity } from 'lucide-react';

export default function BullBearHero({ activeSession }) {
  // Session-reactive sentiment metrics
  const [metrics, setMetrics] = useState({
    bullPower: 64.2,
    bearPower: 35.8,
    bullVolume: '+18.4K',
    bearVolume: '-9.2K',
    sessionLeader: 'BULLS DOMINANT'
  });

  useEffect(() => {
    // Dynamic sentiment depending on selected session
    if (activeSession === 'ASIA') {
      setMetrics({
        bullPower: 68.5,
        bearPower: 31.5,
        bullVolume: '+22.1K',
        bearVolume: '-7.9K',
        sessionLeader: 'TOKYO CASH BID'
      });
    } else if (activeSession === 'EUROPE') {
      setMetrics({
        bullPower: 61.0,
        bearPower: 39.0,
        bullVolume: '+26.8K',
        bearVolume: '-14.3K',
        sessionLeader: 'DAX MOMENTUM'
      });
    } else if (activeSession === 'US') {
      setMetrics({
        bullPower: 65.4,
        bearPower: 34.6,
        bullVolume: '+48.5K',
        bearVolume: '-21.2K',
        sessionLeader: 'WALL ST LIQUIDITY'
      });
    } else if (activeSession === 'COMMODITY') {
      setMetrics({
        bullPower: 72.1,
        bearPower: 27.9,
        bullVolume: '+31.4K',
        bearVolume: '-8.6K',
        sessionLeader: 'GOLD BREAKOUT'
      });
    } else {
      setMetrics({
        bullPower: 64.2,
        bearPower: 35.8,
        bullVolume: '+18.4K',
        bearVolume: '-9.2K',
        sessionLeader: 'BULLS DOMINANT'
      });
    }
  }, [activeSession]);

  return (
    <div className="bull-bear-hero-container">
      {/* SISI KIRI: BULL (UPTREND - NEON EMERALD) */}
      <div className="hero-split-side bull-side">
        <div className="hero-ambient-glow bull-glow"></div>
        <div className="side-content">
          <div className="side-header">
            <div className="mascot-badge bull-mascot-badge">
              <span className="mascot-emoji">🐂</span>
              <div className="mascot-pulse-ring green-ring"></div>
            </div>
            <div className="side-title-group">
              <div className="side-tag text-green">
                <TrendingUp size={12} />
                <span>BULL ZONE</span>
              </div>
              <span className="side-main-val font-mono">{metrics.bullPower}%</span>
            </div>
          </div>

          {/* SVG Animated Candlestick Uptrend */}
          <div className="candlestick-chart-wrapper">
            <svg viewBox="0 0 100 36" className="candlestick-svg" preserveAspectRatio="none">
              <defs>
                <linearGradient id="bullGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#059669" stopOpacity="0.4" />
                </linearGradient>
              </defs>
              {/* Candlestick 1 */}
              <line x1="12" y1="20" x2="12" y2="34" stroke="#10b981" strokeWidth="1" />
              <rect x="8" y="23" width="8" height="8" rx="1" fill="url(#bullGrad)" />

              {/* Candlestick 2 */}
              <line x1="32" y1="14" x2="32" y2="30" stroke="#10b981" strokeWidth="1" />
              <rect x="28" y="18" width="8" height="9" rx="1" fill="url(#bullGrad)" />

              {/* Candlestick 3 (Consolidation pullback) */}
              <line x1="52" y1="16" x2="52" y2="28" stroke="#34d399" strokeWidth="1" />
              <rect x="48" y="19" width="8" height="6" rx="1" fill="#34d399" />

              {/* Candlestick 4 (Breakout Ignition) */}
              <line x1="72" y1="8" x2="72" y2="24" stroke="#10b981" strokeWidth="1" />
              <rect x="68" y="11" width="8" height="11" rx="1" fill="url(#bullGrad)" />

              {/* Candlestick 5 (Expansion High) */}
              <line x1="92" y1="2" x2="92" y2="18" stroke="#34d399" strokeWidth="1.2" />
              <rect x="88" y="5" width="8" height="12" rx="1" fill="#10b981" className="candle-pulse" />
            </svg>
          </div>

          <div className="side-footer">
            <div className="metric-pill pill-green">
              <Zap size={11} />
              <span className="font-mono">Vol {metrics.bullVolume}</span>
            </div>
            <span className="status-caption">Bullish Momentum</span>
          </div>
        </div>
      </div>

      {/* VS CENTER BADGE */}
      <div className="hero-vs-badge">
        <div className="vs-circle">
          <span>VS</span>
        </div>
        <div className="vs-status-ticker">
          <Activity size={10} className="text-gold" />
          <span>{metrics.sessionLeader}</span>
        </div>
      </div>

      {/* SISI KANAN: BEAR (DOWNTREND - CRIMSON RED) */}
      <div className="hero-split-side bear-side">
        <div className="hero-ambient-glow bear-glow"></div>
        <div className="side-content">
          <div className="side-header">
            <div className="side-title-group text-right">
              <div className="side-tag text-red justify-end">
                <span>BEAR ZONE</span>
                <TrendingDown size={12} />
              </div>
              <span className="side-main-val font-mono text-red">{metrics.bearPower}%</span>
            </div>
            <div className="mascot-badge bear-mascot-badge">
              <span className="mascot-emoji">🐻</span>
              <div className="mascot-pulse-ring red-ring"></div>
            </div>
          </div>

          {/* SVG Animated Candlestick Downtrend */}
          <div className="candlestick-chart-wrapper">
            <svg viewBox="0 0 100 36" className="candlestick-svg" preserveAspectRatio="none">
              <defs>
                <linearGradient id="bearGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#991b1b" stopOpacity="0.4" />
                </linearGradient>
              </defs>
              {/* Candlestick 1 */}
              <line x1="8" y1="4" x2="8" y2="20" stroke="#ef4444" strokeWidth="1" />
              <rect x="4" y="6" width="8" height="10" rx="1" fill="url(#bearGrad)" />

              {/* Candlestick 2 */}
              <line x1="28" y1="10" x2="28" y2="26" stroke="#ef4444" strokeWidth="1" />
              <rect x="24" y="13" width="8" height="9" rx="1" fill="url(#bearGrad)" />

              {/* Candlestick 3 (Small bounce) */}
              <line x1="48" y1="14" x2="48" y2="25" stroke="#f87171" strokeWidth="1" />
              <rect x="44" y="16" width="8" height="6" rx="1" fill="#f87171" />

              {/* Candlestick 4 (Dump continuation) */}
              <line x1="68" y1="18" x2="68" y2="32" stroke="#ef4444" strokeWidth="1" />
              <rect x="64" y="20" width="8" height="10" rx="1" fill="url(#bearGrad)" />

              {/* Candlestick 5 (Selling climax) */}
              <line x1="88" y1="22" x2="88" y2="35" stroke="#ef4444" strokeWidth="1.2" />
              <rect x="84" y="24" width="8" height="10" rx="1" fill="#ef4444" className="candle-pulse" />
            </svg>
          </div>

          <div className="side-footer justify-end">
            <span className="status-caption text-right">Bearish Pressure</span>
            <div className="metric-pill pill-red">
              <ShieldAlert size={11} />
              <span className="font-mono">Delta {metrics.bearVolume}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
