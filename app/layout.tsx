'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, Navigation, Briefcase, ShieldAlert, BookOpen, HeartPulse, HardHat, CalendarDays } from 'lucide-react';
import Link from 'next/link';
import CityNavMenu from '@/components/CityNavMenu';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <html lang="en" className="scroll-smooth dark">
      <head>
        <title>AI City Copilot | Montgomery ATLAS</title>
      </head>
      <body className={`${inter.className} bg-[#0a0a0b] text-zinc-100 antialiased selection:bg-indigo-500/30 selection:text-indigo-200 min-h-screen flex flex-col`}>
        {/* Navigation Toolbar */}
        <header className="sticky top-0 z-50 glass-panel border-b border-white/5">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <span className="text-2xl atlas-logo-pulse">⬡</span>
              <h1 className="font-bold text-xl tracking-tight text-white group-hover:text-indigo-400 transition-colors">
                Montgomery <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">ATLAS</span>
              </h1>
            </Link>

            {/* Desktop Quick Nav */}
            <nav className="hidden lg:flex items-center gap-2">
              <NavLink href="/transit">Transit Hub</NavLink>
              <NavLink href="/jobs">Job Board</NavLink>
              <NavLink href="/crime">Live Safety</NavLink>
            </nav>

            {/* Hamburger Menu Toggle - Desktop */}
            <div className="hidden lg:block">
              <CityNavMenu />
            </div>

            {/* Hamburger Menu Toggle - Mobile */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 ml-4 flex items-center justify-center cursor-pointer relative z-50"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </header>

        {/* Global Full-Page Menu Overlay */}
        <div className={`fixed inset-0 z-40 bg-black/95 backdrop-blur-3xl transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
          <div className="flex-1 overflow-y-auto max-w-4xl mx-auto w-full px-6 py-24">
            <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-8 border-b border-zinc-800 pb-4">Modules Network</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <MenuCard href="/transit" icon={<Navigation />} title="Montgomery Transit Hub" desc="Live bus, train, and taxi routing" onClick={() => setIsMenuOpen(false)} />
              <MenuCard href="/jobs" icon={<Briefcase />} title="Montgomery Job Board" desc="Local job listings & remote work" onClick={() => setIsMenuOpen(false)} />
              <MenuCard href="/crime" icon={<ShieldAlert />} title="Live Crime & Safety Reports" desc="Interactive safety dashboard" onClick={() => setIsMenuOpen(false)} />
              <MenuCard href="/history" icon={<BookOpen />} title="Historic Montgomery" desc="Landmarks, stories, and TTS tours" onClick={() => setIsMenuOpen(false)} />
              <MenuCard href="/health" icon={<HeartPulse />} title="Public Health" desc="Hospitals, clinics, and alerts" onClick={() => setIsMenuOpen(false)} />
              <MenuCard href="/recreation" icon={<CalendarDays />} title="Recreation & Culture" desc="Parks, museums, and events" onClick={() => setIsMenuOpen(false)} />
              <MenuCard href="/development" icon={<HardHat />} title="City Development & News" desc="Infrastructure and announcements" onClick={() => setIsMenuOpen(false)} />
            </div>
          </div>
        </div>

        <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 relative">
          {children}
        </main>

        <footer className="glass-panel text-zinc-500 py-8 text-center text-sm border-t border-white/5 mt-auto">
          <div className="max-w-[1400px] mx-auto px-4">
            <p>&copy; 2026 AI City Copilot — Montgomery Smart City Initiative</p>
            <p className="mt-2 text-xs opacity-60">Zero Tracking Policy. Secure endpoint integration compliant.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}

// Active nav link with red RGB glow on the active route
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={`text-sm font-medium px-4 py-2 rounded-lg border transition-all duration-300 ${
        isActive
          ? 'text-white border-red-500/60 bg-red-500/5'
          : 'text-zinc-400 border-transparent hover:text-white hover:bg-white/5'
      }`}
      style={isActive ? {
        boxShadow: '0 0 8px rgba(255, 0, 0, 0.6), 0 0 16px rgba(255, 0, 0, 0.4)',
      } : undefined}
    >
      {children}
    </Link>
  );
}

// Menu Card Component
function MenuCard({ href, icon, title, desc, onClick }: { href: string; icon: React.ReactNode; title: string; desc: string; onClick: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="rgb-hover-glow block group p-[1px] rounded-2xl">
      <div className="bg-[#111113]/90 rounded-2xl p-6 h-full border border-white/5 group-hover:border-white/10 transition-colors flex flex-col gap-4">
        <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-[0_0_15px_rgba(99,102,241,0)] group-hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-purple-400 transition-all">{title}</h3>
          <p className="text-sm text-zinc-400 mt-2 leading-relaxed">{desc}</p>
        </div>
      </div>
    </Link>
  );
}
