'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Navigation,
  Briefcase,
  AlertCircle,
  Info,
  Heart,
  Sparkles,
  Newspaper,
  MapPin,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  accentGradient: string;
}

const navItems: NavItem[] = [
  {
    id: 'transit',
    label: 'Montgomery Transit Hub',
    href: '/transit',
    icon: <Navigation size={24} />,
    color: 'from-blue-500 to-cyan-500',
    description: 'Real-time bus schedules and transit information',
    accentGradient: 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20',
  },
  {
    id: 'jobs',
    label: 'Montgomery Job Board',
    href: '/jobs',
    icon: <Briefcase size={24} />,
    color: 'from-emerald-500 to-teal-500',
    description: '5,000+ local job opportunities',
    accentGradient: 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20',
  },
  {
    id: 'crime',
    label: 'Live Crime & Safety',
    href: '/crime',
    icon: <AlertCircle size={24} />,
    color: 'from-red-500 to-orange-500',
    description: 'Real-time crime reports and safety insights',
    accentGradient: 'bg-gradient-to-r from-red-500/20 to-orange-500/20',
  },
  {
    id: 'history',
    label: 'Historic Montgomery',
    href: '/history',
    icon: <Info size={24} />,
    color: 'from-amber-500 to-yellow-500',
    description: 'Explore Montgomery\'s rich historical heritage',
    accentGradient: 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20',
  },
  {
    id: 'health',
    label: 'Public Health',
    href: '/health',
    icon: <Heart size={24} />,
    color: 'from-pink-500 to-rose-500',
    description: 'Health services and wellness programs',
    accentGradient: 'bg-gradient-to-r from-pink-500/20 to-rose-500/20',
  },
  {
    id: 'recreation',
    label: 'Recreation & Culture',
    href: '/recreation',
    icon: <Sparkles size={24} />,
    color: 'from-purple-500 to-violet-500',
    description: 'Parks, events, and cultural activities',
    accentGradient: 'bg-gradient-to-r from-purple-500/20 to-violet-500/20',
  },
];

interface CityNavMenuProps {
  isOpen?: boolean;
}

const CityNavMenu: React.FC<CityNavMenuProps> = ({ isOpen: controlledIsOpen }) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = controlledIsOpen !== undefined ? () => {} : setInternalIsOpen;

  const containerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="relative">
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="p-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)] border border-indigo-400/50"
        title="City Services"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <Menu size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-4 w-80 glass-panel rounded-2xl border border-white/20 shadow-2xl overflow-hidden z-40"
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="p-6 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border-b border-white/10"
            >
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <MapPin size={20} className="text-indigo-400" />
                Montgomery Services
              </h2>
              <p className="text-sm text-zinc-400 mt-1">Connect with city resources</p>
            </motion.div>

            {/* Menu Items */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="p-3 space-y-2"
            >
              {navItems.map((item) => (
                <motion.div key={item.id} variants={itemVariants}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`group relative flex items-start gap-4 p-4 rounded-xl transition-all ${item.accentGradient} border border-white/5 hover:border-white/20 hover:bg-gradient-to-r hover:from-white/10 hover:to-white/5`}
                  >
                    {/* Icon Container */}
                    <div
                      className={`mt-1 p-3 rounded-lg bg-gradient-to-br ${item.color} shadow-lg group-hover:shadow-xl transition-all`}
                    >
                      <div className="text-white">{item.icon}</div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 mt-1">
                      <h3 className="font-bold text-white group-hover:text-indigo-200 transition-colors">
                        {item.label}
                      </h3>
                      <p className="text-xs text-zinc-400 mt-1">{item.description}</p>
                    </div>

                    {/* Chevron */}
                    <motion.div
                      className="mt-1 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <ChevronRight size={18} />
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="p-4 bg-gradient-to-r from-black/20 to-white/5 border-t border-white/10"
            >
              <p className="text-xs text-zinc-500 text-center">
                All services available 24/7
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Overlay when menu is open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-30 md:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CityNavMenu;
