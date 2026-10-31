import React, { useState, useEffect, useRef } from 'react';
import ChatHeader from './components/ChatHeader';
import ChatBubble from './components/ChatBubble';
import QuickSuggestions from './components/QuickSuggestions';
import InputBar from './components/InputBar';
import AnalyticsModal from './components/AnalyticsModal';
import { sendTradingPrompt } from './services/api';
import { Bell, CheckCircle2 } from 'lucide-react';
import './App.css';

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: 'bot',
    text: `Selamat datang di Zona Killzone ML Assistant (Bloomberg / TradingView Institutional Pro Edition).\n\nSistem telah dikalibrasi menggunakan dataset 'STRATEGI FINAL - KOMBINASI GABUNGAN' dengan target Risk-to-Reward 1:1.5.\n\nSesi Pasar & Jam Operasional (WIB):\n• 🇯🇵 Sesi Asia: Nikkei 225, Hang Seng, AUD (06:00 - 10:00 WIB)\n• 🇩🇪 Sesi Eropa: GER40, UK100 (14:00 - 16:00 WIB)\n• 🇺🇸 Sesi New York: NAS100, US30 (19:00 - 20:59 WIB)\n• 🪙 Komoditas Global: XAUUSD Gold (Asia, Eropa & NY)\n\nSilakan ketik setup Anda, contoh:\n• "JP225 jam 7:30 BUY"\n• "GER40 15:00 BUY"\n• "XAUUSD 19:30 SELL"\n• "NAS100 jam 20:30 BUY"`,
    timestamp: 'WIB Live',
    isNew: false
  }
];

export default function App() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [activeSession, setActiveSession] = useState('ALL');
  const [isTyping, setIsTyping] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleSendMessage = async (userText) => {
    const now = new Date();
    const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;

    // 1. Append User Message
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: userText,
      timestamp: currentTimeStr
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      // 2. Call FastAPI backend
      const prediction = await sendTradingPrompt(userText);

      // Realistic response delay for machine learning inference feel (360ms)
      setTimeout(() => {
        const botMsg = {
          id: Date.now() + 1,
          sender: 'bot',
          data: prediction,
          timestamp: currentTimeStr,
          isNew: true
        };
        setMessages((prev) => [...prev, botMsg]);
        setIsTyping(false);
      }, 360);

    } catch (err) {
      console.error("Error evaluating setup:", err);
      setTimeout(() => {
        const errorMsg = {
          id: Date.now() + 1,
          sender: 'bot',
          text: 'Maaf, terjadi kendala saat menghubungi server machine learning. Pastikan backend FastAPI sedang berjalan di port 8000.',
          timestamp: currentTimeStr,
          isNew: false
        };
        setMessages((prev) => [...prev, errorMsg]);
        setIsTyping(false);
      }, 250);
    }
  };

  const handleClearChat = () => {
    if (window.confirm("Hapus semua riwayat percakapan chat terminal?")) {
      setMessages(INITIAL_MESSAGES);
    }
  };

  return (
    <div className="fullscreen-viewport">
      <div className="fullscreen-app-container">
        {/* Top Header Bar + Bull vs Bear Visual Hero + Session Selector */}
        <ChatHeader 
          activeSession={activeSession}
          onSelectSession={setActiveSession}
          onOpenStats={() => setIsStatsModalOpen(true)}
          onClearChat={handleClearChat}
          messageCount={messages.length}
        />

        {/* Main Chat Feed Area */}
        <main className="fullscreen-chat-feed" id="chat-feed-container">
          <div className="chat-feed-inner">
            <div className="session-watermark">
              <span>QUANT TRADING PLATFORM • RR 1:1.5 STRATEGI FINAL</span>
            </div>

            {messages.map((msg) => (
              <ChatBubble 
                key={msg.id} 
                message={msg} 
                onTriggerAlert={triggerToast}
              />
            ))}

            {isTyping && (
              <div className="chat-row bot-row typing-row">
                <div className="typing-indicator-bubble-pro font-mono">
                  <div className="typing-dot green"></div>
                  <div className="typing-dot gold"></div>
                  <div className="typing-dot red"></div>
                  <span className="typing-label">Random Forest evaluating M5 Killzone breakout...</span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
        </main>

        {/* Bottom Area: Session Suggestions + Multi-Market Input Bar */}
        <footer className="fullscreen-chat-footer">
          <QuickSuggestions 
            activeSession={activeSession}
            onSelect={handleSendMessage} 
            disabled={isTyping} 
          />
          <InputBar 
            onSendMessage={handleSendMessage} 
            disabled={isTyping} 
          />
        </footer>

        {/* Toast Alert Notification */}
        {toastMessage && (
          <div className="terminal-toast-notification">
            <Bell size={15} className="text-gold animate-bounce" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Multi-Market Analytics Modal */}
        <AnalyticsModal 
          isOpen={isStatsModalOpen}
          onClose={() => setIsStatsModalOpen(false)}
        />
      </div>
    </div>
  );
}
