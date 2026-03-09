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
  Shield,
  Activity,
  Radio,
  MessageSquare,
  LayoutDashboard,
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
    id: 'dashboard',
    label: 'ATLAS Command Center',
    href: '/dashboard',
    icon: <Shield size={24} />,
    color: 'from-indigo-500 to-violet-500',
    description: 'Live intelligence map, incident simulator & safety ops',
    accentGradient: 'bg-gradient-to-r from-indigo-500/20 to-violet-500/20',
  },
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
  {
    id: 'development',
    label: 'City Development & News',
    href: '/development',
    icon: <Newspaper size={24} />,
    color: 'from-blue-500 to-cyan-500',
    description: 'City news, development updates, and announcements',
    accentGradient: 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20',
  },
];

// ── Inline dashboard stats (demo data) ──────────────────────────────────────
const DASH_STATS = [
  { label: 'Zones Active',    value: '8',      icon: MapPin,         color: 'text-indigo-400' },
  { label: 'AI Engine',       value: 'Online', icon: Radio,          color: 'text-emerald-400' },
  { label: 'Alerts Today',    value: '5',      icon: Activity,       color: 'text-orange-400' },
  { label: 'Copilot',         value: 'Ready',  icon: MessageSquare,  color: 'text-violet-400' },
];

const DASH_ACTIONS = [
  { label: 'Copilot Chat',    href: '/#copilot',   icon: MessageSquare,   colorClass: 'from-indigo-500/20 to-violet-500/20', border: 'border-indigo-500/30' },
  { label: 'Safety Analysis', href: '/#safety',    icon: Shield,          colorClass: 'from-red-500/20 to-orange-500/20',   border: 'border-red-500/30'    },
  { label: 'Command Center',  href: '/dashboard',  icon: LayoutDashboard, colorClass: 'from-cyan-500/20 to-blue-500/20',    border: 'border-cyan-500/30'   },
  { label: 'Transit Hub',     href: '/transit',    icon: Navigation,      colorClass: 'from-blue-500/20 to-cyan-500/20',    border: 'border-blue-500/30'   },
  { label: 'Job Board',       href: '/jobs',       icon: Briefcase,       colorClass: 'from-emerald-500/20 to-teal-500/20', border: 'border-emerald-500/30'},
  { label: 'Live Safety',     href: '/crime',      icon: AlertCircle,     colorClass: 'from-rose-500/20 to-red-500/20',     border: 'border-rose-500/30'   },
];

const RECENT_ALERTS = [
  { time: '2 min ago',  text: 'Downtown Core: Elevated pedestrian density', level: 'Moderate' },
  { time: '14 min ago', text: 'South Montgomery: Incident dispatched',       level: 'High'     },
  { time: '41 min ago', text: 'Riverfront Park: Normal activity levels',     level: 'Low'      },
];

const ALERT_DOT: Record<string, string> = {
  Low: 'bg-emerald-500', Moderate: 'bg-yellow-500', High: 'bg-orange-500', Critical: 'bg-red-500',
};

interface CityNavMenuProps {
  isOpen?: boolean;
}

const CityNavMenu: React.FC<CityNavMenuProps> = ({ isOpen: controlledIsOpen }) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = controlledIsOpen !== undefined ? () => {} : setInternalIsOpen;
  const [menuTab, setMenuTab] = useState<'services' | 'dashboard'>('services');

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
            {/* Header with tab switcher */}
            <div className="p-4 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border-b border-white/10">
              <div className="flex bg-black/30 rounded-xl p-1 gap-1">
                <button
                  onClick={() => setMenuTab('services')}
                  className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${menuTab === 'services' ? 'bg-indigo-600/60 text-white' : 'text-zinc-400 hover:text-white'}`}
                >
                  <MapPin size={13} /> Services
                </button>
                <button
                  onClick={() => setMenuTab('dashboard')}
                  className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${menuTab === 'dashboard' ? 'bg-indigo-600/60 text-white' : 'text-zinc-400 hover:text-white'}`}
                >
                  <LayoutDashboard size={13} /> Dashboard
                </button>
              </div>
            </div>

            {/* SERVICES panel */}
            {menuTab === 'services' && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="p-3 space-y-2 max-h-[420px] overflow-y-auto"
              >
                {navItems.map((item) => (
                  <motion.div key={item.id} variants={itemVariants}>
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`group relative flex items-start gap-4 p-4 rounded-xl transition-all ${item.accentGradient} border border-white/5 hover:border-white/20 hover:bg-gradient-to-r hover:from-white/10 hover:to-white/5`}
                    >
                      <div className={`mt-1 p-3 rounded-lg bg-gradient-to-br ${item.color} shadow-lg group-hover:shadow-xl transition-all`}>
                        <div className="text-white">{item.icon}</div>
                      </div>
                      <div className="flex-1 mt-1">
                        <h3 className="font-bold text-white group-hover:text-indigo-200 transition-colors">{item.label}</h3>
                        <p className="text-xs text-zinc-400 mt-1">{item.description}</p>
                      </div>
                      <motion.div className="mt-1 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" animate={{ x: [0, 4, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                        <ChevronRight size={18} />
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* DASHBOARD panel */}
            {menuTab === 'dashboard' && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 space-y-4 max-h-[420px] overflow-y-auto"
              >
                {/* ATLAS Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <motion.div className="w-2 h-2 rounded-full bg-emerald-400" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">ATLAS Online</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono">{new Date().toLocaleTimeString()}</span>
                </div>

                {/* Stat grid */}
                <div className="grid grid-cols-2 gap-2">
                  {DASH_STATS.map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-3">
                      <Icon size={14} className={`${color} mb-1`} />
                      <p className="text-white font-bold text-sm">{value}</p>
                      <p className="text-zinc-500 text-[10px] uppercase tracking-wide">{label}</p>
                    </div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div>
                  <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">Quick Actions</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {DASH_ACTIONS.map(({ label, href, icon: Icon, colorClass, border }) => (
                      <Link
                        key={label}
                        href={href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-2 p-2.5 rounded-xl bg-gradient-to-br ${colorClass} border ${border} hover:brightness-110 transition-all`}
                      >
                        <Icon size={13} className="text-white flex-shrink-0" />
                        <span className="text-xs text-white font-medium truncate">{label}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Recent Alerts */}
                <div>
                  <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">Recent Alerts</p>
                  <div className="space-y-1.5">
                    {RECENT_ALERTS.map((a, i) => (
                      <div key={i} className="flex items-start gap-2 bg-white/5 rounded-lg p-2.5">
                        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1 ${ALERT_DOT[a.level] ?? 'bg-zinc-500'}`} />
                        <div className="min-w-0">
                          <p className="text-xs text-zinc-300 leading-snug">{a.text}</p>
                          <p className="text-[10px] text-zinc-600 mt-0.5">{a.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Full dashboard link */}
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600/40 to-violet-600/40 border border-indigo-500/30 text-indigo-300 hover:text-white hover:brightness-110 text-sm font-semibold transition-all"
                >
                  <LayoutDashboard size={14} /> Open Full Command Center
                </Link>
              </motion.div>
            )}

            {/* Footer */}
            <div className="p-3 bg-gradient-to-r from-black/20 to-white/5 border-t border-white/10">
              <p className="text-xs text-zinc-500 text-center">
                {menuTab === 'services' ? 'All services available 24/7' : 'ATLAS Intelligence Platform v2'}
              </p>
            </div>
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
