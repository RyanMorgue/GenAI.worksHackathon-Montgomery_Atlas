'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const CircleMarker = dynamic(() => import('react-leaflet').then(m => m.CircleMarker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(m => m.Popup), { ssr: false });

export interface ZoneOverlay {
  name: string;
  lat: number;
  lng: number;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  description?: string;
  isIncident?: boolean;
}

interface CityIntelligenceMapProps {
  height?: string;
  incidentZones?: ZoneOverlay[];
}

// Preset risk zones across Montgomery — static intelligence layer
const PRESET_ZONES: ZoneOverlay[] = [
  { name: 'Downtown Core', lat: 32.3792, lng: -86.3077, riskLevel: 'Moderate', description: 'High pedestrian density, active commercial district' },
  { name: 'Civil Rights District', lat: 32.3748, lng: -86.3012, riskLevel: 'Low', description: 'Well-monitored tourist zone, strong presence' },
  { name: 'Riverfront Park', lat: 32.3731, lng: -86.2981, riskLevel: 'Low', description: 'Public park, open spaces, family activity area' },
  { name: 'Dexter Avenue Corridor', lat: 32.3802, lng: -86.3011, riskLevel: 'Moderate', description: 'Historic commercial strip, elevated foot traffic' },
  { name: 'South Montgomery', lat: 32.3200, lng: -86.2900, riskLevel: 'High', description: 'Elevated incident reports, limited lighting' },
  { name: 'East Montgomery', lat: 32.3800, lng: -86.2500, riskLevel: 'Moderate', description: 'Mixed residential-commercial area' },
  { name: 'Old Cloverdale', lat: 32.3650, lng: -86.2900, riskLevel: 'Low', description: 'Historic residential neighborhood, low incident rate' },
  { name: 'Cramton Bowl Area', lat: 32.3640, lng: -86.3030, riskLevel: 'Low', description: 'Sports & entertainment venue, event-dependent risk' },
];

const RISK_COLORS: Record<string, string> = {
  Low: '#10b981',      // emerald
  Moderate: '#eab308', // yellow
  High: '#f97316',     // orange
  Critical: '#ef4444', // red
};

const RISK_RADIUS: Record<string, number> = {
  Low: 300,
  Moderate: 450,
  High: 600,
  Critical: 750,
};

export default function CityIntelligenceMap({ height = '480px', incidentZones }: CityIntelligenceMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div
        style={{ height }}
        className="w-full bg-[#0a0a12] animate-pulse rounded-2xl border border-white/10 flex items-center justify-center"
      >
        <div className="text-center">
          <div className="text-2xl mb-2">🗺️</div>
          <p className="text-zinc-500 text-sm">Initializing Intelligence Map...</p>
        </div>
      </div>
    );
  }

  // Merge: incident zones overlay preset zones (incident zones take priority)
  const incidentNames = new Set((incidentZones ?? []).map(z => z.name));
  const baseZones = PRESET_ZONES.filter(z => !incidentNames.has(z.name));
  const allZones: ZoneOverlay[] = [
    ...baseZones,
    ...(incidentZones ?? []).map(z => ({ ...z, isIncident: true })),
  ];

  return (
    <div
      style={{ height, position: 'relative' }}
      className="w-full rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.6)]"
    >
      {/* Map legend overlay */}
      <div className="absolute top-3 right-3 z-[1000] bg-black/70 backdrop-blur-sm border border-white/10 rounded-xl p-3 text-xs space-y-1.5">
        <p className="text-zinc-400 font-semibold mb-1.5 uppercase tracking-wider text-[10px]">Risk Level</p>
        {(['Low', 'Moderate', 'High', 'Critical'] as const).map(level => (
          <div key={level} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: RISK_COLORS[level], boxShadow: `0 0 6px ${RISK_COLORS[level]}80` }}
            />
            <span className="text-zinc-300">{level}</span>
          </div>
        ))}
        {incidentZones && incidentZones.length > 0 && (
          <div className="border-t border-white/10 pt-1.5 mt-1.5">
            <p className="text-orange-400 text-[10px] font-semibold">⚡ INCIDENT ACTIVE</p>
          </div>
        )}
      </div>

      <MapContainer
        center={[32.3792, -86.3077]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {allZones.map((zone, i) => {
          const color = RISK_COLORS[zone.riskLevel] ?? '#6366f1';
          const radius = RISK_RADIUS[zone.riskLevel] ?? 400;
          return (
            <CircleMarker
              key={`${zone.name}-${i}`}
              center={[zone.lat, zone.lng]}
              radius={zone.isIncident ? 18 : 14}
              pathOptions={{
                color,
                fillColor: color,
                fillOpacity: zone.isIncident ? 0.5 : 0.25,
                weight: zone.isIncident ? 3 : 1.5,
                dashArray: zone.isIncident ? undefined : '4 4',
              }}
            >
              <Popup>
                <div className="p-1 min-w-[160px]" style={{ background: '#0f0f17', color: '#fff', borderRadius: 8 }}>
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <p className="font-bold text-sm" style={{ color }}>{zone.riskLevel} Risk</p>
                  </div>
                  <p className="font-semibold text-white text-sm">{zone.name}</p>
                  {zone.description && (
                    <p className="text-xs mt-1" style={{ color: '#a1a1aa' }}>{zone.description}</p>
                  )}
                  {zone.isIncident && (
                    <p className="text-xs mt-1.5 font-semibold" style={{ color: '#f97316' }}>⚡ Active Incident Zone</p>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
