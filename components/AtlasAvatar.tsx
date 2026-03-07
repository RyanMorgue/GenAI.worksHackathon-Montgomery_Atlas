'use client';

import { motion } from 'framer-motion';

interface AtlasAvatarProps {
  size?: number;
}

/**
 * Montgomery ATLAS — holographic AI avatar
 * Red/black color palette with rotating rings, pulsing core, and scanning line.
 * Inspired by Riot Games UI systems.
 */
const AtlasAvatar = ({ size = 32 }: AtlasAvatarProps) => {
  const s = size;

  return (
    <div
      className="relative flex items-center justify-center shrink-0"
      style={{ width: s, height: s }}
    >
      {/* Outer dashed rotating ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: s,
          height: s,
          border: '1.5px dashed rgba(220,38,38,0.55)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
      />

      {/* Middle counter-rotating ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: s * 0.68,
          height: s * 0.68,
          border: '1px solid rgba(239,68,68,0.4)',
          borderStyle: 'dashed',
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'linear' }}
      />

      {/* Pulsing core ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: s * 0.44,
          height: s * 0.44,
          border: '1.5px solid rgba(220,38,38,0.85)',
          background: 'rgba(12,0,0,0.9)',
        }}
        animate={{
          boxShadow: [
            '0 0 4px rgba(220,38,38,0.3)',
            '0 0 14px rgba(220,38,38,0.75)',
            '0 0 4px rgba(220,38,38,0.3)',
          ],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Inner red fill glow */}
      <motion.div
        className="absolute rounded-full"
        style={{ width: s * 0.22, height: s * 0.22, background: 'rgba(220,38,38,0.25)' }}
        animate={{ opacity: [0.3, 0.9, 0.3], scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Center dot */}
      <div
        className="absolute rounded-full bg-red-500"
        style={{ width: s * 0.13, height: s * 0.13 }}
      />

      {/* Scanning line */}
      <motion.div
        className="absolute rounded-full"
        style={{ width: s * 0.38, height: 1, background: 'rgba(220,38,38,0.45)' }}
        animate={{ y: [-s * 0.2, s * 0.2], opacity: [0, 0.7, 0] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
};

export default AtlasAvatar;
