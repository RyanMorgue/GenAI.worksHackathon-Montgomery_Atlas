'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle, CheckCircle, AlertCircle, XCircle,
  Zap, Shield, Activity, Radio, Clock, MapPin,
  Send, Phone,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ZoneOverlay } from '@/components/CityIntelligenceMap';
import type { IncidentAnalysis } from '@/app/api/incident/route';

const CityIntelligenceMap = dynamic(() => import('@/components/CityIntelligenceMap'), { ssr: false });

// ─── Types ────────────────────────────────────────────────────────────────────
type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Critical';

interface Alert {
  id: string;
  time: string;
  zone: string;
  risk: RiskLevel;
  message: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const RISK_CONFIG: Record<RiskLevel, { color: string; border: string; bg: string; icon: LucideIcon; dot: string }> = {
  Low:      { color: 'text-emerald-400', border: 'border-emerald-500/40', bg: 'bg-emerald-500/10', icon: CheckCircle,  dot: 'bg-emerald-500' },
  Moderate: { color: 'text-yellow-400',  border: 'border-yellow-500/40',  bg: 'bg-yellow-500/10',  icon: AlertCircle,  dot: 'bg-yellow-500'  },
  High:     { color: 'text-orange-400',  border: 'border-orange-500/40',  bg: 'bg-orange-500/10',  icon: AlertTriangle, dot: 'bg-orange-500' },
  Critical: { color: 'text-red-400',     border: 'border-red-500/40',     bg: 'bg-red-500/10',     icon: XCircle,      dot: 'bg-red-500'    },
};

const ZONE_OVERVIEW: { name: string; risk: RiskLevel }[] = [
  { name: 'Downtown Core',         risk: 'Moderate' },
  { name: 'Civil Rights District', risk: 'Low'      },
  { name: 'Riverfront Park',       risk: 'Low'      },
  { name: 'Dexter Ave Corridor',   risk: 'Moderate' },
  { name: 'South Montgomery',      risk: 'High'     },
  { name: 'East Montgomery',       risk: 'Moderate' },
  { name: 'Old Cloverdale',        risk: 'Low'      },
  { name: 'Cramton Bowl Area',     risk: 'Low'      },
];

const STATIC_ALERTS: Alert[] = [
  { id: 'a1', time: '2 min ago',  zone: 'Downtown Core',         risk: 'Moderate', message: 'Elevated pedestrian density near Dexter Ave intersection.' },
  { id: 'a2', time: '14 min ago', zone: 'South Montgomery',      risk: 'High',     message: 'Incident reported — units dispatched to the area.' },
  { id: 'a3', time: '41 min ago', zone: 'Riverfront Park',       risk: 'Low',      message: 'Normal activity levels. Park fully operational.' },
  { id: 'a4', time: '1 hr ago',   zone: 'Civil Rights District', risk: 'Low',      message: 'Rosa Parks Museum operating at capacity — no concerns.' },
  { id: 'a5', time: '2 hr ago',   zone: 'East Montgomery',       risk: 'Moderate', message: 'Traffic incident on Atlanta Hwy — lanes partially blocked.' },
];

const SCENARIO_PRESETS = [
  'Large protest downtown',
  'Public concert at Riverfront at night',
  'Emergency evacuation scenario',
  'Severe weather — tornado watch',
  'Major vehicle accident on I-85',
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: LucideIcon; label: string; value: string; sub?: string; color: string;
}) {
  return (
    <div className="glass-panel border border-white/10 rounded-2xl p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-xs text-zinc-500 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-black text-white">{value}</p>
        {sub && <p className="text-xs text-zinc-400">{sub}</p>}
      </div>
    </div>
  );
}

function ZoneCard({ zone }: { zone: { name: string; risk: RiskLevel } }) {
  const cfg = RISK_CONFIG[zone.risk];
  const Icon = cfg.icon;
  return (
    <div className={`rounded-xl border p-3 flex items-center gap-2.5 ${cfg.border} ${cfg.bg}`}>
      <div className={`w-1.5 h-8 rounded-full flex-shrink-0 ${cfg.dot}`} />
      <div className="min-w-0">
        <p className="text-xs text-white font-medium truncate">{zone.name}</p>
        <p className={`text-xs ${cfg.color} flex items-center gap-1`}>
          <Icon size={10} />
          {zone.risk}
        </p>
      </div>
    </div>
  );
}

function AlertRow({ alert }: { alert: Alert }) {
  const cfg = RISK_CONFIG[alert.risk];
  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex gap-3 py-2.5 border-b border-white/5 last:border-0"
    >
      <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${cfg.dot}`} />
      <div className="min-w-0 flex-1">
        <p className="text-xs text-white leading-snug">{alert.message}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`text-[10px] font-semibold ${cfg.color}`}>{alert.risk}</span>
          <span className="text-[10px] text-zinc-600">·</span>
          <span className="text-[10px] text-zinc-500">{alert.zone}</span>
          <span className="text-[10px] text-zinc-600">·</span>
          <span className="text-[10px] text-zinc-500">{alert.time}</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [time, setTime] = useState('');
  const [scenario, setScenario] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IncidentAnalysis | null>(null);
  const [error, setError] = useState('');
  const [alerts, setAlerts] = useState<Alert[]>(STATIC_ALERTS);

  // Live clock
  useEffect(() => {
    const tick = () => setTime(new Date().toUTCString().slice(17, 25) + ' UTC');
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Overall threat from zone overview
  const overallThreat: RiskLevel =
    ZONE_OVERVIEW.some(z => z.risk === 'Critical') ? 'Critical' :
    ZONE_OVERVIEW.some(z => z.risk === 'High')     ? 'High'     :
    ZONE_OVERVIEW.some(z => z.risk === 'Moderate') ? 'Moderate' : 'Low';

  const threatCfg = RISK_CONFIG[overallThreat];
  const ThreatIcon = threatCfg.icon;

  // Incident zones for the map (from simulation result)
  const incidentZones: ZoneOverlay[] | undefined = result?.affectedZones?.map(z => ({
    name: z.name,
    lat: z.lat,
    lng: z.lng,
    riskLevel: z.riskLevel,
    description: `Active incident zone`,
    isIncident: true,
  }));

  const simulate = async (scenarioText?: string) => {
    const target = (scenarioText ?? scenario).trim();
    if (!target) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/incident', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario: target }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error ?? 'Simulation failed');
      setResult(data as IncidentAnalysis);

      // Inject a new alert for this simulation
      const newAlert: Alert = {
        id: `sim-${Date.now()}`,
        time: 'Just now',
        zone: data.affectedZones?.[0]?.name ?? 'Unknown Zone',
        risk: data.severityLevel,
        message: `⚡ SIMULATED: ${target.slice(0, 60)}`,
      };
      setAlerts(prev => [newAlert, ...prev.slice(0, 6)]);
      if (!scenarioText) setScenario('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Simulation failed');
    } finally {
      setLoading(false);
    }
  };

  const resCfg = result ? RISK_CONFIG[result.severityLevel] : null;
  const ResIcon = resCfg?.icon;

  return (
    <div className="space-y-6 animate-in fade-in duration-700">

      {/* ── Command Center Header ── */}
      <div className="glass-panel border border-white/10 rounded-2xl p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600/40 to-violet-600/40 border border-indigo-400/30 flex items-center justify-center">
              <Shield size={20} className="text-indigo-400" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase">
                ATLAS Command Center
              </h1>
              <p className="text-xs text-zinc-500">Montgomery, Alabama · City Intelligence Platform</p>
            </div>
          </div>

          {/* Status indicators */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-full">
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-emerald-400 font-semibold">ATLAS ONLINE</span>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${threatCfg.bg} ${threatCfg.border}`}>
              <ThreatIcon size={12} className={threatCfg.color} />
              <span className={`font-semibold ${threatCfg.color}`}>THREAT: {overallThreat.toUpperCase()}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-zinc-400">
              <Clock size={11} />
              <span className="font-mono">{time}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={MapPin}   label="Zones Monitored" value="8"       sub="Montgomery metro"     color="bg-indigo-600/40" />
        <StatCard icon={Activity} label="Current Threat"  value={overallThreat} sub="City-wide average" color={`${threatCfg.bg} border ${threatCfg.border}`} />
        <StatCard icon={Radio}    label="AI Engine"       value="Online"   sub="gemini-2.0-flash"    color="bg-violet-600/40" />
        <StatCard icon={Zap}      label="Alerts Today"   value={String(alerts.length)} sub="Last 24 hours" color="bg-orange-600/40" />
      </div>

      {/* ── Main Grid: Map + Right Panel ── */}
      <div className="grid md:grid-cols-[1fr_380px] gap-6">

        {/* Left: Map + Zone grid */}
        <div className="space-y-4">
          {/* Map header */}
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              Live City Intelligence Map
            </h2>
            <span className="text-xs text-zinc-500">
              {incidentZones ? `${incidentZones.length} incident zone${incidentZones.length !== 1 ? 's' : ''} active` : '8 zones monitored'}
            </span>
          </div>

          <CityIntelligenceMap height="400px" incidentZones={incidentZones} />

          {/* Zone Status Grid */}
          <div>
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Zone Status</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ZONE_OVERVIEW.map(z => (
                <ZoneCard key={z.name} zone={z} />
              ))}
            </div>
          </div>
        </div>

        {/* Right: Incident Simulator + Alert Feed */}
        <div className="space-y-4">

          {/* Incident Simulator */}
          <div className="glass-panel border border-white/10 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <Zap size={14} className="text-orange-400" />
              AI Incident Simulator
            </h2>
            <p className="text-xs text-zinc-500 mb-4">
              Simulate a scenario to see ATLAS analyze risk zones and response needs in real time.
            </p>

            {/* Presets */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {SCENARIO_PRESETS.map(preset => (
                <button
                  key={preset}
                  onClick={() => simulate(preset)}
                  disabled={loading}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition-colors disabled:opacity-40"
                >
                  {preset}
                </button>
              ))}
            </div>

            {/* Custom input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={scenario}
                onChange={e => setScenario(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && simulate()}
                placeholder='e.g. "Protest on Dexter Ave"'
                className="flex-1 bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
              />
              <motion.button
                onClick={() => simulate()}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                disabled={loading || !scenario.trim()}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 disabled:opacity-40 text-white px-3 py-2 rounded-xl transition-all"
              >
                <Send size={14} />
              </motion.button>
            </div>

            {error && (
              <p className="text-xs text-red-400 mt-2 bg-red-500/10 rounded-lg px-3 py-2 border border-red-500/20">{error}</p>
            )}

            {loading && (
              <div className="mt-3 space-y-2 animate-pulse">
                <div className="h-14 bg-white/5 rounded-xl" />
                <div className="h-10 bg-white/5 rounded-xl" />
              </div>
            )}

            {/* Simulation Result */}
            <AnimatePresence>
              {result && resCfg && ResIcon && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`mt-3 rounded-xl border p-4 space-y-3 ${resCfg.border} ${resCfg.bg}`}
                >
                  {/* Severity */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ResIcon size={16} className={resCfg.color} />
                      <span className={`font-bold text-sm ${resCfg.color}`}>{result.severityLevel} Severity</span>
                    </div>
                    <div className="text-right">
                      <span className={`text-2xl font-black ${resCfg.color}`}>{result.riskScore}</span>
                      <span className="text-xs text-zinc-500">/100</span>
                    </div>
                  </div>

                  {/* Score bar */}
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${resCfg.dot}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${result.riskScore}%` }}
                      transition={{ duration: 0.7 }}
                    />
                  </div>

                  {/* Duration + Resources */}
                  <div className="text-xs text-zinc-300">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Clock size={11} className="text-zinc-500" />
                      <span className="text-zinc-400">Est. duration:</span>
                      <span className="font-semibold">{result.estimatedDuration}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {result.resourcesNeeded.map(r => (
                        <span key={r} className="px-2 py-0.5 bg-white/10 rounded-full text-[10px] text-zinc-300">{r}</span>
                      ))}
                    </div>
                  </div>

                  {/* Immediate Risks */}
                  <div>
                    <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Immediate Risks</p>
                    <ul className="space-y-1">
                      {result.immediateRisks.map((r, i) => (
                        <li key={i} className="text-xs text-zinc-300 flex items-start gap-1.5">
                          <span className="text-orange-400 flex-shrink-0">•</span>{r}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Response Recommendations</p>
                    <ul className="space-y-1">
                      {result.recommendations.map((r, i) => (
                        <li key={i} className="text-xs text-zinc-300 flex items-start gap-1.5">
                          <span className="text-emerald-400 flex-shrink-0">✓</span>{r}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Affected zones summary */}
                  {result.affectedZones.length > 0 && (
                    <div>
                      <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                        Affected Zones — see map
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {result.affectedZones.map(z => {
                          const c = RISK_CONFIG[z.riskLevel];
                          return (
                            <span key={z.name} className={`text-[10px] px-2 py-0.5 rounded-full border ${c.border} ${c.color}`}>
                              {z.name}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Alert Feed */}
          <div className="glass-panel border border-white/10 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <Radio size={14} className="text-indigo-400" />
              Alert Feed
            </h2>
            <div className="space-y-0">
              {alerts.slice(0, 6).map(alert => (
                <AlertRow key={alert.id} alert={alert} />
              ))}
            </div>
          </div>

          {/* Emergency Quick-Access */}
          <div className="glass-panel border border-red-500/20 rounded-2xl p-5 bg-red-500/5">
            <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Phone size={14} className="text-red-400" />
              Emergency Services
            </h2>
            <div className="space-y-2 text-xs">
              {[
                { label: '🆘 Emergency', number: '911', color: 'text-red-400' },
                { label: '🚔 MPD Non-Emergency', number: '(334) 241-2651', color: 'text-orange-400' },
                { label: '🚒 Fire Non-Emergency', number: '(334) 241-2600', color: 'text-amber-400' },
                { label: '🏥 Baptist Medical', number: '(334) 288-2100', color: 'text-emerald-400' },
              ].map(({ label, number, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-zinc-400">{label}</span>
                  <a href={`tel:${number.replace(/\D/g, '')}`} className={`font-mono font-semibold ${color} hover:underline`}>{number}</a>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
