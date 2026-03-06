'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ChevronLeft, ChevronRight, Volume2, VolumeX, Menu } from 'lucide-react';

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
      'Montgomery stands as a monument to memory and justice. The National Memorial for Peace and Justice honors over 800 victims of racial terror through 800+ steel monuments.',
    narration:
      'This ground remembers the voices of those silenced. The National Memorial becomes a place where history transforms into hope.',
    backgroundGradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    accentColor: '#e94560',
    yearRange: '1619-1865',
    historicalContext: 'The foundation of American slavery and its devastating impact on Montgomery and the nation.',
  },
  {
    id: 2,
    title: 'Freedom & Heritage',
    location: 'Freedom Monument Sculpture Park',
    description:
      'A soaring 43-foot National Monument to Freedom celebrates liberty and equality. The park features names from the 122,000 surnames of the 1870 census.',
    narration:
      'In this moment, we celebrate the names of those counted, recorded, and remembered. Freedom becomes more than liberty—it becomes legacy.',
    backgroundGradient: 'linear-gradient(45deg, #d4af37 0%, #ffd700 50%, #ffed4e 100%)',
    accentColor: '#ffd700',
    yearRange: '1865-1900',
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
    backgroundGradient: 'linear-gradient(120deg, #8b4513 0%, #a0522d 50%, #cd853f 100%)',
    accentColor: '#cd853f',
    yearRange: '1900-1950',
    historicalContext: 'Jim Crow laws, segregation, and the systematic oppression that defined the early 20th century.',
  },
  {
    id: 4,
    title: 'Rosa Parks & Resistance',
    location: 'Rosa Parks Statue & Court Square',
    description:
      'Rosa Parks' simple act of defiance—refusing to give up her seat—sparked a movement. Her statue and the Court Square arrest site remain symbols of courage.',
    narration:
      "Rosa Parks' quiet courage ignited a nation. In one moment, sitting down became standing up for humanity. Her legacy remains eternally powerful.",
    backgroundGradient: 'linear-gradient(210deg, #2c3e50 0%, #34495e 50%, #1a252f 100%)',
    accentColor: '#f39c12',
    yearRange: '1950-1956',
    historicalContext: 'The Montgomery Bus Boycott and the birth of the modern Civil Rights Movement.',
  },
  {
    id: 5,
    title: 'Civil Rights Memorial',
    location: 'Southern Poverty Law Center',
    description:
      'This powerful memorial honors heroes of the Civil Rights Movement. Water flows from a center fountain across names of martyrs—a symbol of justice and healing.',
    narration:
      'The names carved in stone remind us that freedom has a cost. Yet from these shadows emerges the light of human dignity and persistent hope.',
    backgroundGradient: 'linear-gradient(135deg, #0a4b7d 0%, #1a7a9f 50%, #2a9ac7 100%)',
    accentColor: '#3498db',
    yearRange: '1950-1968',
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
    backgroundGradient: 'linear-gradient(45deg, #134e5e 0%, #1f7972 50%, #2aa082 100%)',
    accentColor: '#1abc9c',
    yearRange: '1968-2000',
    historicalContext: 'Preservation of history and the ongoing journey toward equality and understanding.',
  },
  {
    id: 7,
    title: 'Legacy of Music',
    location: 'Hank Williams Memorial - Riverfront Park',
    description:
      "Hank Williams' memorial celebrates the musical soul of Montgomery. From blues roots to country legends, music has always told Montgomery's truth.",
    narration:
      'Montgomery: Where history shaped the future. From harmony to hope, from songs sung to stories retold—this city remains forever alive.',
    backgroundGradient: 'linear-gradient(210deg, #1f1f2e 0%, #3a3a4d 50%, #2a1a3f 100%)',
    accentColor: '#9b59b6',
    yearRange: '2000+',
    historicalContext: 'Modern Montgomery continues to grow as a beacon of civil rights education and cultural heritage.',
  },
];

interface CinematicStoryPlayerProps {
  isFullscreen?: boolean;
  onClose?: () => void;
}

const CinematicStoryPlayer: React.FC<CinematicStoryPlayerProps> = ({
  isFullscreen = false,
  onClose,
}) => {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  const scene = cinematicScenes[currentScene];

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      if (currentScene < cinematicScenes.length - 1) {
        setCurrentScene((prev) => prev + 1);
      } else {
        setIsPlaying(false); // Stop at the end
      }
    }, 12000); // Each scene plays for 12 seconds

    return () => clearTimeout(timer);
  }, [isPlaying, currentScene]);

  const handlePrevScene = () => {
    if (currentScene > 0) {
      setCurrentScene((prev) => prev - 1);
      setIsPlaying(false);
    }
  };

  const handleNextScene = () => {
    if (currentScene < cinematicScenes.length - 1) {
      setCurrentScene((prev) => prev + 1);
      setIsPlaying(false);
    }
  };

  const containerClass = isFullscreen ? 'fixed inset-0 z-50' : 'relative w-full rounded-3xl overflow-hidden';

  return (
    <div className={containerClass}>
      {/* Main Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScene}
          className="absolute inset-0"
          style={{ background: scene.backgroundGradient }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Cinematic lighting overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                `radial-gradient(circle at 50% 50%, ${scene.accentColor}22 0%, transparent 70%)`,
                `radial-gradient(circle at 60% 40%, ${scene.accentColor}33 0%, transparent 60%)`,
                `radial-gradient(circle at 40% 60%, ${scene.accentColor}22 0%, transparent 70%)`,
              ],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Parallax elements */}
          <motion.div
            className="absolute inset-0 opacity-30"
            animate={{ x: [0, 10, -10, 0], y: [0, 5, -5, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Content Layer */}
      <div className="relative z-10 h-full min-h-96 flex flex-col justify-between p-8 md:p-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-start"
        >
          <div>
            <motion.h1
              key={`title-${currentScene}`}
              className="text-5xl md:text-6xl font-bold text-white mb-2 drop-shadow-lg"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {scene.title}
            </motion.h1>
            <motion.p
              key={`location-${currentScene}`}
              className="text-xl md:text-2xl text-white/80 drop-shadow-md"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {scene.location}
            </motion.p>
            <motion.p
              className="text-sm md:text-base text-white/60 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {scene.yearRange}
            </motion.p>
          </div>

          {/* Controls */}
          <motion.div
            className="flex gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all backdrop-blur-md border border-white/20"
              title={soundEnabled ? 'Mute' : 'Unmute'}
            >
              {soundEnabled ? (
                <Volume2 size={20} className="text-white" />
              ) : (
                <VolumeX size={20} className="text-white" />
              )}
            </button>
            {isFullscreen && onClose && (
              <button
                onClick={onClose}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all backdrop-blur-md border border-white/20"
                title="Close"
              >
                <Menu size={20} className="text-white rotate-90" />
              </button>
            )}
          </motion.div>
        </motion.div>

        {/* Center Content */}
        <motion.div
          key={`content-${currentScene}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex-grow flex flex-col justify-center max-w-3xl"
        >
          <p className="text-lg md:text-xl text-white/90 mb-6 leading-relaxed drop-shadow-lg italic">
            "{scene.narration}"
          </p>
          <p className="text-base md:text-lg text-white/70 leading-relaxed">
            {scene.description}
          </p>
        </motion.div>

        {/* Footer Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-between items-center"
        >
          {/* Progress Indicators */}
          <div className="flex gap-2">
            {cinematicScenes.map((_, i) => (
              <motion.div
                key={i}
                className="h-1 rounded-full bg-white/30"
                animate={{
                  width: i === currentScene ? 32 : 16,
                  backgroundColor: i === currentScene ? scene.accentColor : 'rgba(255,255,255,0.3)',
                }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>

          {/* Playback Controls */}
          <div className="flex gap-3 items-center">
            <button
              onClick={handlePrevScene}
              disabled={currentScene === 0}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all backdrop-blur-md border border-white/20"
              title="Previous scene"
            >
              <ChevronLeft size={24} className="text-white" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all backdrop-blur-md border border-white/30"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause size={24} className="text-white" />
              ) : (
                <Play size={24} className="text-white" />
              )}
            </button>

            <button
              onClick={handleNextScene}
              disabled={currentScene === cinematicScenes.length - 1}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all backdrop-blur-md border border-white/20"
              title="Next scene"
            >
              <ChevronRight size={24} className="text-white" />
            </button>

            <span className="text-white/60 text-sm ml-4">
              {currentScene + 1} / {cinematicScenes.length}
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CinematicStoryPlayer;
