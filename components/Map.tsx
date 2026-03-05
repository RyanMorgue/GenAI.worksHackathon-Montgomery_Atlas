'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import react-leaflet components to prevent SSR 'window is not defined' errors
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

// We also need to dynamically import leaflet CSS in a useEffect, or global css.
// Leaflet CSS is handled typically via an import in the standard component tree, but Next.js
// might require standard import inside the dynamic block or _app.tsx

import 'leaflet/dist/leaflet.css'; // Usually fine here if client bounded

interface POI {
    id: string;
    name: string;
    type: string;
    lat: number;
    lng: number;
    priceRange?: string;
    openingStatus?: 'Open' | 'Closed' | 'Unknown';
    distance?: string;
}

interface MapProps {
    pois: POI[];
    centerLat?: number;
    centerLng?: number;
    zoom?: number;
}

export default function SmartCityMap({ pois, centerLat = 32.3792, centerLng = -86.3077, zoom = 14 }: MapProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        // Fix Leaflet's default icon path issues in React
        import('leaflet').then(L => {
            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: '/marker-icon-2x.png',
                iconUrl: '/marker-icon.png',
                shadowUrl: '/marker-shadow.png',
            });
        });
    }, []);

    if (!isMounted) return <div className="h-96 w-full bg-[#111113] animate-pulse rounded-2xl border border-white/5 flex items-center justify-center">Loading Map...</div>;

    return (
        <div style={{ height: '500px', width: '100%', borderRadius: '16px', overflow: 'hidden' }} className="shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-white/10 relative z-0">
            {/* The MapContainer component must be rendered client-side only */}
            <MapContainer
                center={[centerLat, centerLng]}
                zoom={zoom}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {pois.map(poi => (
                    <Marker key={poi.id} position={[poi.lat, poi.lng]}>
                        <Popup>
                            <div className="p-2 min-w-[150px] bg-[#111113] text-white">
                                <h3 className="font-bold text-lg text-indigo-400">{poi.name}</h3>
                                <p className="text-sm text-zinc-400 capitalize">{poi.type}</p>

                                <div className="mt-3 text-sm flex flex-col gap-2 text-zinc-300">
                                    {poi.distance && <span className="flex items-center gap-2">📍 {poi.distance} miles</span>}
                                    {poi.priceRange && <span className="flex items-center gap-2">💰 {poi.priceRange}</span>}
                                    {poi.openingStatus && (
                                        <span className={`font-bold px-2 py-1 rounded-md text-center max-w-fit ${poi.openingStatus === 'Open' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                            ⏱ {poi.openingStatus}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
