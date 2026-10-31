import React, { useState, useEffect } from 'react';
import { 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Cpu, 
  Sparkles, 
  Bell, 
  Clock, 
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ChatBubble({ message, onTriggerAlert }) {
  const [copied, setCopied] = useState(false);
  const [alertSet, setAlertSet] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const { data } = message;

  // Win rate value & Session invalidity
  const winRateVal = (data && typeof data.win_rate_val === 'number') ? data.win_rate_val : 50;
  const isInvalidSession = !!(data && data.is_invalid_session);

  // 3 STATUS ZONA CATEGORIES:
  // 1. Win Rate >= 60.0% -> ZONA EMAS (🟢 Neon Emerald)
  // 2. Win Rate 50.0% s/d 59.9% -> ZONA HATI-HATI (🟡 Amber / Yellow Glow)
  // 3. Win Rate < 50.0% -> ZONA MERAH (🔴 Crimson Danger)
  let zoneCategory = 'MERAH';
  if (winRateVal >= 60.0) {
    zoneCategory = 'EMAS';
  } else if (winRateVal >= 50.0) {
    zoneCategory = 'KUNING';
  } else {
    zoneCategory = 'MERAH';
  }

  const isEmas = zoneCategory === 'EMAS';
  const isKuning = zoneCategory === 'KUNING';
  const isMerah = zoneCategory === 'MERAH';

  useEffect(() => {
    if (message.sender === 'bot' && isEmas && message.isNew) {
      confetti({
        particleCount: 55,
        spread: 70,
        origin: { y: 0.82 },
        colors: ['#10b981', '#34d399', '#f59e0b', '#3b82f6', '#10b981']
      });
    }
  }, [message, isEmas]);

  if (message.sender === 'user') {
    return (
      <div className="chat-row user-row">
        <div className="user-bubble-pro">
          <div className="user-bubble-content">
            <span className="user-terminal-prefix font-mono">&gt;</span>
            <p className="user-text font-mono">{message.text}</p>
          </div>
          <span className="bubble-time font-mono">{message.timestamp}</span>
        </div>
      </div>
    );
  }

  // Informational / Welcome Card
  if (!data || !data.zone) {
    return (
      <div className="chat-row bot-row">
        <div className="bot-card-pro info-card-pro">
          <div className="pro-card-header">
            <div className="pro-header-left">
              <Sparkles size={16} className="text-gold" />
              <span className="pro-title-text">Trading Terminal Intelligence</span>
            </div>
            <span className="pro-tag-pill font-mono">ASSISTANT</span>
          </div>
          <div className="card-body-simple">
            <p>{message.text}</p>
          </div>
          <span className="bubble-time font-mono">{message.timestamp}</span>
        </div>
      </div>
    );
  }

  const copyToClipboard = () => {
    if (data.formatted_message) {
      navigator.clipboard.writeText(data.formatted_message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSetAlert = () => {
    setAlertSet(true);
    if (onTriggerAlert) {
      onTriggerAlert(`🔔 Alarm Trading Diaktifkan untuk setup ${data.pair} di ${data.time_display}!`);
    }
    setTimeout(() => setAlertSet(false), 3000);
  };

  // Dynamic Theme Mapping
  const cardBorderClass = isInvalidSession
    ? 'card-pro-invalid'
    : isEmas
    ? 'card-pro-emas'
    : isKuning
    ? 'card-pro-kuning'
    : 'card-pro-merah';

  const ringStrokeColor = isEmas ? '#10b981' : isKuning ? '#f59e0b' : '#ef4444';
  const ringMeterClass = isEmas ? 'ring-meter-emas' : isKuning ? 'ring-meter-kuning' : 'ring-meter-merah';

  const statusPillClass = isEmas ? 'pill-glow-green' : isKuning ? 'pill-glow-yellow' : 'pill-glow-red';
  const statusPillLabel = isEmas ? 'ZONE EMAS' : isKuning ? 'ZONE HATI-HATI' : 'ZONE MERAH';

  // SVG circular ring gauge parameters
  const ringRadius = 24;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const strokeDashoffset = ringCircumference - (Math.max(5, Math.min(100, winRateVal)) / 100) * ringCircumference;

  return (
    <div className="chat-row bot-row">
      <div className={`bot-card-pro ${cardBorderClass}`}>
        
        {/* PRO CARD TOP: INSTITUTIONAL BADGE & ACTIONS */}
        <div className="pro-card-header">
          <div className="pro-header-left">
            <span className="market-flag-pro">{data.flag || '🌐'}</span>
            <div className="market-title-cluster">
              <div className="market-name-row">
                <span className="market-code font-bold font-mono">{data.pair}</span>
                <span className="market-full-name">({data.pair_name || data.region})</span>
              </div>
              <span className="market-session-tag font-mono">{data.session}</span>
            </div>
          </div>

          <div className="pro-header-right">
            <button 
              className={`pro-mini-btn ${copied ? 'active-copy' : ''}`}
              onClick={copyToClipboard}
              title="Salin Setup"
            >
              {copied ? <Check size={13} className="text-green" /> : <Copy size={13} />}
              <span>{copied ? 'Tersalin' : 'Copy'}</span>
            </button>
            {!isInvalidSession && (
              <button 
                className={`pro-mini-btn ${alertSet ? 'active-alert' : ''}`}
                onClick={handleSetAlert}
                title="Pasang Alarm Entry"
              >
                <Bell size={13} className={alertSet ? 'text-gold' : ''} />
                <span>{alertSet ? 'Active' : 'Alert'}</span>
              </button>
            )}
          </div>
        </div>

        {/* PRO CARD BODY: SPLIT VIEW (CARD TEXT + RING WIN RATE GAUGE) */}
        <div className="pro-card-body-grid">
          {/* Sisi Kiri: Preformatted Text Output Box */}
          <div className="pro-preformatted-box">
            {isInvalidSession ? (
              <div className="raw-bubble-lines">
                <div className="line-sub-zone text-merah-bright font-bold">
                  🔴 ZONA MERAH (INVALID SESSION / DILUAR KILLZONE)
                </div>
                <div className="line-divider">-----------------------------------------</div>
                <div className="bullet-row">
                  <span className="bullet-label">• Pair:</span>
                  <span className="bullet-val font-mono font-bold">{data.pair}</span>
                </div>
                <div className="bullet-row">
                  <span className="bullet-label">• Jam Entry:</span>
                  <span className="bullet-val font-mono font-bold text-highlight">{data.time_display}</span>
                </div>
                <div className="bullet-row">
                  <span className="bullet-label">• Status:</span>
                  <span className="bullet-val text-merah-bright">{data.status_desc}</span>
                </div>
                <div className="bullet-row risk-row">
                  <span className="bullet-label">• Rekomendasi:</span>
                  <span className="bullet-val risk-text recom-merah font-bold">{data.risk_note}</span>
                </div>
              </div>
            ) : (
              <div className="raw-bubble-lines">
                <div className="line-header">
                  {data.flag} {data.pair} ({data.pair_name}) - {data.session}
                </div>
                <div className={`line-sub-zone font-bold ${isEmas ? 'text-emas-bright' : isKuning ? 'text-kuning-bright' : 'text-merah-bright'}`}>
                  {isEmas
                    ? '🟢 ZONA EMAS (High Probability Setup)'
                    : isKuning
                    ? '🟡 ZONA HATI-HATI (Medium Probability Setup)'
                    : '🔴 ZONA MERAH (Rawan Loss / Hindari!)'}
                </div>
                <div className="line-divider">-----------------------------------------</div>
                
                <div className="bullet-row">
                  <span className="bullet-label">• Jam Entry:</span>
                  <span className="bullet-val font-mono font-bold text-highlight">{data.time_display}</span>
                </div>
                
                <div className="bullet-row">
                  <span className="bullet-label">• Arah:</span>
                  <span className={`bullet-val direction-tag ${data.direction === 'BUY' ? 'tag-buy' : 'tag-sell'}`}>
                    {data.direction === 'BUY' ? <TrendingUp size={12} className="inline mr-1" /> : <TrendingDown size={12} className="inline mr-1" />}
                    {data.direction}
                  </span>
                </div>
                
                <div className="bullet-row">
                  <span className="bullet-label">• Win Rate Historis (RR 1:1.5):</span>
                  <span className={`bullet-val win-rate-pill font-mono ${isEmas ? 'pill-wr-emas' : isKuning ? 'pill-wr-kuning' : 'pill-wr-merah'}`}>
                    {data.win_rate}
                  </span>
                </div>
                
                <div className="bullet-row risk-row">
                  <span className="bullet-label">• Risk Note:</span>
                  <span className={`bullet-val risk-text ${isEmas ? 'recom-emas' : isKuning ? 'recom-kuning' : 'recom-merah'}`}>
                    {data.risk_note}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Sisi Kanan: Circular Win Rate Ring Gauge (Bloomberg/TradingView style) */}
          {!isInvalidSession && (
            <div className="pro-ring-gauge-wrapper">
              <div className="ring-container">
                <svg className="ring-svg" width="68" height="68">
                  {/* Background Track */}
                  <circle
                    className="ring-bg"
                    stroke="rgba(255, 255, 255, 0.08)"
                    strokeWidth="5"
                    fill="transparent"
                    r={ringRadius}
                    cx="34"
                    cy="34"
                  />
                  {/* Meter Fill with Dynamic 3-Zone Color */}
                  <circle
                    className={`ring-meter ${ringMeterClass}`}
                    stroke={ringStrokeColor}
                    strokeWidth="5"
                    strokeDasharray={ringCircumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    r={ringRadius}
                    cx="34"
                    cy="34"
                    transform="rotate(-90 34 34)"
                  />
                </svg>
                <div className="ring-inner-text">
                  <span className="ring-number font-mono">{data.win_rate}</span>
                  <span className="ring-caption font-mono">PROBA</span>
                </div>
              </div>
              <div className={`status-zone-pill font-mono ${statusPillClass}`}>
                {statusPillLabel}
              </div>
            </div>
          )}
        </div>

        {/* Toggleable ML Analytics Drawer */}
        {!isInvalidSession ? (
          <div className="ml-drawer-pro">
            <button 
              className="drawer-toggle-btn"
              onClick={() => setShowDetails(!showDetails)}
            >
              <div className="drawer-btn-left font-mono">
                <Cpu size={14} className="text-gold" />
                <span>Random Forest Quant Inference</span>
              </div>
              {showDetails ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>

            {showDetails && (
              <div className="drawer-content-pro">
                <div className="stat-grid-pro">
                  <div className="stat-box-pro">
                    <span className="stat-label-pro">ML Confidence</span>
                    <span className="stat-val-pro text-gold font-mono">{data.ml_confidence}</span>
                  </div>
                  <div className="stat-box-pro">
                    <span className="stat-label-pro">Backtest Records</span>
                    <span className="stat-val-pro font-mono">{data.total_backtest_samples} Trades</span>
                  </div>
                  <div className="stat-box-pro">
                    <span className="stat-label-pro">Target RR</span>
                    <span className="stat-val-pro font-mono text-green">1 : 1.5</span>
                  </div>
                  <div className="stat-box-pro">
                    <span className="stat-label-pro">Stop Loss M5 Swing</span>
                    <span className="stat-val-pro text-blue">{data.sl_swing || 'Swing Low/High M5'}</span>
                  </div>
                </div>

                {/* Linear 3-Zone Threshold Progress */}
                <div className="pro-progress-bar-container">
                  <div className="pro-bar-labels font-mono">
                    <span>Zones: &lt;50% Merah | 50-59% Kuning | ≥60% Emas</span>
                    <span>Score: {data.win_rate}</span>
                  </div>
                  <div className="pro-bar-track">
                    <div 
                      className={`pro-bar-fill ${isEmas ? 'fill-emas' : isKuning ? 'fill-kuning' : 'fill-merah'}`}
                      style={{ width: `${Math.min(100, Math.max(10, winRateVal))}%` }}
                    ></div>
                    {/* 50% Marker */}
                    <div className="pro-threshold-line line-50" style={{ left: '50%' }} title="50% Batas Kuning"></div>
                    {/* 60% Marker */}
                    <div className="pro-threshold-line line-60" style={{ left: '60%' }} title="60% Batas Emas"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="invalid-session-footer-note">
            <Clock size={14} className="text-merah-bright" />
            <span>Prediksi ML dilewati (Setup berada di luar jam operasional Killzone pasar)</span>
          </div>
        )}

        <div className="pro-card-footer">
          <span className="bubble-time font-mono">{message.timestamp}</span>
          <span className="footer-tag font-mono">
            {isInvalidSession ? 'SESSION FILTER ACTIVE' : 'QUANT ENGINE v2.1'}
          </span>
        </div>

      </div>
    </div>
  );
}
