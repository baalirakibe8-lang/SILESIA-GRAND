
import React, { useState, useRef, useEffect } from 'react';
import { getConciergeResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

const AIConcierge: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Good evening. I am your Grand Silesian Guide. How may I assist you with your Katowice stay today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  const handleSend = async (customMessage?: string) => {
    const textToSend = customMessage || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    if (!customMessage) setInput('');
    setIsLoading(true);

    // Pass history (excluding current userMsg) to the service
    const responseText = await getConciergeResponse(textToSend, messages);
    setMessages(prev => [...prev, { role: 'model', text: responseText || "I'm sorry, I couldn't process that. Please try again." }]);
    setIsLoading(false);
  };

  useEffect(() => {
    const handleBookingRequest = (e: any) => {
      setIsOpen(true);
      if (e.detail && e.detail.message) {
        handleSend(e.detail.message);
      }
    };

    window.addEventListener('concierge-booking-request', handleBookingRequest);
    return () => window.removeEventListener('concierge-booking-request', handleBookingRequest);
  }, [messages, isLoading]);

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {isOpen ? (
        <div className="bg-white/95 backdrop-blur-xl w-[90vw] md:w-96 h-[600px] shadow-4xl border border-stone-200/50 flex flex-col overflow-hidden transition-all transform animate-in slide-in-from-bottom-8 duration-500 rounded-t-2xl">
          <div className="bg-stone-900 text-white p-6 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center font-serif text-sm italic">G</div>
              <div>
                <h3 className="font-serif italic leading-none">Grand Silesian Guide</h3>
                <span className="text-[8px] uppercase tracking-widest text-white/50">Online • AI Concierge</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-white/40 hover:text-white transition-colors"
              aria-label="Close Concierge"
            >✕</button>
          </div>
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-stone-50/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 text-[13px] leading-relaxed shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-amber-600 text-white rounded-2xl rounded-tr-none' 
                    : 'bg-white border border-stone-100 text-stone-700 rounded-2xl rounded-tl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/50 border border-stone-100 px-4 py-2 rounded-full text-[10px] italic text-stone-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce"></span>
                  The Guide is typing...
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-stone-100 bg-white flex gap-3">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about Nikiszowiec, dinner, or your stay..."
              className="flex-1 bg-stone-50 border border-stone-100 px-4 py-3 text-sm focus:outline-none focus:border-amber-500/50 rounded-lg transition-all"
              aria-label="Concierge Message Input"
            />
            <button 
              onClick={() => handleSend()}
              disabled={isLoading}
              className="bg-stone-900 text-white px-5 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-amber-600 transition-all disabled:opacity-50 rounded-lg shadow-lg active:scale-95"
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-stone-900 text-white w-16 h-16 rounded-full shadow-3xl flex items-center justify-center hover:bg-amber-600 transition-all hover:scale-110 active:scale-95 group relative"
          aria-label="Open AI Concierge"
        >
          <svg className="w-7 h-7 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full border-4 border-stone-50 animate-pulse"></span>
        </button>
      )}
    </div>
  );
};

export default AIConcierge;
