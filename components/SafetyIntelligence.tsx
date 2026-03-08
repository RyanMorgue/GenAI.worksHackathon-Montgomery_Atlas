'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, AlertTriangle, CheckCircle, XCircle, Search, Phone, MapPin } from 'lucide-react';

interface SafetyAnalysis {
  location: string;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  riskScore: number;
  factors: string[];
  recommendations: string[];
  emergencyServices: {
    hospital: { name: string; address: string; phone: string };
    police: { name: string; address: string; phone: string };
    fire: { name: string; address: string; phone: string };
  };
}

const RISK_CONFIG = {
  Low: {
    color: 'text-emerald-400',
    border: 'border-emerald-500/40',
    bg: 'bg-emerald-500/10',
    bar: 'bg-emerald-500',
    glow: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]',
    icon: CheckCircle,
    label: 'Low Risk',
  },
  Moderate: {
    color: 'text-yellow-400',
    border: 'border-yellow-500/40',
    bg: 'bg-yellow-500/10',
    bar: 'bg-yellow-500',
    glow: 'shadow-[0_0_20px_rgba(234,179,8,0.3)]',
    icon: AlertCircle,
    label: 'Moderate Risk',
  },
  High: {
    color: 'text-orange-400',
    border: 'border-orange-500/40',
    bg: 'bg-orange-500/10',
    bar: 'bg-orange-500',
    glow: 'shadow-[0_0_20px_rgba(249,115,22,0.3)]',
    icon: AlertTriangle,
    label: 'High Risk',
  },
  Critical: {
    color: 'text-red-400',
    border: 'border-red-500/40',
    bg: 'bg-red-500/10',
    bar: 'bg-red-500',
    glow: 'shadow-[0_0_20px_rgba(239,68,68,0.4)]',
    icon: XCircle,
    label: 'Critical Risk',
  },
};

const EXAMPLE_PROMPTS = [
  'Downtown Montgomery at night',
  'Riverfront Park alone at dusk',
  'Legacy Museum district on a weekday',
  'Parking garage near the Capitol',
];

export default function SafetyIntelligence() {
  const [location, setLocation] = useState('');
  const [analysis, setAnalysis] = useState<SafetyAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyze = async (loc?: string) => {
    const target = (loc ?? location).trim();
    if (!target) return;

    setLoading(true);
    setError('');
    setAnalysis(null);

    try {
      const res = await fetch('/api/safety', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location: target }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error ?? 'Analysis failed');
      setAnalysis(data as SafetyAnalysis);
      if (!loc) setLocation('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to analyze location');
    } finally {
      setLoading(false);
    }
  };

  const risk = analysis ? RISK_CONFIG[analysis.riskLevel] : null;
  const RiskIcon = risk?.icon;
  const showEmergency = analysis && (analysis.riskLevel === 'Moderate' || analysis.riskLevel === 'High' || analysis.riskLevel === 'Critical');

  return (
    <section className="glass-panel rounded-3xl p-6 md:p-8 border border-white/10 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/30 to-orange-500/30 border border-red-400/30 flex items-center justify-center">
          <AlertTriangle size={20} className="text-orange-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Safety Intelligence</h2>
          <p className="text-sm text-zinc-400">AI-powered location risk analysis for Montgomery, AL</p>
        </div>
      </div>

      {/* Input */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && analyze()}
            placeholder='Describe a location, e.g. "Downtown Montgomery at night"'
            className="flex-1 bg-white/5 border border-white/15 hover:border-white/25 rounded-xl px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500/50 transition-colors text-sm"
          />
          <motion.button
            onClick={() => analyze()}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={loading || !location.trim()}
            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-40 text-white px-5 py-3 rounded-xl font-medium transition-all flex items-center gap-2 text-sm"
          >
            <Search size={16} />
            {loading ? 'Analyzing...' : 'Analyze'}
          </motion.button>
        </div>

        {/* Example prompts */}
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_PROMPTS.map(ex => (
            <button
              key={ex}
              onClick={() => analyze(ex)}
              className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition-colors"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">{error}</p>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-3 animate-pulse">
          <div className="h-24 rounded-2xl bg-white/5" />
          <div className="h-32 rounded-2xl bg-white/5" />
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {analysis && risk && RiskIcon && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            {/* Risk Score Card */}
            <div className={`rounded-2xl border p-5 ${risk.border} ${risk.bg} ${risk.glow}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <RiskIcon size={20} className={risk.color} />
                  <span className={`font-bold text-lg ${risk.color}`}>{risk.label}</span>
                </div>
                <span className={`text-3xl font-black ${risk.color}`}>{analysis.riskScore}</span>
              </div>

              {/* Score bar */}
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${risk.bar}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${analysis.riskScore}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
              <div className="flex justify-between text-xs text-zinc-500 mt-1">
                <span>0 — Safe</span>
                <span>100 — Critical</span>
              </div>

              <p className="text-sm text-zinc-300 mt-3 italic">
                📍 {analysis.location}
              </p>
            </div>

            {/* Factors + Recommendations */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Detected Factors */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <AlertCircle size={14} className="text-orange-400" />
                  Detected Risk Factors
                </h3>
                <ul className="space-y-2">
                  {analysis.factors.map((f, i) => (
                    <li key={i} className="text-sm text-zinc-300 flex items-start gap-2">
                      <span className="text-orange-400 mt-0.5 flex-shrink-0">•</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <CheckCircle size={14} className="text-emerald-400" />
                  Safety Recommendations
                </h3>
                <ul className="space-y-2">
                  {analysis.recommendations.map((r, i) => (
                    <li key={i} className="text-sm text-zinc-300 flex items-start gap-2">
                      <span className="text-emerald-400 mt-0.5 flex-shrink-0">✓</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Emergency Response Routing — shown for Moderate risk and above */}
            {showEmergency && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4"
              >
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Phone size={14} className="text-red-400" />
                  Nearest Emergency Services
                </h3>
                <div className="grid gap-3">
                  {[
                    { label: '🏥 Hospital', service: analysis.emergencyServices.hospital },
                    { label: '🚔 Police', service: analysis.emergencyServices.police },
                    { label: '🚒 Fire Dept.', service: analysis.emergencyServices.fire },
                  ].map(({ label, service }) => (
                    <div key={label} className="flex items-start justify-between gap-4 bg-white/5 rounded-xl p-3">
                      <div>
                        <p className="text-xs font-semibold text-zinc-400 mb-0.5">{label}</p>
                        <p className="text-sm text-white font-medium">{service.name}</p>
                        <p className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
                          <MapPin size={10} />
                          {service.address}
                        </p>
                      </div>
                      <a
                        href={`tel:${service.phone.replace(/\D/g, '')}`}
                        className="text-sm text-indigo-400 hover:text-indigo-300 font-mono whitespace-nowrap mt-1 flex items-center gap-1"
                      >
                        <Phone size={12} />
                        {service.phone}
                      </a>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-red-400 mt-3 font-medium">⚠️ In an emergency, always call 911 first.</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
