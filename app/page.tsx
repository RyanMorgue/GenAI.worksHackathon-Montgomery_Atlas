'use client';

import { useState, useEffect } from 'react';
import BusinessDiscovery from '@/components/BusinessDiscovery';
import FinanceDashboard from '@/components/FinanceDashboard';
import { Mic, Send, Bot } from 'lucide-react';
import Image from 'next/image';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

export default function Home() {
  const [query, setQuery] = useState('');
  const [chatLog, setChatLog] = useState<{ role: 'user' | 'copilot', text: string }[]>([]);
  const { transcript, listening, start, stop } = useSpeechRecognition();

  // Append transcript to query when speech recognition produces text
  useEffect(() => {
    if (transcript) {
      setQuery(prev => prev + ' ' + transcript);
    }
  }, [transcript]);

  const handleMicClick = () => {
    if (listening) {
      stop();
    } else {
      start();
    }
  };

  const handleAsk = async () => {
    if (!query.trim()) return;

    setChatLog(prev => [...prev, { role: 'user', text: query }]);
    const currentQuery = query;
    setQuery('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: currentQuery }),
      });
      const data = await response.json();
      if (data.type === 'itinerary') {
        setChatLog(prev => [...prev, { role: 'copilot', text: data.text }]);
        // TODO: Handle itinerary display on map
      } else {
        setChatLog(prev => [...prev, { role: 'copilot', text: data.text }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setChatLog(prev => [...prev, { role: 'copilot', text: 'Sorry, I encountered an error. Please try again.' }]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.ctrlKey) {
      handleAsk();
    } else if (e.key === 'Enter' && e.ctrlKey) {
      // Insert new line
      setQuery(prev => prev + '\n');
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">

      {/* AI Copilot Hero Section - Huly/Riot Games Aesthetic */}
      <section id="copilot" className="rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden min-h-[500px] flex flex-col justify-end border border-white/10 glass-panel">
        {/* Animated Background Layers */}
        <div className="absolute inset-0 z-0 bg-[#050510]"></div>
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen bg-center bg-cover animate-slow-pan" style={{ backgroundImage: "url('/bg-skyline.png')" }}></div>
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0a0a0b] via-transparent to-transparent"></div>
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#0a0a0b] via-transparent to-transparent opacity-80"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <Bot className="text-indigo-400 w-8 h-8 filter drop-shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-lg">
              Meet your City Copilot.
            </h2>
          </div>
          <p className="text-zinc-300 text-lg md:text-xl mb-8 font-medium drop-shadow-md">
            Ask me anything about Montgomery. Try typing: <br />
            <button onClick={() => setQuery("Plan my perfect day in Montgomery")} className="inline-block mt-3 bg-white/5 hover:bg-white/10 transition-colors px-4 py-2 rounded-lg border border-white/10 italic font-mono text-sm rgb-hover-glow cursor-pointer text-indigo-200">
              &quot;Plan my perfect day in Montgomery&quot;
            </button>
          </p>

          {/* Chat History */}
          {chatLog.length > 0 && (
            <div className="mb-6 max-h-[200px] overflow-y-auto space-y-4 pr-4 custom-scrollbar">
              {chatLog.map((log, i) => (
                <div key={i} className={`flex ${log.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`px-4 py-3 rounded-2xl max-w-[80%] ${log.role === 'user' ? 'bg-indigo-600/80 text-white' : 'glass-panel text-zinc-200'}`}>
                    {log.text.split('\n').map((line, j) => <p key={j} className="mb-1">{line}</p>)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Interactive Input Layer */}
          <div className="relative max-w-2xl group flex items-center gap-2">
            <div className="relative flex-1 rgb-hover-glow rounded-full">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask your civic assistant..."
                className="w-full bg-[#111113]/80 border border-white/10 rounded-l-xl py-4 pl-6 pr-16 text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500/50 transition-all shadow-inner backdrop-blur-md resize-none"
                rows={1}
              />
              <button
                onClick={handleMicClick}
                className={`absolute right-3 top-[10px] p-2 rounded-full transition-colors ${listening ? 'bg-red-500/20 text-red-400 animate-pulse' : 'hover:bg-white/10 text-zinc-400 hover:text-white'}`}
                title="Voice Input"
              >
                <Mic size={20} />
              </button>
            </div>

            <button onClick={handleAsk} className="rgb-hover-glow bg-indigo-600 hover:bg-indigo-500 text-white p-4 rounded-full transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.8)] flex-shrink-0">
              <Send size={24} />
            </button>
          </div>
        </div>
      </section>

      {/* Finance Directly Below Copilot */}
      <div id="finance" className="animate-in slide-in-from-bottom-8 duration-1000 delay-100">
        <FinanceDashboard />
      </div>

      {/* Primary Discovery Grid */}
      <div id="discovery" className="animate-in slide-in-from-bottom-8 duration-1000 delay-200">
        <BusinessDiscovery />
      </div>

    </div>
  );
}
