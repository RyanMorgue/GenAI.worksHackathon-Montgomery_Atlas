'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import BusinessDiscovery from '@/components/BusinessDiscovery';
import FinanceDashboard from '@/components/FinanceDashboard';
import MontgomeryScene from '@/components/MontgomeryScene';
import { Mic, Send } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { motion } from 'framer-motion';
import AtlasAvatar from '@/components/AtlasAvatar';

// Loading placeholder for 3D scene
const SceneLoading = () => (
  <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e] to-[#0a0a12]" />
);


export default function Home() {
  const [query, setQuery] = useState('');
  const [chatLog, setChatLog] = useState<{ role: 'user' | 'copilot', text: string }[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { transcript, listening, start, stop } = useSpeechRecognition();

  // hero background cycling
  const heroScenes = [
    { name: 'Peace Memorial', bg: 'radial-gradient(circle at center, #0f0f17 0%, #050510 100%)' },
    { name: 'Freedom Monument', bg: 'linear-gradient(135deg, #1a1a2e, #0f0f17)' },
    { name: 'Legacy Museum', bg: 'linear-gradient(45deg, #09091f, #050510)' },
    { name: 'Rosa Parks Statue', bg: 'radial-gradient(circle at 20% 20%, #111118, #07070d)' },
    { name: 'Civil Rights Memorial', bg: 'linear-gradient(120deg, #0a0a12, #050510)' },
    { name: 'Bicentennial Park', bg: 'radial-gradient(circle at 80% 80%, #12121b, #050510)' },
    { name: 'Hank Williams', bg: 'linear-gradient(210deg, #1b1b2a, #0a0a12)' },
  ];
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex(i => (i + 1) % heroScenes.length);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  // automatically scroll to bottom when a new message is added
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog]);


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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter submits unless Ctrl is held (new line)
    if (e.key === 'Enter' && !e.ctrlKey) {
      e.preventDefault();
      handleAsk();
    } else if (e.key === 'Enter' && e.ctrlKey) {
      // Insert newline at cursor position
      e.preventDefault();
      setQuery(prev => prev + '\n');
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">

      {/* AI Copilot Hero Section - Cinematic 3D + Riot Games Aesthetic */}
      <section id="copilot" className="rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden min-h-[600px] flex flex-col justify-end border border-white/10 glass-panel">
        
        {/* 3D Animated Background Layer */}
        <Suspense fallback={<SceneLoading />}>
          <div className="absolute inset-0 z-0 opacity-60">
            <MontgomeryScene />
          </div>
        </Suspense>

        {/* Rosa Parks — Cinematic Animated Character Hero
            Place image at /public/images/rosa-parks-hero.jpg to activate.
            Falls back gracefully (invisible layer) if image is absent. */}
        <div
          className="absolute inset-0 z-2 pointer-events-none bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/rosa-parks-hero.jpg')",
            backgroundPosition: 'center 20%',
            opacity: 0.28,
            animation: 'hero-breathe 7s ease-in-out infinite',
            filter: 'sepia(0.2) contrast(1.15) brightness(0.75)',
            willChange: 'transform',
          }}
        />
        {/* Cinematic portrait glow — red/amber halo behind the character */}
        <div
          className="absolute inset-0 z-3 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 55% 80% at 35% 50%, rgba(220,38,38,0.12) 0%, transparent 65%), radial-gradient(ellipse 40% 60% at 35% 60%, rgba(251,191,36,0.07) 0%, transparent 55%)',
            animation: 'hero-glow-pulse 5s ease-in-out infinite',
          }}
        />

        {/* Cinematic animated gradient overlay */}
        <motion.div
          className="absolute inset-0 z-5"
          animate={{ x: [-20, 20], y: [-10, 10] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          style={{
            background: heroScenes[heroIndex].bg,
            opacity: 0.3,
            mixBlendMode: 'screen'
          }}
        />
        {/* subtle dark overlay for contrast and depth lighting effect */}
        <motion.div
          className="absolute inset-0 z-10"
          initial={{ opacity: 0.6 }}
          animate={{ opacity: [0.5, 0.65, 0.5] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          style={{ background: 'radial-gradient(circle at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)' }}
        />
        
        {/* Depth lighting layers (Riot Games style) */}
        <motion.div
          className="absolute inset-0 z-8 pointer-events-none"
          animate={{ opacity: [0.1, 0.25, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-transparent to-violet-500/20" />
          <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-transparent to-blue-500/10" />
        </motion.div>

        {/* floating particles with improved layering */}
        <motion.div
          className="absolute inset-0 z-15 pointer-events-none"
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        >
          {[...Array(30)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute bg-white rounded-full blur-sm"
              style={{ 
                width: 1 + Math.random() * 2, 
                height: 1 + Math.random() * 2, 
                top: `${Math.random()*100}%`, 
                left: `${Math.random()*100}%`,
                boxShadow: `0 0 ${4 + Math.random() * 4}px rgba(255,255,255,0.4)`
              }}
              animate={{ y: [-30, 20], x: [0, Math.random() * 20 - 10], opacity: [0, 1, 0] }}
              transition={{ duration: 8 + Math.random()*12, repeat: Infinity, ease: 'easeInOut', delay: Math.random() * 2 }}
            />
          ))}
        </motion.div>
        
        {/* Gradient overlays for depth */}
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#0a0a0b] via-transparent to-transparent"></div>
        <div className="absolute inset-0 z-20 bg-gradient-to-r from-[#0a0a0b]/60 via-transparent to-transparent opacity-70"></div>

        {/* Content Layer */}
        <div className="relative z-30 max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <AtlasAvatar size={36} />
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-lg">
              Meet your City Copilot.
            </h2>
          </div>
          {/* landmark subtitle */}
          <div className="text-sm text-zinc-400 italic mb-4">
            {heroScenes[heroIndex].name}
          </div>
          <p className="text-zinc-300 text-lg md:text-xl mb-8 font-medium drop-shadow-md">
            Ask me anything about Montgomery. Try typing: <br />
            <button onClick={() => setQuery("Plan my perfect day in Montgomery")} className="inline-block mt-3 bg-white/5 hover:bg-white/10 transition-colors px-4 py-2 rounded-lg border border-white/10 italic font-mono text-sm rgb-hover-glow cursor-pointer text-indigo-200">
              &quot;Plan my perfect day in Montgomery&quot;
            </button>
          </p>

          {/* Cinematic Story Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mb-8"
          >
            <Link href="/history">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(217, 119, 6, 0.6)' }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-3 rounded-full font-bold text-white overflow-hidden button-glow"
              >
                {/* Animated gradient background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 rounded-full"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500/0 via-amber-300/50 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
                {/* Content */}
                <span className="relative z-10 flex items-center gap-2 text-lg drop-shadow-lg">
                  <motion.span
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    className="text-xl"
                  >
                    ▶
                  </motion.span>
                  Play Cinematic Storyline
                </span>
              </motion.button>
            </Link>
          </motion.div>

          {/* Chat History with better styling */}
          {chatLog.length > 0 && (
            <div className="mb-6 max-h-[200px] overflow-y-auto space-y-4 pr-4 custom-scrollbar">
              {chatLog.map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${log.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`px-4 py-3 rounded-2xl max-w-[80%] backdrop-blur-sm border ${
                      log.role === 'user'
                        ? 'bg-indigo-600/80 border-indigo-400/30 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]'
                        : 'bg-white/10 border-white/20 text-zinc-200 shadow-[0_0_10px_rgba(255,255,255,0.1)]'
                    }`}
                  >
                    {log.text.split('\n').map((line, j) => (
                      <p key={j} className="mb-1">
                        {line}
                      </p>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Interactive Input Layer with enhanced styling */}
          <div className="relative max-w-2xl group">
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="relative flex-1">
                <motion.div
                  className="absolute inset-0 rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: 'radial-gradient(circle at 50% 0%, rgba(99,102,241,0.3), transparent)',
                    filter: 'blur(8px)',
                  }}
                />
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask your civic assistant..."
                  className="relative w-full bg-white/5 border-2 border-white/15 hover:border-indigo-400/40 rounded-l-xl py-4 pl-6 pr-16 text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500/60 focus:bg-white/10 transition-all shadow-inner backdrop-blur-md resize-none"
                  rows={1}
                />
                <button
                  onClick={handleMicClick}
                  className={`absolute right-3 top-[10px] p-2 rounded-full transition-all ${
                    listening
                      ? 'bg-red-500/30 text-red-400 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                      : 'hover:bg-white/10 text-zinc-400 hover:text-white'
                  }`}
                  title="Voice Input"
                >
                  <Mic size={20} />
                </button>
              </div>

              <motion.button
                onClick={handleAsk}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white p-4 rounded-full transition-all shadow-[0_0_20px_rgba(79,70,229,0.5)] hover:shadow-[0_0_30px_rgba(79,70,229,0.8)] flex-shrink-0 border border-indigo-400/50 button-glow"
              >
                <Send size={24} />
              </motion.button>
            </motion.div>
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
