'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ChevronLeft, ChevronRight, Volume2, VolumeX, X, Zap } from 'lucide-react';

interface CinematicScene {
  id: number;
  title: string;
  location: string;
  description: string;
  narration: string;
  backgroundGradient: string;
  accentColor: string;
  historicalContext: string;
  yearRange: string;
}

const cinematicScenes: CinematicScene[] = [
  {
    id: 1,
    title: 'Slavery Era',
    location: 'National Memorial for Peace and Justice',
    description:
      'Montgomery stands as a monument to memory and justice. The National Memorial for Peace and Justice honors over 800 victims of racial terror through 800 steel monuments.',
    narration:
      'This ground remembers the voices of those silenced. The National Memorial becomes a place where history transforms into hope.',
    backgroundGradient: 'linear-gradient(135deg, #0f0f1a 0%, #16213e 50%, #0f3460 100%)',
    accentColor: '#e94560',
    yearRange: '1619–1865',
    historicalContext: 'The foundation of American slavery and its devastating impact on Montgomery and the nation.',
  },
  {
    id: 2,
    title: 'Freedom & Heritage',
    location: 'Freedom Monument Sculpture Park',
    description:
      'A soaring 43-foot National Monument to Freedom celebrates liberty and equality. The park features names from the 122,000 surnames of the 1870 census.',
    narration:
      'In this moment, we celebrate the names of those counted, recorded, and remembered. Freedom becomes more than liberty — it becomes legacy.',
    backgroundGradient: 'linear-gradient(45deg, #1a1200 0%, #3d2e00 50%, #5c4500 100%)',
    accentColor: '#ffd700',
    yearRange: '1865–1900',
    historicalContext: 'Reconstruction and the fight for equal citizenship and voting rights for all Americans.',
  },
  {
    id: 3,
    title: 'Legacy of Stories',
    location: 'The Legacy Museum',
    description:
      'Immersive historical storytelling exploring slavery, segregation, and racial injustice. The museum stands as a testament to truth and reconciliation.',
    narration:
      'Through immersive environments and powerful testimonies, the Legacy Museum weaves stories of struggle and resilience into the fabric of our collective conscience.',
    backgroundGradient: 'linear-gradient(120deg, #1a0a00 0%, #2d1a0a 50%, #4a2c10 100%)',
    accentColor: '#cd853f',
    yearRange: '1900–1950',
    historicalContext: 'Jim Crow laws, segregation, and the systematic oppression that defined the early 20th century.',
  },
  {
    id: 4,
    title: 'Rosa Parks & Resistance',
    location: 'Rosa Parks Statue & Court Square',
    description:
      "Rosa Parks' simple act of defiance—refusing to give up her seat—sparked a movement. Her statue and the Court Square arrest site remain symbols of courage.",
    narration:
      "Rosa Parks' quiet courage ignited a nation. In one moment, sitting down became standing up for humanity. Her legacy remains eternally powerful.",
    backgroundGradient: 'linear-gradient(210deg, #0d1117 0%, #1c2433 50%, #1a252f 100%)',
    accentColor: '#f39c12',
    yearRange: '1950–1956',
    historicalContext: 'The Montgomery Bus Boycott and the birth of the modern Civil Rights Movement.',
  },
  {
    id: 5,
    title: 'Civil Rights Memorial',
    location: 'Southern Poverty Law Center',
    description:
      'This powerful memorial honors heroes of the Civil Rights Movement. Water flows from a center fountain across names of martyrs — a symbol of justice and healing.',
    narration:
      'The names carved in stone remind us that freedom has a cost. Yet from these shadows emerges the light of human dignity and persistent hope.',
    backgroundGradient: 'linear-gradient(135deg, #001428 0%, #002d5c 50%, #003f7f 100%)',
    accentColor: '#3498db',
    yearRange: '1950–1968',
    historicalContext: 'The peak of the Civil Rights Movement and the fight for equal rights and justice.',
  },
  {
    id: 6,
    title: 'Monuments & Memory',
    location: 'Alabama Bicentennial Park',
    description:
      '16 granite monuments and bronze reliefs celebrate pivotal moments in Alabama history, connecting past achievements to future possibilities.',
    narration:
      'Here, in stone and bronze, fifteen stories of Alabama converge. Each monument stands as a bridge between what was and what might be.',
    backgroundGradient: 'linear-gradient(45deg, #001a14 0%, #003326 50%, #004d38 100%)',
    accentColor: '#1abc9c',
    yearRange: '1968–2000',
    historicalContext: 'Preservation of history and the ongoing journey toward equality and understanding.',
  },
  {
    id: 7,
    title: 'Legacy of Music',
    location: 'Hank Williams Memorial — Riverfront Park',
    description:
      "Hank Williams' memorial celebrates the musical soul of Montgomery. From blues roots to country legends, music has always told Montgomery's truth.",
    narration:
      'Montgomery: Where history shaped the future. From harmony to hope, from songs sung to stories retold — this city remains forever alive.',
    backgroundGradient: 'linear-gradient(210deg, #0d0014 0%, #1a0028 50%, #26003d 100%)',
    accentColor: '#9b59b6',
    yearRange: '2000+',
    historicalContext: 'Modern Montgomery continues to grow as a beacon of civil rights education and cultural heritage.',
  },
];

interface CinematicStoryPlayerProps {
  isFullscreen?: boolean;
  onClose?: () => void;
}

// ─── Floating particle ────────────────────────────────────────────────────────
const Particle = ({ i }: { i: number }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{
      width: 1 + (i % 3),
      height: 1 + (i % 3),
      left: `${(i * 37 + 11) % 100}%`,
      top: `${(i * 53 + 7) % 100}%`,
      background: i % 4 === 0 ? '#6366f1' : i % 4 === 1 ? '#a78bfa' : i % 4 === 2 ? '#f59e0b' : '#38bdf8',
      boxShadow: '0 0 6px currentColor',
    }}
    animate={{ y: [-20, 20, -20], x: [0, i % 2 === 0 ? 10 : -10, 0], opacity: [0.2, 0.8, 0.2] }}
    transition={{ duration: 5 + (i % 7), repeat: Infinity, ease: 'easeInOut', delay: (i % 5) * 0.4 }}
  />
);

// ─── HUD corner bracket ───────────────────────────────────────────────────────
const HUDCorner = ({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) => {
  const posClass = { tl: 'top-4 left-4', tr: 'top-4 right-4', bl: 'bottom-4 left-4', br: 'bottom-4 right-4' }[pos];
  const rotate = { tl: '0deg', tr: '90deg', bl: '270deg', br: '180deg' }[pos];
  return (
    <div className={`absolute ${posClass} pointer-events-none`} style={{ transform: `rotate(${rotate})` }}>
      <div className="w-5 h-5 border-t-2 border-l-2 border-white/25" />
    </div>
  );
};

// ─── Scanline overlay ─────────────────────────────────────────────────────────
const ScanlineOverlay = () => (
  <div
    className="absolute inset-0 pointer-events-none z-20"
    style={{
      backgroundImage:
        'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px)',
    }}
  />
);

// ─── Glitch transition overlay ────────────────────────────────────────────────
const GlitchOverlay = ({ active }: { active: boolean }) => (
  <AnimatePresence>
    {active && (
      <motion.div
        className="absolute inset-0 z-40 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.4, 1, 0] }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.38, times: [0, 0.1, 0.3, 0.6, 1] }}
      >
        <div className="absolute inset-0 bg-indigo-500/20" style={{ transform: 'translateX(3px)' }} />
        <div className="absolute inset-0 bg-cyan-500/15" style={{ transform: 'translateX(-3px) translateY(2px)' }} />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(99,102,241,0.25) 3px, rgba(99,102,241,0.25) 4px)',
          }}
        />
      </motion.div>
    )}
  </AnimatePresence>
);

// ─── Pre-launch screen ────────────────────────────────────────────────────────
const PreLaunchScreen = ({ onLaunch }: { onLaunch: () => void }) => (
  <div
    className="relative w-full min-h-[480px] flex flex-col items-center justify-center overflow-hidden rounded-3xl"
    style={{ background: 'linear-gradient(135deg, #050510 0%, #0a0a1a 50%, #0f0f1f 100%)' }}
  >
    {/* Animated tech grid */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage:
          'linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}
    />
    {/* Particles */}
    <div className="absolute inset-0 overflow-hidden">
      {Array.from({ length: 24 }).map((_, i) => <Particle key={i} i={i} />)}
    </div>
    {/* Animated scan line */}
    <motion.div
      className="absolute left-0 right-0 h-px bg-indigo-400/30 pointer-events-none"
      animate={{ top: ['0%', '100%'] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
    />
    <HUDCorner pos="tl" /><HUDCorner pos="tr" /><HUDCorner pos="bl" /><HUDCorner pos="br" />

    <div className="relative z-10 flex flex-col items-center gap-6 px-8 text-center">
      <motion.div
        className="flex items-center gap-2 text-xs font-mono text-indigo-400 tracking-widest uppercase"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <motion.div
          className="w-2 h-2 rounded-full bg-indigo-400"
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        System Ready · 7 Chapters Loaded · AI Narration Active
      </motion.div>

      <motion.h2
        className="text-4xl md:text-5xl font-black text-white tracking-tight"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        MONTGOMERY
        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
          HISTORICAL ARCHIVE
        </span>
      </motion.h2>

      <motion.p
        className="text-zinc-400 text-sm max-w-md leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        A cinematic journey through 7 pivotal eras of Montgomery history — with AI narration, glitch transitions, and immersive scene design.
      </motion.p>

      {/* Launch button */}
      <motion.button
        onClick={onLaunch}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        className="relative group mt-2"
      >
        <motion.div
          className="absolute -inset-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)' }}
        />
        <motion.div
          className="absolute inset-0 rounded-full border border-indigo-500/40"
          animate={{ scale: [1, 1.7], opacity: [0.6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute inset-0 rounded-full border border-indigo-400/20"
          animate={{ scale: [1, 2.2], opacity: [0.4, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
        />
        <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center shadow-[0_0_40px_rgba(99,102,241,0.6)] border border-indigo-400/50">
          <Play size={32} className="text-white ml-1" />
        </div>
      </motion.button>

      <p className="text-zinc-600 text-xs font-mono tracking-[0.3em] uppercase">Press Play to Launch</p>
    </div>
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────
const CinematicStoryPlayer: React.FC<CinematicStoryPlayerProps> = ({
  isFullscreen = false,
  onClose,
}) => {
  const [isLaunched, setIsLaunched] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isGlitching, setIsGlitching] = useState(false);

  // Refs to avoid stale closures in async callbacks — synced via useEffect, not inline
  const isPlayingRef = useRef(false);
  const currentSceneRef = useRef(0);
  const soundEnabledRef = useRef(true);

  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  useEffect(() => { currentSceneRef.current = currentScene; }, [currentScene]);
  useEffect(() => { soundEnabledRef.current = soundEnabled; }, [soundEnabled]);

  const scene = cinematicScenes[currentScene];

  // ── Web Speech API narration ──────────────────────────────────────────────
  const speakScene = useCallback((idx: number) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (!soundEnabledRef.current) return;

    const utter = new SpeechSynthesisUtterance(cinematicScenes[idx].narration);
    utter.rate = 0.82;
    utter.pitch = 0.75;
    utter.volume = 1;

    utter.onend = () => {
      if (!isPlayingRef.current) return;
      const next = currentSceneRef.current + 1;
      if (next >= cinematicScenes.length) {
        setIsPlaying(false);
        return;
      }
      setTimeout(() => {
        setIsGlitching(true);
        setTimeout(() => {
          setIsGlitching(false);
          setCurrentScene(next);
        }, 380);
      }, 1800);
    };

    window.speechSynthesis.speak(utter);
  }, []);

  // Trigger narration on scene change while playing
  useEffect(() => {
    if (isLaunched && isPlaying) {
      speakScene(currentScene);
    }
  }, [currentScene, isPlaying, isLaunched, speakScene]);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => { window.speechSynthesis?.cancel(); };
  }, []);

  // ── Controls ──────────────────────────────────────────────────────────────
  const handleLaunch = () => {
    setIsLaunched(true);
    setCurrentScene(0);
    setIsPlaying(true);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      window.speechSynthesis?.cancel();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
    }
  };

  const glitchTo = (idx: number) => {
    window.speechSynthesis?.cancel();
    setIsGlitching(true);
    setTimeout(() => { setIsGlitching(false); setCurrentScene(idx); }, 320);
    setIsPlaying(false);
  };

  const handlePrev = () => glitchTo(Math.max(0, currentScene - 1));
  const handleNext = () => glitchTo(Math.min(cinematicScenes.length - 1, currentScene + 1));

  const handleSoundToggle = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (!next) {
      window.speechSynthesis?.cancel();
    } else if (isPlaying) {
      speakScene(currentScene);
    }
  };

  const containerClass = isFullscreen ? 'fixed inset-0 z-50' : 'relative w-full rounded-3xl overflow-hidden';
  const minH = isFullscreen ? '100vh' : '520px';

  // ── Pre-launch (non-fullscreen only) ──────────────────────────────────────
  if (!isLaunched && !isFullscreen) {
    return <PreLaunchScreen onLaunch={handleLaunch} />;
  }

  // ── Cinematic player ──────────────────────────────────────────────────────
  return (
    <div className={containerClass} style={{ minHeight: minH }}>

      {/* Scene background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${currentScene}`}
          className="absolute inset-0"
          style={{ background: scene.backgroundGradient }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Accent radial glow */}
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                `radial-gradient(ellipse at 30% 40%, ${scene.accentColor}18 0%, transparent 60%)`,
                `radial-gradient(ellipse at 70% 60%, ${scene.accentColor}28 0%, transparent 55%)`,
                `radial-gradient(ellipse at 30% 40%, ${scene.accentColor}18 0%, transparent 60%)`,
              ],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Particle field */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => <Particle key={i} i={i} />)}
          </div>
          {/* Tech grid */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
          {/* Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40" />
        </motion.div>
      </AnimatePresence>

      <ScanlineOverlay />
      <GlitchOverlay active={isGlitching} />

      {/* HUD corners */}
      <HUDCorner pos="tl" /><HUDCorner pos="tr" />
      <HUDCorner pos="bl" /><HUDCorner pos="br" />

      {/* Animated scan line */}
      <motion.div
        className="absolute left-0 right-0 h-px pointer-events-none z-10 opacity-25"
        style={{ background: scene.accentColor }}
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />

      {/* ── Content layer ────────────────────────────────────────────────── */}
      <div
        className="relative z-30 flex flex-col justify-between p-6 md:p-10"
        style={{ minHeight: minH }}
      >
        {/* Top: title + controls */}
        <div className="flex items-start justify-between gap-4">
          <motion.div
            key={`header-${currentScene}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <motion.div
                className="w-2 h-2 rounded-full"
                style={{ background: scene.accentColor }}
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-xs font-mono tracking-widest uppercase" style={{ color: scene.accentColor }}>
                {scene.yearRange}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white drop-shadow-lg leading-none">
              {scene.title}
            </h1>
            <p className="text-sm md:text-base mt-2 font-mono opacity-70" style={{ color: scene.accentColor }}>
              {scene.location}
            </p>
          </motion.div>

          <div className="flex gap-2 flex-shrink-0">
            <motion.button
              onClick={handleSoundToggle}
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              className="p-3 rounded-xl backdrop-blur-md border border-white/20 bg-white/5 hover:bg-white/15 transition-all"
              title={soundEnabled ? 'Mute narration' : 'Enable narration'}
            >
              {soundEnabled
                ? <Volume2 size={18} className="text-white" />
                : <VolumeX size={18} className="text-zinc-500" />}
            </motion.button>
            {isFullscreen && onClose && (
              <motion.button
                onClick={() => { window.speechSynthesis?.cancel(); onClose(); }}
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                className="p-3 rounded-xl backdrop-blur-md border border-white/20 bg-white/5 hover:bg-red-500/20 transition-all"
                title="Close"
              >
                <X size={18} className="text-white" />
              </motion.button>
            )}
          </div>
        </div>

        {/* Center: narration + description */}
        <motion.div
          key={`content-${currentScene}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="flex-grow flex flex-col justify-center max-w-3xl py-8"
        >
          {/* AI narration indicator */}
          <div className="flex items-center gap-2 mb-4">
            <Zap size={14} style={{ color: scene.accentColor }} />
            <span className="text-xs font-mono tracking-widest uppercase text-white/40">AI Narration</span>
            {isPlaying && (
              <div className="flex gap-1 ml-1 items-end h-4">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="w-[3px] rounded-full"
                    style={{ background: scene.accentColor }}
                    animate={{ height: [3, 14, 3] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
                  />
                ))}
              </div>
            )}
          </div>

          <p
            className="text-xl md:text-2xl text-white/90 mb-6 leading-relaxed italic font-light drop-shadow-lg border-l-4 pl-5"
            style={{ borderColor: scene.accentColor + '80' }}
          >
            &ldquo;{scene.narration}&rdquo;
          </p>
          <p className="text-sm md:text-base text-white/60 leading-relaxed max-w-2xl">
            {scene.description}
          </p>
          <p className="text-xs text-white/25 mt-5 font-mono">{scene.historicalContext}</p>
        </motion.div>

        {/* Bottom: progress + controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Clickable progress dots */}
          <div className="flex gap-2 items-center">
            {cinematicScenes.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => glitchTo(i)}
                animate={{
                  width: i === currentScene ? 28 : 8,
                  backgroundColor: i === currentScene ? scene.accentColor : 'rgba(255,255,255,0.2)',
                }}
                transition={{ duration: 0.3 }}
                className="h-2 rounded-full"
                title={`Scene ${i + 1}: ${cinematicScenes[i].title}`}
              />
            ))}
          </div>

          {/* Playback controls */}
          <div className="flex items-center gap-3">
            <motion.button
              onClick={handlePrev}
              disabled={currentScene === 0}
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              className="p-3 rounded-xl backdrop-blur-md border border-white/20 bg-white/5 hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={20} className="text-white" />
            </motion.button>

            <motion.button
              onClick={handlePlayPause}
              whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
              className="p-4 rounded-full backdrop-blur-md border transition-all"
              style={{
                background: isPlaying ? `${scene.accentColor}33` : 'rgba(255,255,255,0.12)',
                borderColor: isPlaying ? `${scene.accentColor}80` : 'rgba(255,255,255,0.25)',
                boxShadow: isPlaying ? `0 0 24px ${scene.accentColor}50` : 'none',
              }}
            >
              {isPlaying
                ? <Pause size={22} className="text-white" />
                : <Play size={22} className="text-white ml-0.5" />}
            </motion.button>

            <motion.button
              onClick={handleNext}
              disabled={currentScene === cinematicScenes.length - 1}
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              className="p-3 rounded-xl backdrop-blur-md border border-white/20 bg-white/5 hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={20} className="text-white" />
            </motion.button>

            <span className="text-white/35 text-xs font-mono ml-1">
              {String(currentScene + 1).padStart(2, '0')} / {String(cinematicScenes.length).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CinematicStoryPlayer;
