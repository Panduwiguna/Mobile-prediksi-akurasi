import React, { useEffect, useState } from 'react';
import { X, BarChart3, Info, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';
import { getBacktestStats } from '../services/api';

export default function AnalyticsModal({ isOpen, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      getBacktestStats()
        .then((res) => {
          setData(res);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const sessions = data?.sessions || {};

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet-fullscreen" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-row">
            <BarChart3 size={22} className="text-gold" />
            <div>
              <h2 className="modal-title">Matriks Multi-Market Backtest</h2>
              <p className="modal-subtitle">Dataset: STRATEGI FINAL - KOMBINASI GABUNGAN.csv • RR 1:1.5</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body-scroll">
          <div className="matrix-summary-banner">
            <div className="summary-pill">
              <span className="summary-num">{data?.total_records || 683}</span>
              <span className="summary-lbl">Total Backtest Trades</span>
            </div>
            <div className="summary-pill">
              <span className="summary-num text-gold">1 : 1.5</span>
              <span className="summary-lbl">Risk to Reward Target</span>
            </div>
            <div className="summary-pill">
              <span className="summary-num text-green">M5 Breakout</span>
              <span className="summary-lbl">Trigger Strategy</span>
            </div>
          </div>

          {/* Grouped by Session */}
          {Object.entries(sessions).map(([sessName, pairs]) => (
            <div key={sessName} className="session-stats-block">
              <div className="session-block-title">
                <Layers size={14} className="text-blue" />
                <span>{sessName}</span>
              </div>

              <div className="market-cards-grid">
                {pairs.map((p) => {
                  const isEmas = p.win_rate >= 55.0;
                  return (
                    <div key={p.pair} className={`market-stat-card ${isEmas ? 'stat-emas' : 'stat-merah'}`}>
                      <div className="stat-card-top">
                        <div className="stat-card-flag-pair">
                          <span className="flag-big">{p.flag}</span>
                          <div>
                            <span className="pair-bold">{p.pair}</span>
                            <span className="region-sub">{p.region}</span>
                          </div>
                        </div>
                        <span className={`badge-mini ${isEmas ? 'badge-mini-emas' : 'badge-mini-merah'}`}>
                          {p.win_rate}% WR
                        </span>
                      </div>

                      <div className="stat-card-details">
                        <div className="detail-item">
                          <span className="detail-lbl">Killzone</span>
                          <span className="detail-val font-mono">{p.killzone}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-lbl">Total Trades</span>
                          <span className="detail-val font-mono">{p.total_trades}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-lbl">TP (Wins)</span>
                          <span className="detail-val text-green font-mono">{p.wins}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Rules & Killzone Note */}
          <div className="killzone-insight-box">
            <div className="insight-title">
              <Info size={16} className="text-blue" />
              <span>Pedoman Trading Sesi & Jam Killzone</span>
            </div>
            <ul className="insight-list">
              <li><strong>🇯🇵 Sesi Asia (JP225, HK50, AUD):</strong> Prime window 07:00 - 09:59 WIB. Pembukaan kas Tokyo menghasilkan momentum arah yang kuat.</li>
              <li><strong>🇩🇪🇬🇧 Sesi Eropa (GER40, UK100):</strong> Prime window 14:00 - 16:30 WIB (London Cash Open). Momentum index Eropa sangat agresif.</li>
              <li><strong>🇺🇸 Sesi New York (NAS100, US30):</strong> Prime window 19:30 - 22:00 WIB (Wall Street Open). Pergerakan range harian terbesar.</li>
              <li><strong>🪙 Komoditas Global (XAUUSD Gold):</strong> Overlap sesi London & NY (14:00 - 22:30 WIB) dengan target RR 1:1.5 ketat.</li>
            </ul>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-modal-action" onClick={onClose}>
            Kembali ke Chat
          </button>
        </div>
      </div>
    </div>
  );
}
