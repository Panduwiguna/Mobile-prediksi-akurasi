import React, { useState, useRef } from 'react';
import { Send, X, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const QUICK_PAIRS = [
  { code: 'JP225', flag: '🇯🇵', defaultHour: '07:30' },
  { code: 'GER40', flag: '🇩🇪', defaultHour: '15:00' },
  { code: 'NAS100', flag: '🇺🇸', defaultHour: '20:30' },
  { code: 'XAUUSD', flag: '🪙', defaultHour: '19:30' },
  { code: 'UK100', flag: '🇬🇧', defaultHour: '14:30' },
  { code: 'US30', flag: '🇺🇸', defaultHour: '20:00' },
];

export default function InputBar({ onSendMessage, disabled }) {
  const [inputText, setInputText] = useState('');
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || disabled) return;
    
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const appendPair = (pairItem) => {
    setInputText(`${pairItem.code} jam ${pairItem.defaultHour} BUY`);
    inputRef.current?.focus();
  };

  const toggleDirection = (dir) => {
    const current = inputText.trim();
    if (!current) {
      setInputText(`NAS100 jam 20:30 ${dir}`);
    } else if (!current.toUpperCase().includes('BUY') && !current.toUpperCase().includes('SELL')) {
      setInputText(`${current} ${dir}`);
    } else {
      const updated = current.replace(/\b(BUY|SELL)\b/gi, dir);
      setInputText(updated);
    }
    inputRef.current?.focus();
  };

  return (
    <div className="input-bar-container">
      {/* Quick Pair & Direction Helpers */}
      <div className="input-quick-helpers">
        <div className="pair-helpers-row">
          {QUICK_PAIRS.map((p) => (
            <button
              key={p.code}
              type="button"
              className="helper-badge helper-pair"
              onClick={() => appendPair(p)}
            >
              <span>{p.flag}</span>
              <span>{p.code}</span>
            </button>
          ))}
        </div>
        <div className="direction-helpers-row">
          <button 
            type="button" 
            className="helper-badge helper-buy"
            onClick={() => toggleDirection('BUY')}
          >
            <ArrowUpRight size={13} /> BUY
          </button>
          <button 
            type="button" 
            className="helper-badge helper-sell"
            onClick={() => toggleDirection('SELL')}
          >
            <ArrowDownRight size={13} /> SELL
          </button>
        </div>
      </div>

      <form className="input-bar-form" onSubmit={handleSubmit}>
        <div className="input-field-wrapper">
          <input
            ref={inputRef}
            type="text"
            className="chat-text-input"
            placeholder="Ketik setup, cth: JP225 jam 7:30 BUY atau GER40 15:00 BUY..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
          />
          {inputText && (
            <button
              type="button"
              className="clear-input-btn"
              onClick={() => {
                setInputText('');
                inputRef.current?.focus();
              }}
            >
              <X size={15} />
            </button>
          )}
        </div>

        <button
          type="submit"
          className={`send-button ${inputText.trim() ? 'active' : ''}`}
          disabled={!inputText.trim() || disabled}
          title="Kirim Setup"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
