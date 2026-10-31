import React from 'react';

const SUGGESTIONS_BY_SESSION = {
  ALL: [
    { label: '🇯🇵 JP225 07:30 BUY', tag: 'Tokyo Open 🟢', query: 'JP225 07:30 BUY' },
    { label: '🇩🇪 GER40 15:00 BUY', tag: 'London Open 🟢', query: 'GER40 15:00 BUY' },
    { label: '🇺🇸 NAS100 20:30 SELL', tag: 'NY Session', query: 'NAS100 20:30 SELL' },
    { label: '🪙 XAUUSD 19:30 BUY', tag: 'Gold Breakout 🟢', query: 'XAUUSD 19:30 BUY' },
    { label: '🇬🇧 UK100 14:30 BUY', tag: 'FTSE London', query: 'UK100 14:30 BUY' },
    { label: '🇺🇸 US30 20:00 BUY', tag: 'Dow Jones', query: 'US30 20:00 BUY' },
    { label: '🇭🇰 HK50 09:30 BUY', tag: 'Hong Kong Open', query: 'HK50 09:30 BUY' },
  ],
  ASIA: [
    { label: '🇯🇵 JP225 07:30 BUY', tag: 'Nikkei Cash Open 🟢', query: 'JP225 07:30 BUY' },
    { label: '🇭🇰 HK50 09:30 BUY', tag: 'Hang Seng Morning', query: 'HK50 09:30 BUY' },
    { label: '🇦🇺 AUD 07:15 BUY', tag: 'Sydney Breakout', query: 'AUD 07:15 BUY' },
    { label: '🇯🇵 JP225 09:00 SELL', tag: 'Nikkei Retrace 🔴', query: 'JP225 09:00 SELL' },
  ],
  EUROPE: [
    { label: '🇩🇪 GER40 15:00 BUY', tag: 'DAX Frankfurt 🟢', query: 'GER40 15:00 BUY' },
    { label: '🇬🇧 UK100 14:30 BUY', tag: 'FTSE 100 🟢', query: 'UK100 14:30 BUY' },
    { label: '🇩🇪 GER40 16:30 SELL', tag: 'DAX Fakeout 🔴', query: 'GER40 16:30 SELL' },
    { label: '🇬🇧 UK100 15:05 SELL', tag: 'FTSE London', query: 'UK100 15:05 SELL' },
  ],
  US: [
    { label: '🇺🇸 NAS100 20:30 BUY', tag: 'Nasdaq Trend 🟢', query: 'NAS100 20:30 BUY' },
    { label: '🇺🇸 NAS100 19:15 SELL', tag: 'NY Pre-Open', query: 'NAS100 19:15 SELL' },
    { label: '🇺🇸 US30 20:00 BUY', tag: 'Dow Jones 🟢', query: 'US30 20:00 BUY' },
    { label: '🇺🇸 US30 21:15 SELL', tag: 'DJIA Mid-Session', query: 'US30 21:15 SELL' },
  ],
  COMMODITY: [
    { label: '🪙 XAUUSD 19:30 BUY', tag: 'Gold NY Surge 🟢', query: 'XAUUSD 19:30 BUY' },
    { label: '🪙 XAUUSD 18:00 SELL', tag: 'London Fix Sweep', query: 'XAUUSD 18:00 SELL' },
    { label: '🪙 XAUUSD 14:15 BUY', tag: 'London Open Gold', query: 'XAUUSD 14:15 BUY' },
    { label: '🪙 XAUUSD 20:00 SELL', tag: 'NY Liquidity Grab', query: 'XAUUSD 20:00 SELL' },
  ]
};

export default function QuickSuggestions({ activeSession, onSelect, disabled }) {
  const chips = SUGGESTIONS_BY_SESSION[activeSession] || SUGGESTIONS_BY_SESSION.ALL;

  return (
    <div className="quick-suggestions-wrapper">
      <div className="quick-scroll-container">
        {chips.map((item, index) => (
          <button
            key={index}
            className="suggestion-chip"
            onClick={() => onSelect(item.query)}
            disabled={disabled}
          >
            <span className="chip-text">{item.label}</span>
            <span className="chip-tag">{item.tag}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
